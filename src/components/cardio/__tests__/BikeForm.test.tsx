import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import BikeForm from '../BikeForm';

// Mock the settings store
vi.mock('../../../stores', () => ({
  useSettingsStore: () => ({
    distanceUnit: 'km',
  }),
}));

describe('BikeForm', () => {
  it('should render all form fields', () => {
    render(<BikeForm onSave={() => {}} onCancel={() => {}} />);

    expect(screen.getByText('Duration *')).toBeInTheDocument();
    expect(screen.getByText('Distance (km) - if available')).toBeInTheDocument();
    expect(screen.getByText('Avg Resistance (1-20)')).toBeInTheDocument();
    expect(screen.getByText('Avg Cadence (RPM)')).toBeInTheDocument();
    expect(screen.getByText('Calories')).toBeInTheDocument();
    expect(screen.getByText('Notes')).toBeInTheDocument();
  });

  it('should disable save button when duration is 0', () => {
    render(<BikeForm onSave={() => {}} onCancel={() => {}} />);

    const saveButton = screen.getByText('Save Session');
    expect(saveButton).toBeDisabled();
  });

  it('should enable save button when duration is set', async () => {
    const user = userEvent.setup();
    render(<BikeForm onSave={() => {}} onCancel={() => {}} />);

    const minutesInput = screen.getByLabelText('Minutes');
    await user.clear(minutesInput);
    await user.type(minutesInput, '20');

    const saveButton = screen.getByText('Save Session');
    expect(saveButton).not.toBeDisabled();
  });

  it('should call onCancel when cancel button is clicked', async () => {
    const user = userEvent.setup();
    const handleCancel = vi.fn();
    render(<BikeForm onSave={() => {}} onCancel={handleCancel} />);

    await user.click(screen.getByText('Cancel'));

    expect(handleCancel).toHaveBeenCalled();
  });

  it('should call onSave with correct data when form is submitted', async () => {
    const user = userEvent.setup();
    const handleSave = vi.fn();
    render(<BikeForm onSave={handleSave} onCancel={() => {}} />);

    // Set duration to 25 minutes
    const minutesInput = screen.getByLabelText('Minutes');
    await user.clear(minutesInput);
    await user.type(minutesInput, '25');

    // Set resistance
    const resistanceInput = screen.getByPlaceholderText('1');
    await user.type(resistanceInput, '12');

    // Set cadence - there are multiple "0" placeholders, get the first one after resistance
    const zeroPlaceholderInputs = screen.getAllByPlaceholderText('0');
    const cadenceInput = zeroPlaceholderInputs[0]; // First is cadence
    await user.type(cadenceInput, '85');

    // Save
    await user.click(screen.getByText('Save Session'));

    expect(handleSave).toHaveBeenCalledWith(
      expect.objectContaining({
        duration: 1500, // 25 minutes in seconds
        avgResistance: 12,
        avgCadence: 85,
      })
    );
  });

  it('should allow optional fields to be empty', async () => {
    const user = userEvent.setup();
    const handleSave = vi.fn();
    render(<BikeForm onSave={handleSave} onCancel={() => {}} />);

    // Only set duration (required field)
    const minutesInput = screen.getByLabelText('Minutes');
    await user.clear(minutesInput);
    await user.type(minutesInput, '15');

    await user.click(screen.getByText('Save Session'));

    expect(handleSave).toHaveBeenCalledWith({
      duration: 900,
      distance: undefined,
      avgResistance: undefined,
      avgCadence: undefined,
      calories: undefined,
      notes: undefined,
    });
  });

  it('should include notes when provided', async () => {
    const user = userEvent.setup();
    const handleSave = vi.fn();
    render(<BikeForm onSave={handleSave} onCancel={() => {}} />);

    const minutesInput = screen.getByLabelText('Minutes');
    await user.clear(minutesInput);
    await user.type(minutesInput, '20');

    const notesInput = screen.getByPlaceholderText('How did it feel?');
    await user.type(notesInput, 'Good interval session');

    await user.click(screen.getByText('Save Session'));

    expect(handleSave).toHaveBeenCalledWith(
      expect.objectContaining({
        notes: 'Good interval session',
      })
    );
  });

  it('should accept distance input', async () => {
    const user = userEvent.setup();
    const handleSave = vi.fn();
    render(<BikeForm onSave={handleSave} onCancel={() => {}} />);

    const minutesInput = screen.getByLabelText('Minutes');
    await user.clear(minutesInput);
    await user.type(minutesInput, '30');

    const distanceInput = screen.getByPlaceholderText('0.0');
    await user.type(distanceInput, '15.5');

    await user.click(screen.getByText('Save Session'));

    expect(handleSave).toHaveBeenCalledWith(
      expect.objectContaining({
        distance: 15.5,
      })
    );
  });
});
