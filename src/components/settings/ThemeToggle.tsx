import { Sun, Moon, Monitor } from 'lucide-react';
import { useTheme } from '../../lib/theme';
import type { Theme } from '../../types';

const themeOptions: { value: Theme; icon: React.ComponentType<{ className?: string }>; label: string }[] = [
  { value: 'light', icon: Sun, label: 'Light' },
  { value: 'dark', icon: Moon, label: 'Dark' },
  { value: 'system', icon: Monitor, label: 'System' },
];

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <div>
      <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        Theme
      </h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
        Choose your preferred color scheme.
      </p>
      <div className="flex gap-2">
        {themeOptions.map(({ value, icon: Icon, label }) => (
          <button
            key={value}
            type="button"
            onClick={() => setTheme(value)}
            className={`flex-1 flex flex-col items-center gap-2 py-3 px-4 rounded-lg border-2 transition-colors ${
              theme === value
                ? 'border-primary bg-primary/10 text-primary'
                : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600'
            }`}
            aria-pressed={theme === value}
          >
            <Icon className="w-5 h-5" />
            <span className="text-sm font-medium">{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
