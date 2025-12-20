import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import OfflineIndicator from '../OfflineIndicator';

// Mock the useOnlineStatus hook
vi.mock('../../../lib/pwa', () => ({
  useOnlineStatus: vi.fn(),
}));

import { useOnlineStatus } from '../../../lib/pwa';

describe('OfflineIndicator', () => {
  const mockUseOnlineStatus = useOnlineStatus as ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should not render when online', () => {
    mockUseOnlineStatus.mockReturnValue(true);

    const { container } = render(<OfflineIndicator />);
    expect(container.firstChild).toBeNull();
  });

  it('should render offline message when offline', () => {
    mockUseOnlineStatus.mockReturnValue(false);

    render(<OfflineIndicator />);
    expect(screen.getByText(/you're offline/i)).toBeInTheDocument();
  });

  it('should show sync message when offline', () => {
    mockUseOnlineStatus.mockReturnValue(false);

    render(<OfflineIndicator />);
    expect(
      screen.getByText(/changes will sync when back online/i)
    ).toBeInTheDocument();
  });
});
