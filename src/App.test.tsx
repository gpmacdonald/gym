import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from './App';

describe('App', () => {
  it('should render the home page by default', () => {
    render(<App />);
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Workout logging will go here')).toBeInTheDocument();
  });

  it('should render within HashRouter', () => {
    render(<App />);
    // HashRouter is working if the app renders without error
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
  });
});
