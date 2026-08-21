/** Warm gold placeholder — no photography, slots for licensed stills later. */
export function GoldPlate({
  className = '',
  animated = false,
  label,
}: {
  className?: string;
  animated?: boolean;
  label?: string;
}) {
  return (
    <div
      className={`gold-plate relative overflow-hidden ${animated ? 'gold-plate-motion' : ''} ${className}`}
      aria-hidden={!label}
    >
      {label && <span className="sr-only">{label}</span>}
    </div>
  );
}
