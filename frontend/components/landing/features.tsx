'use client';

import type { ComponentType } from 'react';
import {
  CoinStackIcon,
  InstantTradeIcon,
  LiveChartIcon,
  VaultIcon,
  type GoldIconProps,
} from './gold-icons';
import { Section, SectionHeading } from './section';
import { RevealGroup, RevealItem } from './reveal';

const FEATURES = [
  {
    icon: InstantTradeIcon,
    n: '۱',
    title: 'خرید و فروش آنی',
    description:
      'در هر ساعت از شبانه‌روز و با هر مبلغی طلا بخرید یا بفروشید؛ سفارش شما در چند ثانیه ثبت می‌شود.',
  },
  {
    icon: VaultIcon,
    n: '۲',
    title: 'نگهداری امن و بیمه‌شده',
    description: 'طلای شما در خزانهٔ بانکی نگهداری و تا سقف کامل ارزش آن بیمه می‌شود.',
  },
  {
    icon: CoinStackIcon,
    n: '۳',
    title: 'نقدشوندگی فوری',
    description: 'هر زمان خواستید بفروشید و پول را بدون معطلی به حساب بانکی خود منتقل کنید.',
  },
  {
    icon: LiveChartIcon,
    n: '۴',
    title: 'پیگیری لحظه‌ای قیمت',
    description: 'قیمت انس جهانی و طلای داخلی را لحظه‌ای ببینید و برای قیمت دلخواه هشدار بگذارید.',
  },
];

export function Features() {
  return (
    <Section id="features">
      <SectionHeading
        eyebrow="چرا زرین‌سرمایه"
        title="همهٔ چیزی که برای سرمایه‌گذاری روی طلا لازم دارید"
        description="از خرید چند صد هزار تومانی تا تحویل فیزیکی شمش؛ همه در یک اپلیکیشن."
      />

      <RevealGroup className="divide-y divide-foreground/15 border-y border-foreground/15">
        {FEATURES.map((feature) => (
          <RevealItem key={feature.title}>
            <FeatureRow {...feature} />
          </RevealItem>
        ))}
      </RevealGroup>
    </Section>
  );
}

function FeatureRow({
  icon: Icon,
  n,
  title,
  description,
}: {
  icon: ComponentType<GoldIconProps>;
  n: string;
  title: string;
  description: string;
}) {
  return (
    <article className="grid gap-4 py-8 sm:grid-cols-[4.5rem_minmax(0,0.85fr)_minmax(0,1.5fr)] sm:items-baseline sm:gap-8 sm:py-10">
      <span className="font-mono text-sm text-gold-700">({n})</span>
      <div className="flex items-center gap-3">
        <span className="grid size-9 place-items-center text-gold-700">
          <Icon className="size-5" />
        </span>
        <h3 className="text-xl font-semibold tracking-tight sm:text-2xl">{title}</h3>
      </div>
      <p className="max-w-xl text-sm leading-8 text-muted sm:text-base">{description}</p>
    </article>
  );
}
