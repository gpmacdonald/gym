import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import RestTimer from '../RestTimer';
import { useSettingsStore } from '../../../stores/settingsStore';

// Mock AudioContext
const mockAudioContext = {
  createOscillator: vi.fn(() => ({
    connect: vi.fn(),
    start: vi.fn(),
    stop: vi.fn(),
    frequency: { value: 0 },
    type: 'sine',
  })),
  createGain: vi.fn(() => ({
    connect: vi.fn(),
    gain: {
      setValueAtTime: vi.fn(),
      exponentialRampToValueAtTime: vi.fn(),
    },
  })),
  destination: {},
  currentTime: 0,
};

vi.stubGlobal('AudioContext', vi.fn(() => mockAudioContext));

describe('RestTimer', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    useSettingsStore.setState({ restTimerDefault: 90 });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should render with default time from settings', () => {
    render(<RestTimer />);

    expect(screen.getByText('1:30')).toBeInTheDocument();
    expect(screen.getByText('Rest Timer')).toBeInTheDocument();
  });

  it('should render preset buttons', () => {
    render(<RestTimer />);

    expect(screen.getByRole('button', { name: '30s' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '60s' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '90s' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '2m' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '3m' })).toBeInTheDocument();
  });

  it('should start timer when play button is clicked', () => {
    render(<RestTimer />);

    const playButton = screen.getByRole('button', { name: 'Start timer' });
    fireEvent.click(playButton);

    // Timer should now be running, button should show pause
    expect(screen.getByRole('button', { name: 'Pause timer' })).toBeInTheDocument();
  });

  it('should pause timer when pause button is clicked', () => {
    render(<RestTimer />);

    // Start the timer
    const playButton = screen.getByRole('button', { name: 'Start timer' });
    fireEvent.click(playButton);

    // Pause it
    const pauseButton = screen.getByRole('button', { name: 'Pause timer' });
    fireEvent.click(pauseButton);

    // Should show play button again
    expect(screen.getByRole('button', { name: 'Start timer' })).toBeInTheDocument();
  });

  it('should count down when running', () => {
    render(<RestTimer />);

    // Start the timer
    fireEvent.click(screen.getByRole('button', { name: 'Start timer' }));

    // Initial time is 1:30 (90 seconds)
    expect(screen.getByText('1:30')).toBeInTheDocument();

    // Advance 10 seconds
    act(() => {
      vi.advanceTimersByTime(10000);
    });

    // Should now show 1:20
    expect(screen.getByText('1:20')).toBeInTheDocument();
  });

  it('should set time when preset is clicked', () => {
    render(<RestTimer />);

    // Click 30s preset
    fireEvent.click(screen.getByRole('button', { name: '30s' }));

    // Should show 0:30 and start running
    expect(screen.getByText('0:30')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Pause timer' })).toBeInTheDocument();
  });

  it('should reset timer when reset button is clicked', () => {
    render(<RestTimer />);

    // Start and let it run
    fireEvent.click(screen.getByRole('button', { name: 'Start timer' }));
    act(() => {
      vi.advanceTimersByTime(30000);
    });

    // Should show 1:00 now
    expect(screen.getByText('1:00')).toBeInTheDocument();

    // Reset
    fireEvent.click(screen.getByRole('button', { name: 'Reset timer' }));

    // Should be back to 1:30 and stopped
    expect(screen.getByText('1:30')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Start timer' })).toBeInTheDocument();
  });

  it('should show completion message when timer reaches zero', () => {
    useSettingsStore.setState({ restTimerDefault: 5 });
    render(<RestTimer />);

    // Start the timer
    fireEvent.click(screen.getByRole('button', { name: 'Start timer' }));

    // Advance past completion
    act(() => {
      vi.advanceTimersByTime(6000);
    });

    // Should show 0:00 and completion message
    expect(screen.getByText('0:00')).toBeInTheDocument();
    expect(screen.getByText('Rest complete! Ready for next set.')).toBeInTheDocument();
  });

  it('should call onClose when close button is clicked', () => {
    const onClose = vi.fn();
    render(<RestTimer onClose={onClose} />);

    fireEvent.click(screen.getByRole('button', { name: 'Close timer' }));

    expect(onClose).toHaveBeenCalled();
  });

  it('should auto-start when autoStart prop is true', () => {
    render(<RestTimer autoStart />);

    // Should already be running
    expect(screen.getByRole('button', { name: 'Pause timer' })).toBeInTheDocument();
  });

  it('should highlight the selected preset', () => {
    render(<RestTimer />);

    // 90s should be highlighted by default (matches restTimerDefault)
    const preset90 = screen.getByRole('button', { name: '90s' });
    expect(preset90.className).toContain('bg-primary');

    // Click 60s preset
    fireEvent.click(screen.getByRole('button', { name: '60s' }));

    // 60s should now be highlighted
    const preset60 = screen.getByRole('button', { name: '60s' });
    expect(preset60.className).toContain('bg-primary');
  });
});
