/** Isometric gold ingot with a floating coin — the hero's main visual. */
export function GoldBarVisual({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 420 360" className={className} role="img" aria-label="شمش طلا">
      <defs>
        <linearGradient id="bar-top" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#fcf6ba" />
          <stop offset="45%" stopColor="#f5c542" />
          <stop offset="100%" stopColor="#d4af37" />
        </linearGradient>
        <linearGradient id="bar-front" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#bf953f" />
          <stop offset="55%" stopColor="#d4af37" />
          <stop offset="100%" stopColor="#8d6a1c" />
        </linearGradient>
        <linearGradient id="bar-side" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#a8801f" />
          <stop offset="100%" stopColor="#7a5c15" />
        </linearGradient>
        <linearGradient id="coin-face" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#fcf6ba" />
          <stop offset="50%" stopColor="#f5c542" />
          <stop offset="100%" stopColor="#b38728" />
        </linearGradient>
        <radialGradient id="glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#f5c542" stopOpacity="0.4" />
          <stop offset="60%" stopColor="#d4af37" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#d4af37" stopOpacity="0" />
        </radialGradient>
        {/* Moving highlight that sweeps across the ingot's top face. */}
        <linearGradient id="sheen" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
          <stop offset="50%" stopColor="#ffffff" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          <animate
            attributeName="x1"
            values="-1;1"
            dur="5s"
            repeatCount="indefinite"
            begin="1s"
          />
          <animate attributeName="x2" values="0;2" dur="5s" repeatCount="indefinite" begin="1s" />
        </linearGradient>
        <clipPath id="clip-top">
          <path d="M110 196 208 150l142 42-98 47z" />
        </clipPath>
      </defs>

      <ellipse cx="215" cy="205" rx="190" ry="140" fill="url(#glow)" />

      {/* Ingot: top / front / side faces drawn as one isometric block. */}
      <g>
        <path d="M110 196 208 150l142 42-98 47z" fill="url(#bar-top)" />
        <g clipPath="url(#clip-top)">
          <path d="M110 196 208 150l142 42-98 47z" fill="url(#sheen)" />
        </g>
        <path d="M110 196v42l142 43v-46z" fill="url(#bar-front)" />
        <path d="M252 239v46l98-47v-44z" fill="url(#bar-side)" />
        <path
          d="M110 196 208 150l142 42-98 47z"
          fill="none"
          stroke="#fcf6ba"
          strokeOpacity="0.5"
          strokeWidth="1.2"
        />
        {/* Stamped weight, matching the isometric top face. */}
        <text
          x="228"
          y="200"
          transform="rotate(-16 228 200)"
          textAnchor="middle"
          fontSize="17"
          fontWeight="700"
          fill="#8d6a1c"
          fillOpacity="0.75"
        >
          999.9
        </text>
      </g>

      {/* Floating coin, animated by the parent (float + parallax). */}
      <g transform="translate(96 96)">
        <circle cx="0" cy="0" r="41" fill="url(#coin-face)" />
        <circle cx="0" cy="0" r="41" fill="none" stroke="#8d6a1c" strokeOpacity="0.5" />
        <circle cx="0" cy="0" r="31" fill="none" stroke="#8d6a1c" strokeOpacity="0.45" />
        <text
          x="0"
          y="8"
          textAnchor="middle"
          fontSize="21"
          fontWeight="700"
          fill="#6f5314"
          fillOpacity="0.85"
        >
          AU
        </text>
      </g>
    </svg>
  );
}
