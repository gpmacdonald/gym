import { describe, it, expect, vi, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useOnlineStatus, useIsPWA } from '../pwa';

describe('PWA Hooks', () => {
  describe('useOnlineStatus', () => {
    it('should return true when online', () => {
      const { result } = renderHook(() => useOnlineStatus());
      expect(result.current).toBe(true);
    });

    it('should update when going offline', () => {
      const { result } = renderHook(() => useOnlineStatus());

      act(() => {
        // Simulate going offline
        Object.defineProperty(navigator, 'onLine', {
          value: false,
          writable: true,
          configurable: true,
        });
        window.dispatchEvent(new Event('offline'));
      });

      expect(result.current).toBe(false);

      // Restore online status
      act(() => {
        Object.defineProperty(navigator, 'onLine', {
          value: true,
          writable: true,
          configurable: true,
        });
        window.dispatchEvent(new Event('online'));
      });
    });

    it('should update when coming back online', () => {
      const { result } = renderHook(() => useOnlineStatus());

      act(() => {
        Object.defineProperty(navigator, 'onLine', {
          value: false,
          writable: true,
          configurable: true,
        });
        window.dispatchEvent(new Event('offline'));
      });
      expect(result.current).toBe(false);

      act(() => {
        Object.defineProperty(navigator, 'onLine', {
          value: true,
          writable: true,
          configurable: true,
        });
        window.dispatchEvent(new Event('online'));
      });
      expect(result.current).toBe(true);
    });
  });

  describe('useIsPWA', () => {
    const originalMatchMedia = window.matchMedia;

    afterEach(() => {
      window.matchMedia = originalMatchMedia;
    });

    it('should return false when not in standalone mode', () => {
      window.matchMedia = vi.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }));

      const { result } = renderHook(() => useIsPWA());
      expect(result.current).toBe(false);
    });

    it('should return true when in standalone mode', () => {
      window.matchMedia = vi.fn().mockImplementation((query) => ({
        matches: query === '(display-mode: standalone)',
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }));

      const { result } = renderHook(() => useIsPWA());
      expect(result.current).toBe(true);
    });
  });
});
