import { describe, it, expect, beforeEach } from 'vitest';
import { getExercisePR, getAllPRs, isPR, getPRsByMuscleGroup } from '../prDetection';
import { db } from '../db';
import { seedExercises } from '../seed';

describe('prDetection', () => {
  let benchPressId: string;
  let squatId: string;

  beforeEach(async () => {
    // Clear all data
    await db.exercises.clear();
    await db.workouts.clear();
    await db.workoutSets.clear();

    // Seed exercises
    await seedExercises();
    const exercises = await db.exercises.toArray();
    const benchPress = exercises.find((e) => e.name === 'Barbell Bench Press');
    const squat = exercises.find((e) => e.name === 'Barbell Back Squat');
    benchPressId = benchPress?.id || '';
    squatId = squat?.id || '';
  });

  describe('getExercisePR', () => {
    it('should return null when no data exists', async () => {
      const pr = await getExercisePR(benchPressId);
      expect(pr).toBeNull();
    });

    it('should return the max weight PR for an exercise', async () => {
      await db.workouts.add({
        id: 'workout-1',
        date: new Date('2025-12-15'),
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      await db.workoutSets.bulkAdd([
        {
          id: 'set-1',
          workoutId: 'workout-1',
          exerciseId: benchPressId,
          setNumber: 1,
          weight: 60,
          reps: 10,
          createdAt: new Date(),
        },
        {
          id: 'set-2',
          workoutId: 'workout-1',
          exerciseId: benchPressId,
          setNumber: 2,
          weight: 80,
          reps: 5,
          createdAt: new Date(),
        },
        {
          id: 'set-3',
          workoutId: 'workout-1',
          exerciseId: benchPressId,
          setNumber: 3,
          weight: 70,
          reps: 8,
          createdAt: new Date(),
        },
      ]);

      const pr = await getExercisePR(benchPressId);

      expect(pr).not.toBeNull();
      expect(pr?.weight).toBe(80);
      expect(pr?.reps).toBe(5);
      expect(pr?.exerciseName).toBe('Barbell Bench Press');
    });

    it('should include exercise name and workout info', async () => {
      await db.workouts.add({
        id: 'workout-1',
        date: new Date('2025-12-10'),
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      await db.workoutSets.add({
        id: 'set-1',
        workoutId: 'workout-1',
        exerciseId: benchPressId,
        setNumber: 1,
        weight: 100,
        reps: 3,
        createdAt: new Date(),
      });

      const pr = await getExercisePR(benchPressId);

      expect(pr).not.toBeNull();
      expect(pr?.exerciseId).toBe(benchPressId);
      expect(pr?.exerciseName).toBe('Barbell Bench Press');
      expect(pr?.workoutId).toBe('workout-1');
      expect(pr?.date).toEqual(new Date('2025-12-10'));
    });
  });

  describe('getAllPRs', () => {
    it('should return empty array when no data exists', async () => {
      const prs = await getAllPRs();
      expect(prs).toEqual([]);
    });

    it('should return PRs for all exercises with data', async () => {
      await db.workouts.add({
        id: 'workout-1',
        date: new Date('2025-12-15'),
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      await db.workoutSets.bulkAdd([
        {
          id: 'set-1',
          workoutId: 'workout-1',
          exerciseId: benchPressId,
          setNumber: 1,
          weight: 80,
          reps: 5,
          createdAt: new Date(),
        },
        {
          id: 'set-2',
          workoutId: 'workout-1',
          exerciseId: squatId,
          setNumber: 1,
          weight: 120,
          reps: 5,
          createdAt: new Date(),
        },
      ]);

      const prs = await getAllPRs();

      expect(prs).toHaveLength(2);
      // Should be sorted by weight descending
      expect(prs[0].weight).toBe(120);
      expect(prs[0].exerciseName).toBe('Barbell Back Squat');
      expect(prs[1].weight).toBe(80);
      expect(prs[1].exerciseName).toBe('Barbell Bench Press');
    });

    it('should return max weight for each exercise', async () => {
      await db.workouts.bulkAdd([
        {
          id: 'workout-1',
          date: new Date('2025-12-10'),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 'workout-2',
          date: new Date('2025-12-15'),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]);

      await db.workoutSets.bulkAdd([
        {
          id: 'set-1',
          workoutId: 'workout-1',
          exerciseId: benchPressId,
          setNumber: 1,
          weight: 60,
          reps: 10,
          createdAt: new Date(),
        },
        {
          id: 'set-2',
          workoutId: 'workout-2',
          exerciseId: benchPressId,
          setNumber: 1,
          weight: 80,
          reps: 5,
          createdAt: new Date(),
        },
      ]);

      const prs = await getAllPRs();

      expect(prs).toHaveLength(1);
      expect(prs[0].weight).toBe(80);
    });
  });

  describe('isPR', () => {
    it('should return true when no existing data (first set is always a PR)', async () => {
      const result = await isPR(benchPressId, 50);
      expect(result).toBe(true);
    });

    it('should return true when weight is greater than current PR', async () => {
      await db.workouts.add({
        id: 'workout-1',
        date: new Date('2025-12-15'),
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      await db.workoutSets.add({
        id: 'set-1',
        workoutId: 'workout-1',
        exerciseId: benchPressId,
        setNumber: 1,
        weight: 80,
        reps: 5,
        createdAt: new Date(),
      });

      const result = await isPR(benchPressId, 85);
      expect(result).toBe(true);
    });

    it('should return false when weight is less than or equal to current PR', async () => {
      await db.workouts.add({
        id: 'workout-1',
        date: new Date('2025-12-15'),
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      await db.workoutSets.add({
        id: 'set-1',
        workoutId: 'workout-1',
        exerciseId: benchPressId,
        setNumber: 1,
        weight: 80,
        reps: 5,
        createdAt: new Date(),
      });

      expect(await isPR(benchPressId, 80)).toBe(false);
      expect(await isPR(benchPressId, 70)).toBe(false);
    });
  });

  describe('getPRsByMuscleGroup', () => {
    it('should return empty array when no data exists', async () => {
      const prs = await getPRsByMuscleGroup('chest');
      expect(prs).toEqual([]);
    });

    it('should filter PRs by muscle group', async () => {
      await db.workouts.add({
        id: 'workout-1',
        date: new Date('2025-12-15'),
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      await db.workoutSets.bulkAdd([
        {
          id: 'set-1',
          workoutId: 'workout-1',
          exerciseId: benchPressId,
          setNumber: 1,
          weight: 80,
          reps: 5,
          createdAt: new Date(),
        },
        {
          id: 'set-2',
          workoutId: 'workout-1',
          exerciseId: squatId,
          setNumber: 1,
          weight: 120,
          reps: 5,
          createdAt: new Date(),
        },
      ]);

      const chestPRs = await getPRsByMuscleGroup('chest');
      expect(chestPRs).toHaveLength(1);
      expect(chestPRs[0].exerciseName).toBe('Barbell Bench Press');

      const legsPRs = await getPRsByMuscleGroup('legs');
      expect(legsPRs).toHaveLength(1);
      expect(legsPRs[0].exerciseName).toBe('Barbell Back Squat');
    });
  });
});
