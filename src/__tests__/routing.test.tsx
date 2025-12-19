import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Home, Progress, Exercises, Settings } from '../pages';

// Helper to render with router at specific path
function renderWithRouter(initialPath: string = '/') {
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/progress" element={<Progress />} />
        <Route path="/exercises" element={<Exercises />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </MemoryRouter>
  );
}

describe('Routing', () => {
  describe('Home Page', () => {
    it('should render home page at root path', () => {
      renderWithRouter('/');
      expect(screen.getByRole('heading', { name: 'Home' })).toBeInTheDocument();
      expect(screen.getByText(/Start.*Workout/)).toBeInTheDocument();
    });
  });

  describe('Progress Page', () => {
    it('should render progress page at /progress', () => {
      renderWithRouter('/progress');
      expect(screen.getByRole('heading', { name: 'Progress' })).toBeInTheDocument();
      expect(screen.getByText('Charts and stats will go here')).toBeInTheDocument();
    });
  });

  describe('Exercises Page', () => {
    it('should render exercises page at /exercises', () => {
      renderWithRouter('/exercises');
      expect(screen.getByRole('heading', { name: 'Exercise Library' })).toBeInTheDocument();
      expect(screen.getByText('Exercise management will go here')).toBeInTheDocument();
    });
  });

  describe('Settings Page', () => {
    it('should render settings page at /settings', () => {
      renderWithRouter('/settings');
      expect(screen.getByRole('heading', { name: 'Settings' })).toBeInTheDocument();
      expect(screen.getByText('Settings and data management will go here')).toBeInTheDocument();
    });
  });

  describe('Invalid Routes', () => {
    it('should redirect to home for unknown routes', () => {
      renderWithRouter('/unknown-route');
      expect(screen.getByRole('heading', { name: 'Home' })).toBeInTheDocument();
    });

    it('should redirect to home for deeply nested unknown routes', () => {
      renderWithRouter('/some/deeply/nested/path');
      expect(screen.getByRole('heading', { name: 'Home' })).toBeInTheDocument();
    });
  });
});
