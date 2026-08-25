'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { toPersianNumber } from '@/lib/format';
import { CUSTOM_COLLECTIONS, CUSTOM_PRODUCTS } from '@/lib/wwake-custom';

export function WwakeCustomShop() {
  const [index, setIndex] = useState(0);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const total = CUSTOM_PRODUCTS.length;

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    const sync = () => {
      const slides = [...scroller.querySelectorAll<HTMLElement>('[data-slide]')];
      if (!slides.length) return;
      const start = scroller.getBoundingClientRect().left;
      let best = 0;
      let bestDist = Number.POSITIVE_INFINITY;
      slides.forEach((slide, i) => {
        const dist = Math.abs(slide.getBoundingClientRect().left - start);
        if (dist < bestDist) {
          bestDist = dist;
          best = i;
        }
      });
      setIndex(best);
    };

    sync();
    scroller.addEventListener('scroll', sync, { passive: true });
    window.addEventListener('resize', sync);
    return () => {
      scroller.removeEventListener('scroll', sync);
      window.removeEventListener('resize', sync);
    };
  }, []);

  const scrollBySlide = (direction: number) => {
    const scroller = scrollerRef.current;
    const slide = scroller?.querySelector<HTMLElement>('[data-slide]');
    if (!scroller || !slide) return;
    const rtl = getComputedStyle(scroller).direction === 'rtl';
    scroller.scrollBy({
      left: slide.offsetWidth * direction * (rtl ? -1 : 1),
      behavior: 'smooth',
    });
  };

  return (
    <section className="ww-shop ww-custom-shop">
      <div className="ww-shop-head">
        <h2>شروع با الهام</h2>
        <Link href="/shop" className="ww-link">
          همه را ببینید <span>[{toPersianNumber(333)}]</span>
        </Link>
      </div>
      <p className="ww-shop-desc">از قطعه‌های آیینی تا تک‌نسخه‌ها، این مجموعه‌ها راه‌های مختلف ورود به روند سفارشی‌اند.</p>

      <div className="ww-shop-controls">
        <div className="ww-tabs" role="tablist">
          {CUSTOM_COLLECTIONS.map((item) => (
            <Link key={item.title} href="/shop" className="ww-tab">
              <span>{item.index}</span>
              <span>{item.title}</span>
              <span className="ww-tab-count">
                <span className="ww-link">خرید</span> [{item.count}]
              </span>
            </Link>
          ))}
        </div>
        <div className="ww-pager">
          <button type="button" aria-label="قبلی" onClick={() => scrollBySlide(-1)}>
            [ &lt; ]
          </button>
          <span>
            [{toPersianNumber(index + 1)}/{toPersianNumber(total)}]
          </span>
          <button type="button" aria-label="بعدی" onClick={() => scrollBySlide(1)}>
            [ &gt; ]
          </button>
        </div>
      </div>

      <div ref={scrollerRef} className="ww-slider" data-lenis-prevent>
        {CUSTOM_PRODUCTS.map((product) => (
          <article key={product.title} data-slide className="ww-card ww-slide">
            <div className="ww-card-media">
              <span className="ww-badge">{product.badge}</span>
              <Image src={product.image} alt={product.title} fill sizes="(min-width: 990px) 22vw, 70vw" />
              <Image
                src={product.hover}
                alt=""
                fill
                sizes="(min-width: 990px) 22vw, 70vw"
                className="is-hover"
              />
            </div>
            <h3>{product.title}</h3>
            <p dir="ltr">{product.price}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
