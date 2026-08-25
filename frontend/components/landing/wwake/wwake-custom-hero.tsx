'use client';

import { useState } from 'react';
import Image from 'next/image';
import { toPersianNumber } from '@/lib/format';
import { CUSTOM_HERO_SLIDES } from '@/lib/wwake-custom';

export function WwakeCustomHero() {
  const [active, setActive] = useState(0);
  const current = CUSTOM_HERO_SLIDES[active] ?? CUSTOM_HERO_SLIDES[0];

  return (
    <section className="ww-custom-hero">
      <div className="ww-custom-hero-media">
        <Image
          src="/landing/wwake/custom/hero-desktop.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="hidden md:block"
        />
        <Image
          src="/landing/wwake/custom/hero-mobile.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="md:hidden"
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
      </div>

      <div className="ww-custom-hero-pager">
        <button type="button" onClick={() => setActive((i) => (i === 0 ? CUSTOM_HERO_SLIDES.length - 1 : i - 1))}>
          [ &lt; ]
        </button>
        <span>
          [{toPersianNumber(active + 1)} /{toPersianNumber(CUSTOM_HERO_SLIDES.length)}]
        </span>
        <button type="button" onClick={() => setActive((i) => (i + 1) % CUSTOM_HERO_SLIDES.length)}>
          [ &gt; ]
        </button>
      </div>
    </section>
  );
}
