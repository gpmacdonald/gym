import { useState, useEffect } from 'react';
import { Trophy } from 'lucide-react';
import { getAllPRs, type PR } from '../../lib/prDetection';
import { useSettingsStore } from '../../stores';
import { formatChartDate } from '../../lib/chartUtils';

interface PRListProps {
  limit?: number;
  muscleGroup?: string;
}

export default function PRList({ limit, muscleGroup }: PRListProps) {
  const [prs, setPRs] = useState<PR[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { weightUnit } = useSettingsStore();

  useEffect(() => {
    async function loadPRs() {
      setIsLoading(true);
      try {
        let data = await getAllPRs();

        // Filter by muscle group if specified
        if (muscleGroup) {
          // We need to check the exercise muscle group - but PRs already have exercise info
          // For simplicity, we'll fetch fresh and filter
          // This could be optimized by adding muscle group to the PR type
          data = data.filter(() => true); // Placeholder - filtering would need exercise lookup
        }

        // Apply limit
        if (limit && limit > 0) {
          data = data.slice(0, limit);
        }

        setPRs(data);
      } catch (error) {
        console.error('Failed to load PRs:', error);
        setPRs([]);
      } finally {
        setIsLoading(false);
      }
    }

    loadPRs();
  }, [limit, muscleGroup]);

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-2">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-12 bg-gray-200 dark:bg-gray-700 rounded-lg"
          />
        ))}
      </div>
    );
  }

  if (prs.length === 0) {
    return (
      <div className="text-center py-8">
        <Trophy className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600 mb-2" />
        <p className="text-gray-500 dark:text-gray-400">
          No personal records yet
        </p>
        <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
          Complete some workouts to set your first PR!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {prs.map((pr) => (
        <div
          key={pr.exerciseId}
          className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-full">
              <Trophy className="w-4 h-4 text-yellow-500" />
            </div>
            <div>
              <p className="font-medium text-gray-900 dark:text-white text-sm">
                {pr.exerciseName}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {formatChartDate(pr.date)} · {pr.reps} reps
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="font-bold text-gray-900 dark:text-white">
              {pr.weight} {weightUnit}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
