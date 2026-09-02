'use client';

import { SessionProvider } from 'next-auth/react';
import type { ReactNode } from 'react';
import { ReduxProvider } from '@/components/redux-provider';
import { SessionErrorHandler } from '@/components/session-error-handler';

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <SessionProvider refetchInterval={4 * 60}>
      <SessionErrorHandler />
      <ReduxProvider>{children}</ReduxProvider>
    </SessionProvider>
  );
}
