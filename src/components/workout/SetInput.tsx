import { useState } from 'react';
import { Plus, Minus, Check } from 'lucide-react';
import { useSettingsStore } from '../../stores';

interface SetInputProps {
  onSave: (data: { reps: number; weight: number; rpe?: number }) => void;
  initialReps?: number;
  initialWeight?: number;
  initialRpe?: number;
  showRpe?: boolean;
}

export default function SetInput({
  onSave,
  initialReps = 0,
  initialWeight = 0,
  initialRpe,
  showRpe = false,
}: SetInputProps) {
  const { weightUnit } = useSettingsStore();
  const [reps, setReps] = useState(initialReps);
  const [weight, setWeight] = useState(initialWeight);
  const [rpe, setRpe] = useState<number | undefined>(initialRpe);
  const [showRpeInput, setShowRpeInput] = useState(showRpe);

  // Weight increment: 2.5 for kg, 5 for lbs
  const weightIncrement = weightUnit === 'kg' ? 2.5 : 5;

  const adjustReps = (delta: number) => {
    setReps((prev) => Math.max(0, prev + delta));
  };

  const adjustWeight = (delta: number) => {
    setWeight((prev) => Math.max(0, prev + delta));
  };

  const handleRepsChange = (value: string) => {
    const parsed = parseInt(value, 10);
    setReps(isNaN(parsed) ? 0 : Math.max(0, parsed));
  };

  const handleWeightChange = (value: string) => {
    const parsed = parseFloat(value);
    setWeight(isNaN(parsed) ? 0 : Math.max(0, parsed));
  };

  const handleRpeChange = (value: string) => {
    const parsed = parseInt(value, 10);
    if (isNaN(parsed) || value === '') {
      setRpe(undefined);
    } else {
      setRpe(Math.min(10, Math.max(1, parsed)));
    }
  };

  const handleSave = () => {
    if (reps > 0 && weight > 0) {
      onSave({ reps, weight, rpe });
    }
  };

  const isValid = reps > 0 && weight > 0;

  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
      <div className="flex items-end gap-4 flex-wrap">
        {/* Reps input with +/- buttons */}
        <div className="flex flex-col items-center">
          <label className="text-xs text-gray-500 dark:text-gray-400 mb-1">
            Reps
          </label>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => adjustReps(-1)}
              className="w-11 h-11 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              aria-label="Decrease reps"
            >
              <Minus className="w-4 h-4" />
            </button>
            <input
              type="number"
              inputMode="numeric"
              value={reps || ''}
              onChange={(e) => handleRepsChange(e.target.value)}
              placeholder="0"
              className="w-16 h-11 text-center text-lg font-semibold bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
              aria-label="Reps"
            />
            <button
              type="button"
              onClick={() => adjustReps(1)}
              className="w-11 h-11 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              aria-label="Increase reps"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Weight input with +/- buttons */}
        <div className="flex flex-col items-center">
          <label className="text-xs text-gray-500 dark:text-gray-400 mb-1">
            Weight ({weightUnit})
          </label>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => adjustWeight(-weightIncrement)}
              className="w-11 h-11 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              aria-label="Decrease weight"
            >
              <Minus className="w-4 h-4" />
            </button>
            <input
              type="number"
              inputMode="decimal"
              step={weightIncrement}
              value={weight || ''}
              onChange={(e) => handleWeightChange(e.target.value)}
              placeholder="0"
              className="w-20 h-11 text-center text-lg font-semibold bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
              aria-label="Weight"
            />
            <button
              type="button"
              onClick={() => adjustWeight(weightIncrement)}
              className="w-11 h-11 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              aria-label="Increase weight"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* RPE input (optional) */}
        {showRpeInput && (
          <div className="flex flex-col items-center">
            <label className="text-xs text-gray-500 dark:text-gray-400 mb-1">
              RPE
            </label>
            <input
              type="number"
              inputMode="numeric"
              min={1}
              max={10}
              value={rpe ?? ''}
              onChange={(e) => handleRpeChange(e.target.value)}
              placeholder="1-10"
              className="w-16 h-11 text-center text-lg font-semibold bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
              aria-label="RPE (Rate of Perceived Exertion)"
            />
          </div>
        )}

        {/* Toggle RPE button */}
        {!showRpeInput && (
          <button
            type="button"
            onClick={() => setShowRpeInput(true)}
            className="h-11 px-3 text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
          >
            + RPE
          </button>
        )}

        {/* Save button */}
        <button
          type="button"
          onClick={handleSave}
          disabled={!isValid}
          className="h-11 px-4 bg-primary text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity flex items-center gap-2"
          aria-label="Add set"
        >
          <Check className="w-4 h-4" />
          <span>Add Set</span>
        </button>
      </div>
    </div>
  );
}
