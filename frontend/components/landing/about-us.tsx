'use client';

import { toPersianNumber } from '@/lib/format';
import { Reveal } from './reveal';

const LOOP_ITEMS = ['آگهی طلافروش', 'خرید حضوری', 'پیک طلا', 'بدون واسطه'];

export function AboutUs() {
  return (
    <section id="about" className="about-v1 scroll-mt-24">
      <div className="about-v1-shell">
        <div className="about-v1-layout">
          <Reveal className="about-v1-copy" y={36}>
            <p className="about-v1-kicker">
              <span className="about-v1-dot" aria-hidden />
              درباره ما
            </p>
            <h2 className="about-v1-title">
              طلاها را از مغازه‌ها جمع می‌کنیم تا راحت‌تر انتخاب کنید.
            </h2>
            <p className="about-v1-desc">
              طلافروش آگهی می‌گذارد، مشتری مقایسه می‌کند، بعد می‌رود همان مغازه یا پیک می‌گیرد. ما واسطهٔ فروش
              نیستیم.
            </p>
            <a href="#features" className="about-v1-btn">
              بیشتر بدانید
            </a>
          </Reveal>

          <Reveal className="about-v1-card-wrap" y={48} delay={0.08}>
              <article className="about-v1-card">
                <div className="about-v1-card-top">
                  <h3 className="about-v1-card-title">عملکرد</h3>
                  <p className="about-v1-card-sub">در ۷ روز گذشته</p>
                </div>

                <div className="about-v1-stat-wrap">
                  <div className="about-v1-stat">
                    <p className="about-v1-stat-value">{toPersianNumber(49)}٪</p>
                    <span className="about-v1-stat-badge">+{toPersianNumber(2.5)}٪</span>
                  </div>
                  <p className="about-v1-stat-caption">آگهی‌های تازه</p>
                </div>

                <div className="about-v1-loops">
                  <LoopRow />
                  <LoopRow reverse />
                </div>
              </article>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function LoopRow({ reverse = false }: { reverse?: boolean }) {
  const items = [...LOOP_ITEMS, ...LOOP_ITEMS, ...LOOP_ITEMS];

  return (
    <div className={`about-v1-loop-row${reverse ? ' is-reverse' : ''}`}>
      <div className="about-v1-loop-track">
        {items.map((label, index) => (
          <span key={`${label}-${index}`} className="about-v1-chip">
            {label}
          </span>
        ))}
        {items.map((label, index) => (
          <span key={`${label}-dup-${index}`} className="about-v1-chip" aria-hidden>
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}
