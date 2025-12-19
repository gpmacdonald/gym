import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Header from '../Header';

describe('Header', () => {
  it('should render the title', () => {
    render(<Header title="Test Title" />);
    expect(screen.getByRole('heading', { name: 'Test Title' })).toBeInTheDocument();
  });

  it('should render right action when provided', () => {
    render(
      <Header
        title="Test"
        rightAction={<button>Action</button>}
      />
    );
    expect(screen.getByRole('button', { name: 'Action' })).toBeInTheDocument();
  });

  it('should not render right action container when not provided', () => {
    const { container } = render(<Header title="Test" />);
    const header = container.querySelector('header');
    expect(header?.children).toHaveLength(1);
  });
});
