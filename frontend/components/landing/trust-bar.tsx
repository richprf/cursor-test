'use client';

import { GsapMarquee } from './gsap-marquee';
import { TIMING } from '@/lib/motion';

const LOGOS = [
  'خزانهٔ بانکی',
  'بیمهٔ کامل',
  'کارمزد صفر',
  'تحویل فیزیکی',
  'ورود با گوگل',
  'قیمت زنده',
  'بدون حداقل',
  'پشتیبانی ۲۴ساعته',
];

export function TrustBar() {
  return (
    <section id="clients" className="overflow-hidden border-y border-foreground/10 py-10">
      <p className="mb-6 px-6 text-[11px] uppercase tracking-[0.22em] text-muted">مورد اعتماد</p>
      <GsapMarquee duration={TIMING.marqueeLogos}>
        {LOGOS.map((item) => (
          <span
            key={item}
            dir="rtl"
            className="px-10 text-lg font-semibold tracking-tight text-foreground/80 sm:text-2xl"
          >
            {item}
            <span className="ms-10 text-gold-500" aria-hidden>
              +
            </span>
          </span>
        ))}
      </GsapMarquee>
    </section>
  );
}
