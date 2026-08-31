'use client';

import Link from 'next/link';
import { LayoutGrid } from 'lucide-react';

export function SellerNav({ compact = false }: { compact?: boolean }) {
  return (
    <nav className={compact ? 'flex gap-1 overflow-x-auto' : 'flex flex-col gap-1'}>
      <Link
        href="/dashboard/seller"
        className={`flex items-center gap-3 rounded-xl bg-gold-500/10 px-3 py-2.5 text-sm font-medium text-gold-700 ${compact ? 'shrink-0' : ''}`}
      >
        <LayoutGrid className="size-4 shrink-0" aria-hidden />
        <span>نمای کلی</span>
      </Link>
    </nav>
  );
}
