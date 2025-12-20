import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import InstallPrompt from '../InstallPrompt';

// Mock the pwa hooks
vi.mock('../../../lib/pwa', () => ({
  useInstallPrompt: vi.fn(),
  useIsPWA: vi.fn(),
  isIOS: vi.fn(),
}));

import { useInstallPrompt, useIsPWA, isIOS } from '../../../lib/pwa';

describe('InstallPrompt', () => {
  const mockPromptInstall = vi.fn();
  const mockDismissPrompt = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useIsPWA as ReturnType<typeof vi.fn>).mockReturnValue(false);
    (isIOS as ReturnType<typeof vi.fn>).mockReturnValue(false);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should not render when shouldShowPrompt is false', () => {
    (useInstallPrompt as ReturnType<typeof vi.fn>).mockReturnValue({
      shouldShowPrompt: false,
      promptInstall: mockPromptInstall,
      dismissPrompt: mockDismissPrompt,
    });

    const { container } = render(<InstallPrompt />);
    expect(container.firstChild).toBeNull();
  });

  it('should not render when already installed as PWA', () => {
    (useIsPWA as ReturnType<typeof vi.fn>).mockReturnValue(true);
    (useInstallPrompt as ReturnType<typeof vi.fn>).mockReturnValue({
      shouldShowPrompt: true,
      promptInstall: mockPromptInstall,
      dismissPrompt: mockDismissPrompt,
    });

    const { container } = render(<InstallPrompt />);
    expect(container.firstChild).toBeNull();
  });

  it('should render install prompt when shouldShowPrompt is true', () => {
    (useInstallPrompt as ReturnType<typeof vi.fn>).mockReturnValue({
      shouldShowPrompt: true,
      promptInstall: mockPromptInstall,
      dismissPrompt: mockDismissPrompt,
    });

    render(<InstallPrompt />);
    expect(screen.getByText('Install Fitness Tracker')).toBeInTheDocument();
  });

  it('should show iOS instructions on iOS devices', () => {
    (useInstallPrompt as ReturnType<typeof vi.fn>).mockReturnValue({
      shouldShowPrompt: true,
      promptInstall: mockPromptInstall,
      dismissPrompt: mockDismissPrompt,
    });
    (isIOS as ReturnType<typeof vi.fn>).mockReturnValue(true);

    render(<InstallPrompt />);
    expect(
      screen.getByText('To install on your iPhone or iPad:')
    ).toBeInTheDocument();
    expect(screen.getByText(/Add to Home Screen/)).toBeInTheDocument();
  });

  it('should show install button on non-iOS devices', () => {
    (useInstallPrompt as ReturnType<typeof vi.fn>).mockReturnValue({
      shouldShowPrompt: true,
      promptInstall: mockPromptInstall,
      dismissPrompt: mockDismissPrompt,
    });
    (isIOS as ReturnType<typeof vi.fn>).mockReturnValue(false);

    render(<InstallPrompt />);
    expect(screen.getByRole('button', { name: /install/i })).toBeInTheDocument();
  });

  it('should call promptInstall when install button is clicked', async () => {
    (useInstallPrompt as ReturnType<typeof vi.fn>).mockReturnValue({
      shouldShowPrompt: true,
      promptInstall: mockPromptInstall,
      dismissPrompt: mockDismissPrompt,
    });

    render(<InstallPrompt />);
    const installButton = screen.getByRole('button', { name: /install/i });
    fireEvent.click(installButton);

    expect(mockPromptInstall).toHaveBeenCalled();
  });

  it('should call dismissPrompt when dismiss button is clicked', () => {
    (useInstallPrompt as ReturnType<typeof vi.fn>).mockReturnValue({
      shouldShowPrompt: true,
      promptInstall: mockPromptInstall,
      dismissPrompt: mockDismissPrompt,
    });

    render(<InstallPrompt />);
    const dismissButton = screen.getByLabelText('Dismiss');
    fireEvent.click(dismissButton);

    expect(mockDismissPrompt).toHaveBeenCalled();
  });

  it('should call dismissPrompt when "Not now" button is clicked', () => {
    (useInstallPrompt as ReturnType<typeof vi.fn>).mockReturnValue({
      shouldShowPrompt: true,
      promptInstall: mockPromptInstall,
      dismissPrompt: mockDismissPrompt,
    });

    render(<InstallPrompt />);
    const notNowButton = screen.getByRole('button', { name: /not now/i });
    fireEvent.click(notNowButton);

    expect(mockDismissPrompt).toHaveBeenCalled();
  });
});
