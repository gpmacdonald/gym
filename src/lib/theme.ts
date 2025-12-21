import { useEffect, useCallback } from 'react';
import { useSettingsStore } from '../stores/settingsStore';
import type { Theme } from '../types';

/**
 * Returns the effective theme based on user preference and system settings
 */
export function getEffectiveTheme(theme: Theme): 'light' | 'dark' {
  if (theme === 'system') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  }
  return theme;
}

/**
 * Applies the dark class to the document element
 */
export function applyTheme(effectiveTheme: 'light' | 'dark'): void {
  if (effectiveTheme === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
}

/**
 * Hook that manages theme application and system preference listening
 * Should be called once at the app root level
 */
export function useTheme() {
  const theme = useSettingsStore((state) => state.theme);
  const setTheme = useSettingsStore((state) => state.setTheme);

  // Apply theme on mount and when theme changes
  useEffect(() => {
    const effectiveTheme = getEffectiveTheme(theme);
    applyTheme(effectiveTheme);
  }, [theme]);

  // Listen to system preference changes when theme is 'system'
  useEffect(() => {
    if (theme !== 'system') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      applyTheme(e.matches ? 'dark' : 'light');
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  const effectiveTheme = getEffectiveTheme(theme);
  const isDark = effectiveTheme === 'dark';

  const toggleTheme = useCallback(() => {
    // Cycle through: light -> dark -> system
    const nextTheme: Theme =
      theme === 'light' ? 'dark' : theme === 'dark' ? 'system' : 'light';
    setTheme(nextTheme);
  }, [theme, setTheme]);

  return {
    theme,
    effectiveTheme,
    isDark,
    setTheme,
    toggleTheme,
  };
}
