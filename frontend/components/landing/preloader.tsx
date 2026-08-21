'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { EASE_OUT } from './reveal';

const STORAGE_KEY = 'zarin-preloader-seen';

/**
 * First-load branded intro: a small looping-style clip of the gold plus,
 * then the overlay expands away — same beat as hellohello's preloader.mp4.
 */
export function Preloader() {
  const reduceMotion = useReducedMotion();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (reduceMotion) return;
    try {
      if (sessionStorage.getItem(STORAGE_KEY) === '1') return;
    } catch {
      /* private mode */
    }
    setVisible(true);
    document.documentElement.style.overflow = 'hidden';

    const done = window.setTimeout(() => finish(), 2600);
    return () => {
      window.clearTimeout(done);
      document.documentElement.style.overflow = '';
    };
  }, [reduceMotion]);

  function finish() {
    try {
      sessionStorage.setItem(STORAGE_KEY, '1');
    } catch {
      /* ignore */
    }
    document.documentElement.style.overflow = '';
    setVisible(false);
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[80] grid place-items-center bg-black"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7, ease: EASE_OUT }}
          onClick={finish}
        >
          <motion.div
            initial={{ scale: 0.86, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.4, opacity: 0 }}
            transition={{ duration: 0.7, ease: EASE_OUT }}
            className="relative size-[150px] overflow-hidden bg-black"
          >
            <video
              src="/landing/preloader.mp4"
              autoPlay
              muted
              playsInline
              className="size-full object-cover"
            />
            <span className="pointer-events-none absolute inset-x-2 top-2 text-[11px] font-semibold tracking-[0.2em] text-white">
              ++
            </span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
