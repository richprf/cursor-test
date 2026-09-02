'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { collectionHref } from '@/lib/wwake-collections';

type Item = {
  id: string;
  index: string;
  title: string;
  count: string;
  image: string;
  product: string;
  copy: string;
};

export function WwakeList({
  id,
  heading,
  items,
}: {
  id: string;
  heading: string;
  items: readonly Item[];
}) {
  const [active, setActive] = useState(0);
  const current = items[active] ?? items[0];

  return (
    <section id={id} className="ww-list">
      <div className="ww-list-grid">
        <div className="ww-list-media">
          <Image src={current.image} alt="" fill sizes="(min-width: 990px) 280px, 40vw" />
        </div>

        <div className="ww-list-title-row">
          <h2 className="ww-list-title">{heading}</h2>
          <Link href="/shop" className="ww-link">
            کشف کنید
          </Link>
        </div>

        <div className="ww-accordion">
          {items.map((item, index) => {
            const open = index === active;
            return (
              <div key={item.id}>
                <div
                  className="ww-acc-head"
                  onClick={() => setActive(index)}
                  onMouseEnter={() => setActive(index)}
                >
                  <span>{item.index}</span>
                  <span className="ww-acc-title">{item.title}</span>
                  <span className="ww-acc-count">
                    <Link href={collectionHref(item.id)} className="ww-link" onClick={(event) => event.stopPropagation()}>
                      خرید
                    </Link>{' '}
                    [{item.count}]
                  </span>
                </div>
                {open ? (
                  <div className="ww-acc-body">
                    <Image src={item.product} alt={item.title} width={144} height={180} />
                    <p>{item.copy}</p>
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
