/** Quiet sparkline for empty or sparse series — gold stroke, no fill, no axes. */
export function Sparkline({ points, className = '' }: { points: number[]; className?: string }) {
  const series = points.length > 1 ? points : [0, 0];
  const max = Math.max(...series, 1);
  const min = Math.min(...series, 0);
  const span = Math.max(max - min, 1);
  const d = series
    .map((point, index) => {
      const x = (index / (series.length - 1)) * 100;
      const y = 28 - ((point - min) / span) * 22;
      return `${index === 0 ? 'M' : 'L'} ${x.toFixed(2)} ${y.toFixed(2)}`;
    })
    .join(' ');

  return (
    <svg viewBox="0 0 100 32" className={`h-8 w-20 overflow-visible ${className}`} aria-hidden>
      <path d={d} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
