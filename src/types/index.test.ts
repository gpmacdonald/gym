import { describe, it, expect } from 'vitest';
import type {
  MuscleGroup,
  CardioType,
  WeightUnit,
  DistanceUnit,
  Theme,
  Exercise,
  Workout,
  WorkoutSet,
  CardioSession,
  Settings,
  WorkoutWithSets,
  Activity,
  CreateExerciseInput,
  CreateWorkoutInput,
  CreateWorkoutSetInput,
  CreateCardioSessionInput,
} from './index';

describe('TypeScript Types', () => {
  it('should allow valid MuscleGroup values', () => {
    const groups: MuscleGroup[] = [
      'chest',
      'back',
      'legs',
      'shoulders',
      'arms',
      'core',
    ];
    expect(groups).toHaveLength(6);
  });

  it('should allow valid CardioType values', () => {
    const types: CardioType[] = ['treadmill', 'stationary-bike'];
    expect(types).toHaveLength(2);
  });

  it('should allow valid WeightUnit values', () => {
    const units: WeightUnit[] = ['lbs', 'kg'];
    expect(units).toHaveLength(2);
  });

  it('should allow valid DistanceUnit values', () => {
    const units: DistanceUnit[] = ['miles', 'km'];
    expect(units).toHaveLength(2);
  });

  it('should allow valid Theme values', () => {
    const themes: Theme[] = ['light', 'dark', 'system'];
    expect(themes).toHaveLength(3);
  });

  it('should create a valid Exercise object', () => {
    const exercise: Exercise = {
      id: 'test-id',
      name: 'Bench Press',
      muscleGroup: 'chest',
      isCustom: false,
      createdAt: new Date(),
    };
    expect(exercise.name).toBe('Bench Press');
    expect(exercise.muscleGroup).toBe('chest');
  });

  it('should create a valid Workout object', () => {
    const workout: Workout = {
      id: 'workout-1',
      date: new Date(),
      notes: 'Great session',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    expect(workout.id).toBe('workout-1');
    expect(workout.notes).toBe('Great session');
  });

  it('should create a valid WorkoutSet object', () => {
    const set: WorkoutSet = {
      id: 'set-1',
      workoutId: 'workout-1',
      exerciseId: 'exercise-1',
      setNumber: 1,
      reps: 10,
      weight: 135,
      rpe: 7,
      createdAt: new Date(),
    };
    expect(set.reps).toBe(10);
    expect(set.weight).toBe(135);
  });

  it('should create a valid CardioSession object for treadmill', () => {
    const session: CardioSession = {
      id: 'cardio-1',
      date: new Date(),
      type: 'treadmill',
      duration: 1800, // 30 minutes in seconds
      distance: 2.5,
      avgSpeed: 5.0,
      avgIncline: 3,
      maxIncline: 5,
      calories: 300,
      notes: 'Morning run',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    expect(session.type).toBe('treadmill');
    expect(session.duration).toBe(1800);
  });

  it('should create a valid CardioSession object for stationary bike', () => {
    const session: CardioSession = {
      id: 'cardio-2',
      date: new Date(),
      type: 'stationary-bike',
      duration: 2400, // 40 minutes
      distance: 10,
      avgResistance: 8,
      avgCadence: 85,
      calories: 400,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    expect(session.type).toBe('stationary-bike');
    expect(session.avgResistance).toBe(8);
  });

  it('should create a valid Settings object', () => {
    const settings: Settings = {
      id: 'settings',
      weightUnit: 'lbs',
      distanceUnit: 'miles',
      theme: 'system',
      restTimerDefault: 90,
    };
    expect(settings.id).toBe('settings');
    expect(settings.weightUnit).toBe('lbs');
  });

  it('should create a valid WorkoutWithSets object', () => {
    const workoutWithSets: WorkoutWithSets = {
      id: 'workout-1',
      date: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
      sets: [
        {
          id: 'set-1',
          workoutId: 'workout-1',
          exerciseId: 'ex-1',
          setNumber: 1,
          reps: 10,
          weight: 135,
          createdAt: new Date(),
        },
      ],
      exercises: [
        {
          id: 'ex-1',
          name: 'Bench Press',
          muscleGroup: 'chest',
          isCustom: false,
          createdAt: new Date(),
        },
      ],
    };
    expect(workoutWithSets.sets).toHaveLength(1);
    expect(workoutWithSets.exercises).toHaveLength(1);
  });

  it('should create a valid Activity object', () => {
    const activity: Activity = {
      id: 'activity-1',
      type: 'workout',
      date: new Date(),
      data: {
        id: 'workout-1',
        date: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    };
    expect(activity.type).toBe('workout');
  });

  it('should create valid input types for creating entities', () => {
    const exerciseInput: CreateExerciseInput = {
      name: 'Custom Exercise',
      muscleGroup: 'arms',
      isCustom: true,
    };
    expect(exerciseInput.name).toBe('Custom Exercise');

    const workoutInput: CreateWorkoutInput = {
      date: new Date(),
      notes: 'Test workout',
    };
    expect(workoutInput.notes).toBe('Test workout');

    const setInput: CreateWorkoutSetInput = {
      workoutId: 'w-1',
      exerciseId: 'e-1',
      setNumber: 1,
      reps: 8,
      weight: 100,
    };
    expect(setInput.reps).toBe(8);

    const cardioInput: CreateCardioSessionInput = {
      date: new Date(),
      type: 'treadmill',
      duration: 1200,
    };
    expect(cardioInput.duration).toBe(1200);
  });
});
