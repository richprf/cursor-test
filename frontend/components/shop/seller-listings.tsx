'use client';

import { ProductBagButtons } from '@/components/shop/product-bag-buttons';
import { publicAssetPath } from '@/lib/dashboard';
import { formatToman, toPersianNumber } from '@/lib/format';
import type { ProductListing } from '@/types/api';

export function SellerListings({ items }: { items: ProductListing[] }) {
  return (
    <section className="ww-seller-listings" style={{ ['--ww-col-cols' as string]: '4' }}>
      <header className="ww-col-header">
        <nav className="ww-col-crumbs" aria-label="مسیر">
          <span>فروشگاه</span>
        </nav>
        <h2 className="ww-col-title">
          <span>طلای فروشنده‌ها</span>
          <span className="ww-col-count">[{toPersianNumber(items.length)}]</span>
        </h2>
        <p className="ww-col-desc">قطعه‌هایی که فروشنده‌ها همین حالا در پژواک گذاشته‌اند.</p>
      </header>

      {items.length === 0 ? (
        <p className="ww-col-empty">هنوز محصولی از فروشنده‌ها ثبت نشده است.</p>
      ) : (
        <div className="ww-col-grid">
          {items.map((item) => {
            const src = publicAssetPath(item.imageUrl);
            return (
              <article key={item.id} id={`listing-${item.id}`} className="ww-card ww-col-card">
                <div className="ww-card-media">
                  {src ? (
                    // eslint-disable-next-line @next/next/no-img-element -- upload host is rewritten
                    <img src={src} alt={item.name} />
                  ) : (
                    <div className="ww-seller-placeholder" aria-hidden />
                  )}
                  <ProductBagButtons productId={item.id} />
                </div>
                <div className="ww-col-card-body">
                  <h3>{item.name}</h3>
                  <p>{formatToman(item.price)}</p>
                  <p className="ww-seller-shop">{item.shopName}</p>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
