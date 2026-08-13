import type { ComponentProps, ReactNode } from 'react';

// Small shared primitives so the forms stay readable; no UI library needed.

export const inputClass =
  'w-full rounded-xl border border-gold-500/20 bg-black/35 px-4 py-3 text-sm text-foreground ' +
  'outline-none transition placeholder:text-muted/60 hover:border-gold-500/40 ' +
  'focus:border-gold-500 focus:bg-black/50 focus:ring-4 focus:ring-gold-500/15 ' +
  'aria-invalid:border-red-500/70 disabled:cursor-not-allowed disabled:opacity-60';

export const primaryButtonClass =
  'bg-gold-metallic inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 ' +
  'text-sm font-semibold text-[#231a05] shadow-lg shadow-gold-500/20 transition ' +
  'hover:shadow-gold-500/30 focus:outline-none focus:ring-4 focus:ring-gold-500/30 ' +
  'disabled:cursor-not-allowed disabled:opacity-55 disabled:shadow-none';

/** Inline (auto-width) call to action used across the landing page. */
export const ctaPrimaryClass =
  'bg-gold-metallic inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3.5 ' +
  'text-sm font-semibold text-[#231a05] shadow-lg shadow-gold-500/20 transition ' +
  'hover:shadow-xl hover:shadow-gold-500/30 focus:outline-none focus:ring-4 focus:ring-gold-500/30';

export const ctaSecondaryClass =
  'inline-flex items-center justify-center gap-2 rounded-xl border border-gold-500/30 ' +
  'bg-white/[0.03] px-6 py-3.5 text-sm font-semibold text-foreground transition ' +
  'hover:border-gold-500/60 hover:bg-white/[0.06] focus:outline-none focus:ring-4 focus:ring-gold-500/20';

export const secondaryButtonClass =
  'inline-flex w-full items-center justify-center gap-3 rounded-xl border border-gold-500/25 ' +
  'bg-white/[0.03] px-4 py-3 text-sm font-medium text-foreground transition ' +
  'hover:border-gold-500/50 hover:bg-white/[0.06] focus:outline-none focus:ring-4 ' +
  'focus:ring-gold-500/20 disabled:cursor-not-allowed disabled:opacity-55';

export function Card({ children }: { children: ReactNode }) {
  return (
    <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-gold-500/30 bg-surface/75 p-8 shadow-2xl shadow-black/70 ring-1 ring-inset ring-white/5 backdrop-blur-xl">
      {/* Gold hairline along the top edge of the card. */}
      <span aria-hidden className="border-gold-hairline absolute inset-x-6 top-0 h-0.5" />
      {children}
    </div>
  );
}

export function Label({ children, htmlFor }: { children: ReactNode; htmlFor: string }) {
  return (
    <label htmlFor={htmlFor} className="mb-2 block text-sm font-medium text-foreground/85">
      {children}
    </label>
  );
}

export function FieldError({ children }: { children?: ReactNode }) {
  if (!children) return null;
  return <p className="mt-1.5 text-xs text-red-400">{children}</p>;
}

export function Alert({
  tone = 'error',
  children,
}: {
  tone?: 'error' | 'success';
  children: ReactNode;
}) {
  const tones = {
    error: 'border-red-500/35 bg-red-950/40 text-red-300',
    success: 'border-emerald-500/35 bg-emerald-950/40 text-emerald-300',
  };

  return (
    <div role="alert" className={`rounded-xl border px-4 py-3 text-sm ${tones[tone]}`}>
      {children}
    </div>
  );
}

/** Gold hairline with a label in the middle ("یا"). */
export function Divider({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-center gap-3 text-xs text-muted">
      <span aria-hidden className="border-gold-hairline h-px flex-1" />
      {children}
      <span aria-hidden className="border-gold-hairline h-px flex-1" />
    </div>
  );
}

export function Spinner(props: ComponentProps<'svg'>) {
  return (
    <svg viewBox="0 0 24 24" className="size-4 animate-spin" aria-hidden {...props}>
      <circle
        cx="12"
        cy="12"
        r="10"
        fill="none"
        stroke="currentColor"
        strokeOpacity="0.25"
        strokeWidth="4"
      />
      <path d="M12 2a10 10 0 0 1 10 10" fill="none" stroke="currentColor" strokeWidth="4" />
    </svg>
  );
}

export function ShieldIcon({ className = 'size-3.5' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" aria-hidden>
      <path
        d="M12 3 5 6v5.5c0 4.3 2.9 7.6 7 9.5 4.1-1.9 7-5.2 7-9.5V6z"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path d="m9 12 2.2 2.2L15.5 10" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

export function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-5" aria-hidden>
      <path
        fill="#4285F4"
        d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47a5.54 5.54 0 0 1-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82Z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.29v3.09A11.99 11.99 0 0 0 12 24Z"
      />
      <path
        fill="#FBBC05"
        d="M5.27 14.29a7.2 7.2 0 0 1 0-4.58V6.62H1.29a11.99 11.99 0 0 0 0 10.76l3.98-3.09Z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.7 0 3.99 2.47 1.29 6.62l3.98 3.09C6.22 6.86 8.87 4.75 12 4.75Z"
      />
    </svg>
  );
}
