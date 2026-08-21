'use client';

import { GsapMarquee } from './gsap-marquee';
import { TIMING } from '@/lib/motion';

const KEYWORDS = ['طلا', '۱۸عیار', 'خزانه', 'بیمه', 'زنده', 'بدون کارمزد', 'تحویل فیزیکی', 'گوگل'];

/** Continuous keyword ticker immediately under the hero. */
export function HeroTicker() {
  return (
    <div className="border-y border-foreground/10 bg-foreground py-3 text-background">
      <GsapMarquee duration={TIMING.marqueeKeywords}>
        {KEYWORDS.map((item) => (
          <span
            key={item}
            dir="rtl"
            className="flex items-center px-8 text-xs font-medium tracking-[0.18em]"
          >
            <span className="ms-6 text-gold-500" aria-hidden>
              +
            </span>
            {item}
          </span>
        ))}
      </GsapMarquee>
    </div>
  );
}
