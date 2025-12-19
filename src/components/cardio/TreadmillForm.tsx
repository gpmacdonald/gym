import { useState } from 'react';
import { useSettingsStore } from '../../stores';
import DurationInput from './DurationInput';

export interface TreadmillData {
  duration: number;
  distance?: number;
  avgSpeed?: number;
  avgIncline?: number;
  maxIncline?: number;
  calories?: number;
  notes?: string;
}

interface TreadmillFormProps {
  onSave: (data: TreadmillData) => void;
  onCancel: () => void;
}

export default function TreadmillForm({ onSave, onCancel }: TreadmillFormProps) {
  const { distanceUnit } = useSettingsStore();
  const [duration, setDuration] = useState(0);
  const [distance, setDistance] = useState<number | ''>('');
  const [avgIncline, setAvgIncline] = useState<number | ''>('');
  const [maxIncline, setMaxIncline] = useState<number | ''>('');
  const [calories, setCalories] = useState<number | ''>('');
  const [notes, setNotes] = useState('');

  // Calculate speed when duration and distance are set
  const avgSpeed =
    duration > 0 && distance
      ? (Number(distance) / (duration / 3600)).toFixed(1)
      : null;

  const handleSubmit = () => {
    if (duration === 0) return;

    onSave({
      duration,
      distance: distance ? Number(distance) : undefined,
      avgSpeed: avgSpeed ? Number(avgSpeed) : undefined,
      avgIncline: avgIncline ? Number(avgIncline) : undefined,
      maxIncline: maxIncline ? Number(maxIncline) : undefined,
      calories: calories ? Number(calories) : undefined,
      notes: notes || undefined,
    });
  };

  const inputClass =
    'w-full h-10 px-3 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white';
  const labelClass =
    'block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300';

  return (
    <div className="space-y-4">
      {/* Duration (required) */}
      <div>
        <label className={labelClass}>Duration *</label>
        <DurationInput value={duration} onChange={setDuration} />
      </div>

      {/* Distance */}
      <div>
        <label className={labelClass}>Distance ({distanceUnit})</label>
        <input
          type="number"
          step="0.1"
          min="0"
          value={distance}
          onChange={(e) =>
            setDistance(e.target.value ? Number(e.target.value) : '')
          }
          className={inputClass}
          placeholder="0.0"
        />
      </div>

      {/* Auto-calculated speed display */}
      {avgSpeed && (
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Avg Speed: {avgSpeed} {distanceUnit === 'miles' ? 'mph' : 'km/h'}
        </p>
      )}

      {/* Average Incline (0-15%) */}
      <div>
        <label className={labelClass}>Avg Incline (%)</label>
        <input
          type="number"
          step="0.5"
          min="0"
          max="15"
          value={avgIncline}
          onChange={(e) =>
            setAvgIncline(e.target.value ? Number(e.target.value) : '')
          }
          className={inputClass}
          placeholder="0"
        />
      </div>

      {/* Max Incline */}
      <div>
        <label className={labelClass}>Max Incline (%)</label>
        <input
          type="number"
          step="0.5"
          min="0"
          max="15"
          value={maxIncline}
          onChange={(e) =>
            setMaxIncline(e.target.value ? Number(e.target.value) : '')
          }
          className={inputClass}
          placeholder="0"
        />
      </div>

      {/* Calories */}
      <div>
        <label className={labelClass}>Calories</label>
        <input
          type="number"
          min="0"
          value={calories}
          onChange={(e) =>
            setCalories(e.target.value ? Number(e.target.value) : '')
          }
          className={inputClass}
          placeholder="0"
        />
      </div>

      {/* Notes */}
      <div>
        <label className={labelClass}>Notes</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          rows={2}
          placeholder="How did it feel?"
        />
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={duration === 0}
          className="flex-1 py-3 bg-primary text-white rounded-lg disabled:opacity-50"
        >
          Save Session
        </button>
      </div>
    </div>
  );
}
