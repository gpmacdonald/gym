import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CardioTypeDropdown from '../CardioTypeDropdown';

describe('CardioTypeDropdown', () => {
  it('should render with selected value', () => {
    render(<CardioTypeDropdown value="all" onChange={() => {}} />);

    expect(screen.getByText('All Cardio')).toBeInTheDocument();
  });

  it('should show dropdown options when clicked', async () => {
    const user = userEvent.setup();
    render(<CardioTypeDropdown value="all" onChange={() => {}} />);

    await user.click(screen.getByText('All Cardio'));

    expect(screen.getByText('Treadmill')).toBeInTheDocument();
    expect(screen.getByText('Stationary Bike')).toBeInTheDocument();
  });

  it('should call onChange when option is selected', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<CardioTypeDropdown value="all" onChange={handleChange} />);

    await user.click(screen.getByText('All Cardio'));
    await user.click(screen.getByText('Treadmill'));

    expect(handleChange).toHaveBeenCalledWith('treadmill');
  });

  it('should show treadmill when selected', () => {
    render(<CardioTypeDropdown value="treadmill" onChange={() => {}} />);

    expect(screen.getByText('Treadmill')).toBeInTheDocument();
  });

  it('should show stationary bike when selected', () => {
    render(<CardioTypeDropdown value="stationary-bike" onChange={() => {}} />);

    expect(screen.getByText('Stationary Bike')).toBeInTheDocument();
  });

  it('should close dropdown after selection', async () => {
    const user = userEvent.setup();
    render(<CardioTypeDropdown value="all" onChange={() => {}} />);

    await user.click(screen.getByText('All Cardio'));
    expect(screen.getAllByText('Treadmill').length).toBeGreaterThanOrEqual(1);

    await user.click(screen.getByText('Treadmill'));

    // After selection, dropdown should close
    // There should only be 1 "All Cardio" visible (in the button)
    const allCardioElements = screen.queryAllByText('All Cardio');
    expect(allCardioElements.length).toBe(1);
  });
});
