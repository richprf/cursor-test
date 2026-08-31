/** One price observation. `t` is epoch milliseconds. */
export interface GoldPricePoint {
  t: number;
  price: number;
}

export interface GoldPriceTick extends GoldPricePoint {
  /** Previous price, so clients can animate and flash in the right direction. */
  previousPrice: number;
  /** Change against the oldest point still in the window, in percent. */
  changePercent: number;
  currency: 'IRT';
  unit: 'gram-18k';
}

/** Sent to a client right after it connects, so the chart has something to draw. */
export interface GoldPriceSnapshot {
  current: GoldPriceTick;
  history: GoldPricePoint[];
  /** Interval the server publishes at, in milliseconds. */
  intervalMs: number;
  /** `true` when the price is generated locally instead of coming from a feed. */
  simulated: boolean;
}

export const GOLD_PRICE_EVENTS = {
  snapshot: 'gold-price:snapshot',
  tick: 'gold-price:tick',
} as const;
