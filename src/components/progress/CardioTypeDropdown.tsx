import { useState } from 'react';
import { ChevronDown, Footprints, Bike } from 'lucide-react';
import type { CardioType } from '../../types';

export type CardioFilter = CardioType | 'all';

interface CardioTypeDropdownProps {
  value: CardioFilter;
  onChange: (type: CardioFilter) => void;
}

const OPTIONS: { value: CardioFilter; label: string; icon?: typeof Footprints }[] = [
  { value: 'all', label: 'All Cardio' },
  { value: 'treadmill', label: 'Treadmill', icon: Footprints },
  { value: 'stationary-bike', label: 'Stationary Bike', icon: Bike },
];

export default function CardioTypeDropdown({
  value,
  onChange,
}: CardioTypeDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  const selectedOption = OPTIONS.find((o) => o.value === value) || OPTIONS[0];
  const Icon = selectedOption.icon;

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between gap-2 px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-left"
      >
        <span className="flex items-center gap-2 text-gray-900 dark:text-white">
          {Icon && <Icon className="w-4 h-4" />}
          {selectedOption.label}
        </span>
        <ChevronDown
          className={`w-5 h-5 text-gray-400 transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />

          {/* Dropdown */}
          <div className="absolute z-20 mt-1 w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg overflow-hidden">
            {OPTIONS.map((option) => {
              const OptionIcon = option.icon;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                  }}
                  className={`w-full px-4 py-2.5 text-left flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-700 ${
                    value === option.value
                      ? 'bg-primary/10 text-primary'
                      : 'text-gray-900 dark:text-white'
                  }`}
                >
                  {OptionIcon && <OptionIcon className="w-4 h-4" />}
                  {option.label}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
