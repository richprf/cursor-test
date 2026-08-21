'use client';

import { useEffect, useRef } from 'react';
import { gsap, registerScrollTrigger } from '@/lib/gsap';
import { BuyGoldIcon, SignUpIcon, WalletChargeIcon } from './gold-icons';
import { Section, SectionHeading } from './section';

const STEPS = [
  {
    icon: SignUpIcon,
    title: 'ثبت‌نام و احراز هویت',
    description: 'با ایمیل یا حساب گوگل وارد شوید و احراز هویت را در چند دقیقه کامل کنید.',
  },
  {
    icon: WalletChargeIcon,
    title: 'شارژ کیف پول',
    description: 'از هر کارت بانکی، کیف پول خود را با مبلغ دلخواه شارژ کنید.',
  },
  {
    icon: BuyGoldIcon,
    title: 'خرید طلا',
    description: 'به‌اندازهٔ دلخواه طلا بخرید؛ در خزانه نگه دارید یا فیزیکی تحویل بگیرید.',
  },
];

export function HowItWorks() {
  const rootRef = useRef<HTMLDivElement>(null);
  const horizontalLineRef = useRef<HTMLDivElement>(null);
  const verticalLineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    registerScrollTrigger();
    const mm = gsap.matchMedia();
    const badges = gsap.utils.toArray<HTMLElement>('[data-step-badge]', rootRef.current);

    const buildTimeline = (line: HTMLElement | null, prop: 'scaleX' | 'scaleY') => () => {
      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: rootRef.current,
          start: 'top 72%',
          end: 'bottom 65%',
          scrub: 0.6,
        },
      });

      timeline
        .fromTo(line, { [prop]: 0 }, { [prop]: 1, ease: 'none' }, 0)
        .fromTo(
          badges,
          { opacity: 0.4, scale: 0.92 },
          { opacity: 1, scale: 1, stagger: 0.3, ease: 'none' },
          0,
        );
    };

    mm.add(
      '(min-width: 768px) and (prefers-reduced-motion: no-preference)',
      buildTimeline(horizontalLineRef.current, 'scaleX'),
    );
    mm.add(
      '(max-width: 767px) and (prefers-reduced-motion: no-preference)',
      buildTimeline(verticalLineRef.current, 'scaleY'),
    );

    return () => mm.revert();
  }, []);

  return (
    <Section id="how-it-works">
      <SectionHeading
        eyebrow="در سه قدم"
        title="شروع سرمایه‌گذاری، ساده‌تر از آنچه فکر می‌کنید"
        description="از ثبت‌نام تا اولین خرید، کمتر از پنج دقیقه."
      />

      <div ref={rootRef} className="relative">
        <div
          aria-hidden
          className="absolute inset-x-0 top-6 hidden h-px bg-foreground/15 md:block"
          role="presentation"
        >
          <div ref={horizontalLineRef} className="border-gold-hairline h-px w-full origin-right" />
        </div>

        <div aria-hidden className="absolute inset-y-2 right-6 w-px bg-foreground/15 md:hidden">
          <div ref={verticalLineRef} className="border-gold-hairline h-full w-px origin-top" />
        </div>

        <ol className="grid gap-10 md:grid-cols-3 md:gap-8">
          {STEPS.map((step, index) => (
            <li key={step.title} className="group relative flex gap-4 md:block">
              <span
                data-step-badge
                className="relative z-10 grid size-12 shrink-0 place-items-center border border-gold-500/30 bg-background text-gold-700"
              >
                <step.icon className="size-5" />
              </span>

              <div className="md:mt-8">
                <span className="font-mono text-xs text-gold-700">({toPersianDigit(index + 1)})</span>
                <h3 className="mt-2 text-2xl font-semibold tracking-tight">{step.title}</h3>
                <p className="mt-3 max-w-sm text-sm leading-7 text-muted">{step.description}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </Section>
  );
}

function toPersianDigit(value: number): string {
  return ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'][value] ?? String(value);
}
