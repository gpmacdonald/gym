import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SetInput from '../SetInput';

// Mock the settings store
const mockWeightUnit = vi.fn(() => 'kg');
vi.mock('../../../stores', () => ({
  useSettingsStore: () => ({
    weightUnit: mockWeightUnit(),
  }),
}));

describe('SetInput', () => {
  const mockOnSave = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mockWeightUnit.mockReturnValue('kg');
  });

  it('should render reps and weight inputs', () => {
    render(<SetInput onSave={mockOnSave} />);

    expect(screen.getByLabelText('Reps')).toBeInTheDocument();
    expect(screen.getByLabelText('Weight')).toBeInTheDocument();
    expect(screen.getByText('Weight (kg)')).toBeInTheDocument();
  });

  it('should render with initial values', () => {
    render(<SetInput onSave={mockOnSave} initialReps={10} initialWeight={50} />);

    expect(screen.getByLabelText('Reps')).toHaveValue(10);
    expect(screen.getByLabelText('Weight')).toHaveValue(50);
  });

  it('should increment reps when + button is clicked', async () => {
    const user = userEvent.setup();
    render(<SetInput onSave={mockOnSave} initialReps={5} />);

    const increaseButton = screen.getByLabelText('Increase reps');
    await user.click(increaseButton);

    expect(screen.getByLabelText('Reps')).toHaveValue(6);
  });

  it('should decrement reps when - button is clicked', async () => {
    const user = userEvent.setup();
    render(<SetInput onSave={mockOnSave} initialReps={5} />);

    const decreaseButton = screen.getByLabelText('Decrease reps');
    await user.click(decreaseButton);

    expect(screen.getByLabelText('Reps')).toHaveValue(4);
  });

  it('should not allow reps to go below 0', async () => {
    const user = userEvent.setup();
    render(<SetInput onSave={mockOnSave} initialReps={0} />);

    const decreaseButton = screen.getByLabelText('Decrease reps');
    await user.click(decreaseButton);

    expect(screen.getByLabelText('Reps')).toHaveValue(null); // 0 shows as empty
  });

  it('should increment weight by 2.5 when using kg', async () => {
    const user = userEvent.setup();
    mockWeightUnit.mockReturnValue('kg');
    render(<SetInput onSave={mockOnSave} initialWeight={50} />);

    const increaseButton = screen.getByLabelText('Increase weight');
    await user.click(increaseButton);

    expect(screen.getByLabelText('Weight')).toHaveValue(52.5);
  });

  it('should increment weight by 5 when using lbs', async () => {
    const user = userEvent.setup();
    mockWeightUnit.mockReturnValue('lbs');
    render(<SetInput onSave={mockOnSave} initialWeight={100} />);

    expect(screen.getByText('Weight (lbs)')).toBeInTheDocument();

    const increaseButton = screen.getByLabelText('Increase weight');
    await user.click(increaseButton);

    expect(screen.getByLabelText('Weight')).toHaveValue(105);
  });

  it('should disable save button when reps or weight is 0', () => {
    render(<SetInput onSave={mockOnSave} initialReps={0} initialWeight={0} />);

    const saveButton = screen.getByLabelText('Add set');
    expect(saveButton).toBeDisabled();
  });

  it('should enable save button when reps and weight are valid', () => {
    render(<SetInput onSave={mockOnSave} initialReps={10} initialWeight={50} />);

    const saveButton = screen.getByLabelText('Add set');
    expect(saveButton).not.toBeDisabled();
  });

  it('should call onSave with correct values when save is clicked', async () => {
    const user = userEvent.setup();
    render(<SetInput onSave={mockOnSave} initialReps={10} initialWeight={50} />);

    const saveButton = screen.getByLabelText('Add set');
    await user.click(saveButton);

    expect(mockOnSave).toHaveBeenCalledWith({
      reps: 10,
      weight: 50,
      rpe: undefined,
    });
  });

  it('should show RPE toggle button by default', () => {
    render(<SetInput onSave={mockOnSave} />);

    expect(screen.getByText('+ RPE')).toBeInTheDocument();
  });

  it('should show RPE input when toggle is clicked', async () => {
    const user = userEvent.setup();
    render(<SetInput onSave={mockOnSave} />);

    await user.click(screen.getByText('+ RPE'));

    expect(screen.getByLabelText('RPE (Rate of Perceived Exertion)')).toBeInTheDocument();
  });

  it('should show RPE input when showRpe prop is true', () => {
    render(<SetInput onSave={mockOnSave} showRpe />);

    expect(screen.getByLabelText('RPE (Rate of Perceived Exertion)')).toBeInTheDocument();
    expect(screen.queryByText('+ RPE')).not.toBeInTheDocument();
  });

  it('should include RPE in onSave when provided', async () => {
    const user = userEvent.setup();
    render(
      <SetInput
        onSave={mockOnSave}
        initialReps={10}
        initialWeight={50}
        initialRpe={8}
        showRpe
      />
    );

    const saveButton = screen.getByLabelText('Add set');
    await user.click(saveButton);

    expect(mockOnSave).toHaveBeenCalledWith({
      reps: 10,
      weight: 50,
      rpe: 8,
    });
  });

  it('should clamp RPE between 1 and 10', async () => {
    const user = userEvent.setup();
    render(<SetInput onSave={mockOnSave} showRpe />);

    const rpeInput = screen.getByLabelText('RPE (Rate of Perceived Exertion)');

    await user.clear(rpeInput);
    await user.type(rpeInput, '15');

    expect(rpeInput).toHaveValue(10);
  });

  it('should allow manual weight entry', async () => {
    const user = userEvent.setup();
    render(<SetInput onSave={mockOnSave} />);

    const weightInput = screen.getByLabelText('Weight');
    await user.clear(weightInput);
    await user.type(weightInput, '75.5');

    expect(weightInput).toHaveValue(75.5);
  });

  it('should allow manual reps entry', async () => {
    const user = userEvent.setup();
    render(<SetInput onSave={mockOnSave} />);

    const repsInput = screen.getByLabelText('Reps');
    await user.type(repsInput, '12');

    expect(repsInput).toHaveValue(12);
  });
});
