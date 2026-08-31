'use client';

import { useSelector } from 'react-redux';
import { Heart, ShoppingBag } from 'lucide-react';
import { formatUsd, getCatalogSnapshot } from '@/lib/catalog-product';
import { toPersianNumber } from '@/lib/format';
import { KpiCard, Verdict } from '@/components/dashboard/kpi-card';
import { Sparkline } from '@/components/dashboard/sparkline';
import type { RootState } from '@/store';
import { selectCartCount, selectCartItems, selectShopReady, selectWishlistCount } from '@/store/selectors';

export function BuyerOverview() {
  const ready = useSelector((state: RootState) => selectShopReady(state));
  const cartCount = useSelector((state: RootState) => selectCartCount(state));
  const wishlistCount = useSelector((state: RootState) => selectWishlistCount(state));
  const cartItems = useSelector((state: RootState) => selectCartItems(state));
  const total = cartItems.reduce((sum, item) => {
    const product = getCatalogSnapshot(item.productId);
    return sum + (product?.priceValue ?? 0) * item.quantity;
  }, 0);
  const spark = cartItems.length ? cartItems.map((item) => item.quantity) : [0, 0, 0, 0];

  return (
    <>
      <Verdict
        eyebrow="مجموع سبد خرید"
        value={
          <span dir="ltr" className="inline-block">
            {ready ? formatUsd(total) : '—'}
          </span>
        }
        detail={
          ready
            ? `${toPersianNumber(cartCount)} قلم در سبد · ${toPersianNumber(wishlistCount)} مورد در علاقه‌مندی‌ها`
            : 'در حال همگام‌سازی با سرور…'
        }
      />
      <div className="mb-10 mt-10 grid gap-4 sm:grid-cols-2">
        <KpiCard
          icon={<ShoppingBag className="size-4" aria-hidden />}
          label="سبد خرید"
          value={ready ? toPersianNumber(cartCount) : '—'}
          hint="تعداد قطعه‌های انتخاب‌شده برای خرید"
          trend={<Sparkline points={spark} className="text-gold-600" />}
        />
        <KpiCard
          icon={<Heart className="size-4" aria-hidden />}
          label="علاقه‌مندی‌ها"
          value={ready ? toPersianNumber(wishlistCount) : '—'}
          hint="محصولاتی که برای بعد ذخیره کرده‌اید"
          trend={<Sparkline points={wishlistCount ? [1, 1, 1, Math.max(1, wishlistCount)] : [0, 0, 0, 0]} className="text-gold-600" />}
        />
      </div>
    </>
  );
}
