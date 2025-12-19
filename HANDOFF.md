# Agent Handoff Document - Personal Fitness Tracker PWA

## Quick Start for Next Agent

```powershell
cd C:\Users\Geoff\gym
npm install      # Dependencies already installed
npm test         # Verify all tests pass
npm run dev      # Start dev server (port 5173)
```

## Project Overview

Building a Personal Fitness Tracker PWA for weightlifting and cardio tracking. Uses React 19, TypeScript, Vite, Tailwind CSS v4, Dexie.js (IndexedDB), Zustand for state management, and Recharts for data visualization.

### Key Documents to Review
1. `prd-improved.md` - Product requirements
2. `agentic-guidelines.md` - Development guidelines  
3. `TASK-CHECKLIST-FULL.md` - Full task breakdown (Task 29 starts at line ~2596)

## Current Status

**Tasks 1-30 COMPLETE** | **Next: Task 31 - Cardio Distance Chart**

### Recently Completed (This Session)
| Task | Description | Commit |
|------|-------------|--------|
| 25 | Mock Data Seeding | 92003aa |
| 26 | Progress Page Layout | 2f2e9c1 |
| 27 | Recharts Setup & Base Chart | f7b8cf3 |
| 28 | Weight Progress Chart | 0108893 |
| 29 | Volume Chart | 4e5f007 |
| 30 | PR Detection & Display | 3bf7b77 |

## Project Structure

```
C:\Users\Geoff\gym/
├── src/
│   ├── components/
│   │   ├── cardio/           # CardioTypeSelector, TreadmillForm, BikeForm, CardioLogger, CardioCard
│   │   ├── layout/           # Header, BottomNav
│   │   ├── progress/         # TimeRangeTabs, ExerciseDropdown, CardioTypeDropdown, BaseChart, WeightProgressChart
│   │   ├── settings/         # DataExport, DataImport
│   │   └── workout/          # ExerciseSelector, SetInput, WorkoutLogger, WorkoutCard, ActivityList
│   ├── lib/
│   │   ├── db.ts             # Dexie database setup
│   │   ├── queries.ts        # CRUD operations for all entities
│   │   ├── seed.ts           # 46 default exercises + mock data seeding
│   │   ├── weight.ts         # Weight calculation utilities
│   │   ├── utils.ts          # formatDuration, formatDate utilities
│   │   ├── chartUtils.ts     # Chart formatting and colors
│   │   ├── progressQueries.ts # Weight progress data queries
│   │   ├── dataExport.ts     # JSON export functionality
│   │   ├── dataImport.ts     # JSON import with validation
│   │   └── __tests__/        # Tests for lib modules
│   ├── pages/
│   │   ├── Home.tsx          # Main page with ActivityList
│   │   ├── Progress.tsx      # Progress charts page
│   │   ├── Exercises.tsx     # Exercise library
│   │   └── Settings.tsx      # Settings page
│   ├── stores/
│   │   └── settingsStore.ts  # Zustand settings store
│   └── types/
│       └── index.ts          # All TypeScript interfaces
```

## Key Features Implemented

### Workout Logging
- Weight workouts with exercise selection, set tracking
- Cardio sessions (treadmill & stationary bike)
- Combined activity history with filter tabs (All/Weights/Cardio)

### Progress Visualization
- Exercise dropdown with recent exercises first
- Time range selector (1M, 3M, 6M, 1Y, All)
- Weight progress line chart with PR highlighting
- Dark mode support for charts

### Data Management
- Export all data to JSON backup file
- Import with validation (merge or replace mode)
- Mock data seeding for testing (~60 workouts, ~30 cardio over 3 months)

## Important Technical Details

### Weight System
- Barbell: User enters per-side weight, total = (weight × 2) + barbell
- Dumbbell: User enters per-dumbbell, total = weight × 2
- Default unit: kg, default barbell: 20kg

### Charts (Recharts)
```typescript
import { BaseChart, WeightProgressChart } from '../components/progress';
import { getWeightProgressData } from '../lib/progressQueries';
```

### Mock Data Seeding
```typescript
import { seedMockData, clearMockData, hasMockData } from '../lib/seed';

await seedMockData();  // Creates 3 months of realistic data
await clearMockData(); // Clears workout data, keeps exercises
```

### Data Export/Import
```typescript
import { exportAllData, downloadAsJson } from '../lib/dataExport';
import { validateImportFile, importData } from '../lib/dataImport';
```

## Next Task: Task 31 - Cardio Distance Chart

Reference `TASK-CHECKLIST-FULL.md` around line 2662. This task involves:
1. Add `getCardioDistanceData(type?, startDate, endDate)` to progressQueries.ts
2. Create CardioDistanceChart component:
   - Line chart with date on X-axis, distance on Y-axis
   - Filter by cardio type (treadmill, bike, all)
   - Handle sessions without distance data
   - Display correct unit (miles/km)

## Verification Before Starting

```powershell
npm test                    # All tests should pass
npm run lint               # Should pass (warnings ok)
npm run build              # Should build successfully
```

## Known Gotchas

1. **ESLint 9**: Uses flat config - don't use legacy `.eslintrc`
2. **Tailwind v4**: Uses CSS `@theme` directive, not JS config
3. **Dexie booleans**: Use `filter()` not `where().equals()` for booleans
4. **Recharts in tests**: ResponsiveContainer needs width/height - check for `.recharts-responsive-container` class
5. **Windows paths**: Use PowerShell, backslashes in paths

## User Preferences

- Check in before proceeding to each new task
- Update HANDOFF.md when stopping
- Use PowerShell (Windows environment)
- Default weight unit is kg, not lbs
