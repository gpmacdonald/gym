import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import PRList from '../PRList';

// Mock the prDetection module
vi.mock('../../../lib/prDetection', () => ({
  getAllPRs: vi.fn(),
}));

// Mock the settings store
vi.mock('../../../stores', () => ({
  useSettingsStore: () => ({
    weightUnit: 'kg',
  }),
}));

describe('PRList', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should show empty state when no PRs exist', async () => {
    const { getAllPRs } = await import('../../../lib/prDetection');
    vi.mocked(getAllPRs).mockResolvedValue([]);

    render(<PRList />);

    await waitFor(() => {
      expect(screen.getByText('No personal records yet')).toBeInTheDocument();
    });
  });

  it('should display PRs when data exists', async () => {
    const { getAllPRs } = await import('../../../lib/prDetection');
    vi.mocked(getAllPRs).mockResolvedValue([
      {
        exerciseId: 'ex-1',
        exerciseName: 'Barbell Bench Press',
        weight: 100,
        reps: 5,
        date: new Date('2025-12-15'),
        workoutId: 'w-1',
      },
      {
        exerciseId: 'ex-2',
        exerciseName: 'Barbell Back Squat',
        weight: 140,
        reps: 3,
        date: new Date('2025-12-10'),
        workoutId: 'w-2',
      },
    ]);

    render(<PRList />);

    await waitFor(() => {
      expect(screen.getByText('Barbell Bench Press')).toBeInTheDocument();
      expect(screen.getByText('Barbell Back Squat')).toBeInTheDocument();
      expect(screen.getByText('100 kg')).toBeInTheDocument();
      expect(screen.getByText('140 kg')).toBeInTheDocument();
    });
  });

  it('should show reps for each PR', async () => {
    const { getAllPRs } = await import('../../../lib/prDetection');
    vi.mocked(getAllPRs).mockResolvedValue([
      {
        exerciseId: 'ex-1',
        exerciseName: 'Barbell Bench Press',
        weight: 100,
        reps: 5,
        date: new Date('2025-12-15'),
        workoutId: 'w-1',
      },
    ]);

    render(<PRList />);

    await waitFor(() => {
      expect(screen.getByText(/5 reps/)).toBeInTheDocument();
    });
  });

  it('should limit the number of PRs shown when limit prop is provided', async () => {
    const { getAllPRs } = await import('../../../lib/prDetection');
    vi.mocked(getAllPRs).mockResolvedValue([
      {
        exerciseId: 'ex-1',
        exerciseName: 'Exercise 1',
        weight: 100,
        reps: 5,
        date: new Date('2025-12-15'),
        workoutId: 'w-1',
      },
      {
        exerciseId: 'ex-2',
        exerciseName: 'Exercise 2',
        weight: 90,
        reps: 5,
        date: new Date('2025-12-14'),
        workoutId: 'w-2',
      },
      {
        exerciseId: 'ex-3',
        exerciseName: 'Exercise 3',
        weight: 80,
        reps: 5,
        date: new Date('2025-12-13'),
        workoutId: 'w-3',
      },
    ]);

    render(<PRList limit={2} />);

    await waitFor(() => {
      expect(screen.getByText('Exercise 1')).toBeInTheDocument();
      expect(screen.getByText('Exercise 2')).toBeInTheDocument();
      expect(screen.queryByText('Exercise 3')).not.toBeInTheDocument();
    });
  });

  it('should show loading state initially', async () => {
    const { getAllPRs } = await import('../../../lib/prDetection');
    // Create a promise that never resolves to keep loading state
    vi.mocked(getAllPRs).mockImplementation(
      () => new Promise(() => {})
    );

    const { container } = render(<PRList />);

    // Should show loading skeleton immediately
    expect(container.querySelector('.animate-pulse')).toBeInTheDocument();
  });
});
