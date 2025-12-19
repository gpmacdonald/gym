import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CardioTypeSelector from '../CardioTypeSelector';

describe('CardioTypeSelector', () => {
  it('should render both cardio type options', () => {
    render(<CardioTypeSelector value={null} onChange={() => {}} />);

    expect(screen.getByText('Treadmill')).toBeInTheDocument();
    expect(screen.getByText('Bike')).toBeInTheDocument();
  });

  it('should call onChange with treadmill when treadmill is clicked', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<CardioTypeSelector value={null} onChange={handleChange} />);

    await user.click(screen.getByText('Treadmill'));

    expect(handleChange).toHaveBeenCalledWith('treadmill');
  });

  it('should call onChange with stationary-bike when bike is clicked', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<CardioTypeSelector value={null} onChange={handleChange} />);

    await user.click(screen.getByText('Bike'));

    expect(handleChange).toHaveBeenCalledWith('stationary-bike');
  });

  it('should show treadmill as selected when value is treadmill', () => {
    render(<CardioTypeSelector value="treadmill" onChange={() => {}} />);

    const treadmillButton = screen.getByText('Treadmill').closest('button');
    const bikeButton = screen.getByText('Bike').closest('button');

    expect(treadmillButton).toHaveAttribute('aria-pressed', 'true');
    expect(bikeButton).toHaveAttribute('aria-pressed', 'false');
  });

  it('should show bike as selected when value is stationary-bike', () => {
    render(<CardioTypeSelector value="stationary-bike" onChange={() => {}} />);

    const treadmillButton = screen.getByText('Treadmill').closest('button');
    const bikeButton = screen.getByText('Bike').closest('button');

    expect(treadmillButton).toHaveAttribute('aria-pressed', 'false');
    expect(bikeButton).toHaveAttribute('aria-pressed', 'true');
  });

  it('should have touch-friendly button sizes (min 44px)', () => {
    render(<CardioTypeSelector value={null} onChange={() => {}} />);

    const buttons = screen.getAllByRole('button');
    buttons.forEach((button) => {
      // min-h-[88px] ensures adequate touch targets (44px+ per side for icon + text)
      expect(button).toHaveClass('min-h-[88px]');
    });
  });
});
