import { db } from './db';
import type { MuscleGroup } from '../types';

export interface Stats {
  totalWorkouts: number;
  totalCardioSessions: number;
  totalVolume: number; // all-time volume lifted (reps × weight)
  totalCardioTime: number; // all-time cardio duration in seconds
  totalCardioDistance: number; // all-time cardio distance in miles
  workoutsPerWeek: number; // average workouts per week
  cardioPerWeek: number; // average cardio sessions per week
  mostTrainedMuscle: MuscleGroup | null;
}

export interface CardioStats {
  totalDistance: number; // in miles
  totalTime: number; // in seconds
  totalSessions: number;
  avgDuration: number; // in seconds
}

/**
 * Get all-time statistics for the user
 */
export async function getStats(): Promise<Stats> {
  // Get all workouts and cardio sessions
  const workouts = await db.workouts.toArray();
  const cardioSessions = await db.cardioSessions.toArray();
  const sets = await db.workoutSets.toArray();
  const exercises = await db.exercises.toArray();

  // Total counts
  const totalWorkouts = workouts.length;
  const totalCardioSessions = cardioSessions.length;

  // Calculate total volume (reps × weight for all sets)
  const totalVolume = sets.reduce((sum, set) => sum + set.reps * set.weight, 0);

  // Calculate total cardio time and distance
  const totalCardioTime = cardioSessions.reduce(
    (sum, session) => sum + session.duration,
    0
  );
  const totalCardioDistance = cardioSessions.reduce(
    (sum, session) => sum + (session.distance || 0),
    0
  );

  // Calculate workouts per week
  let workoutsPerWeek = 0;
  let cardioPerWeek = 0;

  if (workouts.length > 0) {
    const workoutDates = workouts.map((w) => new Date(w.date).getTime());
    const firstWorkout = Math.min(...workoutDates);
    const lastWorkout = Math.max(...workoutDates);
    const weeksSpan = Math.max(
      1,
      (lastWorkout - firstWorkout) / (7 * 24 * 60 * 60 * 1000)
    );
    workoutsPerWeek = totalWorkouts / weeksSpan;
  }

  if (cardioSessions.length > 0) {
    const cardioDates = cardioSessions.map((c) => new Date(c.date).getTime());
    const firstCardio = Math.min(...cardioDates);
    const lastCardio = Math.max(...cardioDates);
    const weeksSpan = Math.max(
      1,
      (lastCardio - firstCardio) / (7 * 24 * 60 * 60 * 1000)
    );
    cardioPerWeek = totalCardioSessions / weeksSpan;
  }

  // Find most trained muscle group
  let mostTrainedMuscle: MuscleGroup | null = null;

  if (sets.length > 0) {
    // Count sets per exercise
    const exerciseSetCounts = new Map<string, number>();
    for (const set of sets) {
      const count = exerciseSetCounts.get(set.exerciseId) || 0;
      exerciseSetCounts.set(set.exerciseId, count + 1);
    }

    // Map exercise to muscle group and count
    const muscleGroupCounts = new Map<MuscleGroup, number>();
    const exerciseMap = new Map(exercises.map((e) => [e.id, e]));

    for (const [exerciseId, setCount] of exerciseSetCounts) {
      const exercise = exerciseMap.get(exerciseId);
      if (exercise) {
        const count = muscleGroupCounts.get(exercise.muscleGroup) || 0;
        muscleGroupCounts.set(exercise.muscleGroup, count + setCount);
      }
    }

    // Find the muscle group with most sets
    let maxCount = 0;
    for (const [muscleGroup, count] of muscleGroupCounts) {
      if (count > maxCount) {
        maxCount = count;
        mostTrainedMuscle = muscleGroup;
      }
    }
  }

  return {
    totalWorkouts,
    totalCardioSessions,
    totalVolume,
    totalCardioTime,
    totalCardioDistance,
    workoutsPerWeek,
    cardioPerWeek,
    mostTrainedMuscle,
  };
}

/**
 * Get cardio-specific statistics with optional type and date filters
 */
export async function getCardioStats(
  type: 'treadmill' | 'stationary-bike' | null,
  startDate: Date | null,
  endDate: Date | null
): Promise<CardioStats> {
  let sessions = await db.cardioSessions.toArray();

  // Filter by type
  if (type) {
    sessions = sessions.filter((s) => s.type === type);
  }

  // Filter by date range
  if (startDate || endDate) {
    sessions = sessions.filter((s) => {
      const sessionDate = new Date(s.date);
      if (startDate && sessionDate < startDate) return false;
      if (endDate && sessionDate > endDate) return false;
      return true;
    });
  }

  const totalSessions = sessions.length;
  const totalTime = sessions.reduce((sum, s) => sum + s.duration, 0);
  const totalDistance = sessions.reduce((sum, s) => sum + (s.distance || 0), 0);
  const avgDuration = totalSessions > 0 ? totalTime / totalSessions : 0;

  return {
    totalDistance,
    totalTime,
    totalSessions,
    avgDuration,
  };
}
