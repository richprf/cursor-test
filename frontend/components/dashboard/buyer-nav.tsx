'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Heart, ShoppingBag, UserRound } from 'lucide-react';
import { toPersianNumber } from '@/lib/format';
import { useShopBag } from '@/components/shop/shop-bag-provider';

const LINKS = [
  { href: '/dashboard/buyer', label: 'پروفایل', exact: true },
  { href: '/dashboard/buyer/wishlist', label: 'علاقه‌مندی‌ها', count: 'wishlist' as const },
  { href: '/dashboard/buyer/cart', label: 'سبد خرید', count: 'cart' as const },
];

export function BuyerNav() {
  const pathname = usePathname();
  const bag = useShopBag();

  return (
    <nav className="flex flex-wrap items-center justify-center gap-2">
      {LINKS.map((link) => {
        const active = link.exact ? pathname === link.href : pathname.startsWith(link.href);
        const count =
          link.count === 'wishlist' ? bag.wishlistCount : link.count === 'cart' ? bag.cartCount : null;
        const Icon = link.exact ? UserRound : link.count === 'wishlist' ? Heart : ShoppingBag;
        return (
          <Link
            key={link.href}
            href={link.href}
            className={
              `inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition ` +
              (active
                ? 'border-gold-500/50 bg-gold-500/15 text-gold-700'
                : 'border-border bg-surface text-muted hover:border-gold-500/40 hover:text-foreground')
            }
          >
            <Icon className="size-4" aria-hidden fill={active && link.count === 'wishlist' ? 'currentColor' : 'none'} />
            <span>{link.label}</span>
            {count !== null ? (
              <span className="font-mono text-xs text-gold-700">[{toPersianNumber(count)}]</span>
            ) : null}
          </Link>
        );
      })}
    </nav>
  );
}
