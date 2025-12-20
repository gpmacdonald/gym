import { useState, useMemo, useEffect, useCallback, lazy, Suspense } from 'react';
import { Dumbbell, Heart } from 'lucide-react';
import { Header } from '../components/layout';
import {
  TimeRangeTabs,
  ExerciseDropdown,
  CardioTypeDropdown,
  getStartDateForRange,
  type TimeRange,
  type CardioFilter,
} from '../components/progress';

// Lazy load chart components for better initial load performance
const WeightProgressChart = lazy(
  () => import('../components/progress/WeightProgressChart')
);
const VolumeChart = lazy(() => import('../components/progress/VolumeChart'));
const PRList = lazy(() => import('../components/progress/PRList'));
const CardioDistanceChart = lazy(
  () => import('../components/progress/CardioDistanceChart')
);
const CardioDurationChart = lazy(
  () => import('../components/progress/CardioDurationChart')
);
const CardioPaceChart = lazy(
  () => import('../components/progress/CardioPaceChart')
);
const CardioIntensityChart = lazy(
  () => import('../components/progress/CardioIntensityChart')
);
const CardioSummaryStats = lazy(
  () => import('../components/progress/CardioSummaryStats')
);

type ViewType = 'weights' | 'cardio';
type WeightsChartType = 'weight' | 'volume';
type CardioChartType = 'distance' | 'duration' | 'pace' | 'intensity';

// Loading placeholder for charts
function ChartLoadingPlaceholder() {
  return (
    <div className="h-64 flex items-center justify-center">
      <div className="animate-pulse flex flex-col items-center gap-2">
        <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full" />
        <div className="w-24 h-4 bg-gray-200 dark:bg-gray-700 rounded" />
      </div>
    </div>
  );
}

// Loading placeholder for stats grid
function StatsLoadingPlaceholder() {
  return (
    <div className="grid grid-cols-2 gap-3">
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 animate-pulse"
        >
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20 mb-2" />
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-16" />
        </div>
      ))}
    </div>
  );
}

export default function Progress() {
  const [view, setView] = useState<ViewType>('weights');
  const [weightsChartType, setWeightsChartType] =
    useState<WeightsChartType>('weight');
  const [cardioChartType, setCardioChartType] =
    useState<CardioChartType>('distance');
  const [timeRange, setTimeRange] = useState<TimeRange>('3M');
  const [selectedExercise, setSelectedExercise] = useState<string | null>(null);
  const [cardioFilter, setCardioFilter] = useState<CardioFilter>('all');
  const [refreshKey, setRefreshKey] = useState(0);

  // Memoize date calculations to prevent unnecessary recalculations
  const startDate = useMemo(
    () => getStartDateForRange(timeRange),
    [timeRange]
  );
  // endDate updates when refreshKey changes (on visibility change)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const endDate = useMemo(() => new Date(), [refreshKey]);

  // Refresh data when page becomes visible again
  const handleVisibilityChange = useCallback(() => {
    if (document.visibilityState === 'visible') {
      setRefreshKey((prev) => prev + 1);
    }
  }, []);

  useEffect(() => {
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [handleVisibilityChange]);

  // Memoize cardio type conversion
  const cardioType = useMemo(
    () => (cardioFilter === 'all' ? null : cardioFilter),
    [cardioFilter]
  );

  return (
    <>
      <Header title="Progress" />
      <div className="p-4 space-y-4">
        {/* View Toggle */}
        <div className="flex gap-2 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
          <button
            type="button"
            onClick={() => setView('weights')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md font-medium transition ${
              view === 'weights'
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-400'
            }`}
          >
            <Dumbbell className="w-4 h-4" />
            Weights
          </button>
          <button
            type="button"
            onClick={() => setView('cardio')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md font-medium transition ${
              view === 'cardio'
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-400'
            }`}
          >
            <Heart className="w-4 h-4" />
            Cardio
          </button>
        </div>

        {/* Selector based on view */}
        {view === 'weights' ? (
          <ExerciseDropdown
            value={selectedExercise}
            onChange={setSelectedExercise}
          />
        ) : (
          <CardioTypeDropdown value={cardioFilter} onChange={setCardioFilter} />
        )}

        {/* Time Range Tabs */}
        <TimeRangeTabs value={timeRange} onChange={setTimeRange} />

        {/* Chart Type Toggle (Weights only) */}
        {view === 'weights' && (
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setWeightsChartType('weight')}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition ${
                weightsChartType === 'weight'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              Weight
            </button>
            <button
              type="button"
              onClick={() => setWeightsChartType('volume')}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition ${
                weightsChartType === 'volume'
                  ? 'bg-emerald-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              Volume
            </button>
          </div>
        )}

        {/* Chart Type Toggle (Cardio only) */}
        {view === 'cardio' && (
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setCardioChartType('distance')}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition ${
                cardioChartType === 'distance'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              Distance
            </button>
            <button
              type="button"
              onClick={() => setCardioChartType('duration')}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition ${
                cardioChartType === 'duration'
                  ? 'bg-emerald-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              Duration
            </button>
            <button
              type="button"
              onClick={() => setCardioChartType('pace')}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition ${
                cardioChartType === 'pace'
                  ? 'bg-purple-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              Pace
            </button>
            <button
              type="button"
              onClick={() => setCardioChartType('intensity')}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition ${
                cardioChartType === 'intensity'
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              Intensity
            </button>
          </div>
        )}

        {/* Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <Suspense fallback={<ChartLoadingPlaceholder />}>
            {view === 'weights' ? (
              weightsChartType === 'weight' ? (
                <WeightProgressChart
                  key={`weight-${refreshKey}`}
                  exerciseId={selectedExercise}
                  startDate={startDate}
                  endDate={endDate}
                />
              ) : (
                <VolumeChart
                  key={`volume-${refreshKey}`}
                  exerciseId={selectedExercise}
                  startDate={startDate}
                  endDate={endDate}
                />
              )
            ) : cardioChartType === 'distance' ? (
              <CardioDistanceChart
                key={`distance-${refreshKey}`}
                cardioType={cardioType}
                startDate={startDate}
                endDate={endDate}
              />
            ) : cardioChartType === 'duration' ? (
              <CardioDurationChart
                key={`duration-${refreshKey}`}
                cardioType={cardioType}
                startDate={startDate}
                endDate={endDate}
              />
            ) : cardioChartType === 'pace' ? (
              <CardioPaceChart
                key={`pace-${refreshKey}`}
                cardioType={cardioType}
                startDate={startDate}
                endDate={endDate}
              />
            ) : (
              <CardioIntensityChart
                key={`intensity-${refreshKey}`}
                cardioType={cardioType}
                startDate={startDate}
                endDate={endDate}
              />
            )}
          </Suspense>
        </div>

        {/* Personal Records Section (Weights view only) */}
        {view === 'weights' && (
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
              Personal Records
            </h3>
            <Suspense fallback={<ChartLoadingPlaceholder />}>
              <PRList key={`pr-${refreshKey}`} limit={5} />
            </Suspense>
          </div>
        )}

        {/* Cardio Summary Stats */}
        {view === 'cardio' && (
          <Suspense fallback={<StatsLoadingPlaceholder />}>
            <CardioSummaryStats
              key={`stats-${refreshKey}`}
              cardioType={cardioType}
              startDate={startDate}
              endDate={endDate}
            />
          </Suspense>
        )}
      </div>
    </>
  );
}
