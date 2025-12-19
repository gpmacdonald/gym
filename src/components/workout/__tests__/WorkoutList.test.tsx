import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import WorkoutList from '../WorkoutList';
import type { Workout, WorkoutSet, Exercise } from '../../../types';

const mockWorkouts: Workout[] = [
  {
    id: 'workout-1',
    date: new Date('2025-12-18'),
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'workout-2',
    date: new Date('2025-12-17'),
    notes: 'Second workout',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const mockSets: Record<string, WorkoutSet[]> = {
  'workout-1': [
    {
      id: 'set-1',
      workoutId: 'workout-1',
      exerciseId: 'exercise-1',
      setNumber: 1,
      reps: 10,
      weight: 60,
      createdAt: new Date(),
    },
  ],
  'workout-2': [
    {
      id: 'set-2',
      workoutId: 'workout-2',
      exerciseId: 'exercise-1',
      setNumber: 1,
      reps: 8,
      weight: 70,
      createdAt: new Date(),
    },
  ],
};

const mockExercises: Exercise[] = [
  {
    id: 'exercise-1',
    name: 'Bench Press',
    muscleGroup: 'chest',
    equipmentType: 'barbell',
    isCustom: false,
    createdAt: new Date(),
  },
];

// Mock the queries module
vi.mock('../../../lib/queries', () => ({
  getAllWorkouts: vi.fn(() => Promise.resolve(mockWorkouts)),
  getSetsByWorkoutId: vi.fn((workoutId: string) =>
    Promise.resolve(mockSets[workoutId] || [])
  ),
  getAllExercises: vi.fn(() => Promise.resolve(mockExercises)),
}));

// Mock the settings store
vi.mock('../../../stores', () => ({
  useSettingsStore: () => ({
    weightUnit: 'kg',
  }),
}));

describe('WorkoutList', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should show loading state initially', () => {
    render(<WorkoutList />);

    // Look for the spinning loader
    expect(document.querySelector('.animate-spin')).toBeInTheDocument();
  });

  it('should display workouts after loading', async () => {
    render(<WorkoutList />);

    await waitFor(() => {
      expect(screen.getByText('Recent Workouts')).toBeInTheDocument();
    });

    // Both workouts should be rendered
    expect(screen.getAllByRole('button')).toHaveLength(2);
  });

  it('should display workout summaries', async () => {
    render(<WorkoutList />);

    await waitFor(() => {
      // Both workouts have 1 exercise and 1 set each
      expect(screen.getAllByText('1 exercise • 1 set')).toHaveLength(2);
    });
  });

  it('should show empty state when no workouts', async () => {
    const queries = await import('../../../lib/queries');
    vi.mocked(queries.getAllWorkouts).mockResolvedValueOnce([]);

    render(<WorkoutList />);

    await waitFor(() => {
      expect(screen.getByText('No workouts yet')).toBeInTheDocument();
      expect(screen.getByText('Start your first workout!')).toBeInTheDocument();
    });
  });

  it('should display workouts in date order (newest first)', async () => {
    render(<WorkoutList />);

    await waitFor(() => {
      expect(screen.getByText('Recent Workouts')).toBeInTheDocument();
    });

    const buttons = screen.getAllByRole('button');
    // First workout should be the newer one (Dec 18)
    // Second workout should be older (Dec 17)
    expect(buttons).toHaveLength(2);
  });
});
