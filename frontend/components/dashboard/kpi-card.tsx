import type { ReactNode } from 'react';

export function KpiCard({
  icon,
  label,
  value,
  hint,
  trend,
}: {
  icon: ReactNode;
  label: string;
  value: ReactNode;
  hint: string;
  trend?: ReactNode;
}) {
  return (
    <article className="flex min-h-[9.5rem] flex-col justify-between rounded-2xl border border-border/80 bg-surface p-5 shadow-[0_1px_0_rgba(255,255,255,0.04)]">
      <div className="flex items-start justify-between gap-3">
        <span className="grid size-9 place-items-center rounded-xl border border-border bg-background-elevated text-gold-700">
          {icon}
        </span>
        {trend}
      </div>
      <div className="mt-6">
        <p className="text-[11px] font-medium tracking-[0.18em] text-muted">{label}</p>
        <p className="mt-1 text-3xl font-semibold tracking-tight tabular-nums">{value}</p>
        <p className="mt-2 text-sm leading-6 text-muted">{hint}</p>
      </div>
    </article>
  );
}

export function Verdict({
  eyebrow,
  value,
  detail,
}: {
  eyebrow: string;
  value: ReactNode;
  detail: ReactNode;
}) {
  return (
    <header className="max-w-3xl">
      <p className="text-[11px] font-medium tracking-[0.22em] text-muted">{eyebrow}</p>
      <h1 className="mt-3 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl lg:text-[3.5rem] lg:leading-[1.1]">
        {value}
      </h1>
      <div className="mt-4 max-w-xl text-sm leading-7 text-muted">{detail}</div>
    </header>
  );
}
