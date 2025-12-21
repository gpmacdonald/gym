import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ThemeToggle from '../ThemeToggle';
import { useSettingsStore } from '../../../stores/settingsStore';

// Mock the theme module
vi.mock('../../../lib/theme', () => ({
  useTheme: () => {
    const theme = useSettingsStore((state) => state.theme);
    const setTheme = useSettingsStore((state) => state.setTheme);
    return {
      theme,
      setTheme,
      effectiveTheme: theme === 'system' ? 'light' : theme,
      isDark: theme === 'dark',
      toggleTheme: vi.fn(),
    };
  },
}));

describe('ThemeToggle', () => {
  beforeEach(() => {
    useSettingsStore.setState({ theme: 'system' });
  });

  it('should render all three theme options', () => {
    render(<ThemeToggle />);

    expect(screen.getByRole('button', { name: /light/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /dark/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /system/i })).toBeInTheDocument();
  });

  it('should show system as selected by default', () => {
    render(<ThemeToggle />);

    const systemButton = screen.getByRole('button', { name: /system/i });
    expect(systemButton).toHaveAttribute('aria-pressed', 'true');
  });

  it('should change theme to light when light button is clicked', () => {
    render(<ThemeToggle />);

    const lightButton = screen.getByRole('button', { name: /light/i });
    fireEvent.click(lightButton);

    expect(useSettingsStore.getState().theme).toBe('light');
  });

  it('should change theme to dark when dark button is clicked', () => {
    render(<ThemeToggle />);

    const darkButton = screen.getByRole('button', { name: /dark/i });
    fireEvent.click(darkButton);

    expect(useSettingsStore.getState().theme).toBe('dark');
  });

  it('should change theme to system when system button is clicked', () => {
    useSettingsStore.setState({ theme: 'dark' });
    render(<ThemeToggle />);

    const systemButton = screen.getByRole('button', { name: /system/i });
    fireEvent.click(systemButton);

    expect(useSettingsStore.getState().theme).toBe('system');
  });

  it('should display theme description text', () => {
    render(<ThemeToggle />);

    expect(screen.getByText(/choose your preferred color scheme/i)).toBeInTheDocument();
  });

  it('should highlight the currently selected theme', () => {
    useSettingsStore.setState({ theme: 'dark' });
    render(<ThemeToggle />);

    const darkButton = screen.getByRole('button', { name: /dark/i });
    expect(darkButton).toHaveAttribute('aria-pressed', 'true');
    expect(darkButton.className).toContain('border-primary');
  });
});
