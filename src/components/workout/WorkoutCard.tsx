import { useState } from 'react';
import { ChevronDown, ChevronUp, Pencil, Trash2 } from 'lucide-react';
import type { Workout, WorkoutSet, Exercise } from '../../types';
import { useSettingsStore } from '../../stores';

interface WorkoutCardProps {
  workout: Workout;
  sets: WorkoutSet[];
  exercises: Exercise[];
  onEdit?: () => void;
  onDelete?: () => void;
}

function formatDate(date: Date): string {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const workoutDate = new Date(date);
  const isToday = workoutDate.toDateString() === today.toDateString();
  const isYesterday = workoutDate.toDateString() === yesterday.toDateString();

  if (isToday) {
    return 'Today';
  }
  if (isYesterday) {
    return 'Yesterday';
  }

  return workoutDate.toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}

export default function WorkoutCard({
  workout,
  sets,
  exercises,
  onEdit,
  onDelete,
}: WorkoutCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { weightUnit } = useSettingsStore();

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit?.();
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete?.();
  };

  // Group sets by exercise
  const setsByExercise = sets.reduce(
    (acc, set) => {
      if (!acc[set.exerciseId]) acc[set.exerciseId] = [];
      acc[set.exerciseId].push(set);
      return acc;
    },
    {} as Record<string, WorkoutSet[]>
  );

  const exerciseCount = Object.keys(setsByExercise).length;
  const totalSets = sets.length;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-4 flex items-center justify-between"
        aria-expanded={isExpanded}
        aria-label={`${formatDate(workout.date)}, ${exerciseCount} exercises, ${totalSets} sets`}
      >
        <div className="text-left">
          <p className="font-semibold text-gray-900 dark:text-white">
            {formatDate(workout.date)}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {exerciseCount} {exerciseCount === 1 ? 'exercise' : 'exercises'} •{' '}
            {totalSets} {totalSets === 1 ? 'set' : 'sets'}
          </p>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-gray-400" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-400" />
        )}
      </button>

      {isExpanded && (
        <div className="px-4 pb-4 border-t border-gray-100 dark:border-gray-700">
          {/* Action buttons */}
          {(onEdit || onDelete) && (
            <div className="flex justify-end gap-2 mt-2 mb-1">
              {onEdit && (
                <button
                  type="button"
                  onClick={handleEditClick}
                  className="flex items-center gap-1 px-3 py-2 text-sm text-primary hover:bg-primary/5 rounded-lg transition-colors min-h-[44px]"
                  aria-label="Edit workout"
                >
                  <Pencil className="w-4 h-4" aria-hidden="true" />
                  Edit
                </button>
              )}
              {onDelete && (
                <button
                  type="button"
                  onClick={handleDeleteClick}
                  className="flex items-center gap-1 px-3 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors min-h-[44px]"
                  aria-label="Delete workout"
                >
                  <Trash2 className="w-4 h-4" aria-hidden="true" />
                  Delete
                </button>
              )}
            </div>
          )}
          {Object.entries(setsByExercise).map(([exerciseId, exerciseSets]) => {
            const exercise = exercises.find((e) => e.id === exerciseId);
            return (
              <div key={exerciseId} className="mt-3">
                <p className="font-medium text-gray-900 dark:text-white">
                  {exercise?.name || 'Unknown Exercise'}
                </p>
                <div className="flex flex-wrap gap-2 mt-1">
                  {exerciseSets.map((set) => (
                    <span
                      key={set.id}
                      className="text-sm text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded"
                    >
                      {set.weight}
                      {weightUnit} × {set.reps}
                      {set.rpe && (
                        <span className="text-gray-400 dark:text-gray-500">
                          {' '}
                          @{set.rpe}
                        </span>
                      )}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
          {workout.notes && (
            <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
              <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                {workout.notes}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
