'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import { CATALOG, CATALOG_FILTERS } from '@/lib/wwake-data';
import { toPersianNumber } from '@/lib/format';

export function GoldList() {
  const [filter, setFilter] = useState<(typeof CATALOG_FILTERS)[number]['id']>('all');

  const items = useMemo(
    () => (filter === 'all' ? CATALOG : CATALOG.filter((item) => item.categoryId === filter)),
    [filter],
  );

  return (
    <section className="gold-list">
      <header className="gold-list-head">
        <p>فروشگاه</p>
        <h1>لیست طلا و جواهر</h1>
        <p className="gold-list-lead">
          همان قطعه‌هایی که در صفحهٔ اصلی دیدید؛ هر خانه اندازهٔ خودش را دارد تا فهرست یکدست و شبکه‌ای نباشد.
        </p>
      </header>

      <div className="gold-list-bar">
        <div className="gold-filters" role="tablist">
          {CATALOG_FILTERS.map((item) => (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={filter === item.id}
              className={`gold-filter${filter === item.id ? ' is-on' : ''}`}
              onClick={() => setFilter(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>
        <p className="gold-count">[{toPersianNumber(items.length)}]</p>
      </div>

      <div className="gold-grid">
        {items.map((item) => (
          <article key={item.id} className={`gold-cell is-${item.size}`}>
            <div className="gold-cell-media">
              {'badge' in item && item.badge ? <span className="ww-badge">{item.badge}</span> : null}
              <Image src={item.image} alt={item.title} fill sizes="(min-width: 990px) 40vw, 90vw" />
              <Image src={item.hover} alt="" fill sizes="(min-width: 990px) 40vw, 90vw" className="is-hover" />
            </div>
            <div className="gold-cell-copy">
              <h2>{item.title}</h2>
              <p>
                <span>{item.category}</span>
                <span dir="ltr">{item.price}</span>
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
