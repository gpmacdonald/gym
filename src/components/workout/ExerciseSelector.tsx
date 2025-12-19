import { useState, useEffect, useMemo } from 'react';
import { Search, X } from 'lucide-react';
import type { Exercise, MuscleGroup } from '../../types';
import { getAllExercises } from '../../lib/queries';

interface ExerciseSelectorProps {
  onSelect: (exercise: Exercise) => void;
  recentExerciseIds?: string[];
}

const MUSCLE_GROUPS: MuscleGroup[] = [
  'chest',
  'back',
  'legs',
  'shoulders',
  'arms',
  'core',
];

export default function ExerciseSelector({
  onSelect,
  recentExerciseIds = [],
}: ExerciseSelectorProps) {
  const [query, setQuery] = useState('');
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<MuscleGroup | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadExercises();
  }, []);

  async function loadExercises() {
    setIsLoading(true);
    try {
      const all = await getAllExercises();
      setExercises(all);
    } finally {
      setIsLoading(false);
    }
  }

  const filteredExercises = useMemo(() => {
    let result = exercises;

    if (query) {
      result = result.filter((ex) =>
        ex.name.toLowerCase().includes(query.toLowerCase())
      );
    }

    if (selectedGroup) {
      result = result.filter((ex) => ex.muscleGroup === selectedGroup);
    }

    // Sort: recent first, then alphabetical
    return result.sort((a, b) => {
      const aRecent = recentExerciseIds.indexOf(a.id);
      const bRecent = recentExerciseIds.indexOf(b.id);
      if (aRecent !== -1 && bRecent === -1) return -1;
      if (bRecent !== -1 && aRecent === -1) return 1;
      if (aRecent !== -1 && bRecent !== -1) return aRecent - bRecent;
      return a.name.localeCompare(b.name);
    });
  }, [exercises, query, selectedGroup, recentExerciseIds]);

  function handleGroupClick(group: MuscleGroup) {
    setSelectedGroup((prev) => (prev === group ? null : group));
  }

  function clearSearch() {
    setQuery('');
  }

  if (isLoading) {
    return (
      <div className="p-4 text-center text-gray-500 dark:text-gray-400">
        Loading exercises...
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search exercises..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full pl-10 pr-10 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        />
        {query && (
          <button
            onClick={clearSearch}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            aria-label="Clear search"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Muscle Group Filter Chips */}
      <div className="flex flex-wrap gap-2">
        {MUSCLE_GROUPS.map((group) => (
          <button
            key={group}
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

      {/* Exercise List */}
      <div className="max-h-64 overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-lg divide-y divide-gray-200 dark:divide-gray-700">
        {filteredExercises.length === 0 ? (
          <div className="p-4 text-center text-gray-500 dark:text-gray-400">
            No exercises found
          </div>
        ) : (
          filteredExercises.map((exercise) => (
            <button
              key={exercise.id}
              onClick={() => onSelect(exercise)}
              className="w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex justify-between items-center min-h-[44px]"
            >
              <span className="text-gray-900 dark:text-white font-medium">
                {exercise.name}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                {exercise.muscleGroup}
              </span>
            </button>
          ))
        )}
      </div>
    </div>
  );
}
