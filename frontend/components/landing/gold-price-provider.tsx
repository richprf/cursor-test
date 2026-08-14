'use client';

import { createContext, useContext, type ReactNode } from 'react';
import { useGoldPriceSocket, type GoldPriceState } from '@/lib/use-gold-price-socket';
import type { GoldPriceSnapshot } from '@/lib/gold-price';

const GoldPriceContext = createContext<GoldPriceState | null>(null);

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
  const state = useGoldPriceSocket(initialSnapshot);

  return <GoldPriceContext.Provider value={state}>{children}</GoldPriceContext.Provider>;
}

export function useGoldPrice(): GoldPriceState {
  const state = useContext(GoldPriceContext);
  if (!state) {
    throw new Error('useGoldPrice must be used inside <GoldPriceProvider>');
  }
  return state;
}
