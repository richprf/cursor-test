/** Gold ingots stacked in a pyramid — the app mark. */
export function BrandMark({ className = 'size-7' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <defs>
        <linearGradient id="brand-gold" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0%" stopColor="#9C7C1F" />
          <stop offset="45%" stopColor="#D4AF37" />
          <stop offset="75%" stopColor="#F7E6A8" />
          <stop offset="100%" stopColor="#F5C542" />
        </linearGradient>
      </defs>
      <g fill="url(#brand-gold)">
        <path d="M7.2 14.2 8.9 8.8h6.2l1.7 5.4z" />
        <path d="M2 20.8 3.7 15.4h6.2l1.7 5.4z" />
        <path d="M12.4 20.8 14.1 15.4h6.2l1.7 5.4z" />
      </g>
    </svg>
  );
}

export function Brand() {
  return (
    <div className="flex items-center justify-center gap-2.5">
      <span className="grid size-11 place-items-center rounded-2xl border border-gold-500/30 bg-gold-500/10 shadow-inner shadow-gold-500/10">
        <BrandMark />
      </span>
      <span className="text-gold-gradient text-lg font-bold tracking-tight">زرین‌سرمایه</span>
    </div>
  );
}
