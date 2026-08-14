'use client';

import { useEffect, useState } from 'react';
import { io, type Socket } from 'socket.io-client';
import {
  GOLD_PRICE_EVENTS,
  appendTick,
  mergeSnapshot,
  type GoldPriceSnapshot,
  type GoldPriceTick,
} from '@/lib/gold-price';

export type GoldPriceStatus = 'connecting' | 'live' | 'reconnecting' | 'offline';

export interface GoldPriceState extends GoldPriceSnapshot {
  status: GoldPriceStatus;
  /** Direction of the latest change, for the flash colour. */
  direction: 'up' | 'down' | 'flat';
}

function normalizeWsBaseUrl(url: string): string {
  return url.replace(/\/+$/, '');
}

/**
 * Subscribes to the NestJS `/gold-price` namespace and keeps the latest price plus a
 * fixed-length history in state. socket.io reconnects on its own; the status here
 * reflects what it is doing so the UI can say so. The socket is closed on unmount.
 *
 * `initialSnapshot` comes from the server render, so the first paint already shows a
 * real price instead of a placeholder.
 */
export function useGoldPriceSocket(initialSnapshot: GoldPriceSnapshot): GoldPriceState {
  const [snapshot, setSnapshot] = useState(initialSnapshot);
  const [status, setStatus] = useState<GoldPriceStatus>('connecting');

  useEffect(() => {
    const baseUrl = process.env.NEXT_PUBLIC_WS_URL;

    if (!baseUrl) {
      // Nothing to connect to: keep showing the server-rendered price.
      setStatus('offline');
      return;
    }

    let active = true;

    const socket: Socket = io(`${normalizeWsBaseUrl(baseUrl)}/gold-price`, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 8000,
      timeout: 6000,
      // Fresh manager per mount so React Strict Mode remounts do not reuse a stale socket.
      forceNew: true,
    });

    const setStatusSafe = (next: GoldPriceStatus) => {
      if (active) setStatus(next);
    };

    const setSnapshotSafe = (updater: (current: GoldPriceSnapshot) => GoldPriceSnapshot) => {
      if (active) setSnapshot(updater);
    };

    const onConnect = () => setStatusSafe('live');

    const onDisconnect = (reason: Socket.DisconnectReason) => {
      // Server or client intentionally closed the socket — socket.io will not retry.
      if (reason === 'io server disconnect' || reason === 'io client disconnect') {
        setStatusSafe('offline');
        return;
      }
      setStatusSafe('reconnecting');
    };

    const onReconnectAttempt = () => setStatusSafe('reconnecting');

    const onReconnect = () => setStatusSafe('live');

    const onReconnectFailed = () => setStatusSafe('offline');

    const onConnectError = () => {
      if (!active) return;
      setStatus((current) => (current === 'connecting' ? 'offline' : 'reconnecting'));
    };

    const onSnapshot = (incoming: GoldPriceSnapshot) => {
      if (!active) return;
      setSnapshot((current) => mergeSnapshot(current, incoming));
      setStatus('live');
    };

    const onTick = (tick: GoldPriceTick) => {
      setSnapshotSafe((current) => appendTick(current, tick));
      setStatusSafe('live');
    };

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('connect_error', onConnectError);
    socket.on(GOLD_PRICE_EVENTS.snapshot, onSnapshot);
    socket.on(GOLD_PRICE_EVENTS.tick, onTick);

    socket.io.on('reconnect_attempt', onReconnectAttempt);
    socket.io.on('reconnect', onReconnect);
    socket.io.on('reconnect_failed', onReconnectFailed);

    return () => {
      active = false;

      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('connect_error', onConnectError);
      socket.off(GOLD_PRICE_EVENTS.snapshot, onSnapshot);
      socket.off(GOLD_PRICE_EVENTS.tick, onTick);

      socket.io.off('reconnect_attempt', onReconnectAttempt);
      socket.io.off('reconnect', onReconnect);
      socket.io.off('reconnect_failed', onReconnectFailed);

      // Stop any in-flight reconnect loop before tearing down the socket.
      socket.io.reconnection(false);
      socket.disconnect();
    };
  }, []);

  const { price, previousPrice } = snapshot.current;

  return {
    ...snapshot,
    status,
    direction: price > previousPrice ? 'up' : price < previousPrice ? 'down' : 'flat',
  };
}
