import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CardioCard from '../CardioCard';
import type { CardioSession } from '../../../types';

// Mock the settings store
vi.mock('../../../stores', () => ({
  useSettingsStore: () => ({
    distanceUnit: 'km',
  }),
}));

const mockTreadmillSession: CardioSession = {
  id: 'session-1',
  type: 'treadmill',
  date: new Date('2025-12-15'),
  duration: 1800, // 30 minutes
  distance: 5,
  avgSpeed: 10,
  avgIncline: 2,
  maxIncline: 5,
  calories: 300,
  notes: 'Great run!',
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockBikeSession: CardioSession = {
  id: 'session-2',
  type: 'stationary-bike',
  date: new Date('2025-12-14'),
  duration: 2400, // 40 minutes
  distance: 15,
  avgResistance: 12,
  avgCadence: 85,
  calories: 400,
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('CardioCard', () => {
  it('should display treadmill session with correct icon and name', () => {
    render(<CardioCard session={mockTreadmillSession} />);

    expect(screen.getByText('Treadmill')).toBeInTheDocument();
    expect(screen.getByText(/30:00/)).toBeInTheDocument();
  });

  it('should display bike session with correct icon and name', () => {
    render(<CardioCard session={mockBikeSession} />);

    expect(screen.getByText('Stationary Bike')).toBeInTheDocument();
    expect(screen.getByText(/40:00/)).toBeInTheDocument();
  });

  it('should be collapsed by default', () => {
    render(<CardioCard session={mockTreadmillSession} />);

    // Detailed metrics should not be visible
    expect(screen.queryByText('Distance')).not.toBeInTheDocument();
    expect(screen.queryByText('Avg Speed')).not.toBeInTheDocument();
  });

  it('should expand to show treadmill metrics when clicked', async () => {
    const user = userEvent.setup();
    render(<CardioCard session={mockTreadmillSession} />);

    await user.click(screen.getByRole('button'));

    expect(screen.getByText('Distance')).toBeInTheDocument();
    expect(screen.getByText('5 km')).toBeInTheDocument();
    expect(screen.getByText('Avg Speed')).toBeInTheDocument();
    expect(screen.getByText('10 km/h')).toBeInTheDocument();
    expect(screen.getByText('Avg Incline')).toBeInTheDocument();
    expect(screen.getByText('2%')).toBeInTheDocument();
    expect(screen.getByText('Max Incline')).toBeInTheDocument();
    expect(screen.getByText('5%')).toBeInTheDocument();
    expect(screen.getByText('Calories')).toBeInTheDocument();
    expect(screen.getByText('300')).toBeInTheDocument();
  });

  it('should expand to show bike metrics when clicked', async () => {
    const user = userEvent.setup();
    render(<CardioCard session={mockBikeSession} />);

    await user.click(screen.getByRole('button'));

    expect(screen.getByText('Avg Resistance')).toBeInTheDocument();
    expect(screen.getByText('12')).toBeInTheDocument();
    expect(screen.getByText('Avg Cadence')).toBeInTheDocument();
    expect(screen.getByText('85 RPM')).toBeInTheDocument();
  });

  it('should display notes when expanded', async () => {
    const user = userEvent.setup();
    render(<CardioCard session={mockTreadmillSession} />);

    await user.click(screen.getByRole('button'));

    expect(screen.getByText('Great run!')).toBeInTheDocument();
  });

  it('should only show metrics that have values', async () => {
    const user = userEvent.setup();
    const minimalSession: CardioSession = {
      id: 'session-3',
      type: 'treadmill',
      date: new Date(),
      duration: 600,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    render(<CardioCard session={minimalSession} />);

    await user.click(screen.getByRole('button'));

    // These should not appear since they're undefined
    expect(screen.queryByText('Distance')).not.toBeInTheDocument();
    expect(screen.queryByText('Avg Speed')).not.toBeInTheDocument();
    expect(screen.queryByText('Calories')).not.toBeInTheDocument();
  });

  it('should collapse when clicked again', async () => {
    const user = userEvent.setup();
    render(<CardioCard session={mockTreadmillSession} />);

    // Expand
    await user.click(screen.getByRole('button'));
    expect(screen.getByText('Distance')).toBeInTheDocument();

    // Collapse
    await user.click(screen.getByRole('button'));
    expect(screen.queryByText('Distance')).not.toBeInTheDocument();
  });
});
