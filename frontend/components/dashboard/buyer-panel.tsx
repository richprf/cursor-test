import type { ReactNode } from 'react';

export function BuyerPanel({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="relative w-full max-w-3xl overflow-hidden rounded-3xl border border-gold-500/25 bg-surface p-6 shadow-2xl shadow-black/[0.08] theme-fade sm:p-8">
      <span aria-hidden className="border-gold-hairline absolute inset-x-6 top-0 h-0.5" />
      <h1 className="mb-6 text-lg font-semibold">{title}</h1>
      {children}
    </section>
  );
}
