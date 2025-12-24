/**
 * Chart utility functions and constants
 */

// Color palette for charts
export const CHART_COLORS = {
  primary: '#3B82F6', // blue-500
  secondary: '#10B981', // emerald-500
  accent: '#F59E0B', // amber-500
  danger: '#EF4444', // red-500
  purple: '#8B5CF6', // violet-500 (for body weight)
  muted: '#6B7280', // gray-500
  grid: '#E5E7EB', // gray-200
  gridDark: '#374151', // gray-700
  text: '#1F2937', // gray-800
  textDark: '#F9FAFB', // gray-50
  textMuted: '#9CA3AF', // gray-400
};

/**
 * Format a date for chart X-axis display
 */
export function formatChartDate(date: Date | string | number): string {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Format a date for tooltip display (more detailed)
 */
export function formatTooltipDate(date: Date | string | number): string {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

/**
 * Format a number for Y-axis display (compact)
 */
export function formatChartNumber(value: number): string {
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}k`;
  }
  return value.toString();
}

/**
 * Format weight with unit
 */
export function formatWeight(value: number, unit: 'kg' | 'lbs'): string {
  return `${value}${unit}`;
}

/**
 * Format duration in seconds to mm:ss or hh:mm
 */
export function formatDurationShort(seconds: number): string {
  if (seconds >= 3600) {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${mins}m`;
  }
  const mins = Math.floor(seconds / 60);
  return `${mins}m`;
}

/**
 * Format distance with unit
 */
export function formatDistance(value: number, unit: 'km' | 'miles'): string {
  return `${value.toFixed(1)} ${unit}`;
}

/**
 * Get chart axis tick style based on dark mode
 */
export function getAxisStyle(isDarkMode: boolean) {
  return {
    fontSize: 12,
    fill: isDarkMode ? CHART_COLORS.textMuted : CHART_COLORS.muted,
  };
}

/**
 * Get chart grid style based on dark mode
 */
export function getGridStyle(isDarkMode: boolean) {
  return {
    stroke: isDarkMode ? CHART_COLORS.gridDark : CHART_COLORS.grid,
    strokeDasharray: '3 3',
  };
}
