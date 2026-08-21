'use client';

import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowLeft, ShieldCheck } from 'lucide-react';
import { EASE_OUT } from './reveal';

export function FinalCta({ ctaHref, ctaLabel }: { ctaHref: string; ctaLabel: string }) {
  const reduceMotion = useReducedMotion();

  return (
    <section className="border-t border-foreground/10">
      <motion.div
        initial={{ opacity: 0, y: reduceMotion ? 0 : 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.35 }}
        transition={{ duration: 0.6, ease: EASE_OUT }}
        className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-12 lg:py-28"
      >
        <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-muted">قدم بعد</p>
        <h2 className="display-tight mt-6 max-w-4xl text-[clamp(2.4rem,7.5vw,6.25rem)] font-semibold leading-[1.08]">
          امروز اولین گرم طلای خود را بخرید
        </h2>
        <p className="mt-8 max-w-xl text-base leading-8 text-muted sm:text-lg">
          ثبت‌نام رایگان است و در چند دقیقه انجام می‌شود. بدون حداقل مبلغ، بدون کارمزد خرید.
        </p>
        <p className="mt-6 flex items-center gap-1.5 text-xs text-muted">
          <ShieldCheck className="size-3.5 text-gold-700" aria-hidden />
          طلای شما بیمه و در خزانهٔ بانکی نگهداری می‌شود.
        </p>
        <Link
          href="/login"
          className="mt-8 inline-block text-sm font-medium text-foreground underline-offset-4 hover:text-gold-700 hover:underline"
        >
          حساب دارم، وارد می‌شوم
        </Link>
      </motion.div>

      <Link
        href={ctaHref}
        className="bg-gold-metallic flex w-full items-center justify-center gap-3 px-5 py-6 text-lg font-semibold tracking-tight text-on-gold transition hover:opacity-95 sm:py-8 sm:text-2xl"
      >
        {ctaLabel}
        <ArrowLeft className="size-6 sm:size-7" aria-hidden />
      </Link>
    </section>
  );
}
