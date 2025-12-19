import { X, Trash2 } from 'lucide-react';
import type { Exercise } from '../../types';
import { useSettingsStore } from '../../stores';

interface SetData {
  reps: number;
  weight: number;
  rpe?: number;
}

interface WorkoutExerciseCardProps {
  exercise: Exercise;
  sets: SetData[];
  onRemoveSet: (setIndex: number) => void;
  onRemoveExercise: () => void;
}

export default function WorkoutExerciseCard({
  exercise,
  sets,
  onRemoveSet,
  onRemoveExercise,
}: WorkoutExerciseCardProps) {
  const { weightUnit } = useSettingsStore();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
        <div>
          <h3 className="font-medium text-gray-900 dark:text-white">
            {exercise.name}
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
            {exercise.muscleGroup}
          </p>
        </div>
        <button
          type="button"
          onClick={onRemoveExercise}
          className="p-2 text-gray-400 hover:text-red-500 transition-colors"
          aria-label={`Remove ${exercise.name}`}
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>

      {/* Sets List */}
      <div className="divide-y divide-gray-100 dark:divide-gray-700">
        {sets.length === 0 ? (
          <p className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400 italic">
            No sets logged yet
          </p>
        ) : (
          sets.map((set, index) => (
            <div
              key={index}
              className="flex items-center justify-between px-4 py-2"
            >
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400 w-8">
                  #{index + 1}
                </span>
                <span className="text-gray-900 dark:text-white">
                  {set.reps} reps × {set.weight} {weightUnit}
                </span>
                {set.rpe !== undefined && (
                  <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded">
                    RPE {set.rpe}
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={() => onRemoveSet(index)}
                className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                aria-label={`Remove set ${index + 1}`}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
