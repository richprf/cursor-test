import type { ReactNode } from 'react';
import { Reveal } from './reveal';

/** Consistent vertical rhythm and max width for every landing section. */
export function Section({
  id,
  children,
  className = '',
}: {
  id?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section id={id} className={`relative scroll-mt-24 py-20 sm:py-28 ${className}`}>
      <div className="mx-auto w-full max-w-6xl px-5 sm:px-8">{children}</div>
    </section>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'center',
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: 'center' | 'start';
}) {
  const alignment = align === 'center' ? 'text-center items-center' : 'text-right items-start';

  return (
    <Reveal className={`mx-auto flex max-w-2xl flex-col gap-3 ${alignment}`}>
      {eyebrow && (
        <span className="inline-flex items-center gap-2 rounded-full border border-gold-500/25 bg-gold-500/[0.07] px-3 py-1 text-xs font-medium text-gold-300">
          {eyebrow}
        </span>
      )}
      <h2 className="text-2xl font-bold leading-relaxed sm:text-3xl">{title}</h2>
      {description && <p className="text-sm leading-7 text-muted sm:text-base">{description}</p>}
    </Reveal>
  );
}
