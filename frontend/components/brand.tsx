/** Gold ingots stacked in a pyramid — the app mark. */
export function BrandMark({ className = 'size-7' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <defs>
        {/* Darker stops than the button gradient, to stay visible on light surfaces. */}
        <linearGradient id="brand-gold" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0%" stopColor="#8A6A15" />
          <stop offset="45%" stopColor="#BF953F" />
          <stop offset="75%" stopColor="#F5C542" />
          <stop offset="100%" stopColor="#D4AF37" />
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

export function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex items-center justify-center gap-2.5">
      <span
        className={
          compact
            ? 'grid size-8 place-items-center text-gold-700'
            : 'grid size-11 place-items-center rounded-2xl border border-gold-500/30 bg-gold-500/[0.12] shadow-sm shadow-gold-700/10'
        }
      >
        <BrandMark className={compact ? 'size-6' : 'size-7'} />
      </span>
      <span className={`font-bold tracking-tight ${compact ? 'text-sm' : 'text-gold-gradient text-lg'}`}>
        پژواک
      </span>
    </div>
  );
}
