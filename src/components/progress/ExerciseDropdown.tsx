import { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import type { Exercise } from '../../types';
import { getAllExercises, getSetsByExerciseId } from '../../lib/queries';

interface ExerciseDropdownProps {
  value: string | null;
  onChange: (exerciseId: string | null) => void;
}

interface ExerciseWithUsage extends Exercise {
  lastUsed: Date | null;
  setCount: number;
}

export default function ExerciseDropdown({
  value,
  onChange,
}: ExerciseDropdownProps) {
  const [exercises, setExercises] = useState<ExerciseWithUsage[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadExercises();
  }, []);

  async function loadExercises() {
    try {
      const allExercises = await getAllExercises();

      // Get usage data for each exercise
      const exercisesWithUsage = await Promise.all(
        allExercises.map(async (exercise) => {
          const sets = await getSetsByExerciseId(exercise.id);
          const lastUsed =
            sets.length > 0
              ? sets.reduce(
                  (latest, set) =>
                    set.createdAt > latest ? set.createdAt : latest,
                  sets[0].createdAt
                )
              : null;
          return {
            ...exercise,
            lastUsed,
            setCount: sets.length,
          };
        })
      );

      // Sort by recent usage first, then alphabetically
      exercisesWithUsage.sort((a, b) => {
        // Exercises with usage come first
        if (a.setCount > 0 && b.setCount === 0) return -1;
        if (a.setCount === 0 && b.setCount > 0) return 1;

        // If both have usage, sort by most recent
        if (a.lastUsed && b.lastUsed) {
          return b.lastUsed.getTime() - a.lastUsed.getTime();
        }

        // Otherwise alphabetical
        return a.name.localeCompare(b.name);
      });

      setExercises(exercisesWithUsage);
    } catch (error) {
      console.error('Failed to load exercises:', error);
    } finally {
      setIsLoading(false);
    }
  }

  const selectedExercise = exercises.find((e) => e.id === value);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between gap-2 px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-left"
        disabled={isLoading}
      >
        <span
          className={`truncate ${
            selectedExercise
              ? 'text-gray-900 dark:text-white'
              : 'text-gray-500 dark:text-gray-400'
          }`}
        >
          {isLoading
            ? 'Loading...'
            : selectedExercise?.name || 'Select exercise'}
        </span>
        <ChevronDown
          className={`w-5 h-5 text-gray-400 transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />

          {/* Dropdown */}
          <div className="absolute z-20 mt-1 w-full max-h-60 overflow-auto bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg">
            {exercises.length === 0 ? (
              <div className="px-4 py-3 text-gray-500 dark:text-gray-400 text-sm">
                No exercises found
              </div>
            ) : (
              <>
                {/* Recent exercises section */}
                {exercises.some((e) => e.setCount > 0) && (
                  <div className="px-3 py-2 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider bg-gray-50 dark:bg-gray-900">
                    Recent
                  </div>
                )}
                {exercises
                  .filter((e) => e.setCount > 0)
                  .slice(0, 5)
                  .map((exercise) => (
                    <button
                      key={exercise.id}
                      type="button"
                      onClick={() => {
                        onChange(exercise.id);
                        setIsOpen(false);
                      }}
                      className={`w-full px-4 py-2.5 text-left hover:bg-gray-100 dark:hover:bg-gray-700 ${
                        value === exercise.id
                          ? 'bg-primary/10 text-primary'
                          : 'text-gray-900 dark:text-white'
                      }`}
                    >
                      {exercise.name}
                    </button>
                  ))}

                {/* All exercises section */}
                <div className="px-3 py-2 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider bg-gray-50 dark:bg-gray-900">
                  All Exercises
                </div>
                {exercises.map((exercise) => (
                  <button
                    key={`all-${exercise.id}`}
                    type="button"
                    onClick={() => {
                      onChange(exercise.id);
                      setIsOpen(false);
                    }}
                    className={`w-full px-4 py-2.5 text-left hover:bg-gray-100 dark:hover:bg-gray-700 ${
                      value === exercise.id
                        ? 'bg-primary/10 text-primary'
                        : 'text-gray-900 dark:text-white'
                    }`}
                  >
                    <span>{exercise.name}</span>
                    {exercise.setCount > 0 && (
                      <span className="ml-2 text-xs text-gray-400">
                        ({exercise.setCount} sets)
                      </span>
                    )}
                  </button>
                ))}
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}
