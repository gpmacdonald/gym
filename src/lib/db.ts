import Dexie, { type Table } from 'dexie';
import type {
  Exercise,
  Workout,
  WorkoutSet,
  CardioSession,
  BodyWeightEntry,
  Settings,
} from '../types';

export class FitnessDatabase extends Dexie {
  exercises!: Table<Exercise>;
  workouts!: Table<Workout>;
  workoutSets!: Table<WorkoutSet>;
  cardioSessions!: Table<CardioSession>;
  bodyWeightEntries!: Table<BodyWeightEntry>;
  settings!: Table<Settings>;

  constructor() {
    super('FitnessTracker');

    this.version(1).stores({
      // Primary key is 'id', indexes on 'name', 'muscleGroup', 'isCustom'
      exercises: 'id, name, muscleGroup, isCustom',
      // Primary key is 'id', index on 'date'
      workouts: 'id, date',
      // Primary key is 'id', indexes on 'workoutId', 'exerciseId', compound index
      workoutSets: 'id, workoutId, exerciseId, [workoutId+setNumber]',
      // Primary key is 'id', indexes on 'date', 'type'
      cardioSessions: 'id, date, type',
      // Primary key is 'id' (always 'settings')
      settings: 'id',
    });

    // Version 2: Add body weight tracking
    this.version(2).stores({
      exercises: 'id, name, muscleGroup, isCustom',
      workouts: 'id, date',
      workoutSets: 'id, workoutId, exerciseId, [workoutId+setNumber]',
      cardioSessions: 'id, date, type',
      bodyWeightEntries: 'id, date',
      settings: 'id',
    });
  }
}

export const db = new FitnessDatabase();

// Helper to initialize default settings if they don't exist
export async function initializeSettings(): Promise<Settings> {
  const existing = await db.settings.get('settings');
  if (existing) {
    return existing;
  }

  const defaultSettings: Settings = {
    id: 'settings',
    weightUnit: 'kg',
    distanceUnit: 'km',
    theme: 'system',
    restTimerDefault: 90,
    barbellWeight: 20, // Standard Olympic barbell weight in kg
  };

  await db.settings.add(defaultSettings);
  return defaultSettings;
}
