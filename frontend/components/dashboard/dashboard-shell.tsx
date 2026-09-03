import type { ReactNode } from 'react';

export function DashboardShell({
  sidebar,
  mobileNav,
  children,
}: {
  sidebar: ReactNode;
  mobileNav: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="dash-canvas flex min-h-dvh">
      <aside className="sticky top-0 hidden h-dvh w-[17.5rem] shrink-0 flex-col border-s border-border/80 bg-surface/80 px-5 py-6 backdrop-blur-md md:flex">
        {sidebar}
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="border-b border-border/80 bg-surface/80 px-4 py-3 backdrop-blur-md md:hidden">
          {mobileNav}
        </div>
        <main className="mx-auto w-full max-w-6xl flex-1 px-5 py-10 sm:px-8 sm:py-12 lg:px-12">
          {children}
        </main>
      </div>
    </div>
  );
}

export function DashboardSidebarBody({
  brand,
  nav,
  footer,
}: {
  brand: ReactNode;
  nav: ReactNode;
  footer: ReactNode;
}) {
  return (
    <>
      <div className="px-1">{brand}</div>
      <div className="mt-10 flex-1">{nav}</div>
      <div className="mt-8 space-y-4 border-t border-border/70 pt-5">{footer}</div>
    </>
  );
}
