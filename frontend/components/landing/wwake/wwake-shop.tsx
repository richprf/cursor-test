'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { toPersianNumber } from '@/lib/format';
import { SHOP_TABS } from '@/lib/wwake-data';

export function WwakeShop() {
  const [tab, setTab] = useState(0);
  const [index, setIndex] = useState(0);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const current = SHOP_TABS[tab] ?? SHOP_TABS[0];
  const total = current.products.length;

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    scroller.scrollTo({ left: 0, behavior: 'auto' });
    setIndex(0);
  }, [tab]);

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
  }, [tab]);

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
    <section id="shop" className="ww-shop">
      <div className="ww-shop-head">
        <h2>ساخته شده تا جمع شود</h2>
        <a href="#shop" className="ww-link">
          همه را ببینید <span>[۳۳۴]</span>
        </a>
      </div>
      <p className="ww-shop-desc">
        هر قطعه می‌تواند تنها بایستد یا بخشی از چیزی بزرگ‌تر شود. مجموعه‌هایی را ببینید که با شما در زمان پیش می‌روند.
      </p>

      <div className="ww-shop-controls">
        <div className="ww-tabs" role="tablist">
          {SHOP_TABS.map((item, tabIndex) => (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={tabIndex === tab}
              className={`ww-tab${tabIndex === tab ? ' is-on' : ''}`}
              onClick={() => setTab(tabIndex)}
            >
              <span>{item.index}</span>
              <span>{item.title}</span>
              <span className="ww-tab-count">
                <span className="ww-link">خرید</span> [{item.count}]
              </span>
            </button>
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
        {current.products.map((product) => (
          <article key={product.title} data-slide className="ww-card ww-slide">
            <div className="ww-card-media">
              {'badge' in product && product.badge ? <span className="ww-badge">{product.badge}</span> : null}
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
