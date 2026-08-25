'use client';

import { useState } from 'react';
import { CUSTOM_HERO_SLIDES } from '@/lib/wwake-custom';
import { toPersianNumber } from '@/lib/format';
import { AutoPlayVideo } from './auto-play-video';

export function WwakeCustomHero() {
  const [active, setActive] = useState(0);
  const current = CUSTOM_HERO_SLIDES[active] ?? CUSTOM_HERO_SLIDES[0];
  const total = CUSTOM_HERO_SLIDES.length;

  return (
    <section className="ww-custom-hero">
      <div className="ww-custom-hero-media">
        <AutoPlayVideo
          className="ww-custom-hero-video is-desktop"
          src="/landing/wwake/custom/hero-desktop.mp4"
          poster="/landing/wwake/custom/hero-desktop.jpg"
        />
        <AutoPlayVideo
          className="ww-custom-hero-video is-mobile"
          src="/landing/wwake/custom/hero-mobile.mp4"
          poster="/landing/wwake/custom/hero-mobile.jpg"
        />
      </div>

      <div className="ww-custom-hero-title">
        <h1>{current.title}</h1>
      </div>

      <div className="ww-custom-hero-slides">
        {CUSTOM_HERO_SLIDES.map((slide, index) => (
          <button
            key={slide.index}
            type="button"
            className={index === active ? 'is-on' : undefined}
            onClick={() => setActive(index)}
            onMouseEnter={() => setActive(index)}
          >
            <span>{slide.index}</span>
            <strong>{slide.heading}</strong>
            <p>{slide.copy}</p>
          </button>
        ))}
        <nav className="ww-custom-hero-pager">
          <button type="button" aria-label="قبلی" onClick={() => setActive((active + total - 1) % total)}>
            [ &lt; ]
          </button>
          <span>
            [{toPersianNumber(active + 1)}/{toPersianNumber(total)}]
          </span>
          <button type="button" aria-label="بعدی" onClick={() => setActive((active + 1) % total)}>
            [ &gt; ]
          </button>
        </nav>
      </div>
    </section>
  );
}
