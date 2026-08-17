export const THEME_STORAGE_KEY = 'zarin-theme';
export const THEME_COOKIE = 'zarin-theme';

export type Theme = 'light' | 'dark';

export function isTheme(value: unknown): value is Theme {
  return value === 'light' || value === 'dark';
}

export function getSystemTheme(): Theme {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function readStoredTheme(): Theme | null {
  try {
    const value = window.localStorage.getItem(THEME_STORAGE_KEY);
    return isTheme(value) ? value : null;
  } catch {
    return null;
  }
}

export function resolveTheme(): Theme {
  return readStoredTheme() ?? getSystemTheme();
}

export function applyTheme(theme: Theme) {
  const root = document.documentElement;
  root.classList.toggle('dark', theme === 'dark');
  root.style.colorScheme = theme;
}

export function persistTheme(theme: Theme) {
  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // Private mode / blocked storage — cookie still covers return visits on this host.
  }

  document.cookie = `${THEME_COOKIE}=${theme}; path=/; max-age=31536000; SameSite=Lax`;
}

/**
 * Runs before first paint so the html class matches the stored (or system) theme
 * and the first frame is not the wrong palette.
 */
export const THEME_BOOTSTRAP_SCRIPT = `(function(){
  try {
    var key = '${THEME_STORAGE_KEY}';
    var stored = localStorage.getItem(key);
    var theme = (stored === 'light' || stored === 'dark')
      ? stored
      : (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    var root = document.documentElement;
    root.classList.toggle('dark', theme === 'dark');
    root.style.colorScheme = theme;
  } catch (e) {}
})();`;
