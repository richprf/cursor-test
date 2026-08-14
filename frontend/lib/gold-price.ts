/** Mirrors `backend/src/gold-price/gold-price.types.ts`. */

export interface GoldPricePoint {
  t: number;
  price: number;
}

export interface GoldPriceTick extends GoldPricePoint {
  previousPrice: number;
  changePercent: number;
  currency: 'IRT';
  unit: 'gram-18k';
}

export interface GoldPriceSnapshot {
  current: GoldPriceTick;
  history: GoldPricePoint[];
  intervalMs: number;
  simulated: boolean;
}

export const GOLD_PRICE_EVENTS = {
  snapshot: 'gold-price:snapshot',
  tick: 'gold-price:tick',
} as const;

/** Points kept on the chart. Fixed, so the SVG path can be smoothly interpolated. */
export const CHART_POINTS = 24;

/**
 * Used when the API cannot be reached at render time: a flat-ish placeholder series
 * with the same length as the live window, so the chart never changes shape.
 */
export function createFallbackSnapshot(): GoldPriceSnapshot {
  const base = 3_240_000;
  const now = Date.now();
  const history = Array.from({ length: CHART_POINTS }, (_, index) => ({
    t: now - (CHART_POINTS - 1 - index) * 3000,
    // Gentle wave so the placeholder does not look like a broken flat line.
    price: Math.round(base * (1 + Math.sin(index / 3.2) * 0.004)),
  }));

  return {
    current: {
      ...history[history.length - 1],
      previousPrice: history[history.length - 2].price,
      changePercent: 0,
      currency: 'IRT',
      unit: 'gram-18k',
    },
    history,
    intervalMs: 3000,
    simulated: true,
  };
}

/** Keeps the window at `CHART_POINTS` by dropping the oldest point. */
export function appendTick(snapshot: GoldPriceSnapshot, tick: GoldPriceTick): GoldPriceSnapshot {
  const history = [...snapshot.history, { t: tick.t, price: tick.price }].slice(-CHART_POINTS);
  return { ...snapshot, current: tick, history };
}
