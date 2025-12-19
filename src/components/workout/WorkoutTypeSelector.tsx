interface WorkoutTypeSelectorProps {
  value: 'weights' | 'cardio';
  onChange: (type: 'weights' | 'cardio') => void;
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
        className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors min-h-[44px] ${
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
        className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors min-h-[44px] ${
          value === 'cardio'
            ? 'bg-white dark:bg-gray-700 shadow text-primary'
            : 'text-gray-500 dark:text-gray-400'
        }`}
      >
        Cardio
      </button>
    </div>
  );
}
