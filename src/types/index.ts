// Muscle groups for exercises
export type MuscleGroup =
  | 'chest'
  | 'back'
  | 'legs'
  | 'shoulders'
  | 'arms'
  | 'core';

// Cardio types
export type CardioType = 'treadmill' | 'stationary-bike';

// Weight and distance units
export type WeightUnit = 'lbs' | 'kg';
export type DistanceUnit = 'miles' | 'km';

// Theme options
export type Theme = 'light' | 'dark' | 'system';

// Exercise interface
export interface Exercise {
  id: string;
  name: string;
  muscleGroup: MuscleGroup;
  isCustom: boolean;
  createdAt: Date;
}

// Workout interface (weightlifting session)
export interface Workout {
  id: string;
  date: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Individual set within a workout
export interface WorkoutSet {
  id: string;
  workoutId: string;
  exerciseId: string;
  setNumber: number;
  reps: number;
  weight: number; // Always stored in lbs
  rpe?: number; // Rate of Perceived Exertion (1-10)
  createdAt: Date;
}

// Cardio session interface
export interface CardioSession {
  id: string;
  date: Date;
  type: CardioType;
  duration: number; // seconds
  distance?: number; // Always stored in miles
  avgSpeed?: number; // mph
  avgIncline?: number; // percentage (treadmill)
  maxIncline?: number; // percentage (treadmill)
  avgResistance?: number; // 1-20 scale (bike)
  avgCadence?: number; // RPM (bike)
  calories?: number;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

// User settings
export interface Settings {
  id: 'settings';
  weightUnit: WeightUnit;
  distanceUnit: DistanceUnit;
  theme: Theme;
  restTimerDefault: number; // seconds
}

// For displaying workouts with their sets grouped by exercise
export interface WorkoutWithSets extends Workout {
  sets: WorkoutSet[];
  exercises: Exercise[];
}

// Combined activity for history display
export type ActivityType = 'workout' | 'cardio';

export interface Activity {
  id: string;
  type: ActivityType;
  date: Date;
  data: Workout | CardioSession;
}

// Form input types (for creating/editing)
export type CreateExerciseInput = Omit<Exercise, 'id' | 'createdAt'>;
export type UpdateExerciseInput = Partial<Omit<Exercise, 'id' | 'createdAt'>>;

export type CreateWorkoutInput = Omit<
  Workout,
  'id' | 'createdAt' | 'updatedAt'
>;
export type UpdateWorkoutInput = Partial<
  Omit<Workout, 'id' | 'createdAt' | 'updatedAt'>
>;

export type CreateWorkoutSetInput = Omit<WorkoutSet, 'id' | 'createdAt'>;
export type UpdateWorkoutSetInput = Partial<
  Omit<WorkoutSet, 'id' | 'createdAt'>
>;

export type CreateCardioSessionInput = Omit<
  CardioSession,
  'id' | 'createdAt' | 'updatedAt'
>;
export type UpdateCardioSessionInput = Partial<
  Omit<CardioSession, 'id' | 'createdAt' | 'updatedAt'>
>;
