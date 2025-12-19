import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import WeightProgressChart from '../WeightProgressChart';

// Mock the progressQueries module
vi.mock('../../../lib/progressQueries', () => ({
  getWeightProgressData: vi.fn(),
}));

// Mock the settings store
vi.mock('../../../stores', () => ({
  useSettingsStore: () => ({
    weightUnit: 'kg',
  }),
}));

describe('WeightProgressChart', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should show empty state when no exercise is selected', () => {
    render(
      <WeightProgressChart
        exerciseId={null}
        startDate={null}
        endDate={null}
      />
    );

    expect(
      screen.getByText('Select an exercise to view progress')
    ).toBeInTheDocument();
  });

  it('should show empty state when no data exists', async () => {
    const { getWeightProgressData } = await import(
      '../../../lib/progressQueries'
    );
    vi.mocked(getWeightProgressData).mockResolvedValue([]);

    render(
      <WeightProgressChart
        exerciseId="exercise-1"
        startDate={null}
        endDate={null}
      />
    );

    await waitFor(() => {
      expect(
        screen.getByText('No data for this exercise yet')
      ).toBeInTheDocument();
    });
  });

  it('should render chart when data exists', async () => {
    const { getWeightProgressData } = await import(
      '../../../lib/progressQueries'
    );
    vi.mocked(getWeightProgressData).mockResolvedValue([
      {
        date: new Date('2025-12-10'),
        maxWeight: 60,
        workoutId: 'w1',
        isPR: false,
      },
      {
        date: new Date('2025-12-15'),
        maxWeight: 70,
        workoutId: 'w2',
        isPR: true,
      },
    ]);

    const { container } = render(
      <WeightProgressChart
        exerciseId="exercise-1"
        startDate={null}
        endDate={null}
      />
    );

    await waitFor(() => {
      // Should show PR badge
      expect(screen.getByText(/PR:/)).toBeInTheDocument();
      expect(screen.getByText(/70/)).toBeInTheDocument();
      // Should have recharts container
      expect(
        container.querySelector('.recharts-responsive-container')
      ).toBeInTheDocument();
    });
  });

  it('should display PR with trophy icon', async () => {
    const { getWeightProgressData } = await import(
      '../../../lib/progressQueries'
    );
    vi.mocked(getWeightProgressData).mockResolvedValue([
      {
        date: new Date('2025-12-15'),
        maxWeight: 100,
        workoutId: 'w1',
        isPR: true,
      },
    ]);

    render(
      <WeightProgressChart
        exerciseId="exercise-1"
        startDate={null}
        endDate={null}
      />
    );

    await waitFor(() => {
      expect(screen.getByText('PR:')).toBeInTheDocument();
      expect(screen.getByText(/100 kg/)).toBeInTheDocument();
    });
  });

  it('should call getWeightProgressData with correct params', async () => {
    const { getWeightProgressData } = await import(
      '../../../lib/progressQueries'
    );
    vi.mocked(getWeightProgressData).mockResolvedValue([]);

    const startDate = new Date('2025-11-01');
    const endDate = new Date('2025-12-01');

    render(
      <WeightProgressChart
        exerciseId="exercise-123"
        startDate={startDate}
        endDate={endDate}
      />
    );

    await waitFor(() => {
      expect(getWeightProgressData).toHaveBeenCalledWith(
        'exercise-123',
        startDate,
        endDate
      );
    });
  });
});
