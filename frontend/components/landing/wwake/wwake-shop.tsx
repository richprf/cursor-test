'use client';

import { useState } from 'react';
import Image from 'next/image';
import { SHOP_TABS } from '@/lib/wwake-data';

export function WwakeShop() {
  const [tab, setTab] = useState(0);
  const current = SHOP_TABS[tab] ?? SHOP_TABS[0];

  return (
    <section id="shop" className="ww-shop">
      <div className="ww-shop-head">
        <h2>Designed to Be Collected</h2>
        <a href="#shop" className="ww-link">
          Shop All <span>[334]</span>
        </a>
      </div>
      <p className="ww-shop-desc">
        Each piece is created to stand alone or become part of something larger. Explore collections that evolve with
        you over time.
      </p>

      <div className="ww-tabs" role="tablist">
        {SHOP_TABS.map((item, index) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={index === tab}
            className={`ww-tab${index === tab ? ' is-on' : ''}`}
            onClick={() => setTab(index)}
          >
            <span>{item.index}</span>
            <span>{item.title}</span>
            <span className="ww-tab-count">
              <span className="ww-link">Shop</span> [{item.count}]
            </span>
          </button>
        ))}
      </div>

      <div className="ww-grid">
        {current.products.map((product) => (
          <article key={product.title} className="ww-card">
            <div className="ww-card-media">
              {'badge' in product && product.badge ? <span className="ww-badge">{product.badge}</span> : null}
              <Image src={product.image} alt={product.title} fill sizes="(min-width: 990px) 25vw, 50vw" />
              <Image
                src={product.hover}
                alt=""
                fill
                sizes="(min-width: 990px) 25vw, 50vw"
                className="is-hover"
              />
            </div>
            <h3>{product.title}</h3>
            <p>{product.price}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
