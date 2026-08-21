'use client';

import { useEffect, useRef } from 'react';
import { gsap } from '@/lib/gsap';
import { GSAP_EASE, TIMING } from '@/lib/motion';

/** Gold plus that follows the pointer — duration .4 / power3.out (nav/hover curve). */
export function StudioCursor() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (!window.matchMedia('(pointer: fine)').matches) return;
    const el = ref.current;
    if (!el) return;

    const xTo = gsap.quickTo(el, 'x', { duration: TIMING.nav, ease: GSAP_EASE.power3Out });
    const yTo = gsap.quickTo(el, 'y', { duration: TIMING.nav, ease: GSAP_EASE.power3Out });

    const onMove = (event: PointerEvent) => {
      el.style.opacity = '1';
      xTo(event.clientX - 14);
      yTo(event.clientY - 14);
      const hit = Boolean((event.target as HTMLElement | null)?.closest('a, button, [data-cursor]'));
      gsap.to(el, { scale: hit ? 2.15 : 1, duration: TIMING.hoverCopy, ease: GSAP_EASE.power3Out });
    };
    const onLeave = () => {
      el.style.opacity = '0';
    };

    window.addEventListener('pointermove', onMove);
    document.addEventListener('mouseleave', onLeave);
    return () => {
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed top-0 left-0 z-[90] grid size-7 place-items-center text-[18px] font-light text-white mix-blend-difference"
      style={{ opacity: 0 }}
    >
      +
    </div>
  );
}
