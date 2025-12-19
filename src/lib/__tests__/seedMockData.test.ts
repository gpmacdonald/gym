import { describe, it, expect, beforeEach } from 'vitest';
import { seedMockData, clearMockData, hasMockData, seedExercises } from '../seed';
import { db } from '../db';

describe('seedMockData', () => {
  beforeEach(async () => {
    // Clear all data before each test
    await db.exercises.clear();
    await db.workouts.clear();
    await db.workoutSets.clear();
    await db.cardioSessions.clear();
    // Seed exercises first (required for mock data)
    await seedExercises();
  });

  it('should create workouts', async () => {
    const result = await seedMockData();

    expect(result.workouts).toBeGreaterThan(0);
    const workouts = await db.workouts.count();
    expect(workouts).toBe(result.workouts);
  });

  it('should create workout sets', async () => {
    const result = await seedMockData();

    expect(result.sets).toBeGreaterThan(0);
    const sets = await db.workoutSets.count();
    expect(sets).toBe(result.sets);
  });

  it('should create cardio sessions', async () => {
    const result = await seedMockData();

    expect(result.cardioSessions).toBeGreaterThan(0);
    const sessions = await db.cardioSessions.count();
    expect(sessions).toBe(result.cardioSessions);
  });

  it('should create roughly 60 workouts over 3 months', async () => {
    const result = await seedMockData();

    // Should be around 60 workouts (5 per week * 12 weeks, minus future dates)
    expect(result.workouts).toBeGreaterThanOrEqual(50);
    expect(result.workouts).toBeLessThanOrEqual(65);
  });

  it('should create roughly 30 cardio sessions over 3 months', async () => {
    const result = await seedMockData();

    // Should be around 30 cardio sessions (2-3 per week * 12 weeks, minus future dates)
    expect(result.cardioSessions).toBeGreaterThanOrEqual(20);
    expect(result.cardioSessions).toBeLessThanOrEqual(40);
  });

  it('should create both treadmill and bike sessions', async () => {
    await seedMockData();

    const treadmill = await db.cardioSessions
      .filter((s) => s.type === 'treadmill')
      .count();
    const bike = await db.cardioSessions
      .filter((s) => s.type === 'stationary-bike')
      .count();

    expect(treadmill).toBeGreaterThan(0);
    expect(bike).toBeGreaterThan(0);
  });

  it('should create sets with progressive weights', async () => {
    await seedMockData();

    // Get all sets for bench press
    const exercises = await db.exercises.toArray();
    const benchPress = exercises.find((e) => e.name === 'Barbell Bench Press');

    if (benchPress) {
      const benchSets = await db.workoutSets
        .where('exerciseId')
        .equals(benchPress.id)
        .toArray();

      // Get unique weights
      const weights = [...new Set(benchSets.map((s) => s.weight))].sort(
        (a, b) => a - b
      );

      // Should have multiple different weights (progression)
      expect(weights.length).toBeGreaterThan(1);
    }
  });
});

describe('clearMockData', () => {
  beforeEach(async () => {
    await db.exercises.clear();
    await db.workouts.clear();
    await db.workoutSets.clear();
    await db.cardioSessions.clear();
    await seedExercises();
  });

  it('should clear all workout data', async () => {
    // First seed some data
    await seedMockData();

    // Verify data exists
    expect(await db.workouts.count()).toBeGreaterThan(0);
    expect(await db.workoutSets.count()).toBeGreaterThan(0);
    expect(await db.cardioSessions.count()).toBeGreaterThan(0);

    // Clear data
    await clearMockData();

    // Verify data is cleared
    expect(await db.workouts.count()).toBe(0);
    expect(await db.workoutSets.count()).toBe(0);
    expect(await db.cardioSessions.count()).toBe(0);
  });

  it('should NOT clear exercises', async () => {
    await seedMockData();
    const exerciseCountBefore = await db.exercises.count();

    await clearMockData();

    const exerciseCountAfter = await db.exercises.count();
    expect(exerciseCountAfter).toBe(exerciseCountBefore);
  });
});

describe('hasMockData', () => {
  beforeEach(async () => {
    await db.exercises.clear();
    await db.workouts.clear();
    await db.workoutSets.clear();
    await db.cardioSessions.clear();
    await seedExercises();
  });

  it('should return false when no data exists', async () => {
    expect(await hasMockData()).toBe(false);
  });

  it('should return true when workouts exist', async () => {
    await db.workouts.add({
      id: 'test-1',
      date: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    expect(await hasMockData()).toBe(true);
  });

  it('should return true when cardio sessions exist', async () => {
    await db.cardioSessions.add({
      id: 'test-1',
      type: 'treadmill',
      date: new Date(),
      duration: 1800,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    expect(await hasMockData()).toBe(true);
  });
});
