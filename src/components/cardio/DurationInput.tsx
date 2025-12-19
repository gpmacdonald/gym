interface DurationInputProps {
  value: number; // seconds
  onChange: (seconds: number) => void;
}

export default function DurationInput({ value, onChange }: DurationInputProps) {
  const minutes = Math.floor(value / 60);
  const seconds = value % 60;

  const handleMinutesChange = (mins: number) => {
    const validMins = Math.max(0, mins);
    onChange(validMins * 60 + seconds);
  };

  const handleSecondsChange = (secs: number) => {
    const validSecs = Math.min(59, Math.max(0, secs));
    onChange(minutes * 60 + validSecs);
  };

  return (
    <div className="flex items-center gap-2">
      <div className="flex flex-col">
        <input
          type="number"
          value={minutes}
          onChange={(e) => handleMinutesChange(parseInt(e.target.value) || 0)}
          className="w-16 h-10 text-center border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          min="0"
          aria-label="Minutes"
        />
        <span className="text-xs text-gray-500 dark:text-gray-400 text-center mt-1">
          min
        </span>
      </div>
      <span className="text-xl font-bold text-gray-500 dark:text-gray-400 pb-5">
        :
      </span>
      <div className="flex flex-col">
        <input
          type="number"
          value={seconds.toString().padStart(2, '0')}
          onChange={(e) =>
            handleSecondsChange(parseInt(e.target.value) || 0)
          }
          className="w-16 h-10 text-center border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          min="0"
          max="59"
          aria-label="Seconds"
        />
        <span className="text-xs text-gray-500 dark:text-gray-400 text-center mt-1">
          sec
        </span>
      </div>
    </div>
  );
}
