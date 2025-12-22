import { db } from './db';
import type {
  Exercise,
  Workout,
  WorkoutSet,
  CardioSession,
  MuscleGroup,
  CardioType,
  CreateExerciseInput,
  CreateWorkoutInput,
  CreateWorkoutSetInput,
  CreateCardioSessionInput,
} from '../types';

// Generate a unique ID with fallback for non-secure contexts (iOS Safari over HTTP)
export function generateId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    try {
      return crypto.randomUUID();
    } catch {
      // Falls through to fallback for non-secure contexts
    }
  }
  // Fallback UUID v4 generator
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// ============================================================================
// Exercise Queries
// ============================================================================

/** Get all exercises, sorted by name */
export async function getAllExercises(): Promise<Exercise[]> {
  return db.exercises.orderBy('name').toArray();
}

/** Get exercise by ID */
export async function getExerciseById(
  id: string
): Promise<Exercise | undefined> {
  return db.exercises.get(id);
}

/** Get exercises by muscle group */
export async function getExercisesByMuscleGroup(
  group: MuscleGroup
): Promise<Exercise[]> {
  return db.exercises.where('muscleGroup').equals(group).sortBy('name');
}

/** Search exercises by name (case-insensitive partial match) */
export async function searchExercises(query: string): Promise<Exercise[]> {
  const lowerQuery = query.toLowerCase();
  return db.exercises
    .filter((exercise) => exercise.name.toLowerCase().includes(lowerQuery))
    .toArray();
}

/** Add a new exercise */
export async function addExercise(input: CreateExerciseInput): Promise<string> {
  const id = generateId();
  const exercise: Exercise = {
    ...input,
    id,
    createdAt: new Date(),
  };
  await db.exercises.add(exercise);
  return id;
}

/** Update an exercise */
export async function updateExercise(
  id: string,
  data: Partial<Omit<Exercise, 'id' | 'createdAt'>>
): Promise<void> {
  const existing = await db.exercises.get(id);
  if (!existing) {
    throw new Error(`Exercise with id ${id} not found`);
  }
  await db.exercises.update(id, data);
}

/** Delete an exercise */
export async function deleteExercise(id: string): Promise<void> {
  await db.exercises.delete(id);
}

// ============================================================================
// Workout Queries
// ============================================================================

/** Get all workouts, sorted by date (newest first) */
export async function getAllWorkouts(): Promise<Workout[]> {
  return db.workouts.orderBy('date').reverse().toArray();
}

/** Get workout by ID */
export async function getWorkoutById(id: string): Promise<Workout | undefined> {
  return db.workouts.get(id);
}

/** Get workouts by date range (inclusive) */
export async function getWorkoutsByDateRange(
  start: Date,
  end: Date
): Promise<Workout[]> {
  return db.workouts
    .where('date')
    .between(start, end, true, true)
    .reverse()
    .toArray();
}

/** Get workouts for a specific date */
export async function getWorkoutsByDate(date: Date): Promise<Workout[]> {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);
  return getWorkoutsByDateRange(startOfDay, endOfDay);
}

/** Add a new workout */
export async function addWorkout(input: CreateWorkoutInput): Promise<string> {
  const id = generateId();
  const now = new Date();
  const workout: Workout = {
    ...input,
    id,
    createdAt: now,
    updatedAt: now,
  };
  await db.workouts.add(workout);
  return id;
}

/** Update a workout */
export async function updateWorkout(
  id: string,
  data: Partial<Omit<Workout, 'id' | 'createdAt'>>
): Promise<void> {
  const existing = await db.workouts.get(id);
  if (!existing) {
    throw new Error(`Workout with id ${id} not found`);
  }
  await db.workouts.update(id, {
    ...data,
    updatedAt: new Date(),
  });
}

/** Delete a workout and all its associated sets */
export async function deleteWorkout(id: string): Promise<void> {
  await db.transaction('rw', [db.workouts, db.workoutSets], async () => {
    // Delete all sets for this workout
    await db.workoutSets.where('workoutId').equals(id).delete();
    // Delete the workout
    await db.workouts.delete(id);
  });
}

// ============================================================================
// Workout Set Queries
// ============================================================================

/** Get all sets for a workout, sorted by set number */
export async function getSetsByWorkoutId(
  workoutId: string
): Promise<WorkoutSet[]> {
  return db.workoutSets
    .where('workoutId')
    .equals(workoutId)
    .sortBy('setNumber');
}

/** Get all sets for an exercise across all workouts */
export async function getSetsByExerciseId(
  exerciseId: string
): Promise<WorkoutSet[]> {
  return db.workoutSets.where('exerciseId').equals(exerciseId).toArray();
}

/** Add a new set */
export async function addSet(input: CreateWorkoutSetInput): Promise<string> {
  const id = generateId();
  const set: WorkoutSet = {
    ...input,
    id,
    createdAt: new Date(),
  };
  await db.workoutSets.add(set);
  return id;
}

/** Update a set */
export async function updateSet(
  id: string,
  data: Partial<Omit<WorkoutSet, 'id' | 'createdAt'>>
): Promise<void> {
  const existing = await db.workoutSets.get(id);
  if (!existing) {
    throw new Error(`WorkoutSet with id ${id} not found`);
  }
  await db.workoutSets.update(id, data);
}

/** Delete a set */
export async function deleteSet(id: string): Promise<void> {
  await db.workoutSets.delete(id);
}

// ============================================================================
// Cardio Session Queries
// ============================================================================

/** Get all cardio sessions, sorted by date (newest first) */
export async function getAllCardioSessions(): Promise<CardioSession[]> {
  return db.cardioSessions.orderBy('date').reverse().toArray();
}

/** Get cardio session by ID */
export async function getCardioSessionById(
  id: string
): Promise<CardioSession | undefined> {
  return db.cardioSessions.get(id);
}

/** Get cardio sessions by type */
export async function getCardioSessionsByType(
  type: CardioType
): Promise<CardioSession[]> {
  return db.cardioSessions.where('type').equals(type).reverse().sortBy('date');
}

/** Get cardio sessions by date range */
export async function getCardioSessionsByDateRange(
  start: Date,
  end: Date
): Promise<CardioSession[]> {
  return db.cardioSessions
    .where('date')
    .between(start, end, true, true)
    .reverse()
    .toArray();
}

/** Add a new cardio session */
export async function addCardioSession(
  input: CreateCardioSessionInput
): Promise<string> {
  const id = generateId();
  const now = new Date();
  const session: CardioSession = {
    ...input,
    id,
    createdAt: now,
    updatedAt: now,
  };
  await db.cardioSessions.add(session);
  return id;
}

/** Update a cardio session */
export async function updateCardioSession(
  id: string,
  data: Partial<Omit<CardioSession, 'id' | 'createdAt'>>
): Promise<void> {
  const existing = await db.cardioSessions.get(id);
  if (!existing) {
    throw new Error(`CardioSession with id ${id} not found`);
  }
  await db.cardioSessions.update(id, {
    ...data,
    updatedAt: new Date(),
  });
}

/** Delete a cardio session */
export async function deleteCardioSession(id: string): Promise<void> {
  await db.cardioSessions.delete(id);
}
