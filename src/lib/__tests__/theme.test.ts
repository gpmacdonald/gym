import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { getEffectiveTheme, applyTheme } from '../theme';

describe('theme utilities', () => {
  describe('getEffectiveTheme', () => {
    const originalMatchMedia = window.matchMedia;

    afterEach(() => {
      window.matchMedia = originalMatchMedia;
    });

    it('should return "light" when theme is "light"', () => {
      expect(getEffectiveTheme('light')).toBe('light');
    });

    it('should return "dark" when theme is "dark"', () => {
      expect(getEffectiveTheme('dark')).toBe('dark');
    });

    it('should return "dark" when theme is "system" and prefers dark', () => {
      window.matchMedia = vi.fn().mockImplementation(() => ({
        matches: true,
        media: '(prefers-color-scheme: dark)',
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      }));

      expect(getEffectiveTheme('system')).toBe('dark');
    });

    it('should return "light" when theme is "system" and prefers light', () => {
      window.matchMedia = vi.fn().mockImplementation(() => ({
        matches: false,
        media: '(prefers-color-scheme: dark)',
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      }));

      expect(getEffectiveTheme('system')).toBe('light');
    });
  });

  describe('applyTheme', () => {
    beforeEach(() => {
      document.documentElement.classList.remove('dark');
    });

    it('should add "dark" class when theme is dark', () => {
      applyTheme('dark');
      expect(document.documentElement.classList.contains('dark')).toBe(true);
    });

    it('should remove "dark" class when theme is light', () => {
      document.documentElement.classList.add('dark');
      applyTheme('light');
      expect(document.documentElement.classList.contains('dark')).toBe(false);
    });

    it('should not have "dark" class after applying light theme', () => {
      applyTheme('light');
      expect(document.documentElement.classList.contains('dark')).toBe(false);
    });
  });
});
