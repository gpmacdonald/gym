import { useState, useEffect, useCallback } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { TrendingUp } from 'lucide-react';
import { BaseChart, useChartDarkMode } from './';
import { useSettingsStore } from '../../stores';
import { getVolumeProgressData } from '../../lib/progressQueries';
import {
  CHART_COLORS,
  formatChartDate,
  formatTooltipDate,
  formatChartNumber,
  getAxisStyle,
  getGridStyle,
} from '../../lib/chartUtils';

interface VolumeChartProps {
  exerciseId: string | null;
  startDate: Date | null;
  endDate: Date | null;
}

interface ChartDataPoint {
  date: number; // timestamp for recharts
  volume: number;
  formattedDate: string;
}

export default function VolumeChart({
  exerciseId,
  startDate,
  endDate,
}: VolumeChartProps) {
  const [data, setData] = useState<ChartDataPoint[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [totalVolume, setTotalVolume] = useState(0);
  const [maxVolume, setMaxVolume] = useState(0);
  const isDarkMode = useChartDarkMode();
  const { weightUnit } = useSettingsStore();

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const progressData = await getVolumeProgressData(
        exerciseId,
        startDate,
        endDate
      );

      const chartData: ChartDataPoint[] = progressData.map((d) => ({
        date: d.date.getTime(),
        volume: d.volume,
        formattedDate: formatChartDate(d.date),
      }));

      setData(chartData);

      // Calculate totals
      const total = chartData.reduce((sum, d) => sum + d.volume, 0);
      const max = chartData.length > 0 ? Math.max(...chartData.map((d) => d.volume)) : 0;
      setTotalVolume(total);
      setMaxVolume(max);
    } catch (error) {
      console.error('Failed to load volume progress data:', error);
      setData([]);
      setTotalVolume(0);
      setMaxVolume(0);
    } finally {
      setIsLoading(false);
    }
  }, [exerciseId, startDate, endDate]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  if (isLoading) {
    return <BaseChart isEmpty emptyMessage="Loading..." />;
  }

  if (data.length === 0) {
    const message = exerciseId
      ? 'No volume data for this exercise yet'
      : 'No workout data yet';
    return <BaseChart isEmpty emptyMessage={message} />;
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
          {formatChartNumber(dataPoint.volume)} {weightUnit}
        </p>
      </div>
    );
  };

  return (
    <div>
      {/* Volume Summary */}
      <div className="flex items-center justify-between mb-2 text-sm">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-emerald-500" />
          <span className="text-gray-600 dark:text-gray-400">
            Total:{' '}
            <span className="font-semibold text-gray-900 dark:text-white">
              {formatChartNumber(totalVolume)} {weightUnit}
            </span>
          </span>
        </div>
        <span className="text-gray-500 dark:text-gray-400">
          Max: {formatChartNumber(maxVolume)} {weightUnit}
        </span>
      </div>

      <BaseChart>
        <BarChart
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
            tickFormatter={(v) => formatChartNumber(v)}
            tick={getAxisStyle(isDarkMode)}
            axisLine={false}
            tickLine={false}
            width={45}
            domain={[0, 'auto']}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar
            dataKey="volume"
            fill={CHART_COLORS.secondary}
            radius={[4, 4, 0, 0]}
            maxBarSize={40}
          />
        </BarChart>
      </BaseChart>
    </div>
  );
}
