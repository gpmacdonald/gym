import { useState } from 'react';
import { Info, RefreshCw } from 'lucide-react';
import { isIOS, useIsPWA, useInstallPrompt, resetInstallPromptState } from '../../lib/pwa';

// Version from package.json - in a real app you'd use a build-time variable
const APP_VERSION = '1.0.0';

export default function AppInfo() {
  const isPWA = useIsPWA();
  const isiOS = isIOS();
  const { hasCompletedFirstWorkout } = useInstallPrompt();
  const [resetMessage, setResetMessage] = useState('');

  const handleResetInstallPrompt = () => {
    resetInstallPromptState();
    setResetMessage('Install prompt reset! Complete a workout to see it again.');
    setTimeout(() => setResetMessage(''), 3000);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Info className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="font-medium text-gray-900 dark:text-white">
              Personal Fitness Tracker
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Version {APP_VERSION}
            </p>
          </div>
        </div>
      </div>

      {/* PWA Status */}
      <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          App Status
        </p>
        <div className="text-sm text-gray-500 dark:text-gray-400 space-y-1">
          <p>Platform: {isiOS ? 'iOS' : 'Other'}</p>
          <p>Installed as PWA: {isPWA ? 'Yes' : 'No'}</p>
          <p>First workout completed: {hasCompletedFirstWorkout ? 'Yes' : 'No'}</p>
        </div>
      </div>

      {/* Reset Install Prompt */}
      {!isPWA && (
        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={handleResetInstallPrompt}
            className="flex items-center gap-2 text-sm text-primary hover:text-primary/80"
          >
            <RefreshCw className="w-4 h-4" />
            Reset Install Prompt
          </button>
          {resetMessage && (
            <p className="text-sm text-green-600 dark:text-green-400 mt-2">
              {resetMessage}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
