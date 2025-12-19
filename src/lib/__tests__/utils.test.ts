import { describe, it, expect } from 'vitest';
import { formatDuration, formatDate } from '../utils';

describe('formatDuration', () => {
  it('should format 0 seconds', () => {
    expect(formatDuration(0)).toBe('0:00');
  });

  it('should format seconds only', () => {
    expect(formatDuration(45)).toBe('0:45');
  });

  it('should format minutes and seconds', () => {
    expect(formatDuration(125)).toBe('2:05');
  });

  it('should format larger durations', () => {
    expect(formatDuration(3600)).toBe('60:00');
  });

  it('should pad seconds with leading zero', () => {
    expect(formatDuration(61)).toBe('1:01');
  });
});

describe('formatDate', () => {
  it('should return "Today" for today\'s date', () => {
    const today = new Date();
    expect(formatDate(today)).toBe('Today');
  });

  it('should return "Yesterday" for yesterday\'s date', () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    expect(formatDate(yesterday)).toBe('Yesterday');
  });

  it('should format older dates with weekday, month, and day', () => {
    const oldDate = new Date('2025-01-15');
    const formatted = formatDate(oldDate);
    // Should contain "Wed", "Jan", and "15"
    expect(formatted).toContain('Wed');
    expect(formatted).toContain('Jan');
    expect(formatted).toContain('15');
  });
});
