import type { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  unit?: string;
  iconColor?: string;
}

export default function StatsCard({
  icon: Icon,
  label,
  value,
  unit,
  iconColor = 'text-blue-500',
}: StatsCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center gap-2 mb-1">
        <Icon className={`w-4 h-4 ${iconColor}`} />
        <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">
          {label}
        </p>
      </div>
      <p className="text-2xl font-bold text-gray-900 dark:text-white">
        {value}
        {unit && (
          <span className="text-sm font-normal text-gray-500 dark:text-gray-400 ml-1">
            {unit}
          </span>
        )}
      </p>
    </div>
  );
}
