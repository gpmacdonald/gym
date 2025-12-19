import { Footprints, Bike } from 'lucide-react';
import type { CardioType } from '../../types';

interface CardioTypeSelectorProps {
  value: CardioType | null;
  onChange: (type: CardioType) => void;
}

export default function CardioTypeSelector({
  value,
  onChange,
}: CardioTypeSelectorProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <button
        type="button"
        onClick={() => onChange('treadmill')}
        className={`flex flex-col items-center justify-center p-6 rounded-xl border-2 transition min-h-[88px] ${
          value === 'treadmill'
            ? 'border-primary bg-primary/10 text-primary'
            : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300'
        }`}
        aria-pressed={value === 'treadmill'}
      >
        <Footprints className="w-8 h-8 mb-2" />
        <span className="font-medium">Treadmill</span>
      </button>

      <button
        type="button"
        onClick={() => onChange('stationary-bike')}
        className={`flex flex-col items-center justify-center p-6 rounded-xl border-2 transition min-h-[88px] ${
          value === 'stationary-bike'
            ? 'border-primary bg-primary/10 text-primary'
            : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300'
        }`}
        aria-pressed={value === 'stationary-bike'}
      >
        <Bike className="w-8 h-8 mb-2" />
        <span className="font-medium">Bike</span>
      </button>
    </div>
  );
}
