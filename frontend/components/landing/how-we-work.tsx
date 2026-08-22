'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { gsap, ScrollTrigger, registerScrollTrigger } from '@/lib/gsap';

const STEPS = [
  {
    title: 'Initial Diagnosis',
    description: 'We assess your product, market, and key KPIs to understand your baseline.',
    image: '/landing/how-we-work/ws-01.avif',
    icon: '/landing/how-we-work/icon-01.svg',
    alt: 'Close-up of hands holding an open book with rainbow light reflections on its pages.',
  },
  {
    title: 'Strategic Audit',
    description: 'We identify opportunities, risks, and gaps across product, growth, and GTM.',
    image: '/landing/how-we-work/ws-02.avif',
    icon: '/landing/how-we-work/icon-02.svg',
    alt: 'Close-up of two hands shaking with soft natural light and a faint rainbow reflection.',
  },
  {
    title: 'Action Roadmap',
    description: 'We build a clear plan with priorities, objectives, and measurable deliverables.',
    image: '/landing/how-we-work/ws-03.avif',
    icon: '/landing/how-we-work/icon-03.svg',
    alt: 'A closed silver laptop balanced on the soles of black leather boots worn by raised legs.',
  },
  {
    title: 'Guided Execution',
    description: 'We work alongside you to implement growth and optimization tactics.',
    image: '/landing/how-we-work/ws-04.avif',
    icon: '/landing/how-we-work/icon-04.svg',
    alt: 'Person holding a closed laptop by its edge, with light creating subtle rainbow reflections.',
  },
  {
    title: 'Iteration & Metrics',
    description: 'We measure results and refine the plan through continuous cycles.',
    image: '/landing/how-we-work/ws-05.avif',
    icon: '/landing/how-we-work/icon-05.svg',
    alt: 'Close-up of a hand with fingers slightly bent and a small rainbow reflection on the skin.',
  },
] as const;

export function HowWeWork() {
  const sectionRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (window.matchMedia('(max-width: 1023px)').matches) return;

    registerScrollTrigger();
    const trigger = ScrollTrigger.create({
      trigger: section,
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: (self) => {
        const next = Math.min(STEPS.length - 1, Math.floor(self.progress * STEPS.length));
        setActive((current) => (current === next ? current : next));
      },
    });

    return () => {
      trigger.kill();
      gsap.set(section, { clearProps: 'all' });
    };
  }, []);

  return (
    <section ref={sectionRef} id="work" className="how-work-v1">
      <div className="how-work-v1-sticky">
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
              <Image src={step.icon} alt="" width={272} height={272} className="how-work-v1-icon" />
              <p className="how-work-v1-number">
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
