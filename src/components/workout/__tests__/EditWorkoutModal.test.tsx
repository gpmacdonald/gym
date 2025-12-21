import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import EditWorkoutModal from '../EditWorkoutModal';
import * as queries from '../../../lib/queries';
import type { Workout, WorkoutSet, Exercise } from '../../../types';

vi.mock('../../../lib/queries', () => ({
  updateWorkout: vi.fn(),
  updateSet: vi.fn(),
  deleteSet: vi.fn(),
  addSet: vi.fn(),
}));

const mockWorkout: Workout = {
  id: 'workout-1',
  date: new Date('2024-01-15'),
  notes: 'Good workout',
  createdAt: new Date('2024-01-15'),
  updatedAt: new Date('2024-01-15'),
};

const mockSets: WorkoutSet[] = [
  {
    id: 'set-1',
    workoutId: 'workout-1',
    exerciseId: 'exercise-1',
    setNumber: 1,
    reps: 10,
    weight: 60,
    rpe: 7,
    createdAt: new Date('2024-01-15'),
  },
  {
    id: 'set-2',
    workoutId: 'workout-1',
    exerciseId: 'exercise-1',
    setNumber: 2,
    reps: 8,
    weight: 65,
    createdAt: new Date('2024-01-15'),
  },
];

const mockExercises: Exercise[] = [
  {
    id: 'exercise-1',
    name: 'Bench Press',
    muscleGroup: 'chest',
    equipmentType: 'barbell',
    isCustom: false,
    createdAt: new Date('2024-01-01'),
  },
];

describe('EditWorkoutModal', () => {
  const mockOnClose = vi.fn();
  const mockOnSaved = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render modal with workout data', () => {
    render(
      <EditWorkoutModal
        workout={mockWorkout}
        sets={mockSets}
        exercises={mockExercises}
        onClose={mockOnClose}
        onSaved={mockOnSaved}
      />
    );

    expect(screen.getByText('Edit Workout')).toBeInTheDocument();
    expect(screen.getByText('Bench Press')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Good workout')).toBeInTheDocument();
  });

  it('should display sets with weight and reps', () => {
    render(
      <EditWorkoutModal
        workout={mockWorkout}
        sets={mockSets}
        exercises={mockExercises}
        onClose={mockOnClose}
        onSaved={mockOnSaved}
      />
    );

    expect(screen.getByDisplayValue('60')).toBeInTheDocument();
    expect(screen.getByDisplayValue('10')).toBeInTheDocument();
    expect(screen.getByDisplayValue('65')).toBeInTheDocument();
    expect(screen.getByDisplayValue('8')).toBeInTheDocument();
  });

  it('should call onClose when close button is clicked', () => {
    render(
      <EditWorkoutModal
        workout={mockWorkout}
        sets={mockSets}
        exercises={mockExercises}
        onClose={mockOnClose}
        onSaved={mockOnSaved}
      />
    );

    fireEvent.click(screen.getByLabelText('Close'));
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('should call onClose when cancel button is clicked', () => {
    render(
      <EditWorkoutModal
        workout={mockWorkout}
        sets={mockSets}
        exercises={mockExercises}
        onClose={mockOnClose}
        onSaved={mockOnSaved}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('should update set weight when changed', () => {
    render(
      <EditWorkoutModal
        workout={mockWorkout}
        sets={mockSets}
        exercises={mockExercises}
        onClose={mockOnClose}
        onSaved={mockOnSaved}
      />
    );

    const weightInput = screen.getByDisplayValue('60');
    fireEvent.change(weightInput, { target: { value: '70' } });

    expect(screen.getByDisplayValue('70')).toBeInTheDocument();
  });

  it('should update set reps when + button is clicked', () => {
    render(
      <EditWorkoutModal
        workout={mockWorkout}
        sets={mockSets}
        exercises={mockExercises}
        onClose={mockOnClose}
        onSaved={mockOnSaved}
      />
    );

    // Find the + buttons for reps
    const plusButtons = screen.getAllByRole('button').filter(
      (btn) => btn.querySelector('svg.lucide-plus')
    );

    // Click the first + button (for first set's reps)
    if (plusButtons.length > 0) {
      fireEvent.click(plusButtons[0]);
    }

    expect(screen.getByDisplayValue('11')).toBeInTheDocument();
  });

  it('should remove set when delete button is clicked', () => {
    render(
      <EditWorkoutModal
        workout={mockWorkout}
        sets={mockSets}
        exercises={mockExercises}
        onClose={mockOnClose}
        onSaved={mockOnSaved}
      />
    );

    const deleteButtons = screen.getAllByLabelText('Delete set');
    expect(deleteButtons).toHaveLength(2);

    fireEvent.click(deleteButtons[0]);

    // First set should be removed, only one delete button should remain
    expect(screen.getAllByLabelText('Delete set')).toHaveLength(1);
  });

  it('should add new set when Add Set is clicked', () => {
    render(
      <EditWorkoutModal
        workout={mockWorkout}
        sets={mockSets}
        exercises={mockExercises}
        onClose={mockOnClose}
        onSaved={mockOnSaved}
      />
    );

    expect(screen.getAllByLabelText('Delete set')).toHaveLength(2);

    fireEvent.click(screen.getByRole('button', { name: '+ Add Set' }));

    // Should now have 3 sets
    expect(screen.getAllByLabelText('Delete set')).toHaveLength(3);
  });

  it('should save changes when Save Changes is clicked', async () => {
    vi.mocked(queries.updateWorkout).mockResolvedValue();
    vi.mocked(queries.updateSet).mockResolvedValue();

    render(
      <EditWorkoutModal
        workout={mockWorkout}
        sets={mockSets}
        exercises={mockExercises}
        onClose={mockOnClose}
        onSaved={mockOnSaved}
      />
    );

    // Modify the weight
    const weightInput = screen.getByDisplayValue('60');
    fireEvent.change(weightInput, { target: { value: '70' } });

    // Save
    fireEvent.click(screen.getByRole('button', { name: 'Save Changes' }));

    await waitFor(() => {
      expect(queries.updateWorkout).toHaveBeenCalledWith('workout-1', {
        notes: 'Good workout',
      });
      expect(mockOnSaved).toHaveBeenCalled();
    });
  });

  it('should update notes when changed', () => {
    render(
      <EditWorkoutModal
        workout={mockWorkout}
        sets={mockSets}
        exercises={mockExercises}
        onClose={mockOnClose}
        onSaved={mockOnSaved}
      />
    );

    const notesInput = screen.getByDisplayValue('Good workout');
    fireEvent.change(notesInput, { target: { value: 'Updated notes' } });

    expect(screen.getByDisplayValue('Updated notes')).toBeInTheDocument();
  });
});
