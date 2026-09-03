'use client';

/**
 * Easing extracted from hellohello.is page chunk (GSAP):
 *   power2.out  duration .15–.45  — hovers, nav, small UI
 *   power3.out  duration .5–.8    — section reveals, card copy
 *   power4.out  duration .6–1.3   — headlines / split-text
 * CSS cubic-bezier equivalents of GSAP Quad/Cubic/Quart/Quint.
 */
export const GSAP_EASE = {
  power2Out: 'power2.out',
  power3Out: 'power3.out',
  power4Out: 'power4.out',
  power2In: 'power2.in',
  none: 'none',
} as const;

export const CSS_EASE = {
  power2Out: 'cubic-bezier(0.215, 0.61, 0.355, 1)',
  power3Out: 'cubic-bezier(0.165, 0.84, 0.44, 1)',
  power4Out: 'cubic-bezier(0.23, 1, 0.32, 1)',
  power2In: 'cubic-bezier(0.55, 0.055, 0.675, 0.19)',
} as const;

/** Measured on the live site: preloader.mp4 duration, hero plus-bg loop. */
export const TIMING = {
  preloaderMs: 4671,
  preloaderFade: 0.6,
  heroLoopS: 10.6,
  heroWord: 1.3,
  heroWordStagger: 0.08,
  splitDuration: 1.1,
  splitStagger: 0.03,
  reveal: 0.8,
  revealStagger: 0.06,
  hoverCss: 0.6,
  hoverCopy: 0.5,
  nav: 0.4,
  marqueeLogos: 28,
  marqueeKeywords: 22,
} as const;

/** Framer Motion cubic tuples matching the same GSAP curves. */
export const EASE_OUT: [number, number, number, number] = [0.165, 0.84, 0.44, 1];
export const EASE_OUT_STRONG: [number, number, number, number] = [0.23, 1, 0.32, 1];
