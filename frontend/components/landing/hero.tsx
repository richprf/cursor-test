'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { toPersianNumber } from '@/lib/format';
import { gsap } from '@/lib/gsap';
import { GSAP_EASE, TIMING } from '@/lib/motion';
import { useGoldPrice } from './gold-price-provider';
import { PriceStatusPill } from './live-price';

/** Positions and colors match Upmind Home v1 `.hero_badge-wrap.is-*`. */
const BADGES = [
  { id: 'three', label: 'حس لوکس', tone: '#f79bf7', float: 'down' },
  { id: 'two', label: 'حرفه‌ای', tone: '#fe86a6', float: 'up' },
  { id: 'one', label: 'استراتژیک', tone: '#b7fe02', float: 'down' },
  { id: 'five', label: 'خرید هوشمند', tone: '#7ddafc', float: 'up' },
  { id: 'four', label: 'رشد سریع', tone: '#edff75', float: 'down' },
] as const;

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
      { y: 18, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.75, stagger: 0.08, ease: GSAP_EASE.power4Out },
      0.28,
    );
    return () => {
      tl.kill();
    };
  }, []);

  return (
    <section ref={rootRef} id="top" className="hero-v1">
      <h1 className="sr-only">طلای شما، همیشه در دستان شما</h1>

      <div className="hero-v1-media" aria-hidden>
        <Image
          src="/landing/hero.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="hero-photo object-cover object-[42%_18%]"
        />
      </div>

      <div className="hero-v1-shell">
        <div className="hero-v1-content">
          <div className="hero-v1-heading">
            <p data-hero-copy className="hero-v1-title">
              طلا بخرید. امن نگه دارید. هر لحظه نقد کنید.
            </p>
            <p data-hero-copy className="hero-v1-desc">
              با زرین‌سرمایه از هر مبلغی که دارید طلای ۱۸ عیار بخرید، در خزانهٔ بیمه‌شده نگه دارید و
              هر لحظه که خواستید بفروشید یا به‌صورت فیزیکی تحویل بگیرید.
            </p>
            <p data-hero-copy className="hero-v1-price">
              <span className="tabular-nums">{toPersianNumber(current.price)} تومان</span>
              <span className="hero-v1-price-dot">·</span>
              طلای ۱۸ عیار
              <PriceStatusPill status={status} compact />
            </p>
          </div>

          <div data-hero-copy className="hero-v1-actions">
            <Link href="#work" className="hero-v1-btn hero-v1-btn-ghost">
              نمونه‌کارها
            </Link>
            <Link href={ctaHref} className="hero-v1-btn hero-v1-btn-fill">
              {ctaLabel}
            </Link>
          </div>

          {BADGES.map((badge) => (
            <div
              key={badge.id}
              data-hero-badge
              className={`hero-v1-badge-wrap is-${badge.id} is-${badge.float}`}
            >
              <div className="hero-v1-badge">
                <span className="hero-v1-badge-icon" style={{ backgroundColor: badge.tone }} aria-hidden>
                  <svg viewBox="0 0 16 16" className="size-3.5" fill="none">
                    <path
                      d="M8 1.6l1.4 3.4 3.6.4-2.7 2.5.8 3.5L8 9.6l-3.1 1.8.8-3.5L3 5.4l3.6-.4L8 1.6z"
                      fill="#101604"
                    />
                  </svg>
                </span>
                <span className="hero-v1-badge-text">{badge.label}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
