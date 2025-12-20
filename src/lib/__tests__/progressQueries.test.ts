import { describe, it, expect, beforeEach } from 'vitest';
import {
  getWeightProgressData,
  getExercisePR,
  getVolumeProgressData,
  getCardioDistanceData,
  getCardioDurationData,
  getCardioPaceData,
  getCardioIntensityData,
} from '../progressQueries';
import { db } from '../db';
import { seedExercises } from '../seed';

describe('progressQueries', () => {
  let benchPressId: string;

  beforeEach(async () => {
    // Clear all data
    await db.exercises.clear();
    await db.workouts.clear();
    await db.workoutSets.clear();
    await db.cardioSessions.clear();

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

  describe('getVolumeProgressData', () => {
    let squatId: string;

    beforeEach(async () => {
      const exercises = await db.exercises.toArray();
      const squat = exercises.find((e) => e.name === 'Barbell Squat');
      squatId = squat?.id || '';
    });

    it('should return empty array when no data exists', async () => {
      const data = await getVolumeProgressData(benchPressId, null, null);
      expect(data).toEqual([]);
    });

    it('should calculate volume correctly for a single exercise', async () => {
      await db.workouts.add({
        id: 'workout-1',
        date: new Date('2025-12-15'),
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      // Add sets: 3×10×60kg = 1800kg volume, 3×8×80kg = 1920kg volume
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
          reps: 8,
          createdAt: new Date(),
        },
      ]);

      const data = await getVolumeProgressData(benchPressId, null, null);

      expect(data).toHaveLength(1);
      // Volume = (10 × 60) + (8 × 80) = 600 + 640 = 1240
      expect(data[0].volume).toBe(1240);
    });

    it('should calculate total workout volume when exerciseId is null', async () => {
      await db.workouts.add({
        id: 'workout-1',
        date: new Date('2025-12-15'),
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      // Add sets for different exercises
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
          workoutId: 'workout-1',
          exerciseId: squatId,
          setNumber: 1,
          weight: 100,
          reps: 8,
          createdAt: new Date(),
        },
      ]);

      const data = await getVolumeProgressData(null, null, null);

      expect(data).toHaveLength(1);
      // Volume = (10 × 80) + (8 × 100) = 800 + 800 = 1600
      expect(data[0].volume).toBe(1600);
    });

    it('should return data for multiple workouts sorted by date', async () => {
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
          weight: 60,
          reps: 10,
          createdAt: new Date(),
        },
      ]);

      const data = await getVolumeProgressData(benchPressId, null, null);

      expect(data).toHaveLength(2);
      expect(data[0].volume).toBe(600); // Dec 10: 10 × 60 = 600
      expect(data[1].volume).toBe(800); // Dec 20: 10 × 80 = 800
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

      const data = await getVolumeProgressData(
        benchPressId,
        new Date('2025-12-10'),
        new Date('2025-12-20')
      );

      expect(data).toHaveLength(1);
      expect(data[0].volume).toBe(700); // 10 × 70 = 700
    });
  });

  describe('getCardioDistanceData', () => {
    it('should return empty array when no cardio sessions exist', async () => {
      const data = await getCardioDistanceData(null, null, null);
      expect(data).toEqual([]);
    });

    it('should return sessions with distance data', async () => {
      await db.cardioSessions.bulkAdd([
        {
          id: 'cardio-1',
          date: new Date('2025-12-15'),
          type: 'treadmill',
          duration: 1800,
          distance: 3.5,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 'cardio-2',
          date: new Date('2025-12-16'),
          type: 'stationary-bike',
          duration: 2400,
          distance: 8.0,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]);

      const data = await getCardioDistanceData(null, null, null);

      expect(data).toHaveLength(2);
      expect(data[0].distance).toBe(3.5);
      expect(data[1].distance).toBe(8.0);
    });

    it('should filter out sessions without distance', async () => {
      await db.cardioSessions.bulkAdd([
        {
          id: 'cardio-1',
          date: new Date('2025-12-15'),
          type: 'treadmill',
          duration: 1800,
          distance: 3.5,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 'cardio-2',
          date: new Date('2025-12-16'),
          type: 'treadmill',
          duration: 1200,
          // No distance
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]);

      const data = await getCardioDistanceData(null, null, null);

      expect(data).toHaveLength(1);
      expect(data[0].distance).toBe(3.5);
    });

    it('should filter by cardio type', async () => {
      await db.cardioSessions.bulkAdd([
        {
          id: 'cardio-1',
          date: new Date('2025-12-15'),
          type: 'treadmill',
          duration: 1800,
          distance: 3.5,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 'cardio-2',
          date: new Date('2025-12-16'),
          type: 'stationary-bike',
          duration: 2400,
          distance: 8.0,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]);

      const treadmillData = await getCardioDistanceData('treadmill', null, null);
      expect(treadmillData).toHaveLength(1);
      expect(treadmillData[0].type).toBe('treadmill');

      const bikeData = await getCardioDistanceData('stationary-bike', null, null);
      expect(bikeData).toHaveLength(1);
      expect(bikeData[0].type).toBe('stationary-bike');
    });

    it('should filter by date range', async () => {
      await db.cardioSessions.bulkAdd([
        {
          id: 'cardio-1',
          date: new Date('2025-12-01'),
          type: 'treadmill',
          duration: 1800,
          distance: 3.0,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 'cardio-2',
          date: new Date('2025-12-15'),
          type: 'treadmill',
          duration: 1800,
          distance: 3.5,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 'cardio-3',
          date: new Date('2025-12-25'),
          type: 'treadmill',
          duration: 1800,
          distance: 4.0,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]);

      const data = await getCardioDistanceData(
        null,
        new Date('2025-12-10'),
        new Date('2025-12-20')
      );

      expect(data).toHaveLength(1);
      expect(data[0].distance).toBe(3.5);
    });

    it('should sort by date ascending', async () => {
      await db.cardioSessions.bulkAdd([
        {
          id: 'cardio-1',
          date: new Date('2025-12-20'),
          type: 'treadmill',
          duration: 1800,
          distance: 4.0,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 'cardio-2',
          date: new Date('2025-12-10'),
          type: 'treadmill',
          duration: 1800,
          distance: 3.0,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]);

      const data = await getCardioDistanceData(null, null, null);

      expect(data).toHaveLength(2);
      expect(data[0].distance).toBe(3.0); // Earlier date first
      expect(data[1].distance).toBe(4.0);
    });
  });

  describe('getCardioDurationData', () => {
    it('should return empty array when no cardio sessions exist', async () => {
      const data = await getCardioDurationData(null, null, null);
      expect(data).toEqual([]);
    });

    it('should return all sessions with duration data', async () => {
      await db.cardioSessions.bulkAdd([
        {
          id: 'cardio-1',
          date: new Date('2025-12-15'),
          type: 'treadmill',
          duration: 1800, // 30 min
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 'cardio-2',
          date: new Date('2025-12-16'),
          type: 'stationary-bike',
          duration: 2400, // 40 min
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]);

      const data = await getCardioDurationData(null, null, null);

      expect(data).toHaveLength(2);
      expect(data[0].duration).toBe(1800);
      expect(data[1].duration).toBe(2400);
    });

    it('should filter by cardio type', async () => {
      await db.cardioSessions.bulkAdd([
        {
          id: 'cardio-1',
          date: new Date('2025-12-15'),
          type: 'treadmill',
          duration: 1800,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 'cardio-2',
          date: new Date('2025-12-16'),
          type: 'stationary-bike',
          duration: 2400,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]);

      const treadmillData = await getCardioDurationData('treadmill', null, null);
      expect(treadmillData).toHaveLength(1);
      expect(treadmillData[0].type).toBe('treadmill');

      const bikeData = await getCardioDurationData('stationary-bike', null, null);
      expect(bikeData).toHaveLength(1);
      expect(bikeData[0].type).toBe('stationary-bike');
    });

    it('should filter by date range', async () => {
      await db.cardioSessions.bulkAdd([
        {
          id: 'cardio-1',
          date: new Date('2025-12-01'),
          type: 'treadmill',
          duration: 1500,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 'cardio-2',
          date: new Date('2025-12-15'),
          type: 'treadmill',
          duration: 1800,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 'cardio-3',
          date: new Date('2025-12-25'),
          type: 'treadmill',
          duration: 2100,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]);

      const data = await getCardioDurationData(
        null,
        new Date('2025-12-10'),
        new Date('2025-12-20')
      );

      expect(data).toHaveLength(1);
      expect(data[0].duration).toBe(1800);
    });

    it('should sort by date ascending', async () => {
      await db.cardioSessions.bulkAdd([
        {
          id: 'cardio-1',
          date: new Date('2025-12-20'),
          type: 'treadmill',
          duration: 2400,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 'cardio-2',
          date: new Date('2025-12-10'),
          type: 'treadmill',
          duration: 1800,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]);

      const data = await getCardioDurationData(null, null, null);

      expect(data).toHaveLength(2);
      expect(data[0].duration).toBe(1800); // Earlier date first
      expect(data[1].duration).toBe(2400);
    });
  });

  describe('getCardioPaceData', () => {
    it('should return empty array when no cardio sessions exist', async () => {
      const data = await getCardioPaceData(null, null, null);
      expect(data).toEqual([]);
    });

    it('should return sessions with both distance and duration', async () => {
      await db.cardioSessions.bulkAdd([
        {
          id: 'cardio-1',
          date: new Date('2025-12-15'),
          type: 'treadmill',
          duration: 1800, // 30 min
          distance: 3.0, // 3 miles
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 'cardio-2',
          date: new Date('2025-12-16'),
          type: 'treadmill',
          duration: 2400, // 40 min
          distance: 4.0, // 4 miles
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]);

      const data = await getCardioPaceData(null, null, null);

      expect(data).toHaveLength(2);
      // Pace = minutes / distance = 30 / 3 = 10 min/mile
      expect(data[0].pace).toBe(10);
      // Speed = distance / hours = 3 / 0.5 = 6 mph
      expect(data[0].speed).toBe(6);
    });

    it('should filter out sessions without distance', async () => {
      await db.cardioSessions.bulkAdd([
        {
          id: 'cardio-1',
          date: new Date('2025-12-15'),
          type: 'treadmill',
          duration: 1800,
          distance: 3.0,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 'cardio-2',
          date: new Date('2025-12-16'),
          type: 'treadmill',
          duration: 1200,
          // No distance
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]);

      const data = await getCardioPaceData(null, null, null);

      expect(data).toHaveLength(1);
      expect(data[0].pace).toBe(10);
    });

    it('should filter by cardio type', async () => {
      await db.cardioSessions.bulkAdd([
        {
          id: 'cardio-1',
          date: new Date('2025-12-15'),
          type: 'treadmill',
          duration: 1800,
          distance: 3.0,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 'cardio-2',
          date: new Date('2025-12-16'),
          type: 'stationary-bike',
          duration: 2400,
          distance: 8.0,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]);

      const treadmillData = await getCardioPaceData('treadmill', null, null);
      expect(treadmillData).toHaveLength(1);
      expect(treadmillData[0].type).toBe('treadmill');

      const bikeData = await getCardioPaceData('stationary-bike', null, null);
      expect(bikeData).toHaveLength(1);
      expect(bikeData[0].type).toBe('stationary-bike');
    });

    it('should filter by date range', async () => {
      await db.cardioSessions.bulkAdd([
        {
          id: 'cardio-1',
          date: new Date('2025-12-01'),
          type: 'treadmill',
          duration: 1500,
          distance: 2.5,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 'cardio-2',
          date: new Date('2025-12-15'),
          type: 'treadmill',
          duration: 1800,
          distance: 3.0,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 'cardio-3',
          date: new Date('2025-12-25'),
          type: 'treadmill',
          duration: 2100,
          distance: 3.5,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]);

      const data = await getCardioPaceData(
        null,
        new Date('2025-12-10'),
        new Date('2025-12-20')
      );

      expect(data).toHaveLength(1);
      expect(data[0].pace).toBe(10); // 30 min / 3 miles = 10 min/mile
    });

    it('should sort by date ascending', async () => {
      await db.cardioSessions.bulkAdd([
        {
          id: 'cardio-1',
          date: new Date('2025-12-20'),
          type: 'treadmill',
          duration: 2400, // 40 min
          distance: 4.0,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 'cardio-2',
          date: new Date('2025-12-10'),
          type: 'treadmill',
          duration: 1800, // 30 min
          distance: 3.0,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]);

      const data = await getCardioPaceData(null, null, null);

      expect(data).toHaveLength(2);
      expect(data[0].pace).toBe(10); // Earlier date first: 30/3 = 10
      expect(data[1].pace).toBe(10); // Later date: 40/4 = 10
    });
  });

  describe('getCardioIntensityData', () => {
    it('should return empty array when no cardio sessions exist', async () => {
      const data = await getCardioIntensityData(null, null, null);
      expect(data).toEqual([]);
    });

    it('should return treadmill sessions with incline data', async () => {
      await db.cardioSessions.bulkAdd([
        {
          id: 'cardio-1',
          date: new Date('2025-12-15'),
          type: 'treadmill',
          duration: 1800,
          avgIncline: 5.0,
          maxIncline: 8.0,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 'cardio-2',
          date: new Date('2025-12-16'),
          type: 'treadmill',
          duration: 2400,
          avgIncline: 3.5,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]);

      const data = await getCardioIntensityData('treadmill', null, null);

      expect(data).toHaveLength(2);
      expect(data[0].avgIncline).toBe(5.0);
      expect(data[0].maxIncline).toBe(8.0);
      expect(data[1].avgIncline).toBe(3.5);
    });

    it('should return bike sessions with resistance data', async () => {
      await db.cardioSessions.bulkAdd([
        {
          id: 'cardio-1',
          date: new Date('2025-12-15'),
          type: 'stationary-bike',
          duration: 1800,
          avgResistance: 12,
          avgCadence: 85,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 'cardio-2',
          date: new Date('2025-12-16'),
          type: 'stationary-bike',
          duration: 2400,
          avgResistance: 15,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]);

      const data = await getCardioIntensityData('stationary-bike', null, null);

      expect(data).toHaveLength(2);
      expect(data[0].avgResistance).toBe(12);
      expect(data[0].avgCadence).toBe(85);
      expect(data[1].avgResistance).toBe(15);
    });

    it('should filter out sessions without intensity data', async () => {
      await db.cardioSessions.bulkAdd([
        {
          id: 'cardio-1',
          date: new Date('2025-12-15'),
          type: 'treadmill',
          duration: 1800,
          avgIncline: 5.0,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 'cardio-2',
          date: new Date('2025-12-16'),
          type: 'treadmill',
          duration: 1200,
          // No incline data
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]);

      const data = await getCardioIntensityData('treadmill', null, null);

      expect(data).toHaveLength(1);
      expect(data[0].avgIncline).toBe(5.0);
    });

    it('should filter by cardio type', async () => {
      await db.cardioSessions.bulkAdd([
        {
          id: 'cardio-1',
          date: new Date('2025-12-15'),
          type: 'treadmill',
          duration: 1800,
          avgIncline: 5.0,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 'cardio-2',
          date: new Date('2025-12-16'),
          type: 'stationary-bike',
          duration: 2400,
          avgResistance: 12,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]);

      const treadmillData = await getCardioIntensityData('treadmill', null, null);
      expect(treadmillData).toHaveLength(1);
      expect(treadmillData[0].type).toBe('treadmill');

      const bikeData = await getCardioIntensityData('stationary-bike', null, null);
      expect(bikeData).toHaveLength(1);
      expect(bikeData[0].type).toBe('stationary-bike');
    });

    it('should filter by date range', async () => {
      await db.cardioSessions.bulkAdd([
        {
          id: 'cardio-1',
          date: new Date('2025-12-01'),
          type: 'treadmill',
          duration: 1500,
          avgIncline: 3.0,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 'cardio-2',
          date: new Date('2025-12-15'),
          type: 'treadmill',
          duration: 1800,
          avgIncline: 5.0,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 'cardio-3',
          date: new Date('2025-12-25'),
          type: 'treadmill',
          duration: 2100,
          avgIncline: 7.0,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]);

      const data = await getCardioIntensityData(
        null,
        new Date('2025-12-10'),
        new Date('2025-12-20')
      );

      expect(data).toHaveLength(1);
      expect(data[0].avgIncline).toBe(5.0);
    });

    it('should sort by date ascending', async () => {
      await db.cardioSessions.bulkAdd([
        {
          id: 'cardio-1',
          date: new Date('2025-12-20'),
          type: 'treadmill',
          duration: 2400,
          avgIncline: 7.0,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 'cardio-2',
          date: new Date('2025-12-10'),
          type: 'treadmill',
          duration: 1800,
          avgIncline: 5.0,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]);

      const data = await getCardioIntensityData(null, null, null);

      expect(data).toHaveLength(2);
      expect(data[0].avgIncline).toBe(5.0); // Earlier date first
      expect(data[1].avgIncline).toBe(7.0);
    });
  });
});
