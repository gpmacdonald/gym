import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import WorkoutCard from '../WorkoutCard';
import type { Workout, WorkoutSet, Exercise } from '../../../types';

// Mock the settings store
vi.mock('../../../stores', () => ({
  useSettingsStore: () => ({
    weightUnit: 'kg',
  }),
}));

const mockWorkout: Workout = {
  id: 'workout-1',
  date: new Date('2025-12-15'),
  notes: 'Great workout!',
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockSets: WorkoutSet[] = [
  {
    id: 'set-1',
    workoutId: 'workout-1',
    exerciseId: 'exercise-1',
    setNumber: 1,
    reps: 10,
    weight: 60,
    createdAt: new Date(),
  },
  {
    id: 'set-2',
    workoutId: 'workout-1',
    exerciseId: 'exercise-1',
    setNumber: 2,
    reps: 8,
    weight: 70,
    rpe: 8,
    createdAt: new Date(),
  },
  {
    id: 'set-3',
    workoutId: 'workout-1',
    exerciseId: 'exercise-2',
    setNumber: 3,
    reps: 12,
    weight: 40,
    createdAt: new Date(),
  },
];

const mockExercises: Exercise[] = [
  {
    id: 'exercise-1',
    name: 'Bench Press',
    muscleGroup: 'chest',
    equipmentType: 'barbell',
    isCustom: false,
    createdAt: new Date(),
  },
  {
    id: 'exercise-2',
    name: 'Bicep Curl',
    muscleGroup: 'arms',
    equipmentType: 'dumbbell',
    isCustom: false,
    createdAt: new Date(),
  },
];

describe('WorkoutCard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render workout date and summary', () => {
    render(
      <WorkoutCard
        workout={mockWorkout}
        sets={mockSets}
        exercises={mockExercises}
      />
    );

    expect(screen.getByText('2 exercises • 3 sets')).toBeInTheDocument();
  });

  it('should be collapsed by default', () => {
    render(
      <WorkoutCard
        workout={mockWorkout}
        sets={mockSets}
        exercises={mockExercises}
      />
    );

    // Exercise names should not be visible when collapsed
    expect(screen.queryByText('Bench Press')).not.toBeInTheDocument();
    expect(screen.queryByText('Bicep Curl')).not.toBeInTheDocument();
  });

  it('should expand when clicked to show exercises', async () => {
    const user = userEvent.setup();
    render(
      <WorkoutCard
        workout={mockWorkout}
        sets={mockSets}
        exercises={mockExercises}
      />
    );

    await user.click(screen.getByRole('button'));

    expect(screen.getByText('Bench Press')).toBeInTheDocument();
    expect(screen.getByText('Bicep Curl')).toBeInTheDocument();
  });

  it('should display sets with weight and reps', async () => {
    const user = userEvent.setup();
    render(
      <WorkoutCard
        workout={mockWorkout}
        sets={mockSets}
        exercises={mockExercises}
      />
    );

    await user.click(screen.getByRole('button'));

    expect(screen.getByText('60kg × 10')).toBeInTheDocument();
    expect(screen.getByText(/70kg × 8/)).toBeInTheDocument();
    expect(screen.getByText('40kg × 12')).toBeInTheDocument();
  });

  it('should display RPE when provided', async () => {
    const user = userEvent.setup();
    render(
      <WorkoutCard
        workout={mockWorkout}
        sets={mockSets}
        exercises={mockExercises}
      />
    );

    await user.click(screen.getByRole('button'));

    expect(screen.getByText(/@8/)).toBeInTheDocument();
  });

  it('should display workout notes when expanded', async () => {
    const user = userEvent.setup();
    render(
      <WorkoutCard
        workout={mockWorkout}
        sets={mockSets}
        exercises={mockExercises}
      />
    );

    await user.click(screen.getByRole('button'));

    expect(screen.getByText('Great workout!')).toBeInTheDocument();
  });

  it('should collapse when clicked again', async () => {
    const user = userEvent.setup();
    render(
      <WorkoutCard
        workout={mockWorkout}
        sets={mockSets}
        exercises={mockExercises}
      />
    );

    // Expand
    await user.click(screen.getByRole('button'));
    expect(screen.getByText('Bench Press')).toBeInTheDocument();

    // Collapse
    await user.click(screen.getByRole('button'));
    expect(screen.queryByText('Bench Press')).not.toBeInTheDocument();
  });

  it('should handle singular exercise/set correctly', () => {
    const singleSet: WorkoutSet[] = [
      {
        id: 'set-1',
        workoutId: 'workout-1',
        exerciseId: 'exercise-1',
        setNumber: 1,
        reps: 10,
        weight: 60,
        createdAt: new Date(),
      },
    ];

    render(
      <WorkoutCard
        workout={mockWorkout}
        sets={singleSet}
        exercises={mockExercises}
      />
    );

    expect(screen.getByText('1 exercise • 1 set')).toBeInTheDocument();
  });
});
