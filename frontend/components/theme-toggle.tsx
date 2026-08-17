'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from './theme-provider';

export function ThemeToggle({ className = '' }: { className?: string }) {
  const { toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label="تغییر حالت روشن و تاریک"
      title="تغییر حالت روشن و تاریک"
      className={`grid size-9 place-items-center rounded-xl border border-border bg-surface text-gold-700 shadow-sm shadow-black/[0.04] transition hover:border-gold-500/50 hover:bg-background-elevated focus:outline-none focus:ring-4 focus:ring-gold-500/20 ${className}`}
    >
      {/* Visibility is driven by the `dark` class on <html>, so the icon is correct
          even before React hydrates. */}
      <Sun className="hidden size-4 dark:block" aria-hidden />
      <Moon className="block size-4 dark:hidden" aria-hidden />
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
