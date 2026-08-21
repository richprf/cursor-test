'use client';

import { useEffect, useRef } from 'react';
import { gsap, registerScrollTrigger } from '@/lib/gsap';
import { GSAP_EASE } from '@/lib/motion';
import { toPersianNumber } from '@/lib/format';
import { Section } from './section';
import { Reveal } from './reveal';

const STATS = [
  { value: 100_000, suffix: '+', label: 'کاربر فعال' },
  { value: 4_200, suffix: ' میلیارد', label: 'ارزش طلای نگهداری‌شده (تومان)' },
  { value: 100, suffix: '٪', label: 'تحویل فیزیکی تضمین‌شده' },
  { value: 24, suffix: ' ساعته', label: 'پشتیبانی و امکان معامله' },
];

export function Awards() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    registerScrollTrigger();

    const numbers = root.querySelectorAll<HTMLElement>('[data-count]');
    const ctx = gsap.context(() => {
      numbers.forEach((el) => {
        const target = Number(el.dataset.count);
        const obj = { n: 0 };
        gsap.to(obj, {
          n: target,
          duration: 1.3,
          ease: GSAP_EASE.power4Out,
          scrollTrigger: { trigger: el, start: 'top 85%' },
          onUpdate: () => {
            el.textContent = toPersianNumber(Math.round(obj.n));
          },
        });
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <Section id="awards">
      <Reveal y={40}>
        <h2 className="display-tight text-[clamp(1.9rem,4.8vw,4rem)] font-semibold">
          <span className="text-muted">اعداد. </span>
          اعتماد، در مقیاس.
        </h2>
      </Reveal>

      <div ref={rootRef} className="mt-16 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
        {STATS.map((stat) => (
          <div key={stat.label} className="border-t border-foreground/15 pt-6">
            <p className="display-tight text-5xl font-semibold tabular-nums sm:text-6xl">
              <span data-count={stat.value}>۰</span>
              <span className="text-2xl text-gold-700">{stat.suffix}</span>
            </p>
            <p className="mt-3 text-sm text-muted">{stat.label}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}
