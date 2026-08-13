'use client';

import { useEffect, useRef } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { gsap, registerScrollTrigger } from '@/lib/gsap';
import { Section, SectionHeading } from './section';
import { Reveal } from './reveal';

const WIDTH = 620;
const HEIGHT = 240;

/** Mock closing prices for the last six months (index → month label). */
const SERIES = [38, 52, 46, 74, 96, 88, 128, 150, 142, 178, 196, 214];
const MONTHS = ['فروردین', 'خرداد', 'مرداد', 'مهر', 'آذر', 'بهمن'];

const points = SERIES.map((value, index) => ({
  x: (index / (SERIES.length - 1)) * WIDTH,
  // Higher price → smaller y. 24px of headroom keeps the peak inside the viewBox.
  y: HEIGHT - 24 - (value / 220) * (HEIGHT - 56),
}));

export function PriceChart() {
  const lineRef = useRef<SVGPathElement>(null);
  const areaRef = useRef<SVGPathElement>(null);
  const markerRef = useRef<SVGGElement>(null);

  /**
   * Path drawing: the line starts fully hidden behind its own dash gap and is drawn
   * once the chart scrolls into view. The SVG's base state is the finished chart, so
   * reduced-motion visitors simply see it drawn.
   */
  useEffect(() => {
    registerScrollTrigger();
    const mm = gsap.matchMedia();

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const line = lineRef.current;
      if (!line) return;

      const length = line.getTotalLength();

      const timeline = gsap.timeline({
        scrollTrigger: { trigger: line, start: 'top 80%', once: true },
      });

      // `immediateRender: false` matters here: without it GSAP would apply the hidden
      // "from" state on page load, leaving the chart blank if the tween never runs.
      timeline
        .fromTo(
          line,
          { strokeDasharray: length, strokeDashoffset: length },
          {
            strokeDashoffset: 0,
            duration: 1.7,
            ease: 'power2.out',
            immediateRender: false,
            // Drop the inline dash styles afterwards, leaving a plain drawn path.
            onComplete: () => gsap.set(line, { clearProps: 'strokeDasharray,strokeDashoffset' }),
          },
        )
        .fromTo(
          areaRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.8, immediateRender: false },
          0.35,
        )
        .fromTo(
          markerRef.current,
          { opacity: 0, scale: 0.6 },
          {
            opacity: 1,
            scale: 1,
            duration: 0.4,
            ease: 'back.out(2)',
            transformOrigin: 'center',
            immediateRender: false,
          },
          '-=0.25',
        );
    });

    return () => mm.revert();
  }, []);

  const linePath = buildSmoothPath(points);
  const areaPath = `${linePath} L ${WIDTH} ${HEIGHT} L 0 ${HEIGHT} Z`;
  const last = points[points.length - 1];

  return (
    <Section id="prices">
      <SectionHeading
        eyebrow="بازار طلا"
        title="قیمت‌ها را لحظه‌ای دنبال کنید"
        description="نمودار زیر نمونه‌ای نمایشی از روند قیمت طلای ۱۸ عیار در یک سال گذشته است."
      />

      <Reveal className="mt-12" y={30}>
        <div className="rounded-3xl border border-gold-500/20 bg-surface/60 p-5 shadow-2xl shadow-black/50 backdrop-blur-sm sm:p-7">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs text-muted">طلای ۱۸ عیار (هر گرم)</p>
              <p className="mt-1 flex items-center gap-2 text-2xl font-bold tabular-nums">
                ۳٬۲۴۰٬۰۰۰
                <span className="text-sm font-medium text-muted">تومان</span>
              </p>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-500/12 px-2.5 py-1.5 text-sm font-semibold text-emerald-400">
              <ArrowUpRight className="size-4" aria-hidden />
              ٪۲۴٫۶ در یک سال
            </span>
          </div>

          <svg
            viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
            className="mt-6 h-52 w-full sm:h-64"
            role="img"
            aria-label="نمودار نمایشی روند قیمت طلا در یک سال گذشته"
          >
            <defs>
              {/* Brightest towards the latest price, on the right of the series. */}
              <linearGradient id="chart-line" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#b38728" />
                <stop offset="50%" stopColor="#f5c542" />
                <stop offset="100%" stopColor="#fcf6ba" />
              </linearGradient>
              <linearGradient id="chart-area" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#d4af37" stopOpacity="0.35" />
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

            <path ref={areaRef} d={areaPath} fill="url(#chart-area)" />
            <path
              ref={lineRef}
              d={linePath}
              fill="none"
              stroke="url(#chart-line)"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            <g ref={markerRef}>
              <circle cx={last.x} cy={last.y} r="12" fill="#f5c542" opacity="0.18" />
              <circle cx={last.x} cy={last.y} r="5" fill="#fcf6ba" />
            </g>
          </svg>

          <div className="mt-4 flex justify-between text-[11px] text-muted" dir="ltr">
            {/* dir=ltr so the months stay left-to-right in the same order as the chart. */}
            {MONTHS.map((month) => (
              <span key={month}>{month}</span>
            ))}
          </div>
        </div>
      </Reveal>
    </Section>
  );
}

/** Catmull-Rom style smoothing, so the mock series reads as a curve, not a zig-zag. */
function buildSmoothPath(data: { x: number; y: number }[]): string {
  if (data.length < 2) return '';

  let path = `M ${data[0].x} ${data[0].y}`;

  for (let i = 0; i < data.length - 1; i += 1) {
    const previous = data[i - 1] ?? data[i];
    const current = data[i];
    const next = data[i + 1];
    const afterNext = data[i + 2] ?? next;

    const control1 = {
      x: current.x + (next.x - previous.x) / 6,
      y: current.y + (next.y - previous.y) / 6,
    };
    const control2 = {
      x: next.x - (afterNext.x - current.x) / 6,
      y: next.y - (afterNext.y - current.y) / 6,
    };

    path += ` C ${control1.x} ${control1.y} ${control2.x} ${control2.y} ${next.x} ${next.y}`;
  }

  return path;
}
