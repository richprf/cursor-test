'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSelector } from 'react-redux';
import { Heart, ShoppingBag, UserRound } from 'lucide-react';
import { toPersianNumber } from '@/lib/format';
import type { RootState } from '@/store';
import { selectCartCount, selectWishlistCount } from '@/store/selectors';

const LINKS = [
  { href: '/dashboard/buyer', label: 'پروفایل', exact: true, icon: UserRound },
  { href: '/dashboard/buyer/wishlist', label: 'علاقه‌مندی‌ها', count: 'wishlist' as const, icon: Heart },
  { href: '/dashboard/buyer/cart', label: 'سبد خرید', count: 'cart' as const, icon: ShoppingBag },
];

export function BuyerNav({ compact = false }: { compact?: boolean }) {
  const pathname = usePathname();
  const wishlistCount = useSelector((state: RootState) => selectWishlistCount(state));
  const cartCount = useSelector((state: RootState) => selectCartCount(state));

  return (
    <nav className={compact ? 'flex gap-1 overflow-x-auto' : 'flex flex-col gap-1'}>
      {LINKS.map((link) => {
        const active = link.exact ? pathname === link.href : pathname.startsWith(link.href);
        const count =
          link.count === 'wishlist' ? wishlistCount : link.count === 'cart' ? cartCount : null;
        const Icon = link.icon;
        return (
          <Link
            key={link.href}
            href={link.href}
            className={
              `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition ${
                compact ? 'shrink-0' : ''
              } ` +
              (active
                ? 'bg-gold-500/10 font-medium text-gold-700'
                : 'text-muted hover:bg-background-elevated hover:text-foreground')
            }
          >
            <Icon className="size-4 shrink-0" aria-hidden fill={active && link.count === 'wishlist' ? 'currentColor' : 'none'} />
            <span className="flex-1">{link.label}</span>
            {count !== null ? (
              <span className="tabular-nums text-xs text-muted">{toPersianNumber(count)}</span>
            ) : null}
          </Link>
        );
      })}
    </nav>
  );
}
