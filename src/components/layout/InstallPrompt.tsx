import { X, Download, Share, Plus } from 'lucide-react';
import { useInstallPrompt, isIOS, useIsPWA } from '../../lib/pwa';

export default function InstallPrompt() {
  const { shouldShowPrompt, promptInstall, dismissPrompt } = useInstallPrompt();
  const isPWA = useIsPWA();
  const isiOSDevice = isIOS();

  // Don't show if already installed or shouldn't show
  if (isPWA || !shouldShowPrompt) {
    return null;
  }

  const handleInstall = async () => {
    if (isiOSDevice) {
      // Can't trigger install on iOS, just show instructions
      return;
    }
    await promptInstall();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-t-2xl sm:rounded-2xl p-6 shadow-xl animate-slide-up">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
              <Download className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Install Fitness Tracker
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Get quick access from your home screen
              </p>
            </div>
          </div>
          <button
            onClick={dismissPrompt}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            aria-label="Dismiss"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isiOSDevice ? (
          // iOS-specific instructions
          <div className="space-y-4">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              To install on your iPhone or iPad:
            </p>
            <ol className="space-y-3 text-sm text-gray-600 dark:text-gray-300">
              <li className="flex items-center gap-3">
                <span className="flex items-center justify-center w-6 h-6 bg-gray-100 dark:bg-gray-700 rounded-full text-xs font-medium">
                  1
                </span>
                <span className="flex items-center gap-2">
                  Tap the share button
                  <Share className="w-4 h-4 text-primary" />
                </span>
              </li>
              <li className="flex items-center gap-3">
                <span className="flex items-center justify-center w-6 h-6 bg-gray-100 dark:bg-gray-700 rounded-full text-xs font-medium">
                  2
                </span>
                <span className="flex items-center gap-2">
                  Scroll and tap "Add to Home Screen"
                  <Plus className="w-4 h-4 text-primary" />
                </span>
              </li>
              <li className="flex items-center gap-3">
                <span className="flex items-center justify-center w-6 h-6 bg-gray-100 dark:bg-gray-700 rounded-full text-xs font-medium">
                  3
                </span>
                <span>Tap "Add" to confirm</span>
              </li>
            </ol>
            <button
              onClick={dismissPrompt}
              className="w-full py-3 bg-primary text-white rounded-lg font-medium"
            >
              Got it
            </button>
          </div>
        ) : (
          // Android/Desktop install button
          <div className="space-y-3">
            <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-2">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-primary rounded-full" />
                Works offline
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-primary rounded-full" />
                Quick access from home screen
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-primary rounded-full" />
                Full screen experience
              </li>
            </ul>
            <div className="flex gap-3">
              <button
                onClick={dismissPrompt}
                className="flex-1 py-3 border border-gray-200 dark:border-gray-700 rounded-lg font-medium text-gray-700 dark:text-gray-300"
              >
                Not now
              </button>
              <button
                onClick={handleInstall}
                className="flex-1 py-3 bg-primary text-white rounded-lg font-medium flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                Install
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
