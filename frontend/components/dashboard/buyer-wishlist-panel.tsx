'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Heart, ShoppingBag, Trash2 } from 'lucide-react';
import { BuyerPanel } from '@/components/dashboard/buyer-panel';
import { useShopBag } from '@/components/shop/shop-bag-provider';
import { getCatalogSnapshot } from '@/lib/catalog-product';
import { primaryButtonClass, secondaryButtonClass } from '@/components/ui';

export function BuyerWishlistPanel() {
  const bag = useShopBag();
  const items = [...bag.wishlistIds]
    .map((id) => ({ id, product: getCatalogSnapshot(id) }))
    .filter((row) => row.product);

  return (
    <BuyerPanel title="علاقه‌مندی‌ها">
      {!bag.ready ? (
        <p className="text-sm text-muted">در حال همگام‌سازی با سرور…</p>
      ) : items.length === 0 ? (
        <Empty copy="هنوز محصولی به علاقه‌مندی‌ها اضافه نکرده‌اید." />
      ) : (
        <ul className="divide-y divide-border/70 rounded-xl border border-border bg-background-elevated">
          {items.map(({ id, product }) => (
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
                <p className="mt-1 text-sm text-gold-700" dir="ltr">
                  {product!.price}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  className={`${secondaryButtonClass} !w-auto px-3 py-2 text-xs`}
                  onClick={() => void bag.toggleWishlist(id)}
                >
                  <Trash2 className="size-3.5" aria-hidden />
                  حذف
                </button>
                <button
                  type="button"
                  className={`${primaryButtonClass} !w-auto px-3 py-2 text-xs`}
                  onClick={() => void bag.moveWishlistToCart(id)}
                >
                  <ShoppingBag className="size-3.5" aria-hidden />
                  انتقال به سبد
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </BuyerPanel>
  );
}

function Empty({ copy }: { copy: string }) {
  return (
    <div className="rounded-xl border border-dashed border-gold-500/30 bg-gold-500/5 px-5 py-8 text-center">
      <Heart className="mx-auto mb-3 size-6 text-gold-700" aria-hidden />
      <p className="mb-4 text-sm text-muted">{copy}</p>
      <Link href="/shop" className={`${primaryButtonClass} !w-auto px-5`}>
        رفتن به فروشگاه
      </Link>
    </div>
  );
}
