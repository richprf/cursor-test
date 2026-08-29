import { Brand } from '@/components/brand';
import { BuyerNav } from '@/components/dashboard/buyer-nav';
import { ThemeToggleDock } from '@/components/theme-toggle';
import type { ReactNode } from 'react';

export default function BuyerDashboardLayout({ children }: { children: ReactNode }) {
  return (
    <main className="flex min-h-dvh flex-col items-center gap-7 p-6 pb-16">
      <ThemeToggleDock />
      <Brand />
      <BuyerNav />
      {children}
    </main>
  );
}
