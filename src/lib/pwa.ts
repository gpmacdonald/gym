import { useState, useEffect, useCallback, useSyncExternalStore } from 'react';

// Storage key for install prompt dismissal
const INSTALL_PROMPT_DISMISSED_KEY = 'fitness-install-prompt-dismissed';
const FIRST_WORKOUT_COMPLETED_KEY = 'fitness-first-workout-completed';

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

// Type for beforeinstallprompt event
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

// Store the deferred prompt globally
let deferredPrompt: BeforeInstallPromptEvent | null = null;

/**
 * Hook to handle PWA install prompt
 */
export function useInstallPrompt() {
  const [canInstall, setCanInstall] = useState(false);
  const [isDismissed, setIsDismissed] = useState(() => {
    return localStorage.getItem(INSTALL_PROMPT_DISMISSED_KEY) === 'true';
  });
  const [hasCompletedFirstWorkout, setHasCompletedFirstWorkout] = useState(
    () => {
      return localStorage.getItem(FIRST_WORKOUT_COMPLETED_KEY) === 'true';
    }
  );
  const isPWA = useIsPWA();

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      deferredPrompt = e as BeforeInstallPromptEvent;
      setCanInstall(true);
    };

    const handleAppInstalled = () => {
      deferredPrompt = null;
      setCanInstall(false);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener(
        'beforeinstallprompt',
        handleBeforeInstallPrompt
      );
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const promptInstall = useCallback(async () => {
    if (!deferredPrompt) return false;

    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    deferredPrompt = null;
    setCanInstall(false);

    return outcome === 'accepted';
  }, []);

  const dismissPrompt = useCallback(() => {
    localStorage.setItem(INSTALL_PROMPT_DISMISSED_KEY, 'true');
    setIsDismissed(true);
  }, []);

  const markFirstWorkoutComplete = useCallback(() => {
    localStorage.setItem(FIRST_WORKOUT_COMPLETED_KEY, 'true');
    setHasCompletedFirstWorkout(true);
  }, []);

  // Show prompt conditions:
  // - Can install (browser supports it and not already installed)
  // - Not already dismissed by user
  // - First workout has been completed
  // - Not already running as PWA
  const shouldShowPrompt =
    canInstall && !isDismissed && hasCompletedFirstWorkout && !isPWA;

  return {
    canInstall,
    shouldShowPrompt,
    promptInstall,
    dismissPrompt,
    markFirstWorkoutComplete,
    hasCompletedFirstWorkout,
  };
}

/**
 * Detect if running on iOS
 */
export function isIOS(): boolean {
  if (typeof window === 'undefined') return false;
  return (
    /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
  );
}
