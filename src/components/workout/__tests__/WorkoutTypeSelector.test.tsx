import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import WorkoutTypeSelector from '../WorkoutTypeSelector';

describe('WorkoutTypeSelector', () => {
  it('should render weights and cardio buttons', () => {
    render(<WorkoutTypeSelector value="weights" onChange={() => {}} />);

    expect(screen.getByRole('button', { name: 'Weights' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Cardio' })).toBeInTheDocument();
  });

  it('should highlight weights when selected', () => {
    render(<WorkoutTypeSelector value="weights" onChange={() => {}} />);

    const weightsButton = screen.getByRole('button', { name: 'Weights' });
    expect(weightsButton).toHaveClass('text-primary');
  });

  it('should highlight cardio when selected', () => {
    render(<WorkoutTypeSelector value="cardio" onChange={() => {}} />);

    const cardioButton = screen.getByRole('button', { name: 'Cardio' });
    expect(cardioButton).toHaveClass('text-primary');
  });

  it('should call onChange with "weights" when weights is clicked', async () => {
    const user = userEvent.setup();
    const mockOnChange = vi.fn();
    render(<WorkoutTypeSelector value="cardio" onChange={mockOnChange} />);

    await user.click(screen.getByRole('button', { name: 'Weights' }));

    expect(mockOnChange).toHaveBeenCalledWith('weights');
  });

  it('should call onChange with "cardio" when cardio is clicked', async () => {
    const user = userEvent.setup();
    const mockOnChange = vi.fn();
    render(<WorkoutTypeSelector value="weights" onChange={mockOnChange} />);

    await user.click(screen.getByRole('button', { name: 'Cardio' }));

    expect(mockOnChange).toHaveBeenCalledWith('cardio');
  });
});
