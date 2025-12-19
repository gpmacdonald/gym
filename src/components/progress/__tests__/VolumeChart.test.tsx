import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import VolumeChart from '../VolumeChart';

// Mock the progressQueries module
vi.mock('../../../lib/progressQueries', () => ({
  getVolumeProgressData: vi.fn(),
}));

// Mock the settings store
vi.mock('../../../stores', () => ({
  useSettingsStore: () => ({
    weightUnit: 'kg',
  }),
}));

describe('VolumeChart', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should show empty state when no data exists for exercise', async () => {
    const { getVolumeProgressData } = await import(
      '../../../lib/progressQueries'
    );
    vi.mocked(getVolumeProgressData).mockResolvedValue([]);

    render(
      <VolumeChart exerciseId="exercise-1" startDate={null} endDate={null} />
    );

    await waitFor(() => {
      expect(
        screen.getByText('No volume data for this exercise yet')
      ).toBeInTheDocument();
    });
  });

  it('should show empty state when no workout data exists', async () => {
    const { getVolumeProgressData } = await import(
      '../../../lib/progressQueries'
    );
    vi.mocked(getVolumeProgressData).mockResolvedValue([]);

    render(<VolumeChart exerciseId={null} startDate={null} endDate={null} />);

    await waitFor(() => {
      expect(screen.getByText('No workout data yet')).toBeInTheDocument();
    });
  });

  it('should render chart when data exists', async () => {
    const { getVolumeProgressData } = await import(
      '../../../lib/progressQueries'
    );
    vi.mocked(getVolumeProgressData).mockResolvedValue([
      {
        date: new Date('2025-12-10'),
        volume: 1200,
        workoutId: 'w1',
      },
      {
        date: new Date('2025-12-15'),
        volume: 1500,
        workoutId: 'w2',
      },
    ]);

    const { container } = render(
      <VolumeChart exerciseId="exercise-1" startDate={null} endDate={null} />
    );

    await waitFor(() => {
      // Should show total volume (1200 + 1500 = 2700 = 2.7k)
      expect(screen.getByText(/Total:/)).toBeInTheDocument();
      expect(screen.getByText(/2.7k/)).toBeInTheDocument();
      // Should have recharts container
      expect(
        container.querySelector('.recharts-responsive-container')
      ).toBeInTheDocument();
    });
  });

  it('should display total and max volume', async () => {
    const { getVolumeProgressData } = await import(
      '../../../lib/progressQueries'
    );
    vi.mocked(getVolumeProgressData).mockResolvedValue([
      {
        date: new Date('2025-12-10'),
        volume: 800,
        workoutId: 'w1',
      },
      {
        date: new Date('2025-12-15'),
        volume: 1200,
        workoutId: 'w2',
      },
    ]);

    render(
      <VolumeChart exerciseId="exercise-1" startDate={null} endDate={null} />
    );

    await waitFor(() => {
      // Total: 800 + 1200 = 2000 = 2k
      expect(screen.getByText(/2k kg/)).toBeInTheDocument();
      // Max: 1200 = 1.2k
      expect(screen.getByText(/Max: 1.2k kg/)).toBeInTheDocument();
    });
  });

  it('should call getVolumeProgressData with correct params', async () => {
    const { getVolumeProgressData } = await import(
      '../../../lib/progressQueries'
    );
    vi.mocked(getVolumeProgressData).mockResolvedValue([]);

    const startDate = new Date('2025-11-01');
    const endDate = new Date('2025-12-01');

    render(
      <VolumeChart
        exerciseId="exercise-123"
        startDate={startDate}
        endDate={endDate}
      />
    );

    await waitFor(() => {
      expect(getVolumeProgressData).toHaveBeenCalledWith(
        'exercise-123',
        startDate,
        endDate
      );
    });
  });

  it('should work with null exerciseId for total workout volume', async () => {
    const { getVolumeProgressData } = await import(
      '../../../lib/progressQueries'
    );
    vi.mocked(getVolumeProgressData).mockResolvedValue([
      {
        date: new Date('2025-12-15'),
        volume: 5000,
        workoutId: 'w1',
      },
    ]);

    render(<VolumeChart exerciseId={null} startDate={null} endDate={null} />);

    await waitFor(() => {
      expect(getVolumeProgressData).toHaveBeenCalledWith(null, null, null);
      // 5000 formats as "5.0k" - appears in both Total and Max (same value)
      expect(screen.getAllByText(/5\.0k/).length).toBeGreaterThan(0);
    });
  });
});
