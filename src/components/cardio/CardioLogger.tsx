import { useState } from 'react';
import type { CardioType } from '../../types';
import { addCardioSession } from '../../lib/queries';
import CardioTypeSelector from './CardioTypeSelector';
import TreadmillForm from './TreadmillForm';
import BikeForm from './BikeForm';
import type { TreadmillData } from './TreadmillForm';
import type { BikeData } from './BikeForm';

interface CardioLoggerProps {
  onComplete: () => void;
  onCancel: () => void;
}

export default function CardioLogger({ onComplete, onCancel }: CardioLoggerProps) {
  const [cardioType, setCardioType] = useState<CardioType | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async (data: TreadmillData | BikeData) => {
    if (!cardioType) return;

    setIsSaving(true);
    try {
      await addCardioSession({
        type: cardioType,
        date: new Date(),
        ...data,
      });
      onComplete();
    } catch (error) {
      console.error('Failed to save cardio session:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (cardioType) {
      // Go back to type selection
      setCardioType(null);
    } else {
      // Exit cardio logger entirely
      onCancel();
    }
  };

  // Step 1: Select cardio type
  if (!cardioType) {
    return (
      <div>
        <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
          Select Cardio Type
        </h2>
        <CardioTypeSelector value={cardioType} onChange={setCardioType} />
        <button
          type="button"
          onClick={onCancel}
          className="w-full mt-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300"
        >
          Cancel
        </button>
      </div>
    );
  }

  // Step 2: Fill in form based on type
  if (isSaving) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-500 dark:text-gray-400">Saving...</div>
      </div>
    );
  }

  return cardioType === 'treadmill' ? (
    <TreadmillForm onSave={handleSave} onCancel={handleCancel} />
  ) : (
    <BikeForm onSave={handleSave} onCancel={handleCancel} />
  );
}
