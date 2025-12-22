import { describe, it, expect, beforeEach } from 'vitest';
import { useSettingsStore } from '../settingsStore';

describe('Settings Store', () => {
  beforeEach(() => {
    // Reset to default values before each test
    useSettingsStore.setState({
      weightUnit: 'kg',
      distanceUnit: 'km',
      theme: 'system',
      restTimerDefault: 90,
      barbellWeight: 20,
    });
  });

  describe('Default Values', () => {
    it('should have correct default values', () => {
      const state = useSettingsStore.getState();
      expect(state.weightUnit).toBe('kg');
      expect(state.distanceUnit).toBe('km');
      expect(state.theme).toBe('system');
      expect(state.restTimerDefault).toBe(90);
      expect(state.barbellWeight).toBe(20);
    });
  });

  describe('Weight Unit', () => {
    it('should update weight unit to lbs', () => {
      useSettingsStore.getState().setWeightUnit('lbs');
      expect(useSettingsStore.getState().weightUnit).toBe('lbs');
    });

    it('should update weight unit back to kg', () => {
      useSettingsStore.getState().setWeightUnit('lbs');
      useSettingsStore.getState().setWeightUnit('kg');
      expect(useSettingsStore.getState().weightUnit).toBe('kg');
    });
  });

  describe('Distance Unit', () => {
    it('should update distance unit to miles', () => {
      useSettingsStore.getState().setDistanceUnit('miles');
      expect(useSettingsStore.getState().distanceUnit).toBe('miles');
    });

    it('should update distance unit back to km', () => {
      useSettingsStore.getState().setDistanceUnit('miles');
      useSettingsStore.getState().setDistanceUnit('km');
      expect(useSettingsStore.getState().distanceUnit).toBe('km');
    });
  });

  describe('Theme', () => {
    it('should update theme to dark', () => {
      useSettingsStore.getState().setTheme('dark');
      expect(useSettingsStore.getState().theme).toBe('dark');
    });

    it('should update theme to light', () => {
      useSettingsStore.getState().setTheme('light');
      expect(useSettingsStore.getState().theme).toBe('light');
    });

    it('should update theme back to system', () => {
      useSettingsStore.getState().setTheme('dark');
      useSettingsStore.getState().setTheme('system');
      expect(useSettingsStore.getState().theme).toBe('system');
    });
  });

  describe('Rest Timer Default', () => {
    it('should update rest timer default', () => {
      useSettingsStore.getState().setRestTimerDefault(60);
      expect(useSettingsStore.getState().restTimerDefault).toBe(60);
    });

    it('should allow custom rest timer values', () => {
      useSettingsStore.getState().setRestTimerDefault(120);
      expect(useSettingsStore.getState().restTimerDefault).toBe(120);

      useSettingsStore.getState().setRestTimerDefault(45);
      expect(useSettingsStore.getState().restTimerDefault).toBe(45);
    });
  });

  describe('Barbell Weight', () => {
    it('should update barbell weight', () => {
      useSettingsStore.getState().setBarbellWeight(15);
      expect(useSettingsStore.getState().barbellWeight).toBe(15);
    });

    it('should allow standard barbell weights', () => {
      // Olympic bar (20kg)
      useSettingsStore.getState().setBarbellWeight(20);
      expect(useSettingsStore.getState().barbellWeight).toBe(20);

      // Women's Olympic bar (15kg)
      useSettingsStore.getState().setBarbellWeight(15);
      expect(useSettingsStore.getState().barbellWeight).toBe(15);

      // EZ curl bar (~10kg)
      useSettingsStore.getState().setBarbellWeight(10);
      expect(useSettingsStore.getState().barbellWeight).toBe(10);
    });
  });

  describe('Multiple Updates', () => {
    it('should handle multiple setting changes independently', () => {
      useSettingsStore.getState().setWeightUnit('lbs');
      useSettingsStore.getState().setTheme('dark');
      useSettingsStore.getState().setRestTimerDefault(120);

      const state = useSettingsStore.getState();
      expect(state.weightUnit).toBe('lbs');
      expect(state.theme).toBe('dark');
      expect(state.restTimerDefault).toBe(120);
      // Unchanged values should remain
      expect(state.distanceUnit).toBe('km');
      expect(state.barbellWeight).toBe(20);
    });
  });
});
