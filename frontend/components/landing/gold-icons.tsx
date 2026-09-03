'use client';

import type { ReactNode } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

export type GoldIconProps = {
  className?: string;
  /** Subtle float + glow on hover when true (default). */
  interactive?: boolean;
};

function BaseIcon({
  children,
  interactive = true,
  className = '',
}: GoldIconProps & { children: ReactNode }) {
  const reduceMotion = useReducedMotion();

  if (!interactive || reduceMotion) {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        aria-hidden
      >
        {children}
      </svg>
    );
  }

  return (
    <motion.svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
      whileHover={{ y: -2, filter: 'drop-shadow(0 2px 6px rgba(212,175,55,0.35))' }}
      transition={{ type: 'spring', stiffness: 320, damping: 22 }}
    >
      {children}
    </motion.svg>
  );
}

/** Instant buy/sell — crossed arrows with a gold flash. */
export function InstantTradeIcon(props: GoldIconProps) {
  return (
    <BaseIcon {...props}>
      <path
        d="M6 8.5 4 6.5M4 6.5l2-2M4 6.5h5.5a3 3 0 0 1 3 3V11"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M18 15.5l2 2M20 17.5l-2 2M20 17.5H14.5a3 3 0 0 1-3-3V13"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="12" r="2.25" fill="currentColor" fillOpacity="0.22" />
      <path
        d="M11.2 10.8 12 9.5l.8 1.3"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </BaseIcon>
  );
}

/** Bank vault door with handle and hinges. */
export function VaultIcon(props: GoldIconProps) {
  return (
    <BaseIcon {...props}>
      <rect
        x="4.5"
        y="3.5"
        width="15"
        height="17"
        rx="2.5"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <circle cx="12" cy="12" r="4.25" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="12" cy="12" r="1.1" fill="currentColor" />
      <path d="M12 7.75v1.5M12 14.75v1.5M7.75 12h1.5M14.75 12h1.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M6.5 6.5h.01M17.5 6.5h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </BaseIcon>
  );
}

/** Three stacked gold coins with embossed rims. */
export function CoinStackIcon(props: GoldIconProps) {
  return (
    <BaseIcon {...props}>
      <ellipse cx="12" cy="16.5" rx="6.5" ry="2.2" stroke="currentColor" strokeWidth="1.4" />
      <path d="M5.5 14.5c0-1.2 2.9-2.2 6.5-2.2s6.5 1 6.5 2.2" stroke="currentColor" strokeWidth="1.4" />
      <ellipse cx="12" cy="12.5" rx="6.5" ry="2.2" stroke="currentColor" strokeWidth="1.4" />
      <path d="M5.5 10.5c0-1.2 2.9-2.2 6.5-2.2s6.5 1 6.5 2.2" stroke="currentColor" strokeWidth="1.4" />
      <ellipse cx="12" cy="8.5" rx="6.5" ry="2.2" fill="currentColor" fillOpacity="0.12" stroke="currentColor" strokeWidth="1.4" />
      <path d="M10.2 8.2h3.6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </BaseIcon>
  );
}

/** Mini price chart with upward trend line. */
export function LiveChartIcon(props: GoldIconProps) {
  return (
    <BaseIcon {...props}>
      <path
        d="M4 18V6.5M4 18h16"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <path
        d="M7 14.5 10.2 11.3 13.4 13.1 17.5 8.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="17.5" cy="8.5" r="1.4" fill="currentColor" />
      <path
        d="M15.8 7.2 17.5 5.5 19.2 7.2"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </BaseIcon>
  );
}

/** Community of investors — overlapping silhouettes. */
export function CommunityIcon(props: GoldIconProps) {
  return (
    <BaseIcon {...props}>
      <circle cx="9" cy="8.5" r="2.6" stroke="currentColor" strokeWidth="1.4" />
      <path d="M4.5 17.5c.6-2.4 2.4-3.7 4.5-3.7s3.9 1.3 4.5 3.7" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <circle cx="15.8" cy="9.2" r="2.1" stroke="currentColor" strokeWidth="1.3" strokeOpacity="0.75" />
      <path d="M12.5 17.5c.45-1.8 1.8-2.8 3.3-2.8 1.2 0 2.2.6 2.8 1.6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeOpacity="0.75" />
    </BaseIcon>
  );
}

/** Classical treasury columns with pediment. */
export function TreasuryIcon(props: GoldIconProps) {
  return (
    <BaseIcon {...props}>
      <path d="M5 7.5h14l-1.4 2.2H6.4L5 7.5Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
      <path d="M7.5 9.7v8.3M10.5 9.7v8.3M13.5 9.7v8.3M16.5 9.7v8.3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M6 18h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M8.5 5.5h7" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </BaseIcon>
  );
}

/** Shield with a check — insured custody. */
export function InsuredShieldIcon(props: GoldIconProps) {
  return (
    <BaseIcon {...props}>
      <path
        d="M12 3.5 18.5 6.2v5.4c0 3.4-2.4 5.8-6.5 7.4-4.1-1.6-6.5-4-6.5-7.4V6.2L12 3.5Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M9.2 12.1 11 13.9l3.8-3.9"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </BaseIcon>
  );
}

/** 24-hour support badge. */
export function SupportBadgeIcon(props: GoldIconProps) {
  return (
    <BaseIcon {...props}>
      <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M12 7.5v5l3 1.8"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7.2 16.2h9.6"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeOpacity="0.7"
      />
      <text x="12" y="6.2" textAnchor="middle" fontSize="3.2" fontWeight="700" fill="currentColor">
        24
      </text>
    </BaseIcon>
  );
}

/** Sign-up — user silhouette with a plus badge. */
export function SignUpIcon(props: GoldIconProps) {
  return (
    <BaseIcon {...props}>
      <circle cx="10" cy="8.5" r="3" stroke="currentColor" strokeWidth="1.5" />
      <path d="M4.5 18.5c.8-2.8 2.8-4.3 5.5-4.3s4.7 1.5 5.5 4.3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="17" cy="7" r="3.5" fill="currentColor" fillOpacity="0.14" stroke="currentColor" strokeWidth="1.3" />
      <path d="M17 5.3v3.4M15.3 7h3.4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </BaseIcon>
  );
}

/** Wallet top-up — wallet body with a card slot. */
export function WalletChargeIcon(props: GoldIconProps) {
  return (
    <BaseIcon {...props}>
      <path
        d="M4.5 8.5h12.5a2 2 0 0 1 2 2v7.5a2 2 0 0 1-2 2H6.5a2 2 0 0 1-2-2v-9a2 2 0 0 1 2-2Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M4.5 11h13.5" stroke="currentColor" strokeWidth="1.4" />
      <rect x="14.5" y="13.5" width="4" height="2.8" rx="0.8" stroke="currentColor" strokeWidth="1.3" />
      <path
        d="M8.5 5.5 10 7l3.5-3.5"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </BaseIcon>
  );
}

/** Buy gold — small ingot entering a shielded vault. */
export function BuyGoldIcon(props: GoldIconProps) {
  return (
    <BaseIcon {...props}>
      <path
        d="M12 4.2 15.8 6.4v5.2L12 13.8 8.2 11.6V6.4L12 4.2Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <path d="M8.2 6.4 12 8.6l3.8-2.2" stroke="currentColor" strokeWidth="1.2" strokeOpacity="0.65" />
      <path
        d="M5.5 16.5h13"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M7.5 16.5V13a4.5 4.5 0 0 1 9 0v3.5"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    </BaseIcon>
  );
}

/** Premium sparkle for the hero eyebrow badge. */
export function SparkleBadgeIcon({ interactive = true, className = '' }: GoldIconProps) {
  const reduceMotion = useReducedMotion();

  const svg = (
    <>
      <path
        d="M12 2.8 13.1 8.9 19.2 10 13.1 11.1 12 17.2 10.9 11.1 4.8 10l6.1-1.1L12 2.8Z"
        fill="currentColor"
        fillOpacity="0.2"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      <path d="M18.5 4.5v2.2M19.6 5.6h-2.2M6.5 15.5v1.6M7.3 16.3H5.7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </>
  );

  if (!interactive || reduceMotion) {
    return (
      <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
        {svg}
      </svg>
    );
  }

  return (
    <motion.svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden
      animate={{ rotate: [0, 8, -8, 0], scale: [1, 1.06, 1] }}
      transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
    >
      {svg}
    </motion.svg>
  );
}

/** Compact vault mark for trust pills. */
export function VaultTrustIcon(props: GoldIconProps) {
  return (
    <BaseIcon interactive={false} {...props}>
      <rect x="6" y="5" width="12" height="14" rx="2" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="12" cy="12" r="2.8" stroke="currentColor" strokeWidth="1.3" />
      <circle cx="12" cy="12" r="0.8" fill="currentColor" />
      <path d="M8 18.5h8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeOpacity="0.6" />
    </BaseIcon>
  );
}

/** Live sparkline for the hero price badge. */
export function LiveSparklineIcon({ interactive = true, className = '' }: GoldIconProps) {
  const reduceMotion = useReducedMotion();

  const line = (
  <path
      d="M3.5 15.5 7.5 12.5 10.5 13.8 14 9.5 17 11.2 20.5 7.5"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeDasharray="24"
      strokeDashoffset={reduceMotion ? 0 : 24}
    >
      {!reduceMotion && (
        <animate attributeName="stroke-dashoffset" values="24;0" dur="1.8s" fill="freeze" />
      )}
    </path>
  );

  if (!interactive || reduceMotion) {
    return (
      <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
        <path d="M3.5 18.5h17" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeOpacity="0.35" />
        {line}
        <circle cx="20.5" cy="7.5" r="1.3" fill="currentColor" />
      </svg>
    );
  }

  return (
    <motion.svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden
      whileHover={{ scale: 1.08 }}
      transition={{ type: 'spring', stiffness: 400, damping: 18 }}
    >
      <path d="M3.5 18.5h17" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeOpacity="0.35" />
      {line}
      <circle cx="20.5" cy="7.5" r="1.3" fill="currentColor" />
    </motion.svg>
  );
}
