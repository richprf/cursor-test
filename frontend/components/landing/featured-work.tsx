'use client';

import { useLayoutEffect, useRef, useState, type MouseEvent } from 'react';
import Image from 'next/image';
import { gsap, ScrollTrigger, registerScrollTrigger } from '@/lib/gsap';
import { GSAP_EASE } from '@/lib/motion';

const COVER_SCALE = 803 / 921;
const DESKTOP_MQ = '(min-width: 1024px)';

const PROJECTS = [
  {
    slug: 'smile',
    iconBg: '#D4AF37',
    titleLines: ['نقرهٔ صیقلی', 'و لبخند'],
    description:
      'کمپین ادیتوریال hoop و حلقه‌های چکشی — فلز صیقلی در نور استودیو، برای ویترینی که همان کیفیت خزانه را نشان می‌دهد.',
    src: '/landing/work-smile.jpg',
    video: '/landing/work-smile.mp4',
    icon: 'hoop',
  },
  {
    slug: 'diamonds',
    iconBg: '#F5C542',
    titleLines: ['حلقه‌های', 'برلیان'],
    description:
      'نمای نزدیک از چند حلقه با برش زمردی و اشکی — درخشش سنگ روی دست، همان دقتی که برای اصالت طلای ۱۸ عیار می‌خواهید.',
    src: '/landing/work-diamonds.jpg',
    video: '/landing/work-diamonds.mp4',
    icon: 'diamond',
  },
  {
    slug: 'moon',
    iconBg: '#B8860B',
    titleLines: ['گوشوارهٔ نقره', 'و تویید'],
    description:
      'پرترهٔ ادیتوریال با گوشوارهٔ شیاردار و حلقهٔ باریک — نور نرم استودیو روی بافت پارچه و فلز، برای ویترین کالکشن.',
    src: '/landing/work-moon.jpg',
    video: '/landing/work-moon.mp4',
    icon: 'moon',
  },
] as const;

function splitWords(text: string) {
  return text.split(/\s+/).filter(Boolean);
}

function ProjectIcon({ kind }: { kind: (typeof PROJECTS)[number]['icon'] }) {
  if (kind === 'diamond') {
    return (
      <svg viewBox="0 0 40 40" className="size-full" aria-hidden>
        <path fill="#111" d="M20 8 30 16 20 32 10 16Z" />
      </svg>
    );
  }
  if (kind === 'moon') {
    return (
      <svg viewBox="0 0 40 40" className="size-full" aria-hidden>
        <path fill="#111" d="M24 8a12 12 0 1 0 8 20 14 14 0 1 1-8-20Z" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 40 40" className="size-full" aria-hidden>
      <circle cx="20" cy="20" r="10" fill="none" stroke="#111" strokeWidth="3" />
    </svg>
  );
}

export function FeaturedWork() {
  const sectionRef = useRef<HTMLElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const rowRefs = useRef<(HTMLDivElement | null)[]>([]);
  const coverRefs = useRef<(HTMLDivElement | null)[]>([]);
  const copyRefs = useRef<(HTMLDivElement | null)[]>([]);
  const titleRefs = useRef<(HTMLDivElement | null)[]>([]);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const stillRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [isDesktop, setIsDesktop] = useState<boolean | null>(null);

  useLayoutEffect(() => {
    const media = window.matchMedia(DESKTOP_MQ);
    const sync = () => setIsDesktop(media.matches);
    sync();
    media.addEventListener('change', sync);
    return () => media.removeEventListener('change', sync);
  }, []);

  useLayoutEffect(() => {
    if (isDesktop === null) return;
    const section = sectionRef.current;
    const list = listRef.current;
    if (!section || !list) return;

    registerScrollTrigger();
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const rows = rowRefs.current.filter((el): el is HTMLDivElement => Boolean(el));
    const covers = coverRefs.current.filter((el): el is HTMLDivElement => Boolean(el));
    const copies = copyRefs.current.filter((el): el is HTMLDivElement => Boolean(el));
    const videos = videoRefs.current.filter((el): el is HTMLVideoElement => Boolean(el));
    const stills = stillRefs.current.filter((el): el is HTMLDivElement => Boolean(el));
    const count = rows.length;
    if (!count) return;

    const ctx = gsap.context(() => {
      gsap.set(videos, { opacity: 0 });
      gsap.set(stills, { opacity: 1 });

      const headingWords = headingRef.current?.querySelectorAll<HTMLElement>('[data-word]');
      const titleWordSets = titleRefs.current.map((el) => el?.querySelectorAll<HTMLElement>('[data-word]') ?? []);

      if (!isDesktop || reduce) {
        gsap.set(rows, { opacity: 1, y: 0 });
        gsap.set(covers, { scale: 1 });
        gsap.set(copies, { opacity: 1 });
        if (headingWords?.length) gsap.set(headingWords, { y: '0%' });
        titleWordSets.forEach((words) => {
          if (words.length) gsap.set(words, { y: '0%' });
        });
        return;
      }

      const step = () => {
        const coverHeight = covers[0]?.offsetHeight || Math.max(518, 0.3597 * window.innerWidth);
        const gap = Math.max(48, 0.0333 * window.innerWidth);
        return coverHeight + gap;
      };

      gsap.set(rows[0], { opacity: 1 });
      gsap.set(covers[0], { scale: 1, transformOrigin: 'top left' });
      gsap.set(copies[0], { opacity: 1 });

      for (let index = 1; index < count; index += 1) {
        gsap.set(rows[index], { opacity: 0.6 });
        gsap.set(covers[index], { scale: COVER_SCALE, transformOrigin: 'top left' });
        gsap.set(copies[index], { opacity: 0 });
      }

      if (headingWords?.length) {
        gsap.set(headingWords, { y: '200%' });
        ScrollTrigger.create({
          trigger: section,
          start: 'top 70%',
          once: true,
          onEnter: () => gsap.to(headingWords, { y: '0%', stagger: 0.06, duration: 0.6, ease: GSAP_EASE.power3Out }),
        });
      }

      if (titleWordSets[0]?.length) {
        gsap.set(titleWordSets[0], { y: '200%' });
        ScrollTrigger.create({
          trigger: section,
          start: 'top 70%',
          once: true,
          onEnter: () =>
            gsap.to(titleWordSets[0], { y: '0%', stagger: 0.02, duration: 0.45, ease: GSAP_EASE.power3Out }),
        });
      }

      for (let index = 1; index < count; index += 1) {
        if (titleWordSets[index]?.length) gsap.set(titleWordSets[index], { y: '200%' });
      }

      const timeline = gsap.timeline({ defaults: { ease: 'none' } });
      for (let index = 0; index < count - 1; index += 1) {
        const at = index;
        timeline.to(list, { y: () => -(index + 1) * step(), duration: 1 }, at);
        timeline.to(copies[index], { opacity: 0, duration: 0.15 }, at);
        timeline.to(rows[index], { opacity: 0.6, duration: 0.6 }, at);
        timeline.to(covers[index], { scale: COVER_SCALE, duration: 0.6 }, at);
        timeline.to(rows[index + 1], { opacity: 1, duration: 0.6 }, at);
        timeline.to(covers[index + 1], { scale: 1, duration: 0.6 }, at);
        timeline.to(copies[index + 1], { opacity: 1, duration: 0.001 }, at);
        if (titleWordSets[index + 1]?.length) {
          timeline.to(
            titleWordSets[index + 1],
            { y: '0%', stagger: 0.025, duration: 0.5, ease: GSAP_EASE.power3Out },
            at,
          );
        }
      }
      timeline.to({}, { duration: 0 }, count - 1);

      ScrollTrigger.create({
        trigger: section,
        pin: true,
        pinSpacing: true,
        scrub: 1.5,
        start: 'top top',
        end: () => `+=${1.75 * window.innerHeight}`,
        animation: timeline,
        invalidateOnRefresh: true,
      });
    }, section);

    return () => ctx.revert();
  }, [isDesktop]);

  function moveLabel(x: number, y: number, on?: boolean) {
    const el = labelRef.current;
    if (!el) return;
    el.style.left = `${x}px`;
    el.style.top = `${y}px`;
    if (on !== undefined) el.style.opacity = on ? '1' : '0';
  }

  function play(index: number, event: MouseEvent) {
    const video = videoRefs.current[index];
    const still = stillRefs.current[index];
    if (video) {
      gsap.killTweensOf(video);
      video.currentTime = 0;
      void video.play().catch(() => {});
      gsap.to(video, { opacity: 1, duration: 0.4, overwrite: true });
    }
    if (still) {
      gsap.killTweensOf(still);
      gsap.to(still, { opacity: 0, duration: 0.4, overwrite: true });
    }
    moveLabel(event.clientX, event.clientY, true);
  }

  function stop(index: number) {
    const video = videoRefs.current[index];
    const still = stillRefs.current[index];
    if (video) {
      gsap.killTweensOf(video);
      gsap.to(video, {
        opacity: 0,
        duration: 0.4,
        overwrite: true,
        onComplete: () => video.pause(),
      });
    }
    if (still) {
      gsap.killTweensOf(still);
      gsap.to(still, { opacity: 1, duration: 0.4, overwrite: true });
    }
    moveLabel(0, 0, false);
  }

  const waiting = isDesktop === null;
  const desktop = Boolean(isDesktop);

  return (
    <section
      id="work"
      ref={sectionRef}
      data-section="work"
      className={`relative bg-black text-[#fafafa] ${
        waiting || desktop
          ? 'h-dvh overflow-hidden px-6 motion-reduce:!h-auto motion-reduce:!overflow-visible'
          : 'px-4 pb-[60px]'
      }`}
    >
      <div
        ref={labelRef}
        aria-hidden
        className="pointer-events-none fixed z-[1000] whitespace-nowrap bg-black px-2 pb-2 pt-1.5 text-base font-bold leading-none tracking-[-0.04em] text-[#fafafa]"
        style={{ left: 0, top: 0, transform: 'translate(-50%, -50%)', opacity: 0 }}
      >
        {'>مشاهده پروژه<'}
      </div>

      <div
        ref={headingRef}
        className={`relative z-10 overflow-hidden border-t border-[#2e2e2e] ${
          desktop ? 'flex h-[max(88px,6.11vw)] items-end pb-[max(12px,0.83vw)]' : 'mb-10 py-3'
        }`}
      >
        <h2
          className={`display-tight font-bold tracking-[-0.016em] ${
            desktop
              ? 'overflow-hidden whitespace-nowrap text-[max(64px,4.44vw)] leading-[0.86]'
              : 'text-[32px] leading-[0.86]'
          }`}
        >
          {splitWords('Featured Work').map((word) => (
            <span key={word} className="inline-block overflow-hidden pb-[0.5em] pe-[0.25em] -mb-[0.5em]">
              <span data-word className="inline-block">
                {word}
              </span>
            </span>
          ))}
        </h2>
      </div>

      <div
        ref={listRef}
        className={desktop ? 'flex flex-col gap-[max(48px,3.33vw)] pt-[max(48px,3.33vw)]' : 'space-y-8'}
      >
        {PROJECTS.map((project, index) => (
          <article
            key={project.slug}
            ref={(node) => {
              rowRefs.current[index] = node;
            }}
            className={desktop ? 'flex w-full flex-row items-start justify-between gap-6' : undefined}
          >
            {desktop ? (
              <div
                ref={(node) => {
                  copyRefs.current[index] = node;
                }}
                className="flex w-[clamp(220px,24.5vw,353px)] shrink-0 flex-col justify-between self-stretch"
              >
                <div className="flex flex-col gap-[max(16px,1.11vw)]">
                  <div
                    className="flex size-[max(40px,2.78vw)] shrink-0 items-center justify-center overflow-hidden rounded-[max(4.3px,0.298vw)]"
                    style={{ backgroundColor: project.iconBg }}
                  >
                    <ProjectIcon kind={project.icon} />
                  </div>
                  <h3
                    ref={(node) => {
                      titleRefs.current[index] = node;
                    }}
                    className="display-tight text-[max(40px,2.76vw)] font-bold leading-none tracking-[-0.016em]"
                  >
                    {project.titleLines.map((line) => (
                      <span key={line} className="block overflow-hidden pb-[0.5em] -mb-[0.5em]">
                        {splitWords(line).map((word) => (
                          <span key={word} data-word className="inline-block pe-[0.25em]">
                            {word}
                          </span>
                        ))}
                      </span>
                    ))}
                  </h3>
                </div>
                <p className="max-w-[max(332px,23.06vw)] text-[max(16px,1.12vw)] font-bold leading-[1.4] tracking-[-0.04em] text-[#777]">
                  {project.description}
                </p>
              </div>
            ) : null}

            <div
              ref={(node) => {
                coverRefs.current[index] = node;
              }}
              className={
                desktop
                  ? 'relative aspect-[921/518] min-h-[280px] min-w-0 flex-1 origin-top-left cursor-none overflow-hidden rounded-[6px]'
                  : 'relative mb-4 h-[220px] w-full overflow-hidden'
              }
              onMouseEnter={desktop ? (event) => play(index, event) : undefined}
              onMouseLeave={desktop ? () => stop(index) : undefined}
              onMouseMove={desktop ? (event) => moveLabel(event.clientX, event.clientY) : undefined}
            >
              <div
                ref={(node) => {
                  stillRefs.current[index] = node;
                }}
                className="absolute inset-0"
              >
                <Image
                  src={project.src}
                  alt={project.titleLines.join(' ')}
                  fill
                  sizes="(max-width: 1023px) 100vw, 64vw"
                  className="object-cover"
                  priority={index === 0}
                />
              </div>
              {desktop ? (
                <video
                  ref={(node) => {
                    videoRefs.current[index] = node;
                  }}
                  src={project.video}
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  className="absolute inset-0 size-full object-cover"
                />
              ) : null}
            </div>

            {desktop ? null : (
              <>
                <h3 className="display-tight text-[21px] font-bold leading-none tracking-[-0.016em]">
                  {project.titleLines.join(' ')}
                </h3>
                <p className="mt-2.5 text-[13px] font-bold leading-[1.3] tracking-[-0.04em] text-[#777]">
                  {project.description}
                </p>
              </>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}
