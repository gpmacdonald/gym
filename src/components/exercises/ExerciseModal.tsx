import { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import type { Exercise, MuscleGroup, EquipmentType } from '../../types';
import { addExercise, updateExercise } from '../../lib/queries';

const MUSCLE_GROUPS: MuscleGroup[] = [
  'chest',
  'back',
  'legs',
  'shoulders',
  'arms',
  'core',
];

const EQUIPMENT_TYPES: EquipmentType[] = [
  'barbell',
  'dumbbell',
  'machine',
];

interface ExerciseModalProps {
  exercise?: Exercise; // If provided, we're editing
  onClose: () => void;
  onSaved: () => void;
}

export default function ExerciseModal({
  exercise,
  onClose,
  onSaved,
}: ExerciseModalProps) {
  const [name, setName] = useState(exercise?.name || '');
  const [muscleGroup, setMuscleGroup] = useState<MuscleGroup>(
    exercise?.muscleGroup || 'chest'
  );
  const [equipmentType, setEquipmentType] = useState<EquipmentType>(
    exercise?.equipmentType || 'barbell'
  );
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  const isEditing = !!exercise;
  const title = isEditing ? 'Edit Exercise' : 'Add Exercise';

  useEffect(() => {
    if (exercise) {
      setName(exercise.name);
      setMuscleGroup(exercise.muscleGroup);
      setEquipmentType(exercise.equipmentType);
    }
  }, [exercise]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      setError('Exercise name is required');
      return;
    }

    setIsSaving(true);
    setError('');

    try {
      if (isEditing) {
        await updateExercise(exercise.id, {
          name: name.trim(),
          muscleGroup,
          equipmentType,
        });
      } else {
        await addExercise({
          name: name.trim(),
          muscleGroup,
          equipmentType,
          isCustom: true,
        });
      }
      onSaved();
    } catch (err) {
      setError('Failed to save exercise');
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            {title}
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {/* Name */}
          <div>
            <label
              htmlFor="exercise-name"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Exercise Name
            </label>
            <input
              id="exercise-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Incline Dumbbell Press"
              className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
              autoFocus
            />
          </div>

          {/* Muscle Group */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Muscle Group
            </label>
            <div className="flex flex-wrap gap-2">
              {MUSCLE_GROUPS.map((group) => (
                <button
                  key={group}
                  type="button"
                  onClick={() => setMuscleGroup(group)}
                  className={`px-3 py-1.5 text-sm font-medium rounded-full capitalize transition-colors ${
                    muscleGroup === group
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  {group}
                </button>
              ))}
            </div>
          </div>

          {/* Equipment Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Equipment
            </label>
            <div className="flex flex-wrap gap-2">
              {EQUIPMENT_TYPES.map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setEquipmentType(type)}
                  className={`px-3 py-1.5 text-sm font-medium rounded-full capitalize transition-colors ${
                    equipmentType === type
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Error */}
          {error && (
            <p className="text-sm text-red-500">{error}</p>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-4 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving || !name.trim()}
              className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-primary text-white rounded-lg font-medium disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {isSaving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
