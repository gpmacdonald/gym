# Task Checklist for Claude Code
## Personal Fitness Tracker PWA

**Version:** 1.0  
**Date:** December 18, 2025  
**Total Tasks:** 55

---

## Instructions for Claude Code

1. Work through tasks **sequentially** (do not skip ahead)
2. Each task must be **verified with tests** before marking complete
3. **PAUSE after each task** and ask the human for approval to proceed
4. Update `claude-progress.txt` after every task
5. Commit after every task with a descriptive message

---

## Task Status Legend

- ⬜ Not Started
- 🔄 In Progress
- ✅ Complete
- ❌ Blocked

---

## Phase 1: Foundation & Core Weightlifting (Tasks 1-15)

### Task 1: Project Scaffolding ⬜

**Description:** Initialize a new Vite + React + TypeScript project with proper configuration.

**Steps:**
1. Create new Vite project: `npm create vite@latest fitness-tracker -- --template react-ts`
2. Navigate to project directory
3. Install dependencies: `npm install`
4. Verify project runs with `npm run dev`
5. Create initial folder structure:
   ```
   src/
   ├── components/
   ├── lib/
   ├── pages/
   ├── stores/
   ├── types/
   └── App.tsx
   ```
6. Create `claude-progress.txt` file
7. Create `init.sh` script for starting dev environment

**Verification:**
- [ ] `npm run dev` starts without errors
- [ ] Browser shows default Vite React page at localhost:5173
- [ ] TypeScript compiles without errors
- [ ] Folder structure matches specification
- [ ] `claude-progress.txt` exists
- [ ] `init.sh` is executable and works

**Commit:** `feat: initial project scaffolding with Vite + React + TypeScript`

---

### Task 2: ESLint & Prettier Configuration ⬜

**Description:** Set up code quality tools with appropriate rules for React + TypeScript.

**Steps:**
1. Install ESLint dependencies:
   ```bash
   npm install -D eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin eslint-plugin-react eslint-plugin-react-hooks
   ```
2. Install Prettier:
   ```bash
   npm install -D prettier eslint-config-prettier eslint-plugin-prettier
   ```
3. Create `.eslintrc.cjs`:
   ```javascript
   module.exports = {
     root: true,
     env: { browser: true, es2020: true },
     extends: [
       'eslint:recommended',
       '@typescript-eslint/recommended',
       'plugin:react/recommended',
       'plugin:react-hooks/recommended',
       'prettier'
     ],
     parser: '@typescript-eslint/parser',
     plugins: ['react', '@typescript-eslint'],
     settings: { react: { version: 'detect' } },
     rules: {
       'react/react-in-jsx-scope': 'off',
     }
   }
   ```
4. Create `.prettierrc`:
   ```json
   {
     "semi": true,
     "singleQuote": true,
     "tabWidth": 2,
     "trailingComma": "es5"
   }
   ```
5. Add scripts to `package.json`:
   ```json
   "lint": "eslint src --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
   "format": "prettier --write \"src/**/*.{ts,tsx,css}\""
   ```
6. Run `npm run lint` and fix any issues
7. Run `npm run format`

**Verification:**
- [ ] `npm run lint` runs without errors
- [ ] `npm run format` formats code consistently
- [ ] ESLint catches TypeScript errors appropriately
- [ ] No conflicts between ESLint and Prettier

**Commit:** `chore: configure ESLint and Prettier`

---

### Task 3: Tailwind CSS Setup ⬜

**Description:** Install and configure Tailwind CSS with custom theme colors from PRD.

**Steps:**
1. Install Tailwind:
   ```bash
   npm install -D tailwindcss postcss autoprefixer
   npx tailwindcss init -p
   ```
2. Update `tailwind.config.js`:
   ```javascript
   /** @type {import('tailwindcss').Config} */
   export default {
     content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
     darkMode: 'class',
     theme: {
       extend: {
         colors: {
           primary: {
             light: '#60A5FA', // blue-400
             DEFAULT: '#2563EB', // blue-600
           }
         }
       },
     },
     plugins: [],
   }
   ```
3. Update `src/index.css`:
   ```css
   @tailwind base;
   @tailwind components;
   @tailwind utilities;
   ```
4. Test with a sample component using Tailwind classes
5. Verify dark mode classes work

**Verification:**
- [ ] Tailwind classes apply correctly (test with `bg-primary`)
- [ ] Custom colors work as expected
- [ ] Dark mode classes work (`dark:bg-gray-900`)
- [ ] Build completes without CSS errors

**Commit:** `feat: configure Tailwind CSS with custom theme`

---

### Task 4: Vitest & React Testing Library Setup ⬜

**Description:** Set up testing infrastructure for unit and component tests.

**Steps:**
1. Install testing dependencies:
   ```bash
   npm install -D vitest jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event
   ```
2. Create `vitest.config.ts`:
   ```typescript
   import { defineConfig } from 'vitest/config';
   import react from '@vitejs/plugin-react';

   export default defineConfig({
     plugins: [react()],
     test: {
       environment: 'jsdom',
       globals: true,
       setupFiles: ['./src/test/setup.ts'],
       coverage: {
         provider: 'v8',
         reporter: ['text', 'html'],
       },
     },
   });
   ```
3. Create `src/test/setup.ts`:
   ```typescript
   import '@testing-library/jest-dom';
   ```
4. Add to `tsconfig.json` compilerOptions:
   ```json
   "types": ["vitest/globals", "@testing-library/jest-dom"]
   ```
5. Add test scripts to `package.json`:
   ```json
   "test": "vitest run",
   "test:watch": "vitest",
   "test:coverage": "vitest run --coverage"
   ```
6. Create sample test `src/test/setup.test.ts`:
   ```typescript
   describe('Test Setup', () => {
     it('should run tests', () => {
       expect(true).toBe(true);
     });
   });
   ```
7. Run `npm test` to verify

**Verification:**
- [ ] `npm test` runs without errors
- [ ] Sample test passes
- [ ] Coverage report generates with `npm run test:coverage`
- [ ] React Testing Library can render components

**Commit:** `chore: configure Vitest and React Testing Library`

---

### Task 5: TypeScript Types Definition ⬜

**Description:** Define all TypeScript interfaces based on PRD data model.

**Steps:**
1. Create `src/types/index.ts`:
   ```typescript
   // Muscle groups for exercises
   export type MuscleGroup = 'chest' | 'back' | 'legs' | 'shoulders' | 'arms' | 'core';

   // Cardio types
   export type CardioType = 'treadmill' | 'stationary-bike';

   // Weight and distance units
   export type WeightUnit = 'lbs' | 'kg';
   export type DistanceUnit = 'miles' | 'km';

   // Theme options
   export type Theme = 'light' | 'dark' | 'system';

   // Exercise interface
   export interface Exercise {
     id: string;
     name: string;
     muscleGroup: MuscleGroup;
     isCustom: boolean;
     createdAt: Date;
   }

   // Workout interface (weightlifting session)
   export interface Workout {
     id: string;
     date: Date;
     notes?: string;
     createdAt: Date;
     updatedAt: Date;
   }

   // Individual set within a workout
   export interface WorkoutSet {
     id: string;
     workoutId: string;
     exerciseId: string;
     setNumber: number;
     reps: number;
     weight: number; // Always stored in lbs
     rpe?: number; // Rate of Perceived Exertion (1-10)
     createdAt: Date;
   }

   // Cardio session interface
   export interface CardioSession {
     id: string;
     date: Date;
     type: CardioType;
     duration: number; // seconds
     distance?: number; // Always stored in miles
     avgSpeed?: number; // mph
     avgIncline?: number; // percentage (treadmill)
     maxIncline?: number; // percentage (treadmill)
     avgResistance?: number; // 1-20 scale (bike)
     avgCadence?: number; // RPM (bike)
     calories?: number;
     notes?: string;
     createdAt: Date;
     updatedAt: Date;
   }

   // User settings
   export interface Settings {
     id: 'settings';
     weightUnit: WeightUnit;
     distanceUnit: DistanceUnit;
     theme: Theme;
     restTimerDefault: number; // seconds
   }

   // For displaying workouts with their sets
   export interface WorkoutWithSets extends Workout {
     sets: WorkoutSet[];
     exercises: Exercise[];
   }

   // Combined activity for history display
   export type ActivityType = 'workout' | 'cardio';
   export interface Activity {
     id: string;
     type: ActivityType;
     date: Date;
     data: Workout | CardioSession;
   }
   ```

**Verification:**
- [ ] All interfaces match PRD data model
- [ ] TypeScript compiles without errors
- [ ] Types can be imported: `import { Exercise } from '@/types'`

**Commit:** `feat: define TypeScript interfaces for data model`

---

### Task 6: Dexie.js Database Setup ⬜

**Description:** Set up IndexedDB with Dexie.js and define schema.

**Steps:**
1. Install Dexie: `npm install dexie`
2. Create `src/lib/db.ts`:
   ```typescript
   import Dexie, { Table } from 'dexie';
   import { Exercise, Workout, WorkoutSet, CardioSession, Settings } from '../types';

   export class FitnessDatabase extends Dexie {
     exercises!: Table<Exercise>;
     workouts!: Table<Workout>;
     workoutSets!: Table<WorkoutSet>;
     cardioSessions!: Table<CardioSession>;
     settings!: Table<Settings>;

     constructor() {
       super('FitnessTracker');
       
       this.version(1).stores({
         exercises: 'id, name, muscleGroup, isCustom',
         workouts: 'id, date',
         workoutSets: 'id, workoutId, exerciseId, [workoutId+setNumber]',
         cardioSessions: 'id, date, type',
         settings: 'id'
       });
     }
   }

   export const db = new FitnessDatabase();
   ```
3. Create test file `src/lib/__tests__/db.test.ts`:
   ```typescript
   import { describe, it, expect, beforeEach } from 'vitest';
   import { db } from '../db';

   describe('Database', () => {
     beforeEach(async () => {
       await db.exercises.clear();
       await db.workouts.clear();
       await db.workoutSets.clear();
       await db.cardioSessions.clear();
     });

     it('should initialize database', () => {
       expect(db.name).toBe('FitnessTracker');
     });

     it('should have all required tables', () => {
       expect(db.exercises).toBeDefined();
       expect(db.workouts).toBeDefined();
       expect(db.workoutSets).toBeDefined();
       expect(db.cardioSessions).toBeDefined();
       expect(db.settings).toBeDefined();
     });

     it('should add and retrieve an exercise', async () => {
       const exercise = {
         id: 'test-1',
         name: 'Bench Press',
         muscleGroup: 'chest' as const,
         isCustom: false,
         createdAt: new Date()
       };
       await db.exercises.add(exercise);
       const retrieved = await db.exercises.get('test-1');
       expect(retrieved?.name).toBe('Bench Press');
     });
   });
   ```

**Verification:**
- [ ] Database initializes without errors
- [ ] All tables are created
- [ ] Can perform basic CRUD operations
- [ ] All tests pass: `npm test src/lib/__tests__/db.test.ts`

**Commit:** `feat: set up Dexie.js database with schema`

---

### Task 7: Database Query Functions ⬜

**Description:** Create reusable database query functions for all CRUD operations.

**Steps:**
1. Create `src/lib/queries.ts` with the following functions:

**Exercise Queries:**
```typescript
// Get all exercises
export async function getAllExercises(): Promise<Exercise[]>

// Get exercise by ID
export async function getExerciseById(id: string): Promise<Exercise | undefined>

// Get exercises by muscle group
export async function getExercisesByMuscleGroup(group: MuscleGroup): Promise<Exercise[]>

// Search exercises by name
export async function searchExercises(query: string): Promise<Exercise[]>

// Add new exercise
export async function addExercise(exercise: Omit<Exercise, 'id' | 'createdAt'>): Promise<string>

// Update exercise
export async function updateExercise(id: string, data: Partial<Exercise>): Promise<void>

// Delete exercise
export async function deleteExercise(id: string): Promise<void>
```

**Workout Queries:**
```typescript
// Get all workouts
export async function getAllWorkouts(): Promise<Workout[]>

// Get workout by ID
export async function getWorkoutById(id: string): Promise<Workout | undefined>

// Get workouts by date range
export async function getWorkoutsByDateRange(start: Date, end: Date): Promise<Workout[]>

// Add new workout
export async function addWorkout(workout: Omit<Workout, 'id' | 'createdAt' | 'updatedAt'>): Promise<string>

// Update workout
export async function updateWorkout(id: string, data: Partial<Workout>): Promise<void>

// Delete workout (and associated sets)
export async function deleteWorkout(id: string): Promise<void>
```

**Set Queries:**
```typescript
// Get sets by workout ID
export async function getSetsByWorkoutId(workoutId: string): Promise<WorkoutSet[]>

// Add new set
export async function addSet(set: Omit<WorkoutSet, 'id' | 'createdAt'>): Promise<string>

// Update set
export async function updateSet(id: string, data: Partial<WorkoutSet>): Promise<void>

// Delete set
export async function deleteSet(id: string): Promise<void>
```

2. Create comprehensive test file `src/lib/__tests__/queries.test.ts` with 15+ tests

**Verification:**
- [ ] All query functions work correctly
- [ ] Error handling for invalid IDs
- [ ] Queries return correct data types
- [ ] All tests pass (15+ tests)

**Commit:** `feat: implement database query functions`

---

### Task 8: Pre-populate Exercise Library ⬜

**Description:** Seed database with 46 pre-defined exercises from PRD.

**Steps:**
1. Create `src/lib/seed.ts`:
   ```typescript
   import { db } from './db';
   import { Exercise, MuscleGroup } from '../types';
   import { v4 as uuidv4 } from 'uuid';

   const DEFAULT_EXERCISES: Array<{ name: string; muscleGroup: MuscleGroup }> = [
     // Chest (7)
     { name: 'Barbell Bench Press', muscleGroup: 'chest' },
     { name: 'Dumbbell Bench Press', muscleGroup: 'chest' },
     { name: 'Incline Barbell Bench Press', muscleGroup: 'chest' },
     { name: 'Incline Dumbbell Bench Press', muscleGroup: 'chest' },
     { name: 'Dumbbell Flyes', muscleGroup: 'chest' },
     { name: 'Cable Flyes', muscleGroup: 'chest' },
     { name: 'Push-ups', muscleGroup: 'chest' },
     
     // Back (8)
     { name: 'Conventional Deadlift', muscleGroup: 'back' },
     { name: 'Barbell Row', muscleGroup: 'back' },
     { name: 'Dumbbell Row', muscleGroup: 'back' },
     { name: 'Pull-ups', muscleGroup: 'back' },
     { name: 'Lat Pulldown', muscleGroup: 'back' },
     { name: 'Seated Cable Row', muscleGroup: 'back' },
     { name: 'T-Bar Row', muscleGroup: 'back' },
     { name: 'Face Pulls', muscleGroup: 'back' },
     
     // Legs (10)
     { name: 'Barbell Back Squat', muscleGroup: 'legs' },
     { name: 'Barbell Front Squat', muscleGroup: 'legs' },
     { name: 'Romanian Deadlift', muscleGroup: 'legs' },
     { name: 'Leg Press', muscleGroup: 'legs' },
     { name: 'Bulgarian Split Squat', muscleGroup: 'legs' },
     { name: 'Lunges', muscleGroup: 'legs' },
     { name: 'Leg Extension', muscleGroup: 'legs' },
     { name: 'Leg Curl', muscleGroup: 'legs' },
     { name: 'Calf Raise', muscleGroup: 'legs' },
     { name: 'Hip Thrust', muscleGroup: 'legs' },
     
     // Shoulders (7)
     { name: 'Overhead Press', muscleGroup: 'shoulders' },
     { name: 'Dumbbell Shoulder Press', muscleGroup: 'shoulders' },
     { name: 'Lateral Raises', muscleGroup: 'shoulders' },
     { name: 'Front Raises', muscleGroup: 'shoulders' },
     { name: 'Rear Delt Flyes', muscleGroup: 'shoulders' },
     { name: 'Upright Row', muscleGroup: 'shoulders' },
     { name: 'Arnold Press', muscleGroup: 'shoulders' },
     
     // Arms (8)
     { name: 'Barbell Curl', muscleGroup: 'arms' },
     { name: 'Dumbbell Curl', muscleGroup: 'arms' },
     { name: 'Hammer Curl', muscleGroup: 'arms' },
     { name: 'Preacher Curl', muscleGroup: 'arms' },
     { name: 'Tricep Pushdown', muscleGroup: 'arms' },
     { name: 'Overhead Tricep Extension', muscleGroup: 'arms' },
     { name: 'Dips', muscleGroup: 'arms' },
     { name: 'Close-Grip Bench Press', muscleGroup: 'arms' },
     
     // Core (6)
     { name: 'Plank', muscleGroup: 'core' },
     { name: 'Side Plank', muscleGroup: 'core' },
     { name: 'Crunches', muscleGroup: 'core' },
     { name: 'Russian Twists', muscleGroup: 'core' },
     { name: 'Hanging Leg Raises', muscleGroup: 'core' },
     { name: 'Cable Crunches', muscleGroup: 'core' },
   ];

   export async function seedExercises(): Promise<void> {
     const existingCount = await db.exercises.count();
     if (existingCount > 0) {
       console.log('Exercises already seeded, skipping...');
       return;
     }

     const exercises: Exercise[] = DEFAULT_EXERCISES.map(ex => ({
       id: uuidv4(),
       name: ex.name,
       muscleGroup: ex.muscleGroup,
       isCustom: false,
       createdAt: new Date(),
     }));

     await db.exercises.bulkAdd(exercises);
     console.log(`Seeded ${exercises.length} exercises`);
   }

   export async function isSeeded(): Promise<boolean> {
     const count = await db.exercises.where('isCustom').equals(false).count();
     return count >= DEFAULT_EXERCISES.length;
   }
   ```

2. Install uuid: `npm install uuid` and `npm install -D @types/uuid`

3. Create test file `src/lib/__tests__/seed.test.ts`

4. Call `seedExercises()` in app initialization

**Verification:**
- [ ] All 46 exercises are seeded correctly
- [ ] Each exercise has correct muscle group
- [ ] No duplicates created on re-run
- [ ] `isCustom` is false for all seeded exercises
- [ ] Tests pass

**Commit:** `feat: seed exercise library with 46 pre-defined exercises`

---

*Continued in next section...*
# Task Checklist - Part 2
## Phase 1 Continued (Tasks 9-15)

---

### Task 9: Zustand Settings Store ⬜

**Description:** Set up global state management for user settings with persistence.

**Steps:**
1. Install Zustand: `npm install zustand`
2. Create `src/stores/settingsStore.ts`:
   ```typescript
   import { create } from 'zustand';
   import { persist } from 'zustand/middleware';
   import { WeightUnit, DistanceUnit, Theme } from '../types';

   interface SettingsState {
     weightUnit: WeightUnit;
     distanceUnit: DistanceUnit;
     theme: Theme;
     restTimerDefault: number;
     
     setWeightUnit: (unit: WeightUnit) => void;
     setDistanceUnit: (unit: DistanceUnit) => void;
     setTheme: (theme: Theme) => void;
     setRestTimerDefault: (seconds: number) => void;
   }

   export const useSettingsStore = create<SettingsState>()(
     persist(
       (set) => ({
         weightUnit: 'lbs',
         distanceUnit: 'miles',
         theme: 'system',
         restTimerDefault: 90,

         setWeightUnit: (unit) => set({ weightUnit: unit }),
         setDistanceUnit: (unit) => set({ distanceUnit: unit }),
         setTheme: (theme) => set({ theme: theme }),
         setRestTimerDefault: (seconds) => set({ restTimerDefault: seconds }),
       }),
       {
         name: 'fitness-settings',
       }
     )
   );
   ```

3. Create test file `src/stores/__tests__/settingsStore.test.ts`:
   ```typescript
   import { describe, it, expect, beforeEach } from 'vitest';
   import { useSettingsStore } from '../settingsStore';

   describe('Settings Store', () => {
     beforeEach(() => {
       useSettingsStore.setState({
         weightUnit: 'lbs',
         distanceUnit: 'miles',
         theme: 'system',
         restTimerDefault: 90,
       });
     });

     it('should have correct default values', () => {
       const state = useSettingsStore.getState();
       expect(state.weightUnit).toBe('lbs');
       expect(state.distanceUnit).toBe('miles');
       expect(state.theme).toBe('system');
       expect(state.restTimerDefault).toBe(90);
     });

     it('should update weight unit', () => {
       useSettingsStore.getState().setWeightUnit('kg');
       expect(useSettingsStore.getState().weightUnit).toBe('kg');
     });

     it('should update theme', () => {
       useSettingsStore.getState().setTheme('dark');
       expect(useSettingsStore.getState().theme).toBe('dark');
     });
   });
   ```

**Verification:**
- [ ] Settings persist across page reloads
- [ ] Theme changes apply correctly
- [ ] Unit changes update state
- [ ] Default values are correct
- [ ] Tests pass

**Commit:** `feat: implement Zustand settings store with persistence`

---

### Task 10: React Router Setup ⬜

**Description:** Configure client-side routing with React Router using HashRouter for PWA compatibility.

**Steps:**
1. Install React Router: `npm install react-router-dom`
2. Create placeholder page components:
   
   `src/pages/Home.tsx`:
   ```typescript
   export default function Home() {
     return (
       <div className="p-4">
         <h1 className="text-2xl font-bold">Home</h1>
         <p>Workout logging will go here</p>
       </div>
     );
   }
   ```
   
   `src/pages/Progress.tsx`:
   ```typescript
   export default function Progress() {
     return (
       <div className="p-4">
         <h1 className="text-2xl font-bold">Progress</h1>
         <p>Charts and stats will go here</p>
       </div>
     );
   }
   ```
   
   `src/pages/Exercises.tsx`:
   ```typescript
   export default function Exercises() {
     return (
       <div className="p-4">
         <h1 className="text-2xl font-bold">Exercise Library</h1>
         <p>Exercise management will go here</p>
       </div>
     );
   }
   ```
   
   `src/pages/Settings.tsx`:
   ```typescript
   export default function Settings() {
     return (
       <div className="p-4">
         <h1 className="text-2xl font-bold">Settings</h1>
         <p>Settings and data management will go here</p>
       </div>
     );
   }
   ```

3. Update `src/App.tsx`:
   ```typescript
   import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
   import Home from './pages/Home';
   import Progress from './pages/Progress';
   import Exercises from './pages/Exercises';
   import Settings from './pages/Settings';

   function App() {
     return (
       <HashRouter>
         <Routes>
           <Route path="/" element={<Home />} />
           <Route path="/progress" element={<Progress />} />
           <Route path="/exercises" element={<Exercises />} />
           <Route path="/settings" element={<Settings />} />
           <Route path="*" element={<Navigate to="/" replace />} />
         </Routes>
       </HashRouter>
     );
   }

   export default App;
   ```

4. Create test file `src/__tests__/routing.test.tsx`

**Verification:**
- [ ] Navigation between pages works
- [ ] URL hash changes correctly (e.g., `/#/progress`)
- [ ] Direct URL access works
- [ ] Invalid routes redirect to home
- [ ] Tests pass

**Commit:** `feat: configure React Router with page routes`

---

### Task 11: App Shell & Layout Components ⬜

**Description:** Create the main app layout with bottom navigation optimized for iPhone.

**Steps:**
1. Create `src/components/layout/BottomNav.tsx`:
   ```typescript
   import { NavLink } from 'react-router-dom';
   import { Home, TrendingUp, Dumbbell, Settings } from 'lucide-react';

   const navItems = [
     { to: '/', icon: Home, label: 'Home' },
     { to: '/progress', icon: TrendingUp, label: 'Progress' },
     { to: '/exercises', icon: Dumbbell, label: 'Exercises' },
     { to: '/settings', icon: Settings, label: 'Settings' },
   ];

   export default function BottomNav() {
     return (
       <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 pb-safe">
         <div className="flex justify-around items-center h-16">
           {navItems.map(({ to, icon: Icon, label }) => (
             <NavLink
               key={to}
               to={to}
               className={({ isActive }) =>
                 `flex flex-col items-center justify-center w-full h-full min-h-[44px] ${
                   isActive
                     ? 'text-primary dark:text-primary-light'
                     : 'text-gray-500 dark:text-gray-400'
                 }`
               }
             >
               <Icon className="w-6 h-6" />
               <span className="text-xs mt-1">{label}</span>
             </NavLink>
           ))}
         </div>
       </nav>
     );
   }
   ```

2. Install Lucide icons: `npm install lucide-react`

3. Create `src/components/layout/Header.tsx`:
   ```typescript
   interface HeaderProps {
     title: string;
     rightAction?: React.ReactNode;
   }

   export default function Header({ title, rightAction }: HeaderProps) {
     return (
       <header className="sticky top-0 z-10 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 pt-safe">
         <div className="flex items-center justify-between h-14 px-4">
           <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
             {title}
           </h1>
           {rightAction && <div>{rightAction}</div>}
         </div>
       </header>
     );
   }
   ```

4. Create `src/components/layout/AppShell.tsx`:
   ```typescript
   import BottomNav from './BottomNav';

   interface AppShellProps {
     children: React.ReactNode;
   }

   export default function AppShell({ children }: AppShellProps) {
     return (
       <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
         <main className="pb-20">
           {children}
         </main>
         <BottomNav />
       </div>
     );
   }
   ```

5. Add safe area CSS to `src/index.css`:
   ```css
   @tailwind base;
   @tailwind components;
   @tailwind utilities;

   @layer utilities {
     .pt-safe {
       padding-top: env(safe-area-inset-top);
     }
     .pb-safe {
       padding-bottom: env(safe-area-inset-bottom);
     }
   }
   ```

6. Update App.tsx to use AppShell
7. Create test file `src/components/layout/__tests__/AppShell.test.tsx`

**Verification:**
- [ ] Bottom nav appears on all pages
- [ ] Active tab is highlighted with primary color
- [ ] Navigation works via tab clicks
- [ ] Layout is mobile-optimized (44px touch targets)
- [ ] Safe area insets work on iPhone
- [ ] Tests pass

**Commit:** `feat: create app shell and bottom navigation`

---

### Task 12: Exercise Selector Component ⬜

**Description:** Build searchable dropdown for selecting exercises during workout logging.

**Steps:**
1. Create `src/components/workout/ExerciseSelector.tsx`:
   ```typescript
   import { useState, useEffect, useMemo } from 'react';
   import { Search, X } from 'lucide-react';
   import { Exercise, MuscleGroup } from '../../types';
   import { getAllExercises, searchExercises } from '../../lib/queries';

   interface ExerciseSelectorProps {
     onSelect: (exercise: Exercise) => void;
     recentExerciseIds?: string[];
   }

   const MUSCLE_GROUPS: MuscleGroup[] = ['chest', 'back', 'legs', 'shoulders', 'arms', 'core'];

   export default function ExerciseSelector({ onSelect, recentExerciseIds = [] }: ExerciseSelectorProps) {
     const [query, setQuery] = useState('');
     const [exercises, setExercises] = useState<Exercise[]>([]);
     const [selectedGroup, setSelectedGroup] = useState<MuscleGroup | null>(null);
     const [isLoading, setIsLoading] = useState(true);

     useEffect(() => {
       loadExercises();
     }, []);

     async function loadExercises() {
       setIsLoading(true);
       const all = await getAllExercises();
       setExercises(all);
       setIsLoading(false);
     }

     const filteredExercises = useMemo(() => {
       let result = exercises;
       
       if (query) {
         result = result.filter(ex => 
           ex.name.toLowerCase().includes(query.toLowerCase())
         );
       }
       
       if (selectedGroup) {
         result = result.filter(ex => ex.muscleGroup === selectedGroup);
       }
       
       // Sort: recent first, then alphabetical
       return result.sort((a, b) => {
         const aRecent = recentExerciseIds.indexOf(a.id);
         const bRecent = recentExerciseIds.indexOf(b.id);
         if (aRecent !== -1 && bRecent === -1) return -1;
         if (bRecent !== -1 && aRecent === -1) return 1;
         if (aRecent !== -1 && bRecent !== -1) return aRecent - bRecent;
         return a.name.localeCompare(b.name);
       });
     }, [exercises, query, selectedGroup, recentExerciseIds]);

     // ... render UI with search input, filter chips, and exercise list
   }
   ```

2. Style with Tailwind for touch-friendly interface
3. Create test file `src/components/workout/__tests__/ExerciseSelector.test.tsx`:
   ```typescript
   // Test cases:
   // - Renders list of exercises
   // - Search filters results correctly
   // - Muscle group filter works
   // - Clicking exercise calls onSelect with correct exercise
   // - Shows "No results" for empty search
   // - Recently used exercises appear first
   // - Loading state displays while fetching
   ```

**Verification:**
- [ ] Displays all exercises from database
- [ ] Search filters exercises by name in real-time
- [ ] Muscle group filter chips work
- [ ] Selection triggers callback with exercise object
- [ ] Recently used appear first
- [ ] Keyboard accessible
- [ ] Tests pass (6+ tests)

**Commit:** `feat: create exercise selector component with search`

---

### Task 13: Set Input Component ⬜

**Description:** Build input component for logging reps and weight with validation.

**Steps:**
1. Create `src/components/workout/SetInput.tsx`:
   ```typescript
   import { useState } from 'react';
   import { Plus, Minus } from 'lucide-react';
   import { useSettingsStore } from '../../stores/settingsStore';

   interface SetInputProps {
     onSave: (data: { reps: number; weight: number; rpe?: number }) => void;
     initialReps?: number;
     initialWeight?: number;
   }

   export default function SetInput({ onSave, initialReps, initialWeight }: SetInputProps) {
     const { weightUnit } = useSettingsStore();
     const [reps, setReps] = useState(initialReps ?? 0);
     const [weight, setWeight] = useState(initialWeight ?? 0);
     const [rpe, setRpe] = useState<number | undefined>();

     const adjustReps = (delta: number) => {
       setReps(prev => Math.max(0, prev + delta));
     };

     const adjustWeight = (delta: number) => {
       setWeight(prev => Math.max(0, prev + delta));
     };

     const handleSave = () => {
       if (reps > 0 && weight > 0) {
         onSave({ reps, weight, rpe });
       }
     };

     return (
       <div className="flex items-center gap-4 p-4 bg-white dark:bg-gray-800 rounded-lg">
         {/* Reps input with +/- buttons */}
         <div className="flex flex-col items-center">
           <label className="text-xs text-gray-500 mb-1">Reps</label>
           <div className="flex items-center gap-2">
             <button
               onClick={() => adjustReps(-1)}
               className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center"
             >
               <Minus className="w-4 h-4" />
             </button>
             <input
               type="number"
               value={reps}
               onChange={(e) => setReps(Math.max(0, parseInt(e.target.value) || 0))}
               className="w-16 h-10 text-center text-lg font-semibold border rounded"
             />
             <button
               onClick={() => adjustReps(1)}
               className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center"
             >
               <Plus className="w-4 h-4" />
             </button>
           </div>
         </div>

         {/* Weight input with +/- buttons */}
         <div className="flex flex-col items-center">
           <label className="text-xs text-gray-500 mb-1">Weight ({weightUnit})</label>
           {/* Similar structure to reps */}
         </div>

         {/* Save button */}
         <button
           onClick={handleSave}
           disabled={reps === 0 || weight === 0}
           className="px-4 py-2 bg-primary text-white rounded disabled:opacity-50"
         >
           Add Set
         </button>
       </div>
     );
   }
   ```

2. Add weight increment of 5 lbs / 2.5 kg
3. Create test file `src/components/workout/__tests__/SetInput.test.tsx`

**Verification:**
- [ ] Can enter reps and weight
- [ ] Validation prevents negative/zero values
- [ ] Unit displays correctly based on settings (lbs/kg)
- [ ] +/- buttons work with correct increments
- [ ] RPE input works (optional field)
- [ ] Touch targets are 44px minimum
- [ ] onSave called with correct values
- [ ] Tests pass (6+ tests)

**Commit:** `feat: create set input component for reps and weight`

---

### Task 14: Workout Logger Page ⬜

**Description:** Build the main workout logging interface that ties together exercise selection and set logging.

**Steps:**
1. Create `src/components/workout/WorkoutTypeSelector.tsx`:
   ```typescript
   interface WorkoutTypeSelectorProps {
     value: 'weights' | 'cardio';
     onChange: (type: 'weights' | 'cardio') => void;
   }

   export default function WorkoutTypeSelector({ value, onChange }: WorkoutTypeSelectorProps) {
     return (
       <div className="flex rounded-lg bg-gray-100 dark:bg-gray-800 p-1">
         <button
           onClick={() => onChange('weights')}
           className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition ${
             value === 'weights'
               ? 'bg-white dark:bg-gray-700 shadow text-primary'
               : 'text-gray-500'
           }`}
         >
           Weights
         </button>
         <button
           onClick={() => onChange('cardio')}
           className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition ${
             value === 'cardio'
               ? 'bg-white dark:bg-gray-700 shadow text-primary'
               : 'text-gray-500'
           }`}
         >
           Cardio
         </button>
       </div>
     );
   }
   ```

2. Create `src/components/workout/WorkoutLogger.tsx`:
   - State for current workout (exercises and sets)
   - ExerciseSelector integration
   - List of added exercises with their sets
   - SetInput for adding sets to selected exercise
   - Remove set/exercise functionality
   - Save workout button

3. Create workout-related types for in-progress state:
   ```typescript
   interface WorkoutInProgress {
     date: Date;
     exercises: Array<{
       exercise: Exercise;
       sets: Array<{ reps: number; weight: number; rpe?: number }>;
     }>;
     notes?: string;
   }
   ```

4. Update `src/pages/Home.tsx` to show:
   - "Start Workout" button when no workout in progress
   - WorkoutLogger when workout is in progress
   - (Workout history list will be added in Task 15)

5. Implement save workflow:
   - Create Workout record
   - Create WorkoutSet records for each set
   - Clear in-progress state
   - Show success message

6. Create test file `src/components/workout/__tests__/WorkoutLogger.test.tsx`

**Verification:**
- [ ] "Start Workout" button appears on Home
- [ ] Can select exercises from ExerciseSelector
- [ ] Can add multiple sets to each exercise
- [ ] Can remove individual sets
- [ ] Can remove entire exercises
- [ ] Save creates workout in database with all sets
- [ ] UI resets after successful save
- [ ] Shows success confirmation
- [ ] Tests pass (8+ tests)

**Commit:** `feat: implement workout logger page`

---

### Task 15: Workout History List ⬜

**Description:** Display list of past workouts on Home page with expandable details.

**Steps:**
1. Create `src/components/workout/WorkoutCard.tsx`:
   ```typescript
   import { useState } from 'react';
   import { ChevronDown, ChevronUp } from 'lucide-react';
   import { Workout, WorkoutSet, Exercise } from '../../types';
   import { useSettingsStore } from '../../stores/settingsStore';

   interface WorkoutCardProps {
     workout: Workout;
     sets: WorkoutSet[];
     exercises: Exercise[];
   }

   export default function WorkoutCard({ workout, sets, exercises }: WorkoutCardProps) {
     const [isExpanded, setIsExpanded] = useState(false);
     const { weightUnit } = useSettingsStore();

     // Group sets by exercise
     const setsByExercise = sets.reduce((acc, set) => {
       if (!acc[set.exerciseId]) acc[set.exerciseId] = [];
       acc[set.exerciseId].push(set);
       return acc;
     }, {} as Record<string, WorkoutSet[]>);

     const exerciseCount = Object.keys(setsByExercise).length;
     const totalSets = sets.length;

     return (
       <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
         <button
           onClick={() => setIsExpanded(!isExpanded)}
           className="w-full p-4 flex items-center justify-between"
         >
           <div className="text-left">
             <p className="font-semibold text-gray-900 dark:text-white">
               {formatDate(workout.date)}
             </p>
             <p className="text-sm text-gray-500">
               {exerciseCount} exercises • {totalSets} sets
             </p>
           </div>
           {isExpanded ? <ChevronUp /> : <ChevronDown />}
         </button>
         
         {isExpanded && (
           <div className="px-4 pb-4 border-t border-gray-100 dark:border-gray-700">
             {Object.entries(setsByExercise).map(([exerciseId, exerciseSets]) => {
               const exercise = exercises.find(e => e.id === exerciseId);
               return (
                 <div key={exerciseId} className="mt-3">
                   <p className="font-medium">{exercise?.name}</p>
                   <div className="flex flex-wrap gap-2 mt-1">
                     {exerciseSets.map((set, i) => (
                       <span key={set.id} className="text-sm text-gray-600 dark:text-gray-400">
                         {set.weight}{weightUnit} × {set.reps}
                       </span>
                     ))}
                   </div>
                 </div>
               );
             })}
           </div>
         )}
       </div>
     );
   }
   ```

2. Create `src/components/workout/WorkoutList.tsx`:
   ```typescript
   import { useState, useEffect } from 'react';
   import { getAllWorkouts, getSetsByWorkoutId } from '../../lib/queries';
   import WorkoutCard from './WorkoutCard';

   export default function WorkoutList() {
     const [workouts, setWorkouts] = useState<WorkoutWithSets[]>([]);
     const [isLoading, setIsLoading] = useState(true);

     useEffect(() => {
       loadWorkouts();
     }, []);

     async function loadWorkouts() {
       // Fetch workouts and their sets
       // Sort by date descending
     }

     if (isLoading) {
       return <div>Loading...</div>;
     }

     if (workouts.length === 0) {
       return (
         <div className="text-center py-12">
           <p className="text-gray-500">No workouts yet</p>
           <p className="text-sm text-gray-400">Start your first workout!</p>
         </div>
       );
     }

     return (
       <div className="space-y-3">
         {workouts.map(workout => (
           <WorkoutCard key={workout.id} {...workout} />
         ))}
       </div>
     );
   }
   ```

3. Update `src/pages/Home.tsx` to show WorkoutList below the workout logger area

4. Create test file `src/components/workout/__tests__/WorkoutList.test.tsx`

**Verification:**
- [ ] Displays all past workouts
- [ ] Newest workouts appear first
- [ ] Cards are collapsed by default
- [ ] Click expands to show exercise/set details
- [ ] Shows correct exercise names, weights, reps
- [ ] Empty state shows when no workouts
- [ ] Loading spinner displays while fetching
- [ ] Tests pass (5+ tests)

**Commit:** `feat: display workout history on home page`

---

## ✅ Phase 1 Complete Checklist

Before proceeding to Phase 2, verify:
- [ ] All 15 tasks complete
- [ ] All tests passing (`npm test`)
- [ ] No lint errors (`npm run lint`)
- [ ] App runs without errors (`npm run dev`)
- [ ] Can create and view weightlifting workouts
- [ ] Data persists after page reload
- [ ] Git history clean with descriptive commits

---

*Continued in Part 3: Phase 2 - Cardio & Data Management...*
# Task Checklist - Part 3
## Phase 2: Cardio & Data Management (Tasks 16-25)

---

### Task 16: Cardio Query Functions ⬜

**Description:** Add database query functions for cardio sessions.

**Steps:**
1. Update `src/lib/queries.ts` with cardio functions:
   ```typescript
   // Add cardio session
   export async function addCardioSession(
     session: Omit<CardioSession, 'id' | 'createdAt' | 'updatedAt'>
   ): Promise<string> {
     const id = uuidv4();
     const now = new Date();
     await db.cardioSessions.add({
       ...session,
       id,
       createdAt: now,
       updatedAt: now,
     });
     return id;
   }

   // Get all cardio sessions
   export async function getAllCardioSessions(): Promise<CardioSession[]> {
     return db.cardioSessions.orderBy('date').reverse().toArray();
   }

   // Get cardio sessions by date range
   export async function getCardioSessionsByDateRange(
     start: Date,
     end: Date
   ): Promise<CardioSession[]> {
     return db.cardioSessions
       .where('date')
       .between(start, end, true, true)
       .toArray();
   }

   // Get cardio sessions by type
   export async function getCardioSessionsByType(
     type: CardioType
   ): Promise<CardioSession[]> {
     return db.cardioSessions.where('type').equals(type).toArray();
   }

   // Update cardio session
   export async function updateCardioSession(
     id: string,
     data: Partial<CardioSession>
   ): Promise<void> {
     await db.cardioSessions.update(id, {
       ...data,
       updatedAt: new Date(),
     });
   }

   // Delete cardio session
   export async function deleteCardioSession(id: string): Promise<void> {
     await db.cardioSessions.delete(id);
   }
   ```

2. Update test file `src/lib/__tests__/queries.test.ts` with cardio tests

**Verification:**
- [ ] All cardio query functions work correctly
- [ ] Can add, retrieve, update, delete cardio sessions
- [ ] Date range query works correctly
- [ ] Type filter works correctly
- [ ] Tests pass (6+ new tests)

**Commit:** `feat: add cardio session database queries`

---

### Task 17: Cardio Type Selector Component ⬜

**Description:** Build selector for cardio type (Treadmill/Stationary Bike).

**Steps:**
1. Create `src/components/cardio/CardioTypeSelector.tsx`:
   ```typescript
   import { Footprints, Bike } from 'lucide-react';
   import { CardioType } from '../../types';

   interface CardioTypeSelectorProps {
     value: CardioType | null;
     onChange: (type: CardioType) => void;
   }

   export default function CardioTypeSelector({ value, onChange }: CardioTypeSelectorProps) {
     return (
       <div className="grid grid-cols-2 gap-4">
         <button
           onClick={() => onChange('treadmill')}
           className={`flex flex-col items-center justify-center p-6 rounded-xl border-2 transition ${
             value === 'treadmill'
               ? 'border-primary bg-primary/10'
               : 'border-gray-200 dark:border-gray-700'
           }`}
         >
           <Footprints className="w-8 h-8 mb-2" />
           <span className="font-medium">Treadmill</span>
         </button>
         
         <button
           onClick={() => onChange('stationary-bike')}
           className={`flex flex-col items-center justify-center p-6 rounded-xl border-2 transition ${
             value === 'stationary-bike'
               ? 'border-primary bg-primary/10'
               : 'border-gray-200 dark:border-gray-700'
           }`}
         >
           <Bike className="w-8 h-8 mb-2" />
           <span className="font-medium">Bike</span>
         </button>
       </div>
     );
   }
   ```

2. Create test file `src/components/cardio/__tests__/CardioTypeSelector.test.tsx`

**Verification:**
- [ ] Both options display with icons
- [ ] Selection triggers callback with correct type
- [ ] Visual feedback shows selected state
- [ ] Touch targets are 44px+
- [ ] Tests pass

**Commit:** `feat: create cardio type selector component`

---

### Task 18: Treadmill Form Component ⬜

**Description:** Build form for treadmill session input with all required fields.

**Steps:**
1. Create `src/components/cardio/DurationInput.tsx`:
   ```typescript
   interface DurationInputProps {
     value: number; // seconds
     onChange: (seconds: number) => void;
   }

   export default function DurationInput({ value, onChange }: DurationInputProps) {
     const minutes = Math.floor(value / 60);
     const seconds = value % 60;

     const handleMinutesChange = (mins: number) => {
       onChange(mins * 60 + seconds);
     };

     const handleSecondsChange = (secs: number) => {
       onChange(minutes * 60 + secs);
     };

     return (
       <div className="flex items-center gap-2">
         <input
           type="number"
           value={minutes}
           onChange={(e) => handleMinutesChange(parseInt(e.target.value) || 0)}
           className="w-16 h-10 text-center border rounded"
           min="0"
         />
         <span>:</span>
         <input
           type="number"
           value={seconds.toString().padStart(2, '0')}
           onChange={(e) => handleSecondsChange(Math.min(59, parseInt(e.target.value) || 0))}
           className="w-16 h-10 text-center border rounded"
           min="0"
           max="59"
         />
       </div>
     );
   }
   ```

2. Create `src/components/cardio/TreadmillForm.tsx`:
   ```typescript
   import { useState } from 'react';
   import { useSettingsStore } from '../../stores/settingsStore';
   import DurationInput from './DurationInput';

   interface TreadmillFormProps {
     onSave: (data: TreadmillData) => void;
     onCancel: () => void;
   }

   interface TreadmillData {
     duration: number;
     distance?: number;
     avgSpeed?: number;
     avgIncline?: number;
     maxIncline?: number;
     calories?: number;
     notes?: string;
   }

   export default function TreadmillForm({ onSave, onCancel }: TreadmillFormProps) {
     const { distanceUnit } = useSettingsStore();
     const [duration, setDuration] = useState(0);
     const [distance, setDistance] = useState<number | ''>('');
     const [avgIncline, setAvgIncline] = useState<number | ''>('');
     const [maxIncline, setMaxIncline] = useState<number | ''>('');
     const [calories, setCalories] = useState<number | ''>('');
     const [notes, setNotes] = useState('');

     // Calculate speed when duration and distance are set
     const avgSpeed = duration > 0 && distance
       ? (Number(distance) / (duration / 3600)).toFixed(1)
       : null;

     const handleSubmit = () => {
       if (duration === 0) return;
       
       onSave({
         duration,
         distance: distance ? Number(distance) : undefined,
         avgSpeed: avgSpeed ? Number(avgSpeed) : undefined,
         avgIncline: avgIncline ? Number(avgIncline) : undefined,
         maxIncline: maxIncline ? Number(maxIncline) : undefined,
         calories: calories ? Number(calories) : undefined,
         notes: notes || undefined,
       });
     };

     return (
       <div className="space-y-4 p-4">
         {/* Duration (required) */}
         <div>
           <label className="block text-sm font-medium mb-1">Duration *</label>
           <DurationInput value={duration} onChange={setDuration} />
         </div>

         {/* Distance */}
         <div>
           <label className="block text-sm font-medium mb-1">
             Distance ({distanceUnit})
           </label>
           <input
             type="number"
             step="0.1"
             value={distance}
             onChange={(e) => setDistance(e.target.value ? Number(e.target.value) : '')}
             className="w-full h-10 px-3 border rounded"
             placeholder="0.0"
           />
         </div>

         {/* Auto-calculated speed display */}
         {avgSpeed && (
           <p className="text-sm text-gray-500">
             Avg Speed: {avgSpeed} {distanceUnit === 'miles' ? 'mph' : 'km/h'}
           </p>
         )}

         {/* Average Incline (0-15%) */}
         <div>
           <label className="block text-sm font-medium mb-1">
             Avg Incline (%)
           </label>
           <input
             type="number"
             step="0.5"
             min="0"
             max="15"
             value={avgIncline}
             onChange={(e) => setAvgIncline(e.target.value ? Number(e.target.value) : '')}
             className="w-full h-10 px-3 border rounded"
             placeholder="0"
           />
         </div>

         {/* Max Incline */}
         <div>
           <label className="block text-sm font-medium mb-1">
             Max Incline (%)
           </label>
           <input
             type="number"
             step="0.5"
             min="0"
             max="15"
             value={maxIncline}
             onChange={(e) => setMaxIncline(e.target.value ? Number(e.target.value) : '')}
             className="w-full h-10 px-3 border rounded"
             placeholder="0"
           />
         </div>

         {/* Calories */}
         <div>
           <label className="block text-sm font-medium mb-1">Calories</label>
           <input
             type="number"
             value={calories}
             onChange={(e) => setCalories(e.target.value ? Number(e.target.value) : '')}
             className="w-full h-10 px-3 border rounded"
             placeholder="0"
           />
         </div>

         {/* Notes */}
         <div>
           <label className="block text-sm font-medium mb-1">Notes</label>
           <textarea
             value={notes}
             onChange={(e) => setNotes(e.target.value)}
             className="w-full px-3 py-2 border rounded"
             rows={2}
             placeholder="How did it feel?"
           />
         </div>

         {/* Actions */}
         <div className="flex gap-3 pt-4">
           <button
             onClick={onCancel}
             className="flex-1 py-3 border rounded-lg"
           >
             Cancel
           </button>
           <button
             onClick={handleSubmit}
             disabled={duration === 0}
             className="flex-1 py-3 bg-primary text-white rounded-lg disabled:opacity-50"
           >
             Save Session
           </button>
         </div>
       </div>
     );
   }
   ```

3. Create test file `src/components/cardio/__tests__/TreadmillForm.test.tsx`

**Verification:**
- [ ] Duration input works correctly (mm:ss format)
- [ ] Distance input accepts decimal values
- [ ] Speed auto-calculates from distance/duration
- [ ] Incline inputs validate 0-15% range
- [ ] Optional fields can be left empty
- [ ] Save button disabled when duration is 0
- [ ] onSave provides correct data structure
- [ ] Tests pass (6+ tests)

**Commit:** `feat: create treadmill session form`

---

### Task 19: Stationary Bike Form Component ⬜

**Description:** Build form for stationary bike session input.

**Steps:**
1. Create `src/components/cardio/BikeForm.tsx`:
   ```typescript
   import { useState } from 'react';
   import { useSettingsStore } from '../../stores/settingsStore';
   import DurationInput from './DurationInput';

   interface BikeFormProps {
     onSave: (data: BikeData) => void;
     onCancel: () => void;
   }

   interface BikeData {
     duration: number;
     distance?: number;
     avgResistance?: number;
     avgCadence?: number;
     calories?: number;
     notes?: string;
   }

   export default function BikeForm({ onSave, onCancel }: BikeFormProps) {
     const { distanceUnit } = useSettingsStore();
     const [duration, setDuration] = useState(0);
     const [distance, setDistance] = useState<number | ''>('');
     const [avgResistance, setAvgResistance] = useState<number | ''>('');
     const [avgCadence, setAvgCadence] = useState<number | ''>('');
     const [calories, setCalories] = useState<number | ''>('');
     const [notes, setNotes] = useState('');

     const handleSubmit = () => {
       if (duration === 0) return;
       
       onSave({
         duration,
         distance: distance ? Number(distance) : undefined,
         avgResistance: avgResistance ? Number(avgResistance) : undefined,
         avgCadence: avgCadence ? Number(avgCadence) : undefined,
         calories: calories ? Number(calories) : undefined,
         notes: notes || undefined,
       });
     };

     return (
       <div className="space-y-4 p-4">
         {/* Duration (required) */}
         <div>
           <label className="block text-sm font-medium mb-1">Duration *</label>
           <DurationInput value={duration} onChange={setDuration} />
         </div>

         {/* Distance (optional - not all bikes show this) */}
         <div>
           <label className="block text-sm font-medium mb-1">
             Distance ({distanceUnit}) - if available
           </label>
           <input
             type="number"
             step="0.1"
             value={distance}
             onChange={(e) => setDistance(e.target.value ? Number(e.target.value) : '')}
             className="w-full h-10 px-3 border rounded"
             placeholder="0.0"
           />
         </div>

         {/* Average Resistance (1-20) */}
         <div>
           <label className="block text-sm font-medium mb-1">
             Avg Resistance (1-20)
           </label>
           <input
             type="number"
             min="1"
             max="20"
             value={avgResistance}
             onChange={(e) => setAvgResistance(e.target.value ? Number(e.target.value) : '')}
             className="w-full h-10 px-3 border rounded"
             placeholder="1"
           />
         </div>

         {/* Average Cadence (RPM) */}
         <div>
           <label className="block text-sm font-medium mb-1">
             Avg Cadence (RPM)
           </label>
           <input
             type="number"
             min="0"
             value={avgCadence}
             onChange={(e) => setAvgCadence(e.target.value ? Number(e.target.value) : '')}
             className="w-full h-10 px-3 border rounded"
             placeholder="0"
           />
         </div>

         {/* Calories */}
         <div>
           <label className="block text-sm font-medium mb-1">Calories</label>
           <input
             type="number"
             value={calories}
             onChange={(e) => setCalories(e.target.value ? Number(e.target.value) : '')}
             className="w-full h-10 px-3 border rounded"
             placeholder="0"
           />
         </div>

         {/* Notes */}
         <div>
           <label className="block text-sm font-medium mb-1">Notes</label>
           <textarea
             value={notes}
             onChange={(e) => setNotes(e.target.value)}
             className="w-full px-3 py-2 border rounded"
             rows={2}
             placeholder="How did it feel?"
           />
         </div>

         {/* Actions */}
         <div className="flex gap-3 pt-4">
           <button onClick={onCancel} className="flex-1 py-3 border rounded-lg">
             Cancel
           </button>
           <button
             onClick={handleSubmit}
             disabled={duration === 0}
             className="flex-1 py-3 bg-primary text-white rounded-lg disabled:opacity-50"
           >
             Save Session
           </button>
         </div>
       </div>
     );
   }
   ```

2. Create test file `src/components/cardio/__tests__/BikeForm.test.tsx`

**Verification:**
- [ ] Duration input works correctly
- [ ] Distance is optional
- [ ] Resistance validates 1-20 range
- [ ] Cadence accepts any positive number
- [ ] Optional fields can be left empty
- [ ] onSave provides correct data structure
- [ ] Tests pass

**Commit:** `feat: create stationary bike session form`

---

### Task 20: Cardio Logger Integration ⬜

**Description:** Integrate cardio forms into main workout flow on Home page.

**Steps:**
1. Create `src/components/cardio/CardioLogger.tsx`:
   ```typescript
   import { useState } from 'react';
   import { CardioType } from '../../types';
   import { addCardioSession } from '../../lib/queries';
   import CardioTypeSelector from './CardioTypeSelector';
   import TreadmillForm from './TreadmillForm';
   import BikeForm from './BikeForm';

   interface CardioLoggerProps {
     onComplete: () => void;
     onCancel: () => void;
   }

   export default function CardioLogger({ onComplete, onCancel }: CardioLoggerProps) {
     const [cardioType, setCardioType] = useState<CardioType | null>(null);
     const [isSaving, setIsSaving] = useState(false);

     const handleSave = async (data: any) => {
       if (!cardioType) return;
       
       setIsSaving(true);
       try {
         await addCardioSession({
           type: cardioType,
           date: new Date(),
           ...data,
         });
         onComplete();
       } catch (error) {
         console.error('Failed to save cardio session:', error);
       } finally {
         setIsSaving(false);
       }
     };

     // Step 1: Select cardio type
     if (!cardioType) {
       return (
         <div className="p-4">
           <h2 className="text-lg font-semibold mb-4">Select Cardio Type</h2>
           <CardioTypeSelector value={cardioType} onChange={setCardioType} />
           <button
             onClick={onCancel}
             className="w-full mt-4 py-3 border rounded-lg"
           >
             Cancel
           </button>
         </div>
       );
     }

     // Step 2: Fill in form
     return cardioType === 'treadmill' ? (
       <TreadmillForm onSave={handleSave} onCancel={onCancel} />
     ) : (
       <BikeForm onSave={handleSave} onCancel={onCancel} />
     );
   }
   ```

2. Update `src/pages/Home.tsx`:
   - When "Cardio" is selected in WorkoutTypeSelector, show CardioLogger
   - Handle successful save (show message, refresh list)

3. Create test file `src/components/cardio/__tests__/CardioLogger.test.tsx`

**Verification:**
- [ ] Toggle between weights and cardio works
- [ ] Selecting Treadmill shows TreadmillForm
- [ ] Selecting Bike shows BikeForm
- [ ] Save creates CardioSession in database
- [ ] Returns to home after save
- [ ] Tests pass

**Commit:** `feat: integrate cardio logging into home page`

---

### Task 21: Cardio Session Card Component ⬜

**Description:** Display component for cardio sessions in workout history.

**Steps:**
1. Create `src/components/cardio/CardioCard.tsx`:
   ```typescript
   import { useState } from 'react';
   import { ChevronDown, ChevronUp, Footprints, Bike } from 'lucide-react';
   import { CardioSession } from '../../types';
   import { useSettingsStore } from '../../stores/settingsStore';
   import { formatDuration, formatDate } from '../../lib/utils';

   interface CardioCardProps {
     session: CardioSession;
   }

   export default function CardioCard({ session }: CardioCardProps) {
     const [isExpanded, setIsExpanded] = useState(false);
     const { distanceUnit } = useSettingsStore();

     const Icon = session.type === 'treadmill' ? Footprints : Bike;
     const typeName = session.type === 'treadmill' ? 'Treadmill' : 'Stationary Bike';

     return (
       <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
         <button
           onClick={() => setIsExpanded(!isExpanded)}
           className="w-full p-4 flex items-center justify-between"
         >
           <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
               <Icon className="w-5 h-5 text-green-600 dark:text-green-400" />
             </div>
             <div className="text-left">
               <p className="font-semibold text-gray-900 dark:text-white">
                 {typeName}
               </p>
               <p className="text-sm text-gray-500">
                 {formatDate(session.date)} • {formatDuration(session.duration)}
               </p>
             </div>
           </div>
           {isExpanded ? <ChevronUp /> : <ChevronDown />}
         </button>
         
         {isExpanded && (
           <div className="px-4 pb-4 border-t border-gray-100 dark:border-gray-700">
             <div className="grid grid-cols-2 gap-4 mt-3">
               {session.distance && (
                 <div>
                   <p className="text-xs text-gray-500">Distance</p>
                   <p className="font-medium">{session.distance} {distanceUnit}</p>
                 </div>
               )}
               {session.avgSpeed && (
                 <div>
                   <p className="text-xs text-gray-500">Avg Speed</p>
                   <p className="font-medium">{session.avgSpeed} {distanceUnit === 'miles' ? 'mph' : 'km/h'}</p>
                 </div>
               )}
               {session.avgIncline !== undefined && (
                 <div>
                   <p className="text-xs text-gray-500">Avg Incline</p>
                   <p className="font-medium">{session.avgIncline}%</p>
                 </div>
               )}
               {session.avgResistance !== undefined && (
                 <div>
                   <p className="text-xs text-gray-500">Avg Resistance</p>
                   <p className="font-medium">{session.avgResistance}</p>
                 </div>
               )}
               {session.avgCadence !== undefined && (
                 <div>
                   <p className="text-xs text-gray-500">Avg Cadence</p>
                   <p className="font-medium">{session.avgCadence} RPM</p>
                 </div>
               )}
               {session.calories && (
                 <div>
                   <p className="text-xs text-gray-500">Calories</p>
                   <p className="font-medium">{session.calories}</p>
                 </div>
               )}
             </div>
             {session.notes && (
               <div className="mt-3">
                 <p className="text-xs text-gray-500">Notes</p>
                 <p className="text-sm">{session.notes}</p>
               </div>
             )}
           </div>
         )}
       </div>
     );
   }
   ```

2. Create utility functions in `src/lib/utils.ts`:
   ```typescript
   export function formatDuration(seconds: number): string {
     const mins = Math.floor(seconds / 60);
     const secs = seconds % 60;
     return `${mins}:${secs.toString().padStart(2, '0')}`;
   }

   export function formatDate(date: Date): string {
     return new Intl.DateTimeFormat('en-US', {
       weekday: 'short',
       month: 'short',
       day: 'numeric',
     }).format(date);
   }
   ```

3. Create test file `src/components/cardio/__tests__/CardioCard.test.tsx`

**Verification:**
- [ ] Displays cardio session with correct icon
- [ ] Shows type name, date, duration
- [ ] Expandable to show all metrics
- [ ] Only shows metrics that have values
- [ ] Notes display when present
- [ ] Tests pass

**Commit:** `feat: create cardio session display card`

---

### Task 22: Combined Workout History ⬜

**Description:** Update workout list to show both weights and cardio in chronological order.

**Steps:**
1. Create `src/components/workout/ActivityList.tsx`:
   ```typescript
   import { useState, useEffect } from 'react';
   import { Activity } from '../../types';
   import { getAllWorkouts, getAllCardioSessions, getSetsByWorkoutId } from '../../lib/queries';
   import WorkoutCard from './WorkoutCard';
   import CardioCard from '../cardio/CardioCard';

   type FilterType = 'all' | 'weights' | 'cardio';

   export default function ActivityList() {
     const [activities, setActivities] = useState<Activity[]>([]);
     const [filter, setFilter] = useState<FilterType>('all');
     const [isLoading, setIsLoading] = useState(true);

     useEffect(() => {
       loadActivities();
     }, []);

     async function loadActivities() {
       setIsLoading(true);
       
       const [workouts, cardioSessions] = await Promise.all([
         getAllWorkouts(),
         getAllCardioSessions(),
       ]);

       // Combine and sort by date
       const combined: Activity[] = [
         ...workouts.map(w => ({ id: w.id, type: 'workout' as const, date: w.date, data: w })),
         ...cardioSessions.map(c => ({ id: c.id, type: 'cardio' as const, date: c.date, data: c })),
       ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

       setActivities(combined);
       setIsLoading(false);
     }

     const filteredActivities = activities.filter(a => {
       if (filter === 'all') return true;
       if (filter === 'weights') return a.type === 'workout';
       if (filter === 'cardio') return a.type === 'cardio';
       return true;
     });

     return (
       <div>
         {/* Filter tabs */}
         <div className="flex gap-2 mb-4">
           {(['all', 'weights', 'cardio'] as FilterType[]).map(f => (
             <button
               key={f}
               onClick={() => setFilter(f)}
               className={`px-4 py-2 rounded-full text-sm ${
                 filter === f
                   ? 'bg-primary text-white'
                   : 'bg-gray-100 dark:bg-gray-800'
               }`}
             >
               {f.charAt(0).toUpperCase() + f.slice(1)}
             </button>
           ))}
         </div>

         {/* Activity list */}
         <div className="space-y-3">
           {filteredActivities.map(activity => (
             activity.type === 'workout' ? (
               <WorkoutCard key={activity.id} workout={activity.data} />
             ) : (
               <CardioCard key={activity.id} session={activity.data} />
             )
           ))}
         </div>
       </div>
     );
   }
   ```

2. Update `src/pages/Home.tsx` to use ActivityList

3. Update tests

**Verification:**
- [ ] Shows both workout types in chronological order
- [ ] Filter tabs work (All, Weights, Cardio)
- [ ] Correct card component used for each type
- [ ] Performance acceptable with mixed data
- [ ] Tests pass

**Commit:** `feat: combine weights and cardio in activity history`

---

### Task 23: Data Export Functionality ⬜

**Description:** Implement JSON export of all user data for backup.

**Steps:**
1. Create `src/lib/dataExport.ts`:
   ```typescript
   import { db } from './db';

   interface ExportData {
     version: string;
     exportDate: string;
     exercises: Exercise[];
     workouts: Workout[];
     workoutSets: WorkoutSet[];
     cardioSessions: CardioSession[];
     settings: Settings | null;
   }

   export async function exportAllData(): Promise<ExportData> {
     const [exercises, workouts, workoutSets, cardioSessions, settings] = await Promise.all([
       db.exercises.where('isCustom').equals(true).toArray(), // Only custom exercises
       db.workouts.toArray(),
       db.workoutSets.toArray(),
       db.cardioSessions.toArray(),
       db.settings.get('settings'),
     ]);

     return {
       version: '1.0',
       exportDate: new Date().toISOString(),
       exercises,
       workouts,
       workoutSets,
       cardioSessions,
       settings: settings || null,
     };
   }

   export function downloadAsJson(data: ExportData): void {
     const json = JSON.stringify(data, null, 2);
     const blob = new Blob([json], { type: 'application/json' });
     const url = URL.createObjectURL(blob);
     
     const date = new Date().toISOString().split('T')[0];
     const filename = `fitness-tracker-backup-${date}.json`;
     
     const a = document.createElement('a');
     a.href = url;
     a.download = filename;
     a.click();
     
     URL.revokeObjectURL(url);
   }
   ```

2. Create `src/components/settings/DataExport.tsx`:
   ```typescript
   import { useState } from 'react';
   import { Download } from 'lucide-react';
   import { exportAllData, downloadAsJson } from '../../lib/dataExport';

   export default function DataExport() {
     const [isExporting, setIsExporting] = useState(false);
     const [success, setSuccess] = useState(false);

     const handleExport = async () => {
       setIsExporting(true);
       setSuccess(false);
       
       try {
         const data = await exportAllData();
         downloadAsJson(data);
         setSuccess(true);
       } catch (error) {
         console.error('Export failed:', error);
       } finally {
         setIsExporting(false);
       }
     };

     return (
       <div>
         <button
           onClick={handleExport}
           disabled={isExporting}
           className="w-full flex items-center justify-center gap-2 py-3 bg-primary text-white rounded-lg disabled:opacity-50"
         >
           <Download className="w-5 h-5" />
           {isExporting ? 'Exporting...' : 'Export All Data'}
         </button>
         {success && (
           <p className="text-sm text-green-600 mt-2">
             ✓ Data exported successfully
           </p>
         )}
       </div>
     );
   }
   ```

3. Create test file `src/lib/__tests__/dataExport.test.ts`

**Verification:**
- [ ] Export button triggers download
- [ ] JSON file is valid and parseable
- [ ] All workouts included
- [ ] All cardio sessions included
- [ ] Custom exercises included (not pre-populated)
- [ ] Settings included
- [ ] Filename includes date
- [ ] Tests pass

**Commit:** `feat: implement data export to JSON`

---

### Task 24: Data Import Functionality ⬜

**Description:** Implement JSON import with validation and merge/replace options.

**Steps:**
1. Create `src/lib/dataImport.ts`:
   ```typescript
   import { db } from './db';

   interface ImportResult {
     success: boolean;
     errors: string[];
     imported: {
       exercises: number;
       workouts: number;
       sets: number;
       cardioSessions: number;
     };
   }

   export function validateImportFile(data: unknown): { valid: boolean; errors: string[] } {
     const errors: string[] = [];
     
     if (!data || typeof data !== 'object') {
       return { valid: false, errors: ['Invalid file format'] };
     }
     
     const d = data as Record<string, unknown>;
     
     if (!d.version || typeof d.version !== 'string') {
       errors.push('Missing or invalid version');
     }
     
     if (!Array.isArray(d.workouts)) {
       errors.push('Invalid workouts data');
     }
     
     if (!Array.isArray(d.cardioSessions)) {
       errors.push('Invalid cardioSessions data');
     }
     
     return { valid: errors.length === 0, errors };
   }

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
       if (mode === 'replace') {
         await db.workouts.clear();
         await db.workoutSets.clear();
         await db.cardioSessions.clear();
         await db.exercises.where('isCustom').equals(true).delete();
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

       result.success = true;
     } catch (error) {
       result.errors.push(String(error));
     }

     return result;
   }
   ```

2. Create `src/components/settings/DataImport.tsx` with:
   - File input for JSON selection
   - Validation feedback
   - Preview of data to import
   - Mode selection (merge/replace)
   - Confirmation before import

3. Create test file `src/lib/__tests__/dataImport.test.ts`

**Verification:**
- [ ] Can select JSON file
- [ ] Invalid files show error message
- [ ] Preview shows data counts
- [ ] Merge mode adds without overwriting
- [ ] Replace mode clears existing data first
- [ ] Confirmation required before import
- [ ] Success message shows imported counts
- [ ] Tests pass

**Commit:** `feat: implement data import with validation`

---

### Task 25: Mock Data Seeding ⬜

**Description:** Create realistic mock data for testing progress charts and app functionality.

**Steps:**
1. Update `src/lib/seed.ts` with `seedMockData()` function:
   ```typescript
   export async function seedMockData(): Promise<void> {
     const exercises = await db.exercises.toArray();
     
     // Get some exercise IDs for workouts
     const benchPress = exercises.find(e => e.name === 'Barbell Bench Press');
     const squat = exercises.find(e => e.name === 'Barbell Back Squat');
     const deadlift = exercises.find(e => e.name === 'Conventional Deadlift');
     // ... more exercises

     const now = new Date();
     const threeMonthsAgo = new Date(now);
     threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

     // Generate ~60 weightlifting workouts (5 per week for 12 weeks)
     for (let week = 0; week < 12; week++) {
       for (let day = 0; day < 5; day++) {
         const workoutDate = new Date(threeMonthsAgo);
         workoutDate.setDate(workoutDate.getDate() + week * 7 + day);
         
         // Create workout with progressive weights
         const workoutId = await addWorkout({ date: workoutDate });
         
         // Add sets with progressive overload
         const baseWeight = 135 + week * 5; // Increase 5lbs per week
         // ... add sets for different exercises
       }
     }

     // Generate ~30 cardio sessions (2-3 per week)
     for (let week = 0; week < 12; week++) {
       for (let session = 0; session < 2 + Math.floor(Math.random() * 2); session++) {
         const sessionDate = new Date(threeMonthsAgo);
         sessionDate.setDate(sessionDate.getDate() + week * 7 + session * 2);
         
         // Alternate between treadmill and bike
         const type = session % 2 === 0 ? 'treadmill' : 'stationary-bike';
         
         await addCardioSession({
           date: sessionDate,
           type,
           duration: 1800 + Math.random() * 1200, // 30-50 minutes
           distance: type === 'treadmill' ? 2.5 + week * 0.1 : undefined, // Progressive distance
           avgIncline: type === 'treadmill' ? 2 + Math.random() * 3 : undefined,
           avgResistance: type === 'stationary-bike' ? 8 + Math.floor(week / 3) : undefined,
         });
       }
     }

     console.log('Mock data seeded successfully');
   }

   export async function clearMockData(): Promise<void> {
     await db.workouts.clear();
     await db.workoutSets.clear();
     await db.cardioSessions.clear();
     console.log('Mock data cleared');
   }
   ```

2. Add developer trigger (e.g., in Settings page with a hidden button, or console command)

3. Create test file `src/lib/__tests__/seedMockData.test.ts`

**Verification:**
- [ ] Creates ~60 weightlifting workouts over 3 months
- [ ] Creates ~30 cardio sessions over 3 months
- [ ] Data shows realistic progression (increasing weights)
- [ ] Mix of exercises used
- [ ] Both treadmill and bike sessions
- [ ] Can be cleared without affecting real data
- [ ] Tests pass

**Commit:** `feat: create mock data seeding for testing`

---

## ✅ Phase 2 Complete Checklist

Before proceeding to Phase 3, verify:
- [ ] All tasks 16-25 complete
- [ ] All tests passing (`npm test`)
- [ ] No lint errors (`npm run lint`)
- [ ] Can log both weightlifting and cardio sessions
- [ ] Combined history shows both types
- [ ] Data export works and creates valid JSON
- [ ] Data import works with merge and replace modes
- [ ] Mock data can be seeded for testing
- [ ] Git history clean with descriptive commits

---

*Continued in Part 4: Phase 3 - Progress Visualization...*
# Task Checklist - Part 4
## Phase 3: Progress Visualization (Tasks 26-35)

---

### Task 26: Progress Page Layout ⬜

**Description:** Create the structure for the progress page with view toggle, selectors, and time range.

**Steps:**
1. Update `src/pages/Progress.tsx` with:
   - View toggle (Weights / Cardio)
   - Exercise dropdown selector (for weights view)
   - Cardio type dropdown (for cardio view)
   - Time range tabs (1M, 3M, 6M, 1Y, All)
   - Chart container placeholder
   - Stats cards section placeholder

2. Create `src/components/progress/ExerciseDropdown.tsx`
3. Create `src/components/progress/CardioTypeDropdown.tsx`
4. Create `src/components/progress/TimeRangeTabs.tsx`

**Verification:**
- [ ] Toggle switches between weights and cardio views
- [ ] Exercise dropdown shows all exercises with recent ones first
- [ ] Cardio type dropdown shows All/Treadmill/Bike options
- [ ] Time range tabs are clickable and show selected state
- [ ] Layout works well on mobile
- [ ] Tests pass

**Commit:** `feat: create progress page layout`

---

### Task 27: Recharts Setup & Base Chart Component ⬜

**Description:** Install and configure Recharts with a reusable base chart component.

**Steps:**
1. Install Recharts: `npm install recharts`
2. Create `src/components/progress/BaseChart.tsx`:
   - ResponsiveContainer wrapper
   - Common axis styling
   - Touch-friendly tooltip configuration
   - Theme-aware colors (dark mode support)
3. Create chart utility functions in `src/lib/chartUtils.ts`:
   - Date formatting for X-axis
   - Number formatting for Y-axis
   - Color palette constants

**Verification:**
- [ ] Recharts renders without errors
- [ ] BaseChart is responsive to container size
- [ ] Tooltips work on touch devices
- [ ] Colors adapt to dark mode
- [ ] Tests pass

**Commit:** `feat: set up Recharts with base chart component`

---

### Task 28: Weight Progress Chart ⬜

**Description:** Build line chart showing max weight progression per exercise.

**Steps:**
1. Create `src/lib/progressQueries.ts`:
   - `getWeightProgressData(exerciseId, startDate, endDate)` - returns array of {date, maxWeight}
2. Create `src/components/progress/WeightProgressChart.tsx`:
   - Line chart with date on X-axis, weight on Y-axis
   - Data points for each workout
   - PR indicator (star/badge) on highest point
   - Trend line (optional)
   - Empty state for no data
3. Integrate into Progress page

**Verification:**
- [ ] Chart displays weight over time
- [ ] Shows correct max weight per workout date
- [ ] PR point is visually highlighted
- [ ] Time range filter limits displayed data
- [ ] Weight unit (lbs/kg) displays correctly
- [ ] Empty state when no data for exercise
- [ ] Tests pass (5+ tests)

**Commit:** `feat: create weight progression chart`

---

### Task 29: Volume Chart ⬜

**Description:** Build chart showing total volume (sets × reps × weight) per workout.

**Steps:**
1. Add to `src/lib/progressQueries.ts`:
   - `getVolumeProgressData(exerciseId?, startDate, endDate)` - returns {date, volume}[]
2. Create `src/components/progress/VolumeChart.tsx`:
   - Bar chart or line chart
   - Option: per-exercise or total workout volume
   - Volume calculation: sum(sets × reps × weight)
3. Add volume chart toggle/tab in Progress page

**Verification:**
- [ ] Volume calculated correctly
- [ ] Per-exercise view filters to selected exercise
- [ ] Total workout view shows all exercises combined
- [ ] Time range filter works
- [ ] Tests pass

**Commit:** `feat: create volume progression chart`

---

### Task 30: PR Detection & Display ⬜

**Description:** Implement personal record detection and visual display.

**Steps:**
1. Create `src/lib/prDetection.ts`:
   ```typescript
   interface PR {
     exerciseId: string;
     exerciseName: string;
     weight: number;
     reps: number;
     date: Date;
     workoutId: string;
   }
   
   // Get PR for specific exercise
   export async function getExercisePR(exerciseId: string): Promise<PR | null>
   
   // Get all current PRs
   export async function getAllPRs(): Promise<PR[]>
   
   // Check if a set is a PR
   export async function isPR(exerciseId: string, weight: number): Promise<boolean>
   ```

2. Create `src/components/progress/PRBadge.tsx` - visual badge component
3. Create `src/components/progress/PRList.tsx` - list all PRs
4. Integrate PR indicators into WeightProgressChart
5. Add PR list to Progress page (below charts or in stats section)

**Verification:**
- [ ] PR correctly identified as max weight for exercise
- [ ] PR badge displays on chart at correct point
- [ ] PR list shows all exercises with their PRs
- [ ] Handles ties (multiple sets at same max weight)
- [ ] Tests pass (5+ tests)

**Commit:** `feat: implement PR detection and display`

---

### Task 31: Cardio Distance Chart ⬜

**Description:** Build chart showing cardio distance over time.

**Steps:**
1. Add to `src/lib/progressQueries.ts`:
   - `getCardioDistanceData(type?, startDate, endDate)` - returns {date, distance}[]
2. Create `src/components/progress/CardioDistanceChart.tsx`:
   - Line chart with date on X-axis, distance on Y-axis
   - Filter by cardio type (treadmill, bike, all)
   - Handle sessions without distance data
   - Display correct unit (miles/km)

**Verification:**
- [ ] Chart shows distance over time
- [ ] Type filter works (treadmill/bike/all)
- [ ] Correct unit displayed based on settings
- [ ] Time range filter works
- [ ] Handles missing distance gracefully
- [ ] Tests pass

**Commit:** `feat: create cardio distance chart`

---

### Task 32: Cardio Duration & Pace Charts ⬜

**Description:** Build charts for cardio duration and pace/speed over time.

**Steps:**
1. Add to `src/lib/progressQueries.ts`:
   - `getCardioDurationData(type?, startDate, endDate)`
   - `getCardioPaceData(type?, startDate, endDate)` - pace = distance/duration
2. Create `src/components/progress/CardioDurationChart.tsx`
3. Create `src/components/progress/CardioPaceChart.tsx`:
   - Toggle between pace (min/mile) and speed (mph)
   - Only include sessions with both distance and duration
4. Add chart selector in cardio view (Distance | Duration | Pace)

**Verification:**
- [ ] Duration chart shows time over sessions
- [ ] Pace calculated correctly from distance/duration
- [ ] Speed/pace toggle works
- [ ] Only shows sessions with required data
- [ ] Tests pass

**Commit:** `feat: create cardio duration and pace charts`

---

### Task 33: Cardio Intensity Chart ⬜

**Description:** Build chart for treadmill incline and bike resistance trends.

**Steps:**
1. Add to `src/lib/progressQueries.ts`:
   - `getCardioIntensityData(type, startDate, endDate)` 
     - Returns incline for treadmill, resistance for bike
2. Create `src/components/progress/CardioIntensityChart.tsx`:
   - Shows avg incline for treadmill sessions
   - Shows avg resistance for bike sessions
   - Chart type switches based on cardio type selection
3. Add to cardio chart options

**Verification:**
- [ ] Shows incline trend for treadmill
- [ ] Shows resistance trend for bike
- [ ] Switches appropriately when type changes
- [ ] Time range works
- [ ] Tests pass

**Commit:** `feat: create cardio intensity chart`

---

### Task 34: Summary Statistics Component ⬜

**Description:** Build summary stats cards showing totals and averages.

**Steps:**
1. Create `src/lib/statsQueries.ts`:
   ```typescript
   interface Stats {
     totalWorkouts: number;
     totalCardioSessions: number;
     totalVolume: number; // all-time volume lifted
     totalCardioTime: number; // all-time cardio duration
     totalCardioDistance: number;
     workoutsPerWeek: number; // average
     mostTrainedMuscle: MuscleGroup;
   }
   
   export async function getStats(): Promise<Stats>
   ```

2. Create `src/components/progress/StatsCard.tsx`:
   - Reusable card for displaying a single stat
   - Icon, label, value, optional unit
3. Create `src/components/progress/SummaryStats.tsx`:
   - Grid of StatsCards
   - Shows all key metrics
4. Add to Progress page below charts

**Verification:**
- [ ] Total workouts counts correctly
- [ ] Total cardio sessions counts correctly
- [ ] Total volume sums correctly
- [ ] Total cardio time/distance correct
- [ ] Frequency (per week) calculates correctly
- [ ] Most trained muscle group is correct
- [ ] Handles zero data gracefully
- [ ] Tests pass (6+ tests)

**Commit:** `feat: create summary statistics component`

---

### Task 35: Progress Page Integration ⬜

**Description:** Wire everything together on the Progress page.

**Steps:**
1. Update `src/pages/Progress.tsx`:
   - Connect view toggle to show correct charts
   - Connect exercise selector to weight charts
   - Connect cardio type selector to cardio charts
   - Connect time range to all charts
   - Add chart type selector within each view
   - Display SummaryStats at bottom
   - Add loading states
   - Implement lazy loading for chart components
2. Add refresh functionality when returning to page
3. Performance optimization (memoization, etc.)

**Verification:**
- [ ] All charts display correctly based on selections
- [ ] Toggle switches between weights and cardio
- [ ] Selectors filter data appropriately
- [ ] Time range affects all displayed charts
- [ ] Stats update when data changes
- [ ] Performance is acceptable (no jank)
- [ ] Loading states display during data fetch
- [ ] Tests pass

**Commit:** `feat: integrate all charts into progress page`

---

## ✅ Phase 3 Complete Checklist

Before proceeding to Phase 4:
- [ ] All tasks 26-35 complete
- [ ] All tests passing
- [ ] Weight progress charts work for all exercises
- [ ] Volume charts work
- [ ] PR detection accurate
- [ ] All cardio charts work
- [ ] Summary stats accurate
- [ ] Performance acceptable with mock data
- [ ] Git history clean

---

## Phase 4: PWA & Polish (Tasks 36-45)

### Task 36: PWA Manifest ⬜
- Create web app manifest with icons
- Configure Vite PWA plugin
- Add meta tags to index.html
- **Verification:** Lighthouse shows PWA as installable

### Task 37: Service Worker Setup ⬜
- Configure Workbox for precaching
- Set up offline fallback
- **Verification:** App works offline after first load

### Task 38: Install Prompt ⬜
- Create custom install prompt component
- Show after first successful workout
- iOS-specific instructions
- **Verification:** Prompt appears, dismissal remembered

### Task 39: Dark Mode Implementation ⬜
- Add theme toggle in settings
- Support system preference
- Apply to all components
- Prevent flash on load
- **Verification:** All components support dark mode

### Task 40: Rest Timer Component ⬜
- Countdown timer with presets
- Audio notification on complete
- Accessible during workout logging
- **Verification:** Timer works correctly

### Task 41: Edit Workout Functionality ⬜
- Edit button on workout cards
- Pre-populate form with existing data
- Save updates to database
- **Verification:** Can modify past workouts

### Task 42: Delete Workout Functionality ⬜
- Delete button with confirmation
- Cascading delete (workout + sets)
- Same for cardio sessions
- **Verification:** Delete works with confirmation

### Task 43: Workout Notes ⬜
- Add notes field to workout logger
- Display notes in cards
- Include in export/import
- **Verification:** Notes persist and display

### Task 44: Exercise Management Page ⬜
- Complete Exercises page
- Search and filter
- Add/edit/delete custom exercises
- **Verification:** Full exercise CRUD works

### Task 45: Settings Page Completion ⬜
- All settings accessible
- Data management section
- Version display
- **Verification:** All settings work

---

## Phase 5: Optimization & Deployment (Tasks 46-55)

### Task 46: Bundle Size Optimization ⬜
- Analyze and reduce bundle
- Code splitting by route
- Target: < 200KB gzipped

### Task 47: Runtime Performance ⬜
- Profile and fix re-renders
- Virtualize long lists if needed
- Debounce inputs

### Task 48: Accessibility Audit ⬜
- Lighthouse accessibility > 90
- Touch targets 44px+
- Color contrast
- Screen reader testing

### Task 49: iOS Safari Testing ⬜
- Test on multiple iPhone sizes
- PWA installation
- Offline mode
- Fix any iOS-specific issues

### Task 50: Playwright E2E Setup ⬜
- Install and configure Playwright
- Mobile viewport setup
- Smoke test

### Task 51: E2E Tests - Workout Flow ⬜
- Complete workout logging flow
- Edit and delete

### Task 52: E2E Tests - Cardio Flow ⬜
- Treadmill and bike logging
- Edit and delete

### Task 53: E2E Tests - Data Management ⬜
- Export/import cycle
- Clear data
- Offline functionality

### Task 54: Documentation ⬜
- README.md
- DEPLOYMENT.md
- User guide

### Task 55: Deployment to Netlify ⬜
- Create GitHub repo
- Connect to Netlify
- Configure build
- Verify deployment
- Provide URL to user

---

## Final Checklist

Before marking project complete:
- [ ] All 55 tasks complete
- [ ] All tests passing (unit, component, E2E)
- [ ] Lighthouse scores > 90 (Performance, Accessibility, Best Practices, PWA)
- [ ] Works on iPhone SE through Pro Max
- [ ] PWA installs and works offline
- [ ] Data export/import verified
- [ ] Documentation complete
- [ ] Deployed and accessible

---

## Task Status JSON (for machine reading)

```json
{
  "project": "fitness-tracker-pwa",
  "version": "1.0",
  "totalTasks": 55,
  "phases": [
    { "name": "Foundation & Core Weightlifting", "tasks": "1-15", "status": "not_started" },
    { "name": "Cardio & Data Management", "tasks": "16-25", "status": "not_started" },
    { "name": "Progress Visualization", "tasks": "26-35", "status": "not_started" },
    { "name": "PWA & Polish", "tasks": "36-45", "status": "not_started" },
    { "name": "Optimization & Deployment", "tasks": "46-55", "status": "not_started" }
  ],
  "tasks": [
    { "id": 1, "name": "Project Scaffolding", "status": "not_started", "tests_passing": false },
    { "id": 2, "name": "ESLint & Prettier Configuration", "status": "not_started", "tests_passing": false },
    { "id": 3, "name": "Tailwind CSS Setup", "status": "not_started", "tests_passing": false },
    { "id": 4, "name": "Vitest & React Testing Library Setup", "status": "not_started", "tests_passing": false },
    { "id": 5, "name": "TypeScript Types Definition", "status": "not_started", "tests_passing": false },
    { "id": 6, "name": "Dexie.js Database Setup", "status": "not_started", "tests_passing": false },
    { "id": 7, "name": "Database Query Functions", "status": "not_started", "tests_passing": false },
    { "id": 8, "name": "Pre-populate Exercise Library", "status": "not_started", "tests_passing": false },
    { "id": 9, "name": "Zustand Settings Store", "status": "not_started", "tests_passing": false },
    { "id": 10, "name": "React Router Setup", "status": "not_started", "tests_passing": false },
    { "id": 11, "name": "App Shell & Layout Components", "status": "not_started", "tests_passing": false },
    { "id": 12, "name": "Exercise Selector Component", "status": "not_started", "tests_passing": false },
    { "id": 13, "name": "Set Input Component", "status": "not_started", "tests_passing": false },
    { "id": 14, "name": "Workout Logger Page", "status": "not_started", "tests_passing": false },
    { "id": 15, "name": "Workout History List", "status": "not_started", "tests_passing": false },
    { "id": 16, "name": "Cardio Query Functions", "status": "not_started", "tests_passing": false },
    { "id": 17, "name": "Cardio Type Selector Component", "status": "not_started", "tests_passing": false },
    { "id": 18, "name": "Treadmill Form Component", "status": "not_started", "tests_passing": false },
    { "id": 19, "name": "Stationary Bike Form Component", "status": "not_started", "tests_passing": false },
    { "id": 20, "name": "Cardio Logger Integration", "status": "not_started", "tests_passing": false },
    { "id": 21, "name": "Cardio Session Card Component", "status": "not_started", "tests_passing": false },
    { "id": 22, "name": "Combined Workout History", "status": "not_started", "tests_passing": false },
    { "id": 23, "name": "Data Export Functionality", "status": "not_started", "tests_passing": false },
    { "id": 24, "name": "Data Import Functionality", "status": "not_started", "tests_passing": false },
    { "id": 25, "name": "Mock Data Seeding", "status": "not_started", "tests_passing": false },
    { "id": 26, "name": "Progress Page Layout", "status": "not_started", "tests_passing": false },
    { "id": 27, "name": "Recharts Setup & Base Chart", "status": "not_started", "tests_passing": false },
    { "id": 28, "name": "Weight Progress Chart", "status": "not_started", "tests_passing": false },
    { "id": 29, "name": "Volume Chart", "status": "not_started", "tests_passing": false },
    { "id": 30, "name": "PR Detection & Display", "status": "not_started", "tests_passing": false },
    { "id": 31, "name": "Cardio Distance Chart", "status": "not_started", "tests_passing": false },
    { "id": 32, "name": "Cardio Duration & Pace Charts", "status": "not_started", "tests_passing": false },
    { "id": 33, "name": "Cardio Intensity Chart", "status": "not_started", "tests_passing": false },
    { "id": 34, "name": "Summary Statistics Component", "status": "not_started", "tests_passing": false },
    { "id": 35, "name": "Progress Page Integration", "status": "not_started", "tests_passing": false },
    { "id": 36, "name": "PWA Manifest", "status": "not_started", "tests_passing": false },
    { "id": 37, "name": "Service Worker Setup", "status": "not_started", "tests_passing": false },
    { "id": 38, "name": "Install Prompt", "status": "not_started", "tests_passing": false },
    { "id": 39, "name": "Dark Mode Implementation", "status": "not_started", "tests_passing": false },
    { "id": 40, "name": "Rest Timer Component", "status": "not_started", "tests_passing": false },
    { "id": 41, "name": "Edit Workout Functionality", "status": "not_started", "tests_passing": false },
    { "id": 42, "name": "Delete Workout Functionality", "status": "not_started", "tests_passing": false },
    { "id": 43, "name": "Workout Notes", "status": "not_started", "tests_passing": false },
    { "id": 44, "name": "Exercise Management Page", "status": "not_started", "tests_passing": false },
    { "id": 45, "name": "Settings Page Completion", "status": "not_started", "tests_passing": false },
    { "id": 46, "name": "Bundle Size Optimization", "status": "not_started", "tests_passing": false },
    { "id": 47, "name": "Runtime Performance", "status": "not_started", "tests_passing": false },
    { "id": 48, "name": "Accessibility Audit", "status": "not_started", "tests_passing": false },
    { "id": 49, "name": "iOS Safari Testing", "status": "not_started", "tests_passing": false },
    { "id": 50, "name": "Playwright E2E Setup", "status": "not_started", "tests_passing": false },
    { "id": 51, "name": "E2E Tests - Workout Flow", "status": "not_started", "tests_passing": false },
    { "id": 52, "name": "E2E Tests - Cardio Flow", "status": "not_started", "tests_passing": false },
    { "id": 53, "name": "E2E Tests - Data Management", "status": "not_started", "tests_passing": false },
    { "id": 54, "name": "Documentation", "status": "not_started", "tests_passing": false },
    { "id": 55, "name": "Deployment to Netlify", "status": "not_started", "tests_passing": false }
  ]
}
```

---

**End of Task Checklist**
