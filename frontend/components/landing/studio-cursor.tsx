'use client';

import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

/**
 * Studio cursor: a gold plus that follows the pointer and grows over
 * interactive targets — hellohello's hover language, mapped to gold.
 */
export function StudioCursor() {
  const reduceMotion = useReducedMotion();
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [hovering, setHovering] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (reduceMotion) return;
    if (!window.matchMedia('(pointer: fine)').matches) return;

    const onMove = (event: PointerEvent) => {
      setPos({ x: event.clientX, y: event.clientY });
      setVisible(true);
      const target = event.target as HTMLElement | null;
      const hit = Boolean(target?.closest('a, button, [data-cursor]'));
      setHovering(hit);
    };
    const onLeave = () => setVisible(false);

    window.addEventListener('pointermove', onMove);
    document.addEventListener('mouseleave', onLeave);
    return () => {
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('mouseleave', onLeave);
    };
  }, [reduceMotion]);

  if (reduceMotion || !visible) return null;

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed z-[90] mix-blend-difference"
      animate={{
        x: pos.x - 14,
        y: pos.y - 14,
        scale: hovering ? 2.15 : 1,
      }}
      transition={{ type: 'spring', stiffness: 500, damping: 32, mass: 0.35 }}
    >
      <span className="grid size-7 place-items-center text-[18px] font-light leading-none text-white">
        +
      </span>
    </motion.div>
  );
}
