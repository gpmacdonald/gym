import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import PRBadge from '../PRBadge';

describe('PRBadge', () => {
  it('should render trophy icon', () => {
    const { container } = render(<PRBadge />);
    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('should not show label by default', () => {
    render(<PRBadge />);
    expect(screen.queryByText('PR')).not.toBeInTheDocument();
  });

  it('should show label when showLabel is true', () => {
    render(<PRBadge showLabel />);
    expect(screen.getByText('PR')).toBeInTheDocument();
  });

  it('should apply correct size class for sm', () => {
    const { container } = render(<PRBadge size="sm" />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveClass('w-3', 'h-3');
  });

  it('should apply correct size class for md', () => {
    const { container } = render(<PRBadge size="md" />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveClass('w-4', 'h-4');
  });

  it('should apply correct size class for lg', () => {
    const { container } = render(<PRBadge size="lg" />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveClass('w-5', 'h-5');
  });
});
