'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { gsap, ScrollTrigger, registerScrollTrigger } from '@/lib/gsap';

const STEPS = [
  {
    title: 'آگهی طلافروش',
    description: 'مغازه‌دار طلاهایش را با قیمت و مشخصات روی سایت می‌گذارد.',
    image: '/landing/work-smile.jpg',
    alt: 'پرتره با جواهرات نقره و لبخند',
  },
  {
    title: 'مشاهده و مقایسه',
    description: 'مشتری آگهی‌ها را می‌بیند و همان طلا و همان فروشنده را انتخاب می‌کند.',
    image: '/landing/work-diamonds.jpg',
    alt: 'حلقه‌های برلیان',
  },
  {
    title: 'هماهنگی با مغازه',
    description: 'برای خرید حضوری، مستقیم با همان طلافروش هماهنگ می‌شوید.',
    image: '/landing/work-moon.jpg',
    alt: 'گوشوارهٔ نقره و تویید',
  },
  {
    title: 'خرید از فروشنده',
    description: 'معامله با مغازه‌دار است؛ پژواک خودش طلا نمی‌فروشد.',
    image: '/landing/work-jewelry.jpg',
    alt: 'نمای نزدیک جواهرات',
  },
  {
    title: 'تحویل با پیک',
    description: 'اگر نخواستید بروید مغازه، طلا را از همان فروشنده برایتان پیک می‌کنیم.',
    image: '/landing/work-campaign.jpg',
    alt: 'کمپین ادیتوریال جواهرات',
  },
] as const;

const WORK_BEATS = [
  { scaleAt: 0, fadeOutAt: 0.2 },
  { fadeInAt: 0.4, scaleAt: 0.4, fadeOutAt: 1 },
  { fadeInAt: 1.2, scaleAt: 1.2, fadeOutAt: 2 },
  { fadeInAt: 2.2, scaleAt: 2.2, fadeOutAt: 3 },
  { fadeInAt: 3.2, scaleAt: 3.2, holdAt: 3.4 },
] as const;

export function HowWeWork() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (window.matchMedia('(max-width: 1023px)').matches) return;

    registerScrollTrigger();

    const titles = section.querySelectorAll<HTMLElement>('.how-work-v1-title');
    const visuals = section.querySelectorAll<HTMLElement>('.how-work-v1-visual');
    const photos = section.querySelectorAll<HTMLElement>('.how-work-v1-photo');

    const ctx = gsap.context(() => {
      gsap.set(titles, { opacity: (index) => (index === 0 ? 1 : 0) });
      gsap.set(visuals, { opacity: (index) => (index === 0 ? 1 : 0) });
      gsap.set(photos, { scale: 1.2, transformOrigin: 'center center' });

      const timeline = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.8,
          invalidateOnRefresh: true,
        },
      });

      WORK_BEATS.forEach((beat, index) => {
        const title = titles[index];
        const visual = visuals[index];
        const photo = photos[index];
        if (!title || !visual || !photo) return;

        timeline.to(photo, { scale: 1, duration: 0.2 }, beat.scaleAt);

        if ('fadeInAt' in beat) {
          timeline.to([title, visual], { opacity: 1, duration: 0.2 }, beat.fadeInAt);
        }

        if ('fadeOutAt' in beat) {
          timeline.to([title, visual], { opacity: 0, duration: 0.2 }, beat.fadeOutAt);
        }

        if ('holdAt' in beat) {
          timeline.to([title, visual], { opacity: 1, duration: 1.1 }, beat.holdAt);
          timeline.to(photo, { scale: 1, duration: 1.1 }, beat.holdAt);
        }
      });
    }, section);

    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener('load', refresh);

    return () => {
      window.removeEventListener('load', refresh);
      ctx.revert();
    };
  }, []);

  return (
    <section ref={sectionRef} id="work" className="how-work-v1">
      <div className="how-work-v1-sticky">
        <div className="how-work-v1-left">
          <p className="how-work-v1-kicker">نحوهٔ کار</p>
          <div className="how-work-v1-titles">
            {STEPS.map((step) => (
              <div key={step.title} className="how-work-v1-title">
                <h2>{step.title}</h2>
                <p>{step.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="how-work-v1-right">
          {STEPS.map((step, index) => (
            <div key={step.title} className="how-work-v1-visual">
              <Image
                src={step.image}
                alt={step.alt}
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="how-work-v1-photo"
              />
              <p className="how-work-v1-number" dir="ltr">
                <span>{index + 1}</span>
                <span>/</span>
                <span>5</span>
              </p>
              <div className="how-work-v1-mobile-copy">
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="how-work-v1-spacer" aria-hidden />
    </section>
  );
}
