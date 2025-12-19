import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ExerciseDropdown from '../ExerciseDropdown';
import type { Exercise, WorkoutSet } from '../../../types';

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
    name: 'Squat',
    muscleGroup: 'legs',
    equipmentType: 'barbell',
    isCustom: false,
    createdAt: new Date(),
  },
  {
    id: 'exercise-3',
    name: 'Deadlift',
    muscleGroup: 'back',
    equipmentType: 'barbell',
    isCustom: false,
    createdAt: new Date(),
  },
];

const mockSets: Record<string, WorkoutSet[]> = {
  'exercise-1': [
    {
      id: 'set-1',
      workoutId: 'workout-1',
      exerciseId: 'exercise-1',
      setNumber: 1,
      reps: 10,
      weight: 100,
      createdAt: new Date('2025-12-15'),
    },
  ],
  'exercise-2': [],
  'exercise-3': [
    {
      id: 'set-2',
      workoutId: 'workout-1',
      exerciseId: 'exercise-3',
      setNumber: 1,
      reps: 5,
      weight: 150,
      createdAt: new Date('2025-12-10'),
    },
  ],
};

vi.mock('../../../lib/queries', () => ({
  getAllExercises: vi.fn(() => Promise.resolve(mockExercises)),
  getSetsByExerciseId: vi.fn((exerciseId: string) =>
    Promise.resolve(mockSets[exerciseId] || [])
  ),
}));

describe('ExerciseDropdown', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should show loading state initially', () => {
    render(<ExerciseDropdown value={null} onChange={() => {}} />);

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('should show placeholder when no exercise selected', async () => {
    render(<ExerciseDropdown value={null} onChange={() => {}} />);

    await waitFor(() => {
      expect(screen.getByText('Select exercise')).toBeInTheDocument();
    });
  });

  it('should show dropdown with exercises when clicked', async () => {
    const user = userEvent.setup();
    render(<ExerciseDropdown value={null} onChange={() => {}} />);

    await waitFor(() => {
      expect(screen.getByText('Select exercise')).toBeInTheDocument();
    });

    await user.click(screen.getByText('Select exercise'));

    await waitFor(() => {
      // Exercises appear in both Recent and All Exercises sections
      expect(screen.getAllByText('Bench Press').length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByText('Squat').length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByText('Deadlift').length).toBeGreaterThanOrEqual(1);
    });
  });

  it('should call onChange when exercise is selected', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<ExerciseDropdown value={null} onChange={handleChange} />);

    await waitFor(() => {
      expect(screen.getByText('Select exercise')).toBeInTheDocument();
    });

    await user.click(screen.getByText('Select exercise'));

    await waitFor(() => {
      expect(screen.getAllByText('Bench Press').length).toBeGreaterThanOrEqual(1);
    });

    // Click on the first Bench Press option (in Recent section)
    const benchPressOptions = screen.getAllByText('Bench Press');
    await user.click(benchPressOptions[0]);

    expect(handleChange).toHaveBeenCalledWith('exercise-1');
  });

  it('should display selected exercise name', async () => {
    render(<ExerciseDropdown value="exercise-1" onChange={() => {}} />);

    await waitFor(() => {
      expect(screen.getByText('Bench Press')).toBeInTheDocument();
    });
  });

  it('should show recent section for exercises with usage', async () => {
    const user = userEvent.setup();
    render(<ExerciseDropdown value={null} onChange={() => {}} />);

    await waitFor(() => {
      expect(screen.getByText('Select exercise')).toBeInTheDocument();
    });

    await user.click(screen.getByText('Select exercise'));

    await waitFor(() => {
      expect(screen.getByText('Recent')).toBeInTheDocument();
      expect(screen.getByText('All Exercises')).toBeInTheDocument();
    });
  });
});
