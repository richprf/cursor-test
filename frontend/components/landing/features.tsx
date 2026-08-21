'use client';

import Image from 'next/image';
import { Section } from './section';
import { Reveal, RevealGroup, RevealItem } from './reveal';

const SHOTS = [
  {
    src: '/landing/gold-what-1.png',
    alt: 'ریختن طلای مذاب در قالب',
    caption: 'خرید و فروش آنی',
    frame: 'lg:col-span-3',
    aspect: 'aspect-[3/4]',
  },
  {
    src: '/landing/gold-what-2.png',
    alt: 'خزانهٔ شمش طلا',
    caption: 'نگهداری امن و بیمه‌شده',
    frame: 'lg:col-span-6 lg:mt-16',
    aspect: 'aspect-[4/3]',
  },
  {
    src: '/landing/gold-what-3.png',
    alt: 'سکهٔ طلا',
    caption: 'نقدشوندگی فوری',
    frame: 'lg:col-span-3',
    aspect: 'aspect-[3/4]',
  },
];

export function Features() {
  return (
    <Section id="features">
      <Reveal y={48} className="max-w-4xl">
        <h2 className="display-tight text-[clamp(1.9rem,4.8vw,4rem)] font-semibold">
          <span className="text-muted">چه می‌کنیم. </span>
          طلای شما، همیشه در دستان شما — از هر مبلغی تا تحویل فیزیکی شمش.
        </h2>
        <p className="mt-8 max-w-2xl text-base leading-8 text-muted sm:text-lg">
          با زرین‌سرمایه از هر مبلغی که دارید طلای ۱۸ عیار بخرید، در خزانهٔ بیمه‌شده نگه دارید و هر
          لحظه که خواستید بفروشید یا به‌صورت فیزیکی تحویل بگیرید. از خرید چند صد هزار تومانی تا
          تحویل شمش؛ همه در یک اپلیکیشن.
        </p>
      </Reveal>

      <RevealGroup className="mt-16 grid gap-4 lg:grid-cols-12" stagger={0.12}>
        {SHOTS.map((shot) => (
          <RevealItem key={shot.src} y={56} className={shot.frame}>
            <figure className="group">
              <div className={`relative overflow-hidden ${shot.aspect}`}>
                <Image
                  src={shot.src}
                  alt={shot.alt}
                  fill
                  sizes="(min-width: 1024px) 40vw, 100vw"
                  className="object-cover transition-transform duration-[1.4s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06]"
                />
              </div>
              <figcaption className="mt-3 text-sm text-muted">{shot.caption}</figcaption>
            </figure>
          </RevealItem>
        ))}
      </RevealGroup>
    </Section>
  );
}
