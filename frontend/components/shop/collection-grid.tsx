'use client';

import { useEffect, useLayoutEffect, useMemo, useRef, useState, type CSSProperties, type MouseEvent as ReactMouseEvent, type TouchEvent as ReactTouchEvent } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AutoPlayVideo } from '@/components/landing/wwake/auto-play-video';
import { toPersianNumber } from '@/lib/format';
import {
  CUT_LABELS,
  MATERIAL_LABELS,
  SORT_OPTIONS,
  STONE_LABELS,
  TYPE_LABELS,
  type CollectionProduct,
  type CutKind,
  type MaterialKind,
  type ProductType,
  type SortId,
  type StoneKind,
  type WwakeCollection,
} from '@/lib/wwake-collections';
import { ProductBagButtons } from '@/components/shop/product-bag-buttons';

type Filters = {
  types: ProductType[];
  materials: MaterialKind[];
  stones: StoneKind[];
  cuts: CutKind[];
  ready: boolean;
  min: string;
  max: string;
};

const EMPTY_FILTERS: Filters = {
  types: [],
  materials: [],
  stones: [],
  cuts: [],
  ready: false,
  min: '',
  max: '',
};

function toggleValue<T>(list: T[], value: T) {
  return list.includes(value) ? list.filter((item) => item !== value) : [...list, value];
}

function sortProducts(products: CollectionProduct[], sort: SortId) {
  const next = [...products];
  switch (sort) {
    case 'best':
      return next.sort((a, b) => Number(Boolean(b.badge)) - Number(Boolean(a.badge)));
    case 'title-asc':
      return next.sort((a, b) => a.title.localeCompare(b.title, 'fa'));
    case 'title-desc':
      return next.sort((a, b) => b.title.localeCompare(a.title, 'fa'));
    case 'price-asc':
      return next.sort((a, b) => a.priceValue - b.priceValue);
    case 'price-desc':
      return next.sort((a, b) => b.priceValue - a.priceValue);
    case 'date-desc':
      return next.reverse();
    default:
      return next;
  }
}

const PEEK_RATIO = 0.14;

function ProductSlideCard({ product }: { product: CollectionProduct }) {
  const router = useRouter();
  const trackRef = useRef<HTMLDivElement>(null);
  const drag = useRef({ startX: 0, delta: 0, dragging: false, tracking: false, skipClick: false });
  const [index, setIndex] = useState(0);
  const [active, setActive] = useState(false);
  const total = product.images.length;
  const href = `/products/${product.handle}`;
  const nextSrc = total > 1 ? product.images[(index + 1) % total] : product.images[0];

  const trackPosition = (slideIndex: number, extra = 0, animate = true) => {
    const track = trackRef.current;
    if (!track) return;
    const slide = track.children[slideIndex] as HTMLElement | undefined;
    const offset = slide?.offsetLeft ?? slideIndex * track.clientWidth;
    track.style.transition = animate ? 'transform 0.3s ease' : 'none';
    track.style.transform = `translateX(${-offset + extra}px)`;
  };

  const peekPx = () => {
    if (!active || total < 2 || drag.current.dragging) return 0;
    if (typeof window !== 'undefined' && !window.matchMedia('(hover: hover)').matches) return 0;
    const slide = trackRef.current?.children[index] as HTMLElement | undefined;
    return (slide?.offsetWidth ?? 0) * PEEK_RATIO;
  };

  const goTo = (nextIndex: number, animate = true) => {
    const wrapped = ((nextIndex % total) + total) % total;
    setIndex(wrapped);
    trackPosition(wrapped, active && total > 1 ? (trackRef.current?.clientWidth ?? 0) * PEEK_RATIO : 0, animate);
  };

  useLayoutEffect(() => {
    trackPosition(index, peekPx(), false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product.handle, total]);

  useLayoutEffect(() => {
    if (drag.current.dragging) return;
    trackPosition(index, peekPx(), true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, index]);

  useEffect(() => {
    const onResize = () => trackPosition(index, peekPx(), false);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, active, total]);

  const clientX = (event: MouseEvent | TouchEvent) =>
    'touches' in event ? (event.touches[0]?.clientX ?? 0) : event.clientX;

  const onPointerDown = (event: ReactMouseEvent | ReactTouchEvent) => {
    drag.current = { startX: clientX(event.nativeEvent), delta: 0, dragging: false, tracking: true, skipClick: false };
  };

  const onPointerMove = (event: MouseEvent | TouchEvent) => {
    if (!drag.current.tracking) return;
    const delta = clientX(event) - drag.current.startX;
    drag.current.delta = delta;
    if (!drag.current.dragging && Math.abs(delta) > 5) {
      drag.current.dragging = true;
      setActive(true);
    }
    if (!drag.current.dragging) return;
    const track = trackRef.current;
    const slide = track?.children[index] as HTMLElement | undefined;
    const base = slide?.offsetLeft ?? index * (track?.clientWidth ?? 0);
    if (track) {
      track.style.transition = 'none';
      track.style.transform = `translateX(${-base + delta}px)`;
    }
    if ('cancelable' in event && event.cancelable) event.preventDefault();
  };

  const finishDrag = () => {
    if (!drag.current.tracking) return;
    const { delta, dragging } = drag.current;
    drag.current.tracking = false;
    drag.current.startX = 0;
    if (!dragging) {
      drag.current.dragging = false;
      return;
    }
    drag.current.skipClick = true;
    drag.current.dragging = false;
    drag.current.delta = 0;
    const width = (trackRef.current?.children[index] as HTMLElement | undefined)?.offsetWidth ?? 1;
    if (delta < -width * 0.2) goTo(index + 1);
    else if (delta > width * 0.2) goTo(index - 1);
    else goTo(index);
  };

  useEffect(() => {
    const move = (event: MouseEvent | TouchEvent) => onPointerMove(event);
    const up = () => finishDrag();
    document.addEventListener('mousemove', move);
    document.addEventListener('mouseup', up);
    document.addEventListener('touchmove', move, { passive: false });
    document.addEventListener('touchend', up);
    return () => {
      document.removeEventListener('mousemove', move);
      document.removeEventListener('mouseup', up);
      document.removeEventListener('touchmove', move);
      document.removeEventListener('touchend', up);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, total]);

  const step = (direction: number, event: ReactMouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    goTo(index + direction);
  };

  const openProduct = () => {
    if (drag.current.skipClick || drag.current.dragging) {
      drag.current.skipClick = false;
      return;
    }
    router.push(href);
  };

  return (
    <article
      className={`ww-col-card${active ? ' is-active' : ''}`}
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => {
        setActive(false);
        if (!drag.current.tracking) trackPosition(index, 0, true);
      }}
    >
      <div className="ww-col-slider" dir="ltr">
        {product.badge ? <span className="ww-col-badge">{product.badge}</span> : null}
        <ProductBagButtons productId={product.handle} />
        {total > 1 ? (
          <div className="ww-col-slider-peek" aria-hidden="true">
            <Image src={nextSrc} alt="" fill sizes="(min-width: 990px) 25vw, 50vw" draggable={false} />
          </div>
        ) : null}
        <div
          ref={trackRef}
          className="ww-col-slider-track"
          onMouseDown={onPointerDown}
          onTouchStart={onPointerDown}
          onClick={openProduct}
          role="link"
          tabIndex={0}
          onKeyDown={(event) => {
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault();
              openProduct();
            }
          }}
        >
          {product.images.map((src, imageIndex) => (
            <div key={src} className="ww-col-slider-slide">
              <Image src={src} alt={imageIndex === 0 ? product.title : ''} fill sizes="(min-width: 990px) 25vw, 50vw" draggable={false} />
            </div>
          ))}
        </div>
        {total > 1 ? (
          <div className="ww-col-slider-nav">
            <button type="button" aria-label="قبلی" onClick={(event) => step(-1, event)}>
              [&lt;]
            </button>
            <span>
              [{toPersianNumber(index + 1)}/{toPersianNumber(total)}]
            </span>
            <button type="button" aria-label="بعدی" onClick={(event) => step(1, event)}>
              [&gt;]
            </button>
          </div>
        ) : null}
      </div>
      <div className="ww-col-card-body">
        <h3>
          <Link href={href}>{product.title}</Link>
        </h3>
        <p dir="ltr">{product.price}</p>
        <ul className="ww-col-meta">
          <li>
            <span>جنس</span>
            <span>{MATERIAL_LABELS[product.material]}</span>
          </li>
          <li>
            <span>سنگ</span>
            <span>{STONE_LABELS[product.stone]}</span>
          </li>
          <li>
            <span>تراش</span>
            <span>{CUT_LABELS[product.cut]}</span>
          </li>
        </ul>
      </div>
    </article>
  );
}

function FilterGroup<T extends string>({
  title,
  options,
  selected,
  onToggle,
}: {
  title: string;
  options: { id: T; label: string; count: number }[];
  selected: T[];
  onToggle: (id: T) => void;
}) {
  const [open, setOpen] = useState(true);
  if (!options.length) return null;
  return (
    <details className="ww-col-facet" open={open} onToggle={(event) => setOpen((event.target as HTMLDetailsElement).open)}>
      <summary>
        <span>{title}</span>
        <span>{open ? '[−]' : '[+]'}</span>
      </summary>
      <ul>
        {options.map((option) => {
          const on = selected.includes(option.id);
          return (
            <li key={option.id}>
              <label>
                <input type="checkbox" checked={on} onChange={() => onToggle(option.id)} />
                <span>
                  {on ? '[x]' : '[+]'} {option.label} [{toPersianNumber(option.count)}]
                </span>
              </label>
            </li>
          );
        })}
      </ul>
    </details>
  );
}

export function CollectionGrid({ collection }: { collection: WwakeCollection }) {
  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS);
  const [sort, setSort] = useState<SortId>('featured');
  const [sortOpen, setSortOpen] = useState(false);
  const [drawer, setDrawer] = useState(false);
  const [cols, setCols] = useState(4);
  const [mobile, setMobile] = useState(false);

  useEffect(() => {
    const media = window.matchMedia('(max-width: 749px)');
    const sync = () => {
      const isMobile = media.matches;
      setMobile(isMobile);
      setCols((current) => (isMobile ? (current === 1 ? 1 : 2) : current < 4 ? 4 : current));
    };
    sync();
    media.addEventListener('change', sync);
    return () => media.removeEventListener('change', sync);
  }, []);

  const filtered = useMemo(() => {
    return collection.products.filter((product) => {
      if (filters.types.length && !filters.types.includes(product.type)) return false;
      if (filters.materials.length && !filters.materials.includes(product.material)) return false;
      if (filters.stones.length && !filters.stones.includes(product.stone)) return false;
      if (filters.cuts.length && !filters.cuts.includes(product.cut)) return false;
      if (filters.ready && !product.readyToShip) return false;
      const min = filters.min ? Number(filters.min) : undefined;
      const max = filters.max ? Number(filters.max) : undefined;
      if (min !== undefined && !Number.isNaN(min) && product.priceValue < min) return false;
      if (max !== undefined && !Number.isNaN(max) && product.priceValue > max) return false;
      return true;
    });
  }, [collection.products, filters]);

  const visible = useMemo(() => sortProducts(filtered, sort), [filtered, sort]);
  const sortLabel = SORT_OPTIONS.find((option) => option.id === sort)?.label ?? 'منتخب';
  const colChoices = mobile ? [1, 2] : [4, 6, 8];
  const activeCount = visible.length;

  const facet = <T extends string>(key: keyof CollectionProduct, labels: Record<T, string>) => {
    const counts = new Map<T, number>();
    for (const product of collection.products) {
      const value = product[key] as T;
      counts.set(value, (counts.get(value) ?? 0) + 1);
    }
    return [...counts.entries()].map(([id, count]) => ({ id, label: labels[id], count }));
  };

  const typeFacets = facet('type', TYPE_LABELS);
  const materialFacets = facet('material', MATERIAL_LABELS);
  const stoneFacets = facet('stone', STONE_LABELS);
  const cutFacets = facet('cut', CUT_LABELS);
  const readyCount = collection.products.filter((product) => product.readyToShip).length;

  return (
    <section className="ww-col" style={{ '--ww-col-cols': String(cols) } as CSSProperties}>
      <header className="ww-col-header">
        <nav className="ww-col-crumbs" aria-label="مسیر">
          <Link href="/" className="ww-link">
            خانه
          </Link>
          <span>{collection.title}</span>
        </nav>
        <h1 className="ww-col-title">
          <span>{collection.title}</span>
          <span className="ww-col-count">[{toPersianNumber(activeCount)}]</span>
        </h1>
        <p className="ww-col-desc">{collection.description}</p>
      </header>

      <div className="ww-col-toolbar">
        <button type="button" className="ww-col-filter-btn" onClick={() => setDrawer(true)}>
          <span>[+]</span>
          <span>فیلترها</span>
          <span>[{toPersianNumber(activeCount)}]</span>
        </button>
        <div className="ww-col-tools">
          <button
            type="button"
            className={`ww-link${filters.ready ? ' is-on' : ''}`}
            onClick={() => setFilters((current) => ({ ...current, ready: !current.ready }))}
          >
            آماده ارسال
          </button>
          <div className="ww-col-sort">
            <button type="button" className="ww-col-sort-btn" onClick={() => setSortOpen((open) => !open)}>
              <span className="ww-link">مرتب‌سازی</span>
              <span>[{sortLabel}]</span>
            </button>
            {sortOpen ? (
              <div className="ww-col-sort-list">
                {SORT_OPTIONS.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    className={option.id === sort ? 'is-on' : ''}
                    onClick={() => {
                      setSort(option.id);
                      setSortOpen(false);
                    }}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            ) : null}
          </div>
          <div className="ww-col-cols" aria-label="تعداد ستون">
            {colChoices.map((value) => (
              <button
                key={value}
                type="button"
                aria-pressed={cols === value}
                className={cols === value ? 'is-on' : ''}
                onClick={() => setCols(value)}
              >
                {value}
              </button>
            ))}
          </div>
        </div>
      </div>

      {visible.length ? (
        <div className="ww-col-grid">
          {visible.map((product) => (
            <ProductSlideCard key={product.handle} product={product} />
          ))}
        </div>
      ) : (
        <p className="ww-col-empty">قطعه‌ای با این فیلترها پیدا نشد.</p>
      )}

      <section className="ww-pdp-next ww-col-next">
        <Link href="/shop" className="ww-pdp-next-col">
          <span className="ww-pdp-next-media">
            <AutoPlayVideo src="/landing/wwake/custom/process-inspire.mp4" poster="/landing/wwake/custom/process-inspire.jpg" />
          </span>
          <span className="ww-link">مشاهدهٔ همه [{toPersianNumber(ALL_COUNT)}]</span>
        </Link>
        <div className="ww-pdp-next-copy">
          <h2>جواهری برای پوشیدن، نگه داشتن و جلو بردن.</h2>
          <Link href="/custom" className="ww-link">
            بیشتر بخوانید
          </Link>
        </div>
        <Link href="/collections/ceremonial" className="ww-pdp-next-col">
          <span className="ww-pdp-next-media">
            <Image src="/landing/wwake/p-coast.jpg" alt="" fill sizes="320px" />
          </span>
          <span className="ww-link">آیینی</span>
        </Link>
      </section>

      {drawer ? (
        <div className="ww-col-drawer" role="dialog" aria-label="فیلترها">
          <button type="button" className="ww-col-drawer-scrim" aria-label="بستن" onClick={() => setDrawer(false)} />
          <aside className="ww-col-drawer-panel">
            <header>
              <p>فیلترها [{toPersianNumber(activeCount)}]</p>
              <button type="button" onClick={() => setDrawer(false)}>
                [x]
              </button>
            </header>
            <div className="ww-col-drawer-body">
              <FilterGroup
                title="نوع"
                options={typeFacets}
                selected={filters.types}
                onToggle={(id) => setFilters((current) => ({ ...current, types: toggleValue(current.types, id) }))}
              />
              <FilterGroup
                title="جنس"
                options={materialFacets}
                selected={filters.materials}
                onToggle={(id) => setFilters((current) => ({ ...current, materials: toggleValue(current.materials, id) }))}
              />
              <FilterGroup
                title="سنگ"
                options={stoneFacets}
                selected={filters.stones}
                onToggle={(id) => setFilters((current) => ({ ...current, stones: toggleValue(current.stones, id) }))}
              />
              <details className="ww-col-facet" open>
                <summary>
                  <span>موجودی</span>
                  <span>[−]</span>
                </summary>
                <ul>
                  <li>
                    <label>
                      <input
                        type="checkbox"
                        checked={filters.ready}
                        onChange={() => setFilters((current) => ({ ...current, ready: !current.ready }))}
                      />
                      <span>
                        {filters.ready ? '[x]' : '[+]'} آماده ارسال [{toPersianNumber(readyCount)}]
                      </span>
                    </label>
                  </li>
                </ul>
              </details>
              <details className="ww-col-facet" open>
                <summary>
                  <span>قیمت</span>
                  <span>[−]</span>
                </summary>
                <div className="ww-col-price">
                  <label>
                    حداقل
                    <input
                      type="number"
                      min={0}
                      value={filters.min}
                      onChange={(event) => setFilters((current) => ({ ...current, min: event.target.value }))}
                    />
                  </label>
                  <label>
                    حداکثر
                    <input
                      type="number"
                      min={0}
                      value={filters.max}
                      onChange={(event) => setFilters((current) => ({ ...current, max: event.target.value }))}
                    />
                  </label>
                </div>
              </details>
              <FilterGroup
                title="تراش"
                options={cutFacets}
                selected={filters.cuts}
                onToggle={(id) => setFilters((current) => ({ ...current, cuts: toggleValue(current.cuts, id) }))}
              />
            </div>
            <footer>
              <button type="button" className="ww-link" onClick={() => setFilters(EMPTY_FILTERS)}>
                پاک کردن
              </button>
              <button type="button" className="ww-col-apply" onClick={() => setDrawer(false)}>
                اعمال [{toPersianNumber(activeCount)}]
              </button>
            </footer>
          </aside>
        </div>
      ) : null}
    </section>
  );
}

const ALL_COUNT = 334;
