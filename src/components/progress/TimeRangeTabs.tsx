export type TimeRange = '1M' | '3M' | '6M' | '1Y' | 'ALL';

interface TimeRangeTabsProps {
  value: TimeRange;
  onChange: (range: TimeRange) => void;
}

const TIME_RANGES: { value: TimeRange; label: string }[] = [
  { value: '1M', label: '1M' },
  { value: '3M', label: '3M' },
  { value: '6M', label: '6M' },
  { value: '1Y', label: '1Y' },
  { value: 'ALL', label: 'All' },
];

export default function TimeRangeTabs({ value, onChange }: TimeRangeTabsProps) {
  return (
    <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
      {TIME_RANGES.map((range) => (
        <button
          key={range.value}
          type="button"
          onClick={() => onChange(range.value)}
          className={`flex-1 py-1.5 px-3 text-sm font-medium rounded-md transition ${
            value === range.value
              ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          {range.label}
        </button>
      ))}
    </div>
  );
}

/**
 * Get the start date for a time range
 */
export function getStartDateForRange(range: TimeRange): Date | null {
  if (range === 'ALL') return null;

  const now = new Date();
  const start = new Date(now);

  switch (range) {
    case '1M':
      start.setMonth(start.getMonth() - 1);
      break;
    case '3M':
      start.setMonth(start.getMonth() - 3);
      break;
    case '6M':
      start.setMonth(start.getMonth() - 6);
      break;
    case '1Y':
      start.setFullYear(start.getFullYear() - 1);
      break;
  }

  return start;
}
