'use client';

import { SessionProvider } from 'next-auth/react';
import type { ReactNode } from 'react';
import { ShopBagProvider } from '@/components/shop/shop-bag-provider';

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <ShopBagProvider>{children}</ShopBagProvider>
    </SessionProvider>
  );
}
