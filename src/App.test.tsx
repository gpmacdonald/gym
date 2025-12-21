import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import App from './App';

// Mock the PWA module
vi.mock('./lib/pwa', () => ({
  useOnlineStatus: () => true,
  useInstallPrompt: () => ({
    shouldShowPrompt: false,
    promptInstall: vi.fn(),
    dismissPrompt: vi.fn(),
  }),
  useIsPWA: () => false,
  isIOS: () => false,
}));

describe('App', () => {
  it('should render the home page by default', async () => {
    render(<App />);
    // Wait for lazy-loaded Home component
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Home' })).toBeInTheDocument();
    });
    // Check for start workout button
    expect(screen.getByText(/Start.*Workout/)).toBeInTheDocument();
  });

  it('should render within HashRouter with AppShell', async () => {
    render(<App />);
    // AppShell renders the bottom nav immediately
    expect(screen.getByRole('navigation')).toBeInTheDocument();
    // Wait for lazy-loaded Home page
    await waitFor(() => {
      expect(screen.getAllByText('Home')).toHaveLength(2); // Header + nav
    });
    expect(screen.getByText('Progress')).toBeInTheDocument();
    expect(screen.getByText('Exercises')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
  });
});
