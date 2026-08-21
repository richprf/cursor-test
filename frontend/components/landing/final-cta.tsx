'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowUpLeft, ShieldCheck } from 'lucide-react';
import { gsap, registerScrollTrigger } from '@/lib/gsap';
import { GSAP_EASE, TIMING } from '@/lib/motion';

export function FinalCta({ ctaHref, ctaLabel }: { ctaHref: string; ctaLabel: string }) {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    registerScrollTrigger();
    const heading = root.querySelector('[data-cta-heading]');
    const ctx = gsap.context(() => {
      gsap.fromTo(
        heading,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: TIMING.reveal,
          ease: GSAP_EASE.power3Out,
          scrollTrigger: { trigger: root, start: 'top 70%' },
        },
      );
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={rootRef} className="relative min-h-dvh overflow-hidden bg-black text-gold-500">
      <div className="hero-loop pointer-events-none absolute inset-0 opacity-30" aria-hidden />
      <div className="absolute inset-0 bg-black/70" />

      <div className="relative mx-auto flex min-h-dvh max-w-[1600px] flex-col justify-between px-6 py-20">
        <div data-cta-heading className="flex flex-wrap items-start justify-between gap-6">
          <h2 className="display-tight max-w-4xl text-[clamp(2.6rem,8vw,7rem)] font-semibold leading-[0.95]">
            امروز اولین گرم
            <br />
            طلای خود را بخرید
          </h2>
          <p className="hidden text-[clamp(2rem,6vw,5rem)] font-semibold text-gold-500/80 lg:block">
            ©{String(new Date().getFullYear()).slice(2)}
          </p>
        </div>

        <div>
          <p className="max-w-lg text-sm leading-7 text-gold-500/80 sm:text-base">
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
        </div>
      </div>

      <Link
        href={ctaHref}
        className="relative flex w-full items-center justify-between bg-gold-500 px-6 py-6 text-lg font-semibold tracking-tight text-on-gold sm:py-8 sm:text-2xl"
      >
        <span>{ctaLabel}</span>
        <ArrowUpLeft className="size-6 sm:size-8" aria-hidden />
      </Link>
    </section>
  );
}
