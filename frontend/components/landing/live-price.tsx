'use client';

import { useEffect, useRef, useState } from 'react';
import { animate, useReducedMotion } from 'framer-motion';
import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { toPersianNumber } from '@/lib/format';
import type { GoldPriceStatus } from '@/lib/use-gold-price-socket';
import { LiveSparklineIcon } from './gold-icons';
import { EASE_OUT } from './reveal';
import { useGoldPrice } from './gold-price-provider';

/**
 * Smoothly transitions between server prices but always converges to the exact
 * pushed value — including when a new tick interrupts an in-flight tween.
 */
function useAnimatedPrice(value: number): number {
  const reduceMotion = useReducedMotion();
  const [display, setDisplay] = useState(value);
  const displayRef = useRef(value);

  useEffect(() => {
    if (reduceMotion || displayRef.current === value) {
      displayRef.current = value;
      setDisplay(value);
      return;
    }

    const controls = animate(displayRef.current, value, {
      duration: 0.55,
      ease: EASE_OUT,
      onUpdate: (latest) => {
        const rounded = Math.round(latest);
        displayRef.current = rounded;
        setDisplay(rounded);
      },
      onComplete: () => {
        displayRef.current = value;
        setDisplay(value);
      },
    });

    return () => {
      controls.stop();
      displayRef.current = value;
      setDisplay(value);
    };
  }, [value, reduceMotion]);

  return display;
}

/** Short green/red highlight after each change, cleared again after ~1.4s. */
function usePriceFlash(value: number): 'up' | 'down' | null {
  const [flash, setFlash] = useState<'up' | 'down' | null>(null);
  const previous = useRef(value);

  useEffect(() => {
    if (value === previous.current) return;

    setFlash(value > previous.current ? 'up' : 'down');
    previous.current = value;

    const timer = setTimeout(() => setFlash(null), 1400);
    return () => clearTimeout(timer);
  }, [value]);

  return flash;
}

const FLASH_CLASS = {
  up: 'text-emerald-600 bg-emerald-500/10 dark:text-emerald-400',
  down: 'text-rose-600 bg-rose-500/10 dark:text-rose-400',
} as const;

/** Big headline price used in the chart card. */
export function LivePriceHeadline() {
  const { current, status } = useGoldPrice();
  const display = useAnimatedPrice(current.price);
  const flash = usePriceFlash(current.price);
  const isUp = current.changePercent >= 0;

  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <p className="flex items-center gap-2 text-xs text-muted">
          طلای ۱۸ عیار (هر گرم)
          <PriceStatusPill status={status} />
        </p>

        <p className="mt-1.5 flex items-baseline gap-2">
          <span
            // The flash lives on a rounded box so the colour change reads clearly
            // without moving anything; it fades out with a colour transition.
            className={`rounded-lg px-1.5 py-0.5 text-2xl font-bold tabular-nums transition-colors duration-700 sm:text-3xl ${
              flash ? FLASH_CLASS[flash] : 'bg-transparent text-foreground'
            }`}
          >
            {toPersianNumber(display)}
          </span>
          <span className="text-sm font-medium text-muted">تومان</span>
        </p>
      </div>

      <span
        className={`inline-flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 text-sm font-semibold ${
          isUp ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400' : 'bg-rose-500/10 text-rose-700 dark:text-rose-400'
        }`}
      >
        {isUp ? (
          <ArrowUpRight className="size-4" aria-hidden />
        ) : (
          <ArrowDownRight className="size-4" aria-hidden />
        )}
        ٪{toPersianNumber(Math.abs(current.changePercent))} در این بازه
      </span>
    </div>
  );
}

/** Compact variant that floats over the hero illustration. */
export function LivePriceBadge({ className = '' }: { className?: string }) {
  const { current, status } = useGoldPrice();
  const display = useAnimatedPrice(current.price);
  const flash = usePriceFlash(current.price);

  return (
    <div
      className={`absolute flex items-center gap-3 rounded-2xl border border-gold-500/25 bg-surface-translucent px-3.5 py-2.5 shadow-lg shadow-black/[0.06] backdrop-blur-md ${className}`}
    >
      <span className="grid size-8 place-items-center rounded-xl bg-gold-500/12 text-gold-700">
        <LiveSparklineIcon className="size-4" />
      </span>
      <span className="leading-tight">
        <span className="flex items-center gap-1.5 text-[11px] text-muted">
          طلای ۱۸ عیار
          <PriceStatusPill status={status} compact />
        </span>
        <span
          className={`block rounded px-1 text-xs font-semibold tabular-nums transition-colors duration-700 ${
            flash ? FLASH_CLASS[flash] : 'bg-transparent text-foreground'
          }`}
        >
          {toPersianNumber(display)} تومان
        </span>
      </span>
    </div>
  );
}

const STATUS_LABEL: Record<GoldPriceStatus, string> = {
  connecting: 'در حال اتصال…',
  live: 'زنده',
  reconnecting: 'اتصال مجدد…',
  offline: 'آفلاین',
};

const STATUS_TONE: Record<GoldPriceStatus, string> = {
  connecting: 'text-amber-600 dark:text-amber-400',
  live: 'text-emerald-600 dark:text-emerald-400',
  reconnecting: 'text-amber-600 dark:text-amber-400',
  offline: 'text-muted',
};

export function PriceStatusPill({
  status,
  compact = false,
}: {
  status: GoldPriceStatus;
  compact?: boolean;
}) {
  const isLive = status === 'live';

  return (
    <span
      className={`inline-flex items-center gap-1 ${STATUS_TONE[status]} ${compact ? 'text-[10px]' : 'text-[11px]'}`}
      title={status === 'offline' ? 'آخرین قیمت دریافت‌شده نمایش داده می‌شود' : undefined}
    >
      <span className="relative grid size-2 place-items-center">
        {isLive && (
          <span className="absolute size-2 animate-ping rounded-full bg-emerald-500/70" aria-hidden />
        )}
        <span className="size-1.5 rounded-full bg-current" aria-hidden />
      </span>
      {STATUS_LABEL[status]}
    </span>
  );
}
