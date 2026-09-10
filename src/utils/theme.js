const THEME_KEY = 'weatherapp_theme';

/**
 * @returns {'light' | 'dark'}
 */
export const getTheme = () => {
  const saved = localStorage.getItem(THEME_KEY);
  if (saved === 'light' || saved === 'dark') return saved;

  // fall back to OS preference on first visit
  const prefersDark = window.matchMedia(
    '(prefers-color-scheme: dark)'
  ).matches;
  return prefersDark ? 'dark' : 'light';
};

/**
 * Apply a theme to <html> and persist it.
 * @param {'light' | 'dark'} theme
 */
export const applyTheme = (theme) => {
  document.documentElement.classList.toggle('dark', theme === 'dark');
  localStorage.setItem(THEME_KEY, theme);
};

/**
 * @param {'light' | 'dark'} current
 * @returns {'light' | 'dark'} the new theme, already applied
 */
export const toggleTheme = (current) => {
  const next = current === 'dark' ? 'light' : 'dark';
  applyTheme(next);
  return next;
};
