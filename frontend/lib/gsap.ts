'use client';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/**
 * ScrollTrigger reads `document` on registration, so components call this from an
 * effect instead of at module scope. Registering twice is a no-op.
 */
export function registerScrollTrigger() {
  gsap.registerPlugin(ScrollTrigger);
}

export { gsap, ScrollTrigger };
