'use client';

import { useEffect, useState } from 'react';
import { io, type Socket } from 'socket.io-client';
import {
  GOLD_PRICE_EVENTS,
  appendTick,
  type GoldPriceSnapshot,
  type GoldPriceTick,
} from '@/lib/gold-price';

export type GoldPriceStatus = 'connecting' | 'live' | 'reconnecting' | 'offline';

export interface GoldPriceState extends GoldPriceSnapshot {
  status: GoldPriceStatus;
  /** Direction of the latest change, for the flash colour. */
  direction: 'up' | 'down' | 'flat';
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

    const socket: Socket = io(`${baseUrl}/gold-price`, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 8000,
      timeout: 6000,
    });

    socket.on('connect', () => setStatus('live'));
    socket.on('disconnect', () => setStatus('reconnecting'));
    socket.io.on('reconnect_attempt', () => setStatus('reconnecting'));
    socket.on('connect_error', () => {
      // First attempt failed → offline; a later failure means we are retrying.
      setStatus((current) => (current === 'connecting' ? 'offline' : 'reconnecting'));
    });

    socket.on(GOLD_PRICE_EVENTS.snapshot, (incoming: GoldPriceSnapshot) => {
      setSnapshot(incoming);
      setStatus('live');
    });

    socket.on(GOLD_PRICE_EVENTS.tick, (tick: GoldPriceTick) => {
      setSnapshot((current) => appendTick(current, tick));
      setStatus('live');
    });

    return () => {
      socket.removeAllListeners();
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
