'use client';

import { useEffect, useState } from 'react';
import { gsap } from '@/lib/gsap';
import { GSAP_EASE, TIMING } from '@/lib/motion';

const STORAGE_KEY = 'zarin-preloader-seen';

/**
 * Video-based first load: 150×150 stage (hellohello preloader.mp4 is 150px,
 * 4.671s, no loop) then overlay fades with power4.out / 0.6s.
 */
export function Preloader() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    try {
      if (sessionStorage.getItem(STORAGE_KEY) === '1') return;
    } catch {
      /* ignore */
    }

    setVisible(true);
    document.documentElement.style.overflow = 'hidden';

    const overlay = document.getElementById('studio-preloader');
    const stage = overlay?.querySelector('[data-preloader-stage]');
    if (overlay && stage) {
      gsap.fromTo(
        stage,
        { scale: 0.86, opacity: 0 },
        { scale: 1, opacity: 1, duration: 1.5, ease: GSAP_EASE.power4Out },
      );
    }

    const done = window.setTimeout(() => finish(overlay), TIMING.preloaderMs);
    return () => {
      window.clearTimeout(done);
      document.documentElement.style.overflow = '';
    };
  }, []);

  function finish(overlay: HTMLElement | null) {
    try {
      sessionStorage.setItem(STORAGE_KEY, '1');
    } catch {
      /* ignore */
    }
    if (!overlay) {
      setVisible(false);
      document.documentElement.style.overflow = '';
      return;
    }
    gsap.to(overlay, {
      opacity: 0,
      duration: TIMING.preloaderFade,
      ease: GSAP_EASE.power4Out,
      onComplete: () => {
        document.documentElement.style.overflow = '';
        setVisible(false);
      },
    });
  }

  if (!visible) return null;

  return (
    <div
      id="studio-preloader"
      className="fixed inset-0 z-[80] grid place-items-center bg-black"
      onClick={() => finish(document.getElementById('studio-preloader'))}
    >
      <div
        data-preloader-stage
        className="relative size-[150px] overflow-hidden bg-black"
      >
        <div className="gold-plate gold-plate-motion absolute inset-0" />
        <span className="pointer-events-none absolute inset-x-2 top-2 text-[11px] font-semibold tracking-[0.28em] text-white">
          ++
        </span>
      </div>
    </div>
  );
}
