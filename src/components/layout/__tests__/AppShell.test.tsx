import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import AppShell from '../AppShell';

function renderWithRouter(children: React.ReactNode) {
  return render(
    <MemoryRouter>
      <AppShell>{children}</AppShell>
    </MemoryRouter>
  );
}

describe('AppShell', () => {
  it('should render children', () => {
    renderWithRouter(<div>Test Content</div>);
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('should render BottomNav', () => {
    renderWithRouter(<div>Content</div>);
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Progress')).toBeInTheDocument();
  });

  it('should have main element with proper padding', () => {
    const { container } = renderWithRouter(<div>Content</div>);
    const main = container.querySelector('main');
    expect(main).toHaveClass('pb-20');
  });
});
