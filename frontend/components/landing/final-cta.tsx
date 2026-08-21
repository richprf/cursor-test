'use client';

import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowUpLeft, ShieldCheck } from 'lucide-react';
import { EASE_OUT } from './reveal';

export function FinalCta({ ctaHref, ctaLabel }: { ctaHref: string; ctaLabel: string }) {
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative overflow-hidden bg-black text-gold-500">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage: 'url(/landing/gold-hero-plus.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'grayscale(0.2) contrast(1.1)',
        }}
      />
      <div className="absolute inset-0 bg-black/75" />

      <motion.div
        initial={{ opacity: 0, y: reduceMotion ? 0 : 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.35 }}
        transition={{ duration: 0.8, ease: EASE_OUT }}
        className="relative mx-auto max-w-[1600px] px-5 py-20 sm:px-8 lg:px-10 lg:py-28"
      >
        <div className="flex flex-wrap items-start justify-between gap-6">
          <h2 className="display-tight max-w-4xl text-[clamp(2.6rem,8vw,7rem)] font-semibold leading-[0.95] text-gold-500">
            امروز اولین گرم
            <br />
            طلای خود را بخرید
          </h2>
          <p className="hidden text-[clamp(2rem,6vw,5rem)] font-semibold text-gold-500/80 lg:block">
            ©{String(new Date().getFullYear()).slice(2)}
          </p>
        </div>
        <p className="mt-8 max-w-lg text-sm leading-7 text-gold-500/80 sm:text-base">
          ثبت‌نام رایگان است و در چند دقیقه انجام می‌شود. بدون حداقل مبلغ، بدون کارمزد خرید.
        </p>
        <p className="mt-4 flex items-center gap-1.5 text-xs text-gold-500/70">
          <ShieldCheck className="size-3.5" aria-hidden />
          طلای شما بیمه و در خزانهٔ بانکی نگهداری می‌شود.
        </p>
        <Link
          href="/login"
          className="mt-6 inline-block text-sm text-gold-500 underline-offset-4 hover:underline"
        >
          حساب دارم، وارد می‌شوم
        </Link>
      </motion.div>

      <Link
        href={ctaHref}
        className="relative flex w-full items-center justify-between bg-gold-500 px-5 py-6 text-lg font-semibold tracking-tight text-on-gold sm:px-8 sm:py-8 sm:text-2xl lg:px-10"
      >
        <span>{ctaLabel}</span>
        <ArrowUpLeft className="size-6 sm:size-8" aria-hidden />
      </Link>
    </section>
  );
}
