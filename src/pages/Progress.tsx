import { useState } from 'react';
import { Dumbbell, Heart } from 'lucide-react';
import { Header } from '../components/layout';
import {
  TimeRangeTabs,
  ExerciseDropdown,
  CardioTypeDropdown,
  WeightProgressChart,
  VolumeChart,
  PRList,
  CardioDistanceChart,
  CardioDurationChart,
  CardioPaceChart,
  getStartDateForRange,
  type TimeRange,
  type CardioFilter,
} from '../components/progress';

type ViewType = 'weights' | 'cardio';
type WeightsChartType = 'weight' | 'volume';
type CardioChartType = 'distance' | 'duration' | 'pace';

export default function Progress() {
  const [view, setView] = useState<ViewType>('weights');
  const [weightsChartType, setWeightsChartType] =
    useState<WeightsChartType>('weight');
  const [cardioChartType, setCardioChartType] =
    useState<CardioChartType>('distance');
  const [timeRange, setTimeRange] = useState<TimeRange>('3M');
  const [selectedExercise, setSelectedExercise] = useState<string | null>(null);
  const [cardioFilter, setCardioFilter] = useState<CardioFilter>('all');

  const startDate = getStartDateForRange(timeRange);
  const endDate = new Date();

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
          </div>
        )}

        {/* Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          {view === 'weights' ? (
            weightsChartType === 'weight' ? (
              <WeightProgressChart
                exerciseId={selectedExercise}
                startDate={startDate}
                endDate={endDate}
              />
            ) : (
              <VolumeChart
                exerciseId={selectedExercise}
                startDate={startDate}
                endDate={endDate}
              />
            )
          ) : cardioChartType === 'distance' ? (
            <CardioDistanceChart
              cardioType={cardioFilter === 'all' ? null : cardioFilter}
              startDate={startDate}
              endDate={endDate}
            />
          ) : cardioChartType === 'duration' ? (
            <CardioDurationChart
              cardioType={cardioFilter === 'all' ? null : cardioFilter}
              startDate={startDate}
              endDate={endDate}
            />
          ) : (
            <CardioPaceChart
              cardioType={cardioFilter === 'all' ? null : cardioFilter}
              startDate={startDate}
              endDate={endDate}
            />
          )}
        </div>

        {/* Personal Records Section (Weights view only) */}
        {view === 'weights' && (
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
              Personal Records
            </h3>
            <PRList limit={5} />
          </div>
        )}

        {/* Cardio Stats Placeholder */}
        {view === 'cardio' && (
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
              <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Total Distance
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                --
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
              <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Total Time
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                --
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
              <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Sessions
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                --
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
              <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Avg Duration
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                --
              </p>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
