import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from './App';

describe('App', () => {
  it('should render the home page by default', () => {
    render(<App />);
    // Check for the header title
    expect(screen.getByRole('heading', { name: 'Home' })).toBeInTheDocument();
    expect(screen.getByText('Workout logging will go here')).toBeInTheDocument();
  });

  it('should render within HashRouter with AppShell', () => {
    render(<App />);
    // AppShell renders the bottom nav
    expect(screen.getByRole('navigation')).toBeInTheDocument();
    // Check all nav items are present
    expect(screen.getAllByText('Home')).toHaveLength(2); // Header + nav
    expect(screen.getByText('Progress')).toBeInTheDocument();
    expect(screen.getByText('Exercises')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
  });
});
