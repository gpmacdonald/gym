import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MockDataManager from '../MockDataManager';

// Mock the seed functions
vi.mock('../../../lib/seed', () => ({
  seedMockData: vi.fn(),
  clearMockData: vi.fn(),
  hasMockData: vi.fn(),
}));

import * as seedModule from '../../../lib/seed';

describe('MockDataManager', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Loading State', () => {
    it('should show loading state while checking mock data', () => {
      vi.mocked(seedModule.hasMockData).mockImplementation(
        () => new Promise(() => {}) // Never resolves
      );

      render(<MockDataManager />);

      expect(screen.getByText('Checking mock data...')).toBeInTheDocument();
    });
  });

  describe('No Mock Data', () => {
    beforeEach(() => {
      vi.mocked(seedModule.hasMockData).mockResolvedValue(false);
    });

    it('should show generate button when no mock data exists', async () => {
      render(<MockDataManager />);

      await waitFor(() => {
        expect(screen.getByRole('button', { name: 'Generate' })).toBeInTheDocument();
      });
      expect(screen.getByText('Generate sample data for testing')).toBeInTheDocument();
    });

    it('should seed mock data when generate is clicked', async () => {
      vi.mocked(seedModule.seedMockData).mockResolvedValue({
        workouts: 60,
        sets: 300,
        cardioSessions: 30,
      });

      const user = userEvent.setup();
      render(<MockDataManager />);

      await waitFor(() => {
        expect(screen.getByRole('button', { name: 'Generate' })).toBeInTheDocument();
      });

      await user.click(screen.getByRole('button', { name: 'Generate' }));

      await waitFor(() => {
        expect(seedModule.seedMockData).toHaveBeenCalled();
      });
      expect(screen.getByText(/Created 60 workouts with 300 sets and 30 cardio sessions/)).toBeInTheDocument();
    });

    it('should show error when seeding fails', async () => {
      vi.mocked(seedModule.seedMockData).mockRejectedValue(new Error('Seed failed'));

      const user = userEvent.setup();
      render(<MockDataManager />);

      await waitFor(() => {
        expect(screen.getByRole('button', { name: 'Generate' })).toBeInTheDocument();
      });

      await user.click(screen.getByRole('button', { name: 'Generate' }));

      await waitFor(() => {
        expect(screen.getByText('Failed to seed mock data')).toBeInTheDocument();
      });
    });
  });

  describe('Has Mock Data', () => {
    beforeEach(() => {
      vi.mocked(seedModule.hasMockData).mockResolvedValue(true);
    });

    it('should show clear button when mock data exists', async () => {
      render(<MockDataManager />);

      await waitFor(() => {
        expect(screen.getByRole('button', { name: 'Clear' })).toBeInTheDocument();
      });
      expect(screen.getByText('Sample workout data is loaded')).toBeInTheDocument();
    });

    it('should show confirmation dialog when clear is clicked', async () => {
      const user = userEvent.setup();
      render(<MockDataManager />);

      await waitFor(() => {
        expect(screen.getByRole('button', { name: 'Clear' })).toBeInTheDocument();
      });

      await user.click(screen.getByRole('button', { name: 'Clear' }));

      expect(screen.getByText('Clear Mock Data?')).toBeInTheDocument();
      expect(screen.getByText(/This will delete all workout and cardio session data/)).toBeInTheDocument();
    });

    it('should clear mock data when confirmed', async () => {
      vi.mocked(seedModule.clearMockData).mockResolvedValue(undefined);

      const user = userEvent.setup();
      render(<MockDataManager />);

      await waitFor(() => {
        expect(screen.getByRole('button', { name: 'Clear' })).toBeInTheDocument();
      });

      await user.click(screen.getByRole('button', { name: 'Clear' }));
      await user.click(screen.getByRole('button', { name: 'Clear Data' }));

      await waitFor(() => {
        expect(seedModule.clearMockData).toHaveBeenCalled();
      });
      expect(screen.getByText('Mock data cleared successfully')).toBeInTheDocument();
    });

    it('should cancel clear when cancel is clicked', async () => {
      const user = userEvent.setup();
      render(<MockDataManager />);

      await waitFor(() => {
        expect(screen.getByRole('button', { name: 'Clear' })).toBeInTheDocument();
      });

      await user.click(screen.getByRole('button', { name: 'Clear' }));
      await user.click(screen.getByRole('button', { name: 'Cancel' }));

      expect(seedModule.clearMockData).not.toHaveBeenCalled();
      expect(screen.queryByText('Clear Mock Data?')).not.toBeInTheDocument();
    });

    it('should show error when clearing fails', async () => {
      vi.mocked(seedModule.clearMockData).mockRejectedValue(new Error('Clear failed'));

      const user = userEvent.setup();
      render(<MockDataManager />);

      await waitFor(() => {
        expect(screen.getByRole('button', { name: 'Clear' })).toBeInTheDocument();
      });

      await user.click(screen.getByRole('button', { name: 'Clear' }));
      await user.click(screen.getByRole('button', { name: 'Clear Data' }));

      await waitFor(() => {
        expect(screen.getByText('Failed to clear mock data')).toBeInTheDocument();
      });
    });
  });
});
