import { describe, it, expect, beforeEach } from 'vitest';
import { db, initializeSettings } from '../db';
import type { Exercise, Workout, WorkoutSet, CardioSession } from '../../types';

describe('Database', () => {
  beforeEach(async () => {
    // Clear all tables before each test
    await db.exercises.clear();
    await db.workouts.clear();
    await db.workoutSets.clear();
    await db.cardioSessions.clear();
    await db.settings.clear();
  });

  it('should initialize database with correct name', () => {
    expect(db.name).toBe('FitnessTracker');
  });

  it('should have all required tables', () => {
    expect(db.exercises).toBeDefined();
    expect(db.workouts).toBeDefined();
    expect(db.workoutSets).toBeDefined();
    expect(db.cardioSessions).toBeDefined();
    expect(db.settings).toBeDefined();
  });

  describe('Exercises', () => {
    it('should add and retrieve an exercise', async () => {
      const exercise: Exercise = {
        id: 'test-1',
        name: 'Bench Press',
        muscleGroup: 'chest',
        equipmentType: 'barbell',
        isCustom: false,
        createdAt: new Date(),
      };

      await db.exercises.add(exercise);
      const retrieved = await db.exercises.get('test-1');

      expect(retrieved).toBeDefined();
      expect(retrieved?.name).toBe('Bench Press');
      expect(retrieved?.muscleGroup).toBe('chest');
    });

    it('should query exercises by muscle group', async () => {
      const exercises: Exercise[] = [
        {
          id: 'ex-1',
          name: 'Bench Press',
          muscleGroup: 'chest',
          equipmentType: 'barbell',
          isCustom: false,
          createdAt: new Date(),
        },
        {
          id: 'ex-2',
          name: 'Squat',
          muscleGroup: 'legs',
          equipmentType: 'barbell',
          isCustom: false,
          createdAt: new Date(),
        },
        {
          id: 'ex-3',
          name: 'Incline Press',
          muscleGroup: 'chest',
          equipmentType: 'barbell',
          isCustom: false,
          createdAt: new Date(),
        },
      ];

      await db.exercises.bulkAdd(exercises);
      const chestExercises = await db.exercises
        .where('muscleGroup')
        .equals('chest')
        .toArray();

      expect(chestExercises).toHaveLength(2);
    });

    it('should update an exercise', async () => {
      const exercise: Exercise = {
        id: 'test-update',
        name: 'Original Name',
        muscleGroup: 'chest',
        equipmentType: 'dumbbell',
        isCustom: true,
        createdAt: new Date(),
      };

      await db.exercises.add(exercise);
      await db.exercises.update('test-update', { name: 'Updated Name' });

      const updated = await db.exercises.get('test-update');
      expect(updated?.name).toBe('Updated Name');
    });

    it('should delete an exercise', async () => {
      const exercise: Exercise = {
        id: 'test-delete',
        name: 'To Delete',
        muscleGroup: 'arms',
        equipmentType: 'cable',
        isCustom: true,
        createdAt: new Date(),
      };

      await db.exercises.add(exercise);
      await db.exercises.delete('test-delete');

      const deleted = await db.exercises.get('test-delete');
      expect(deleted).toBeUndefined();
    });
  });

  describe('Workouts', () => {
    it('should add and retrieve a workout', async () => {
      const workout: Workout = {
        id: 'workout-1',
        date: new Date('2024-01-15'),
        notes: 'Great workout',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await db.workouts.add(workout);
      const retrieved = await db.workouts.get('workout-1');

      expect(retrieved).toBeDefined();
      expect(retrieved?.notes).toBe('Great workout');
    });

    it('should query workouts by date range', async () => {
      const workouts: Workout[] = [
        {
          id: 'w-1',
          date: new Date('2024-01-10'),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 'w-2',
          date: new Date('2024-01-15'),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 'w-3',
          date: new Date('2024-01-20'),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      await db.workouts.bulkAdd(workouts);
      const inRange = await db.workouts
        .where('date')
        .between(new Date('2024-01-12'), new Date('2024-01-18'))
        .toArray();

      expect(inRange).toHaveLength(1);
      expect(inRange[0].id).toBe('w-2');
    });
  });

  describe('Workout Sets', () => {
    it('should add and retrieve sets for a workout', async () => {
      const sets: WorkoutSet[] = [
        {
          id: 'set-1',
          workoutId: 'workout-1',
          exerciseId: 'ex-1',
          setNumber: 1,
          reps: 10,
          weight: 135,
          createdAt: new Date(),
        },
        {
          id: 'set-2',
          workoutId: 'workout-1',
          exerciseId: 'ex-1',
          setNumber: 2,
          reps: 8,
          weight: 155,
          createdAt: new Date(),
        },
        {
          id: 'set-3',
          workoutId: 'workout-2',
          exerciseId: 'ex-1',
          setNumber: 1,
          reps: 10,
          weight: 140,
          createdAt: new Date(),
        },
      ];

      await db.workoutSets.bulkAdd(sets);
      const workout1Sets = await db.workoutSets
        .where('workoutId')
        .equals('workout-1')
        .toArray();

      expect(workout1Sets).toHaveLength(2);
    });

    it('should query sets by exercise', async () => {
      const sets: WorkoutSet[] = [
        {
          id: 'set-a',
          workoutId: 'w-1',
          exerciseId: 'bench',
          setNumber: 1,
          reps: 10,
          weight: 135,
          createdAt: new Date(),
        },
        {
          id: 'set-b',
          workoutId: 'w-1',
          exerciseId: 'squat',
          setNumber: 1,
          reps: 8,
          weight: 225,
          createdAt: new Date(),
        },
      ];

      await db.workoutSets.bulkAdd(sets);
      const benchSets = await db.workoutSets
        .where('exerciseId')
        .equals('bench')
        .toArray();

      expect(benchSets).toHaveLength(1);
      expect(benchSets[0].weight).toBe(135);
    });
  });

  describe('Cardio Sessions', () => {
    it('should add and retrieve a treadmill session', async () => {
      const session: CardioSession = {
        id: 'cardio-1',
        date: new Date('2024-01-15'),
        type: 'treadmill',
        duration: 1800,
        distance: 2.5,
        avgSpeed: 5.0,
        avgIncline: 3,
        calories: 300,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await db.cardioSessions.add(session);
      const retrieved = await db.cardioSessions.get('cardio-1');

      expect(retrieved).toBeDefined();
      expect(retrieved?.type).toBe('treadmill');
      expect(retrieved?.distance).toBe(2.5);
    });

    it('should add and retrieve a bike session', async () => {
      const session: CardioSession = {
        id: 'cardio-2',
        date: new Date('2024-01-16'),
        type: 'stationary-bike',
        duration: 2400,
        distance: 10,
        avgResistance: 8,
        avgCadence: 85,
        calories: 400,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await db.cardioSessions.add(session);
      const retrieved = await db.cardioSessions.get('cardio-2');

      expect(retrieved).toBeDefined();
      expect(retrieved?.type).toBe('stationary-bike');
      expect(retrieved?.avgResistance).toBe(8);
    });

    it('should query sessions by type', async () => {
      const sessions: CardioSession[] = [
        {
          id: 'c-1',
          date: new Date(),
          type: 'treadmill',
          duration: 1800,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 'c-2',
          date: new Date(),
          type: 'stationary-bike',
          duration: 2400,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 'c-3',
          date: new Date(),
          type: 'treadmill',
          duration: 1200,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      await db.cardioSessions.bulkAdd(sessions);
      const treadmillSessions = await db.cardioSessions
        .where('type')
        .equals('treadmill')
        .toArray();

      expect(treadmillSessions).toHaveLength(2);
    });
  });

  describe('Settings', () => {
    it('should initialize default settings', async () => {
      const settings = await initializeSettings();

      expect(settings.id).toBe('settings');
      expect(settings.weightUnit).toBe('kg');
      expect(settings.distanceUnit).toBe('km');
      expect(settings.theme).toBe('system');
      expect(settings.restTimerDefault).toBe(90);
      expect(settings.barbellWeight).toBe(20);
    });

    it('should not overwrite existing settings', async () => {
      // Initialize first
      await initializeSettings();

      // Modify settings
      await db.settings.update('settings', { theme: 'dark' });

      // Initialize again
      const settings = await initializeSettings();

      // Should keep the modified value
      expect(settings.theme).toBe('dark');
    });

    it('should update settings', async () => {
      await initializeSettings();
      await db.settings.update('settings', {
        weightUnit: 'kg',
        distanceUnit: 'km',
      });

      const updated = await db.settings.get('settings');
      expect(updated?.weightUnit).toBe('kg');
      expect(updated?.distanceUnit).toBe('km');
    });
  });
});
