'use client';

import Link from 'next/link';
import { toPersianNumber } from '@/lib/format';
import { useShopBag } from '@/components/shop/shop-bag-provider';

export function HeaderCartLink() {
  const bag = useShopBag();
  const href = bag.signedIn ? '/dashboard/buyer/cart' : '/login?callbackUrl=/dashboard/buyer/cart';

  return (
    <Link href={href} className="ww-header-cart">
      سبد <span>[{toPersianNumber(bag.cartCount)}]</span>
    </Link>
  );
}
