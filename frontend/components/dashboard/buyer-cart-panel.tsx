'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import { BuyerPanel } from '@/components/dashboard/buyer-panel';
import { useShopBag } from '@/components/shop/shop-bag-provider';
import { formatUsd, getCatalogSnapshot } from '@/lib/catalog-product';
import { toPersianNumber } from '@/lib/format';
import { primaryButtonClass, secondaryButtonClass } from '@/components/ui';

export function BuyerCartPanel() {
  const bag = useShopBag();
  const items = [...bag.cartQuantities.entries()]
    .map(([id, quantity]) => ({ id, quantity, product: getCatalogSnapshot(id) }))
    .filter((row) => row.product);
  const total = items.reduce((sum, row) => sum + row.product!.priceValue * row.quantity, 0);

  return (
    <BuyerPanel title="سبد خرید">
      {!bag.ready ? (
        <p className="text-sm text-muted">در حال همگام‌سازی با سرور…</p>
      ) : items.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gold-500/30 bg-gold-500/5 px-5 py-8 text-center">
          <ShoppingBag className="mx-auto mb-3 size-6 text-gold-700" aria-hidden />
          <p className="mb-4 text-sm text-muted">سبد خرید خالی است.</p>
          <Link href="/shop" className={`${primaryButtonClass} !w-auto px-5`}>
            رفتن به فروشگاه
          </Link>
        </div>
      ) : (
        <>
          <ul className="divide-y divide-border/70 rounded-xl border border-border bg-background-elevated">
            {items.map(({ id, quantity, product }) => (
              <li key={id} className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
                <Link href={product!.href} className="relative size-20 shrink-0 overflow-hidden rounded-xl bg-background">
                  {product!.image ? (
                    <Image src={product!.image} alt={product!.title} fill sizes="80px" className="object-cover" />
                  ) : null}
                </Link>
                <div className="min-w-0 flex-1">
                  <Link href={product!.href} className="block truncate font-medium hover:text-gold-700">
                    {product!.title}
                  </Link>
                  <p className="mt-1 text-sm text-muted" dir="ltr">
                    {product!.price}
                  </p>
                  <p className="mt-1 text-sm font-medium text-gold-700" dir="ltr">
                    {formatUsd(product!.priceValue * quantity)}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <div className="inline-flex items-center rounded-xl border border-border bg-surface">
                    <button
                      type="button"
                      className="grid size-9 place-items-center text-gold-700"
                      aria-label="کاهش تعداد"
                      onClick={() => void bag.setCartQuantity(id, quantity - 1)}
                    >
                      <Minus className="size-4" />
                    </button>
                    <span className="min-w-8 text-center text-sm">{toPersianNumber(quantity)}</span>
                    <button
                      type="button"
                      className="grid size-9 place-items-center text-gold-700 disabled:opacity-40"
                      aria-label="افزایش تعداد"
                      disabled={quantity >= 99}
                      onClick={() => void bag.setCartQuantity(id, quantity + 1)}
                    >
                      <Plus className="size-4" />
                    </button>
                  </div>
                  <button
                    type="button"
                    className={`${secondaryButtonClass} !w-auto px-3 py-2 text-xs`}
                    onClick={() => void bag.removeFromCart(id)}
                  >
                    <Trash2 className="size-3.5" aria-hidden />
                    حذف
                  </button>
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-5 flex items-center justify-between rounded-xl border border-gold-500/25 bg-gold-500/10 px-4 py-3">
            <span className="text-sm text-muted">مجموع سبد</span>
            <strong className="text-base text-gold-700" dir="ltr">
              {formatUsd(total)}
            </strong>
          </div>
        </>
      )}
    </BuyerPanel>
  );
}
