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
      <div className="mx-auto w-full max-w-[1600px] px-5 sm:px-8 lg:px-10">{children}</div>
    </section>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'start',
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: 'center' | 'start';
}) {
  const alignment = align === 'center' ? 'text-center items-center' : 'text-start items-start';

  return (
    <Reveal y={40} className={`mb-12 flex max-w-4xl flex-col gap-5 sm:mb-16 ${alignment}`}>
      <h2 className="display-tight text-[clamp(1.85rem,4.6vw,3.75rem)] font-semibold">
        {eyebrow && <span className="text-muted">{eyebrow}. </span>}
        {title}
      </h2>
      {description && (
        <p className="max-w-2xl text-base leading-8 text-muted sm:text-lg">{description}</p>
      )}
    </Reveal>
  );
}
