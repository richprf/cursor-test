'use client';

import { useEffect, useLayoutEffect, useRef, useState, type MouseEvent } from 'react';
import Image from 'next/image';
import { gsap, ScrollTrigger, registerScrollTrigger } from '@/lib/gsap';
import { GSAP_EASE } from '@/lib/motion';

const COVER_SCALE = 803 / 921;

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
    titleLines: ['طلسم ماه', 'و دریا'],
    description:
      'پلاک هلال و حلقهٔ دلفین در نور طبیعی — محصول سبک زندگی که به خرید خرد طلا وصل می‌شود، بدون اجرت پنهان.',
    src: '/landing/work-moon.jpg',
    video: '/landing/work-moon.mp4',
    icon: 'moon',
  },
] as const;

function useMobile(breakpoint = 1024) {
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    const media = window.matchMedia(`(max-width: ${breakpoint - 0.02}px)`);
    const sync = () => setMobile(media.matches);
    sync();
    media.addEventListener('change', sync);
    return () => media.removeEventListener('change', sync);
  }, [breakpoint]);
  return mobile;
}

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
  const mobile = useMobile();
  const sectionRef = useRef<HTMLElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const rowRefs = useRef<HTMLDivElement[]>([]);
  const coverRefs = useRef<HTMLDivElement[]>([]);
  const copyRefs = useRef<HTMLDivElement[]>([]);
  const titleRefs = useRef<HTMLDivElement[]>([]);
  const videoRefs = useRef<HTMLVideoElement[]>([]);
  const stillRefs = useRef<HTMLDivElement[]>([]);
  const [cursor, setCursor] = useState({ x: 0, y: 0, on: false });

  useLayoutEffect(() => {
    if (mobile) return;
    const section = sectionRef.current;
    const list = listRef.current;
    if (!section || !list) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    registerScrollTrigger();
    const rows = rowRefs.current.filter(Boolean);
    const covers = coverRefs.current.filter(Boolean);
    const copies = copyRefs.current.filter(Boolean);
    const count = rows.length;
    if (!count) return;

    const ctx = gsap.context(() => {
      const viewport = window.innerHeight;
      const width = window.innerWidth;
      const step = Math.max(518, 0.3597 * width) + Math.max(48, 0.0333 * width);

      gsap.set(rows[0], { opacity: 1 });
      gsap.set(covers[0], { scale: 1, transformOrigin: 'top left' });
      gsap.set(copies[0], { opacity: 1 });

      for (let index = 1; index < count; index += 1) {
        gsap.set(rows[index], { opacity: 0.6 });
        gsap.set(covers[index], { scale: COVER_SCALE, transformOrigin: 'top left' });
        gsap.set(copies[index], { opacity: 0 });
      }

      const headingWords = headingRef.current?.querySelectorAll('[data-word]');
      if (headingWords?.length) {
        gsap.set(headingWords, { yPercent: 200 });
        gsap.to(headingWords, {
          yPercent: 0,
          stagger: 0.06,
          duration: 0.6,
          ease: GSAP_EASE.power3Out,
          scrollTrigger: { trigger: section, start: 'top 70%', once: true },
        });
      }

      const firstTitle = titleRefs.current[0]?.querySelectorAll('[data-word]');
      if (firstTitle?.length) {
        gsap.set(firstTitle, { yPercent: 200 });
        gsap.to(firstTitle, {
          yPercent: 0,
          stagger: 0.02,
          duration: 0.45,
          ease: GSAP_EASE.power3Out,
          scrollTrigger: { trigger: section, start: 'top 70%', once: true },
        });
      }

      for (let index = 1; index < count; index += 1) {
        const words = titleRefs.current[index]?.querySelectorAll('[data-word]');
        if (words?.length) gsap.set(words, { yPercent: 200 });
      }

      const timeline = gsap.timeline({ defaults: { ease: 'none' } });
      for (let index = 0; index < count - 1; index += 1) {
        const at = index;
        timeline.to(list, { y: -(index + 1) * step, duration: 1 }, at);
        timeline.to(copies[index], { opacity: 0, duration: 0.15 }, at);
        timeline.to(rows[index], { opacity: 0.6, duration: 0.6 }, at);
        timeline.to(covers[index], { scale: COVER_SCALE, duration: 0.6 }, at);
        timeline.to(rows[index + 1], { opacity: 1, duration: 0.6 }, at);
        timeline.to(covers[index + 1], { scale: 1, duration: 0.6 }, at);
        timeline.to(copies[index + 1], { opacity: 1, duration: 0.001 }, at);
        const nextWords = titleRefs.current[index + 1]?.querySelectorAll('[data-word]');
        if (nextWords?.length) {
          timeline.to(nextWords, { yPercent: 0, stagger: 0.025, duration: 0.5, ease: GSAP_EASE.power3Out }, at);
        }
      }
      timeline.to({}, { duration: 0 }, count - 1);

      ScrollTrigger.create({
        trigger: section,
        pin: true,
        pinSpacing: true,
        scrub: 1.5,
        start: 'top top',
        end: `+=${1.75 * viewport}`,
        animation: timeline,
      });
    }, section);

    return () => ctx.revert();
  }, [mobile]);

  function play(index: number, event: MouseEvent) {
    const video = videoRefs.current[index];
    const still = stillRefs.current[index];
    if (video) {
      video.currentTime = 0;
      void video.play().catch(() => {});
      gsap.to(video, { opacity: 1, duration: 0.4 });
    }
    if (still) gsap.to(still, { opacity: 0, duration: 0.4 });
    setCursor({ x: event.clientX, y: event.clientY, on: true });
  }

  function stop(index: number) {
    const video = videoRefs.current[index];
    const still = stillRefs.current[index];
    if (video) {
      gsap.to(video, { opacity: 0, duration: 0.4, onComplete: () => video.pause() });
    }
    if (still) gsap.to(still, { opacity: 1, duration: 0.4 });
    setCursor((current) => ({ ...current, on: false }));
  }

  if (mobile) {
    return (
      <section id="work" className="bg-black px-4 pb-[60px] text-[#fafafa]">
        <div className="mb-10 border-t border-[#2e2e2e] py-3">
          <h2 className="display-tight text-[32px] font-bold leading-[0.86] tracking-[-0.016em]">Featured Work</h2>
        </div>
        <div className="space-y-8">
          {PROJECTS.map((project) => (
            <article key={project.slug}>
              <div className="relative mb-4 h-[220px] w-full overflow-hidden">
                <Image src={project.src} alt={project.titleLines.join(' ')} fill className="object-cover" sizes="100vw" />
              </div>
              <h3 className="display-tight text-[21px] font-bold leading-none tracking-[-0.016em]">
                {project.titleLines.join(' ')}
              </h3>
              <p className="mt-2.5 text-[13px] font-bold leading-[1.3] tracking-[-0.04em] text-[#777]">{project.description}</p>
            </article>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section
      id="work"
      ref={sectionRef}
      data-section="work"
      className="relative h-dvh overflow-hidden bg-black px-6 text-[#fafafa]"
    >
      <div
        aria-hidden
        className="pointer-events-none fixed z-[1000] whitespace-nowrap bg-black px-2 pb-2 pt-1.5 text-base font-bold leading-none tracking-[-0.04em] text-[#fafafa] transition-opacity duration-200"
        style={{
          left: cursor.x,
          top: cursor.y,
          transform: 'translate(-50%, -50%)',
          opacity: cursor.on ? 1 : 0,
        }}
      >
        {'>مشاهده پروژه<'}
      </div>

      <div
        ref={headingRef}
        className="relative z-10 flex h-[max(88px,6.11vw)] items-end overflow-hidden border-t border-[#2e2e2e] pb-[max(12px,0.83vw)]"
      >
        <h2 className="display-tight overflow-hidden whitespace-nowrap text-[max(64px,4.44vw)] font-bold leading-[0.86] tracking-[-0.016em]">
          {splitWords('Featured Work').map((word) => (
            <span key={word} className="inline-block overflow-hidden pb-[0.5em] pe-[0.25em] -mb-[0.5em]">
              <span data-word className="inline-block">
                {word}
              </span>
            </span>
          ))}
        </h2>
      </div>

      <div ref={listRef} className="flex flex-col gap-[max(48px,3.33vw)] pt-[max(48px,3.33vw)]">
        {PROJECTS.map((project, index) => (
          <article
            key={project.slug}
            ref={(node) => {
              if (node) rowRefs.current[index] = node;
            }}
            className="flex w-full flex-row items-start justify-between"
          >
            <div
              ref={(node) => {
                if (node) copyRefs.current[index] = node;
              }}
              className="flex w-[max(353px,24.5vw)] shrink-0 flex-col justify-between self-stretch"
              style={{ opacity: index === 0 ? 1 : 0 }}
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
                    if (node) titleRefs.current[index] = node;
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

            <div
              ref={(node) => {
                if (node) coverRefs.current[index] = node;
              }}
              className="relative h-[max(518px,35.97vw)] w-[max(921px,63.89vw)] shrink-0 origin-top-left cursor-none overflow-hidden rounded-[6px]"
              onMouseEnter={(event) => play(index, event)}
              onMouseLeave={() => stop(index)}
              onMouseMove={(event) => setCursor({ x: event.clientX, y: event.clientY, on: true })}
            >
              <div
                ref={(node) => {
                  if (node) stillRefs.current[index] = node;
                }}
                className="absolute inset-0"
              >
                <Image
                  src={project.src}
                  alt={project.titleLines.join(' ')}
                  fill
                  sizes="(max-width: 640px) 100vw, 64vw"
                  className="object-cover"
                  priority={index === 0}
                />
              </div>
              <video
                ref={(node) => {
                  if (node) videoRefs.current[index] = node;
                }}
                src={project.video}
                muted
                loop
                playsInline
                className="absolute inset-0 size-full object-cover"
                style={{ opacity: 0 }}
              />
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
