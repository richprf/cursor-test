'use client';

import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowLeft, ShieldCheck } from 'lucide-react';
import { EASE_OUT } from './reveal';

export function FinalCta({ ctaHref, ctaLabel }: { ctaHref: string; ctaLabel: string }) {
  const reduceMotion = useReducedMotion();

  return (
    <section className="px-5 pb-24 pt-4 sm:px-8">
      {/* Last touch point on the page, so the entrance is a little stronger: the panel
          scales up as it fades in. */}
      <motion.div
        initial={{ opacity: 0, scale: reduceMotion ? 1 : 0.96 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.6, ease: EASE_OUT }}
        className="bg-gold-metallic relative mx-auto max-w-5xl overflow-hidden rounded-[2rem] p-8 text-center shadow-2xl shadow-gold-700/25 sm:p-14"
      >
        <div className="relative space-y-5 text-[#231a05]">
          <h2 className="text-2xl font-black leading-relaxed sm:text-3xl">
            امروز اولین گرم طلای خود را بخرید
          </h2>
          <p className="mx-auto max-w-xl text-sm leading-8 font-medium text-[#231a05]/80 sm:text-base">
            ثبت‌نام رایگان است و در چند دقیقه انجام می‌شود. بدون حداقل مبلغ، بدون کارمزد خرید.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              href={ctaHref}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#141013] px-6 py-3.5 text-sm font-semibold text-gold-100 transition hover:bg-[#1f1a1d] focus:outline-none focus:ring-4 focus:ring-black/25"
            >
              {ctaLabel}
              <ArrowLeft className="size-4" aria-hidden />
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center justify-center rounded-xl border border-[#231a05]/25 bg-white/25 px-6 py-3.5 text-sm font-semibold text-[#231a05] transition hover:bg-white/40 focus:outline-none focus:ring-4 focus:ring-black/15"
            >
              حساب دارم، وارد می‌شوم
            </Link>
          </div>

          <p className="flex items-center justify-center gap-1.5 pt-1 text-xs font-medium text-[#231a05]/75">
            <ShieldCheck className="size-3.5" aria-hidden />
            طلای شما بیمه و در خزانهٔ بانکی نگهداری می‌شود.
          </p>
        </div>
      </motion.div>
    </section>
  );
}
