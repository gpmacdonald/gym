import { useState, useEffect, useCallback } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { TrendingUp } from 'lucide-react';
import { BaseChart, useChartDarkMode } from './';
import { getCardioIntensityData } from '../../lib/progressQueries';
import type { CardioType } from '../../types';
import {
  CHART_COLORS,
  formatChartDate,
  formatTooltipDate,
  getAxisStyle,
  getGridStyle,
} from '../../lib/chartUtils';

interface CardioIntensityChartProps {
  cardioType: CardioType | null;
  startDate: Date | null;
  endDate: Date | null;
}

interface TreadmillChartDataPoint {
  date: number;
  avgIncline: number;
  maxIncline?: number;
  formattedDate: string;
  type: 'treadmill';
}

interface BikeChartDataPoint {
  date: number;
  avgResistance: number;
  avgCadence?: number;
  formattedDate: string;
  type: 'stationary-bike';
}

type ChartDataPoint = TreadmillChartDataPoint | BikeChartDataPoint;

export default function CardioIntensityChart({
  cardioType,
  startDate,
  endDate,
}: CardioIntensityChartProps) {
  const [data, setData] = useState<ChartDataPoint[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [avgIntensity, setAvgIntensity] = useState(0);
  const isDarkMode = useChartDarkMode();

  // Determine what type of data we're showing
  const isTreadmillOnly = cardioType === 'treadmill';
  const isBikeOnly = cardioType === 'stationary-bike';
  const isMixed = !cardioType;

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const progressData = await getCardioIntensityData(
        cardioType,
        startDate,
        endDate
      );

      const chartData: ChartDataPoint[] = progressData.map((d) => {
        if (d.type === 'treadmill') {
          return {
            date: d.date.getTime(),
            avgIncline: d.avgIncline ?? 0,
            maxIncline: d.maxIncline,
            formattedDate: formatChartDate(d.date),
            type: 'treadmill' as const,
          };
        } else {
          return {
            date: d.date.getTime(),
            avgResistance: d.avgResistance ?? 0,
            avgCadence: d.avgCadence,
            formattedDate: formatChartDate(d.date),
            type: 'stationary-bike' as const,
          };
        }
      });

      setData(chartData);

      // Calculate average intensity
      if (chartData.length > 0) {
        if (isTreadmillOnly || (!isBikeOnly && chartData[0]?.type === 'treadmill')) {
          const treadmillData = chartData.filter((d) => d.type === 'treadmill') as TreadmillChartDataPoint[];
          const totalIncline = treadmillData.reduce((sum, d) => sum + d.avgIncline, 0);
          setAvgIntensity(totalIncline / treadmillData.length);
        } else {
          const bikeData = chartData.filter((d) => d.type === 'stationary-bike') as BikeChartDataPoint[];
          const totalResistance = bikeData.reduce((sum, d) => sum + d.avgResistance, 0);
          setAvgIntensity(totalResistance / bikeData.length);
        }
      } else {
        setAvgIntensity(0);
      }
    } catch (error) {
      console.error('Failed to load cardio intensity data:', error);
      setData([]);
      setAvgIntensity(0);
    } finally {
      setIsLoading(false);
    }
  }, [cardioType, startDate, endDate, isTreadmillOnly, isBikeOnly]);

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
        emptyMessage="No cardio sessions with intensity data yet"
      />
    );
  }

  // Determine which metric to display based on the data
  const showTreadmillChart = isTreadmillOnly || (isMixed && data.some(d => d.type === 'treadmill'));

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
        {dataPoint.type === 'treadmill' ? (
          <>
            <p className="text-sm font-medium">
              Avg Incline: {(dataPoint as TreadmillChartDataPoint).avgIncline.toFixed(1)}%
            </p>
            {(dataPoint as TreadmillChartDataPoint).maxIncline !== undefined && (
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Max: {(dataPoint as TreadmillChartDataPoint).maxIncline?.toFixed(1)}%
              </p>
            )}
          </>
        ) : (
          <>
            <p className="text-sm font-medium">
              Resistance: {(dataPoint as BikeChartDataPoint).avgResistance}
            </p>
            {(dataPoint as BikeChartDataPoint).avgCadence !== undefined && (
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Cadence: {(dataPoint as BikeChartDataPoint).avgCadence} RPM
              </p>
            )}
          </>
        )}
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {dataPoint.type === 'treadmill' ? 'Treadmill' : 'Stationary Bike'}
        </p>
      </div>
    );
  };

  const intensityLabel = showTreadmillChart ? 'Incline' : 'Resistance';
  const intensityUnit = showTreadmillChart ? '%' : '';

  return (
    <div>
      {/* Intensity Summary */}
      <div className="flex items-center gap-2 mb-2 text-sm">
        <TrendingUp className="w-4 h-4 text-orange-500" />
        <span className="text-gray-600 dark:text-gray-400">
          Avg {intensityLabel}:{' '}
          <span className="font-semibold text-gray-900 dark:text-white">
            {avgIntensity.toFixed(1)}{intensityUnit}
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
            tickFormatter={(v) => showTreadmillChart ? `${v}%` : `${v}`}
            tick={getAxisStyle(isDarkMode)}
            axisLine={false}
            tickLine={false}
            width={40}
            domain={[0, 'auto']}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey={showTreadmillChart ? 'avgIncline' : 'avgResistance'}
            stroke={CHART_COLORS.accent}
            strokeWidth={2}
            dot={{ fill: CHART_COLORS.accent, strokeWidth: 0, r: 4 }}
            activeDot={{ r: 6, fill: CHART_COLORS.accent }}
          />
        </LineChart>
      </BaseChart>
    </div>
  );
}
