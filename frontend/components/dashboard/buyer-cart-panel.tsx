'use client';

import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import { BuyerPanel, DashboardEmpty, DashboardTable } from '@/components/dashboard/buyer-panel';
import { CatalogThumb } from '@/components/dashboard/catalog-thumb';
import { formatCatalogPrice, formatMixedTotals, getCatalogSnapshot } from '@/lib/catalog-product';
import { toPersianNumber } from '@/lib/format';
import { primaryButtonClass } from '@/components/ui';
import { useListingCatalog } from '@/lib/use-listing-catalog';
import type { AppDispatch, RootState } from '@/store';
import { removeCartItem, updateCartQuantity } from '@/store/cartSlice';
import { selectCartItems, selectShopReady } from '@/store/selectors';

export function BuyerCartPanel() {
  const dispatch = useDispatch<AppDispatch>();
  const ready = useSelector((state: RootState) => selectShopReady(state));
  const cartItems = useSelector((state: RootState) => selectCartItems(state));
  const listings = useListingCatalog();
  const items = cartItems
    .map((item) => ({ ...item, product: getCatalogSnapshot(item.productId, listings) }))
    .filter((row) => row.product);
  const usdTotal = items
    .filter((row) => row.product!.currency !== 'TOMAN')
    .reduce((sum, row) => sum + row.product!.priceValue * row.quantity, 0);
  const tomanTotal = items
    .filter((row) => row.product!.currency === 'TOMAN')
    .reduce((sum, row) => sum + row.product!.priceValue * row.quantity, 0);

  return (
    <BuyerPanel title="سبد خرید">
      {!ready ? (
        <p className="text-sm text-muted">در حال همگام‌سازی با سرور…</p>
      ) : items.length === 0 ? (
        <DashboardEmpty
          icon={<ShoppingBag className="size-4" aria-hidden />}
          copy="سبد خرید خالی است."
          action={
            <Link href="/shop" className={`${primaryButtonClass} !w-auto px-5`}>
              رفتن به فروشگاه
            </Link>
          }
        />
      ) : (
        <>
          <DashboardTable>
            <table className="w-full min-w-[48rem] text-sm">
              <thead>
                <tr className="border-b border-border/70 text-[11px] font-medium tracking-[0.14em] text-muted">
                  <th className="px-5 py-3 text-start font-medium">محصول</th>
                  <th className="px-5 py-3 text-right font-medium">قیمت واحد</th>
                  <th className="px-5 py-3 text-center font-medium">تعداد</th>
                  <th className="px-5 py-3 text-right font-medium">جمع</th>
                  <th className="px-5 py-3 font-medium"> </th>
                </tr>
              </thead>
              <tbody>
                {items.map(({ productId, quantity, product }) => (
                  <tr key={productId} className="border-b border-border/60 last:border-b-0">
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
                      <div className="mx-auto inline-flex items-center rounded-lg border border-border">
                        <button
                          type="button"
                          className="grid size-8 place-items-center text-muted hover:text-foreground"
                          aria-label="کاهش تعداد"
                          onClick={() => void dispatch(updateCartQuantity({ productId, quantity: quantity - 1 }))}
                        >
                          <Minus className="size-3.5" />
                        </button>
                        <span className="min-w-8 text-center tabular-nums">{toPersianNumber(quantity)}</span>
                        <button
                          type="button"
                          className="grid size-8 place-items-center text-muted hover:text-foreground disabled:opacity-40"
                          aria-label="افزایش تعداد"
                          disabled={quantity >= 99}
                          onClick={() => void dispatch(updateCartQuantity({ productId, quantity: quantity + 1 }))}
                        >
                          <Plus className="size-3.5" />
                        </button>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-right font-medium tabular-nums">
                      {formatCatalogPrice(product!, quantity)}
                    </td>
                    <td className="px-5 py-4 text-end">
                      <button
                        type="button"
                        className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs text-muted transition hover:bg-background-elevated hover:text-foreground"
                        onClick={() => void dispatch(removeCartItem(productId))}
                      >
                        <Trash2 className="size-3.5" aria-hidden />
                        حذف
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </DashboardTable>
          <div className="mt-8 flex items-baseline justify-between border-t border-border/70 pt-6">
            <span className="text-sm text-muted">مجموع سبد</span>
            <strong className="text-3xl font-semibold tracking-tight tabular-nums">
              {formatMixedTotals(usdTotal, tomanTotal)}
            </strong>
          </div>
        </>
      )}
    </BuyerPanel>
  );
}
