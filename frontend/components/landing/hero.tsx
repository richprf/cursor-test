'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { toPersianNumber } from '@/lib/format';
import { gsap } from '@/lib/gsap';
import { GSAP_EASE, TIMING } from '@/lib/motion';
import { useGoldPrice } from './gold-price-provider';
import { PriceStatusPill } from './live-price';
import { NAV_LINKS } from './site-header';

const WORDS = ['سلام', 'طلا', 'زنده', '۱۸عیار'];
const SIDE_LABELS = ['خرید', 'نگهداری', 'تحویل'];

export function Hero({ ctaHref, ctaLabel }: { ctaHref: string; ctaLabel: string }) {
  const { current, status } = useGoldPrice();
  const rootRef = useRef<HTMLElement>(null);
  const wordRefs = useRef<HTMLSpanElement[]>([]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const copy = root.querySelectorAll('[data-hero-copy]');
    const words = wordRefs.current.filter(Boolean);

    const tl = gsap.timeline();
    tl.fromTo(
      copy,
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: TIMING.splitDuration, stagger: TIMING.splitStagger, ease: GSAP_EASE.power4Out },
      0.15,
    );

    if (words.length) {
      gsap.set(words, { yPercent: 100, opacity: 0 });
      const cycle = () => {
        words.forEach((el, index) => {
          gsap.fromTo(
            el,
            { yPercent: 100, opacity: 0 },
            {
              yPercent: 0,
              opacity: index === 0 ? 1 : 0,
              duration: TIMING.heroWord,
              delay: TIMING.heroWordStagger * index,
              ease: GSAP_EASE.power4Out,
            },
          );
        });
      };

      let i = 0;
      const show = (index: number) => {
        gsap.to(words, { opacity: 0, yPercent: -40, duration: 0.45, ease: GSAP_EASE.power2Out });
        gsap.fromTo(
          words[index],
          { yPercent: 80, opacity: 0 },
          { yPercent: 0, opacity: 1, duration: TIMING.heroWord, ease: GSAP_EASE.power4Out },
        );
      };
      cycle();
      const id = window.setInterval(() => {
        i = (i + 1) % words.length;
        show(i);
      }, 2200);
      return () => {
        tl.kill();
        window.clearInterval(id);
      };
    }

    return () => tl.kill();
  }, []);

  return (
    <section ref={rootRef} className="relative h-dvh min-h-[640px] overflow-hidden bg-black text-[#fafafa]">
      <div className="hero-loop absolute inset-0" aria-hidden />

      <h1 className="sr-only">طلای شما، همیشه در دستان شما</h1>

      <div className="relative z-10 flex h-full flex-col justify-between px-6 py-20">
        <div data-hero-copy className="flex items-start justify-between gap-4 text-[11px] tracking-[0.18em]">
          <p className="text-white/70">
            طلای ۱۸ عیار
            <span className="mx-2 text-gold-500">·</span>
            <span className="tabular-nums text-white">{toPersianNumber(current.price)} تومان</span>
            <span className="ms-2 inline-block align-middle">
              <PriceStatusPill status={status} compact />
            </span>
          </p>
          <p className="hidden text-white/50 sm:block">©{new Date().getFullYear()}</p>
        </div>

        <div className="grid items-end gap-10 lg:grid-cols-[1fr_auto_1fr]">
          <div data-hero-copy className="max-w-md space-y-6">
            <p className="text-sm leading-7 text-white/75 sm:text-base">
              با زرین‌سرمایه از هر مبلغی که دارید طلای ۱۸ عیار بخرید، در خزانهٔ بیمه‌شده نگه دارید و
              هر لحظه که خواستید بفروشید یا به‌صورت فیزیکی تحویل بگیرید.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href={ctaHref}
                className="bg-gold-metallic inline-flex items-center gap-2 px-6 py-3.5 text-sm font-semibold text-on-gold"
              >
                {ctaLabel}
                <ArrowLeft className="size-4" aria-hidden />
              </Link>
              <Link
                href="#work"
                className="inline-flex items-center border border-white/30 px-6 py-3.5 text-sm font-semibold text-white hover:border-gold-500"
              >
                نمونه‌کارها
              </Link>
            </div>
          </div>

          <div className="relative hidden h-24 overflow-hidden text-center lg:block">
            {WORDS.map((word, index) => (
              <span
                key={word}
                ref={(node) => {
                  if (node) wordRefs.current[index] = node;
                }}
                className="display-tight absolute inset-x-0 text-6xl font-semibold tracking-tight"
              >
                {word}
              </span>
            ))}
          </div>

          <ul data-hero-copy className="hidden justify-self-end text-end text-xs uppercase tracking-[0.28em] text-white/70 lg:block">
            {SIDE_LABELS.map((label) => (
              <li key={label} className="py-1">
                {label}
              </li>
            ))}
          </ul>
        </div>

        <div data-hero-copy className="flex items-end justify-between gap-4">
          <p className="text-xs text-white/55">(برای ادامه اسکرول کنید)</p>
          <nav className="hidden gap-5 text-xs text-white/70 md:flex" aria-label="بخش‌های صفحه">
            {NAV_LINKS.map((link) => (
              <a key={link.href} href={link.href} className="hover:text-white">
                {link.label}
              </a>
            ))}
          </nav>
        </div>
      </div>
    </section>
  );
}
