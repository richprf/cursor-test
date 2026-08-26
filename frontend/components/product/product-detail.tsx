'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { AutoPlayVideo } from '@/components/landing/wwake/auto-play-video';
import { toPersianNumber } from '@/lib/format';
import { CATALOG } from '@/lib/wwake-data';
import {
  PRODUCT_ETHOS,
  PRODUCT_FAQ,
  RING_SIZES,
  productHref,
  type ProductRecord,
} from '@/lib/wwake-product';

function hrefForTitle(title: string) {
  const item = CATALOG.find((entry) => entry.title === title);
  return item ? productHref(item.id) : '/shop';
}

function ProductCard({
  title,
  href,
  image,
  hover,
  badge,
  price,
}: {
  title: string;
  href: string;
  image: string;
  hover?: string;
  badge?: string;
  price?: string;
}) {
  return (
    <article className="ww-card">
      <Link href={href} className="ww-pdp-card-link">
        <div className="ww-card-media">
          {badge ? <span className="ww-badge">{badge}</span> : null}
          <Image src={image} alt={title} fill sizes="(min-width: 990px) 20vw, 50vw" />
          {hover ? (
            <Image src={hover} alt="" fill sizes="(min-width: 990px) 20vw, 50vw" className="is-hover" />
          ) : null}
        </div>
        <h3>{title}</h3>
        {price ? <p dir="ltr">{price}</p> : null}
      </Link>
    </article>
  );
}

export function ProductDetail({ product }: { product: ProductRecord }) {
  const [size, setSize] = useState<string | null>(null);
  const [sizeOpen, setSizeOpen] = useState(false);
  const [zoom, setZoom] = useState<number | null>(null);
  const [mediaIndex, setMediaIndex] = useState(0);
  const [ethos, setEthos] = useState(0);
  const [faqOpen, setFaqOpen] = useState<number | null>(0);
  const [accOpen, setAccOpen] = useState<number | null>(0);
  const [sticky, setSticky] = useState(false);
  const [added, setAdded] = useState(false);
  const buyRef = useRef<HTMLButtonElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);
  const ethosStep = PRODUCT_ETHOS[ethos] ?? PRODUCT_ETHOS[0];
  const mediaCount = product.gallery.length + 1;

  useEffect(() => {
    const buy = buyRef.current;
    if (!buy) return;
    const observer = new IntersectionObserver(([entry]) => setSticky(!entry.isIntersecting), {
      threshold: 0,
    });
    observer.observe(buy);
    return () => observer.disconnect();
  }, []);

  const openSize = () => setSizeOpen(true);
  const chooseSize = (value: string) => {
    setSize(value);
    setSizeOpen(false);
    setAdded(false);
  };

  const addToCart = () => {
    if (!size) {
      openSize();
      return;
    }
    setAdded(true);
  };

  const scrollMedia = (direction: number) => {
    const next = (mediaIndex + direction + mediaCount) % mediaCount;
    setMediaIndex(next);
    const scroller = mediaRef.current;
    const slide = scroller?.children[next] as HTMLElement | undefined;
    slide?.scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' });
  };

  const accordions = [
    { title: 'جزئیات', body: product.details.join('\n') },
    { title: 'سایز و تناسب', body: product.sizeFit },
    { title: 'منبع', body: product.sourcing },
    { title: 'ارسال و مرجوعی', body: product.delivery },
  ];

  return (
    <div className="ww-pdp">
      <div className="ww-pdp-grid">
        <div className="ww-pdp-left">
          <nav className="ww-pdp-crumbs" aria-label="مسیر">
            <Link href="/" className="ww-link">
              خانه
            </Link>
            <span>/</span>
            <Link href="/shop" className="ww-link">
              {product.category}
            </Link>
            <span>/</span>
            <span>{product.title}</span>
          </nav>

          {product.video ? (
            <div className="ww-pdp-video">
              <AutoPlayVideo src={product.video.src} poster={product.video.poster} />
            </div>
          ) : null}

          <p className="ww-pdp-desc">{product.description}</p>

          <div className="ww-pdp-acc">
            {accordions.map((item, index) => {
              const on = accOpen === index;
              return (
                <div key={item.title}>
                  <button type="button" className="ww-acc-head" onClick={() => setAccOpen(on ? null : index)}>
                    <span>{toPersianNumber(index + 1)}</span>
                    <span className="ww-acc-title">{item.title}</span>
                    <span className="ww-acc-count">{on ? '[−]' : '[+]'}</span>
                  </button>
                  {on ? (
                    <div className="ww-pdp-acc-body">
                      {item.body.split('\n').map((line, lineIndex) => (
                        <p key={lineIndex}>{line || '\u00a0'}</p>
                      ))}
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>

        <div className="ww-pdp-center">
          <div ref={mediaRef} className="ww-pdp-media" data-lenis-prevent>
            {product.gallery.slice(0, 2).map((src, index) => (
              <button
                key={src}
                type="button"
                className="ww-pdp-shot is-wide"
                onClick={() => setZoom(index)}
              >
                <Image src={src} alt={product.title} fill sizes="(min-width: 990px) 42vw, 80vw" />
              </button>
            ))}
            <p className="ww-pdp-caption">{product.caption}</p>
            {product.gallery.slice(2).map((src, index) => (
              <button
                key={src}
                type="button"
                className="ww-pdp-shot"
                onClick={() => setZoom(index + 2)}
              >
                <Image src={src} alt={product.title} fill sizes="(min-width: 990px) 20vw, 80vw" />
              </button>
            ))}
          </div>
          <nav className="ww-pdp-media-pager">
            <button type="button" onClick={() => scrollMedia(-1)}>
              [ &lt; ]
            </button>
            <span>
              [{toPersianNumber(mediaIndex + 1)}/{toPersianNumber(mediaCount)}]
            </span>
            <button type="button" onClick={() => scrollMedia(1)}>
              [ &gt; ]
            </button>
          </nav>
        </div>

        <div className="ww-pdp-right">
          <h1>{product.title}</h1>
          <p className="ww-pdp-price" dir="ltr">
            {product.price}
          </p>

          <div className="ww-pdp-size">
            <p>سایز</p>
            <button type="button" className="ww-link" onClick={openSize}>
              [{size ? size : 'انتخاب سایز'}]
            </button>
          </div>
          {product.madeToOrder ? (
            <p className="ww-pdp-note">این قطعه ساخت‌سفارشی است. تحویل را ۵ تا ۶ هفته در نظر بگیرید.</p>
          ) : null}

          <p className="ww-pdp-ship">ارسال جهانی؛ عوارض از قبل محاسبه می‌شود</p>

          <button ref={buyRef} type="button" className="ww-pdp-buy" onClick={addToCart}>
            <span>{size ? (added ? 'به سبد افزوده شد' : 'افزودن به سبد') : 'انتخاب سایز'}</span>
            <span dir="ltr">{product.price}</span>
          </button>

          <div className="ww-pdp-help">
            <p>راهنما</p>
            <ul>
              <li>
                <Link href="/#visit" className="ww-link">
                  بازدید
                </Link>
              </li>
              <li>
                <a href="mailto:hello@pezhvak.test" className="ww-link">
                  گفت‌وگو با متخصص
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <section className="ww-pdp-pair">
        <div className="ww-pdp-pair-intro">
          <div className="ww-shop-head">
            <h2>با آن جفت کنید</h2>
            <Link href="/shop" className="ww-link">
              خرید [{toPersianNumber(163)}]
            </Link>
          </div>
          <p>
            هر قطعه بخشی از ترکیبی بزرگ‌تر است. با تعادل فرم، ماده و تناسب شکل گرفته تا کنار هم زندگی کند و در زمان در
            مجموعه‌تان بماند.
          </p>
        </div>
        <div className="ww-pdp-pair-grid">
          {product.pair.map((item) => (
            <ProductCard key={item.title} {...item} />
          ))}
        </div>
        <div className="ww-pdp-pair-media">
          <Image
            src={product.gallery[1] ?? product.gallery[0]}
            alt=""
            fill
            sizes="(min-width: 750px) 40vw, 100vw"
          />
        </div>
      </section>

      <section className="ww-custom-process ww-pdp-ethos">
        <div className="ww-custom-process-grid">
          <div className="ww-custom-process-media">
            <Image src={ethosStep.image} alt="" fill sizes="(min-width: 990px) 28vw, 90vw" />
          </div>
          <div className="ww-custom-process-list">
            {PRODUCT_ETHOS.map((item, index) => (
              <button
                key={item.title}
                type="button"
                className={index === ethos ? 'is-on' : undefined}
                onClick={() => setEthos(index)}
                onMouseEnter={() => setEthos(index)}
              >
                <span>{toPersianNumber(index + 1)}</span>
                <strong>{item.title}</strong>
              </button>
            ))}
          </div>
          <div className="ww-custom-process-copy">
            <p>{ethosStep.copy}</p>
            <p className="ww-custom-ctas">
              {ethosStep.links.map((link) => (
                <Link key={link.label} href={link.href} className="ww-link">
                  {link.label}
                </Link>
              ))}
            </p>
          </div>
        </div>
      </section>

      <section className="ww-shop ww-pdp-related">
        <div className="ww-shop-head">
          <h2>پیشنهادهای دیگر</h2>
          <Link href="/shop" className="ww-link">
            همه را ببینید
          </Link>
        </div>
        <div className="ww-slider" data-lenis-prevent>
          {product.related.map((item) => (
            <div key={item.title} data-slide className="ww-slide">
              <ProductCard
                title={item.title}
                href={hrefForTitle(item.title)}
                image={item.image}
                hover={item.hover}
                badge={'badge' in item ? item.badge : undefined}
                price={item.price}
              />
            </div>
          ))}
        </div>
      </section>

      <section className="ww-custom-faq ww-pdp-faq">
        <h2>پرسش‌ها</h2>
        <div className="ww-accordion">
          {PRODUCT_FAQ.map((item, index) => {
            const on = faqOpen === index;
            return (
              <div key={item.q}>
                <button type="button" className="ww-acc-head" onClick={() => setFaqOpen(on ? null : index)}>
                  <span>{toPersianNumber(index + 1)}</span>
                  <span className="ww-acc-title">{item.q}</span>
                  <span className="ww-acc-count">{on ? '[−]' : '[+]'}</span>
                </button>
                {on ? (
                  <div className="ww-acc-body ww-custom-faq-body">
                    <p>{item.a}</p>
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      </section>

      <section className="ww-pdp-next">
        <Link href={product.prev.href} className="ww-pdp-next-col">
          <span className="ww-pdp-next-media">
            <Image src={product.prev.image} alt={product.prev.title} fill sizes="320px" />
          </span>
          <span className="ww-link">{product.prev.title}</span>
        </Link>
        <div className="ww-pdp-next-copy">
          <h2>جواهری برای پوشیدن، نگه داشتن و جلو بردن.</h2>
          <Link href="/custom" className="ww-link">
            بیشتر بخوانید
          </Link>
        </div>
        <Link href={product.next.href} className="ww-pdp-next-col">
          <span className="ww-pdp-next-media">
            <Image src={product.next.image} alt={product.next.title} fill sizes="320px" />
          </span>
          <span className="ww-link">{product.next.title}</span>
        </Link>
      </section>

      <div className={`ww-pdp-sticky${sticky ? ' is-on' : ''}`}>
        <div className="ww-pdp-sticky-info">
          <span className="ww-pdp-sticky-img">
            <Image src={product.gallery[0]} alt="" fill sizes="50px" />
          </span>
          <span>{product.title}</span>
        </div>
        <div className="ww-pdp-sticky-actions">
          <button type="button" className="ww-link" onClick={openSize}>
            سایز {size ?? ''}
          </button>
          <button type="button" className="ww-pdp-buy" onClick={addToCart}>
            <span>{size ? (added ? 'به سبد افزوده شد' : 'افزودن به سبد') : 'انتخاب سایز'}</span>
            <span dir="ltr">{product.price}</span>
          </button>
        </div>
      </div>

      {sizeOpen ? (
        <div className="ww-pdp-layer">
          <button type="button" className="ww-pdp-layer-scrim" aria-label="بستن" onClick={() => setSizeOpen(false)} />
          <div className="ww-pdp-layer-panel" role="dialog" aria-label="انتخاب سایز">
            <header>
              <p>سایزتان را انتخاب کنید</p>
              <button type="button" aria-label="بستن" onClick={() => setSizeOpen(false)}>
                ×
              </button>
            </header>
            <div className="ww-pdp-size-table-wrap">
              <table className="ww-pdp-size-table">
                <thead>
                  <tr>
                    <th>US, CA, MX</th>
                    <th>داخل mm</th>
                    <th>قطر mm</th>
                    <th>موجودی</th>
                  </tr>
                </thead>
                <tbody>
                  {RING_SIZES.map((row) => (
                    <tr key={row.us} className={size === row.us ? 'is-on' : undefined}>
                      <td>
                        <button type="button" onClick={() => chooseSize(row.us)}>
                          {row.us}
                        </button>
                      </td>
                      <td>
                        <button type="button" onClick={() => chooseSize(row.us)}>
                          {row.inside}
                        </button>
                      </td>
                      <td>
                        <button type="button" onClick={() => chooseSize(row.us)}>
                          {row.diameter}
                        </button>
                      </td>
                      <td>
                        <button type="button" onClick={() => chooseSize(row.us)}>
                          ساخت سفارشی
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : null}

      {zoom !== null ? (
        <div className="ww-pdp-zoom" role="dialog" aria-label="بستن نمایش تصویر">
          <button type="button" className="ww-pdp-zoom-close" onClick={() => setZoom(null)}>
            بستن نمایش تصویر
          </button>
          <button type="button" className="ww-pdp-zoom-hit" onClick={() => setZoom(null)}>
            <Image
              src={product.gallery[zoom] ?? product.gallery[0]}
              alt={product.title}
              width={1200}
              height={1500}
            />
          </button>
        </div>
      ) : null}
    </div>
  );
}
