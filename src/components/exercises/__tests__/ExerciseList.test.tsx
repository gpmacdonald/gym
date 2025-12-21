import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ExerciseList from '../ExerciseList';
import type { Exercise } from '../../../types';

// Mock queries module
vi.mock('../../../lib/queries', () => ({
  getAllExercises: vi.fn(),
  deleteExercise: vi.fn(),
  addExercise: vi.fn(),
  updateExercise: vi.fn(),
}));

const mockExercises: Exercise[] = [
  {
    id: '1',
    name: 'Bench Press',
    muscleGroup: 'chest',
    equipmentType: 'barbell',
    isCustom: false,
    createdAt: new Date('2025-01-01'),
  },
  {
    id: '2',
    name: 'Squat',
    muscleGroup: 'legs',
    equipmentType: 'barbell',
    isCustom: false,
    createdAt: new Date('2025-01-01'),
  },
  {
    id: '3',
    name: 'My Custom Press',
    muscleGroup: 'shoulders',
    equipmentType: 'dumbbell',
    isCustom: true,
    createdAt: new Date('2025-01-15'),
  },
];

import * as queries from '../../../lib/queries';

describe('ExerciseList', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(queries.getAllExercises).mockResolvedValue(mockExercises);
    vi.mocked(queries.deleteExercise).mockResolvedValue(undefined);
    vi.mocked(queries.addExercise).mockResolvedValue('new-id');
    vi.mocked(queries.updateExercise).mockResolvedValue(undefined);
  });

  describe('Loading State', () => {
    it('should show loading spinner initially', () => {
      render(<ExerciseList />);
      expect(document.querySelector('.animate-spin')).toBeInTheDocument();
    });
  });

  describe('Exercise Display', () => {
    it('should display all exercises after loading', async () => {
      render(<ExerciseList />);

      await waitFor(() => {
        expect(screen.getByText('Bench Press')).toBeInTheDocument();
      });
      expect(screen.getByText('Squat')).toBeInTheDocument();
      expect(screen.getByText('My Custom Press')).toBeInTheDocument();
    });

    it('should display custom badge on custom exercises', async () => {
      render(<ExerciseList />);

      await waitFor(() => {
        expect(screen.getByText('Custom')).toBeInTheDocument();
      });
    });

    it('should show muscle group and equipment for each exercise', async () => {
      render(<ExerciseList />);

      await waitFor(() => {
        expect(screen.getByText(/chest.*barbell/i)).toBeInTheDocument();
      });
      expect(screen.getByText(/legs.*barbell/i)).toBeInTheDocument();
      expect(screen.getByText(/shoulders.*dumbbell/i)).toBeInTheDocument();
    });

    it('should display exercise count', async () => {
      render(<ExerciseList />);

      await waitFor(() => {
        expect(screen.getByText(/showing 3 of 3 exercises/i)).toBeInTheDocument();
      });
    });
  });

  describe('Search Functionality', () => {
    it('should filter exercises by search query', async () => {
      const user = userEvent.setup();
      render(<ExerciseList />);

      await waitFor(() => {
        expect(screen.getByText('Bench Press')).toBeInTheDocument();
      });

      const searchInput = screen.getByPlaceholderText('Search exercises...');
      await user.type(searchInput, 'press');

      // Wait for debounce to apply filter
      await waitFor(() => {
        expect(screen.queryByText('Squat')).not.toBeInTheDocument();
      });
      expect(screen.getByText('Bench Press')).toBeInTheDocument();
      expect(screen.getByText('My Custom Press')).toBeInTheDocument();
    });

    it('should show clear button when search has value', async () => {
      const user = userEvent.setup();
      render(<ExerciseList />);

      await waitFor(() => {
        expect(screen.getByText('Bench Press')).toBeInTheDocument();
      });

      const searchInput = screen.getByPlaceholderText('Search exercises...');
      await user.type(searchInput, 'test');

      expect(screen.getByLabelText('Clear search')).toBeInTheDocument();
    });

    it('should clear search when clear button is clicked', async () => {
      const user = userEvent.setup();
      render(<ExerciseList />);

      await waitFor(() => {
        expect(screen.getByText('Bench Press')).toBeInTheDocument();
      });

      const searchInput = screen.getByPlaceholderText('Search exercises...');
      await user.type(searchInput, 'press');
      
      // Wait for debounce to filter
      await waitFor(() => {
        expect(screen.queryByText('Squat')).not.toBeInTheDocument();
      });
      
      await user.click(screen.getByLabelText('Clear search'));

      // Wait for debounce to clear filter
      await waitFor(() => {
        expect(screen.getByText('Squat')).toBeInTheDocument();
      });
      expect(searchInput).toHaveValue('');
    });
  });

  describe('Muscle Group Filter', () => {
    it('should filter exercises by muscle group', async () => {
      const user = userEvent.setup();
      render(<ExerciseList />);

      await waitFor(() => {
        expect(screen.getByText('Bench Press')).toBeInTheDocument();
      });

      await user.click(screen.getByRole('button', { name: 'chest' }));

      expect(screen.getByText('Bench Press')).toBeInTheDocument();
      expect(screen.queryByText('Squat')).not.toBeInTheDocument();
    });

    it('should toggle muscle group filter off when clicked again', async () => {
      const user = userEvent.setup();
      render(<ExerciseList />);

      await waitFor(() => {
        expect(screen.getByText('Bench Press')).toBeInTheDocument();
      });

      await user.click(screen.getByRole('button', { name: 'chest' }));
      expect(screen.queryByText('Squat')).not.toBeInTheDocument();

      await user.click(screen.getByRole('button', { name: 'chest' }));
      expect(screen.getByText('Squat')).toBeInTheDocument();
    });
  });

  describe('Custom Only Filter', () => {
    it('should filter to show only custom exercises', async () => {
      const user = userEvent.setup();
      render(<ExerciseList />);

      await waitFor(() => {
        expect(screen.getByText('Bench Press')).toBeInTheDocument();
      });

      await user.click(screen.getByRole('checkbox'));

      expect(screen.getByText('My Custom Press')).toBeInTheDocument();
      expect(screen.queryByText('Bench Press')).not.toBeInTheDocument();
      expect(screen.queryByText('Squat')).not.toBeInTheDocument();
    });

    it('should show custom count in filter label', async () => {
      render(<ExerciseList />);

      await waitFor(() => {
        expect(screen.getByText(/show custom exercises only \(1\)/i)).toBeInTheDocument();
      });
    });
  });

  describe('Add Exercise', () => {
    it('should show add button', async () => {
      render(<ExerciseList />);

      await waitFor(() => {
        expect(screen.getByRole('button', { name: 'Add Custom Exercise' })).toBeInTheDocument();
      });
    });

    it('should open modal when add button is clicked', async () => {
      const user = userEvent.setup();
      render(<ExerciseList />);

      await waitFor(() => {
        expect(screen.getByText('Bench Press')).toBeInTheDocument();
      });

      await user.click(screen.getByRole('button', { name: 'Add Custom Exercise' }));

      expect(screen.getByRole('heading', { name: 'Add Exercise' })).toBeInTheDocument();
    });
  });

  describe('Edit Exercise', () => {
    it('should show edit button only for custom exercises', async () => {
      render(<ExerciseList />);

      await waitFor(() => {
        expect(screen.getByText('My Custom Press')).toBeInTheDocument();
      });

      // Custom exercise should have edit button
      expect(screen.getByLabelText('Edit My Custom Press')).toBeInTheDocument();

      // Built-in exercises should not have edit buttons
      expect(screen.queryByLabelText('Edit Bench Press')).not.toBeInTheDocument();
    });

    it('should open modal with exercise data when edit is clicked', async () => {
      const user = userEvent.setup();
      render(<ExerciseList />);

      await waitFor(() => {
        expect(screen.getByText('My Custom Press')).toBeInTheDocument();
      });

      await user.click(screen.getByLabelText('Edit My Custom Press'));

      expect(screen.getByRole('heading', { name: 'Edit Exercise' })).toBeInTheDocument();
      expect(screen.getByDisplayValue('My Custom Press')).toBeInTheDocument();
    });
  });

  describe('Delete Exercise', () => {
    it('should show delete button only for custom exercises', async () => {
      render(<ExerciseList />);

      await waitFor(() => {
        expect(screen.getByText('My Custom Press')).toBeInTheDocument();
      });

      expect(screen.getByLabelText('Delete My Custom Press')).toBeInTheDocument();
      expect(screen.queryByLabelText('Delete Bench Press')).not.toBeInTheDocument();
    });

    it('should show confirmation dialog when delete is clicked', async () => {
      const user = userEvent.setup();
      render(<ExerciseList />);

      await waitFor(() => {
        expect(screen.getByText('My Custom Press')).toBeInTheDocument();
      });

      await user.click(screen.getByLabelText('Delete My Custom Press'));

      expect(screen.getByText('Delete Exercise?')).toBeInTheDocument();
      expect(screen.getByText(/are you sure you want to delete "My Custom Press"/i)).toBeInTheDocument();
    });

    it('should delete exercise when confirmed', async () => {
      const user = userEvent.setup();
      render(<ExerciseList />);

      await waitFor(() => {
        expect(screen.getByText('My Custom Press')).toBeInTheDocument();
      });

      await user.click(screen.getByLabelText('Delete My Custom Press'));
      await user.click(screen.getByRole('button', { name: 'Delete' }));

      await waitFor(() => {
        expect(queries.deleteExercise).toHaveBeenCalledWith('3');
      });
    });

    it('should cancel delete when cancel is clicked', async () => {
      const user = userEvent.setup();
      render(<ExerciseList />);

      await waitFor(() => {
        expect(screen.getByText('My Custom Press')).toBeInTheDocument();
      });

      await user.click(screen.getByLabelText('Delete My Custom Press'));
      await user.click(screen.getByRole('button', { name: 'Cancel' }));

      expect(queries.deleteExercise).not.toHaveBeenCalled();
      expect(screen.queryByText('Delete Exercise?')).not.toBeInTheDocument();
    });
  });

  describe('Empty State', () => {
    it('should show empty state when no exercises match filter', async () => {
      const user = userEvent.setup();
      render(<ExerciseList />);

      await waitFor(() => {
        expect(screen.getByText('Bench Press')).toBeInTheDocument();
      });

      const searchInput = screen.getByPlaceholderText('Search exercises...');
      await user.type(searchInput, 'nonexistent');

      // Wait for debounce to apply filter
      await waitFor(() => {
        expect(screen.getByText('No exercises match your filters')).toBeInTheDocument();
      });
    });
  });
});
