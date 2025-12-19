import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DataImport from '../DataImport';

// Mock the dataImport module
vi.mock('../../../lib/dataImport', () => ({
  parseImportFile: vi.fn(),
  validateImportFile: vi.fn(),
  importData: vi.fn(),
}));

describe('DataImport', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render file input and instructions', () => {
    render(<DataImport />);

    expect(screen.getByText('Restore Your Data')).toBeInTheDocument();
    expect(screen.getByText('Select backup file')).toBeInTheDocument();
  });

  it('should show validation errors for invalid file', async () => {
    const user = userEvent.setup();
    const { parseImportFile, validateImportFile } = await import(
      '../../../lib/dataImport'
    );

    vi.mocked(parseImportFile).mockResolvedValue({});
    vi.mocked(validateImportFile).mockReturnValue({
      valid: false,
      errors: ['Missing or invalid version', 'Invalid workouts data'],
    });

    render(<DataImport />);

    const file = new File(['{}'], 'backup.json', { type: 'application/json' });
    const input = document.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement;

    await user.upload(input, file);

    await waitFor(() => {
      expect(screen.getByText('Invalid backup file:')).toBeInTheDocument();
      expect(
        screen.getByText('Missing or invalid version')
      ).toBeInTheDocument();
    });
  });

  it('should show preview for valid file', async () => {
    const user = userEvent.setup();
    const { parseImportFile, validateImportFile } = await import(
      '../../../lib/dataImport'
    );

    vi.mocked(parseImportFile).mockResolvedValue({
      version: '1.0',
      workouts: [{}, {}],
      workoutSets: [{}],
      cardioSessions: [{}],
      exercises: [],
      settings: null,
    });
    vi.mocked(validateImportFile).mockReturnValue({
      valid: true,
      errors: [],
      preview: {
        exercises: 0,
        workouts: 2,
        sets: 1,
        cardioSessions: 1,
        hasSettings: false,
      },
    });

    render(<DataImport />);

    const file = new File(['{}'], 'backup.json', { type: 'application/json' });
    const input = document.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement;

    await user.upload(input, file);

    await waitFor(() => {
      expect(screen.getByText('Data Preview')).toBeInTheDocument();
      expect(screen.getByText('2')).toBeInTheDocument(); // workouts
      expect(screen.getByText('Import Data')).toBeInTheDocument();
    });
  });

  it('should have merge and replace mode options', async () => {
    const user = userEvent.setup();
    const { parseImportFile, validateImportFile } = await import(
      '../../../lib/dataImport'
    );

    vi.mocked(parseImportFile).mockResolvedValue({ version: '1.0' });
    vi.mocked(validateImportFile).mockReturnValue({
      valid: true,
      errors: [],
      preview: {
        exercises: 0,
        workouts: 1,
        sets: 0,
        cardioSessions: 0,
        hasSettings: false,
      },
    });

    render(<DataImport />);

    const file = new File(['{}'], 'backup.json', { type: 'application/json' });
    const input = document.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement;

    await user.upload(input, file);

    await waitFor(() => {
      expect(screen.getByText('Merge')).toBeInTheDocument();
      expect(screen.getByText('Replace')).toBeInTheDocument();
    });
  });

  it('should call importData when import button is clicked', async () => {
    const user = userEvent.setup();
    const { parseImportFile, validateImportFile, importData } = await import(
      '../../../lib/dataImport'
    );

    const mockData = {
      version: '1.0',
      workouts: [],
      workoutSets: [],
      cardioSessions: [],
      exercises: [],
      settings: null,
    };

    vi.mocked(parseImportFile).mockResolvedValue(mockData);
    vi.mocked(validateImportFile).mockReturnValue({
      valid: true,
      errors: [],
      preview: {
        exercises: 0,
        workouts: 0,
        sets: 0,
        cardioSessions: 0,
        hasSettings: false,
      },
    });
    vi.mocked(importData).mockResolvedValue({
      success: true,
      errors: [],
      imported: { exercises: 0, workouts: 0, sets: 0, cardioSessions: 0 },
    });

    render(<DataImport />);

    const file = new File(['{}'], 'backup.json', { type: 'application/json' });
    const input = document.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement;

    await user.upload(input, file);

    await waitFor(() => {
      expect(screen.getByText('Import Data')).toBeInTheDocument();
    });

    await user.click(screen.getByText('Import Data'));

    await waitFor(() => {
      expect(importData).toHaveBeenCalledWith(mockData, 'merge');
    });
  });

  it('should show success message after import', async () => {
    const user = userEvent.setup();
    const { parseImportFile, validateImportFile, importData } = await import(
      '../../../lib/dataImport'
    );

    vi.mocked(parseImportFile).mockResolvedValue({ version: '1.0' });
    vi.mocked(validateImportFile).mockReturnValue({
      valid: true,
      errors: [],
      preview: {
        exercises: 0,
        workouts: 5,
        sets: 20,
        cardioSessions: 3,
        hasSettings: false,
      },
    });
    vi.mocked(importData).mockResolvedValue({
      success: true,
      errors: [],
      imported: { exercises: 0, workouts: 5, sets: 20, cardioSessions: 3 },
    });

    render(<DataImport />);

    const file = new File(['{}'], 'backup.json', { type: 'application/json' });
    const input = document.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement;

    await user.upload(input, file);

    await waitFor(() => {
      expect(screen.getByText('Import Data')).toBeInTheDocument();
    });

    await user.click(screen.getByText('Import Data'));

    await waitFor(() => {
      expect(screen.getByText('Import successful!')).toBeInTheDocument();
      expect(
        screen.getByText(/Imported 5 workouts, 20 sets, 3 cardio sessions/)
      ).toBeInTheDocument();
    });
  });
});
