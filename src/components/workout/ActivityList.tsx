import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import {
  getAllWorkouts,
  getAllCardioSessions,
  getSetsByWorkoutId,
  getAllExercises,
} from '../../lib/queries';
import type {
  Workout,
  WorkoutSet,
  Exercise,
  CardioSession,
  Activity,
} from '../../types';
import WorkoutCard from './WorkoutCard';
import EditWorkoutModal from './EditWorkoutModal';
import { CardioCard } from '../cardio';

type FilterType = 'all' | 'weights' | 'cardio';

interface WorkoutWithData {
  workout: Workout;
  sets: WorkoutSet[];
}

export default function ActivityList() {
  const [workoutData, setWorkoutData] = useState<WorkoutWithData[]>([]);
  const [cardioSessions, setCardioSessions] = useState<CardioSession[]>([]);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [filter, setFilter] = useState<FilterType>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [editingWorkout, setEditingWorkout] = useState<WorkoutWithData | null>(null);

  useEffect(() => {
    loadActivities();
  }, []);

  async function loadActivities() {
    try {
      const [allWorkouts, allCardioSessions, allExercises] = await Promise.all([
        getAllWorkouts(),
        getAllCardioSessions(),
        getAllExercises(),
      ]);

      // Fetch sets for each workout
      const workoutsWithSets = await Promise.all(
        allWorkouts.map(async (workout) => ({
          workout,
          sets: await getSetsByWorkoutId(workout.id),
        }))
      );

      setWorkoutData(workoutsWithSets);
      setCardioSessions(allCardioSessions);
      setExercises(allExercises);
    } catch (error) {
      console.error('Failed to load activities:', error);
    } finally {
      setIsLoading(false);
    }
  }

  // Combine and sort activities by date
  const activities: Activity[] = [
    ...workoutData.map((w) => ({
      id: w.workout.id,
      type: 'workout' as const,
      date: w.workout.date,
      data: w.workout,
    })),
    ...cardioSessions.map((c) => ({
      id: c.id,
      type: 'cardio' as const,
      date: c.date,
      data: c,
    })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Apply filter
  const filteredActivities = activities.filter((a) => {
    if (filter === 'all') return true;
    if (filter === 'weights') return a.type === 'workout';
    if (filter === 'cardio') return a.type === 'cardio';
    return true;
  });

  // Helper to get workout data by id
  const getWorkoutData = (workoutId: string) => {
    return workoutData.find((w) => w.workout.id === workoutId);
  };

  const handleEditWorkout = (workoutId: string) => {
    const data = getWorkoutData(workoutId);
    if (data) {
      setEditingWorkout(data);
    }
  };

  const handleEditSaved = async () => {
    setEditingWorkout(null);
    // Reload activities to show updated data
    await loadActivities();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 text-primary animate-spin" />
      </div>
    );
  }

  const totalCount = activities.length;
  if (totalCount === 0) {
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
    <div>
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
        Recent Activity
      </h2>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-4">
        {(['all', 'weights', 'cardio'] as FilterType[]).map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition ${
              filter === f
                ? 'bg-primary text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Activity list */}
      <div className="space-y-3">
        {filteredActivities.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400">
              No {filter === 'weights' ? 'weight workouts' : 'cardio sessions'}{' '}
              yet
            </p>
          </div>
        ) : (
          filteredActivities.map((activity) =>
            activity.type === 'workout' ? (
              <WorkoutCard
                key={activity.id}
                workout={activity.data as Workout}
                sets={getWorkoutData(activity.id)?.sets || []}
                exercises={exercises}
                onEdit={() => handleEditWorkout(activity.id)}
              />
            ) : (
              <CardioCard
                key={activity.id}
                session={activity.data as CardioSession}
              />
            )
          )
        )}
      </div>

      {/* Edit Workout Modal */}
      {editingWorkout && (
        <EditWorkoutModal
          workout={editingWorkout.workout}
          sets={editingWorkout.sets}
          exercises={exercises}
          onClose={() => setEditingWorkout(null)}
          onSaved={handleEditSaved}
        />
      )}
    </div>
  );
}
