import { useState, useEffect, useCallback } from 'react';
import { Scale, Trash2, Edit2, X, Check } from 'lucide-react';
import type { BodyWeightEntry } from '../../types';
import {
  getAllBodyWeightEntries,
  addBodyWeightEntry,
  updateBodyWeightEntry,
  deleteBodyWeightEntry,
} from '../../lib/queries';
import { useSettingsStore } from '../../stores/settingsStore';

// Conversion constants
const KG_TO_LBS = 2.20462;
const LBS_TO_KG = 1 / KG_TO_LBS;

interface BodyWeightLoggerProps {
  onComplete?: () => void;
}

export default function BodyWeightLogger({ onComplete }: BodyWeightLoggerProps) {
  const { weightUnit } = useSettingsStore();
  const [weight, setWeight] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [entries, setEntries] = useState<BodyWeightEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editWeight, setEditWeight] = useState<string>('');
  const [editNotes, setEditNotes] = useState<string>('');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Load entries
  const loadEntries = useCallback(async () => {
    try {
      const data = await getAllBodyWeightEntries();
      setEntries(data.slice(0, 10)); // Show last 10 entries
    } catch (error) {
      console.error('Failed to load body weight entries:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadEntries();
  }, [loadEntries]);

  // Convert weight for display (kg stored, may display in lbs)
  const displayWeight = (kgValue: number): string => {
    if (weightUnit === 'lbs') {
      return (kgValue * KG_TO_LBS).toFixed(1);
    }
    return kgValue.toFixed(1);
  };

  // Convert input weight to kg for storage
  const toKg = (value: number): number => {
    if (weightUnit === 'lbs') {
      return value * LBS_TO_KG;
    }
    return value;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const weightValue = parseFloat(weight);
    if (isNaN(weightValue) || weightValue <= 0) {
      setMessage({ type: 'error', text: 'Please enter a valid weight' });
      return;
    }

    setIsSaving(true);
    setMessage(null);

    try {
      await addBodyWeightEntry({
        date: new Date(),
        weight: toKg(weightValue),
        notes: notes.trim() || undefined,
      });

      setWeight('');
      setNotes('');
      setMessage({ type: 'success', text: 'Weight logged successfully!' });
      await loadEntries();
      onComplete?.();
    } catch (error) {
      console.error('Failed to save body weight:', error);
      setMessage({ type: 'error', text: 'Failed to save weight' });
    } finally {
      setIsSaving(false);
    }
  };

  // Handle edit
  const startEdit = (entry: BodyWeightEntry) => {
    setEditingId(entry.id);
    setEditWeight(displayWeight(entry.weight));
    setEditNotes(entry.notes || '');
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditWeight('');
    setEditNotes('');
  };

  const saveEdit = async (id: string) => {
    const weightValue = parseFloat(editWeight);
    if (isNaN(weightValue) || weightValue <= 0) {
      return;
    }

    try {
      await updateBodyWeightEntry(id, {
        weight: toKg(weightValue),
        notes: editNotes.trim() || undefined,
      });
      setEditingId(null);
      await loadEntries();
    } catch (error) {
      console.error('Failed to update entry:', error);
    }
  };

  // Handle delete
  const handleDelete = async (id: string) => {
    try {
      await deleteBodyWeightEntry(id);
      await loadEntries();
    } catch (error) {
      console.error('Failed to delete entry:', error);
    }
  };

  // Format date for display
  const formatDate = (date: Date): string => {
    const d = new Date(date);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (d.toDateString() === today.toDateString()) {
      return 'Today';
    }
    if (d.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    }
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="space-y-6">
      {/* Input Form */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Scale className="w-5 h-5 text-purple-500" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Log Weight
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="weight"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Weight ({weightUnit})
            </label>
            <input
              type="number"
              id="weight"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              step="0.1"
              min="0"
              placeholder={weightUnit === 'kg' ? '70.0' : '154.0'}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              aria-label="Weight"
            />
          </div>

          <div>
            <label
              htmlFor="notes"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Notes (optional)
            </label>
            <input
              type="text"
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g., After breakfast"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          {message && (
            <div
              className={`text-sm ${
                message.type === 'success'
                  ? 'text-green-600 dark:text-green-400'
                  : 'text-red-600 dark:text-red-400'
              }`}
            >
              {message.text}
            </div>
          )}

          <button
            type="submit"
            disabled={isSaving || !weight}
            className="w-full py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white font-medium rounded-lg transition-colors"
          >
            {isSaving ? 'Saving...' : 'Log Weight'}
          </button>
        </form>
      </div>

      {/* Recent Entries */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">
          Recent Entries
        </h3>

        {isLoading ? (
          <div className="text-center py-4 text-gray-500 dark:text-gray-400">
            Loading...
          </div>
        ) : entries.length === 0 ? (
          <div className="text-center py-4 text-gray-500 dark:text-gray-400">
            No entries yet. Log your first weight above!
          </div>
        ) : (
          <ul className="space-y-2">
            {entries.map((entry) => (
              <li
                key={entry.id}
                className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700 last:border-0"
              >
                {editingId === entry.id ? (
                  <div className="flex-1 flex items-center gap-2">
                    <input
                      type="number"
                      value={editWeight}
                      onChange={(e) => setEditWeight(e.target.value)}
                      step="0.1"
                      className="w-20 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      aria-label="Edit weight"
                    />
                    <input
                      type="text"
                      value={editNotes}
                      onChange={(e) => setEditNotes(e.target.value)}
                      placeholder="Notes"
                      className="flex-1 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      aria-label="Edit notes"
                    />
                    <button
                      onClick={() => saveEdit(entry.id)}
                      className="p-1 text-green-600 hover:text-green-700"
                      aria-label="Save changes"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="p-1 text-gray-500 hover:text-gray-700"
                      aria-label="Cancel edit"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="flex-1">
                      <div className="flex items-baseline gap-2">
                        <span className="font-medium text-gray-900 dark:text-white">
                          {displayWeight(entry.weight)} {weightUnit}
                        </span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {formatDate(entry.date)}
                        </span>
                      </div>
                      {entry.notes && (
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                          {entry.notes}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => startEdit(entry)}
                        className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                        aria-label="Edit entry"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(entry.id)}
                        className="p-1.5 text-gray-400 hover:text-red-600"
                        aria-label="Delete entry"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
