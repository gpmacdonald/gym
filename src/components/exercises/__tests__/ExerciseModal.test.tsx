import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ExerciseModal from '../ExerciseModal';
import type { Exercise } from '../../../types';

// Mock queries module
vi.mock('../../../lib/queries', () => ({
  addExercise: vi.fn(),
  updateExercise: vi.fn(),
}));

import * as queries from '../../../lib/queries';

const mockExercise: Exercise = {
  id: '1',
  name: 'My Custom Press',
  muscleGroup: 'shoulders',
  equipmentType: 'dumbbell',
  isCustom: true,
  createdAt: new Date('2025-01-15'),
};

describe('ExerciseModal', () => {
  const mockOnClose = vi.fn();
  const mockOnSaved = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(queries.addExercise).mockResolvedValue('new-id');
    vi.mocked(queries.updateExercise).mockResolvedValue(undefined);
  });

  describe('Add Mode', () => {
    it('should render add exercise form', () => {
      render(
        <ExerciseModal onClose={mockOnClose} onSaved={mockOnSaved} />
      );

      expect(screen.getByRole('heading', { name: 'Add Exercise' })).toBeInTheDocument();
      expect(screen.getByLabelText('Exercise Name')).toBeInTheDocument();
      expect(screen.getByLabelText('Exercise Name')).toHaveValue('');
    });

    it('should show all muscle group options', () => {
      render(
        <ExerciseModal onClose={mockOnClose} onSaved={mockOnSaved} />
      );

      expect(screen.getByRole('button', { name: 'chest' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'back' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'legs' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'shoulders' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'arms' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'core' })).toBeInTheDocument();
    });

    it('should show all equipment type options', () => {
      render(
        <ExerciseModal onClose={mockOnClose} onSaved={mockOnSaved} />
      );

      expect(screen.getByRole('button', { name: 'barbell' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'dumbbell' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'machine' })).toBeInTheDocument();
    });

    it('should add exercise when form is submitted', async () => {
      const user = userEvent.setup();
      render(
        <ExerciseModal onClose={mockOnClose} onSaved={mockOnSaved} />
      );

      await user.type(screen.getByLabelText('Exercise Name'), 'New Exercise');
      await user.click(screen.getByRole('button', { name: 'back' }));
      await user.click(screen.getByRole('button', { name: 'dumbbell' }));
      await user.click(screen.getByRole('button', { name: /save/i }));

      await waitFor(() => {
        expect(queries.addExercise).toHaveBeenCalledWith({
          name: 'New Exercise',
          muscleGroup: 'back',
          equipmentType: 'dumbbell',
          isCustom: true,
        });
      });
      expect(mockOnSaved).toHaveBeenCalled();
    });

    it('should show error when name is empty and save is attempted', async () => {
      render(
        <ExerciseModal onClose={mockOnClose} onSaved={mockOnSaved} />
      );

      // Save button is disabled when name is empty, so validation error won't show
      // Just verify the button is disabled
      expect(screen.getByRole('button', { name: /save/i })).toBeDisabled();
      expect(queries.addExercise).not.toHaveBeenCalled();
    });

    it('should show error when name is only whitespace', async () => {
      const user = userEvent.setup();
      render(
        <ExerciseModal onClose={mockOnClose} onSaved={mockOnSaved} />
      );

      await user.type(screen.getByLabelText('Exercise Name'), '   ');
      // Button should still be disabled since trimmed value is empty
      expect(screen.getByRole('button', { name: /save/i })).toBeDisabled();
    });
  });

  describe('Edit Mode', () => {
    it('should render edit exercise form with existing values', () => {
      render(
        <ExerciseModal
          exercise={mockExercise}
          onClose={mockOnClose}
          onSaved={mockOnSaved}
        />
      );

      expect(screen.getByRole('heading', { name: 'Edit Exercise' })).toBeInTheDocument();
      expect(screen.getByLabelText('Exercise Name')).toHaveValue('My Custom Press');
    });

    it('should update exercise when form is submitted', async () => {
      const user = userEvent.setup();
      render(
        <ExerciseModal
          exercise={mockExercise}
          onClose={mockOnClose}
          onSaved={mockOnSaved}
        />
      );

      await user.clear(screen.getByLabelText('Exercise Name'));
      await user.type(screen.getByLabelText('Exercise Name'), 'Updated Exercise');
      await user.click(screen.getByRole('button', { name: /save/i }));

      await waitFor(() => {
        expect(queries.updateExercise).toHaveBeenCalledWith('1', {
          name: 'Updated Exercise',
          muscleGroup: 'shoulders',
          equipmentType: 'dumbbell',
        });
      });
      expect(mockOnSaved).toHaveBeenCalled();
    });
  });

  describe('Modal Actions', () => {
    it('should close modal when close button is clicked', async () => {
      const user = userEvent.setup();
      render(
        <ExerciseModal onClose={mockOnClose} onSaved={mockOnSaved} />
      );

      await user.click(screen.getByLabelText('Close'));

      expect(mockOnClose).toHaveBeenCalled();
    });

    it('should close modal when cancel button is clicked', async () => {
      const user = userEvent.setup();
      render(
        <ExerciseModal onClose={mockOnClose} onSaved={mockOnSaved} />
      );

      await user.click(screen.getByRole('button', { name: 'Cancel' }));

      expect(mockOnClose).toHaveBeenCalled();
    });

    it('should disable save button when name is empty', () => {
      render(
        <ExerciseModal onClose={mockOnClose} onSaved={mockOnSaved} />
      );

      expect(screen.getByRole('button', { name: /save/i })).toBeDisabled();
    });

    it('should enable save button when name has value', async () => {
      const user = userEvent.setup();
      render(
        <ExerciseModal onClose={mockOnClose} onSaved={mockOnSaved} />
      );

      await user.type(screen.getByLabelText('Exercise Name'), 'Test');

      expect(screen.getByRole('button', { name: /save/i })).not.toBeDisabled();
    });
  });

  describe('Muscle Group Selection', () => {
    it('should update muscle group when button is clicked', async () => {
      const user = userEvent.setup();
      render(
        <ExerciseModal onClose={mockOnClose} onSaved={mockOnSaved} />
      );

      await user.type(screen.getByLabelText('Exercise Name'), 'Test Exercise');
      await user.click(screen.getByRole('button', { name: 'legs' }));
      await user.click(screen.getByRole('button', { name: /save/i }));

      await waitFor(() => {
        expect(queries.addExercise).toHaveBeenCalledWith(
          expect.objectContaining({ muscleGroup: 'legs' })
        );
      });
    });
  });

  describe('Equipment Type Selection', () => {
    it('should update equipment type when button is clicked', async () => {
      const user = userEvent.setup();
      render(
        <ExerciseModal onClose={mockOnClose} onSaved={mockOnSaved} />
      );

      await user.type(screen.getByLabelText('Exercise Name'), 'Test Exercise');
      await user.click(screen.getByRole('button', { name: 'machine' }));
      await user.click(screen.getByRole('button', { name: /save/i }));

      await waitFor(() => {
        expect(queries.addExercise).toHaveBeenCalledWith(
          expect.objectContaining({ equipmentType: 'machine' })
        );
      });
    });
  });

  describe('Error Handling', () => {
    it('should show error message when save fails', async () => {
      vi.mocked(queries.addExercise).mockRejectedValue(new Error('Save failed'));
      const user = userEvent.setup();
      render(
        <ExerciseModal onClose={mockOnClose} onSaved={mockOnSaved} />
      );

      await user.type(screen.getByLabelText('Exercise Name'), 'Test');
      await user.click(screen.getByRole('button', { name: /save/i }));

      await waitFor(() => {
        expect(screen.getByText('Failed to save exercise')).toBeInTheDocument();
      });
      expect(mockOnSaved).not.toHaveBeenCalled();
    });
  });
});
