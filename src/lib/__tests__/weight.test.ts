import { describe, it, expect } from 'vitest';
import {
  calculateTotalWeight,
  calculateEnteredWeight,
  convertWeight,
  formatWeight,
  getWeightEntryDescription,
} from '../weight';

describe('Weight Calculations', () => {
  describe('calculateTotalWeight', () => {
    it('should calculate barbell total: (weight × 2) + bar weight', () => {
      // 35kg per side + 20kg bar = 90kg total
      expect(calculateTotalWeight(35, 'barbell', 20)).toBe(90);
      // 25kg per side + 20kg bar = 70kg total
      expect(calculateTotalWeight(25, 'barbell', 20)).toBe(70);
      // 0kg per side + 20kg bar = 20kg total (just the bar)
      expect(calculateTotalWeight(0, 'barbell', 20)).toBe(20);
    });

    it('should use custom barbell weight', () => {
      // 35kg per side + 15kg bar = 85kg total
      expect(calculateTotalWeight(35, 'barbell', 15)).toBe(85);
    });

    it('should calculate dumbbell total: weight × 2', () => {
      // 20kg per dumbbell × 2 = 40kg total
      expect(calculateTotalWeight(20, 'dumbbell')).toBe(40);
      // 15kg per dumbbell × 2 = 30kg total
      expect(calculateTotalWeight(15, 'dumbbell')).toBe(30);
    });

    it('should return weight as-is for machine', () => {
      expect(calculateTotalWeight(50, 'machine')).toBe(50);
      expect(calculateTotalWeight(100, 'machine')).toBe(100);
    });

    it('should return weight as-is for cable', () => {
      expect(calculateTotalWeight(30, 'cable')).toBe(30);
      expect(calculateTotalWeight(45, 'cable')).toBe(45);
    });

    it('should return weight as-is for bodyweight', () => {
      expect(calculateTotalWeight(0, 'bodyweight')).toBe(0);
      expect(calculateTotalWeight(10, 'bodyweight')).toBe(10); // weighted vest
    });

    it('should use default bar weight of 20kg', () => {
      expect(calculateTotalWeight(35, 'barbell')).toBe(90);
    });
  });

  describe('calculateEnteredWeight', () => {
    it('should reverse barbell calculation', () => {
      // 90kg total - 20kg bar = 70kg / 2 = 35kg per side
      expect(calculateEnteredWeight(90, 'barbell', 20)).toBe(35);
      // 70kg total - 20kg bar = 50kg / 2 = 25kg per side
      expect(calculateEnteredWeight(70, 'barbell', 20)).toBe(25);
    });

    it('should reverse dumbbell calculation', () => {
      // 40kg total / 2 = 20kg per dumbbell
      expect(calculateEnteredWeight(40, 'dumbbell')).toBe(20);
    });

    it('should return as-is for machine/cable/bodyweight', () => {
      expect(calculateEnteredWeight(50, 'machine')).toBe(50);
      expect(calculateEnteredWeight(30, 'cable')).toBe(30);
      expect(calculateEnteredWeight(10, 'bodyweight')).toBe(10);
    });

    it('should be inverse of calculateTotalWeight', () => {
      const enteredWeight = 35;
      const barbellWeight = 20;

      const total = calculateTotalWeight(enteredWeight, 'barbell', barbellWeight);
      const reversed = calculateEnteredWeight(total, 'barbell', barbellWeight);

      expect(reversed).toBe(enteredWeight);
    });
  });

  describe('convertWeight', () => {
    it('should convert kg to lbs', () => {
      // 1 kg ≈ 2.20462 lbs
      expect(convertWeight(1, 'kg', 'lbs')).toBeCloseTo(2.20462, 4);
      expect(convertWeight(20, 'kg', 'lbs')).toBeCloseTo(44.0924, 3);
      expect(convertWeight(100, 'kg', 'lbs')).toBeCloseTo(220.462, 2);
    });

    it('should convert lbs to kg', () => {
      // 1 lbs ≈ 0.453592 kg
      expect(convertWeight(1, 'lbs', 'kg')).toBeCloseTo(0.453592, 4);
      expect(convertWeight(45, 'lbs', 'kg')).toBeCloseTo(20.4117, 3);
      expect(convertWeight(100, 'lbs', 'kg')).toBeCloseTo(45.3592, 2);
    });

    it('should return same value when units are the same', () => {
      expect(convertWeight(50, 'kg', 'kg')).toBe(50);
      expect(convertWeight(100, 'lbs', 'lbs')).toBe(100);
    });

    it('should handle round-trip conversion', () => {
      const original = 20;
      const converted = convertWeight(original, 'kg', 'lbs');
      const roundTrip = convertWeight(converted, 'lbs', 'kg');
      expect(roundTrip).toBeCloseTo(original, 10);
    });
  });

  describe('formatWeight', () => {
    it('should format whole numbers without decimal', () => {
      expect(formatWeight(100, 'kg')).toBe('100 kg');
      expect(formatWeight(45, 'lbs')).toBe('45 lbs');
    });

    it('should format decimals with one decimal place', () => {
      expect(formatWeight(22.5, 'kg')).toBe('22.5 kg');
      expect(formatWeight(47.5, 'lbs')).toBe('47.5 lbs');
    });

    it('should round to one decimal place', () => {
      expect(formatWeight(22.555, 'kg')).toBe('22.6 kg');
      expect(formatWeight(22.544, 'kg')).toBe('22.5 kg');
    });

    it('should handle zero', () => {
      expect(formatWeight(0, 'kg')).toBe('0 kg');
    });
  });

  describe('getWeightEntryDescription', () => {
    it('should return correct description for each equipment type', () => {
      expect(getWeightEntryDescription('barbell')).toBe(
        'Weight per side (excluding bar)'
      );
      expect(getWeightEntryDescription('dumbbell')).toBe('Weight per dumbbell');
      expect(getWeightEntryDescription('machine')).toBe('Machine weight');
      expect(getWeightEntryDescription('cable')).toBe('Cable weight');
      expect(getWeightEntryDescription('bodyweight')).toBe(
        'Additional weight (optional)'
      );
    });
  });
});
