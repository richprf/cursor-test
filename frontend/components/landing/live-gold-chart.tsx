'use client';

import { memo, useEffect, useRef } from 'react';
import { GoldPriceChartEngine } from '@/lib/gold-price-chart-engine';
import type { GoldPricePoint } from '@/lib/gold-price';
import { useGoldPriceChartFeed } from './gold-price-provider';

/**
 * Canvas chart that subscribes directly to the WebSocket history feed.
 * React only mounts the container; all live updates are imperative (no chart re-mount).
 */
export const LiveGoldChart = memo(function LiveGoldChart() {
  const containerRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<GoldPriceChartEngine | null>(null);
  const subscribe = useGoldPriceChartFeed();

  useEffect(() => {
    if (!containerRef.current) return;
    const engine = new GoldPriceChartEngine(containerRef.current);
    engineRef.current = engine;
    return () => {
      engine.destroy();
      engineRef.current = null;
    };
  }, []);

  useEffect(() => {
    const push = (history: GoldPricePoint[]) => {
      engineRef.current?.sync(history);
    };

    return subscribe(push);
  }, [subscribe]);

  return <div ref={containerRef} className="mt-6 h-[240px] w-full" />;
});
