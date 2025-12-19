import { db } from './db';
import type { Exercise, MuscleGroup } from '../types';

// Default exercises from PRD (46 total)
const DEFAULT_EXERCISES: Array<{ name: string; muscleGroup: MuscleGroup }> = [
  // Chest (7)
  { name: 'Barbell Bench Press', muscleGroup: 'chest' },
  { name: 'Dumbbell Bench Press', muscleGroup: 'chest' },
  { name: 'Incline Barbell Bench Press', muscleGroup: 'chest' },
  { name: 'Incline Dumbbell Bench Press', muscleGroup: 'chest' },
  { name: 'Dumbbell Flyes', muscleGroup: 'chest' },
  { name: 'Cable Flyes', muscleGroup: 'chest' },
  { name: 'Push-ups', muscleGroup: 'chest' },

  // Back (8)
  { name: 'Conventional Deadlift', muscleGroup: 'back' },
  { name: 'Barbell Row', muscleGroup: 'back' },
  { name: 'Dumbbell Row', muscleGroup: 'back' },
  { name: 'Pull-ups', muscleGroup: 'back' },
  { name: 'Lat Pulldown', muscleGroup: 'back' },
  { name: 'Seated Cable Row', muscleGroup: 'back' },
  { name: 'T-Bar Row', muscleGroup: 'back' },
  { name: 'Face Pulls', muscleGroup: 'back' },

  // Legs (10)
  { name: 'Barbell Back Squat', muscleGroup: 'legs' },
  { name: 'Barbell Front Squat', muscleGroup: 'legs' },
  { name: 'Romanian Deadlift', muscleGroup: 'legs' },
  { name: 'Leg Press', muscleGroup: 'legs' },
  { name: 'Bulgarian Split Squat', muscleGroup: 'legs' },
  { name: 'Lunges', muscleGroup: 'legs' },
  { name: 'Leg Extension', muscleGroup: 'legs' },
  { name: 'Leg Curl', muscleGroup: 'legs' },
  { name: 'Calf Raise', muscleGroup: 'legs' },
  { name: 'Hip Thrust', muscleGroup: 'legs' },

  // Shoulders (7)
  { name: 'Overhead Press', muscleGroup: 'shoulders' },
  { name: 'Dumbbell Shoulder Press', muscleGroup: 'shoulders' },
  { name: 'Lateral Raises', muscleGroup: 'shoulders' },
  { name: 'Front Raises', muscleGroup: 'shoulders' },
  { name: 'Rear Delt Flyes', muscleGroup: 'shoulders' },
  { name: 'Upright Row', muscleGroup: 'shoulders' },
  { name: 'Arnold Press', muscleGroup: 'shoulders' },

  // Arms (8)
  { name: 'Barbell Curl', muscleGroup: 'arms' },
  { name: 'Dumbbell Curl', muscleGroup: 'arms' },
  { name: 'Hammer Curl', muscleGroup: 'arms' },
  { name: 'Preacher Curl', muscleGroup: 'arms' },
  { name: 'Tricep Pushdown', muscleGroup: 'arms' },
  { name: 'Overhead Tricep Extension', muscleGroup: 'arms' },
  { name: 'Dips', muscleGroup: 'arms' },
  { name: 'Close-Grip Bench Press', muscleGroup: 'arms' },

  // Core (6)
  { name: 'Plank', muscleGroup: 'core' },
  { name: 'Side Plank', muscleGroup: 'core' },
  { name: 'Crunches', muscleGroup: 'core' },
  { name: 'Russian Twists', muscleGroup: 'core' },
  { name: 'Hanging Leg Raises', muscleGroup: 'core' },
  { name: 'Cable Crunches', muscleGroup: 'core' },
];

/**
 * Seed the database with default exercises.
 * Only adds exercises if the database is empty (no non-custom exercises).
 * @returns The number of exercises seeded (0 if already seeded)
 */
export async function seedExercises(): Promise<number> {
  // Check if already seeded by counting non-custom exercises
  const existingCount = await db.exercises
    .filter((ex) => ex.isCustom === false)
    .count();

  if (existingCount > 0) {
    console.log('Exercises already seeded, skipping...');
    return 0;
  }

  const now = new Date();
  const exercises: Exercise[] = DEFAULT_EXERCISES.map((ex) => ({
    id: crypto.randomUUID(),
    name: ex.name,
    muscleGroup: ex.muscleGroup,
    isCustom: false,
    createdAt: now,
  }));

  await db.exercises.bulkAdd(exercises);
  console.log(`Seeded ${exercises.length} exercises`);
  return exercises.length;
}

/**
 * Check if the exercise library has been seeded.
 */
export async function isSeeded(): Promise<boolean> {
  const count = await db.exercises
    .filter((ex) => ex.isCustom === false)
    .count();
  return count >= DEFAULT_EXERCISES.length;
}

/**
 * Get the count of default exercises.
 */
export function getDefaultExerciseCount(): number {
  return DEFAULT_EXERCISES.length;
}

/**
 * Clear all exercises and reseed (for testing/reset purposes).
 * WARNING: This will delete all custom exercises too!
 */
export async function reseedExercises(): Promise<number> {
  await db.exercises.clear();
  return seedExercises();
}
