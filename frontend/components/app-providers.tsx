'use client';

import { SessionProvider } from 'next-auth/react';
import type { ReactNode } from 'react';
import { ReduxProvider } from '@/components/redux-provider';

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <ReduxProvider>{children}</ReduxProvider>
    </SessionProvider>
  );
}
