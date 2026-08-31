'use client';

import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { Heart, ShoppingBag, Trash2 } from 'lucide-react';
import { BuyerPanel, DashboardEmpty, DashboardTable } from '@/components/dashboard/buyer-panel';
import { CatalogThumb } from '@/components/dashboard/catalog-thumb';
import { formatCatalogPrice, getCatalogSnapshot } from '@/lib/catalog-product';
import { primaryButtonClass } from '@/components/ui';
import { useListingCatalog } from '@/lib/use-listing-catalog';
import type { AppDispatch, RootState } from '@/store';
import { moveWishlistToCart } from '@/store/cartSlice';
import { selectShopReady, selectWishlistIds } from '@/store/selectors';
import { removeWishlistItem } from '@/store/wishlistSlice';

export function BuyerWishlistPanel() {
  const dispatch = useDispatch<AppDispatch>();
  const ready = useSelector((state: RootState) => selectShopReady(state));
  const wishlistIds = useSelector((state: RootState) => selectWishlistIds(state));
  const listings = useListingCatalog();
  const items = wishlistIds
    .map((id) => ({ id, product: getCatalogSnapshot(id, listings) }))
    .filter((row) => row.product);

  return (
    <BuyerPanel title="علاقه‌مندی‌ها">
      {!ready ? (
        <p className="text-sm text-muted">در حال همگام‌سازی با سرور…</p>
      ) : items.length === 0 ? (
        <DashboardEmpty
          icon={<Heart className="size-4" aria-hidden />}
          copy="هنوز محصولی به علاقه‌مندی‌ها اضافه نکرده‌اید."
          action={
            <Link href="/shop" className={`${primaryButtonClass} !w-auto px-5`}>
              رفتن به فروشگاه
            </Link>
          }
        />
      ) : (
        <DashboardTable>
          <table className="w-full min-w-[40rem] text-sm">
            <thead>
              <tr className="border-b border-border/70 text-[11px] font-medium tracking-[0.14em] text-muted">
                <th className="px-5 py-3 text-start font-medium">محصول</th>
                <th className="px-5 py-3 text-right font-medium">قیمت</th>
                <th className="px-5 py-3 text-end font-medium"> </th>
              </tr>
            </thead>
            <tbody>
              {items.map(({ id, product }) => (
                <tr key={id} className="border-b border-border/60 last:border-b-0">
                  <td className="px-5 py-4">
                    <Link href={product!.href} className="flex items-center gap-4">
                      <span className="relative size-12 shrink-0 overflow-hidden rounded-lg bg-background-elevated">
                        <CatalogThumb src={product!.image} alt={product!.title} />
                      </span>
                      <span className="truncate font-medium hover:text-gold-700">{product!.title}</span>
                    </Link>
                  </td>
                  <td className="px-5 py-4 text-right tabular-nums text-muted">
                    {formatCatalogPrice(product!)}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs text-muted transition hover:bg-background-elevated hover:text-foreground"
                        onClick={() => void dispatch(removeWishlistItem(id))}
                      >
                        <Trash2 className="size-3.5" aria-hidden />
                        حذف
                      </button>
                      <button
                        type="button"
                        className="inline-flex items-center gap-1.5 rounded-lg bg-gold-500/10 px-2.5 py-1.5 text-xs font-medium text-gold-700 transition hover:bg-gold-500/20"
                        onClick={() => void dispatch(moveWishlistToCart(id))}
                      >
                        <ShoppingBag className="size-3.5" aria-hidden />
                        انتقال به سبد
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </DashboardTable>
      )}
    </BuyerPanel>
  );
}
