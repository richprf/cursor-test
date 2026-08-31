import type { ReactNode } from 'react';

export function BuyerPanel({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section>
      <h1 className="mb-8 text-2xl font-semibold tracking-tight">{title}</h1>
      {children}
    </section>
  );
}

export function DashboardTable({ children }: { children: ReactNode }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border/80 bg-surface">
      <div className="overflow-x-auto">{children}</div>
    </div>
  );
}

export function DashboardEmpty({
  icon,
  copy,
  action,
}: {
  icon: ReactNode;
  copy: string;
  action: ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-dashed border-border bg-surface px-6 py-16 text-center">
      <div className="mx-auto mb-4 grid size-10 place-items-center rounded-full border border-border text-gold-700">
        {icon}
      </div>
      <p className="mb-6 text-sm text-muted">{copy}</p>
      {action}
    </div>
  );
}
