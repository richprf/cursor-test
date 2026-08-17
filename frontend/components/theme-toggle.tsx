'use client';

import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { Moon, Sun } from 'lucide-react';

export function ThemeToggle({ className = '' }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Avoid SSR/client mismatch: next-themes resolves the theme only on the client.
  if (!mounted) {
    return <span className={`inline-block size-9 ${className}`} aria-hidden />;
  }

  const isDark = resolvedTheme === 'dark';

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      aria-label={isDark ? 'تغییر به حالت روشن' : 'تغییر به حالت تاریک'}
      aria-pressed={isDark}
      title={isDark ? 'حالت روشن' : 'حالت تاریک'}
      className={`grid size-9 place-items-center rounded-xl border border-border bg-surface text-gold-700 shadow-sm shadow-black/[0.04] transition hover:border-gold-500/50 hover:bg-background-elevated focus:outline-none focus:ring-4 focus:ring-gold-500/20 ${className}`}
    >
      {isDark ? <Sun className="size-4" aria-hidden /> : <Moon className="size-4" aria-hidden />}
    </button>
  );
}

/** Corner control for pages that do not have the landing header. */
export function ThemeToggleDock() {
  return (
    <div className="fixed top-4 left-4 z-50">
      <ThemeToggle />
    </div>
  );
}
