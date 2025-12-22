import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import CardioDistanceChart from '../CardioDistanceChart';

// Mock the progressQueries module
vi.mock('../../../lib/progressQueries', () => ({
  getCardioDistanceData: vi.fn(),
}));

// Mock the settings store
vi.mock('../../../stores', () => ({
  useSettingsStore: () => ({
    distanceUnit: 'km',
  }),
}));

describe('CardioDistanceChart', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should show empty state when no data exists', async () => {
    const { getCardioDistanceData } = await import(
      '../../../lib/progressQueries'
    );
    vi.mocked(getCardioDistanceData).mockResolvedValue([]);

    render(
      <CardioDistanceChart cardioType={null} startDate={null} endDate={null} />
    );

    await waitFor(() => {
      expect(
        screen.getByText('No cardio sessions with distance data yet')
      ).toBeInTheDocument();
    });
  });

  it('should render chart when data exists', async () => {
    const { getCardioDistanceData } = await import(
      '../../../lib/progressQueries'
    );
    vi.mocked(getCardioDistanceData).mockResolvedValue([
      {
        date: new Date('2025-12-10'),
        distance: 3.5,
        sessionId: 's1',
        type: 'treadmill',
      },
      {
        date: new Date('2025-12-15'),
        distance: 4.0,
        sessionId: 's2',
        type: 'treadmill',
      },
    ]);

    const { container } = render(
      <CardioDistanceChart cardioType={null} startDate={null} endDate={null} />
    );

    await waitFor(() => {
      // Should show total distance (3.5 + 4.0 = 7.5 miles → 12.1 km with conversion)
      expect(screen.getByText(/Total:/)).toBeInTheDocument();
      expect(screen.getByText(/12\.1/)).toBeInTheDocument();
      // Should have recharts container
      expect(
        container.querySelector('.recharts-responsive-container')
      ).toBeInTheDocument();
    });
  });

  it('should call getCardioDistanceData with correct params', async () => {
    const { getCardioDistanceData } = await import(
      '../../../lib/progressQueries'
    );
    vi.mocked(getCardioDistanceData).mockResolvedValue([]);

    const startDate = new Date('2025-11-01');
    const endDate = new Date('2025-12-01');

    render(
      <CardioDistanceChart
        cardioType="treadmill"
        startDate={startDate}
        endDate={endDate}
      />
    );

    await waitFor(() => {
      expect(getCardioDistanceData).toHaveBeenCalledWith(
        'treadmill',
        startDate,
        endDate
      );
    });
  });

  it('should filter by cardio type when specified', async () => {
    const { getCardioDistanceData } = await import(
      '../../../lib/progressQueries'
    );
    vi.mocked(getCardioDistanceData).mockResolvedValue([]);

    render(
      <CardioDistanceChart
        cardioType="stationary-bike"
        startDate={null}
        endDate={null}
      />
    );

    await waitFor(() => {
      expect(getCardioDistanceData).toHaveBeenCalledWith(
        'stationary-bike',
        null,
        null
      );
    });
  });

  it('should show loading state initially', async () => {
    const { getCardioDistanceData } = await import(
      '../../../lib/progressQueries'
    );
    vi.mocked(getCardioDistanceData).mockImplementation(
      () => new Promise(() => {})
    );

    render(
      <CardioDistanceChart cardioType={null} startDate={null} endDate={null} />
    );

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });
});
