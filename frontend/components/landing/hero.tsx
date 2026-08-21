'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { toPersianNumber } from '@/lib/format';
import { EASE_OUT } from './reveal';
import { useGoldPrice } from './gold-price-provider';
import { PriceStatusPill } from './live-price';
import { NAV_LINKS } from './site-header';

const ROTATING = ['سلام', 'طلا', 'زنده', '۱۸عیار'];
const SIDE_LABELS = ['خرید', 'نگهداری', 'تحویل'];

export function Hero({ ctaHref, ctaLabel }: { ctaHref: string; ctaLabel: string }) {
  const reduceMotion = useReducedMotion();
  const { current, status } = useGoldPrice();
  const [word, setWord] = useState(0);

  useEffect(() => {
    if (reduceMotion) return;
    const id = window.setInterval(() => setWord((i) => (i + 1) % ROTATING.length), 2200);
    return () => window.clearInterval(id);
  }, [reduceMotion]);

  return (
    <section className="relative h-dvh min-h-[640px] overflow-hidden bg-black text-white">
      <video
        className="absolute inset-0 size-full object-cover opacity-80"
        src="/landing/hero-loop.mp4"
        poster="/landing/gold-hero-plus.png"
        autoPlay
        muted
        loop
        playsInline
        aria-hidden
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-transparent to-black/55" />

      <h1 className="sr-only">طلای شما، همیشه در دستان شما</h1>

      <div className="relative z-10 flex h-full flex-col justify-between px-5 py-20 sm:px-8 lg:px-10">
        <div className="flex items-start justify-between gap-4 text-[11px] tracking-[0.18em]">
          <p className="text-white/70">
            طلای ۱۸ عیار
            <span className="mx-2 text-gold-500">·</span>
            <span className="tabular-nums text-white">
              {toPersianNumber(current.price)} تومان
            </span>
            <span className="ms-2 inline-block align-middle">
              <PriceStatusPill status={status} compact />
            </span>
          </p>
          <p className="hidden text-white/50 sm:block">©{new Date().getFullYear()}</p>
        </div>

        <div className="grid items-end gap-10 lg:grid-cols-[1fr_auto_1fr]">
          <div className="max-w-md space-y-6">
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

          <div className="hidden h-40 overflow-hidden text-center lg:block">
            <AnimatePresence mode="wait">
              <motion.p
                key={ROTATING[word]}
                initial={{ y: reduceMotion ? 0 : 48, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: reduceMotion ? 0 : -48, opacity: 0 }}
                transition={{ duration: 0.7, ease: EASE_OUT }}
                className="display-tight text-6xl font-semibold tracking-tight"
              >
                {ROTATING[word]}
              </motion.p>
            </AnimatePresence>
          </div>

          <ul className="hidden justify-self-end text-end text-xs uppercase tracking-[0.28em] text-white/70 lg:block">
            {SIDE_LABELS.map((label) => (
              <li key={label} className="py-1">
                {label}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex items-end justify-between gap-4">
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
