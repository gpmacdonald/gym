import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import BottomNav from '../BottomNav';

function renderWithRouter(initialPath: string = '/') {
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <BottomNav />
    </MemoryRouter>
  );
}

describe('BottomNav', () => {
  it('should render all navigation items', () => {
    renderWithRouter();

    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Progress')).toBeInTheDocument();
    expect(screen.getByText('Exercises')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
  });

  it('should render navigation links', () => {
    renderWithRouter();

    const links = screen.getAllByRole('link');
    expect(links).toHaveLength(4);
  });

  it('should highlight the active route', () => {
    renderWithRouter('/');

    const homeLink = screen.getByText('Home').closest('a');
    expect(homeLink).toHaveClass('text-primary');
  });

  it('should highlight progress when on progress route', () => {
    renderWithRouter('/progress');

    const progressLink = screen.getByText('Progress').closest('a');
    expect(progressLink).toHaveClass('text-primary');
  });

  it('should highlight exercises when on exercises route', () => {
    renderWithRouter('/exercises');

    const exercisesLink = screen.getByText('Exercises').closest('a');
    expect(exercisesLink).toHaveClass('text-primary');
  });

  it('should highlight settings when on settings route', () => {
    renderWithRouter('/settings');

    const settingsLink = screen.getByText('Settings').closest('a');
    expect(settingsLink).toHaveClass('text-primary');
  });
});
