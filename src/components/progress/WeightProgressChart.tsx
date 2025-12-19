import { useState, useEffect, useCallback } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceDot,
} from 'recharts';
import { Trophy } from 'lucide-react';
import { BaseChart, useChartDarkMode } from './';
import { useSettingsStore } from '../../stores';
import { getWeightProgressData } from '../../lib/progressQueries';
import {
  CHART_COLORS,
  formatChartDate,
  formatTooltipDate,
  getAxisStyle,
  getGridStyle,
} from '../../lib/chartUtils';

interface WeightProgressChartProps {
  exerciseId: string | null;
  startDate: Date | null;
  endDate: Date | null;
}

interface ChartDataPoint {
  date: number; // timestamp for recharts
  maxWeight: number;
  isPR: boolean;
  formattedDate: string;
}

export default function WeightProgressChart({
  exerciseId,
  startDate,
  endDate,
}: WeightProgressChartProps) {
  const [data, setData] = useState<ChartDataPoint[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [prPoint, setPrPoint] = useState<ChartDataPoint | null>(null);
  const isDarkMode = useChartDarkMode();
  const { weightUnit } = useSettingsStore();

  const loadData = useCallback(async () => {
    if (!exerciseId) return;

    setIsLoading(true);
    try {
      const progressData = await getWeightProgressData(
        exerciseId,
        startDate,
        endDate
      );

      const chartData: ChartDataPoint[] = progressData.map((d) => ({
        date: d.date.getTime(),
        maxWeight: d.maxWeight,
        isPR: d.isPR,
        formattedDate: formatChartDate(d.date),
      }));

      setData(chartData);

      // Find PR point for highlighting
      const pr = chartData.find((d) => d.isPR);
      setPrPoint(pr || null);
    } catch (error) {
      console.error('Failed to load weight progress data:', error);
      setData([]);
    } finally {
      setIsLoading(false);
    }
  }, [exerciseId, startDate, endDate]);

  useEffect(() => {
    if (!exerciseId) {
      setData([]);
      setPrPoint(null);
      return;
    }

    loadData();
  }, [exerciseId, loadData]);

  if (!exerciseId) {
    return (
      <BaseChart isEmpty emptyMessage="Select an exercise to view progress" />
    );
  }

  if (isLoading) {
    return (
      <BaseChart isEmpty emptyMessage="Loading..." />
    );
  }

  if (data.length === 0) {
    return (
      <BaseChart isEmpty emptyMessage="No data for this exercise yet" />
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
          {dataPoint.isPR && (
            <Trophy className="w-4 h-4 text-yellow-500" />
          )}
          <span>
            {dataPoint.maxWeight} {weightUnit}
          </span>
        </p>
      </div>
    );
  };

  return (
    <div>
      {/* PR Badge */}
      {prPoint && (
        <div className="flex items-center gap-2 mb-2 text-sm">
          <Trophy className="w-4 h-4 text-yellow-500" />
          <span className="text-gray-600 dark:text-gray-400">
            PR: <span className="font-semibold text-gray-900 dark:text-white">
              {prPoint.maxWeight} {weightUnit}
            </span>
          </span>
        </div>
      )}

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
            width={40}
            domain={['auto', 'auto']}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="maxWeight"
            stroke={CHART_COLORS.primary}
            strokeWidth={2}
            dot={{ fill: CHART_COLORS.primary, strokeWidth: 0, r: 4 }}
            activeDot={{ r: 6, fill: CHART_COLORS.primary }}
          />
          {/* PR marker */}
          {prPoint && (
            <ReferenceDot
              x={prPoint.date}
              y={prPoint.maxWeight}
              r={8}
              fill="#FBBF24"
              stroke="#F59E0B"
              strokeWidth={2}
            />
          )}
        </LineChart>
      </BaseChart>
    </div>
  );
}
