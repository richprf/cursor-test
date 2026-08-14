'use client';

import { useEffect, useRef, useState, type ComponentType } from 'react';
import { animate, useInView, useReducedMotion } from 'framer-motion';
import { BadgeCheck, Landmark, ShieldCheck, Users, type LucideProps } from 'lucide-react';
import { toPersianNumber } from '@/lib/format';
import { EASE_OUT } from './reveal';

const STATS = [
  { icon: Users, value: 100_000, suffix: '+', label: 'کاربر فعال' },
  { icon: Landmark, value: 4_200, suffix: ' میلیارد تومان', label: 'ارزش طلای نگهداری‌شده' },
  { icon: ShieldCheck, value: 100, suffix: '٪', label: 'تحویل فیزیکی تضمین‌شده' },
  { icon: BadgeCheck, value: 24, suffix: ' ساعته', label: 'پشتیبانی و امکان معامله' },
];

export function TrustBar() {
  return (
    <section className="border-y border-border/70 bg-background-elevated">
      <div className="mx-auto grid w-full max-w-6xl grid-cols-2 gap-x-6 gap-y-9 px-5 py-10 sm:px-8 lg:grid-cols-4">
        {STATS.map((stat) => (
          <Stat key={stat.label} {...stat} />
        ))}
      </div>
    </section>
  );
}

function Stat({
  icon: Icon,
  value,
  suffix,
  label,
}: {
  icon: ComponentType<LucideProps>;
  value: number;
  suffix: string;
  label: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.6 });
  const reduceMotion = useReducedMotion();

  // Rendered as the final number so it is correct without JS; the client resets it
  // to zero after hydration and counts up once the stat scrolls into view.
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    if (!reduceMotion) setDisplay(0);
  }, [reduceMotion]);

  useEffect(() => {
    if (!isInView || reduceMotion) return;

    const controls = animate(0, value, {
      duration: 1.4,
      ease: EASE_OUT,
      onUpdate: (latest) => setDisplay(Math.round(latest)),
      // Guarantees the exact number, whatever the last frame rounded to.
      onComplete: () => setDisplay(value),
    });

    return () => controls.stop();
  }, [isInView, reduceMotion, value]);

  return (
    <div ref={ref} className="flex items-start gap-3">
      <span className="grid size-10 shrink-0 place-items-center rounded-xl border border-gold-500/20 bg-gold-500/[0.12] text-gold-700">
        <Icon className="size-5" aria-hidden />
      </span>
      <span>
        <span className="block text-lg font-bold tabular-nums sm:text-xl">
          {toPersianNumber(display)}
          <span className="text-sm font-semibold text-gold-700">{suffix}</span>
        </span>
        <span className="mt-0.5 block text-xs leading-6 text-muted sm:text-sm">{label}</span>
      </span>
    </div>
  );
}
