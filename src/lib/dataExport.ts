import { db } from './db';
import type {
  Exercise,
  Workout,
  WorkoutSet,
  CardioSession,
  Settings,
} from '../types';

export interface ExportData {
  version: string;
  exportDate: string;
  exercises: Exercise[];
  workouts: Workout[];
  workoutSets: WorkoutSet[];
  cardioSessions: CardioSession[];
  settings: Settings | null;
}

/**
 * Export all user data from the database
 * Only exports custom exercises (not pre-populated ones)
 */
export async function exportAllData(): Promise<ExportData> {
  // Use filter for boolean query (Dexie gotcha)
  const customExercises = await db.exercises
    .filter((exercise) => exercise.isCustom)
    .toArray();

  const [workouts, workoutSets, cardioSessions, settings] = await Promise.all([
    db.workouts.toArray(),
    db.workoutSets.toArray(),
    db.cardioSessions.toArray(),
    db.settings.get('settings'),
  ]);

  return {
    version: '1.0',
    exportDate: new Date().toISOString(),
    exercises: customExercises,
    workouts,
    workoutSets,
    cardioSessions,
    settings: settings || null,
  };
}

/**
 * Download data as a JSON file
 */
export function downloadAsJson(data: ExportData): void {
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const date = new Date().toISOString().split('T')[0];
  const filename = `fitness-tracker-backup-${date}.json`;

  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  URL.revokeObjectURL(url);
}
