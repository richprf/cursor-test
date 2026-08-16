'use client';

import {
  createContext,
  useCallback,
  useContext,
  useRef,
  type ReactNode,
} from 'react';
import { useGoldPriceSocket, type GoldPriceState } from '@/lib/use-gold-price-socket';
import type { GoldPricePoint, GoldPriceSnapshot } from '@/lib/gold-price';

const GoldPriceContext = createContext<GoldPriceState | null>(null);

type ChartListener = (history: GoldPricePoint[]) => void;
const GoldPriceChartFeedContext = createContext<((listener: ChartListener) => () => void) | null>(
  null,
);

/**
 * Holds the single WebSocket connection for the page, so the hero badge and the price
 * chart always show the same number instead of opening a socket each.
 */
export function GoldPriceProvider({
  initialSnapshot,
  children,
}: {
  initialSnapshot: GoldPriceSnapshot;
  children: ReactNode;
}) {
  const chartListeners = useRef(new Set<ChartListener>());
  const historyRef = useRef<GoldPricePoint[]>(initialSnapshot.history);

  const notifyChart = useCallback((history: GoldPricePoint[]) => {
    historyRef.current = history;
    chartListeners.current.forEach((listener) => listener(history));
  }, []);

  const state = useGoldPriceSocket(initialSnapshot, notifyChart);
  historyRef.current = state.history;

  const subscribeChart = useCallback((listener: ChartListener) => {
    chartListeners.current.add(listener);
    listener(historyRef.current);
    return () => chartListeners.current.delete(listener);
  }, []);

  return (
    <GoldPriceContext.Provider value={state}>
      <GoldPriceChartFeedContext.Provider value={subscribeChart}>
        {children}
      </GoldPriceChartFeedContext.Provider>
    </GoldPriceContext.Provider>
  );
}

export function useGoldPrice(): GoldPriceState {
  const state = useContext(GoldPriceContext);
  if (!state) {
    throw new Error('useGoldPrice must be used inside <GoldPriceProvider>');
  }
  return state;
}

/** Imperative chart feed — bypasses React re-renders for the canvas layer. */
export function useGoldPriceChartFeed() {
  const subscribe = useContext(GoldPriceChartFeedContext);
  if (!subscribe) {
    throw new Error('useGoldPriceChartFeed must be used inside <GoldPriceProvider>');
  }
  return subscribe;
}
