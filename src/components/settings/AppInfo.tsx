import { Info } from 'lucide-react';

// Version from package.json - in a real app you'd use a build-time variable
const APP_VERSION = '1.0.0';

export default function AppInfo() {
  return (
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
  );
}
