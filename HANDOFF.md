# Agent Handoff Document - Personal Fitness Tracker PWA

## Quick Start for Next Agent

```powershell
cd C:\Users\Geoff\gym
npm install      # Dependencies already installed
npm test         # Verify 106 tests pass
npm run dev      # Start dev server (port 5173)
```

## Project Overview

Building a Personal Fitness Tracker PWA for weightlifting and cardio tracking. Uses React 19, TypeScript, Vite, Tailwind CSS v4, Dexie.js (IndexedDB), and Zustand for state management.

## Current Status

**Tasks 1-12 COMPLETE** | **Next: Task 13 - Set Input Component**

### Key Documents to Review
1. `prd-improved.md` - Product requirements
2. `agentic-guidelines.md` - Development guidelines
3. `TASK-CHECKLIST-FULL.md` - Full task breakdown (Task 13 starts at line ~1008)
4. `claude-progress.txt` - Detailed session logs

## Project Structure

```
C:\Users\Geoff\gym/
├── src/
│   ├── lib/
│   │   ├── db.ts           # Dexie database setup
│   │   ├── queries.ts      # CRUD operations for all entities
│   │   ├── seed.ts         # 46 default exercises seeding
│   │   ├── weight.ts       # Weight calculation utilities
│   │   └── __tests__/      # Tests for lib modules
│   ├── stores/
│   │   ├── settingsStore.ts # Zustand settings (COMPLETE)
│   │   ├── index.ts        # Barrel export
│   │   └── __tests__/      # Store tests
│   ├── types/
│   │   └── index.ts        # All TypeScript interfaces
│   ├── test/
│   │   └── setup.ts        # Vitest + fake-indexeddb setup
│   ├── App.tsx             # Basic app shell
│   └── index.css           # Tailwind v4 with @theme
├── eslint.config.js        # ESLint 9 flat config
├── vitest.config.ts        # Test configuration
├── tailwind.config.js      # Minimal (v4 uses CSS @theme)
└── init.ps1                # PowerShell dev setup script
```

## Important Technical Details

### Weight System (User Customization)
The user requested a specific weight entry system:
- **Barbell exercises**: User enters weight per side. Total = (weight × 2) + barbell weight
- **Dumbbell exercises**: User enters weight per dumbbell. Total = weight × 2
- **Machine/Cable/Bodyweight**: Weight is as entered
- **Default unit**: kg (not lbs)
- **Default barbell**: 20kg (Olympic standard)

Use `src/lib/weight.ts` utilities:
```typescript
import { calculateTotalWeight, calculateEnteredWeight, formatWeight } from './lib/weight';

// Barbell: 35kg per side + 20kg bar = 90kg total
calculateTotalWeight(35, 'barbell', 20) // Returns 90

// Dumbbell: 20kg per dumbbell × 2 = 40kg total
calculateTotalWeight(20, 'dumbbell') // Returns 40
```

### Database (Dexie.js v4)
- Boolean queries: Use `filter()` not `where().equals()` for booleans
- Exercises have `equipmentType` field linking to weight calculation
- Settings include `barbellWeight` for customizable bar weight

### State Management (Zustand)
Settings store is complete at `src/stores/settingsStore.ts`:
```typescript
import { useSettingsStore } from './stores';

const { weightUnit, barbellWeight, setWeightUnit } = useSettingsStore();
```

### Testing
- Framework: Vitest + React Testing Library + jsdom
- IndexedDB mock: fake-indexeddb (configured in setup.ts)
- Run: `npm test` (106 tests currently)
- Coverage: `npm run test:coverage`

### Styling
- Tailwind CSS v4 with CSS-based `@theme` directive (not JS config)
- Dark mode: class-based (`.dark` on html element)
- Theme colors defined in `src/index.css`

## Completed Tasks Summary

| Task | Description | Commit |
|------|-------------|--------|
| 1 | Project Scaffolding (Vite + React + TS) | 8ee926f |
| 2 | ESLint 9 & Prettier | e4f4352 |
| 3 | Tailwind CSS v4 | 25d43e3 |
| 4 | Vitest + RTL Setup | 8a455d0 |
| 5 | TypeScript Types | 4840235 |
| 6 | Dexie.js Database | 8cb0ce5 |
| 7 | Database Query Functions | 7ae614e |
| 8 | Exercise Library Seeding | 0dc44d3 |
| - | Equipment Types + Weight Utils | ce387b3 |
| 9 | Zustand Settings Store | 9f71cc8 |
| 10 | React Router Setup | c8fcd1f |
| 11 | App Shell & Layout Components | 5b31715 |
| 12 | Exercise Selector Component | ffd97da |

## Next Task: Task 13 - Set Input Component

Reference `TASK-CHECKLIST-FULL.md` around line 1008. This task involves:
1. Create SetInput component for logging reps and weight
2. Add increment/decrement buttons for quick input
3. Support RPE (Rate of Perceived Exertion) optional field
4. Integrate with settings store for weight unit

## Known Gotchas

1. **ESLint 9**: Uses flat config with `tseslint.config()` helper - don't use legacy `.eslintrc`
2. **Tailwind v4**: No `npx tailwindcss init` - use CSS `@theme` directive
3. **Dexie booleans**: `where('isCustom').equals(false)` fails - use `filter()`
4. **Windows paths**: Use PowerShell, not bash scripts

## Verification Before Starting

```powershell
npm test                    # Should see 106 passing tests
npm run lint               # Should pass with no errors
npm run build              # Should build successfully
```

## User Preferences

- Check in before proceeding to each new task
- Use PowerShell for scripts (Windows environment)
- Default weight unit is kg, not lbs
- Weight entry is per-side (barbell) or per-dumbbell (dumbbell)
