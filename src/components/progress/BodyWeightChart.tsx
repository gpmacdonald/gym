import { useState, useEffect, useCallback } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { TrendingDown, TrendingUp, Minus, Scale } from 'lucide-react';
import { BaseChart, useChartDarkMode } from './';
import { useSettingsStore } from '../../stores';
import { getBodyWeightProgressData } from '../../lib/progressQueries';
import {
  CHART_COLORS,
  formatChartDate,
  formatTooltipDate,
  getAxisStyle,
  getGridStyle,
} from '../../lib/chartUtils';

// Conversion constants
const KG_TO_LBS = 2.20462;

interface BodyWeightChartProps {
  startDate: Date | null;
  endDate: Date | null;
}

interface ChartDataPoint {
  date: number; // timestamp for recharts
  weight: number; // in display unit
  formattedDate: string;
}

interface SummaryStats {
  current: number;
  average: number;
  min: number;
  max: number;
  change: number;
  changePercent: number;
}

export default function BodyWeightChart({
  startDate,
  endDate,
}: BodyWeightChartProps) {
  const [data, setData] = useState<ChartDataPoint[]>([]);
  const [stats, setStats] = useState<SummaryStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const isDarkMode = useChartDarkMode();
  const { weightUnit } = useSettingsStore();

  // Convert kg to display unit
  const toDisplayUnit = (kgValue: number): number => {
    if (weightUnit === 'lbs') {
      return Number((kgValue * KG_TO_LBS).toFixed(1));
    }
    return Number(kgValue.toFixed(1));
  };

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const progressData = await getBodyWeightProgressData(startDate, endDate);

      if (progressData.length === 0) {
        setData([]);
        setStats(null);
        return;
      }

      const chartData: ChartDataPoint[] = progressData.map((d) => ({
        date: d.date.getTime(),
        weight: toDisplayUnit(d.weight),
        formattedDate: formatChartDate(d.date),
      }));

      setData(chartData);

      // Calculate summary stats
      const weights = chartData.map((d) => d.weight);
      const current = weights[weights.length - 1];
      const first = weights[0];
      const average = weights.reduce((a, b) => a + b, 0) / weights.length;
      const min = Math.min(...weights);
      const max = Math.max(...weights);
      const change = current - first;
      const changePercent = (change / first) * 100;

      setStats({
        current,
        average: Number(average.toFixed(1)),
        min,
        max,
        change: Number(change.toFixed(1)),
        changePercent: Number(changePercent.toFixed(1)),
      });
    } catch (error) {
      console.error('Failed to load body weight progress data:', error);
      setData([]);
      setStats(null);
    } finally {
      setIsLoading(false);
    }
  }, [startDate, endDate, weightUnit]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  if (isLoading) {
    return <BaseChart isEmpty emptyMessage="Loading..." />;
  }

  if (data.length === 0) {
    return (
      <BaseChart
        isEmpty
        emptyMessage="No body weight entries yet. Log your weight on the Home page."
      />
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
        <p className="text-sm font-medium flex items-center gap-1">
          <Scale className="w-4 h-4 text-purple-500" />
          <span>
            {dataPoint.weight} {weightUnit}
          </span>
        </p>
      </div>
    );
  };

  const TrendIcon =
    stats && stats.change < 0
      ? TrendingDown
      : stats && stats.change > 0
        ? TrendingUp
        : Minus;

  const trendColor =
    stats && stats.change < 0
      ? 'text-green-600 dark:text-green-400'
      : stats && stats.change > 0
        ? 'text-red-600 dark:text-red-400'
        : 'text-gray-500 dark:text-gray-400';

  return (
    <div className="space-y-4">
      {/* Summary Stats */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-3">
            <div className="text-xs text-purple-600 dark:text-purple-400 font-medium">
              Current
            </div>
            <div className="text-lg font-bold text-purple-700 dark:text-purple-300">
              {stats.current} {weightUnit}
            </div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
            <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">
              Average
            </div>
            <div className="text-lg font-bold text-gray-900 dark:text-white">
              {stats.average} {weightUnit}
            </div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
            <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">
              Range
            </div>
            <div className="text-lg font-bold text-gray-900 dark:text-white">
              {stats.min} - {stats.max}
            </div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
            <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">
              Change
            </div>
            <div className={`text-lg font-bold flex items-center gap-1 ${trendColor}`}>
              <TrendIcon className="w-4 h-4" />
              {stats.change > 0 ? '+' : ''}
              {stats.change} {weightUnit}
            </div>
          </div>
        </div>
      )}

      {/* Chart */}
      <BaseChart>
        <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
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
            tickFormatter={(v) => `${v}`}
            tick={getAxisStyle(isDarkMode)}
            axisLine={false}
            tickLine={false}
            width={45}
            domain={['dataMin - 2', 'dataMax + 2']}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="weight"
            stroke={CHART_COLORS.purple}
            strokeWidth={2}
            dot={{ fill: CHART_COLORS.purple, strokeWidth: 0, r: 4 }}
            activeDot={{ r: 6, fill: CHART_COLORS.purple }}
          />
        </LineChart>
      </BaseChart>
    </div>
  );
}
