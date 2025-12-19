import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { getAllWorkouts, getSetsByWorkoutId, getAllExercises } from '../../lib/queries';
import type { Workout, WorkoutSet, Exercise } from '../../types';
import WorkoutCard from './WorkoutCard';

interface WorkoutWithData {
  workout: Workout;
  sets: WorkoutSet[];
}

export default function WorkoutList() {
  const [workouts, setWorkouts] = useState<WorkoutWithData[]>([]);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadWorkouts();
  }, []);

  async function loadWorkouts() {
    try {
      // Fetch all workouts (already sorted by date descending)
      const allWorkouts = await getAllWorkouts();
      const allExercises = await getAllExercises();

      // Fetch sets for each workout
      const workoutsWithSets = await Promise.all(
        allWorkouts.map(async (workout) => ({
          workout,
          sets: await getSetsByWorkoutId(workout.id),
        }))
      );

      setWorkouts(workoutsWithSets);
      setExercises(allExercises);
    } catch (error) {
      console.error('Failed to load workouts:', error);
    } finally {
      setIsLoading(false);
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 text-primary animate-spin" />
      </div>
    );
  }

  if (workouts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400">No workouts yet</p>
        <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
          Start your first workout!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
        Recent Workouts
      </h2>
      {workouts.map(({ workout, sets }) => (
        <WorkoutCard
          key={workout.id}
          workout={workout}
          sets={sets}
          exercises={exercises}
        />
      ))}
    </div>
  );
}
