const SHOT_VARIANTS = ['gold-plate-shot-0', 'gold-plate-shot-1', 'gold-plate-shot-2'] as const;

/** Warm gold placeholder — no photography, slots for licensed stills later. */
export function GoldPlate({
  className = '',
  animated = false,
  label,
  variant = 0,
}: {
  className?: string;
  animated?: boolean;
  label?: string;
  variant?: number;
}) {
  const shot = SHOT_VARIANTS[variant] ?? '';
  return (
    <div
      className={`gold-plate relative overflow-hidden ${shot} ${animated ? 'gold-plate-motion' : ''} ${className}`}
      aria-hidden={!label}
    >
      {label && <span className="sr-only">{label}</span>}
    </div>
  );
}
