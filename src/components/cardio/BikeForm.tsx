import { useState } from 'react';
import { useSettingsStore } from '../../stores';
import DurationInput from './DurationInput';

export interface BikeData {
  duration: number;
  distance?: number;
  avgResistance?: number;
  avgCadence?: number;
  calories?: number;
  notes?: string;
}

interface BikeFormProps {
  onSave: (data: BikeData) => void;
  onCancel: () => void;
}

export default function BikeForm({ onSave, onCancel }: BikeFormProps) {
  const { distanceUnit } = useSettingsStore();
  const [duration, setDuration] = useState(0);
  const [distance, setDistance] = useState<number | ''>('');
  const [avgResistance, setAvgResistance] = useState<number | ''>('');
  const [avgCadence, setAvgCadence] = useState<number | ''>('');
  const [calories, setCalories] = useState<number | ''>('');
  const [notes, setNotes] = useState('');

  const handleSubmit = () => {
    if (duration === 0) return;

    onSave({
      duration,
      distance: distance ? Number(distance) : undefined,
      avgResistance: avgResistance ? Number(avgResistance) : undefined,
      avgCadence: avgCadence ? Number(avgCadence) : undefined,
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

      {/* Distance (optional - not all bikes show this) */}
      <div>
        <label className={labelClass}>
          Distance ({distanceUnit}) - if available
        </label>
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

      {/* Average Resistance (1-20) */}
      <div>
        <label className={labelClass}>Avg Resistance (1-20)</label>
        <input
          type="number"
          min="1"
          max="20"
          value={avgResistance}
          onChange={(e) =>
            setAvgResistance(e.target.value ? Number(e.target.value) : '')
          }
          className={inputClass}
          placeholder="1"
        />
      </div>

      {/* Average Cadence (RPM) */}
      <div>
        <label className={labelClass}>Avg Cadence (RPM)</label>
        <input
          type="number"
          min="0"
          value={avgCadence}
          onChange={(e) =>
            setAvgCadence(e.target.value ? Number(e.target.value) : '')
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
