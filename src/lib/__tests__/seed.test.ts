import { describe, it, expect, beforeEach } from 'vitest';
import { db } from '../db';
import {
  seedExercises,
  isSeeded,
  getDefaultExerciseCount,
  reseedExercises,
} from '../seed';

describe('Exercise Seeding', () => {
  beforeEach(async () => {
    await db.exercises.clear();
  });

  it('should return correct default exercise count', () => {
    const count = getDefaultExerciseCount();
    expect(count).toBe(149);
  });

  it('should seed all exercises', async () => {
    const seededCount = await seedExercises();
    expect(seededCount).toBe(149);

    const exercises = await db.exercises.toArray();
    expect(exercises).toHaveLength(149);
  });

  it('should mark all seeded exercises as non-custom', async () => {
    await seedExercises();

    const exercises = await db.exercises.toArray();
    exercises.forEach((ex) => {
      expect(ex.isCustom).toBe(false);
    });
  });

  it('should have correct muscle group distribution', async () => {
    await seedExercises();

    const chest = await db.exercises
      .where('muscleGroup')
      .equals('chest')
      .count();
    const back = await db.exercises.where('muscleGroup').equals('back').count();
    const legs = await db.exercises.where('muscleGroup').equals('legs').count();
    const shoulders = await db.exercises
      .where('muscleGroup')
      .equals('shoulders')
      .count();
    const arms = await db.exercises.where('muscleGroup').equals('arms').count();
    const core = await db.exercises.where('muscleGroup').equals('core').count();

    expect(chest).toBe(15);
    expect(back).toBe(26);
    expect(legs).toBe(36);
    expect(shoulders).toBe(18);
    expect(arms).toBe(34);
    expect(core).toBe(20);
  });

  it('should not reseed if already seeded', async () => {
    const firstSeed = await seedExercises();
    expect(firstSeed).toBe(149);

    const secondSeed = await seedExercises();
    expect(secondSeed).toBe(0);

    const exercises = await db.exercises.toArray();
    expect(exercises).toHaveLength(149);
  });

  it('should report isSeeded correctly', async () => {
    expect(await isSeeded()).toBe(false);

    await seedExercises();

    expect(await isSeeded()).toBe(true);
  });

  it('should not interfere with custom exercises when checking isSeeded', async () => {
    // Add a custom exercise
    await db.exercises.add({
      id: 'custom-1',
      name: 'My Custom Exercise',
      muscleGroup: 'chest',
      equipmentType: 'dumbbell',
      isCustom: true,
      createdAt: new Date(),
    });

    // Should still report as not seeded
    expect(await isSeeded()).toBe(false);

    // Seed should still work
    const seededCount = await seedExercises();
    expect(seededCount).toBe(149);

    // Custom exercise should still exist
    const allExercises = await db.exercises.toArray();
    expect(allExercises).toHaveLength(150); // 149 default + 1 custom
  });

  it('should reseed exercises (clearing all)', async () => {
    await seedExercises();

    // Add a custom exercise
    await db.exercises.add({
      id: 'custom-1',
      name: 'My Custom Exercise',
      muscleGroup: 'arms',
      equipmentType: 'cable',
      isCustom: true,
      createdAt: new Date(),
    });

    const beforeReseed = await db.exercises.count();
    expect(beforeReseed).toBe(150);

    // Reseed clears everything
    const reseededCount = await reseedExercises();
    expect(reseededCount).toBe(149);

    const afterReseed = await db.exercises.count();
    expect(afterReseed).toBe(149);
  });

  it('should include specific exercises from PRD', async () => {
    await seedExercises();

    // Check for some specific exercises mentioned in PRD
    const benchPress = await db.exercises
      .where('name')
      .equals('Barbell Bench Press')
      .first();
    expect(benchPress).toBeDefined();
    expect(benchPress?.muscleGroup).toBe('chest');

    const squat = await db.exercises
      .where('name')
      .equals('Barbell Back Squat')
      .first();
    expect(squat).toBeDefined();
    expect(squat?.muscleGroup).toBe('legs');

    const deadlift = await db.exercises
      .where('name')
      .equals('Conventional Deadlift')
      .first();
    expect(deadlift).toBeDefined();
    expect(deadlift?.muscleGroup).toBe('back');

    const ohp = await db.exercises
      .where('name')
      .equals('Overhead Press')
      .first();
    expect(ohp).toBeDefined();
    expect(ohp?.muscleGroup).toBe('shoulders');
  });

  it('should generate unique IDs for each exercise', async () => {
    await seedExercises();

    const exercises = await db.exercises.toArray();
    const ids = exercises.map((ex) => ex.id);
    const uniqueIds = new Set(ids);

    expect(uniqueIds.size).toBe(exercises.length);
  });

  it('should set createdAt date for all exercises', async () => {
    const before = new Date();
    await seedExercises();
    const after = new Date();

    const exercises = await db.exercises.toArray();
    exercises.forEach((ex) => {
      expect(ex.createdAt.getTime()).toBeGreaterThanOrEqual(before.getTime());
      expect(ex.createdAt.getTime()).toBeLessThanOrEqual(after.getTime());
    });
  });
});
