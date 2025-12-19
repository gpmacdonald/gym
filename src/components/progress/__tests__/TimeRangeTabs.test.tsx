import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TimeRangeTabs, { getStartDateForRange } from '../TimeRangeTabs';

describe('TimeRangeTabs', () => {
  it('should render all time range options', () => {
    render(<TimeRangeTabs value="3M" onChange={() => {}} />);

    expect(screen.getByText('1M')).toBeInTheDocument();
    expect(screen.getByText('3M')).toBeInTheDocument();
    expect(screen.getByText('6M')).toBeInTheDocument();
    expect(screen.getByText('1Y')).toBeInTheDocument();
    expect(screen.getByText('All')).toBeInTheDocument();
  });

  it('should highlight the selected time range', () => {
    render(<TimeRangeTabs value="6M" onChange={() => {}} />);

    const selectedButton = screen.getByText('6M');
    expect(selectedButton).toHaveClass('bg-white');
  });

  it('should call onChange when a tab is clicked', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<TimeRangeTabs value="3M" onChange={handleChange} />);

    await user.click(screen.getByText('1Y'));

    expect(handleChange).toHaveBeenCalledWith('1Y');
  });
});

describe('getStartDateForRange', () => {
  it('should return null for ALL range', () => {
    expect(getStartDateForRange('ALL')).toBeNull();
  });

  it('should return date 1 month ago for 1M', () => {
    const now = new Date();
    const result = getStartDateForRange('1M');

    expect(result).not.toBeNull();
    const expectedMonth = now.getMonth() - 1;
    expect(result!.getMonth()).toBe(expectedMonth < 0 ? expectedMonth + 12 : expectedMonth);
  });

  it('should return date 3 months ago for 3M', () => {
    const result = getStartDateForRange('3M');
    expect(result).not.toBeNull();
  });

  it('should return date 1 year ago for 1Y', () => {
    const now = new Date();
    const result = getStartDateForRange('1Y');

    expect(result).not.toBeNull();
    expect(result!.getFullYear()).toBe(now.getFullYear() - 1);
  });
});
