import { describe, it, expect, beforeEach } from 'vitest';
import { exportAllData } from '../dataExport';
import { db } from '../db';
import type { Workout, WorkoutSet, CardioSession } from '../../types';

describe('dataExport', () => {
  beforeEach(async () => {
    // Clear all tables
    await db.exercises.clear();
    await db.workouts.clear();
    await db.workoutSets.clear();
    await db.cardioSessions.clear();
    await db.settings.clear();
  });

  describe('exportAllData', () => {
    it('should export data with correct version and date', async () => {
      const data = await exportAllData();

      expect(data.version).toBe('1.0');
      expect(data.exportDate).toBeDefined();
      // Check it's a valid ISO date
      expect(() => new Date(data.exportDate)).not.toThrow();
    });

    it('should export only custom exercises', async () => {
      // Add a built-in exercise
      await db.exercises.add({
        id: 'builtin-1',
        name: 'Bench Press',
        muscleGroup: 'chest',
        equipmentType: 'barbell',
        isCustom: false,
        createdAt: new Date(),
      });

      // Add a custom exercise
      await db.exercises.add({
        id: 'custom-1',
        name: 'My Custom Exercise',
        muscleGroup: 'chest',
        equipmentType: 'dumbbell',
        isCustom: true,
        createdAt: new Date(),
      });

      const data = await exportAllData();

      expect(data.exercises).toHaveLength(1);
      expect(data.exercises[0].name).toBe('My Custom Exercise');
      expect(data.exercises[0].isCustom).toBe(true);
    });

    it('should export all workouts', async () => {
      const workout: Workout = {
        id: 'workout-1',
        date: new Date(),
        notes: 'Test workout',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      await db.workouts.add(workout);

      const data = await exportAllData();

      expect(data.workouts).toHaveLength(1);
      expect(data.workouts[0].id).toBe('workout-1');
      expect(data.workouts[0].notes).toBe('Test workout');
    });

    it('should export all workout sets', async () => {
      const set: WorkoutSet = {
        id: 'set-1',
        workoutId: 'workout-1',
        exerciseId: 'exercise-1',
        setNumber: 1,
        reps: 10,
        weight: 100,
        createdAt: new Date(),
      };
      await db.workoutSets.add(set);

      const data = await exportAllData();

      expect(data.workoutSets).toHaveLength(1);
      expect(data.workoutSets[0].reps).toBe(10);
      expect(data.workoutSets[0].weight).toBe(100);
    });

    it('should export all cardio sessions', async () => {
      const session: CardioSession = {
        id: 'cardio-1',
        type: 'treadmill',
        date: new Date(),
        duration: 1800,
        distance: 5,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      await db.cardioSessions.add(session);

      const data = await exportAllData();

      expect(data.cardioSessions).toHaveLength(1);
      expect(data.cardioSessions[0].type).toBe('treadmill');
      expect(data.cardioSessions[0].duration).toBe(1800);
    });

    it('should export settings when they exist', async () => {
      await db.settings.add({
        id: 'settings',
        weightUnit: 'kg',
        distanceUnit: 'km',
        theme: 'dark',
        restTimerDefault: 90,
        barbellWeight: 20,
      });

      const data = await exportAllData();

      expect(data.settings).not.toBeNull();
      expect(data.settings?.weightUnit).toBe('kg');
      expect(data.settings?.theme).toBe('dark');
    });

    it('should return null settings when none exist', async () => {
      const data = await exportAllData();

      expect(data.settings).toBeNull();
    });

    it('should export empty arrays when no data exists', async () => {
      const data = await exportAllData();

      expect(data.exercises).toEqual([]);
      expect(data.workouts).toEqual([]);
      expect(data.workoutSets).toEqual([]);
      expect(data.cardioSessions).toEqual([]);
    });
  });
});
