import { useState } from 'react';
import { Dumbbell, Heart } from 'lucide-react';
import { Header } from '../components/layout';
import {
  TimeRangeTabs,
  ExerciseDropdown,
  CardioTypeDropdown,
  type TimeRange,
  type CardioFilter,
} from '../components/progress';

type ViewType = 'weights' | 'cardio';

export default function Progress() {
  const [view, setView] = useState<ViewType>('weights');
  const [timeRange, setTimeRange] = useState<TimeRange>('3M');
  const [selectedExercise, setSelectedExercise] = useState<string | null>(null);
  const [cardioFilter, setCardioFilter] = useState<CardioFilter>('all');

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

        {/* Chart Placeholder */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 min-h-[300px] flex items-center justify-center border border-gray-200 dark:border-gray-700">
          <div className="text-center text-gray-500 dark:text-gray-400">
            {view === 'weights' ? (
              selectedExercise ? (
                <p>Weight progress chart will appear here</p>
              ) : (
                <p>Select an exercise to view progress</p>
              )
            ) : (
              <p>Cardio progress chart will appear here</p>
            )}
          </div>
        </div>

        {/* Stats Cards Placeholder */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              {view === 'weights' ? 'Personal Record' : 'Total Distance'}
            </p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
              --
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              {view === 'weights' ? 'Total Volume' : 'Total Time'}
            </p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
              --
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              {view === 'weights' ? 'Workouts' : 'Sessions'}
            </p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
              --
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              {view === 'weights' ? 'Avg Weight' : 'Avg Duration'}
            </p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
              --
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
