import { useState, useEffect, useCallback, useRef } from 'react';
import { Play, Pause, RotateCcw, Timer, X } from 'lucide-react';
import { useSettingsStore } from '../../stores/settingsStore';

const PRESETS = [
  { label: '30s', seconds: 30 },
  { label: '60s', seconds: 60 },
  { label: '90s', seconds: 90 },
  { label: '2m', seconds: 120 },
  { label: '3m', seconds: 180 },
];

interface RestTimerProps {
  autoStart?: boolean;
  onClose?: () => void;
}

export default function RestTimer({ autoStart = false, onClose }: RestTimerProps) {
  const defaultSeconds = useSettingsStore((state) => state.restTimerDefault);
  const [seconds, setSeconds] = useState(defaultSeconds);
  const [isRunning, setIsRunning] = useState(autoStart);
  const [initialSeconds, setInitialSeconds] = useState(defaultSeconds);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Play completion sound using Web Audio API
  const playCompletionSound = useCallback(() => {
    try {
      // Create audio context on demand (required by browsers)
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      }
      const ctx = audioContextRef.current;

      // Create oscillator for beep
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.frequency.value = 880; // A5 note
      oscillator.type = 'sine';

      gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);

      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + 0.5);

      // Play second beep
      setTimeout(() => {
        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();
        osc2.connect(gain2);
        gain2.connect(ctx.destination);
        osc2.frequency.value = 1100; // Higher pitch
        osc2.type = 'sine';
        gain2.gain.setValueAtTime(0.3, ctx.currentTime);
        gain2.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
        osc2.start(ctx.currentTime);
        osc2.stop(ctx.currentTime + 0.5);
      }, 200);
    } catch {
      // Audio not supported or blocked
      console.log('Audio notification not available');
    }
  }, []);

  // Countdown effect
  useEffect(() => {
    if (!isRunning || seconds <= 0) return;

    const interval = setInterval(() => {
      setSeconds((prev) => {
        if (prev <= 1) {
          setIsRunning(false);
          playCompletionSound();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, seconds, playCompletionSound]);

  const handlePresetClick = (presetSeconds: number) => {
    setSeconds(presetSeconds);
    setInitialSeconds(presetSeconds);
    setIsRunning(true);
  };

  const handlePlayPause = () => {
    if (seconds === 0) {
      // Reset and start
      setSeconds(initialSeconds);
      setIsRunning(true);
    } else {
      setIsRunning(!isRunning);
    }
  };

  const handleReset = () => {
    setIsRunning(false);
    setSeconds(initialSeconds);
  };

  const formatTime = (totalSeconds: number): string => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = initialSeconds > 0 ? (seconds / initialSeconds) * 100 : 0;
  const isComplete = seconds === 0 && initialSeconds > 0;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-3">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
          <Timer className="w-4 h-4" />
          <span className="text-sm font-medium">Rest Timer</span>
        </div>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            aria-label="Close timer"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Timer Display */}
      <div className="relative mb-3">
        <div
          className={`text-4xl font-mono font-bold text-center py-4 rounded-lg transition-colors ${
            isComplete
              ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
              : isRunning
                ? 'bg-primary/10 text-primary'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
          }`}
        >
          {formatTime(seconds)}
        </div>
        {/* Progress bar */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200 dark:bg-gray-600 rounded-b-lg overflow-hidden">
          <div
            className={`h-full transition-all duration-1000 ${
              isComplete ? 'bg-green-500' : 'bg-primary'
            }`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-3 mb-3">
        <button
          type="button"
          onClick={handleReset}
          className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          aria-label="Reset timer"
        >
          <RotateCcw className="w-5 h-5" />
        </button>
        <button
          type="button"
          onClick={handlePlayPause}
          className={`p-4 rounded-full text-white transition-colors ${
            isComplete
              ? 'bg-green-500 hover:bg-green-600'
              : 'bg-primary hover:bg-primary/90'
          }`}
          aria-label={isRunning ? 'Pause timer' : 'Start timer'}
        >
          {isRunning ? (
            <Pause className="w-6 h-6" />
          ) : (
            <Play className="w-6 h-6" />
          )}
        </button>
        <div className="w-9" /> {/* Spacer for symmetry */}
      </div>

      {/* Presets */}
      <div className="flex justify-center gap-2">
        {PRESETS.map(({ label, seconds: presetSeconds }) => (
          <button
            key={label}
            type="button"
            onClick={() => handlePresetClick(presetSeconds)}
            className={`px-3 py-1.5 text-sm font-medium rounded-full transition-colors ${
              initialSeconds === presetSeconds && !isComplete
                ? 'bg-primary text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Completion message */}
      {isComplete && (
        <p className="text-center text-sm text-green-600 dark:text-green-400 mt-2 font-medium">
          Rest complete! Ready for next set.
        </p>
      )}
    </div>
  );
}
