'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { gsap, ScrollTrigger, registerScrollTrigger } from '@/lib/gsap';

const STEPS = [
  {
    title: 'Initial Diagnosis',
    description: 'We assess your product, market, and key KPIs to understand your baseline.',
    image: '/landing/work-smile.jpg',
    alt: 'پرتره با جواهرات نقره و لبخند',
  },
  {
    title: 'Strategic Audit',
    description: 'We identify opportunities, risks, and gaps across product, growth, and GTM.',
    image: '/landing/work-diamonds.jpg',
    alt: 'حلقه‌های برلیان',
  },
  {
    title: 'Action Roadmap',
    description: 'We build a clear plan with priorities, objectives, and measurable deliverables.',
    image: '/landing/work-moon.jpg',
    alt: 'گوشوارهٔ نقره و تویید',
  },
  {
    title: 'Guided Execution',
    description: 'We work alongside you to implement growth and optimization tactics.',
    image: '/landing/work-jewelry.jpg',
    alt: 'نمای نزدیک جواهرات',
  },
  {
    title: 'Iteration & Metrics',
    description: 'We measure results and refine the plan through continuous cycles.',
    image: '/landing/work-campaign.jpg',
    alt: 'کمپین ادیتوریال جواهرات',
  },
] as const;

const STEP_VIEWPORTS = 0.28;

export function HowWeWork() {
  const sectionRef = useRef<HTMLElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const section = sectionRef.current;
    const sticky = stickyRef.current;
    if (!section || !sticky) return;

    registerScrollTrigger();
    const media = gsap.matchMedia();

    media.add('(min-width: 1024px) and (prefers-reduced-motion: no-preference)', () => {
      const last = STEPS.length - 1;
      const photos = sticky.querySelectorAll<HTMLElement>('.how-work-v1-photo');

      const applyStep = (index: number, local = 0) => {
        setActive((current) => (current === index ? current : index));
        photos.forEach((photo, photoIndex) => {
          const progress = photoIndex === index ? local : photoIndex < index ? 1 : 0;
          gsap.set(photo, { scale: 1.2 - progress * 0.2 });
        });
      };

      applyStep(0, 0);

      const trigger = ScrollTrigger.create({
        trigger: section,
        pin: sticky,
        start: 'top top',
        end: () => `+=${last * window.innerHeight * STEP_VIEWPORTS}`,
        pinSpacing: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const raw = self.progress * STEPS.length;
          const index = Math.min(last, Math.floor(raw));
          const local = Math.min(1, raw - index);
          applyStep(index, local);
        },
      });

      const refresh = () => ScrollTrigger.refresh();
      window.addEventListener('load', refresh);

      return () => {
        window.removeEventListener('load', refresh);
        trigger.kill();
        gsap.set(photos, { clearProps: 'transform' });
        setActive(0);
      };
    });

    return () => {
      media.revert();
    };
  }, []);

  return (
    <section ref={sectionRef} id="work" className="how-work-v1">
      <div ref={stickyRef} className="how-work-v1-sticky">
        <div className="how-work-v1-left">
          <p className="how-work-v1-kicker">how we work</p>
          <div className="how-work-v1-titles">
            {STEPS.map((step, index) => (
              <div
                key={step.title}
                className={`how-work-v1-title${index === active ? ' is-active' : ''}`}
              >
                <h2>{step.title}</h2>
                <p>{step.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="how-work-v1-right">
          {STEPS.map((step, index) => (
            <div
              key={step.title}
              className={`how-work-v1-visual${index === active ? ' is-active' : ''}`}
            >
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
    </section>
  );
}
