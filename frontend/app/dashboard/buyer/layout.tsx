import { Brand } from '@/components/brand';
import { BuyerNav } from '@/components/dashboard/buyer-nav';
import { DashboardShell, DashboardSidebarBody } from '@/components/dashboard/dashboard-shell';
import { SignOutButton } from '@/components/sign-out-button';
import { ThemeToggle } from '@/components/theme-toggle';
import type { ReactNode } from 'react';

const signOutClass =
  'inline-flex w-full items-center justify-start rounded-xl px-3 py-2 text-sm text-muted transition hover:bg-background-elevated hover:text-foreground';

export default function BuyerDashboardLayout({ children }: { children: ReactNode }) {
  return (
    <DashboardShell
      sidebar={
        <DashboardSidebarBody
          brand={<Brand compact />}
          nav={<BuyerNav />}
          footer={<SidebarSettings />}
        />
      }
      mobileNav={
        <div className="flex items-center justify-between gap-3">
          <Brand compact />
          <div className="min-w-0 flex-1">
            <BuyerNav compact />
          </div>
          <ThemeToggle />
        </div>
      }
    >
      {children}
    </DashboardShell>
  );
}

function SidebarSettings() {
  return (
    <div className="space-y-3">
      <p className="px-3 text-[11px] font-medium tracking-[0.18em] text-muted">تنظیمات</p>
      <div className="flex items-center justify-between px-3">
        <span className="text-sm text-muted">ظاهر</span>
        <ThemeToggle />
      </div>
      <SignOutButton className={signOutClass} />
    </div>
  );
}
