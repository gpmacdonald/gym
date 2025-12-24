export type WorkoutType = 'weights' | 'cardio' | 'bodyweight';

interface WorkoutTypeSelectorProps {
  value: WorkoutType;
  onChange: (type: WorkoutType) => void;
}

export default function WorkoutTypeSelector({
  value,
  onChange,
}: WorkoutTypeSelectorProps) {
  return (
    <div className="flex rounded-lg bg-gray-100 dark:bg-gray-800 p-1">
      <button
        type="button"
        onClick={() => onChange('weights')}
        className={`flex-1 py-1.5 px-3 rounded-md text-sm font-medium transition-colors min-h-[44px] ${
          value === 'weights'
            ? 'bg-white dark:bg-gray-700 shadow text-primary'
            : 'text-gray-500 dark:text-gray-400'
        }`}
      >
        Weights
      </button>
      <button
        type="button"
        onClick={() => onChange('cardio')}
        className={`flex-1 py-1.5 px-3 rounded-md text-sm font-medium transition-colors min-h-[44px] ${
          value === 'cardio'
            ? 'bg-white dark:bg-gray-700 shadow text-primary'
            : 'text-gray-500 dark:text-gray-400'
        }`}
      >
        Cardio
      </button>
      <button
        type="button"
        onClick={() => onChange('bodyweight')}
        className={`flex-1 py-1.5 px-3 rounded-md text-sm font-medium transition-colors min-h-[44px] ${
          value === 'bodyweight'
            ? 'bg-white dark:bg-gray-700 shadow text-purple-600'
            : 'text-gray-500 dark:text-gray-400'
        }`}
      >
        Scale
      </button>
    </div>
  );
}
