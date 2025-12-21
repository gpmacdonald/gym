import { useState, useEffect, useMemo } from 'react';
import { Search, X, Plus, Pencil, Trash2, Loader2 } from 'lucide-react';
import type { Exercise, MuscleGroup } from '../../types';
import { getAllExercises, deleteExercise } from '../../lib/queries';
import { ConfirmDialog } from '../common';
import ExerciseModal from './ExerciseModal';

const MUSCLE_GROUPS: MuscleGroup[] = [
  'chest',
  'back',
  'legs',
  'shoulders',
  'arms',
  'core',
];

export default function ExerciseList() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [selectedGroup, setSelectedGroup] = useState<MuscleGroup | null>(null);
  const [showCustomOnly, setShowCustomOnly] = useState(false);

  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [editingExercise, setEditingExercise] = useState<Exercise | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<Exercise | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    loadExercises();
  }, []);

  async function loadExercises() {
    setIsLoading(true);
    try {
      const all = await getAllExercises();
      setExercises(all);
    } catch (error) {
      console.error('Failed to load exercises:', error);
    } finally {
      setIsLoading(false);
    }
  }

  const filteredExercises = useMemo(() => {
    let result = exercises;

    // Filter by search query
    if (query) {
      const lowerQuery = query.toLowerCase();
      result = result.filter((ex) =>
        ex.name.toLowerCase().includes(lowerQuery)
      );
    }

    // Filter by muscle group
    if (selectedGroup) {
      result = result.filter((ex) => ex.muscleGroup === selectedGroup);
    }

    // Filter custom only
    if (showCustomOnly) {
      result = result.filter((ex) => ex.isCustom);
    }

    // Sort: custom first, then alphabetical
    return result.sort((a, b) => {
      if (a.isCustom && !b.isCustom) return -1;
      if (!a.isCustom && b.isCustom) return 1;
      return a.name.localeCompare(b.name);
    });
  }, [exercises, query, selectedGroup, showCustomOnly]);

  const handleGroupClick = (group: MuscleGroup) => {
    setSelectedGroup((prev) => (prev === group ? null : group));
  };

  const handleAddExercise = () => {
    setEditingExercise(null);
    setShowModal(true);
  };

  const handleEditExercise = (exercise: Exercise) => {
    setEditingExercise(exercise);
    setShowModal(true);
  };

  const handleDeleteExercise = (exercise: Exercise) => {
    setDeleteConfirm(exercise);
  };

  const handleConfirmDelete = async () => {
    if (!deleteConfirm) return;

    setIsDeleting(true);
    try {
      await deleteExercise(deleteConfirm.id);
      setDeleteConfirm(null);
      await loadExercises();
    } catch (error) {
      console.error('Failed to delete exercise:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleModalSaved = async () => {
    setShowModal(false);
    setEditingExercise(null);
    await loadExercises();
  };

  const customCount = exercises.filter((e) => e.isCustom).length;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Add button */}
      <button
        type="button"
        onClick={handleAddExercise}
        className="flex items-center justify-center gap-2 w-full py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors"
      >
        <Plus className="w-5 h-5" />
        Add Custom Exercise
      </button>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search exercises..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full pl-10 pr-10 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            aria-label="Clear search"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="space-y-2">
        {/* Muscle group filter */}
        <div className="flex flex-wrap gap-2">
          {MUSCLE_GROUPS.map((group) => (
            <button
              key={group}
              type="button"
              onClick={() => handleGroupClick(group)}
              className={`px-3 py-1.5 text-sm font-medium rounded-full capitalize transition-colors ${
                selectedGroup === group
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {group}
            </button>
          ))}
        </div>

        {/* Custom only toggle */}
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={showCustomOnly}
            onChange={(e) => setShowCustomOnly(e.target.checked)}
            className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
          />
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Show custom exercises only ({customCount})
          </span>
        </label>
      </div>

      {/* Exercise list */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 divide-y divide-gray-200 dark:divide-gray-700">
        {filteredExercises.length === 0 ? (
          <div className="p-8 text-center text-gray-500 dark:text-gray-400">
            {query || selectedGroup || showCustomOnly
              ? 'No exercises match your filters'
              : 'No exercises found'}
          </div>
        ) : (
          filteredExercises.map((exercise) => (
            <div
              key={exercise.id}
              className="p-4 flex items-center justify-between"
            >
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-medium text-gray-900 dark:text-white">
                    {exercise.name}
                  </p>
                  {exercise.isCustom && (
                    <span className="px-2 py-0.5 text-xs font-medium bg-primary/10 text-primary rounded-full">
                      Custom
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                  {exercise.muscleGroup} • {exercise.equipmentType}
                </p>
              </div>

              {exercise.isCustom && (
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => handleEditExercise(exercise)}
                    className="p-2 text-gray-400 hover:text-primary rounded-lg transition-colors"
                    aria-label={`Edit ${exercise.name}`}
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteExercise(exercise)}
                    className="p-2 text-gray-400 hover:text-red-500 rounded-lg transition-colors"
                    aria-label={`Delete ${exercise.name}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Results count */}
      <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
        Showing {filteredExercises.length} of {exercises.length} exercises
      </p>

      {/* Add/Edit Modal */}
      {showModal && (
        <ExerciseModal
          exercise={editingExercise || undefined}
          onClose={() => {
            setShowModal(false);
            setEditingExercise(null);
          }}
          onSaved={handleModalSaved}
        />
      )}

      {/* Delete Confirmation */}
      {deleteConfirm && (
        <ConfirmDialog
          title="Delete Exercise?"
          message={`Are you sure you want to delete "${deleteConfirm.name}"? This action cannot be undone.`}
          confirmLabel="Delete"
          variant="danger"
          isLoading={isDeleting}
          onConfirm={handleConfirmDelete}
          onCancel={() => setDeleteConfirm(null)}
        />
      )}
    </div>
  );
}
