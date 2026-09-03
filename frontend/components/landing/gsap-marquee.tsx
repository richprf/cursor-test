'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import { gsap } from '@/lib/gsap';
import { GSAP_EASE } from '@/lib/motion';

/** Infinite horizontal loop via GSAP (no CSS keyframes — hellohello has none). */
export function GsapMarquee({
  children,
  duration,
  className = '',
}: {
  children: ReactNode;
  duration: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const tween = gsap.to(el, {
      xPercent: -50,
      duration,
      ease: GSAP_EASE.none,
      repeat: -1,
    });
    return () => {
      tween.kill();
    };
  }, [duration]);

  return (
    <div className={`overflow-hidden ${className}`} dir="ltr">
      <div ref={ref} className="flex w-max will-change-transform">
        <div className="flex shrink-0">{children}</div>
        <div className="flex shrink-0" aria-hidden>
          {children}
        </div>
      </div>
    </div>
  );
}
