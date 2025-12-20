import { describe, it, expect, beforeEach } from 'vitest';
import { getStats, getCardioStats } from '../statsQueries';
import { db } from '../db';
import { seedExercises } from '../seed';

describe('statsQueries', () => {
  let benchPressId: string;
  let squatId: string;

  beforeEach(async () => {
    // Clear all data
    await db.exercises.clear();
    await db.workouts.clear();
    await db.workoutSets.clear();
    await db.cardioSessions.clear();

    // Seed exercises
    await seedExercises();
    const exercises = await db.exercises.toArray();
    const benchPress = exercises.find((e) => e.name === 'Barbell Bench Press');
    const squat = exercises.find((e) => e.name === 'Barbell Back Squat');
    benchPressId = benchPress?.id || '';
    squatId = squat?.id || '';
  });

  describe('getStats', () => {
    it('should return zero stats when no data exists', async () => {
      const stats = await getStats();

      expect(stats.totalWorkouts).toBe(0);
      expect(stats.totalCardioSessions).toBe(0);
      expect(stats.totalVolume).toBe(0);
      expect(stats.totalCardioTime).toBe(0);
      expect(stats.totalCardioDistance).toBe(0);
      expect(stats.workoutsPerWeek).toBe(0);
      expect(stats.cardioPerWeek).toBe(0);
      expect(stats.mostTrainedMuscle).toBeNull();
    });

    it('should count total workouts correctly', async () => {
      await db.workouts.bulkAdd([
        {
          id: 'w1',
          date: new Date('2025-12-10'),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 'w2',
          date: new Date('2025-12-15'),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 'w3',
          date: new Date('2025-12-20'),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]);

      const stats = await getStats();
      expect(stats.totalWorkouts).toBe(3);
    });

    it('should count total cardio sessions correctly', async () => {
      await db.cardioSessions.bulkAdd([
        {
          id: 'c1',
          date: new Date('2025-12-10'),
          type: 'treadmill',
          duration: 1800,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 'c2',
          date: new Date('2025-12-15'),
          type: 'stationary-bike',
          duration: 2400,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]);

      const stats = await getStats();
      expect(stats.totalCardioSessions).toBe(2);
    });

    it('should calculate total volume correctly', async () => {
      await db.workouts.add({
        id: 'w1',
        date: new Date('2025-12-15'),
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      await db.workoutSets.bulkAdd([
        {
          id: 's1',
          workoutId: 'w1',
          exerciseId: benchPressId,
          setNumber: 1,
          weight: 60,
          reps: 10,
          createdAt: new Date(),
        },
        {
          id: 's2',
          workoutId: 'w1',
          exerciseId: benchPressId,
          setNumber: 2,
          weight: 80,
          reps: 8,
          createdAt: new Date(),
        },
      ]);

      const stats = await getStats();
      // Volume = (60 × 10) + (80 × 8) = 600 + 640 = 1240
      expect(stats.totalVolume).toBe(1240);
    });

    it('should calculate total cardio time and distance correctly', async () => {
      await db.cardioSessions.bulkAdd([
        {
          id: 'c1',
          date: new Date('2025-12-10'),
          type: 'treadmill',
          duration: 1800,
          distance: 3.5,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 'c2',
          date: new Date('2025-12-15'),
          type: 'treadmill',
          duration: 2400,
          distance: 4.0,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]);

      const stats = await getStats();
      expect(stats.totalCardioTime).toBe(4200); // 1800 + 2400
      expect(stats.totalCardioDistance).toBe(7.5); // 3.5 + 4.0
    });

    it('should calculate workouts per week correctly', async () => {
      // 4 workouts over 2 weeks = 2 per week
      await db.workouts.bulkAdd([
        {
          id: 'w1',
          date: new Date('2025-12-01'),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 'w2',
          date: new Date('2025-12-05'),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 'w3',
          date: new Date('2025-12-10'),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 'w4',
          date: new Date('2025-12-15'),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]);

      const stats = await getStats();
      // 4 workouts over 14 days (2 weeks) = 2 per week
      expect(stats.workoutsPerWeek).toBe(2);
    });

    it('should find the most trained muscle group', async () => {
      await db.workouts.add({
        id: 'w1',
        date: new Date('2025-12-15'),
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      // 3 sets of chest exercises, 1 set of legs
      await db.workoutSets.bulkAdd([
        {
          id: 's1',
          workoutId: 'w1',
          exerciseId: benchPressId, // chest
          setNumber: 1,
          weight: 60,
          reps: 10,
          createdAt: new Date(),
        },
        {
          id: 's2',
          workoutId: 'w1',
          exerciseId: benchPressId, // chest
          setNumber: 2,
          weight: 60,
          reps: 10,
          createdAt: new Date(),
        },
        {
          id: 's3',
          workoutId: 'w1',
          exerciseId: benchPressId, // chest
          setNumber: 3,
          weight: 60,
          reps: 10,
          createdAt: new Date(),
        },
        {
          id: 's4',
          workoutId: 'w1',
          exerciseId: squatId, // legs
          setNumber: 1,
          weight: 100,
          reps: 8,
          createdAt: new Date(),
        },
      ]);

      const stats = await getStats();
      expect(stats.mostTrainedMuscle).toBe('chest');
    });
  });

  describe('getCardioStats', () => {
    it('should return zero stats when no cardio sessions exist', async () => {
      const stats = await getCardioStats(null, null, null);

      expect(stats.totalSessions).toBe(0);
      expect(stats.totalTime).toBe(0);
      expect(stats.totalDistance).toBe(0);
      expect(stats.avgDuration).toBe(0);
    });

    it('should calculate cardio stats correctly', async () => {
      await db.cardioSessions.bulkAdd([
        {
          id: 'c1',
          date: new Date('2025-12-10'),
          type: 'treadmill',
          duration: 1800,
          distance: 3.0,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 'c2',
          date: new Date('2025-12-15'),
          type: 'treadmill',
          duration: 2400,
          distance: 4.0,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]);

      const stats = await getCardioStats(null, null, null);

      expect(stats.totalSessions).toBe(2);
      expect(stats.totalTime).toBe(4200);
      expect(stats.totalDistance).toBe(7.0);
      expect(stats.avgDuration).toBe(2100); // (1800 + 2400) / 2
    });

    it('should filter by cardio type', async () => {
      await db.cardioSessions.bulkAdd([
        {
          id: 'c1',
          date: new Date('2025-12-10'),
          type: 'treadmill',
          duration: 1800,
          distance: 3.0,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 'c2',
          date: new Date('2025-12-15'),
          type: 'stationary-bike',
          duration: 2400,
          distance: 8.0,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]);

      const treadmillStats = await getCardioStats('treadmill', null, null);
      expect(treadmillStats.totalSessions).toBe(1);
      expect(treadmillStats.totalDistance).toBe(3.0);

      const bikeStats = await getCardioStats('stationary-bike', null, null);
      expect(bikeStats.totalSessions).toBe(1);
      expect(bikeStats.totalDistance).toBe(8.0);
    });

    it('should filter by date range', async () => {
      await db.cardioSessions.bulkAdd([
        {
          id: 'c1',
          date: new Date('2025-12-01'),
          type: 'treadmill',
          duration: 1500,
          distance: 2.5,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 'c2',
          date: new Date('2025-12-15'),
          type: 'treadmill',
          duration: 1800,
          distance: 3.0,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 'c3',
          date: new Date('2025-12-25'),
          type: 'treadmill',
          duration: 2100,
          distance: 3.5,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]);

      const stats = await getCardioStats(
        null,
        new Date('2025-12-10'),
        new Date('2025-12-20')
      );

      expect(stats.totalSessions).toBe(1);
      expect(stats.totalDistance).toBe(3.0);
    });
  });
});
