import type { ReactNode } from 'react';
import { ResponsiveContainer } from 'recharts';
import { CHART_COLORS, formatTooltipDate } from '../../lib/chartUtils';

interface BaseChartProps {
  children?: ReactNode;
  height?: number;
  isEmpty?: boolean;
  emptyMessage?: string;
}

/**
 * Base wrapper for all charts providing responsive container and common styling
 */
export default function BaseChart({
  children,
  height = 300,
  isEmpty = false,
  emptyMessage = 'No data available',
}: BaseChartProps) {
  if (isEmpty) {
    return (
      <div
        className="flex items-center justify-center bg-gray-50 dark:bg-gray-800/50 rounded-lg"
        style={{ height }}
      >
        <p className="text-gray-500 dark:text-gray-400">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer width="100%" height="100%">
        {children as React.ReactElement}
      </ResponsiveContainer>
    </div>
  );
}

/**
 * Custom tooltip component with dark mode support
 */
interface ChartTooltipPayload {
  value: number;
  name?: string;
  color?: string;
}

interface ChartTooltipProps {
  active?: boolean;
  payload?: ChartTooltipPayload[];
  label?: string | number;
  isDarkMode?: boolean;
  formatValue?: (value: number) => string;
  valueLabel?: string;
}

export function ChartTooltip({
  active,
  payload,
  label,
  isDarkMode = false,
  formatValue = (v) => v.toString(),
  valueLabel = 'Value',
}: ChartTooltipProps) {
  if (!active || !payload || payload.length === 0) {
    return null;
  }

  return (
    <div
      className={`px-3 py-2 rounded-lg shadow-lg border ${
        isDarkMode
          ? 'bg-gray-800 border-gray-700 text-white'
          : 'bg-white border-gray-200 text-gray-900'
      }`}
    >
      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
        {label ? formatTooltipDate(label) : ''}
      </p>
      {payload.map((entry, index) => (
        <p key={index} className="text-sm font-medium">
          <span style={{ color: entry.color || CHART_COLORS.primary }}>
            {entry.name || valueLabel}:
          </span>{' '}
          {formatValue(entry.value)}
        </p>
      ))}
    </div>
  );
}

/**
 * Hook to detect dark mode (uses Tailwind's dark class on html element)
 */
export function useChartDarkMode(): boolean {
  if (typeof window === 'undefined') return false;
  return document.documentElement.classList.contains('dark');
}
