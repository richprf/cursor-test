'use client';

import type { ComponentType } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
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
    title: 'خرید و فروش آنی',
    description:
      'در هر ساعت از شبانه‌روز و با هر مبلغی طلا بخرید یا بفروشید؛ سفارش شما در چند ثانیه ثبت می‌شود.',
  },
  {
    icon: VaultIcon,
    title: 'نگهداری امن و بیمه‌شده',
    description: 'طلای شما در خزانهٔ بانکی نگهداری و تا سقف کامل ارزش آن بیمه می‌شود.',
  },
  {
    icon: CoinStackIcon,
    title: 'نقدشوندگی فوری',
    description: 'هر زمان خواستید بفروشید و پول را بدون معطلی به حساب بانکی خود منتقل کنید.',
  },
  {
    icon: LiveChartIcon,
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

      <RevealGroup className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {FEATURES.map((feature) => (
          <RevealItem key={feature.title}>
            <FeatureCard {...feature} />
          </RevealItem>
        ))}
      </RevealGroup>
    </Section>
  );
}

function FeatureCard({
  icon: Icon,
  title,
  description,
}: {
  icon: ComponentType<GoldIconProps>;
  title: string;
  description: string;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.article
      whileHover={reduceMotion ? undefined : { y: -6 }}
      transition={{ type: 'spring', stiffness: 260, damping: 22 }}
      className="group relative h-full overflow-hidden rounded-2xl border border-border bg-surface p-6 shadow-lg shadow-black/[0.05] theme-fade"
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-2xl border border-gold-500/60 opacity-0 shadow-[0_10px_30px_-8px_rgba(191,149,63,0.45)] transition-opacity duration-300 group-hover:opacity-100"
      />
      <span className="grid size-11 place-items-center rounded-xl border border-gold-500/25 bg-gold-500/[0.12] text-gold-700 transition-colors duration-300 group-hover:bg-gold-500/[0.18]">
        <Icon className="size-5" />
      </span>
      <h3 className="mt-5 text-base font-bold">{title}</h3>
      <p className="mt-2 text-sm leading-7 text-muted">{description}</p>
    </motion.article>
  );
}
