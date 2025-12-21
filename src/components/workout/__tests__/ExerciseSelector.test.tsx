import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ExerciseSelector from '../ExerciseSelector';
import type { Exercise } from '../../../types';

// Mock exercises
const mockExercises: Exercise[] = [
  {
    id: '1',
    name: 'Bench Press',
    muscleGroup: 'chest',
    equipmentType: 'barbell',
    isCustom: false,
    createdAt: new Date(),
  },
  {
    id: '2',
    name: 'Squat',
    muscleGroup: 'legs',
    equipmentType: 'barbell',
    isCustom: false,
    createdAt: new Date(),
  },
  {
    id: '3',
    name: 'Deadlift',
    muscleGroup: 'back',
    equipmentType: 'barbell',
    isCustom: false,
    createdAt: new Date(),
  },
  {
    id: '4',
    name: 'Bicep Curl',
    muscleGroup: 'arms',
    equipmentType: 'dumbbell',
    isCustom: false,
    createdAt: new Date(),
  },
  {
    id: '5',
    name: 'Push-ups',
    muscleGroup: 'chest',
    equipmentType: 'bodyweight',
    isCustom: false,
    createdAt: new Date(),
  },
];

// Mock the queries module
vi.mock('../../../lib/queries', () => ({
  getAllExercises: vi.fn(() => Promise.resolve(mockExercises)),
}));

describe('ExerciseSelector', () => {
  const mockOnSelect = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should show loading state initially', () => {
    render(<ExerciseSelector onSelect={mockOnSelect} />);
    expect(screen.getByText('Loading exercises...')).toBeInTheDocument();
  });

  it('should render list of exercises after loading', async () => {
    render(<ExerciseSelector onSelect={mockOnSelect} />);

    await waitFor(() => {
      expect(screen.getByText('Bench Press')).toBeInTheDocument();
    });

    expect(screen.getByText('Squat')).toBeInTheDocument();
    expect(screen.getByText('Deadlift')).toBeInTheDocument();
    expect(screen.getByText('Bicep Curl')).toBeInTheDocument();
    expect(screen.getByText('Push-ups')).toBeInTheDocument();
  });

  it('should filter exercises by search query', async () => {
    const user = userEvent.setup();
    render(<ExerciseSelector onSelect={mockOnSelect} />);

    await waitFor(() => {
      expect(screen.getByText('Bench Press')).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText('Search exercises...');
    await user.type(searchInput, 'bench');

    // Wait for debounce to apply filter
    await waitFor(() => {
      expect(screen.queryByText('Squat')).not.toBeInTheDocument();
    });
    expect(screen.getByText('Bench Press')).toBeInTheDocument();
    expect(screen.queryByText('Deadlift')).not.toBeInTheDocument();
  });

  it('should filter exercises by muscle group', async () => {
    const user = userEvent.setup();
    render(<ExerciseSelector onSelect={mockOnSelect} />);

    await waitFor(() => {
      expect(screen.getByText('Bench Press')).toBeInTheDocument();
    });

    const chestButton = screen.getByRole('button', { name: 'chest' });
    await user.click(chestButton);

    expect(screen.getByText('Bench Press')).toBeInTheDocument();
    expect(screen.getByText('Push-ups')).toBeInTheDocument();
    expect(screen.queryByText('Squat')).not.toBeInTheDocument();
    expect(screen.queryByText('Deadlift')).not.toBeInTheDocument();
  });

  it('should toggle muscle group filter off when clicked again', async () => {
    const user = userEvent.setup();
    render(<ExerciseSelector onSelect={mockOnSelect} />);

    await waitFor(() => {
      expect(screen.getByText('Bench Press')).toBeInTheDocument();
    });

    const chestButton = screen.getByRole('button', { name: 'chest' });
    await user.click(chestButton);

    // Verify filter is applied
    expect(screen.queryByText('Squat')).not.toBeInTheDocument();

    // Click again to toggle off
    await user.click(chestButton);

    // All exercises should be visible again
    expect(screen.getByText('Squat')).toBeInTheDocument();
    expect(screen.getByText('Deadlift')).toBeInTheDocument();
  });

  it('should call onSelect when an exercise is clicked', async () => {
    const user = userEvent.setup();
    render(<ExerciseSelector onSelect={mockOnSelect} />);

    await waitFor(() => {
      expect(screen.getByText('Bench Press')).toBeInTheDocument();
    });

    await user.click(screen.getByText('Bench Press'));

    expect(mockOnSelect).toHaveBeenCalledWith(mockExercises[0]);
  });

  it('should show "No exercises found" when search has no results', async () => {
    const user = userEvent.setup();
    render(<ExerciseSelector onSelect={mockOnSelect} />);

    await waitFor(() => {
      expect(screen.getByText('Bench Press')).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText('Search exercises...');
    await user.type(searchInput, 'xyz nonexistent');

    // Wait for debounce
    await waitFor(() => {
      expect(screen.getByText('No exercises found')).toBeInTheDocument();
    });
  });

  it('should clear search when X button is clicked', async () => {
    const user = userEvent.setup();
    render(<ExerciseSelector onSelect={mockOnSelect} />);

    await waitFor(() => {
      expect(screen.getByText('Bench Press')).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText('Search exercises...');
    await user.type(searchInput, 'bench');

    // Wait for debounce to filter
    await waitFor(() => {
      expect(screen.queryByText('Squat')).not.toBeInTheDocument();
    });

    const clearButton = screen.getByLabelText('Clear search');
    await user.click(clearButton);

    // Wait for debounce to clear filter
    await waitFor(() => {
      expect(screen.getByText('Squat')).toBeInTheDocument();
    });
    expect(searchInput).toHaveValue('');
  });

  it('should show recently used exercises first', async () => {
    render(
      <ExerciseSelector
        onSelect={mockOnSelect}
        recentExerciseIds={['3', '2']} // Deadlift, then Squat
      />
    );

    await waitFor(() => {
      expect(screen.getByText('Bench Press')).toBeInTheDocument();
    });

    // Get all exercise buttons (they have both exercise name and muscle group in text)
    // The exercise list buttons are inside the scrollable div
    const exerciseList = document.querySelector('.max-h-64');
    const exerciseButtons = exerciseList?.querySelectorAll('button');

    expect(exerciseButtons).toBeDefined();
    expect(exerciseButtons!.length).toBe(5);

    // First exercise in list should be Deadlift (id: 3)
    expect(exerciseButtons![0]).toHaveTextContent('Deadlift');
    // Second should be Squat (id: 2)
    expect(exerciseButtons![1]).toHaveTextContent('Squat');
  });

  it('should render all muscle group filter chips', async () => {
    render(<ExerciseSelector onSelect={mockOnSelect} />);

    await waitFor(() => {
      expect(screen.getByText('Bench Press')).toBeInTheDocument();
    });

    expect(screen.getByRole('button', { name: 'chest' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'back' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'legs' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'shoulders' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'arms' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'core' })).toBeInTheDocument();
  });
});
