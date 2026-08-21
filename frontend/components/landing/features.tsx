'use client';

import { useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import Image from 'next/image';
import { gsap, ScrollTrigger, registerScrollTrigger } from '@/lib/gsap';

/**
 * Pixel-faithful port of hellohello `WhatWeDo` (`#about` / `data-section="whatwedo"`).
 * Layout, pin, and timeline numbers are taken from their compiled page chunk:
 *   scale 0.4 + y: 50vh → scale 1 (1.5) and y 0 (3.5), starts 0 / 2.5 / 5.5
 *   pin + pinSpacing, scrub 1.5, start "top top", end += 1.7 * innerHeight
 *   mobile breakpoint: max-width 639.98px
 * Photos fill the three still frames (object-fit cover, no radius).
 */
const MOBILE_MQ = '(max-width: 639.98px)';

const HEADLINE_GRAY = 'چه می‌کنیم.';
const HEADLINE_REST = 'طلای شما، همیشه در دستان شما.';

const COPY_LEFT =
  'با زرین‌سرمایه از هر مبلغی طلای ۱۸ عیار بخرید، در خزانهٔ بیمه‌شده نگه دارید و هر لحظه بفروشید یا به‌صورت فیزیکی تحویل بگیرید.';
const COPY_RIGHT =
  'از خرید چند صد هزار تومانی تا تحویل شمش؛ همه در یک اپلیکیشن. بدون حداقل، بدون کارمزد خرید. با شما.';

const SHOTS = [
  { src: '/landing/whatwedo-1.jpg', label: 'خرید و فروش آنی' },
  { src: '/landing/whatwedo-2.jpg', label: 'نگهداری در خزانه' },
  { src: '/landing/whatwedo-3.jpg', label: 'تحویل فیزیکی' },
] as const;

const DESKTOP_FRAMES: CSSProperties[] = [
  {
    position: 'absolute',
    width: 493,
    height: 620,
    left: '50%',
    top: '45%',
    marginLeft: -246.5,
    marginTop: -310,
    zIndex: 1,
  },
  {
    position: 'absolute',
    width: 373,
    height: 257,
    left: '52%',
    top: '57%',
    marginLeft: -186.5,
    marginTop: -128.5,
    zIndex: 2,
  },
  {
    position: 'absolute',
    width: 215,
    height: 305,
    left: '43%',
    top: '65%',
    marginLeft: -107.5,
    marginTop: -152.5,
    zIndex: 3,
  },
];

const MOBILE_FRAMES: CSSProperties[] = [
  {
    position: 'absolute',
    width: 271,
    height: 340,
    left: '50%',
    top: '50%',
    marginLeft: -135.5,
    marginTop: -234,
    zIndex: 1,
  },
  {
    position: 'absolute',
    left: 16,
    right: 16,
    height: 257,
    top: '50%',
    marginTop: -48.5,
    zIndex: 2,
  },
  {
    position: 'absolute',
    width: 181,
    height: 257,
    left: '50%',
    marginLeft: -90.5,
    bottom: 142,
    zIndex: 3,
  },
];

export function Features() {
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const leftCopyRef = useRef<HTMLParagraphElement>(null);
  const rightCopyRef = useRef<HTMLParagraphElement>(null);
  const photoRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [isMobile, setIsMobile] = useState<boolean | null>(null);

  useLayoutEffect(() => {
    const mq = window.matchMedia(MOBILE_MQ);
    const sync = () => setIsMobile(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  useLayoutEffect(() => {
    const root = sectionRef.current;
    const headline = headlineRef.current;
    const leftCopy = leftCopyRef.current;
    const rightCopy = rightCopyRef.current;
    const photos = photoRefs.current.filter((el): el is HTMLDivElement => Boolean(el));
    if (!root || !headline || !leftCopy || !rightCopy || photos.length < 3 || isMobile === null) {
      return;
    }

    registerScrollTrigger();
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const headlineWords = headline.querySelectorAll<HTMLElement>('[data-about-word]');
    const leftWords = leftCopy.querySelectorAll<HTMLElement>('[data-about-copy]');
    const rightWords = rightCopy.querySelectorAll<HTMLElement>('[data-about-copy]');

    const clipLines = (el: HTMLElement) => {
      el.querySelectorAll<HTMLElement>('[data-about-clip]').forEach((line) => {
        line.style.overflow = 'hidden';
        line.style.paddingBottom = '0.5em';
        line.style.marginBottom = '-0.5em';
        line.style.paddingInlineEnd = '0.1em';
        line.style.marginInlineEnd = '-0.1em';
      });
    };
    clipLines(headline);
    clipLines(leftCopy);
    clipLines(rightCopy);

    const ctx = gsap.context(() => {
      if (reduce) {
        gsap.set(photos, { y: 0, scale: 1, opacity: 1 });
        gsap.set([headlineWords, leftWords, rightWords], { y: '0%' });
        return;
      }

      if (isMobile) {
        gsap.set(headlineWords, { y: '200%' });
        gsap.set(leftWords, { y: '200%' });
        gsap.set(rightWords, { y: '200%' });
        gsap.set(photos, { opacity: 0 });

        ScrollTrigger.create({
          trigger: root,
          start: 'top 85%',
          once: true,
          onEnter: () =>
            gsap.to(headlineWords, { y: '0%', stagger: 0.025, duration: 0.7, ease: 'power3.out' }),
        });
        ScrollTrigger.create({
          trigger: root,
          start: 'top 65%',
          once: true,
          onEnter: () => gsap.set(photos[0], { opacity: 1 }),
        });
        ScrollTrigger.create({
          trigger: root,
          start: 'top 45%',
          once: true,
          onEnter: () => gsap.set(photos[1], { opacity: 1 }),
        });
        ScrollTrigger.create({
          trigger: root,
          start: 'top 25%',
          once: true,
          onEnter: () => gsap.set(photos[2], { opacity: 1 }),
        });
        ScrollTrigger.create({
          trigger: root,
          start: 'top 8%',
          once: true,
          onEnter: () => {
            gsap.to(leftWords, { y: '0%', stagger: 0.015, duration: 0.6, ease: 'power3.out' });
            gsap.to(rightWords, {
              y: '0%',
              stagger: 0.015,
              duration: 0.6,
              delay: 0.1,
              ease: 'power3.out',
            });
          },
        });
        return;
      }

      gsap.set(photos, {
        scale: 0.4,
        y: () => 0.5 * window.innerHeight,
        transformOrigin: 'center center',
      });
      gsap.set(headlineWords, { y: '200%' });
      gsap.set(leftWords, { y: '200%' });
      gsap.set(rightWords, { y: '200%' });

      ScrollTrigger.create({
        trigger: root,
        start: 'top 60%',
        once: true,
        onEnter: () =>
          gsap.to(headlineWords, { y: '0%', stagger: 0.035, duration: 0.7, ease: 'power3.out' }),
      });

      const tl = gsap.timeline({ defaults: { ease: 'none' } });
      tl.to(photos[0], { scale: 1, duration: 1.5 }, 0);
      tl.to(photos[0], { y: 0, duration: 3.5 }, 0);
      tl.to(leftWords, { y: '0%', stagger: 0.1, duration: 0.08, ease: 'power2.out' }, 2.5);
      tl.to(photos[1], { scale: 1, duration: 1.5 }, 2.5);
      tl.to(photos[1], { y: 0, duration: 3.5 }, 2.5);
      tl.to(photos[2], { scale: 1, duration: 1.5 }, 5.5);
      tl.to(photos[2], { y: 0, duration: 3.5 }, 5.5);
      tl.to(rightWords, { y: '0%', stagger: 0.1, duration: 0.08, ease: 'power2.out' }, 9);
      tl.to(root, { duration: 0 }, 10.5);

      ScrollTrigger.create({
        trigger: root,
        pin: true,
        pinSpacing: true,
        scrub: 1.5,
        start: 'top top',
        end: () => `+=${1.7 * window.innerHeight}`,
        animation: tl,
        invalidateOnRefresh: true,
      });
    }, root);

    return () => ctx.revert();
  }, [isMobile]);

  const waiting = isMobile === null;
  const mobile = Boolean(isMobile);
  const frames = mobile ? MOBILE_FRAMES : DESKTOP_FRAMES;

  return (
    <section
      ref={sectionRef}
      id="features"
      data-section="whatwedo"
      className="relative overflow-hidden bg-black text-[#fafafa]"
      style={
        waiting
          ? { height: '100vh' }
          : mobile
            ? { minHeight: '100dvh', borderTop: '1px solid #2e2e2e' }
            : { height: '100vh' }
      }
    >
      <h2
        ref={headlineRef}
        className="pointer-events-none absolute z-10 m-0 mix-blend-difference"
        style={
          mobile
            ? {
                top: 60,
                left: 16,
                right: 16,
                fontWeight: 700,
                fontSize: 32,
                lineHeight: 0.88,
                letterSpacing: '-0.016em',
                color: '#fafafa',
              }
            : {
                top: 88,
                left: 'clamp(16px, 1.67vw, 24px)',
                right: 'clamp(16px, 1.67vw, 24px)',
                fontWeight: 700,
                fontSize: 'max(40px, 4.44vw)',
                lineHeight: 0.86,
                letterSpacing: '-0.016em',
                maxWidth: '85%',
                color: '#fafafa',
              }
        }
      >
        <SplitWords text={HEADLINE_GRAY} color="#777777" attr="data-about-word" />
        <SplitWords text={HEADLINE_REST} color="#fafafa" attr="data-about-word" />
      </h2>

      {frames.map((frame, index) => (
        <div
          key={SHOTS[index].src}
          ref={(el) => {
            photoRefs.current[index] = el;
          }}
          data-about-photo
          className="overflow-hidden will-change-transform"
          style={frame}
        >
          <Image
            src={SHOTS[index].src}
            alt={SHOTS[index].label}
            fill
            sizes="(max-width: 640px) 90vw, 493px"
            className="object-cover"
            priority={index === 0}
          />
        </div>
      ))}

      {mobile ? (
        <div
          className="absolute z-[5] flex gap-2"
          style={{ bottom: 24, left: 16, right: 16 }}
        >
          <p
            ref={leftCopyRef}
            className="m-0 flex-1"
            style={{
              fontWeight: 700,
              fontSize: 13,
              lineHeight: 1.2,
              letterSpacing: '-0.04em',
              color: '#fafafa',
            }}
          >
            <SplitWords text={COPY_LEFT} attr="data-about-copy" />
          </p>
          <p
            ref={rightCopyRef}
            className="m-0 flex-1"
            style={{
              fontWeight: 700,
              fontSize: 13,
              lineHeight: 1.2,
              letterSpacing: '-0.04em',
              color: '#fafafa',
            }}
          >
            <SplitWords text={COPY_RIGHT} attr="data-about-copy" />
          </p>
        </div>
      ) : (
        <>
          <p
            ref={leftCopyRef}
            className="absolute z-[5] m-0"
            style={{
              top: '50%',
              left: 'clamp(16px, 1.67vw, 24px)',
              right: '75%',
              fontWeight: 700,
              fontSize: 'max(20px, 1.4vw)',
              lineHeight: 1,
              letterSpacing: '-0.04em',
              color: '#fafafa',
            }}
          >
            <SplitWords text={COPY_LEFT} attr="data-about-copy" />
          </p>
          <p
            ref={rightCopyRef}
            className="absolute z-[5] m-0"
            style={{
              top: '50%',
              left: '75%',
              right: 'clamp(16px, 1.67vw, 24px)',
              fontWeight: 700,
              fontSize: 'max(20px, 1.4vw)',
              lineHeight: 1,
              letterSpacing: '-0.04em',
              color: '#fafafa',
            }}
          >
            <SplitWords text={COPY_RIGHT} attr="data-about-copy" />
          </p>
        </>
      )}
    </section>
  );
}

function SplitWords({
  text,
  color,
  attr,
}: {
  text: string;
  color?: string;
  attr: 'data-about-word' | 'data-about-copy';
}) {
  const words = text.trim().split(/\s+/);
  return (
    <>
      {words.map((word, index) => (
        <span key={`${word}-${index}`} data-about-clip className="inline-block align-bottom">
          <WordMark attr={attr} color={color}>
            {word}
            {index < words.length - 1 ? '\u00a0' : ''}
          </WordMark>
        </span>
      ))}{' '}
    </>
  );
}

function WordMark({
  attr,
  color,
  children,
}: {
  attr: 'data-about-word' | 'data-about-copy';
  color?: string;
  children: ReactNode;
}) {
  const style: CSSProperties = { color };
  if (attr === 'data-about-word') {
    return (
      <span data-about-word className="inline-block" style={style}>
        {children}
      </span>
    );
  }
  return (
    <span data-about-copy className="inline-block" style={style}>
      {children}
    </span>
  );
}
