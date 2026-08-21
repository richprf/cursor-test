'use client';

import { useRef, useState } from 'react';
import { gsap } from '@/lib/gsap';
import { CinematicMedia } from './cinematic-media';
import { GSAP_EASE, TIMING } from '@/lib/motion';
import { Section } from './section';
import { Reveal } from './reveal';

const PROJECTS = [
  {
    category: 'Fine Jewelry',
    title: 'مجموعهٔ شمش خزر',
    src: '/landing/work-jewelry.jpg',
    video: '/landing/work-jewelry.mp4',
    description:
      'کالکشن شمش ۱۸ عیار با بسته‌بندی پلمب و اصالت‌سنجی — سطح محصول همان چیزی است که در خزانه نگه می‌دارید.',
  },
  {
    category: 'Editorial Campaign',
    title: 'کمپین خزانه',
    src: '/landing/work-campaign.jpg',
    video: '/landing/work-campaign.mp4',
    description:
      'روایت نگهداری بیمه‌شده: طلای شما در خزانهٔ بانکی است، نه در ویترین مغازه — و هر لحظه قابل نقد شدن.',
  },
  {
    category: 'Product Photography',
    title: 'حلقه‌های خورشید',
    src: '/landing/work-product.jpg',
    video: '/landing/work-product.mp4',
    description:
      'عکاسی استودیویی حلقه و گوشواره برای ویترین خرید؛ نور فلز، بدون اجرت پنهان در روایت محصول.',
  },
  {
    category: 'Macro Detail',
    title: 'جزئیات ماکرو',
    src: '/landing/work-macro.jpg',
    video: '/landing/work-macro.mp4',
    description:
      'نمای نزدیک از بافت طلای ۱۸ عیار — جزئیات فلز، حلقه و پارچه در نور گرم استودیو.',
  },
];

export function FeaturedWork() {
  return (
    <Section id="work">
      <Reveal y={40}>
        <p className="text-[11px] uppercase tracking-[0.22em] text-muted">نمونه‌کار منتخب</p>
        <h2 className="display-tight mt-4 text-[clamp(2.2rem,6vw,5.5rem)] font-semibold">
          Featured Work
        </h2>
      </Reveal>

      <div className="mt-16 space-y-20 lg:space-y-28">
        {PROJECTS.map((project, index) => (
          <WorkCard key={project.title} project={project} offset={index % 2 === 1} />
        ))}
      </div>
    </Section>
  );
}

function WorkCard({
  project,
  offset,
}: {
  project: (typeof PROJECTS)[number];
  offset: boolean;
}) {
  const copyRef = useRef<HTMLParagraphElement>(null);
  const plateRef = useRef<HTMLDivElement>(null);
  const [hovering, setHovering] = useState(false);

  function play() {
    setHovering(true);
    if (copyRef.current) {
      gsap.to(copyRef.current, { opacity: 1, y: 0, duration: TIMING.hoverCopy, ease: GSAP_EASE.power3Out });
    }
    plateRef.current?.classList.add('is-playing');
  }

  function stop() {
    setHovering(false);
    if (copyRef.current) {
      gsap.to(copyRef.current, { opacity: 0.55, y: 8, duration: TIMING.hoverCopy, ease: GSAP_EASE.power3Out });
    }
    plateRef.current?.classList.remove('is-playing');
  }

  return (
    <Reveal y={48}>
      <article
        data-cursor
        className={`grid items-end gap-6 lg:grid-cols-12 ${offset ? 'lg:pt-10' : ''}`}
        onMouseEnter={play}
        onMouseLeave={stop}
      >
        <div className="space-y-4 lg:col-span-4">
          <p className="text-[11px] uppercase tracking-[0.2em] text-gold-700">{project.category}</p>
          <h3 className="display-tight text-3xl font-semibold sm:text-5xl">{project.title}</h3>
          <p ref={copyRef} className="max-w-sm text-sm leading-7 text-muted" style={{ opacity: 0.55 }}>
            {project.description}
          </p>
          <p className="text-xs tracking-tight text-foreground/60">
            {hovering ? '>مشاهده نمونه<' : '>مشاهده پروژه<'}
          </p>
        </div>

        <div ref={plateRef} className="work-cover relative aspect-video w-full overflow-hidden lg:col-span-8">
          <CinematicMedia
            image={project.src}
            video={project.video}
            alt={project.title}
            playing={hovering}
            sizes="(max-width: 1024px) 100vw, 66vw"
          />
        </div>
      </article>
    </Reveal>
  );
}
