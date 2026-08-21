'use client';

import { Section } from './section';
import { Reveal, RevealGroup, RevealItem } from './reveal';
import { GoldPlate } from './gold-plate';

const SHOTS = [
  { caption: 'خرید و فروش آنی', frame: 'lg:col-span-3', aspect: 'aspect-[3/4]' },
  { caption: 'نگهداری امن و بیمه‌شده', frame: 'lg:col-span-6 lg:mt-16', aspect: 'aspect-[4/3]' },
  { caption: 'نقدشوندگی فوری', frame: 'lg:col-span-3', aspect: 'aspect-[3/4]' },
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

      <RevealGroup className="mt-16 grid gap-4 lg:grid-cols-12" stagger={0.08}>
        {SHOTS.map((shot) => (
          <RevealItem key={shot.caption} className={shot.frame}>
            <figure>
              <GoldPlate className={`w-full ${shot.aspect}`} label={shot.caption} />
              <figcaption className="mt-3 text-sm text-muted">{shot.caption}</figcaption>
            </figure>
          </RevealItem>
        ))}
      </RevealGroup>
    </Section>
  );
}
