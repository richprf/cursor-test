'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Box, LayoutGrid } from 'lucide-react';

const LINKS = [
  { href: '/dashboard/seller', label: 'نمای کلی', exact: true, icon: LayoutGrid },
  { href: '/dashboard/seller/products', label: 'محصولات', exact: false, icon: Box },
];

export function SellerNav({ compact = false }: { compact?: boolean }) {
  const pathname = usePathname();

  return (
    <nav className={compact ? 'flex gap-1 overflow-x-auto' : 'flex flex-col gap-1'}>
      {LINKS.map((link) => {
        const active = link.exact ? pathname === link.href : pathname.startsWith(link.href);
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
            <Icon className="size-4 shrink-0" aria-hidden />
            <span>{link.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
