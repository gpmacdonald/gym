import { db } from './db';
import type { ExportData } from './dataExport';

export interface ImportResult {
  success: boolean;
  errors: string[];
  imported: {
    exercises: number;
    workouts: number;
    sets: number;
    cardioSessions: number;
  };
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  preview?: {
    exercises: number;
    workouts: number;
    sets: number;
    cardioSessions: number;
    hasSettings: boolean;
  };
}

/**
 * Validate an import file before importing
 */
export function validateImportFile(data: unknown): ValidationResult {
  const errors: string[] = [];

  if (!data || typeof data !== 'object') {
    return { valid: false, errors: ['Invalid file format'] };
  }

  const d = data as Record<string, unknown>;

  if (!d.version || typeof d.version !== 'string') {
    errors.push('Missing or invalid version');
  }

  if (!Array.isArray(d.workouts)) {
    errors.push('Invalid or missing workouts data');
  }

  if (!Array.isArray(d.workoutSets)) {
    errors.push('Invalid or missing workoutSets data');
  }

  if (!Array.isArray(d.cardioSessions)) {
    errors.push('Invalid or missing cardioSessions data');
  }

  if (!Array.isArray(d.exercises)) {
    errors.push('Invalid or missing exercises data');
  }

  if (errors.length > 0) {
    return { valid: false, errors };
  }

  // Generate preview
  const exportData = data as ExportData;
  return {
    valid: true,
    errors: [],
    preview: {
      exercises: exportData.exercises?.length || 0,
      workouts: exportData.workouts?.length || 0,
      sets: exportData.workoutSets?.length || 0,
      cardioSessions: exportData.cardioSessions?.length || 0,
      hasSettings: exportData.settings !== null,
    },
  };
}

/**
 * Parse a JSON file and return the data
 */
export function parseImportFile(file: File): Promise<unknown> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const json = JSON.parse(e.target?.result as string);
        resolve(json);
      } catch {
        reject(new Error('Invalid JSON file'));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
}

/**
 * Import data into the database
 * @param data - The validated export data
 * @param mode - 'merge' adds to existing data, 'replace' clears existing data first
 */
export async function importData(
  data: ExportData,
  mode: 'merge' | 'replace'
): Promise<ImportResult> {
  const result: ImportResult = {
    success: false,
    errors: [],
    imported: { exercises: 0, workouts: 0, sets: 0, cardioSessions: 0 },
  };

  try {
    await db.transaction(
      'rw',
      [db.exercises, db.workouts, db.workoutSets, db.cardioSessions, db.settings],
      async () => {
        if (mode === 'replace') {
          // Clear existing user data
          await db.workouts.clear();
          await db.workoutSets.clear();
          await db.cardioSessions.clear();
          // Only delete custom exercises, keep built-in ones
          await db.exercises.filter((e) => e.isCustom).delete();
        }

        // Import custom exercises
        if (data.exercises?.length) {
          await db.exercises.bulkPut(data.exercises);
          result.imported.exercises = data.exercises.length;
        }

        // Import workouts
        if (data.workouts?.length) {
          await db.workouts.bulkPut(data.workouts);
          result.imported.workouts = data.workouts.length;
        }

        // Import sets
        if (data.workoutSets?.length) {
          await db.workoutSets.bulkPut(data.workoutSets);
          result.imported.sets = data.workoutSets.length;
        }

        // Import cardio sessions
        if (data.cardioSessions?.length) {
          await db.cardioSessions.bulkPut(data.cardioSessions);
          result.imported.cardioSessions = data.cardioSessions.length;
        }

        // Import settings if present
        if (data.settings) {
          await db.settings.put(data.settings);
        }
      }
    );

    result.success = true;
  } catch (error) {
    result.errors.push(
      error instanceof Error ? error.message : 'Unknown error occurred'
    );
  }

  return result;
}
