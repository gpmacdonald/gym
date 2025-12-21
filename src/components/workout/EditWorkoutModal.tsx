import { useState } from 'react';
import { X, Save, Trash2, Minus, Plus } from 'lucide-react';
import type { Workout, WorkoutSet, Exercise } from '../../types';
import { updateWorkout, updateSet, deleteSet, addSet } from '../../lib/queries';
import { useSettingsStore } from '../../stores/settingsStore';

interface EditableSet {
  id: string;
  exerciseId: string;
  reps: number;
  weight: number;
  rpe?: number;
  isNew?: boolean;
  isDeleted?: boolean;
}

interface EditWorkoutModalProps {
  workout: Workout;
  sets: WorkoutSet[];
  exercises: Exercise[];
  onClose: () => void;
  onSaved: () => void;
}

export default function EditWorkoutModal({
  workout,
  sets,
  exercises,
  onClose,
  onSaved,
}: EditWorkoutModalProps) {
  const { weightUnit } = useSettingsStore();
  const [editableSets, setEditableSets] = useState<EditableSet[]>(
    sets.map((s) => ({
      id: s.id,
      exerciseId: s.exerciseId,
      reps: s.reps,
      weight: s.weight,
      rpe: s.rpe,
    }))
  );
  const [notes, setNotes] = useState(workout.notes || '');
  const [isSaving, setIsSaving] = useState(false);

  // Group sets by exercise
  const setsByExercise = editableSets
    .filter((s) => !s.isDeleted)
    .reduce(
      (acc, set) => {
        if (!acc[set.exerciseId]) acc[set.exerciseId] = [];
        acc[set.exerciseId].push(set);
        return acc;
      },
      {} as Record<string, EditableSet[]>
    );

  const handleSetChange = (
    setId: string,
    field: 'reps' | 'weight' | 'rpe',
    value: number | undefined
  ) => {
    setEditableSets((prev) =>
      prev.map((s) => (s.id === setId ? { ...s, [field]: value } : s))
    );
  };

  const handleDeleteSet = (setId: string) => {
    setEditableSets((prev) =>
      prev.map((s) => (s.id === setId ? { ...s, isDeleted: true } : s))
    );
  };

  const handleAddSet = (exerciseId: string) => {
    const exerciseSets = editableSets.filter(
      (s) => s.exerciseId === exerciseId && !s.isDeleted
    );
    const lastSet = exerciseSets[exerciseSets.length - 1];

    setEditableSets((prev) => [
      ...prev,
      {
        id: `new-${Date.now()}`,
        exerciseId,
        reps: lastSet?.reps || 10,
        weight: lastSet?.weight || 0,
        rpe: lastSet?.rpe,
        isNew: true,
      },
    ]);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Update workout notes
      await updateWorkout(workout.id, { notes: notes || undefined });

      // Process sets
      for (const set of editableSets) {
        if (set.isDeleted && !set.isNew) {
          // Delete existing set
          await deleteSet(set.id);
        } else if (set.isNew && !set.isDeleted) {
          // Add new set
          await addSet({
            workoutId: workout.id,
            exerciseId: set.exerciseId,
            setNumber: editableSets.filter(
              (s) => s.exerciseId === set.exerciseId && !s.isDeleted
            ).length,
            reps: set.reps,
            weight: set.weight,
            rpe: set.rpe,
          });
        } else if (!set.isNew && !set.isDeleted) {
          // Update existing set
          const original = sets.find((s) => s.id === set.id);
          if (
            original &&
            (original.reps !== set.reps ||
              original.weight !== set.weight ||
              original.rpe !== set.rpe)
          ) {
            await updateSet(set.id, {
              reps: set.reps,
              weight: set.weight,
              rpe: set.rpe,
            });
          }
        }
      }

      onSaved();
    } catch (error) {
      console.error('Failed to save workout:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const getExercise = (id: string) => exercises.find((e) => e.id === id);

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-end sm:items-center justify-center">
      <div className="bg-white dark:bg-gray-900 rounded-t-2xl sm:rounded-2xl w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Edit Workout
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {Object.entries(setsByExercise).map(([exerciseId, exerciseSets]) => {
            const exercise = getExercise(exerciseId);
            return (
              <div
                key={exerciseId}
                className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3"
              >
                <h3 className="font-medium text-gray-900 dark:text-white mb-3">
                  {exercise?.name || 'Unknown Exercise'}
                </h3>

                <div className="space-y-2">
                  {exerciseSets.map((set, index) => (
                    <div
                      key={set.id}
                      className="flex items-center gap-2 bg-white dark:bg-gray-700 rounded-lg p-2"
                    >
                      <span className="text-sm text-gray-500 dark:text-gray-400 w-6">
                        {index + 1}.
                      </span>

                      {/* Weight */}
                      <div className="flex-1">
                        <label className="sr-only">Weight</label>
                        <div className="flex items-center gap-1">
                          <input
                            type="number"
                            value={set.weight}
                            onChange={(e) =>
                              handleSetChange(
                                set.id,
                                'weight',
                                parseFloat(e.target.value) || 0
                              )
                            }
                            className="w-16 px-2 py-1 text-center bg-gray-100 dark:bg-gray-600 border-0 rounded text-gray-900 dark:text-white"
                            min="0"
                            step="0.5"
                          />
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {weightUnit}
                          </span>
                        </div>
                      </div>

                      {/* Reps */}
                      <div className="flex-1">
                        <label className="sr-only">Reps</label>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() =>
                              handleSetChange(
                                set.id,
                                'reps',
                                Math.max(1, set.reps - 1)
                              )
                            }
                            className="p-1 rounded bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-400"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <input
                            type="number"
                            value={set.reps}
                            onChange={(e) =>
                              handleSetChange(
                                set.id,
                                'reps',
                                parseInt(e.target.value) || 1
                              )
                            }
                            className="w-12 px-2 py-1 text-center bg-gray-100 dark:bg-gray-600 border-0 rounded text-gray-900 dark:text-white"
                            min="1"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              handleSetChange(set.id, 'reps', set.reps + 1)
                            }
                            className="p-1 rounded bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-400"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>

                      {/* RPE */}
                      <div className="w-16">
                        <label className="sr-only">RPE</label>
                        <input
                          type="number"
                          value={set.rpe || ''}
                          onChange={(e) =>
                            handleSetChange(
                              set.id,
                              'rpe',
                              e.target.value
                                ? parseInt(e.target.value)
                                : undefined
                            )
                          }
                          placeholder="RPE"
                          className="w-full px-2 py-1 text-center bg-gray-100 dark:bg-gray-600 border-0 rounded text-gray-900 dark:text-white placeholder-gray-400"
                          min="1"
                          max="10"
                        />
                      </div>

                      {/* Delete */}
                      <button
                        type="button"
                        onClick={() => handleDeleteSet(set.id)}
                        className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                        aria-label="Delete set"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Add set button */}
                <button
                  type="button"
                  onClick={() => handleAddSet(exerciseId)}
                  className="mt-2 w-full py-2 text-sm text-primary hover:bg-primary/5 rounded-lg transition-colors"
                >
                  + Add Set
                </button>
              </div>
            );
          })}

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Notes
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="How did the workout feel?"
              rows={2}
              className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-4 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-primary text-white rounded-lg font-medium disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
