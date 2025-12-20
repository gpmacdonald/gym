import { useState, useEffect, useCallback } from 'react';
import { MapPin, Clock, Activity, Timer } from 'lucide-react';
import { StatsCard } from './';
import { useSettingsStore } from '../../stores';
import { getCardioStats } from '../../lib/statsQueries';
import type { CardioType } from '../../types';

interface CardioSummaryStatsProps {
  cardioType: CardioType | null;
  startDate: Date | null;
  endDate: Date | null;
}

/**
 * Format seconds to a readable duration string
 */
function formatDuration(seconds: number): string {
  if (seconds === 0) return '0m';

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (hours > 0) {
    return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
  }
  return `${minutes}m`;
}

export default function CardioSummaryStats({
  cardioType,
  startDate,
  endDate,
}: CardioSummaryStatsProps) {
  const [stats, setStats] = useState({
    totalDistance: 0,
    totalTime: 0,
    totalSessions: 0,
    avgDuration: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const { distanceUnit } = useSettingsStore();

  const loadStats = useCallback(async () => {
    setIsLoading(true);
    try {
      const cardioStats = await getCardioStats(cardioType, startDate, endDate);
      setStats(cardioStats);
    } catch (error) {
      console.error('Failed to load cardio stats:', error);
    } finally {
      setIsLoading(false);
    }
  }, [cardioType, startDate, endDate]);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  // Convert distance based on unit preference
  const displayDistance =
    distanceUnit === 'km' ? stats.totalDistance * 1.60934 : stats.totalDistance;
  const distanceUnitLabel = distanceUnit === 'km' ? 'km' : 'mi';

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-3">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 animate-pulse"
          >
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20 mb-2" />
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-16" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3">
      <StatsCard
        icon={MapPin}
        label="Total Distance"
        value={displayDistance.toFixed(1)}
        unit={distanceUnitLabel}
        iconColor="text-blue-500"
      />
      <StatsCard
        icon={Clock}
        label="Total Time"
        value={formatDuration(stats.totalTime)}
        iconColor="text-emerald-500"
      />
      <StatsCard
        icon={Activity}
        label="Sessions"
        value={stats.totalSessions}
        iconColor="text-purple-500"
      />
      <StatsCard
        icon={Timer}
        label="Avg Duration"
        value={formatDuration(stats.avgDuration)}
        iconColor="text-orange-500"
      />
    </div>
  );
}
