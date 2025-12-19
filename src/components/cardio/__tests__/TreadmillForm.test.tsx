import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TreadmillForm from '../TreadmillForm';

// Mock the settings store
vi.mock('../../../stores', () => ({
  useSettingsStore: () => ({
    distanceUnit: 'km',
  }),
}));

describe('TreadmillForm', () => {
  it('should render all form fields', () => {
    render(<TreadmillForm onSave={() => {}} onCancel={() => {}} />);

    expect(screen.getByText('Duration *')).toBeInTheDocument();
    expect(screen.getByText('Distance (km)')).toBeInTheDocument();
    expect(screen.getByText('Avg Incline (%)')).toBeInTheDocument();
    expect(screen.getByText('Max Incline (%)')).toBeInTheDocument();
    expect(screen.getByText('Calories')).toBeInTheDocument();
    expect(screen.getByText('Notes')).toBeInTheDocument();
  });

  it('should disable save button when duration is 0', () => {
    render(<TreadmillForm onSave={() => {}} onCancel={() => {}} />);

    const saveButton = screen.getByText('Save Session');
    expect(saveButton).toBeDisabled();
  });

  it('should enable save button when duration is set', async () => {
    const user = userEvent.setup();
    render(<TreadmillForm onSave={() => {}} onCancel={() => {}} />);

    const minutesInput = screen.getByLabelText('Minutes');
    await user.clear(minutesInput);
    await user.type(minutesInput, '30');

    const saveButton = screen.getByText('Save Session');
    expect(saveButton).not.toBeDisabled();
  });

  it('should call onCancel when cancel button is clicked', async () => {
    const user = userEvent.setup();
    const handleCancel = vi.fn();
    render(<TreadmillForm onSave={() => {}} onCancel={handleCancel} />);

    await user.click(screen.getByText('Cancel'));

    expect(handleCancel).toHaveBeenCalled();
  });

  it('should call onSave with correct data when form is submitted', async () => {
    const user = userEvent.setup();
    const handleSave = vi.fn();
    render(<TreadmillForm onSave={handleSave} onCancel={() => {}} />);

    // Set duration to 30 minutes
    const minutesInput = screen.getByLabelText('Minutes');
    await user.clear(minutesInput);
    await user.type(minutesInput, '30');

    // Set distance
    const distanceInput = screen.getByPlaceholderText('0.0');
    await user.type(distanceInput, '5');

    // Set avg incline
    const avgInclineInputs = screen.getAllByPlaceholderText('0');
    await user.type(avgInclineInputs[0], '2');

    // Save
    await user.click(screen.getByText('Save Session'));

    expect(handleSave).toHaveBeenCalledWith(
      expect.objectContaining({
        duration: 1800, // 30 minutes in seconds
        distance: 5,
        avgIncline: 2,
      })
    );
  });

  it('should auto-calculate average speed from distance and duration', async () => {
    const user = userEvent.setup();
    render(<TreadmillForm onSave={() => {}} onCancel={() => {}} />);

    // Set duration to 30 minutes (1800 seconds)
    const minutesInput = screen.getByLabelText('Minutes');
    await user.clear(minutesInput);
    await user.type(minutesInput, '30');

    // Set distance to 5 km
    const distanceInput = screen.getByPlaceholderText('0.0');
    await user.type(distanceInput, '5');

    // Speed should be 10 km/h (5 km / 0.5 hours)
    expect(screen.getByText('Avg Speed: 10.0 km/h')).toBeInTheDocument();
  });

  it('should allow optional fields to be empty', async () => {
    const user = userEvent.setup();
    const handleSave = vi.fn();
    render(<TreadmillForm onSave={handleSave} onCancel={() => {}} />);

    // Only set duration (required field)
    const minutesInput = screen.getByLabelText('Minutes');
    await user.clear(minutesInput);
    await user.type(minutesInput, '20');

    await user.click(screen.getByText('Save Session'));

    expect(handleSave).toHaveBeenCalledWith({
      duration: 1200,
      distance: undefined,
      avgSpeed: undefined,
      avgIncline: undefined,
      maxIncline: undefined,
      calories: undefined,
      notes: undefined,
    });
  });

  it('should include notes when provided', async () => {
    const user = userEvent.setup();
    const handleSave = vi.fn();
    render(<TreadmillForm onSave={handleSave} onCancel={() => {}} />);

    const minutesInput = screen.getByLabelText('Minutes');
    await user.clear(minutesInput);
    await user.type(minutesInput, '15');

    const notesInput = screen.getByPlaceholderText('How did it feel?');
    await user.type(notesInput, 'Great run!');

    await user.click(screen.getByText('Save Session'));

    expect(handleSave).toHaveBeenCalledWith(
      expect.objectContaining({
        notes: 'Great run!',
      })
    );
  });
});
