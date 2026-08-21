'use client';

const LOGOS = [
  'خزانهٔ بانکی',
  'بیمهٔ کامل',
  'کارمزد صفر',
  'تحویل فیزیکی',
  'ورود با گوگل',
  'قیمت زنده',
  'بدون حداقل',
  'پشتیبانی ۲۴ساعته',
];

/** Horizontal auto-scrolling partner strip — hellohello "Trusted by". */
export function TrustBar() {
  const row = [...LOGOS, ...LOGOS];

  return (
    <section id="clients" className="overflow-hidden border-y border-foreground/10 py-10">
      <p className="mb-6 px-5 text-[11px] uppercase tracking-[0.22em] text-muted sm:px-8 lg:px-10">
        مورد اعتماد
      </p>
      <div className="flex w-max animate-marquee" dir="ltr">
        {[0, 1].map((copy) => (
          <div key={copy} className="flex shrink-0 items-center" aria-hidden={copy === 1 || undefined}>
            {row.map((item, index) => (
              <span
                key={`${copy}-${item}-${index}`}
                dir="rtl"
                className="px-10 text-lg font-semibold tracking-tight text-foreground/80 sm:text-2xl"
              >
                {item}
                <span className="ms-10 text-gold-500" aria-hidden>
                  +
                </span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
