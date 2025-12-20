import { useState, useEffect, useCallback } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { Clock } from 'lucide-react';
import { BaseChart, useChartDarkMode } from './';
import { getCardioDurationData } from '../../lib/progressQueries';
import type { CardioType } from '../../types';
import {
  CHART_COLORS,
  formatChartDate,
  formatTooltipDate,
  getAxisStyle,
  getGridStyle,
} from '../../lib/chartUtils';

interface CardioDurationChartProps {
  cardioType: CardioType | null;
  startDate: Date | null;
  endDate: Date | null;
}

interface ChartDataPoint {
  date: number; // timestamp for recharts
  duration: number; // in minutes for display
  durationSeconds: number; // original seconds
  formattedDate: string;
  type: CardioType;
}

/**
 * Format seconds to a readable duration string (e.g., "45 min" or "1h 30m")
 */
function formatDurationLabel(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (hours > 0) {
    return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
  }
  return `${minutes} min`;
}

export default function CardioDurationChart({
  cardioType,
  startDate,
  endDate,
}: CardioDurationChartProps) {
  const [data, setData] = useState<ChartDataPoint[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [totalDuration, setTotalDuration] = useState(0); // in seconds
  const isDarkMode = useChartDarkMode();

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const progressData = await getCardioDurationData(
        cardioType,
        startDate,
        endDate
      );

      const chartData: ChartDataPoint[] = progressData.map((d) => ({
        date: d.date.getTime(),
        duration: d.duration / 60, // convert to minutes for chart
        durationSeconds: d.duration,
        formattedDate: formatChartDate(d.date),
        type: d.type,
      }));

      setData(chartData);

      // Calculate total
      const total = progressData.reduce((sum, d) => sum + d.duration, 0);
      setTotalDuration(total);
    } catch (error) {
      console.error('Failed to load cardio duration data:', error);
      setData([]);
      setTotalDuration(0);
    } finally {
      setIsLoading(false);
    }
  }, [cardioType, startDate, endDate]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  if (isLoading) {
    return <BaseChart isEmpty emptyMessage="Loading..." />;
  }

  if (data.length === 0) {
    return (
      <BaseChart isEmpty emptyMessage="No cardio sessions recorded yet" />
    );
  }

  interface TooltipPayload {
    payload: ChartDataPoint;
  }

  const CustomTooltip = ({
    active,
    payload,
    label,
  }: {
    active?: boolean;
    payload?: TooltipPayload[];
    label?: number;
  }) => {
    if (!active || !payload || payload.length === 0) return null;

    const dataPoint = payload[0].payload;
    const typeLabel =
      dataPoint.type === 'treadmill' ? 'Treadmill' : 'Stationary Bike';

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
        <p className="text-sm font-medium">
          {formatDurationLabel(dataPoint.durationSeconds)}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400">{typeLabel}</p>
      </div>
    );
  };

  return (
    <div>
      {/* Duration Summary */}
      <div className="flex items-center gap-2 mb-2 text-sm">
        <Clock className="w-4 h-4 text-emerald-500" />
        <span className="text-gray-600 dark:text-gray-400">
          Total:{' '}
          <span className="font-semibold text-gray-900 dark:text-white">
            {formatDurationLabel(totalDuration)}
          </span>
        </span>
      </div>

      <BaseChart>
        <LineChart
          data={data}
          margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
        >
          <CartesianGrid {...getGridStyle(isDarkMode)} vertical={false} />
          <XAxis
            dataKey="date"
            tickFormatter={(ts) => formatChartDate(ts)}
            tick={getAxisStyle(isDarkMode)}
            axisLine={false}
            tickLine={false}
            minTickGap={50}
          />
          <YAxis
            tickFormatter={(v) => `${Math.round(v)}m`}
            tick={getAxisStyle(isDarkMode)}
            axisLine={false}
            tickLine={false}
            width={40}
            domain={[0, 'auto']}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="duration"
            stroke={CHART_COLORS.secondary}
            strokeWidth={2}
            dot={{ fill: CHART_COLORS.secondary, strokeWidth: 0, r: 4 }}
            activeDot={{ r: 6, fill: CHART_COLORS.secondary }}
          />
        </LineChart>
      </BaseChart>
    </div>
  );
}
