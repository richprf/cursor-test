'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, useMotionValue, useReducedMotion, useSpring } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { ctaPrimaryClass, ctaSecondaryClass } from '@/components/ui';
import { gsap, registerScrollTrigger } from '@/lib/gsap';
import { SparkleBadgeIcon, VaultTrustIcon } from './gold-icons';
import { GoldBarVisual } from './gold-bar-visual';
import { LivePriceBadge } from './live-price';

/** Chained entrance: each element starts 90ms after the previous one. */
function stagger(step: number) {
  return { animationDelay: `${step * 90}ms` };
}

export function Hero({ ctaHref, ctaLabel }: { ctaHref: string; ctaLabel: string }) {
  const reduceMotion = useReducedMotion();
  const parallaxRef = useRef<HTMLDivElement>(null);

  // Mouse parallax: springs keep the visual from snapping to the cursor.
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const x = useSpring(pointerX, { stiffness: 90, damping: 18, mass: 0.4 });
  const y = useSpring(pointerY, { stiffness: 90, damping: 18, mass: 0.4 });

  // Scroll parallax on the visual — desktop only, and never for reduced motion.
  useEffect(() => {
    registerScrollTrigger();
    const mm = gsap.matchMedia();

    mm.add('(min-width: 1024px) and (prefers-reduced-motion: no-preference)', () => {
      gsap.to(parallaxRef.current, {
        y: 90,
        ease: 'none',
        scrollTrigger: {
          trigger: parallaxRef.current,
          start: 'top 20%',
          end: 'bottom top',
          scrub: true,
        },
      });
    });

    return () => mm.revert();
  }, []);

  function handlePointerMove(event: React.PointerEvent<HTMLDivElement>) {
    // Mouse only: on touch, a pointermove means the user is dragging the page.
    if (reduceMotion || event.pointerType !== 'mouse') return;

    const bounds = event.currentTarget.getBoundingClientRect();
    const offsetX = (event.clientX - bounds.left) / bounds.width - 0.5;
    const offsetY = (event.clientY - bounds.top) / bounds.height - 0.5;
    pointerX.set(offsetX * -28);
    pointerY.set(offsetY * -20);
  }

  return (
    <section
      className="relative overflow-hidden pt-28 pb-16 sm:pt-32 sm:pb-24"
      onPointerMove={handlePointerMove}
      onPointerLeave={() => {
        pointerX.set(0);
        pointerY.set(0);
      }}
    >
      <div aria-hidden className="bg-hero-grid pointer-events-none absolute inset-0" />

      <div className="relative mx-auto grid w-full max-w-6xl items-center gap-14 px-5 sm:px-8 lg:grid-cols-[1.05fr_1fr] lg:gap-8">
        <div className="space-y-7">
          <span
            style={stagger(0)}
            className="animate-fade-up inline-flex items-center gap-2 rounded-full border border-gold-500/25 bg-gold-500/[0.12] px-3.5 py-1.5 text-xs font-medium text-gold-700"
          >
            <SparkleBadgeIcon className="size-3.5" />
            خرید طلای آب‌شده با کارمزد صفر
          </span>

          <h1
            style={stagger(1)}
            className="animate-fade-up text-3xl font-black leading-[1.35] sm:text-4xl sm:leading-[1.3] lg:text-5xl lg:leading-[1.25]"
          >
            طلای شما، همیشه در <span className="text-gold-gradient">دستان شما</span>
          </h1>

          <p
            style={stagger(2)}
            className="animate-fade-up max-w-xl text-sm leading-8 text-muted sm:text-base"
          >
            با زرین‌سرمایه از هر مبلغی که دارید طلای ۱۸ عیار بخرید، در خزانهٔ بیمه‌شده نگه دارید و
            هر لحظه که خواستید بفروشید یا به‌صورت فیزیکی تحویل بگیرید.
          </p>

          <div style={stagger(3)} className="animate-fade-up flex flex-wrap items-center gap-3">
            <Link href={ctaHref} className={ctaPrimaryClass}>
              {ctaLabel}
              <ArrowLeft className="size-4" aria-hidden />
            </Link>
            <Link href="#features" className={ctaSecondaryClass}>
              بیشتر بدانید
            </Link>
          </div>

          <p style={stagger(4)} className="animate-fade-up text-xs leading-6 text-muted/80">
            بدون حداقل مبلغ • احراز هویت در چند دقیقه • پشتیبانی شبانه‌روزی
          </p>
        </div>

        {/* Visual stack: GSAP moves the outer layer on scroll, Framer Motion handles
            the pointer parallax, and the inner layer floats on its own. */}
        <div ref={parallaxRef} className="relative">
          <motion.div style={{ x, y }} className="relative">
            <motion.div
              animate={reduceMotion ? undefined : { y: [0, -14, 0] }}
              transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
            >
              <GoldBarVisual className="mx-auto w-full max-w-md drop-shadow-[0_24px_50px_rgba(120,90,20,0.22)]" />
            </motion.div>

            {/* Live price from the shared WebSocket connection. */}
            <LivePriceBadge className="right-0 top-6 sm:right-4" />
            <TrustPill className="bottom-8 left-0 sm:left-2" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function TrustPill({ className }: { className: string }) {
  return (
    <div
      className={`absolute flex items-center gap-3 rounded-2xl border border-gold-500/25 bg-white/85 px-3.5 py-2.5 shadow-lg shadow-black/[0.06] backdrop-blur-md ${className}`}
    >
      <span className="grid size-8 place-items-center rounded-xl bg-gold-500/12 text-gold-700">
        <VaultTrustIcon className="size-4" />
      </span>
      <span className="leading-tight">
        <span className="block text-[11px] text-muted">خزانهٔ بانکی</span>
        <span className="block text-xs font-semibold">نگهداری بیمه‌شده</span>
      </span>
    </div>
  );
}
