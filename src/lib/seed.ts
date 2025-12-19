import { db } from './db';
import type { Exercise, MuscleGroup, EquipmentType } from '../types';

// Default exercises from PRD (46 total) with equipment types
const DEFAULT_EXERCISES: Array<{
  name: string;
  muscleGroup: MuscleGroup;
  equipmentType: EquipmentType;
}> = [
  // Chest (7)
  { name: 'Barbell Bench Press', muscleGroup: 'chest', equipmentType: 'barbell' },
  { name: 'Dumbbell Bench Press', muscleGroup: 'chest', equipmentType: 'dumbbell' },
  { name: 'Incline Barbell Bench Press', muscleGroup: 'chest', equipmentType: 'barbell' },
  { name: 'Incline Dumbbell Bench Press', muscleGroup: 'chest', equipmentType: 'dumbbell' },
  { name: 'Dumbbell Flyes', muscleGroup: 'chest', equipmentType: 'dumbbell' },
  { name: 'Cable Flyes', muscleGroup: 'chest', equipmentType: 'cable' },
  { name: 'Push-ups', muscleGroup: 'chest', equipmentType: 'bodyweight' },

  // Back (8)
  { name: 'Conventional Deadlift', muscleGroup: 'back', equipmentType: 'barbell' },
  { name: 'Barbell Row', muscleGroup: 'back', equipmentType: 'barbell' },
  { name: 'Dumbbell Row', muscleGroup: 'back', equipmentType: 'dumbbell' },
  { name: 'Pull-ups', muscleGroup: 'back', equipmentType: 'bodyweight' },
  { name: 'Lat Pulldown', muscleGroup: 'back', equipmentType: 'cable' },
  { name: 'Seated Cable Row', muscleGroup: 'back', equipmentType: 'cable' },
  { name: 'T-Bar Row', muscleGroup: 'back', equipmentType: 'barbell' },
  { name: 'Face Pulls', muscleGroup: 'back', equipmentType: 'cable' },

  // Legs (10)
  { name: 'Barbell Back Squat', muscleGroup: 'legs', equipmentType: 'barbell' },
  { name: 'Barbell Front Squat', muscleGroup: 'legs', equipmentType: 'barbell' },
  { name: 'Romanian Deadlift', muscleGroup: 'legs', equipmentType: 'barbell' },
  { name: 'Leg Press', muscleGroup: 'legs', equipmentType: 'machine' },
  { name: 'Bulgarian Split Squat', muscleGroup: 'legs', equipmentType: 'dumbbell' },
  { name: 'Lunges', muscleGroup: 'legs', equipmentType: 'dumbbell' },
  { name: 'Leg Extension', muscleGroup: 'legs', equipmentType: 'machine' },
  { name: 'Leg Curl', muscleGroup: 'legs', equipmentType: 'machine' },
  { name: 'Calf Raise', muscleGroup: 'legs', equipmentType: 'machine' },
  { name: 'Hip Thrust', muscleGroup: 'legs', equipmentType: 'barbell' },

  // Shoulders (7)
  { name: 'Overhead Press', muscleGroup: 'shoulders', equipmentType: 'barbell' },
  { name: 'Dumbbell Shoulder Press', muscleGroup: 'shoulders', equipmentType: 'dumbbell' },
  { name: 'Lateral Raises', muscleGroup: 'shoulders', equipmentType: 'dumbbell' },
  { name: 'Front Raises', muscleGroup: 'shoulders', equipmentType: 'dumbbell' },
  { name: 'Rear Delt Flyes', muscleGroup: 'shoulders', equipmentType: 'dumbbell' },
  { name: 'Upright Row', muscleGroup: 'shoulders', equipmentType: 'barbell' },
  { name: 'Arnold Press', muscleGroup: 'shoulders', equipmentType: 'dumbbell' },

  // Arms (8)
  { name: 'Barbell Curl', muscleGroup: 'arms', equipmentType: 'barbell' },
  { name: 'Dumbbell Curl', muscleGroup: 'arms', equipmentType: 'dumbbell' },
  { name: 'Hammer Curl', muscleGroup: 'arms', equipmentType: 'dumbbell' },
  { name: 'Preacher Curl', muscleGroup: 'arms', equipmentType: 'dumbbell' },
  { name: 'Tricep Pushdown', muscleGroup: 'arms', equipmentType: 'cable' },
  { name: 'Overhead Tricep Extension', muscleGroup: 'arms', equipmentType: 'dumbbell' },
  { name: 'Dips', muscleGroup: 'arms', equipmentType: 'bodyweight' },
  { name: 'Close-Grip Bench Press', muscleGroup: 'arms', equipmentType: 'barbell' },

  // Core (6)
  { name: 'Plank', muscleGroup: 'core', equipmentType: 'bodyweight' },
  { name: 'Side Plank', muscleGroup: 'core', equipmentType: 'bodyweight' },
  { name: 'Crunches', muscleGroup: 'core', equipmentType: 'bodyweight' },
  { name: 'Russian Twists', muscleGroup: 'core', equipmentType: 'bodyweight' },
  { name: 'Hanging Leg Raises', muscleGroup: 'core', equipmentType: 'bodyweight' },
  { name: 'Cable Crunches', muscleGroup: 'core', equipmentType: 'cable' },
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
    equipmentType: ex.equipmentType,
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
