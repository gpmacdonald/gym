import { describe, it, expect, beforeEach } from 'vitest';
import { getWeightProgressData, getExercisePR } from '../progressQueries';
import { db } from '../db';
import { seedExercises } from '../seed';

describe('progressQueries', () => {
  let benchPressId: string;

  beforeEach(async () => {
    // Clear all data
    await db.exercises.clear();
    await db.workouts.clear();
    await db.workoutSets.clear();

    // Seed exercises and get bench press ID
    await seedExercises();
    const exercises = await db.exercises.toArray();
    const benchPress = exercises.find((e) => e.name === 'Barbell Bench Press');
    benchPressId = benchPress?.id || '';
  });

  describe('getWeightProgressData', () => {
    it('should return empty array when no data exists', async () => {
      const data = await getWeightProgressData(benchPressId, null, null);
      expect(data).toEqual([]);
    });

    it('should return max weight per workout date', async () => {
      // Create a workout with sets
      await db.workouts.add({
        id: 'workout-1',
        date: new Date('2025-12-15'),
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      // Add sets with different weights
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
          weight: 80, // max weight
          reps: 8,
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

      const data = await getWeightProgressData(benchPressId, null, null);

      expect(data).toHaveLength(1);
      expect(data[0].maxWeight).toBe(80);
    });

    it('should sort data by date ascending', async () => {
      // Create workouts on different dates
      await db.workouts.bulkAdd([
        {
          id: 'workout-1',
          date: new Date('2025-12-20'),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 'workout-2',
          date: new Date('2025-12-10'),
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
          weight: 80,
          reps: 10,
          createdAt: new Date(),
        },
        {
          id: 'set-2',
          workoutId: 'workout-2',
          exerciseId: benchPressId,
          setNumber: 1,
          weight: 70,
          reps: 10,
          createdAt: new Date(),
        },
      ]);

      const data = await getWeightProgressData(benchPressId, null, null);

      expect(data).toHaveLength(2);
      expect(data[0].maxWeight).toBe(70); // Earlier date
      expect(data[1].maxWeight).toBe(80); // Later date
    });

    it('should filter by date range', async () => {
      await db.workouts.bulkAdd([
        {
          id: 'workout-1',
          date: new Date('2025-12-01'),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 'workout-2',
          date: new Date('2025-12-15'),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 'workout-3',
          date: new Date('2025-12-25'),
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
          weight: 70,
          reps: 10,
          createdAt: new Date(),
        },
        {
          id: 'set-3',
          workoutId: 'workout-3',
          exerciseId: benchPressId,
          setNumber: 1,
          weight: 80,
          reps: 10,
          createdAt: new Date(),
        },
      ]);

      const data = await getWeightProgressData(
        benchPressId,
        new Date('2025-12-10'),
        new Date('2025-12-20')
      );

      expect(data).toHaveLength(1);
      expect(data[0].maxWeight).toBe(70);
    });

    it('should mark PR correctly', async () => {
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
        {
          id: 'workout-3',
          date: new Date('2025-12-20'),
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
          weight: 70,
          reps: 10,
          createdAt: new Date(),
        },
        {
          id: 'set-2',
          workoutId: 'workout-2',
          exerciseId: benchPressId,
          setNumber: 1,
          weight: 80, // PR
          reps: 10,
          createdAt: new Date(),
        },
        {
          id: 'set-3',
          workoutId: 'workout-3',
          exerciseId: benchPressId,
          setNumber: 1,
          weight: 75,
          reps: 10,
          createdAt: new Date(),
        },
      ]);

      const data = await getWeightProgressData(benchPressId, null, null);

      expect(data).toHaveLength(3);
      expect(data[0].isPR).toBe(false);
      expect(data[1].isPR).toBe(true); // 80kg is PR
      expect(data[2].isPR).toBe(false);
    });
  });

  describe('getExercisePR', () => {
    it('should return null when no data exists', async () => {
      const pr = await getExercisePR(benchPressId);
      expect(pr).toBeNull();
    });

    it('should return the PR weight and date', async () => {
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
        weight: 100,
        reps: 5,
        createdAt: new Date(),
      });

      const pr = await getExercisePR(benchPressId);

      expect(pr).not.toBeNull();
      expect(pr?.weight).toBe(100);
    });
  });
});
