import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ActivityList from '../ActivityList';
import type { Workout, WorkoutSet, Exercise, CardioSession } from '../../../types';

const mockWorkouts: Workout[] = [
  {
    id: 'workout-1',
    date: new Date('2025-12-18'),
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

const mockCardioSessions: CardioSession[] = [
  {
    id: 'cardio-1',
    type: 'treadmill',
    date: new Date('2025-12-19'),
    duration: 1800,
    distance: 5,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'cardio-2',
    type: 'stationary-bike',
    date: new Date('2025-12-17'),
    duration: 2400,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

// Mock the queries module
vi.mock('../../../lib/queries', () => ({
  getAllWorkouts: vi.fn(() => Promise.resolve(mockWorkouts)),
  getSetsByWorkoutId: vi.fn((workoutId: string) =>
    Promise.resolve(mockSets[workoutId] || [])
  ),
  getAllExercises: vi.fn(() => Promise.resolve(mockExercises)),
  getAllCardioSessions: vi.fn(() => Promise.resolve(mockCardioSessions)),
}));

// Mock the settings store
vi.mock('../../../stores', () => ({
  useSettingsStore: () => ({
    weightUnit: 'kg',
    distanceUnit: 'km',
  }),
}));

describe('ActivityList', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should show loading state initially', () => {
    render(<ActivityList />);

    expect(document.querySelector('.animate-spin')).toBeInTheDocument();
  });

  it('should display activities after loading', async () => {
    render(<ActivityList />);

    await waitFor(() => {
      expect(screen.getByText('Recent Activity')).toBeInTheDocument();
    });

    // Should have filter buttons
    expect(screen.getByText('All')).toBeInTheDocument();
    expect(screen.getByText('Weights')).toBeInTheDocument();
    expect(screen.getByText('Cardio')).toBeInTheDocument();
  });

  it('should display both workouts and cardio sessions', async () => {
    render(<ActivityList />);

    await waitFor(() => {
      // Cardio session
      expect(screen.getByText('Treadmill')).toBeInTheDocument();
      expect(screen.getByText('Stationary Bike')).toBeInTheDocument();
      // Weight workout - check for the summary
      expect(screen.getByText('1 exercise • 1 set')).toBeInTheDocument();
    });
  });

  it('should sort activities by date (newest first)', async () => {
    render(<ActivityList />);

    await waitFor(() => {
      expect(screen.getByText('Treadmill')).toBeInTheDocument();
    });

    const buttons = screen.getAllByRole('button');
    // First activity button should be cardio-1 (Dec 19), not the filter buttons
    // Filter buttons are All, Weights, Cardio, then activity buttons
    const activityButtons = buttons.filter(
      (b) =>
        !['All', 'Weights', 'Cardio'].includes(b.textContent?.trim() || '')
    );
    expect(activityButtons.length).toBe(3); // 2 cardio + 1 workout
  });

  it('should filter to show only weights when Weights filter is clicked', async () => {
    const user = userEvent.setup();
    render(<ActivityList />);

    await waitFor(() => {
      expect(screen.getByText('Weights')).toBeInTheDocument();
    });

    await user.click(screen.getByText('Weights'));

    // Should show workout
    expect(screen.getByText('1 exercise • 1 set')).toBeInTheDocument();
    // Should not show cardio
    expect(screen.queryByText('Treadmill')).not.toBeInTheDocument();
    expect(screen.queryByText('Stationary Bike')).not.toBeInTheDocument();
  });

  it('should filter to show only cardio when Cardio filter is clicked', async () => {
    const user = userEvent.setup();
    render(<ActivityList />);

    await waitFor(() => {
      expect(screen.getByText('Cardio')).toBeInTheDocument();
    });

    await user.click(screen.getByText('Cardio'));

    // Should show cardio sessions
    expect(screen.getByText('Treadmill')).toBeInTheDocument();
    expect(screen.getByText('Stationary Bike')).toBeInTheDocument();
    // Should not show workout
    expect(screen.queryByText('1 exercise • 1 set')).not.toBeInTheDocument();
  });

  it('should show all activities when All filter is clicked', async () => {
    const user = userEvent.setup();
    render(<ActivityList />);

    await waitFor(() => {
      expect(screen.getByText('Cardio')).toBeInTheDocument();
    });

    // First filter to cardio
    await user.click(screen.getByText('Cardio'));
    expect(screen.queryByText('1 exercise • 1 set')).not.toBeInTheDocument();

    // Then back to all
    await user.click(screen.getByText('All'));

    // Should show everything
    expect(screen.getByText('Treadmill')).toBeInTheDocument();
    expect(screen.getByText('1 exercise • 1 set')).toBeInTheDocument();
  });

  it('should show empty state when no activities exist', async () => {
    const queries = await import('../../../lib/queries');
    vi.mocked(queries.getAllWorkouts).mockResolvedValueOnce([]);
    vi.mocked(queries.getAllCardioSessions).mockResolvedValueOnce([]);

    render(<ActivityList />);

    await waitFor(() => {
      expect(screen.getByText('No workouts yet')).toBeInTheDocument();
      expect(screen.getByText('Start your first workout!')).toBeInTheDocument();
    });
  });
});
