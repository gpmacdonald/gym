import { useState } from 'react';
import { Plus, Dumbbell, Heart, Scale } from 'lucide-react';
import { Header } from '../components/layout';
import {
  WorkoutTypeSelector,
  WorkoutLogger,
  ActivityList,
  type WorkoutType,
} from '../components/workout';
import { CardioLogger } from '../components/cardio';
import { BodyWeightLogger } from '../components/bodyweight';

export default function Home() {
  const [isWorkoutActive, setIsWorkoutActive] = useState(false);
  const [workoutType, setWorkoutType] = useState<WorkoutType>('weights');
  const [showSuccess, setShowSuccess] = useState(false);
  const [successType, setSuccessType] = useState<WorkoutType>('weights');
  const [refreshKey, setRefreshKey] = useState(0);

  const handleStartWorkout = () => {
    setIsWorkoutActive(true);
    setShowSuccess(false);
  };

  const handleCompleteWorkout = () => {
    setIsWorkoutActive(false);
    setShowSuccess(true);
    setSuccessType(workoutType);
    setRefreshKey((prev) => prev + 1); // Refresh workout list
    // Hide success message after 3 seconds
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleCancelWorkout = () => {
    setIsWorkoutActive(false);
  };

  return (
    <>
      <Header
        title="Home"
        rightAction={
          isWorkoutActive ? null : (
            <WorkoutTypeSelector value={workoutType} onChange={setWorkoutType} />
          )
        }
      />
      <div className="p-4">
        {/* Success Message */}
        {showSuccess && (
          <div className={`mb-4 p-4 border rounded-lg flex items-center gap-2 ${
            successType === 'bodyweight'
              ? 'bg-purple-500/10 border-purple-500/20 text-purple-600 dark:text-purple-400'
              : 'bg-success/10 border-success/20 text-success'
          }`}>
            {successType === 'weights' ? (
              <Dumbbell className="w-5 h-5" />
            ) : successType === 'cardio' ? (
              <Heart className="w-5 h-5" />
            ) : (
              <Scale className="w-5 h-5" />
            )}
            <span>
              {successType === 'weights'
                ? 'Workout'
                : successType === 'cardio'
                  ? 'Cardio session'
                  : 'Weight entry'} saved successfully!
            </span>
          </div>
        )}

        {/* Workout Logger or Start Button */}
        {workoutType === 'bodyweight' ? (
          // Body weight mode - always show logger directly
          <>
            <BodyWeightLogger
              onComplete={() => {
                setShowSuccess(true);
                setSuccessType('bodyweight');
                setTimeout(() => setShowSuccess(false), 3000);
              }}
            />
          </>
        ) : isWorkoutActive ? (
          workoutType === 'weights' ? (
            <WorkoutLogger
              onComplete={handleCompleteWorkout}
              onCancel={handleCancelWorkout}
            />
          ) : (
            <CardioLogger
              onComplete={handleCompleteWorkout}
              onCancel={handleCancelWorkout}
            />
          )
        ) : (
          <>
            <div className="flex flex-col items-center justify-center py-8">
              <button
                type="button"
                onClick={handleStartWorkout}
                className="flex items-center gap-3 px-6 py-4 bg-primary text-white rounded-xl font-semibold text-lg shadow-lg hover:opacity-90 transition-opacity"
              >
                <Plus className="w-6 h-6" />
                Start {workoutType === 'weights' ? 'Weight' : 'Cardio'} Workout
              </button>
              <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                Tap to begin logging your workout
              </p>
            </div>

            {/* Activity History */}
            <div className="mt-4">
              <ActivityList key={refreshKey} />
            </div>
          </>
        )}
      </div>
    </>
  );
}
