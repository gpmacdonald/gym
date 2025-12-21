# Agent Handoff Document - Personal Fitness Tracker PWA

## Quick Start for Next Agent

```powershell
cd C:\Users\Geoff\gym
npm install      # Dependencies already installed
npm test         # Verify all tests pass (518 tests)
npm run dev -- --host   # Start dev server with network access
```

## Project Overview

Building a Personal Fitness Tracker PWA for weightlifting and cardio tracking. Uses React 19, TypeScript, Vite, Tailwind CSS v4, Dexie.js (IndexedDB), Zustand for state management, and Recharts for data visualization.

### Key Documents to Review
1. `prd-improved.md` - Product requirements
2. `agentic-guidelines.md` - Development guidelines  
3. `TASK-CHECKLIST-FULL.md` - Full task breakdown
4. `docs/ios-testing-checklist.md` - iOS testing guide

## Current Status

**Tasks 1-48 COMPLETE** | **Task 49 IN PROGRESS - iOS Safari Testing**

### 🚨 ACTIVE ISSUE - iOS Testing Problems

User is testing on iOS Safari and encountering these issues:

1. **No exercises loaded** - Exercises page shows empty list
2. **"Failed to Save Exercise"** - Adding custom exercise fails
3. **"Failed to seed mock data"** - Mock data generation fails
4. **iOS install prompt not appearing** - After completing workout

**Fixes already applied (commit fc326ab):**
- Added `seedExercises()` call in `main.tsx` on app startup
- Fixed iOS install prompt logic (iOS doesn't fire `beforeinstallprompt`)

**Problem:** User reports changes not taking effect despite server restart. Likely **browser caching issue** on iOS Safari.

### Troubleshooting Steps to Try:
1. User needs to **clear Safari cache/website data** for the dev server IP
2. Or test in **Safari Private/Incognito mode**
3. Check browser console for IndexedDB errors
4. The IndexedDB operations may be failing silently on iOS

### Possible Root Causes to Investigate:
1. **IndexedDB compatibility** - iOS Safari has quirks with IndexedDB
2. **Dexie.js on iOS** - May need specific configuration
3. **crypto.randomUUID()** - May not be available in older iOS versions
4. **Service Worker caching** - Old code may be cached by SW

### Recent Commits (This Session)
| Commit | Description |
|--------|-------------|
| fc326ab | fix: iOS testing issues - seed exercises on startup, fix iOS install prompt |
| 939ddb9 | chore: iOS Safari testing preparation |
| 6885efa | a11y: improve accessibility across components (Task 48) |
| a8bd2f2 | perf: add runtime optimizations (Task 47) |
| aed620b | perf: add route-based code splitting (Task 46) |
| dbac4e7 | feat: complete settings page (Task 45) |
| 20acd92 | feat: add exercise management page (Task 44) |

## Project Structure

```
C:\Users\Geoff\gym/
├── src/
│   ├── components/
│   │   ├── cardio/           # CardioTypeSelector, TreadmillForm, BikeForm, CardioLogger, CardioCard
│   │   ├── exercises/        # ExerciseList, ExerciseModal
│   │   ├── layout/           # Header, BottomNav, AppShell, OfflineIndicator, InstallPrompt
│   │   ├── progress/         # TimeRangeTabs, ExerciseDropdown, CardioTypeDropdown, BaseChart, WeightProgressChart, VolumeChart, CardioDistanceChart, CardioDurationChart, CardioPaceChart, CardioIntensityChart, PRBadge, PRList
│   │   ├── settings/         # DataExport, DataImport, ThemeToggle, MockDataManager, AppInfo
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
│   │   ├── useDebounce.ts    # Debounce hook for search inputs
│   │   ├── dataExport.ts     # JSON export functionality
│   │   ├── dataImport.ts     # JSON import with validation
│   │   └── __tests__/        # Tests for lib modules
│   ├── pages/
│   │   ├── Home.tsx          # Main page with ActivityList
│   │   ├── Progress.tsx      # Progress charts page
│   │   ├── Exercises.tsx     # Exercise library
│   │   └── Settings.tsx      # Settings page
│   ├── main.tsx              # App entry - calls seedExercises() on startup
│   ├── stores/
│   │   └── settingsStore.ts  # Zustand settings store
│   └── types/
│       └── index.ts          # All TypeScript interfaces
├── docs/
│   └── ios-testing-checklist.md  # iOS testing guide
├── public/
│   └── icons/                # PWA icons (192x192, 512x512, apple-touch-icon)
└── vite.config.ts            # Includes vite-plugin-pwa configuration
```

## Key Technical Details

### Database (Dexie.js / IndexedDB)
```typescript
// src/lib/db.ts - Database schema
import { db } from './db';

// Tables: exercises, workouts, workoutSets, cardioSessions, settings
```

### Exercise Seeding (IMPORTANT)
```typescript
// src/main.tsx - Seeds 46 default exercises on app startup
import { seedExercises } from './lib/seed';
seedExercises().catch(console.error);
```

### ID Generation
```typescript
// src/lib/queries.ts - Uses crypto.randomUUID()
function generateId(): string {
  return crypto.randomUUID();  // May not work on older iOS!
}
```

### PWA Hooks
```typescript
import { useOnlineStatus, useIsPWA, useInstallPrompt, isIOS } from '../lib/pwa';

// isIOS() - Detects iOS devices
// Install prompt now shows on iOS after first workout (fc326ab fix)
```

## Verification Commands

```powershell
npm test                    # All 518 tests should pass
npm run lint               # Should pass (warnings ok)
npm run build              # Should build successfully with PWA
npm run dev -- --host      # Start with network access for iOS testing
```

## Known Gotchas

1. **ESLint 9**: Uses flat config - don't use legacy `.eslintrc`
2. **Tailwind v4**: Uses CSS `@theme` directive, not JS config
3. **Dexie booleans**: Use `filter()` not `where().equals()` for booleans
4. **Recharts in tests**: ResponsiveContainer needs width/height
5. **Windows paths**: Use PowerShell, backslashes in paths
6. **PWA hooks in tests**: Mock `../lib/pwa` module to avoid localStorage issues
7. **iOS Safari**: May have IndexedDB quirks - test thoroughly
8. **crypto.randomUUID()**: Requires secure context (HTTPS) on some browsers

## User Preferences

- Check in before proceeding to each new task
- Update HANDOFF.md when stopping
- Use PowerShell (Windows environment)
- Default weight unit is kg, not lbs
