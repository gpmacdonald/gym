import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { WeightUnit, DistanceUnit, Theme } from '../types';

interface SettingsState {
  // Settings values
  weightUnit: WeightUnit;
  distanceUnit: DistanceUnit;
  theme: Theme;
  restTimerDefault: number; // seconds
  barbellWeight: number; // kg - standard Olympic barbell

  // Actions
  setWeightUnit: (unit: WeightUnit) => void;
  setDistanceUnit: (unit: DistanceUnit) => void;
  setTheme: (theme: Theme) => void;
  setRestTimerDefault: (seconds: number) => void;
  setBarbellWeight: (weight: number) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      // Default values (matching db.ts defaults)
      weightUnit: 'kg',
      distanceUnit: 'km',
      theme: 'system',
      restTimerDefault: 90,
      barbellWeight: 20, // Standard Olympic barbell (20kg / ~45lbs)

      // Actions
      setWeightUnit: (unit) => set({ weightUnit: unit }),
      setDistanceUnit: (unit) => set({ distanceUnit: unit }),
      setTheme: (theme) => set({ theme }),
      setRestTimerDefault: (seconds) => set({ restTimerDefault: seconds }),
      setBarbellWeight: (weight) => set({ barbellWeight: weight }),
    }),
    {
      name: 'fitness-settings',
    }
  )
);
