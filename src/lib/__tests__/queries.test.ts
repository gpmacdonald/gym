import { describe, it, expect, beforeEach } from 'vitest';
import { db } from '../db';
import {
  // Exercise queries
  getAllExercises,
  getExerciseById,
  getExercisesByMuscleGroup,
  searchExercises,
  addExercise,
  updateExercise,
  deleteExercise,
  // Workout queries
  getAllWorkouts,
  getWorkoutById,
  getWorkoutsByDateRange,
  getWorkoutsByDate,
  addWorkout,
  updateWorkout,
  deleteWorkout,
  // Set queries
  getSetsByWorkoutId,
  getSetsByExerciseId,
  addSet,
  updateSet,
  deleteSet,
  // Cardio queries
  getAllCardioSessions,
  getCardioSessionById,
  getCardioSessionsByType,
  getCardioSessionsByDateRange,
  addCardioSession,
  updateCardioSession,
  deleteCardioSession,
} from '../queries';

describe('Query Functions', () => {
  beforeEach(async () => {
    // Clear all tables before each test
    await db.exercises.clear();
    await db.workouts.clear();
    await db.workoutSets.clear();
    await db.cardioSessions.clear();
  });

  // ==========================================================================
  // Exercise Queries
  // ==========================================================================

  describe('Exercise Queries', () => {
    it('should add and retrieve all exercises sorted by name', async () => {
      await addExercise({
        name: 'Squat',
        muscleGroup: 'legs',
        equipmentType: 'barbell',
        isCustom: false,
      });
      await addExercise({
        name: 'Bench Press',
        muscleGroup: 'chest',
        equipmentType: 'barbell',
        isCustom: false,
      });
      await addExercise({
        name: 'Deadlift',
        muscleGroup: 'back',
        equipmentType: 'barbell',
        isCustom: false,
      });

      const exercises = await getAllExercises();
      expect(exercises).toHaveLength(3);
      expect(exercises[0].name).toBe('Bench Press');
      expect(exercises[1].name).toBe('Deadlift');
      expect(exercises[2].name).toBe('Squat');
    });

    it('should get exercise by ID', async () => {
      const id = await addExercise({
        name: 'Pull-ups',
        muscleGroup: 'back',
        equipmentType: 'bodyweight',
        isCustom: false,
      });

      const exercise = await getExerciseById(id);
      expect(exercise).toBeDefined();
      expect(exercise?.name).toBe('Pull-ups');
    });

    it('should return undefined for non-existent exercise ID', async () => {
      const exercise = await getExerciseById('non-existent-id');
      expect(exercise).toBeUndefined();
    });

    it('should get exercises by muscle group', async () => {
      await addExercise({
        name: 'Bench Press',
        muscleGroup: 'chest',
        equipmentType: 'barbell',
        isCustom: false,
      });
      await addExercise({
        name: 'Incline Press',
        muscleGroup: 'chest',
        equipmentType: 'dumbbell',
        isCustom: false,
      });
      await addExercise({
        name: 'Squat',
        muscleGroup: 'legs',
        equipmentType: 'barbell',
        isCustom: false,
      });

      const chestExercises = await getExercisesByMuscleGroup('chest');
      expect(chestExercises).toHaveLength(2);
      chestExercises.forEach((ex) => expect(ex.muscleGroup).toBe('chest'));
    });

    it('should search exercises by name (case-insensitive)', async () => {
      await addExercise({
        name: 'Barbell Bench Press',
        muscleGroup: 'chest',
        equipmentType: 'barbell',
        isCustom: false,
      });
      await addExercise({
        name: 'Dumbbell Bench Press',
        muscleGroup: 'chest',
        equipmentType: 'dumbbell',
        isCustom: false,
      });
      await addExercise({
        name: 'Squat',
        muscleGroup: 'legs',
        equipmentType: 'barbell',
        isCustom: false,
      });

      const results = await searchExercises('bench');
      expect(results).toHaveLength(2);

      const results2 = await searchExercises('BENCH');
      expect(results2).toHaveLength(2);
    });

    it('should update an exercise', async () => {
      const id = await addExercise({
        name: 'Original',
        muscleGroup: 'chest',
        equipmentType: 'machine',
        isCustom: true,
      });

      await updateExercise(id, { name: 'Updated' });

      const exercise = await getExerciseById(id);
      expect(exercise?.name).toBe('Updated');
    });

    it('should throw error when updating non-existent exercise', async () => {
      await expect(
        updateExercise('non-existent', { name: 'Test' })
      ).rejects.toThrow('Exercise with id non-existent not found');
    });

    it('should delete an exercise', async () => {
      const id = await addExercise({
        name: 'To Delete',
        muscleGroup: 'arms',
        equipmentType: 'cable',
        isCustom: true,
      });

      await deleteExercise(id);

      const exercise = await getExerciseById(id);
      expect(exercise).toBeUndefined();
    });
  });

  // ==========================================================================
  // Workout Queries
  // ==========================================================================

  describe('Workout Queries', () => {
    it('should add and retrieve all workouts sorted by date (newest first)', async () => {
      await addWorkout({ date: new Date('2024-01-10') });
      await addWorkout({ date: new Date('2024-01-15') });
      await addWorkout({ date: new Date('2024-01-05') });

      const workouts = await getAllWorkouts();
      expect(workouts).toHaveLength(3);
      expect(workouts[0].date.getTime()).toBeGreaterThan(
        workouts[1].date.getTime()
      );
    });

    it('should get workout by ID', async () => {
      const id = await addWorkout({
        date: new Date(),
        notes: 'Test workout',
      });

      const workout = await getWorkoutById(id);
      expect(workout).toBeDefined();
      expect(workout?.notes).toBe('Test workout');
    });

    it('should get workouts by date range', async () => {
      await addWorkout({ date: new Date('2024-01-05') });
      await addWorkout({ date: new Date('2024-01-15') });
      await addWorkout({ date: new Date('2024-01-25') });

      const workouts = await getWorkoutsByDateRange(
        new Date('2024-01-10'),
        new Date('2024-01-20')
      );
      expect(workouts).toHaveLength(1);
    });

    it('should get workouts for a specific date', async () => {
      const targetDate = new Date('2024-01-15');
      targetDate.setHours(10, 30, 0, 0);

      await addWorkout({ date: targetDate });
      await addWorkout({ date: new Date('2024-01-14') });

      const workouts = await getWorkoutsByDate(new Date('2024-01-15'));
      expect(workouts).toHaveLength(1);
    });

    it('should update a workout with updatedAt timestamp', async () => {
      const id = await addWorkout({ date: new Date(), notes: 'Original' });

      const original = await getWorkoutById(id);
      const originalUpdatedAt = original?.updatedAt;

      // Wait a bit to ensure timestamp difference
      await new Promise((resolve) => setTimeout(resolve, 10));

      await updateWorkout(id, { notes: 'Updated' });

      const updated = await getWorkoutById(id);
      expect(updated?.notes).toBe('Updated');
      expect(updated?.updatedAt.getTime()).toBeGreaterThan(
        originalUpdatedAt!.getTime()
      );
    });

    it('should throw error when updating non-existent workout', async () => {
      await expect(
        updateWorkout('non-existent', { notes: 'Test' })
      ).rejects.toThrow('Workout with id non-existent not found');
    });

    it('should delete a workout and its associated sets', async () => {
      const workoutId = await addWorkout({ date: new Date() });
      await addSet({
        workoutId,
        exerciseId: 'ex-1',
        setNumber: 1,
        reps: 10,
        weight: 100,
      });
      await addSet({
        workoutId,
        exerciseId: 'ex-1',
        setNumber: 2,
        reps: 8,
        weight: 110,
      });

      await deleteWorkout(workoutId);

      const workout = await getWorkoutById(workoutId);
      expect(workout).toBeUndefined();

      const sets = await getSetsByWorkoutId(workoutId);
      expect(sets).toHaveLength(0);
    });
  });

  // ==========================================================================
  // Workout Set Queries
  // ==========================================================================

  describe('Workout Set Queries', () => {
    it('should add and retrieve sets for a workout sorted by set number', async () => {
      const workoutId = 'workout-1';
      await addSet({
        workoutId,
        exerciseId: 'ex-1',
        setNumber: 3,
        reps: 6,
        weight: 135,
      });
      await addSet({
        workoutId,
        exerciseId: 'ex-1',
        setNumber: 1,
        reps: 10,
        weight: 115,
      });
      await addSet({
        workoutId,
        exerciseId: 'ex-1',
        setNumber: 2,
        reps: 8,
        weight: 125,
      });

      const sets = await getSetsByWorkoutId(workoutId);
      expect(sets).toHaveLength(3);
      expect(sets[0].setNumber).toBe(1);
      expect(sets[1].setNumber).toBe(2);
      expect(sets[2].setNumber).toBe(3);
    });

    it('should get sets by exercise ID across workouts', async () => {
      const exerciseId = 'bench-press';
      await addSet({
        workoutId: 'w-1',
        exerciseId,
        setNumber: 1,
        reps: 10,
        weight: 135,
      });
      await addSet({
        workoutId: 'w-2',
        exerciseId,
        setNumber: 1,
        reps: 8,
        weight: 155,
      });
      await addSet({
        workoutId: 'w-1',
        exerciseId: 'squat',
        setNumber: 1,
        reps: 10,
        weight: 225,
      });

      const sets = await getSetsByExerciseId(exerciseId);
      expect(sets).toHaveLength(2);
      sets.forEach((set) => expect(set.exerciseId).toBe(exerciseId));
    });

    it('should update a set', async () => {
      const id = await addSet({
        workoutId: 'w-1',
        exerciseId: 'ex-1',
        setNumber: 1,
        reps: 10,
        weight: 100,
      });

      await updateSet(id, { reps: 12, weight: 110 });

      const sets = await getSetsByWorkoutId('w-1');
      expect(sets[0].reps).toBe(12);
      expect(sets[0].weight).toBe(110);
    });

    it('should throw error when updating non-existent set', async () => {
      await expect(updateSet('non-existent', { reps: 10 })).rejects.toThrow(
        'WorkoutSet with id non-existent not found'
      );
    });

    it('should delete a set', async () => {
      const id = await addSet({
        workoutId: 'w-1',
        exerciseId: 'ex-1',
        setNumber: 1,
        reps: 10,
        weight: 100,
      });

      await deleteSet(id);

      const sets = await getSetsByWorkoutId('w-1');
      expect(sets).toHaveLength(0);
    });
  });

  // ==========================================================================
  // Cardio Session Queries
  // ==========================================================================

  describe('Cardio Session Queries', () => {
    it('should add and retrieve all cardio sessions sorted by date', async () => {
      await addCardioSession({
        date: new Date('2024-01-10'),
        type: 'treadmill',
        duration: 1800,
      });
      await addCardioSession({
        date: new Date('2024-01-15'),
        type: 'stationary-bike',
        duration: 2400,
      });

      const sessions = await getAllCardioSessions();
      expect(sessions).toHaveLength(2);
      expect(sessions[0].date.getTime()).toBeGreaterThan(
        sessions[1].date.getTime()
      );
    });

    it('should get cardio session by ID', async () => {
      const id = await addCardioSession({
        date: new Date(),
        type: 'treadmill',
        duration: 1800,
        distance: 2.5,
        notes: 'Morning run',
      });

      const session = await getCardioSessionById(id);
      expect(session).toBeDefined();
      expect(session?.notes).toBe('Morning run');
    });

    it('should get cardio sessions by type', async () => {
      await addCardioSession({
        date: new Date(),
        type: 'treadmill',
        duration: 1800,
      });
      await addCardioSession({
        date: new Date(),
        type: 'stationary-bike',
        duration: 2400,
      });
      await addCardioSession({
        date: new Date(),
        type: 'treadmill',
        duration: 1200,
      });

      const treadmillSessions = await getCardioSessionsByType('treadmill');
      expect(treadmillSessions).toHaveLength(2);
      treadmillSessions.forEach((s) => expect(s.type).toBe('treadmill'));
    });

    it('should get cardio sessions by date range', async () => {
      await addCardioSession({
        date: new Date('2024-01-05'),
        type: 'treadmill',
        duration: 1800,
      });
      await addCardioSession({
        date: new Date('2024-01-15'),
        type: 'treadmill',
        duration: 1800,
      });
      await addCardioSession({
        date: new Date('2024-01-25'),
        type: 'treadmill',
        duration: 1800,
      });

      const sessions = await getCardioSessionsByDateRange(
        new Date('2024-01-10'),
        new Date('2024-01-20')
      );
      expect(sessions).toHaveLength(1);
    });

    it('should update a cardio session with updatedAt timestamp', async () => {
      const id = await addCardioSession({
        date: new Date(),
        type: 'treadmill',
        duration: 1800,
      });

      const original = await getCardioSessionById(id);
      await new Promise((resolve) => setTimeout(resolve, 10));

      await updateCardioSession(id, { duration: 2400 });

      const updated = await getCardioSessionById(id);
      expect(updated?.duration).toBe(2400);
      expect(updated?.updatedAt.getTime()).toBeGreaterThan(
        original!.updatedAt.getTime()
      );
    });

    it('should throw error when updating non-existent cardio session', async () => {
      await expect(
        updateCardioSession('non-existent', { duration: 1800 })
      ).rejects.toThrow('CardioSession with id non-existent not found');
    });

    it('should delete a cardio session', async () => {
      const id = await addCardioSession({
        date: new Date(),
        type: 'treadmill',
        duration: 1800,
      });

      await deleteCardioSession(id);

      const session = await getCardioSessionById(id);
      expect(session).toBeUndefined();
    });
  });
});
