import { describe, it, expect } from 'vitest';
import {
  formatChartDate,
  formatTooltipDate,
  formatChartNumber,
  formatWeight,
  formatDurationShort,
  formatDistance,
  CHART_COLORS,
} from '../chartUtils';

describe('chartUtils', () => {
  describe('formatChartDate', () => {
    it('should format date as "Mon D"', () => {
      const date = new Date('2025-12-19');
      const result = formatChartDate(date);
      expect(result).toContain('Dec');
      expect(result).toContain('19');
    });

    it('should handle string dates', () => {
      const result = formatChartDate('2025-01-15');
      expect(result).toContain('Jan');
      expect(result).toContain('15');
    });

    it('should handle timestamps', () => {
      const timestamp = new Date('2025-06-01').getTime();
      const result = formatChartDate(timestamp);
      expect(result).toContain('Jun');
    });
  });

  describe('formatTooltipDate', () => {
    it('should format date with weekday', () => {
      const date = new Date('2025-12-19');
      const result = formatTooltipDate(date);
      expect(result).toContain('Fri');
      expect(result).toContain('Dec');
      expect(result).toContain('19');
      expect(result).toContain('2025');
    });
  });

  describe('formatChartNumber', () => {
    it('should format small numbers as-is', () => {
      expect(formatChartNumber(500)).toBe('500');
      expect(formatChartNumber(999)).toBe('999');
    });

    it('should format thousands with k suffix', () => {
      expect(formatChartNumber(1000)).toBe('1.0k');
      expect(formatChartNumber(1500)).toBe('1.5k');
      expect(formatChartNumber(10000)).toBe('10.0k');
    });
  });

  describe('formatWeight', () => {
    it('should format weight with kg unit', () => {
      expect(formatWeight(100, 'kg')).toBe('100kg');
    });

    it('should format weight with lbs unit', () => {
      expect(formatWeight(225, 'lbs')).toBe('225lbs');
    });
  });

  describe('formatDurationShort', () => {
    it('should format minutes only', () => {
      expect(formatDurationShort(1800)).toBe('30m');
      expect(formatDurationShort(2700)).toBe('45m');
    });

    it('should format hours and minutes', () => {
      expect(formatDurationShort(3600)).toBe('1h 0m');
      expect(formatDurationShort(5400)).toBe('1h 30m');
      expect(formatDurationShort(7200)).toBe('2h 0m');
    });
  });

  describe('formatDistance', () => {
    it('should format distance with km unit', () => {
      expect(formatDistance(5.5, 'km')).toBe('5.5 km');
    });

    it('should format distance with miles unit', () => {
      expect(formatDistance(3.1, 'miles')).toBe('3.1 miles');
    });

    it('should round to one decimal place', () => {
      expect(formatDistance(5.123, 'km')).toBe('5.1 km');
    });
  });

  describe('CHART_COLORS', () => {
    it('should have all required colors defined', () => {
      expect(CHART_COLORS.primary).toBeDefined();
      expect(CHART_COLORS.secondary).toBeDefined();
      expect(CHART_COLORS.grid).toBeDefined();
      expect(CHART_COLORS.gridDark).toBeDefined();
      expect(CHART_COLORS.text).toBeDefined();
      expect(CHART_COLORS.textDark).toBeDefined();
    });
  });
});
