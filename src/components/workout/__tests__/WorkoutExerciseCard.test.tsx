import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import WorkoutExerciseCard from '../WorkoutExerciseCard';
import type { Exercise } from '../../../types';

// Mock the settings store
vi.mock('../../../stores', () => ({
  useSettingsStore: () => ({
    weightUnit: 'kg',
  }),
}));

const mockExercise: Exercise = {
  id: '1',
  name: 'Bench Press',
  muscleGroup: 'chest',
  equipmentType: 'barbell',
  isCustom: false,
  createdAt: new Date(),
};

describe('WorkoutExerciseCard', () => {
  const mockOnRemoveSet = vi.fn();
  const mockOnRemoveExercise = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render exercise name and muscle group', () => {
    render(
      <WorkoutExerciseCard
        exercise={mockExercise}
        sets={[]}
        onRemoveSet={mockOnRemoveSet}
        onRemoveExercise={mockOnRemoveExercise}
      />
    );

    expect(screen.getByText('Bench Press')).toBeInTheDocument();
    expect(screen.getByText('chest')).toBeInTheDocument();
  });

  it('should show "No sets logged yet" when empty', () => {
    render(
      <WorkoutExerciseCard
        exercise={mockExercise}
        sets={[]}
        onRemoveSet={mockOnRemoveSet}
        onRemoveExercise={mockOnRemoveExercise}
      />
    );

    expect(screen.getByText('No sets logged yet')).toBeInTheDocument();
  });

  it('should display sets with reps and weight', () => {
    const sets = [
      { reps: 10, weight: 60 },
      { reps: 8, weight: 70 },
    ];

    render(
      <WorkoutExerciseCard
        exercise={mockExercise}
        sets={sets}
        onRemoveSet={mockOnRemoveSet}
        onRemoveExercise={mockOnRemoveExercise}
      />
    );

    expect(screen.getByText('10 reps × 60 kg')).toBeInTheDocument();
    expect(screen.getByText('8 reps × 70 kg')).toBeInTheDocument();
  });

  it('should display RPE when provided', () => {
    const sets = [{ reps: 10, weight: 60, rpe: 8 }];

    render(
      <WorkoutExerciseCard
        exercise={mockExercise}
        sets={sets}
        onRemoveSet={mockOnRemoveSet}
        onRemoveExercise={mockOnRemoveExercise}
      />
    );

    expect(screen.getByText('RPE 8')).toBeInTheDocument();
  });

  it('should call onRemoveSet when remove set button is clicked', async () => {
    const user = userEvent.setup();
    const sets = [{ reps: 10, weight: 60 }];

    render(
      <WorkoutExerciseCard
        exercise={mockExercise}
        sets={sets}
        onRemoveSet={mockOnRemoveSet}
        onRemoveExercise={mockOnRemoveExercise}
      />
    );

    await user.click(screen.getByLabelText('Remove set 1'));

    expect(mockOnRemoveSet).toHaveBeenCalledWith(0);
  });

  it('should call onRemoveExercise when remove exercise button is clicked', async () => {
    const user = userEvent.setup();

    render(
      <WorkoutExerciseCard
        exercise={mockExercise}
        sets={[]}
        onRemoveSet={mockOnRemoveSet}
        onRemoveExercise={mockOnRemoveExercise}
      />
    );

    await user.click(screen.getByLabelText('Remove Bench Press'));

    expect(mockOnRemoveExercise).toHaveBeenCalled();
  });
});
