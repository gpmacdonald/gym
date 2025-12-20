import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import WorkoutLogger from '../WorkoutLogger';
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
];

// Mock the queries module
vi.mock('../../../lib/queries', () => ({
  getAllExercises: vi.fn(() => Promise.resolve(mockExercises)),
  addWorkout: vi.fn(() => Promise.resolve('workout-1')),
  addSet: vi.fn(() => Promise.resolve('set-1')),
}));

// Mock the stores module
vi.mock('../../../stores', () => ({
  useSettingsStore: () => ({
    weightUnit: 'kg',
  }),
}));

// Mock the PWA module
vi.mock('../../../lib/pwa', () => ({
  useInstallPrompt: () => ({
    markFirstWorkoutComplete: vi.fn(),
  }),
}));

describe('WorkoutLogger', () => {
  const mockOnComplete = vi.fn();
  const mockOnCancel = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render Add Exercise button', () => {
    render(<WorkoutLogger onComplete={mockOnComplete} onCancel={mockOnCancel} />);

    expect(screen.getByText('Add Exercise')).toBeInTheDocument();
  });

  it('should render Cancel button', () => {
    render(<WorkoutLogger onComplete={mockOnComplete} onCancel={mockOnCancel} />);

    expect(screen.getByText('Cancel')).toBeInTheDocument();
  });

  it('should render Save Workout button (disabled initially)', () => {
    render(<WorkoutLogger onComplete={mockOnComplete} onCancel={mockOnCancel} />);

    const saveButton = screen.getByText('Save Workout');
    expect(saveButton).toBeInTheDocument();
    expect(saveButton.closest('button')).toBeDisabled();
  });

  it('should call onCancel when Cancel is clicked', async () => {
    const user = userEvent.setup();
    render(<WorkoutLogger onComplete={mockOnComplete} onCancel={mockOnCancel} />);

    await user.click(screen.getByText('Cancel'));

    expect(mockOnCancel).toHaveBeenCalled();
  });

  it('should show empty state initially', () => {
    render(<WorkoutLogger onComplete={mockOnComplete} onCancel={mockOnCancel} />);

    expect(screen.getByText('No exercises added yet.')).toBeInTheDocument();
  });

  it('should open exercise selector when Add Exercise is clicked', async () => {
    const user = userEvent.setup();
    render(<WorkoutLogger onComplete={mockOnComplete} onCancel={mockOnCancel} />);

    await user.click(screen.getByText('Add Exercise'));

    await waitFor(() => {
      expect(screen.getByText('Select Exercise')).toBeInTheDocument();
    });
  });

  it('should add exercise when selected from selector', async () => {
    const user = userEvent.setup();
    render(<WorkoutLogger onComplete={mockOnComplete} onCancel={mockOnCancel} />);

    // Open selector
    await user.click(screen.getByText('Add Exercise'));

    // Wait for exercises to load and select one
    await waitFor(() => {
      expect(screen.getByText('Bench Press')).toBeInTheDocument();
    });

    await user.click(screen.getByText('Bench Press'));

    // Exercise card should appear
    await waitFor(() => {
      expect(screen.getByText('No sets logged yet')).toBeInTheDocument();
    });
  });

  it('should show notes field after adding an exercise', async () => {
    const user = userEvent.setup();
    render(<WorkoutLogger onComplete={mockOnComplete} onCancel={mockOnCancel} />);

    await user.click(screen.getByText('Add Exercise'));

    await waitFor(() => {
      expect(screen.getByText('Bench Press')).toBeInTheDocument();
    });

    await user.click(screen.getByText('Bench Press'));

    await waitFor(() => {
      expect(screen.getByPlaceholderText('How did the workout feel?')).toBeInTheDocument();
    });
  });
});
