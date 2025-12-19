import { db } from './db';
import type { Workout } from '../types';

export interface WeightProgressDataPoint {
  date: Date;
  maxWeight: number;
  workoutId: string;
  isPR: boolean;
}

/**
 * Get weight progress data for a specific exercise over a time range.
 * Returns the max weight lifted per workout date.
 */
export async function getWeightProgressData(
  exerciseId: string,
  startDate: Date | null,
  endDate: Date | null
): Promise<WeightProgressDataPoint[]> {
  // Get all sets for this exercise
  const sets = await db.workoutSets
    .where('exerciseId')
    .equals(exerciseId)
    .toArray();

  if (sets.length === 0) {
    return [];
  }

  // Get all workout IDs from the sets
  const workoutIds = [...new Set(sets.map((s) => s.workoutId))];

  // Fetch all related workouts
  const workouts = await db.workouts.bulkGet(workoutIds);
  const workoutMap = new Map<string, Workout>();
  workouts.forEach((w) => {
    if (w) workoutMap.set(w.id, w);
  });

  // Group sets by workout and find max weight per workout
  const workoutMaxWeights = new Map<string, { date: Date; maxWeight: number }>();

  for (const set of sets) {
    const workout = workoutMap.get(set.workoutId);
    if (!workout) continue;

    const workoutDate = new Date(workout.date);

    // Apply date filters
    if (startDate && workoutDate < startDate) continue;
    if (endDate && workoutDate > endDate) continue;

    const existing = workoutMaxWeights.get(set.workoutId);
    if (!existing || set.weight > existing.maxWeight) {
      workoutMaxWeights.set(set.workoutId, {
        date: workoutDate,
        maxWeight: set.weight,
      });
    }
  }

  // Convert to array and sort by date
  const dataPoints: WeightProgressDataPoint[] = [];
  let overallMax = 0;

  // First pass: find overall max
  workoutMaxWeights.forEach((data) => {
    if (data.maxWeight > overallMax) {
      overallMax = data.maxWeight;
    }
  });

  // Second pass: create data points with isPR flag
  workoutMaxWeights.forEach((data, workoutId) => {
    dataPoints.push({
      date: data.date,
      maxWeight: data.maxWeight,
      workoutId,
      isPR: data.maxWeight === overallMax,
    });
  });

  // Sort by date ascending
  dataPoints.sort((a, b) => a.date.getTime() - b.date.getTime());

  // Update isPR to only mark the FIRST occurrence of the max weight
  let prMarked = false;
  for (const point of dataPoints) {
    if (point.maxWeight === overallMax && !prMarked) {
      point.isPR = true;
      prMarked = true;
    } else {
      point.isPR = false;
    }
  }

  // Actually, we want to mark the LAST PR (most recent achievement of max)
  // Reset and mark from the end
  prMarked = false;
  for (let i = dataPoints.length - 1; i >= 0; i--) {
    if (dataPoints[i].maxWeight === overallMax && !prMarked) {
      dataPoints[i].isPR = true;
      prMarked = true;
    } else {
      dataPoints[i].isPR = false;
    }
  }

  return dataPoints;
}

/**
 * Get the personal record (max weight ever lifted) for an exercise
 */
export async function getExercisePR(
  exerciseId: string
): Promise<{ weight: number; date: Date } | null> {
  const data = await getWeightProgressData(exerciseId, null, null);
  if (data.length === 0) return null;

  const prPoint = data.find((d) => d.isPR);
  if (!prPoint) return null;

  return {
    weight: prPoint.maxWeight,
    date: prPoint.date,
  };
}
