import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

describe('App', () => {
  it('should render the title', () => {
    render(<App />);
    expect(screen.getByText('Fitness Tracker')).toBeInTheDocument();
  });

  it('should render the toggle button', () => {
    render(<App />);
    expect(screen.getByRole('button', { name: /toggle/i })).toBeInTheDocument();
  });

  it('should toggle dark mode when button is clicked', async () => {
    const user = userEvent.setup();
    render(<App />);

    const button = screen.getByRole('button', { name: /toggle dark mode/i });
    expect(button).toBeInTheDocument();

    await user.click(button);

    expect(
      screen.getByRole('button', { name: /toggle light mode/i })
    ).toBeInTheDocument();
  });
});
