import { db } from './db';
import type { Exercise, MuscleGroup, EquipmentType, CardioType } from '../types';
import { addWorkout, addSet, addCardioSession } from './queries';

// Default exercises from PRD (46 total) with equipment types
const DEFAULT_EXERCISES: Array<{
  name: string;
  muscleGroup: MuscleGroup;
  equipmentType: EquipmentType;
}> = [
  // Chest (7)
  { name: 'Barbell Bench Press', muscleGroup: 'chest', equipmentType: 'barbell' },
  { name: 'Dumbbell Bench Press', muscleGroup: 'chest', equipmentType: 'dumbbell' },
  { name: 'Incline Barbell Bench Press', muscleGroup: 'chest', equipmentType: 'barbell' },
  { name: 'Incline Dumbbell Bench Press', muscleGroup: 'chest', equipmentType: 'dumbbell' },
  { name: 'Dumbbell Flyes', muscleGroup: 'chest', equipmentType: 'dumbbell' },
  { name: 'Cable Flyes', muscleGroup: 'chest', equipmentType: 'cable' },
  { name: 'Push-ups', muscleGroup: 'chest', equipmentType: 'bodyweight' },

  // Back (8)
  { name: 'Conventional Deadlift', muscleGroup: 'back', equipmentType: 'barbell' },
  { name: 'Barbell Row', muscleGroup: 'back', equipmentType: 'barbell' },
  { name: 'Dumbbell Row', muscleGroup: 'back', equipmentType: 'dumbbell' },
  { name: 'Pull-ups', muscleGroup: 'back', equipmentType: 'bodyweight' },
  { name: 'Lat Pulldown', muscleGroup: 'back', equipmentType: 'cable' },
  { name: 'Seated Cable Row', muscleGroup: 'back', equipmentType: 'cable' },
  { name: 'T-Bar Row', muscleGroup: 'back', equipmentType: 'barbell' },
  { name: 'Face Pulls', muscleGroup: 'back', equipmentType: 'cable' },

  // Legs (10)
  { name: 'Barbell Back Squat', muscleGroup: 'legs', equipmentType: 'barbell' },
  { name: 'Barbell Front Squat', muscleGroup: 'legs', equipmentType: 'barbell' },
  { name: 'Romanian Deadlift', muscleGroup: 'legs', equipmentType: 'barbell' },
  { name: 'Leg Press', muscleGroup: 'legs', equipmentType: 'machine' },
  { name: 'Bulgarian Split Squat', muscleGroup: 'legs', equipmentType: 'dumbbell' },
  { name: 'Lunges', muscleGroup: 'legs', equipmentType: 'dumbbell' },
  { name: 'Leg Extension', muscleGroup: 'legs', equipmentType: 'machine' },
  { name: 'Leg Curl', muscleGroup: 'legs', equipmentType: 'machine' },
  { name: 'Calf Raise', muscleGroup: 'legs', equipmentType: 'machine' },
  { name: 'Hip Thrust', muscleGroup: 'legs', equipmentType: 'barbell' },

  // Shoulders (7)
  { name: 'Overhead Press', muscleGroup: 'shoulders', equipmentType: 'barbell' },
  { name: 'Dumbbell Shoulder Press', muscleGroup: 'shoulders', equipmentType: 'dumbbell' },
  { name: 'Lateral Raises', muscleGroup: 'shoulders', equipmentType: 'dumbbell' },
  { name: 'Front Raises', muscleGroup: 'shoulders', equipmentType: 'dumbbell' },
  { name: 'Rear Delt Flyes', muscleGroup: 'shoulders', equipmentType: 'dumbbell' },
  { name: 'Upright Row', muscleGroup: 'shoulders', equipmentType: 'barbell' },
  { name: 'Arnold Press', muscleGroup: 'shoulders', equipmentType: 'dumbbell' },

  // Arms (8)
  { name: 'Barbell Curl', muscleGroup: 'arms', equipmentType: 'barbell' },
  { name: 'Dumbbell Curl', muscleGroup: 'arms', equipmentType: 'dumbbell' },
  { name: 'Hammer Curl', muscleGroup: 'arms', equipmentType: 'dumbbell' },
  { name: 'Preacher Curl', muscleGroup: 'arms', equipmentType: 'dumbbell' },
  { name: 'Tricep Pushdown', muscleGroup: 'arms', equipmentType: 'cable' },
  { name: 'Overhead Tricep Extension', muscleGroup: 'arms', equipmentType: 'dumbbell' },
  { name: 'Dips', muscleGroup: 'arms', equipmentType: 'bodyweight' },
  { name: 'Close-Grip Bench Press', muscleGroup: 'arms', equipmentType: 'barbell' },

  // Core (6)
  { name: 'Plank', muscleGroup: 'core', equipmentType: 'bodyweight' },
  { name: 'Side Plank', muscleGroup: 'core', equipmentType: 'bodyweight' },
  { name: 'Crunches', muscleGroup: 'core', equipmentType: 'bodyweight' },
  { name: 'Russian Twists', muscleGroup: 'core', equipmentType: 'bodyweight' },
  { name: 'Hanging Leg Raises', muscleGroup: 'core', equipmentType: 'bodyweight' },
  { name: 'Cable Crunches', muscleGroup: 'core', equipmentType: 'cable' },
];

/**
 * Seed the database with default exercises.
 * Only adds exercises if the database is empty (no non-custom exercises).
 * @returns The number of exercises seeded (0 if already seeded)
 */
export async function seedExercises(): Promise<number> {
  // Check if already seeded by counting non-custom exercises
  const existingCount = await db.exercises
    .filter((ex) => ex.isCustom === false)
    .count();

  if (existingCount > 0) {
    console.log('Exercises already seeded, skipping...');
    return 0;
  }

  const now = new Date();
  const exercises: Exercise[] = DEFAULT_EXERCISES.map((ex) => ({
    id: crypto.randomUUID(),
    name: ex.name,
    muscleGroup: ex.muscleGroup,
    equipmentType: ex.equipmentType,
    isCustom: false,
    createdAt: now,
  }));

  await db.exercises.bulkAdd(exercises);
  console.log(`Seeded ${exercises.length} exercises`);
  return exercises.length;
}

/**
 * Check if the exercise library has been seeded.
 */
export async function isSeeded(): Promise<boolean> {
  const count = await db.exercises
    .filter((ex) => ex.isCustom === false)
    .count();
  return count >= DEFAULT_EXERCISES.length;
}

/**
 * Get the count of default exercises.
 */
export function getDefaultExerciseCount(): number {
  return DEFAULT_EXERCISES.length;
}

/**
 * Clear all exercises and reseed (for testing/reset purposes).
 * WARNING: This will delete all custom exercises too!
 */
export async function reseedExercises(): Promise<number> {
  await db.exercises.clear();
  return seedExercises();
}

// ============================================================================
// Mock Data Seeding (for testing/demo purposes)
// ============================================================================

interface MockDataResult {
  workouts: number;
  sets: number;
  cardioSessions: number;
}

/**
 * Seed the database with realistic mock data for testing progress charts.
 * Creates ~60 weightlifting workouts and ~30 cardio sessions over 3 months.
 */
export async function seedMockData(): Promise<MockDataResult> {
  const result: MockDataResult = { workouts: 0, sets: 0, cardioSessions: 0 };

  // Get exercises for workouts
  const exercises = await db.exercises.toArray();
  const benchPress = exercises.find((e) => e.name === 'Barbell Bench Press');
  const squat = exercises.find((e) => e.name === 'Barbell Back Squat');
  const deadlift = exercises.find((e) => e.name === 'Conventional Deadlift');
  const overheadPress = exercises.find((e) => e.name === 'Overhead Press');
  const barbellRow = exercises.find((e) => e.name === 'Barbell Row');
  const latPulldown = exercises.find((e) => e.name === 'Lat Pulldown');
  const legPress = exercises.find((e) => e.name === 'Leg Press');
  const dumbbellCurl = exercises.find((e) => e.name === 'Dumbbell Curl');
  const tricepPushdown = exercises.find((e) => e.name === 'Tricep Pushdown');

  if (!benchPress || !squat || !deadlift) {
    throw new Error('Required exercises not found. Please seed exercises first.');
  }

  const now = new Date();
  const threeMonthsAgo = new Date(now);
  threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

  // Workout templates - different days focus on different muscles
  const workoutTemplates = [
    // Push Day
    {
      exercises: [
        { exercise: benchPress, baseWeight: 60, sets: 4, reps: [8, 8, 6, 6] },
        { exercise: overheadPress, baseWeight: 40, sets: 3, reps: [10, 8, 8] },
        { exercise: tricepPushdown, baseWeight: 25, sets: 3, reps: [12, 12, 10] },
      ],
    },
    // Pull Day
    {
      exercises: [
        { exercise: deadlift, baseWeight: 80, sets: 3, reps: [5, 5, 5] },
        { exercise: barbellRow, baseWeight: 50, sets: 4, reps: [8, 8, 8, 6] },
        { exercise: latPulldown, baseWeight: 45, sets: 3, reps: [10, 10, 8] },
        { exercise: dumbbellCurl, baseWeight: 12, sets: 3, reps: [12, 10, 10] },
      ],
    },
    // Leg Day
    {
      exercises: [
        { exercise: squat, baseWeight: 70, sets: 4, reps: [8, 6, 6, 5] },
        { exercise: legPress, baseWeight: 100, sets: 3, reps: [12, 10, 10] },
      ],
    },
  ];

  // Generate weightlifting workouts (5 per week for 12 weeks = ~60 workouts)
  for (let week = 0; week < 12; week++) {
    // 5 workout days per week (Mon, Tue, Wed, Fri, Sat pattern)
    const workoutDays = [0, 1, 2, 4, 5];

    for (const dayOffset of workoutDays) {
      const workoutDate = new Date(threeMonthsAgo);
      workoutDate.setDate(workoutDate.getDate() + week * 7 + dayOffset);

      // Skip if workout date is in the future
      if (workoutDate > now) continue;

      // Select template based on day pattern
      const templateIndex = dayOffset % workoutTemplates.length;
      const template = workoutTemplates[templateIndex];

      // Create workout
      const workoutId = await addWorkout({
        date: workoutDate,
        notes: week % 4 === 0 ? 'Deload week - lighter weights' : undefined,
      });
      result.workouts++;

      // Add sets for each exercise
      let setNumber = 1;
      for (const exerciseTemplate of template.exercises) {
        if (!exerciseTemplate.exercise) continue;

        // Progressive overload: increase weight by ~2.5kg every 2 weeks
        const progressionMultiplier = 1 + (week * 0.025);
        // Deload every 4th week
        const deloadMultiplier = week % 4 === 0 ? 0.85 : 1;
        const weight = Math.round(
          exerciseTemplate.baseWeight * progressionMultiplier * deloadMultiplier
        );

        for (let i = 0; i < exerciseTemplate.sets; i++) {
          // Add some variation to reps (±1)
          const baseReps = exerciseTemplate.reps[i] || exerciseTemplate.reps[0];
          const reps = baseReps + Math.floor(Math.random() * 3) - 1;

          await addSet({
            workoutId,
            exerciseId: exerciseTemplate.exercise.id,
            setNumber: setNumber++,
            weight,
            reps: Math.max(1, reps),
            rpe: i === exerciseTemplate.sets - 1 ? 8 + Math.floor(Math.random() * 2) : undefined,
          });
          result.sets++;
        }
      }
    }
  }

  // Generate cardio sessions (2-3 per week for 12 weeks = ~30 sessions)
  for (let week = 0; week < 12; week++) {
    const sessionsThisWeek = 2 + Math.floor(Math.random() * 2); // 2 or 3 sessions

    for (let session = 0; session < sessionsThisWeek; session++) {
      const sessionDate = new Date(threeMonthsAgo);
      // Spread sessions across the week (roughly every 2-3 days)
      sessionDate.setDate(sessionDate.getDate() + week * 7 + session * 3);

      // Skip if session date is in the future
      if (sessionDate > now) continue;

      // Alternate between treadmill and bike
      const type: CardioType = session % 2 === 0 ? 'treadmill' : 'stationary-bike';

      // Progressive improvement in cardio metrics
      const progressMultiplier = 1 + week * 0.02;

      if (type === 'treadmill') {
        await addCardioSession({
          date: sessionDate,
          type,
          duration: Math.round(1800 + Math.random() * 1200), // 30-50 minutes
          distance: Math.round((3 + week * 0.15) * 10) / 10, // Start at 3km, increase
          avgSpeed: Math.round((9 + week * 0.2) * 10) / 10, // Start at 9 km/h
          avgIncline: Math.round((2 + Math.random() * 3) * 10) / 10,
          maxIncline: Math.round((4 + Math.random() * 4) * 10) / 10,
          calories: Math.round(250 * progressMultiplier + Math.random() * 100),
        });
      } else {
        await addCardioSession({
          date: sessionDate,
          type,
          duration: Math.round(1800 + Math.random() * 1200), // 30-50 minutes
          distance: Math.round((8 + week * 0.3) * 10) / 10, // Bike covers more distance
          avgResistance: Math.min(20, 8 + Math.floor(week / 3)), // Start at 8, max 20
          avgCadence: Math.round(75 + Math.random() * 20), // 75-95 RPM
          calories: Math.round(220 * progressMultiplier + Math.random() * 80),
        });
      }
      result.cardioSessions++;
    }
  }

  console.log(
    `Mock data seeded: ${result.workouts} workouts, ${result.sets} sets, ${result.cardioSessions} cardio sessions`
  );
  return result;
}

/**
 * Clear all workout data (workouts, sets, cardio sessions).
 * Does NOT clear exercises or settings.
 */
export async function clearMockData(): Promise<void> {
  await db.transaction('rw', [db.workouts, db.workoutSets, db.cardioSessions], async () => {
    await db.workouts.clear();
    await db.workoutSets.clear();
    await db.cardioSessions.clear();
  });
  console.log('Mock data cleared');
}

/**
 * Check if there is any workout data in the database.
 */
export async function hasMockData(): Promise<boolean> {
  const workoutCount = await db.workouts.count();
  const cardioCount = await db.cardioSessions.count();
  return workoutCount > 0 || cardioCount > 0;
}
