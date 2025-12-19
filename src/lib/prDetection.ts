import { db } from './db';
import type { Exercise, Workout, WorkoutSet } from '../types';

export interface PR {
  exerciseId: string;
  exerciseName: string;
  weight: number;
  reps: number;
  date: Date;
  workoutId: string;
}

/**
 * Get the personal record (max weight) for a specific exercise.
 * Returns the set with the highest weight ever recorded.
 */
export async function getExercisePR(exerciseId: string): Promise<PR | null> {
  // Get all sets for this exercise
  const sets = await db.workoutSets
    .where('exerciseId')
    .equals(exerciseId)
    .toArray();

  if (sets.length === 0) {
    return null;
  }

  // Find the set with max weight
  let maxSet: WorkoutSet | null = null;
  for (const set of sets) {
    if (!maxSet || set.weight > maxSet.weight) {
      maxSet = set;
    }
  }

  if (!maxSet) {
    return null;
  }

  // Get the exercise name
  const exercise = await db.exercises.get(exerciseId);
  if (!exercise) {
    return null;
  }

  // Get the workout date
  const workout = await db.workouts.get(maxSet.workoutId);
  if (!workout) {
    return null;
  }

  return {
    exerciseId,
    exerciseName: exercise.name,
    weight: maxSet.weight,
    reps: maxSet.reps,
    date: new Date(workout.date),
    workoutId: maxSet.workoutId,
  };
}

/**
 * Get all personal records across all exercises.
 * Returns one PR per exercise that has workout data.
 */
export async function getAllPRs(): Promise<PR[]> {
  // Get all exercises that have been used in workouts
  const allSets = await db.workoutSets.toArray();

  if (allSets.length === 0) {
    return [];
  }

  // Group sets by exercise and find max weight for each
  const exerciseMaxSets = new Map<string, WorkoutSet>();

  for (const set of allSets) {
    const existing = exerciseMaxSets.get(set.exerciseId);
    if (!existing || set.weight > existing.weight) {
      exerciseMaxSets.set(set.exerciseId, set);
    }
  }

  // Get all needed exercises and workouts
  const exerciseIds = [...exerciseMaxSets.keys()];
  const workoutIds = [...new Set([...exerciseMaxSets.values()].map((s) => s.workoutId))];

  const exercises = await db.exercises.bulkGet(exerciseIds);
  const workouts = await db.workouts.bulkGet(workoutIds);

  const exerciseMap = new Map<string, Exercise>();
  exercises.forEach((e) => {
    if (e) exerciseMap.set(e.id, e);
  });

  const workoutMap = new Map<string, Workout>();
  workouts.forEach((w) => {
    if (w) workoutMap.set(w.id, w);
  });

  // Build PR list
  const prs: PR[] = [];

  exerciseMaxSets.forEach((set, exerciseId) => {
    const exercise = exerciseMap.get(exerciseId);
    const workout = workoutMap.get(set.workoutId);

    if (exercise && workout) {
      prs.push({
        exerciseId,
        exerciseName: exercise.name,
        weight: set.weight,
        reps: set.reps,
        date: new Date(workout.date),
        workoutId: set.workoutId,
      });
    }
  });

  // Sort by weight descending (heaviest PRs first)
  prs.sort((a, b) => b.weight - a.weight);

  return prs;
}

/**
 * Check if a given weight would be a PR for an exercise.
 * Returns true if the weight is greater than the current max.
 */
export async function isPR(exerciseId: string, weight: number): Promise<boolean> {
  const currentPR = await getExercisePR(exerciseId);

  if (!currentPR) {
    // No existing record, any weight would be a PR
    return true;
  }

  return weight > currentPR.weight;
}

/**
 * Get PRs for exercises in a specific muscle group.
 */
export async function getPRsByMuscleGroup(muscleGroup: string): Promise<PR[]> {
  const allPRs = await getAllPRs();

  // Get all exercises to check muscle groups
  const exerciseIds = allPRs.map((pr) => pr.exerciseId);
  const exercises = await db.exercises.bulkGet(exerciseIds);

  const exerciseMap = new Map<string, Exercise>();
  exercises.forEach((e) => {
    if (e) exerciseMap.set(e.id, e);
  });

  return allPRs.filter((pr) => {
    const exercise = exerciseMap.get(pr.exerciseId);
    return exercise?.muscleGroup === muscleGroup;
  });
}
