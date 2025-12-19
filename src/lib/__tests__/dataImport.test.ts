import { describe, it, expect, beforeEach } from 'vitest';
import { validateImportFile, importData } from '../dataImport';
import { db } from '../db';
import type { ExportData } from '../dataExport';

describe('dataImport', () => {
  beforeEach(async () => {
    await db.exercises.clear();
    await db.workouts.clear();
    await db.workoutSets.clear();
    await db.cardioSessions.clear();
    await db.settings.clear();
  });

  describe('validateImportFile', () => {
    it('should reject null data', () => {
      const result = validateImportFile(null);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Invalid file format');
    });

    it('should reject non-object data', () => {
      const result = validateImportFile('not an object');
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Invalid file format');
    });

    it('should reject data without version', () => {
      const result = validateImportFile({
        workouts: [],
        workoutSets: [],
        cardioSessions: [],
        exercises: [],
      });
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Missing or invalid version');
    });

    it('should reject data without workouts array', () => {
      const result = validateImportFile({
        version: '1.0',
        workoutSets: [],
        cardioSessions: [],
        exercises: [],
      });
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Invalid or missing workouts data');
    });

    it('should accept valid export data', () => {
      const validData: ExportData = {
        version: '1.0',
        exportDate: new Date().toISOString(),
        exercises: [],
        workouts: [],
        workoutSets: [],
        cardioSessions: [],
        settings: null,
      };
      const result = validateImportFile(validData);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should return preview with data counts', () => {
      const validData: ExportData = {
        version: '1.0',
        exportDate: new Date().toISOString(),
        exercises: [
          {
            id: '1',
            name: 'Test',
            muscleGroup: 'chest',
            equipmentType: 'barbell',
            isCustom: true,
            createdAt: new Date(),
          },
        ],
        workouts: [
          {
            id: '1',
            date: new Date(),
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            id: '2',
            date: new Date(),
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
        workoutSets: [
          {
            id: '1',
            workoutId: '1',
            exerciseId: '1',
            setNumber: 1,
            reps: 10,
            weight: 100,
            createdAt: new Date(),
          },
        ],
        cardioSessions: [
          {
            id: '1',
            type: 'treadmill',
            date: new Date(),
            duration: 1800,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
        settings: null,
      };

      const result = validateImportFile(validData);
      expect(result.valid).toBe(true);
      expect(result.preview).toEqual({
        exercises: 1,
        workouts: 2,
        sets: 1,
        cardioSessions: 1,
        hasSettings: false,
      });
    });
  });

  describe('importData', () => {
    const validData: ExportData = {
      version: '1.0',
      exportDate: new Date().toISOString(),
      exercises: [
        {
          id: 'custom-1',
          name: 'My Exercise',
          muscleGroup: 'chest',
          equipmentType: 'dumbbell',
          isCustom: true,
          createdAt: new Date(),
        },
      ],
      workouts: [
        {
          id: 'workout-1',
          date: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      workoutSets: [
        {
          id: 'set-1',
          workoutId: 'workout-1',
          exerciseId: 'custom-1',
          setNumber: 1,
          reps: 10,
          weight: 50,
          createdAt: new Date(),
        },
      ],
      cardioSessions: [
        {
          id: 'cardio-1',
          type: 'treadmill',
          date: new Date(),
          duration: 1800,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      settings: null,
    };

    it('should import data successfully in merge mode', async () => {
      const result = await importData(validData, 'merge');

      expect(result.success).toBe(true);
      expect(result.imported.exercises).toBe(1);
      expect(result.imported.workouts).toBe(1);
      expect(result.imported.sets).toBe(1);
      expect(result.imported.cardioSessions).toBe(1);
    });

    it('should preserve existing data in merge mode', async () => {
      // Add existing data
      await db.workouts.add({
        id: 'existing-workout',
        date: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      await importData(validData, 'merge');

      const workouts = await db.workouts.toArray();
      expect(workouts).toHaveLength(2);
    });

    it('should clear existing data in replace mode', async () => {
      // Add existing data
      await db.workouts.add({
        id: 'existing-workout',
        date: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      await importData(validData, 'replace');

      const workouts = await db.workouts.toArray();
      expect(workouts).toHaveLength(1);
      expect(workouts[0].id).toBe('workout-1');
    });

    it('should import settings when present', async () => {
      const dataWithSettings: ExportData = {
        ...validData,
        settings: {
          id: 'settings',
          weightUnit: 'lbs',
          distanceUnit: 'miles',
          theme: 'dark',
          restTimerDefault: 120,
          barbellWeight: 45,
        },
      };

      await importData(dataWithSettings, 'merge');

      const settings = await db.settings.get('settings');
      expect(settings?.weightUnit).toBe('lbs');
      expect(settings?.theme).toBe('dark');
    });

    it('should handle empty data gracefully', async () => {
      const emptyData: ExportData = {
        version: '1.0',
        exportDate: new Date().toISOString(),
        exercises: [],
        workouts: [],
        workoutSets: [],
        cardioSessions: [],
        settings: null,
      };

      const result = await importData(emptyData, 'merge');

      expect(result.success).toBe(true);
      expect(result.imported.workouts).toBe(0);
    });
  });
});
