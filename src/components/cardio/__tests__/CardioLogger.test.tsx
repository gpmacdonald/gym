import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CardioLogger from '../CardioLogger';

// Mock the queries module
vi.mock('../../../lib/queries', () => ({
  addCardioSession: vi.fn(() => Promise.resolve('session-1')),
}));

// Mock the settings store
vi.mock('../../../stores', () => ({
  useSettingsStore: () => ({
    distanceUnit: 'km',
  }),
}));

describe('CardioLogger', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should show cardio type selector initially', () => {
    render(<CardioLogger onComplete={() => {}} onCancel={() => {}} />);

    expect(screen.getByText('Select Cardio Type')).toBeInTheDocument();
    expect(screen.getByText('Treadmill')).toBeInTheDocument();
    expect(screen.getByText('Bike')).toBeInTheDocument();
  });

  it('should show TreadmillForm when treadmill is selected', async () => {
    const user = userEvent.setup();
    render(<CardioLogger onComplete={() => {}} onCancel={() => {}} />);

    await user.click(screen.getByText('Treadmill'));

    // TreadmillForm has Avg Incline field which BikeForm doesn't have
    expect(screen.getByText('Avg Incline (%)')).toBeInTheDocument();
  });

  it('should show BikeForm when bike is selected', async () => {
    const user = userEvent.setup();
    render(<CardioLogger onComplete={() => {}} onCancel={() => {}} />);

    await user.click(screen.getByText('Bike'));

    // BikeForm has Avg Resistance field which TreadmillForm doesn't have
    expect(screen.getByText('Avg Resistance (1-20)')).toBeInTheDocument();
  });

  it('should call onCancel when cancel is clicked on type selector', async () => {
    const user = userEvent.setup();
    const handleCancel = vi.fn();
    render(<CardioLogger onComplete={() => {}} onCancel={handleCancel} />);

    await user.click(screen.getByText('Cancel'));

    expect(handleCancel).toHaveBeenCalled();
  });

  it('should go back to type selector when cancel is clicked on form', async () => {
    const user = userEvent.setup();
    render(<CardioLogger onComplete={() => {}} onCancel={() => {}} />);

    // Select treadmill
    await user.click(screen.getByText('Treadmill'));
    expect(screen.getByText('Avg Incline (%)')).toBeInTheDocument();

    // Click cancel on the form
    await user.click(screen.getByText('Cancel'));

    // Should be back to type selector
    expect(screen.getByText('Select Cardio Type')).toBeInTheDocument();
  });

  it('should save cardio session and call onComplete', async () => {
    const user = userEvent.setup();
    const handleComplete = vi.fn();
    const { addCardioSession } = await import('../../../lib/queries');

    render(<CardioLogger onComplete={handleComplete} onCancel={() => {}} />);

    // Select treadmill
    await user.click(screen.getByText('Treadmill'));

    // Set duration
    const minutesInput = screen.getByLabelText('Minutes');
    await user.clear(minutesInput);
    await user.type(minutesInput, '30');

    // Save
    await user.click(screen.getByText('Save Session'));

    await waitFor(() => {
      expect(addCardioSession).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'treadmill',
          duration: 1800,
        })
      );
      expect(handleComplete).toHaveBeenCalled();
    });
  });
});
