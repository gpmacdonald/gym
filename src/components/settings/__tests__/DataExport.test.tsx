import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DataExport from '../DataExport';

// Mock the dataExport module
vi.mock('../../../lib/dataExport', () => ({
  exportAllData: vi.fn(() =>
    Promise.resolve({
      version: '1.0',
      exportDate: new Date().toISOString(),
      exercises: [],
      workouts: [],
      workoutSets: [],
      cardioSessions: [],
      settings: null,
    })
  ),
  downloadAsJson: vi.fn(),
}));

describe('DataExport', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render export button', () => {
    render(<DataExport />);

    expect(screen.getByText('Export All Data')).toBeInTheDocument();
    expect(screen.getByText('Backup Your Data')).toBeInTheDocument();
  });

  it('should call export functions when button is clicked', async () => {
    const user = userEvent.setup();
    const { exportAllData, downloadAsJson } = await import(
      '../../../lib/dataExport'
    );

    render(<DataExport />);

    await user.click(screen.getByText('Export All Data'));

    await waitFor(() => {
      expect(exportAllData).toHaveBeenCalled();
      expect(downloadAsJson).toHaveBeenCalled();
    });
  });

  it('should show success message after export', async () => {
    const user = userEvent.setup();
    render(<DataExport />);

    await user.click(screen.getByText('Export All Data'));

    await waitFor(() => {
      expect(screen.getByText('Data exported successfully')).toBeInTheDocument();
    });
  });

  it('should show exporting state while processing', async () => {
    const user = userEvent.setup();
    const { exportAllData } = await import('../../../lib/dataExport');

    // Make export take some time
    vi.mocked(exportAllData).mockImplementation(
      () =>
        new Promise((resolve) =>
          setTimeout(
            () =>
              resolve({
                version: '1.0',
                exportDate: new Date().toISOString(),
                exercises: [],
                workouts: [],
                workoutSets: [],
                cardioSessions: [],
                settings: null,
              }),
            100
          )
        )
    );

    render(<DataExport />);

    await user.click(screen.getByText('Export All Data'));

    // Button should show exporting state
    expect(screen.getByText('Exporting...')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('Export All Data')).toBeInTheDocument();
    });
  });

  it('should disable button while exporting', async () => {
    const user = userEvent.setup();
    const { exportAllData } = await import('../../../lib/dataExport');

    vi.mocked(exportAllData).mockImplementation(
      () =>
        new Promise((resolve) =>
          setTimeout(
            () =>
              resolve({
                version: '1.0',
                exportDate: new Date().toISOString(),
                exercises: [],
                workouts: [],
                workoutSets: [],
                cardioSessions: [],
                settings: null,
              }),
            100
          )
        )
    );

    render(<DataExport />);

    const button = screen.getByRole('button');
    await user.click(button);

    expect(button).toBeDisabled();

    await waitFor(() => {
      expect(button).not.toBeDisabled();
    });
  });
});
