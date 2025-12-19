/**
 * Format a duration in seconds to mm:ss format
 */
export function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Format a date for display (e.g., "Thu, Dec 19")
 */
export function formatDate(date: Date): string {
  const now = new Date();
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);

  const dateObj = new Date(date);
  const isToday = dateObj.toDateString() === now.toDateString();
  const isYesterday = dateObj.toDateString() === yesterday.toDateString();

  if (isToday) {
    return 'Today';
  }
  if (isYesterday) {
    return 'Yesterday';
  }

  return new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  }).format(dateObj);
}
