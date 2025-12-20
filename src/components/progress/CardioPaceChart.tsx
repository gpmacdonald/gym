import { useState, useEffect, useCallback } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { Gauge } from 'lucide-react';
import { BaseChart, useChartDarkMode } from './';
import { useSettingsStore } from '../../stores';
import { getCardioPaceData } from '../../lib/progressQueries';
import type { CardioType } from '../../types';
import {
  CHART_COLORS,
  formatChartDate,
  formatTooltipDate,
  getAxisStyle,
  getGridStyle,
} from '../../lib/chartUtils';

interface CardioPaceChartProps {
  cardioType: CardioType | null;
  startDate: Date | null;
  endDate: Date | null;
}

type DisplayMode = 'pace' | 'speed';

interface ChartDataPoint {
  date: number; // timestamp for recharts
  pace: number; // min/mi or min/km
  speed: number; // mph or km/h
  formattedDate: string;
  type: CardioType;
}

/**
 * Format pace to mm:ss per mile/km
 */
function formatPace(minutesPerUnit: number): string {
  const minutes = Math.floor(minutesPerUnit);
  const seconds = Math.round((minutesPerUnit - minutes) * 60);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

export default function CardioPaceChart({
  cardioType,
  startDate,
  endDate,
}: CardioPaceChartProps) {
  const [data, setData] = useState<ChartDataPoint[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [displayMode, setDisplayMode] = useState<DisplayMode>('pace');
  const [avgPace, setAvgPace] = useState(0);
  const [avgSpeed, setAvgSpeed] = useState(0);
  const isDarkMode = useChartDarkMode();
  const { distanceUnit } = useSettingsStore();

  // Convert pace/speed based on unit
  const convertPace = useCallback(
    (paceMinPerMile: number): number => {
      if (distanceUnit === 'km') {
        // Convert min/mi to min/km (divide by 1.60934)
        return paceMinPerMile / 1.60934;
      }
      return paceMinPerMile;
    },
    [distanceUnit]
  );

  const convertSpeed = useCallback(
    (speedMph: number): number => {
      if (distanceUnit === 'km') {
        // Convert mph to km/h
        return speedMph * 1.60934;
      }
      return speedMph;
    },
    [distanceUnit]
  );

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const progressData = await getCardioPaceData(
        cardioType,
        startDate,
        endDate
      );

      const chartData: ChartDataPoint[] = progressData.map((d) => ({
        date: d.date.getTime(),
        pace: convertPace(d.pace),
        speed: convertSpeed(d.speed),
        formattedDate: formatChartDate(d.date),
        type: d.type,
      }));

      setData(chartData);

      // Calculate averages
      if (chartData.length > 0) {
        const totalPace = chartData.reduce((sum, d) => sum + d.pace, 0);
        const totalSpeed = chartData.reduce((sum, d) => sum + d.speed, 0);
        setAvgPace(totalPace / chartData.length);
        setAvgSpeed(totalSpeed / chartData.length);
      } else {
        setAvgPace(0);
        setAvgSpeed(0);
      }
    } catch (error) {
      console.error('Failed to load cardio pace data:', error);
      setData([]);
      setAvgPace(0);
      setAvgSpeed(0);
    } finally {
      setIsLoading(false);
    }
  }, [cardioType, startDate, endDate, convertPace, convertSpeed]);

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
        emptyMessage="No cardio sessions with pace data yet"
      />
    );
  }

  const paceUnit = distanceUnit === 'km' ? '/km' : '/mi';
  const speedUnit = distanceUnit === 'km' ? 'km/h' : 'mph';

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
          {displayMode === 'pace'
            ? `${formatPace(dataPoint.pace)}${paceUnit}`
            : `${dataPoint.speed.toFixed(1)} ${speedUnit}`}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400">{typeLabel}</p>
      </div>
    );
  };

  return (
    <div>
      {/* Pace/Speed Toggle */}
      <div className="flex gap-2 mb-3">
        <button
          type="button"
          onClick={() => setDisplayMode('pace')}
          className={`flex-1 py-1.5 text-xs font-medium rounded-md transition ${
            displayMode === 'pace'
              ? 'bg-purple-500 text-white'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
          }`}
        >
          Pace
        </button>
        <button
          type="button"
          onClick={() => setDisplayMode('speed')}
          className={`flex-1 py-1.5 text-xs font-medium rounded-md transition ${
            displayMode === 'speed'
              ? 'bg-purple-500 text-white'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
          }`}
        >
          Speed
        </button>
      </div>

      {/* Summary */}
      <div className="flex items-center gap-2 mb-2 text-sm">
        <Gauge className="w-4 h-4 text-purple-500" />
        <span className="text-gray-600 dark:text-gray-400">
          Avg:{' '}
          <span className="font-semibold text-gray-900 dark:text-white">
            {displayMode === 'pace'
              ? `${formatPace(avgPace)}${paceUnit}`
              : `${avgSpeed.toFixed(1)} ${speedUnit}`}
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
            tickFormatter={(v) =>
              displayMode === 'pace' ? formatPace(v) : `${v.toFixed(1)}`
            }
            tick={getAxisStyle(isDarkMode)}
            axisLine={false}
            tickLine={false}
            width={50}
            domain={displayMode === 'pace' ? ['auto', 'auto'] : [0, 'auto']}
            reversed={displayMode === 'pace'} // Lower pace is better
          />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey={displayMode}
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
