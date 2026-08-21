'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, useMotionValue, useReducedMotion, useSpring } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { gsap, registerScrollTrigger } from '@/lib/gsap';
import { VaultTrustIcon } from './gold-icons';
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
      className="relative overflow-hidden border-b border-foreground/10 pt-28 pb-16 sm:pt-32 sm:pb-24"
      onPointerMove={handlePointerMove}
      onPointerLeave={() => {
        pointerX.set(0);
        pointerY.set(0);
      }}
    >
      <div className="relative mx-auto grid w-full max-w-7xl items-end gap-14 px-5 sm:px-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(280px,0.85fr)] lg:gap-10 lg:px-12">
        <div>
          <p
            style={stagger(0)}
            className="animate-fade-up mb-8 text-[11px] font-medium uppercase tracking-[0.28em] text-muted"
          >
            خرید / نگهداری / تحویل
          </p>

          <h1
            style={stagger(1)}
            className="animate-fade-up display-tight text-[clamp(2.7rem,9.5vw,7.25rem)] font-semibold leading-[1.05]"
          >
            طلای شما،
            <br />
            همیشه در
            <br />
            <span className="text-gold-gradient">دستان شما</span>
          </h1>

          <p
            style={stagger(2)}
            className="animate-fade-up mt-8 max-w-lg text-base leading-8 text-muted sm:text-lg"
          >
            با زرین‌سرمایه از هر مبلغی که دارید طلای ۱۸ عیار بخرید، در خزانهٔ بیمه‌شده نگه دارید و
            هر لحظه که خواستید بفروشید یا به‌صورت فیزیکی تحویل بگیرید.
          </p>

          <div style={stagger(3)} className="animate-fade-up mt-10 flex flex-wrap items-center gap-3">
            <Link
              href={ctaHref}
              className="bg-gold-metallic inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold text-on-gold shadow-lg shadow-gold-500/20 transition hover:shadow-xl hover:shadow-gold-500/30 focus:outline-none focus:ring-4 focus:ring-gold-500/30"
            >
              {ctaLabel}
              <ArrowLeft className="size-4" aria-hidden />
            </Link>
            <Link
              href="#features"
              className="inline-flex items-center justify-center border border-foreground/20 px-6 py-3.5 text-sm font-semibold transition hover:border-gold-500 hover:text-gold-700 focus:outline-none focus:ring-4 focus:ring-gold-500/20"
            >
              بیشتر بدانید
            </Link>
          </div>

          <p style={stagger(4)} className="animate-fade-up mt-16 text-xs tracking-wide text-muted">
            (برای ادامه اسکرول کنید)
          </p>
        </div>

        {/* Visual stack: GSAP moves the outer layer on scroll, Framer Motion handles
            the pointer parallax, and the inner layer floats on its own. */}
        <div ref={parallaxRef} className="relative">
          <motion.div style={{ x, y }} className="relative border border-foreground/15 bg-surface p-4 sm:p-6">
            <div className="mb-4 flex items-center justify-between text-[11px] uppercase tracking-[0.2em] text-muted">
              <span>شمش ۱۸ عیار</span>
              <span className="text-gold-700">۹۹۹.۹</span>
            </div>
            <motion.div
              animate={reduceMotion ? undefined : { y: [0, -14, 0] }}
              transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
            >
              <GoldBarVisual className="mx-auto w-full max-w-md drop-shadow-[0_24px_50px_rgba(120,90,20,0.22)]" />
            </motion.div>

            {/* Live price from the shared WebSocket connection. */}
            <LivePriceBadge className="right-4 top-16 sm:right-8" />
            <TrustPill className="bottom-10 left-4 sm:left-8" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function TrustPill({ className }: { className: string }) {
  return (
    <div
      className={`absolute flex items-center gap-3 border border-gold-500/25 bg-surface-translucent px-3.5 py-2.5 shadow-lg shadow-black/[0.06] backdrop-blur-md ${className}`}
    >
      <span className="grid size-8 place-items-center bg-gold-500/12 text-gold-700">
        <VaultTrustIcon className="size-4" />
      </span>
      <span className="leading-tight">
        <span className="block text-[11px] text-muted">خزانهٔ بانکی</span>
        <span className="block text-xs font-semibold">نگهداری بیمه‌شده</span>
      </span>
    </div>
  );
}
