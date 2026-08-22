'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { toPersianNumber } from '@/lib/format';
import { gsap } from '@/lib/gsap';
import { GSAP_EASE, TIMING } from '@/lib/motion';
import { useGoldPrice } from './gold-price-provider';
import { PriceStatusPill } from './live-price';

const CUSTOMERS = [
  { src: '/landing/work-smile.jpg', alt: '' },
  { src: '/landing/work-diamonds.jpg', alt: '' },
  { src: '/landing/work-moon.jpg', alt: '' },
];

const BADGES = [
  { label: '۱۸ عیار خالص', tone: '#7ddafc' },
  { label: 'قیمت زنده', tone: '#edff75' },
  { label: 'خزانهٔ بیمه', tone: '#fe86a6' },
  { label: 'تحویل فیزیکی', tone: '#c8ff4a' },
  { label: 'نقدشوندگی آنی', tone: '#f79bf7' },
];

export function Hero({ ctaHref, ctaLabel }: { ctaHref: string; ctaLabel: string }) {
  const { current, status } = useGoldPrice();
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const copy = root.querySelectorAll('[data-hero-copy]');
    const badges = root.querySelectorAll('[data-hero-badge]');
    const tl = gsap.timeline();
    tl.fromTo(
      copy,
      { y: 28, opacity: 0 },
      { y: 0, opacity: 1, duration: TIMING.splitDuration, stagger: TIMING.splitStagger, ease: GSAP_EASE.power4Out },
      0.12,
    );
    tl.fromTo(
      badges,
      { y: 16, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.7, stagger: 0.08, ease: GSAP_EASE.power4Out },
      0.35,
    );
    return () => {
      tl.kill();
    };
  }, []);

  return (
    <section
      ref={rootRef}
      id="top"
      className="hero-upmind relative isolate min-h-[100svh] overflow-hidden bg-[#101604] text-white"
    >
      <h1 className="sr-only">طلای شما، همیشه در دستان شما</h1>

      <div className="grid min-h-[100svh] lg:grid-cols-2">
        <div className="relative z-20 flex min-h-[100svh] flex-col justify-between px-6 pb-10 pt-28 sm:px-10 lg:px-14 lg:pb-14 xl:px-[3.25rem]">
          <p
            data-hero-copy
            className="hero-upmind-kicker inline-flex items-center gap-2 font-mono text-[0.72rem] uppercase tracking-[0.18em] text-white"
          >
            <span className="hero-upmind-pulse" aria-hidden />
            زرین‌سرمایه
          </p>

          <div className="max-w-[30rem]">
            <div data-hero-copy className="mb-8 flex items-center gap-3">
              <div className="flex">
                {CUSTOMERS.map((person, index) => (
                  <span
                    key={person.src}
                    className={`relative h-10 w-10 overflow-hidden rounded-full border border-white/20 ${index > 0 ? '-ms-3' : ''}`}
                  >
                    <Image src={person.src} alt={person.alt} fill sizes="40px" className="object-cover" />
                  </span>
                ))}
              </div>
              <p className="text-sm text-white/80">+۲۰ هزار سرمایه‌گذار</p>
            </div>

            <p
              data-hero-copy
              className="max-w-[16ch] text-[2rem] font-medium leading-[1.2] tracking-[-0.04em] sm:text-[2.75rem] lg:text-[3.25rem] lg:leading-[1.23] lg:tracking-[-0.08em]"
            >
              طلا بخرید. امن نگه دارید. هر لحظه نقد کنید.
            </p>

            <p data-hero-copy className="mt-8 max-w-[31rem] text-[0.95rem] leading-8 text-[#aeaeae]">
              با زرین‌سرمایه از هر مبلغی که دارید طلای ۱۸ عیار بخرید، در خزانهٔ بیمه‌شده نگه دارید و
              هر لحظه که خواستید بفروشید یا به‌صورت فیزیکی تحویل بگیرید.
            </p>

            <div data-hero-copy className="mt-8 flex flex-wrap items-center gap-3 text-[0.8rem] text-white/70">
              <span className="font-mono tabular-nums tracking-tight text-white">
                {toPersianNumber(current.price)} تومان
              </span>
              <span className="text-white/35">·</span>
              <span>طلای ۱۸ عیار</span>
              <PriceStatusPill status={status} compact />
            </div>

            <div data-hero-copy className="hero-upmind-actions mt-10 flex flex-wrap items-center gap-3">
              <Link href={ctaHref} className="hero-upmind-btn hero-upmind-btn-fill">
                {ctaLabel}
              </Link>
              <Link href="#work" className="hero-upmind-btn hero-upmind-btn-ghost">
                نمونه‌کارها
              </Link>
            </div>
          </div>
        </div>

        <div className="hero-upmind-media pointer-events-none absolute inset-0 lg:pointer-events-auto lg:relative lg:min-h-[100svh]">
          <Image
            src="/landing/hero.jpg"
            alt="پرتره سیاه‌وسفید با جواهرات"
            fill
            priority
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="hero-photo object-cover object-[42%_18%]"
          />
          <div className="hero-upmind-gradient pointer-events-none absolute inset-0" aria-hidden />

          <div className="absolute inset-x-0 bottom-10 z-10 hidden flex-col items-center gap-3 px-8 lg:flex">
            <div className="flex flex-wrap justify-center gap-2">
              {BADGES.slice(0, 3).map((badge) => (
                <HeroBadge key={badge.label} {...badge} />
              ))}
            </div>
            <div className="flex flex-wrap justify-center gap-2">
              {BADGES.slice(3).map((badge) => (
                <HeroBadge key={badge.label} {...badge} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function HeroBadge({ label, tone }: { label: string; tone: string }) {
  return (
    <div data-hero-badge className="hero-upmind-badge inline-flex items-center gap-2">
      <span className="hero-upmind-badge-icon" style={{ backgroundColor: tone }} aria-hidden>
        <svg viewBox="0 0 16 16" className="size-3.5" fill="none">
          <path
            d="M8 1.6l1.4 3.4 3.6.4-2.7 2.5.8 3.5L8 9.6l-3.1 1.8.8-3.5L3 5.4l3.6-.4L8 1.6z"
            fill="#101604"
          />
        </svg>
      </span>
      <span className="text-[0.8rem] tracking-tight">{label}</span>
    </div>
  );
}
