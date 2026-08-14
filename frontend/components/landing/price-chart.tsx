'use client';

import { useEffect, useMemo, useRef } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { gsap, registerScrollTrigger } from '@/lib/gsap';
import { CHART_POINTS, type GoldPricePoint } from '@/lib/gold-price';
import { Section, SectionHeading } from './section';
import { Reveal, EASE_OUT } from './reveal';
import { useGoldPrice } from './gold-price-provider';
import { LivePriceHeadline } from './live-price';

const WIDTH = 620;
const HEIGHT = 240;
/** Keeps the end marker's halo from being clipped by the viewBox edges. */
const PADDING_X = 16;
const PADDING_Y = 26;

export function PriceChart() {
  const { history, intervalMs, simulated } = useGoldPrice();
  const reduceMotion = useReducedMotion();

  const lineRef = useRef<SVGPathElement>(null);
  const areaRef = useRef<SVGPathElement>(null);

  const { linePath, areaPath, last } = useMemo(() => buildChartGeometry(history), [history]);

  /**
   * Path drawing on first view. `immediateRender: false` matters: without it GSAP
   * would apply the hidden "from" state on load, leaving the chart blank if the tween
   * never runs. Live updates afterwards are handled by Framer Motion below.
   */
  useEffect(() => {
    registerScrollTrigger();
    const mm = gsap.matchMedia();

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const line = lineRef.current;
      if (!line) return;

      const length = line.getTotalLength();

      const timeline = gsap.timeline({
        scrollTrigger: { trigger: line, start: 'top 85%', once: true },
      });

      timeline
        .fromTo(
          line,
          { strokeDasharray: length, strokeDashoffset: length },
          {
            strokeDashoffset: 0,
            duration: 1.6,
            ease: 'power2.out',
            immediateRender: false,
            // Drop the inline dash styles so live path updates are not clipped.
            onComplete: () => gsap.set(line, { clearProps: 'strokeDasharray,strokeDashoffset' }),
          },
        )
        .fromTo(
          areaRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.8, immediateRender: false },
          0.3,
        );
    });

    return () => mm.revert();
  }, []);

  // Morph over roughly one publish interval, so the line moves continuously
  // instead of stepping whenever a new price arrives.
  const morph = { duration: Math.min(intervalMs / 1000, 1.1), ease: EASE_OUT };

  return (
    <Section id="prices">
      <SectionHeading
        eyebrow="بازار طلا"
        title="قیمت‌ها را لحظه‌ای دنبال کنید"
        description={
          simulated
            ? 'قیمت از طریق WebSocket و به‌صورت زنده به‌روزرسانی می‌شود. در این نسخه فید قیمت روی سرور شبیه‌سازی شده است.'
            : 'قیمت از طریق WebSocket و به‌صورت زنده از فید بازار به‌روزرسانی می‌شود.'
        }
      />

      <Reveal className="mt-12" y={30}>
        <div className="rounded-3xl border border-border bg-white p-5 shadow-xl shadow-black/[0.06] sm:p-7">
          <LivePriceHeadline />

          <svg
            viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
            // No fixed height: the viewBox ratio decides it, so the curve always spans
            // the full card width and lines up with the labels below.
            className="mt-6 w-full"
            role="img"
            aria-label="نمودار زندهٔ قیمت طلای ۱۸ عیار"
          >
            <defs>
              {/* Richer gold towards the latest price, on the right of the series. */}
              <linearGradient id="chart-line" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#e6c65c" />
                <stop offset="55%" stopColor="#d4af37" />
                <stop offset="100%" stopColor="#a97c17" />
              </linearGradient>
              <linearGradient id="chart-area" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#d4af37" stopOpacity="0.28" />
                <stop offset="100%" stopColor="#d4af37" stopOpacity="0" />
              </linearGradient>
            </defs>

            {/* Horizontal guides. */}
            {[0.25, 0.5, 0.75].map((ratio) => (
              <line
                key={ratio}
                x1="0"
                x2={WIDTH}
                y1={HEIGHT * ratio}
                y2={HEIGHT * ratio}
                stroke="currentColor"
                className="text-border"
                strokeDasharray="4 8"
              />
            ))}

            <motion.path
              ref={areaRef}
              d={areaPath}
              fill="url(#chart-area)"
              animate={reduceMotion ? undefined : { d: areaPath }}
              transition={morph}
            />
            <motion.path
              ref={lineRef}
              d={linePath}
              fill="none"
              stroke="url(#chart-line)"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              animate={reduceMotion ? undefined : { d: linePath }}
              transition={morph}
            />

            <motion.g
              animate={reduceMotion ? undefined : { x: last.x, y: last.y }}
              initial={{ x: last.x, y: last.y }}
              transition={morph}
            >
              <circle r="12" fill="#f5c542" opacity="0.25" />
              <circle r="5" fill="#d4af37" stroke="#ffffff" strokeWidth="2" />
            </motion.g>
          </svg>

          <div className="mt-4 flex justify-between text-[11px] text-muted">
            <span>
              بازهٔ نمایش: {toPersianCount(history.length)} به‌روزرسانی اخیر
            </span>
            <span>هر {toPersianCount(Math.round(intervalMs / 1000))} ثانیه یک قیمت جدید</span>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}

/** Maps the price window onto the viewBox and builds the line and area paths. */
function buildChartGeometry(history: GoldPricePoint[]) {
  const points = history.slice(-CHART_POINTS);
  const prices = points.map((point) => point.price);
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  // Flat windows would divide by zero; give them a small artificial range.
  const range = max - min || Math.max(max * 0.001, 1);

  const scaled = points.map((point, index) => ({
    x: PADDING_X + (index / (points.length - 1)) * (WIDTH - PADDING_X * 2),
    y: HEIGHT - PADDING_Y - ((point.price - min) / range) * (HEIGHT - PADDING_Y * 2),
  }));

  const linePath = buildSmoothPath(scaled);
  const first = scaled[0];
  const last = scaled[scaled.length - 1];

  return {
    linePath,
    areaPath: `${linePath} L ${last.x} ${HEIGHT} L ${first.x} ${HEIGHT} Z`,
    last,
  };
}

/** Catmull-Rom style smoothing, so the series reads as a curve, not a zig-zag. */
function buildSmoothPath(data: { x: number; y: number }[]): string {
  if (data.length < 2) return '';

  let path = `M ${round(data[0].x)} ${round(data[0].y)}`;

  for (let i = 0; i < data.length - 1; i += 1) {
    const previous = data[i - 1] ?? data[i];
    const current = data[i];
    const next = data[i + 1];
    const afterNext = data[i + 2] ?? next;

    const c1x = current.x + (next.x - previous.x) / 6;
    const c1y = current.y + (next.y - previous.y) / 6;
    const c2x = next.x - (afterNext.x - current.x) / 6;
    const c2y = next.y - (afterNext.y - current.y) / 6;

    path += ` C ${round(c1x)} ${round(c1y)} ${round(c2x)} ${round(c2y)} ${round(next.x)} ${round(next.y)}`;
  }

  return path;
}

/** Fewer decimals keeps the animated `d` attribute cheap to interpolate. */
function round(value: number): number {
  return Math.round(value * 100) / 100;
}

function toPersianCount(value: number): string {
  return value.toLocaleString('en-US').replace(/\d/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[Number(d)]);
}
