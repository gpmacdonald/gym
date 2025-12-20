import { useState, useEffect, useCallback, useSyncExternalStore } from 'react';

/**
 * Hook to detect online/offline status
 */
export function useOnlineStatus() {
  const subscribe = useCallback((callback: () => void) => {
    window.addEventListener('online', callback);
    window.addEventListener('offline', callback);
    return () => {
      window.removeEventListener('online', callback);
      window.removeEventListener('offline', callback);
    };
  }, []);

  const getSnapshot = useCallback(() => navigator.onLine, []);
  const getServerSnapshot = useCallback(() => true, []);

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

/**
 * Check if the app is running as an installed PWA
 */
function getIsPWA(): boolean {
  if (typeof window === 'undefined') return false;
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    // iOS Safari
    ('standalone' in window.navigator &&
      (window.navigator as Navigator & { standalone: boolean }).standalone)
  );
}

/**
 * Hook to detect if the app is running as an installed PWA
 */
export function useIsPWA() {
  // Initialize with computed value to avoid sync setState in effect
  const [isPWA] = useState(getIsPWA);
  return isPWA;
}

/**
 * Hook to handle service worker updates
 */
export function useServiceWorkerUpdate() {
  const [needsUpdate, setNeedsUpdate] = useState(false);
  const [registration, setRegistration] =
    useState<ServiceWorkerRegistration | null>(null);

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then((reg) => {
        setRegistration(reg);

        reg.addEventListener('updatefound', () => {
          const newWorker = reg.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (
                newWorker.state === 'installed' &&
                navigator.serviceWorker.controller
              ) {
                setNeedsUpdate(true);
              }
            });
          }
        });
      });
    }
  }, []);

  const updateServiceWorker = useCallback(() => {
    if (registration?.waiting) {
      registration.waiting.postMessage({ type: 'SKIP_WAITING' });
      window.location.reload();
    }
  }, [registration]);

  return { needsUpdate, updateServiceWorker };
}
