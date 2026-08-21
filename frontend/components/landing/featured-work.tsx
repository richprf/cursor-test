'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Section } from './section';
import { Reveal } from './reveal';
import { EASE_OUT } from './reveal';

const PROJECTS = [
  {
    category: 'طراحی جواهر',
    title: 'مجموعهٔ شمش خزر',
    description:
      'کالکشن شمش ۱۸ عیار با بسته‌بندی پلمب و اصالت‌سنجی — سطح محصول همان چیزی است که در خزانه نگه می‌دارید.',
    image: '/landing/gold-work-ingot.png',
    video: '/landing/work-ingot.mp4',
  },
  {
    category: 'عکاسی محصول',
    title: 'حلقه‌های خورشید',
    description:
      'عکاسی استودیویی حلقه و گوشواره برای ویترین خرید؛ نور فلز، بدون اجرت پنهان در روایت محصول.',
    image: '/landing/gold-work-jewelry.png',
    video: '/landing/work-jewelry.mp4',
  },
  {
    category: 'کمپین برند',
    title: 'کمپین خزانه',
    description:
      'روایت نگهداری بیمه‌شده: طلای شما در خزانهٔ بانکی است، نه در ویترین مغازه — و هر لحظه قابل نقد شدن.',
    image: '/landing/gold-work-campaign.png',
    video: '/landing/work-campaign.mp4',
  },
  {
    category: 'تجارت الکترونیک',
    title: 'ویترین زرین',
    description:
      'خرید آنلاین از هر مبلغی، بدون حداقل. همان فید قیمت زنده که روی لندینگ می‌بینید، مسیر سفارش را می‌سازد.',
    image: '/landing/gold-work-ecommerce.png',
    video: '/landing/work-ecommerce.mp4',
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
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hovering, setHovering] = useState(false);

  function play() {
    setHovering(true);
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = 0;
    void video.play().catch(() => {});
  }

  function stop() {
    setHovering(false);
    const video = videoRef.current;
    if (!video) return;
    video.pause();
  }

  return (
    <Reveal y={48}>
      <article
        data-cursor
        className={`grid items-end gap-6 lg:grid-cols-12 ${offset ? 'lg:pt-10' : ''}`}
        onMouseEnter={play}
        onMouseLeave={stop}
      >
        <div className={`space-y-4 ${offset ? 'lg:col-span-4 lg:col-start-1' : 'lg:col-span-4'}`}>
          <p className="text-[11px] uppercase tracking-[0.2em] text-gold-700">{project.category}</p>
          <h3 className="display-tight text-3xl font-semibold sm:text-5xl">{project.title}</h3>
          <motion.p
            initial={false}
            animate={{ opacity: hovering ? 1 : 0.55, y: hovering ? 0 : 8 }}
            transition={{ duration: 0.45, ease: EASE_OUT }}
            className="max-w-sm text-sm leading-7 text-muted"
          >
            {project.description}
          </motion.p>
          <p className="text-xs tracking-tight text-foreground/60">
            {hovering ? '>مشاهده نمونه<' : '>مشاهده پروژه<'}
          </p>
        </div>

        <div
          className={`relative aspect-video overflow-hidden rounded-md bg-black ${
            offset ? 'lg:col-span-8' : 'lg:col-span-8'
          }`}
        >
          <Image
            src={project.image}
            alt={project.title}
            fill
            sizes="(min-width: 1024px) 60vw, 100vw"
            className={`object-cover transition-opacity duration-500 ${hovering ? 'opacity-0' : 'opacity-100'}`}
          />
          <video
            ref={videoRef}
            src={project.video}
            muted
            loop
            playsInline
            className={`absolute inset-0 size-full object-cover transition-opacity duration-500 ${
              hovering ? 'opacity-100' : 'opacity-0'
            }`}
          />
        </div>
      </article>
    </Reveal>
  );
}
