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
3. `TASK-CHECKLIST-FULL.md` - Full task breakdown

## Current Status

**Tasks 1-40 COMPLETE** | **Next: Task 41 - Edit Workout Functionality**

### Recently Completed (This Session)
| Task | Description | Commit |
|------|-------------|--------|
| 37 | Service Worker Setup | dad71ae |
| 38 | Install Prompt | c8327b9 |
| 39 | Dark Mode Implementation | a517f44 |
| 40 | Rest Timer Component | 29628ad |

## Project Structure

```
C:\Users\Geoff\gym/
├── src/
│   ├── components/
│   │   ├── cardio/           # CardioTypeSelector, TreadmillForm, BikeForm, CardioLogger, CardioCard
│   │   ├── layout/           # Header, BottomNav, AppShell, OfflineIndicator, InstallPrompt
│   │   ├── progress/         # TimeRangeTabs, ExerciseDropdown, CardioTypeDropdown, BaseChart, WeightProgressChart, VolumeChart, CardioDistanceChart, CardioDurationChart, CardioPaceChart, CardioIntensityChart, PRBadge, PRList
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
│   │   ├── pwa.ts            # PWA hooks (useOnlineStatus, useIsPWA, useInstallPrompt)
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
├── public/
│   └── icons/                # PWA icons (192x192, 512x512, apple-touch-icon)
└── vite.config.ts            # Includes vite-plugin-pwa configuration
```

## Key Features Implemented

### Workout Logging
- Weight workouts with exercise selection, set tracking
- Cardio sessions (treadmill & stationary bike)
- Combined activity history with filter tabs (All/Weights/Cardio)

### Progress Visualization
- Weights view: Weight & Volume charts with exercise filter
- Cardio view: Distance, Duration, Pace, & Intensity charts with type filter
- Exercise dropdown with recent exercises first
- Time range selector (1M, 3M, 6M, 1Y, All)
- Weight progress line chart with PR highlighting
- Cardio pace chart with pace/speed toggle
- PRList showing top personal records
- Dark mode support for all charts

### Data Management
- Export all data to JSON backup file
- Import with validation (merge or replace mode)
- Mock data seeding for testing (~60 workouts, ~30 cardio over 3 months)

### PWA Features (NEW)
- Web app manifest with icons
- Service worker with precaching (works offline)
- Offline indicator banner
- Install prompt (shows after first workout, iOS-specific instructions)

## Important Technical Details

### Theme Hook
```typescript
import { useTheme } from '../lib/theme';

const { theme, effectiveTheme, isDark, setTheme, toggleTheme } = useTheme();
// theme: 'light' | 'dark' | 'system'
// effectiveTheme: 'light' | 'dark' (resolved from system)
```

### PWA Hooks
```typescript
import { useOnlineStatus, useIsPWA, useInstallPrompt } from '../lib/pwa';

const isOnline = useOnlineStatus();
const isPWA = useIsPWA();
const { shouldShowPrompt, promptInstall, dismissPrompt, markFirstWorkoutComplete } = useInstallPrompt();
```

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

## Next Task: Task 41 - Edit Workout Functionality

Reference `TASK-CHECKLIST-FULL.md` around line 2857. Remaining Phase 4 tasks:
1. Task 41: Edit Workout Functionality - Edit button on workout cards
2. Task 42: Delete Workout Functionality - Delete with confirmation
3. Task 43: Workout Notes - Notes field in workout logger
4. Task 44: Exercise Management Page - CRUD for exercises
5. Task 45: Settings Page Completion

## Verification Before Starting

```powershell
npm test                    # All 421 tests should pass
npm run lint               # Should pass (warnings ok)
npm run build              # Should build successfully with PWA
```

## Known Gotchas

1. **ESLint 9**: Uses flat config - don't use legacy `.eslintrc`
2. **Tailwind v4**: Uses CSS `@theme` directive, not JS config
3. **Dexie booleans**: Use `filter()` not `where().equals()` for booleans
4. **Recharts in tests**: ResponsiveContainer needs width/height - check for `.recharts-responsive-container` class
5. **Windows paths**: Use PowerShell, backslashes in paths
6. **PWA hooks in tests**: Mock `../lib/pwa` module to avoid localStorage issues

## User Preferences

- Check in before proceeding to each new task
- Update HANDOFF.md when stopping
- Use PowerShell (Windows environment)
- Default weight unit is kg, not lbs
