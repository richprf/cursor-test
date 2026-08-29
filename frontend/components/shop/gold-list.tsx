'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { CATALOG, CATALOG_FILTERS } from '@/lib/wwake-data';
import { productHref } from '@/lib/wwake-product';
import { toPersianNumber } from '@/lib/format';
import { ProductBagButtons } from '@/components/shop/product-bag-buttons';

const PAGE_SIZE = 8;

export function GoldList() {
  const [filter, setFilter] = useState<(typeof CATALOG_FILTERS)[number]['id']>('all');
  const [page, setPage] = useState(0);

  const items = useMemo(
    () => (filter === 'all' ? CATALOG : CATALOG.filter((item) => item.categoryId === filter)),
    [filter],
  );

  const pageCount = Math.max(1, Math.ceil(items.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount - 1);
  const visible = items.slice(currentPage * PAGE_SIZE, currentPage * PAGE_SIZE + PAGE_SIZE);

  useEffect(() => {
    setPage(0);
  }, [filter]);

  const goTo = (next: number) => {
    setPage(Math.min(Math.max(next, 0), pageCount - 1));
    document.getElementById('gold-grid')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

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

      <div id="gold-grid" className="gold-grid">
        {visible.map((item) => (
          <article key={item.id} className={`gold-cell is-${item.size}`}>
            <Link href={productHref(item.id)} className="gold-cell-link">
              <div className="gold-cell-media">
                {'badge' in item && item.badge ? <span className="ww-badge">{item.badge}</span> : null}
                <Image src={item.image} alt={item.title} fill sizes="(min-width: 990px) 22vw, 50vw" />
                <Image src={item.hover} alt="" fill sizes="(min-width: 990px) 22vw, 50vw" className="is-hover" />
              </div>
              <div className="gold-cell-copy">
                <h2>{item.title}</h2>
                <p>
                  <span>{item.category}</span>
                  <span dir="ltr">{item.price}</span>
                </p>
              </div>
            </Link>
            <ProductBagButtons productId={item.id} />
          </article>
        ))}
      </div>

      {pageCount > 1 ? (
        <nav className="gold-pager" aria-label="صفحه‌بندی">
          <button type="button" aria-label="صفحهٔ قبل" disabled={currentPage === 0} onClick={() => goTo(currentPage - 1)}>
            [ &lt; ]
          </button>
          {Array.from({ length: pageCount }, (_, index) => (
            <button
              key={index}
              type="button"
              className={index === currentPage ? 'is-on' : undefined}
              aria-current={index === currentPage ? 'page' : undefined}
              onClick={() => goTo(index)}
            >
              {toPersianNumber(index + 1)}
            </button>
          ))}
          <button
            type="button"
            aria-label="صفحهٔ بعد"
            disabled={currentPage === pageCount - 1}
            onClick={() => goTo(currentPage + 1)}
          >
            [ &gt; ]
          </button>
        </nav>
      ) : null}
    </section>
  );
}
