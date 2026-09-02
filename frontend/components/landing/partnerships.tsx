'use client';

import Image from 'next/image';
import { toPersianNumber } from '@/lib/format';
import { GsapMarquee } from './gsap-marquee';
import { TIMING } from '@/lib/motion';
import { Reveal } from './reveal';

const LOGOS = [
  '/landing/partners/logo-01.svg',
  '/landing/partners/logo-02.svg',
  '/landing/partners/logo-03.svg',
  '/landing/partners/logo-04.svg',
  '/landing/partners/logo-05.svg',
  '/landing/partners/logo-06.svg',
];

const STATS = [
  { value: `${toPersianNumber(95)}٪`, label: 'خرید مستقیم از طلافروش' },
  { value: `${toPersianNumber(20)}+`, label: 'مغازهٔ آگهی‌شده' },
  { value: `${toPersianNumber(5)}+`, label: 'شهر با پیک طلا' },
];

export function Partnerships() {
  return (
    <section id="partners" className="partners-v1 scroll-mt-24">
      <div className="partners-v1-shell">
        <div className="partners-v1-layout">
          <Reveal y={28}>
            <p className="partners-v1-kicker">
              <span className="partners-v1-dot" aria-hidden />
              همکاری‌ها
            </p>
          </Reveal>

          <Reveal className="partners-v1-content" y={36} delay={0.06}>
            <h2 className="partners-v1-title">طلافروشان، طلایشان را همین‌جا آگهی می‌کنند.</h2>
            <p className="partners-v1-desc">
              مغازه‌دار لیست می‌گذارد، مشتری می‌بیند و معامله با همان فروشنده انجام می‌شود؛ حضوری در مغازه
              یا با پیک.
            </p>
            <div className="partners-v1-stats">
              {STATS.map((stat) => (
                <div key={stat.label} className="partners-v1-stat">
                  <p className="partners-v1-stat-value">{stat.value}</p>
                  <p className="partners-v1-stat-label">{stat.label}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>

      <div className="partners-v1-loop">
        <GsapMarquee duration={TIMING.marqueeLogos}>
          {LOGOS.map((src) => (
            <span key={src} className="partners-v1-logo">
              <Image src={src} alt="" width={140} height={24} className="partners-v1-logo-img" />
            </span>
          ))}
        </GsapMarquee>
      </div>
    </section>
  );
}
