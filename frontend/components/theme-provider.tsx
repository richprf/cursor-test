'use client';

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import {
  applyTheme,
  getSystemTheme,
  persistTheme,
  readStoredTheme,
  resolveTheme,
  type Theme,
} from '@/lib/theme';

interface ThemeContextValue {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('light');

  useEffect(() => {
    const initial = resolveTheme();
    setThemeState(initial);
    applyTheme(initial);

    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const onSystemChange = () => {
      if (readStoredTheme()) return;
      const next = getSystemTheme();
      setThemeState(next);
      applyTheme(next);
    };

    media.addEventListener('change', onSystemChange);
    return () => media.removeEventListener('change', onSystemChange);
  }, []);

  const value = useMemo<ThemeContextValue>(
    () => ({
      theme,
      setTheme: (next) => {
        setThemeState(next);
        applyTheme(next);
        persistTheme(next);
      },
      toggleTheme: () => {
        const next: Theme = theme === 'dark' ? 'light' : 'dark';
        setThemeState(next);
        applyTheme(next);
        persistTheme(next);
      },
    }),
    [theme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used inside <ThemeProvider>');
  }
  return context;
}
