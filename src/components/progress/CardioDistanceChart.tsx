import { useState, useEffect, useCallback } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { MapPin } from 'lucide-react';
import { BaseChart, useChartDarkMode } from './';
import { useSettingsStore } from '../../stores';
import { getCardioDistanceData } from '../../lib/progressQueries';
import type { CardioType } from '../../types';
import {
  CHART_COLORS,
  formatChartDate,
  formatTooltipDate,
  getAxisStyle,
  getGridStyle,
} from '../../lib/chartUtils';

interface CardioDistanceChartProps {
  cardioType: CardioType | null;
  startDate: Date | null;
  endDate: Date | null;
}

interface ChartDataPoint {
  date: number; // timestamp for recharts
  distance: number;
  formattedDate: string;
  type: CardioType;
}

export default function CardioDistanceChart({
  cardioType,
  startDate,
  endDate,
}: CardioDistanceChartProps) {
  const [data, setData] = useState<ChartDataPoint[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [totalDistance, setTotalDistance] = useState(0);
  const isDarkMode = useChartDarkMode();
  const { distanceUnit } = useSettingsStore();

  // Convert miles to km if needed
  const convertDistance = useCallback(
    (miles: number): number => {
      if (distanceUnit === 'km') {
        return miles * 1.60934;
      }
      return miles;
    },
    [distanceUnit]
  );

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const progressData = await getCardioDistanceData(
        cardioType,
        startDate,
        endDate
      );

      const chartData: ChartDataPoint[] = progressData.map((d) => ({
        date: d.date.getTime(),
        distance: convertDistance(d.distance),
        formattedDate: formatChartDate(d.date),
        type: d.type,
      }));

      setData(chartData);

      // Calculate total
      const total = chartData.reduce((sum, d) => sum + d.distance, 0);
      setTotalDistance(total);
    } catch (error) {
      console.error('Failed to load cardio distance data:', error);
      setData([]);
      setTotalDistance(0);
    } finally {
      setIsLoading(false);
    }
  }, [cardioType, startDate, endDate, convertDistance]);

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
        emptyMessage="No cardio sessions with distance data yet"
      />
    );
  }

  const unitLabel = distanceUnit === 'km' ? 'km' : 'mi';

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
          {dataPoint.distance.toFixed(2)} {unitLabel}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400">{typeLabel}</p>
      </div>
    );
  };

  return (
    <div>
      {/* Distance Summary */}
      <div className="flex items-center gap-2 mb-2 text-sm">
        <MapPin className="w-4 h-4 text-blue-500" />
        <span className="text-gray-600 dark:text-gray-400">
          Total:{' '}
          <span className="font-semibold text-gray-900 dark:text-white">
            {totalDistance.toFixed(1)} {unitLabel}
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
            tickFormatter={(v) => `${v.toFixed(1)}`}
            tick={getAxisStyle(isDarkMode)}
            axisLine={false}
            tickLine={false}
            width={40}
            domain={[0, 'auto']}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="distance"
            stroke={CHART_COLORS.primary}
            strokeWidth={2}
            dot={{ fill: CHART_COLORS.primary, strokeWidth: 0, r: 4 }}
            activeDot={{ r: 6, fill: CHART_COLORS.primary }}
          />
        </LineChart>
      </BaseChart>
    </div>
  );
}
