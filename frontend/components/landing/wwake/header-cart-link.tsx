'use client';

import Link from 'next/link';
import { useSelector } from 'react-redux';
import { toPersianNumber } from '@/lib/format';
import type { RootState } from '@/store';
import { selectCartCount } from '@/store/selectors';
import { useSignedIn } from '@/store/use-require-sign-in';

export function HeaderCartLink() {
  const signedIn = useSignedIn();
  const cartCount = useSelector((state: RootState) => selectCartCount(state));
  const href = signedIn ? '/dashboard/buyer/cart' : '/login?callbackUrl=/dashboard/buyer/cart';

  return (
    <Link href={href} className="ww-header-cart">
      سبد <span>[{toPersianNumber(cartCount)}]</span>
    </Link>
  );
}
