import { useState } from 'react';
import { ChevronDown, ChevronUp, Footprints, Bike } from 'lucide-react';
import type { CardioSession } from '../../types';
import { useSettingsStore } from '../../stores';
import { formatDuration, formatDate } from '../../lib/utils';

interface CardioCardProps {
  session: CardioSession;
}

export default function CardioCard({ session }: CardioCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { distanceUnit } = useSettingsStore();

  const Icon = session.type === 'treadmill' ? Footprints : Bike;
  const typeName = session.type === 'treadmill' ? 'Treadmill' : 'Stationary Bike';

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-4 flex items-center justify-between"
        aria-expanded={isExpanded}
        aria-label={`${typeName} on ${formatDate(session.date)}, ${formatDuration(session.duration)}`}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
            <Icon className="w-5 h-5 text-green-600 dark:text-green-400" />
          </div>
          <div className="text-left">
            <p className="font-semibold text-gray-900 dark:text-white">
              {typeName}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {formatDate(session.date)} • {formatDuration(session.duration)}
            </p>
          </div>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-gray-400" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-400" />
        )}
      </button>

      {isExpanded && (
        <div className="px-4 pb-4 border-t border-gray-100 dark:border-gray-700">
          <div className="grid grid-cols-2 gap-4 mt-3">
            {session.distance !== undefined && (
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Distance
                </p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {session.distance} {distanceUnit}
                </p>
              </div>
            )}
            {session.avgSpeed !== undefined && (
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Avg Speed
                </p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {session.avgSpeed} {distanceUnit === 'miles' ? 'mph' : 'km/h'}
                </p>
              </div>
            )}
            {session.avgIncline !== undefined && (
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Avg Incline
                </p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {session.avgIncline}%
                </p>
              </div>
            )}
            {session.maxIncline !== undefined && (
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Max Incline
                </p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {session.maxIncline}%
                </p>
              </div>
            )}
            {session.avgResistance !== undefined && (
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Avg Resistance
                </p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {session.avgResistance}
                </p>
              </div>
            )}
            {session.avgCadence !== undefined && (
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Avg Cadence
                </p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {session.avgCadence} RPM
                </p>
              </div>
            )}
            {session.calories !== undefined && (
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Calories
                </p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {session.calories}
                </p>
              </div>
            )}
          </div>
          {session.notes && (
            <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
              <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                {session.notes}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
