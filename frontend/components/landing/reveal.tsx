'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import { gsap, registerScrollTrigger } from '@/lib/gsap';
import { GSAP_EASE, TIMING } from '@/lib/motion';

/**
 * Scroll reveal using the same GSAP + ScrollTrigger path as hellohello
 * (power3.out, ~0.8s, start "top 85%").
 */
export function Reveal({
  children,
  className,
  delay = 0,
  y = 48,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    registerScrollTrigger();
    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { opacity: 0, y },
        {
          opacity: 1,
          y: 0,
          duration: TIMING.reveal,
          delay,
          ease: GSAP_EASE.power3Out,
          scrollTrigger: { trigger: el, start: 'top 85%' },
        },
      );
    }, ref);

    return () => ctx.revert();
  }, [delay, y]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

export function RevealGroup({
  children,
  className,
  stagger = TIMING.revealStagger,
}: {
  children: ReactNode;
  className?: string;
  stagger?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    registerScrollTrigger();
    const items = root.querySelectorAll<HTMLElement>('[data-reveal-item]');
    const ctx = gsap.context(() => {
      gsap.fromTo(
        items,
        { opacity: 0, y: 48 },
        {
          opacity: 1,
          y: 0,
          duration: TIMING.reveal,
          stagger,
          ease: GSAP_EASE.power3Out,
          scrollTrigger: { trigger: root, start: 'top 80%' },
        },
      );
    }, ref);

    return () => ctx.revert();
  }, [stagger]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

export function RevealItem({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
  y?: number;
}) {
  return (
    <div data-reveal-item className={className}>
      {children}
    </div>
  );
}

/** Kept so older Framer call-sites still compile if imported. */
export { EASE_OUT } from '@/lib/motion';
