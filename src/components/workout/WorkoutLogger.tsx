import { useState } from 'react';
import { Plus, Save, X } from 'lucide-react';
import type { Exercise } from '../../types';
import { addWorkout, addSet } from '../../lib/queries';
import { useInstallPrompt } from '../../lib/pwa';
import ExerciseSelector from './ExerciseSelector';
import SetInput from './SetInput';
import WorkoutExerciseCard from './WorkoutExerciseCard';

interface SetData {
  reps: number;
  weight: number;
  rpe?: number;
}

interface ExerciseWithSets {
  exercise: Exercise;
  sets: SetData[];
}

interface WorkoutLoggerProps {
  onComplete: () => void;
  onCancel: () => void;
}

export default function WorkoutLogger({ onComplete, onCancel }: WorkoutLoggerProps) {
  const [exercises, setExercises] = useState<ExerciseWithSets[]>([]);
  const [showExerciseSelector, setShowExerciseSelector] = useState(false);
  const [activeExerciseIndex, setActiveExerciseIndex] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [notes, setNotes] = useState('');
  const { markFirstWorkoutComplete } = useInstallPrompt();

  const recentExerciseIds = exercises.map((e) => e.exercise.id);

  const handleSelectExercise = (exercise: Exercise) => {
    // Check if exercise already added
    const existingIndex = exercises.findIndex(
      (e) => e.exercise.id === exercise.id
    );

    if (existingIndex !== -1) {
      // Focus on existing exercise
      setActiveExerciseIndex(existingIndex);
    } else {
      // Add new exercise
      setExercises((prev) => [...prev, { exercise, sets: [] }]);
      setActiveExerciseIndex(exercises.length);
    }

    setShowExerciseSelector(false);
  };

  const handleAddSet = (data: { reps: number; weight: number; rpe?: number }) => {
    if (activeExerciseIndex === null) return;

    setExercises((prev) => {
      const updated = [...prev];
      updated[activeExerciseIndex] = {
        ...updated[activeExerciseIndex],
        sets: [...updated[activeExerciseIndex].sets, data],
      };
      return updated;
    });
  };

  const handleRemoveSet = (exerciseIndex: number, setIndex: number) => {
    setExercises((prev) => {
      const updated = [...prev];
      updated[exerciseIndex] = {
        ...updated[exerciseIndex],
        sets: updated[exerciseIndex].sets.filter((_, i) => i !== setIndex),
      };
      return updated;
    });
  };

  const handleRemoveExercise = (exerciseIndex: number) => {
    setExercises((prev) => prev.filter((_, i) => i !== exerciseIndex));
    if (activeExerciseIndex === exerciseIndex) {
      setActiveExerciseIndex(null);
    } else if (activeExerciseIndex !== null && activeExerciseIndex > exerciseIndex) {
      setActiveExerciseIndex(activeExerciseIndex - 1);
    }
  };

  const handleSaveWorkout = async () => {
    // Filter out exercises with no sets
    const exercisesWithSets = exercises.filter((e) => e.sets.length > 0);

    if (exercisesWithSets.length === 0) {
      return;
    }

    setIsSaving(true);

    try {
      // Create workout
      const workoutId = await addWorkout({
        date: new Date(),
        notes: notes || undefined,
      });

      // Create all sets
      let setNumber = 1;
      for (const { exercise, sets } of exercisesWithSets) {
        for (const set of sets) {
          await addSet({
            workoutId,
            exerciseId: exercise.id,
            setNumber: setNumber++,
            reps: set.reps,
            weight: set.weight,
            rpe: set.rpe,
          });
        }
      }

      // Mark first workout complete for install prompt
      markFirstWorkoutComplete();

      onComplete();
    } catch (error) {
      console.error('Failed to save workout:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const totalSets = exercises.reduce((sum, e) => sum + e.sets.length, 0);
  const canSave = totalSets > 0;

  return (
    <div className="flex flex-col gap-4">
      {/* Exercise Selector Modal */}
      {showExerciseSelector && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-end sm:items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-t-2xl sm:rounded-2xl w-full max-w-lg max-h-[80vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Select Exercise
              </h2>
              <button
                type="button"
                onClick={() => setShowExerciseSelector(false)}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 overflow-y-auto">
              <ExerciseSelector
                onSelect={handleSelectExercise}
                recentExerciseIds={recentExerciseIds}
              />
            </div>
          </div>
        </div>
      )}

      {/* Header with cancel and save */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onCancel}
          className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSaveWorkout}
          disabled={!canSave || isSaving}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Save className="w-4 h-4" />
          {isSaving ? 'Saving...' : 'Save Workout'}
        </button>
      </div>

      {/* Add Exercise Button */}
      <button
        type="button"
        onClick={() => setShowExerciseSelector(true)}
        className="flex items-center justify-center gap-2 w-full py-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-600 dark:text-gray-400 hover:border-primary hover:text-primary transition-colors"
      >
        <Plus className="w-5 h-5" />
        Add Exercise
      </button>

      {/* Exercises List */}
      {exercises.map((item, index) => (
        <div key={item.exercise.id}>
          <WorkoutExerciseCard
            exercise={item.exercise}
            sets={item.sets}
            onRemoveSet={(setIndex) => handleRemoveSet(index, setIndex)}
            onRemoveExercise={() => handleRemoveExercise(index)}
          />

          {/* Set Input for active exercise */}
          {activeExerciseIndex === index && (
            <div className="mt-2">
              <SetInput onSave={handleAddSet} />
            </div>
          )}

          {/* Select this exercise button if not active */}
          {activeExerciseIndex !== index && (
            <button
              type="button"
              onClick={() => setActiveExerciseIndex(index)}
              className="mt-2 w-full py-2 text-sm text-primary hover:bg-primary/5 rounded-lg transition-colors"
            >
              + Add set to {item.exercise.name}
            </button>
          )}
        </div>
      ))}

      {/* Notes */}
      {exercises.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Notes (optional)
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="How did the workout feel?"
            rows={2}
            className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      )}

      {/* Empty State */}
      {exercises.length === 0 && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <p>No exercises added yet.</p>
          <p className="text-sm mt-1">Tap "Add Exercise" to get started.</p>
        </div>
      )}
    </div>
  );
}
