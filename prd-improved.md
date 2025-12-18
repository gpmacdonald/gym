# Product Requirements Document
## Personal Fitness Tracker PWA (Weightlifting + Cardio)

**Version:** 1.1  
**Date:** December 18, 2025  
**Author:** Product Team  
**Status:** Draft (Revised)

---

## 1. Executive Summary

### 1.1 Product Overview
A Progressive Web Application (PWA) for tracking weightlifting workouts and cardio sessions that runs entirely in the browser with offline capability. The application stores all data locally on the user's device using IndexedDB, requires no account creation, and is accessible via iPhone Safari browser with the ability to be installed to the home screen for an app-like experience.

### 1.2 Target User
Individual fitness enthusiasts who want a simple, private, and free solution to track their strength training and cardio progress without cloud dependencies or subscription costs.

### 1.3 Key Value Propositions
- **Complete Privacy**: All data stays on the user's device
- **Zero Cost**: No hosting fees, no subscriptions, no backend infrastructure
- **Offline-First**: Works without internet connection after initial load
- **Simple & Fast**: Focused feature set optimized for quick workout logging
- **Data Ownership**: Full control with export/import capabilities
- **Unified Tracking**: Both weightlifting and cardio in one app

---

## 2. Product Goals & Success Metrics

### 2.1 Primary Goals
1. Enable users to log weightlifting workouts with exercises, sets, reps, and weight in under 30 seconds per exercise
2. Enable users to log cardio sessions (treadmill/stationary bike) with duration, distance, and incline
3. Provide clear visualization of strength and cardio progression over time
4. Function reliably offline on iPhone devices
5. Allow users to maintain complete control of their data

### 2.2 Success Metrics
- Time to log a complete workout: < 2 minutes
- PWA installation rate from first-time visitors: > 40%
- Return user rate after 7 days: > 60%
- Data export success rate: 100%

---

## 3. User Stories & Use Cases

### 3.1 Core User Stories

**As a fitness enthusiast, I want to...**

1. **Quick Weightlifting Logging**
   - Log today's workout with multiple exercises
   - Add sets with reps and weight for each exercise
   - Edit or delete entries if I make mistakes
   - Copy a previous workout as a template

2. **Quick Cardio Logging**
   - Log treadmill sessions with duration, distance, speed, and incline
   - Log stationary bike sessions with duration, distance, resistance, and cadence
   - Track calories burned (estimated)
   - Add notes about how the session felt

3. **Progress Tracking**
   - View my workout history by date (both weights and cardio)
   - See charts showing strength gains over time
   - See charts showing cardio improvements (distance, duration, pace)
   - Identify personal records (PRs) for each exercise
   - Track total volume lifted per session
   - Track total cardio time/distance per week

4. **Exercise Management**
   - Select from a pre-populated list of common exercises
   - Add custom exercises to my personal library
   - Edit or delete exercises I've created
   - Search/filter exercises quickly

5. **Data Control**
   - Export all my data as a backup file
   - Import data from a backup to restore or transfer
   - Clear all data if I want to start fresh

6. **Offline Access**
   - Use the app without internet connection
   - Install it to my home screen like a native app
   - Have consistent performance regardless of connectivity

### 3.2 Example Use Cases

**Use Case 1: First-Time User Setup**
1. User navigates to the PWA URL in Safari
2. App loads instantly with welcome screen
3. User sees option to install to home screen
4. User begins logging their first workout immediately

**Use Case 2: Logging a Weightlifting Workout**
1. User opens app (offline, at gym)
2. Taps "New Workout" button
3. Selects "Weights" as workout type
4. Selects "Bench Press" from exercise list
5. Adds 3 sets: 135lbs x 10, 185lbs x 8, 205lbs x 5
6. Adds "Squats" and logs sets
7. Saves workout in under 2 minutes

**Use Case 3: Logging a Cardio Session**
1. User opens app after treadmill session
2. Taps "New Workout" button
3. Selects "Cardio" as workout type
4. Selects "Treadmill" from cardio options
5. Enters: 30 minutes, 2.5 miles, 3% average incline
6. Optionally adds notes: "Felt good, could have gone longer"
7. Saves session

**Use Case 4: Reviewing Progress**
1. User opens progress tab
2. Selects "Bench Press" from exercise dropdown
3. Views line chart showing max weight over last 3 months
4. Sees new PR highlighted
5. Switches to cardio view
6. Sees treadmill distance trending upward over time

**Use Case 5: Data Backup**
1. User navigates to settings
2. Taps "Export Data"
3. Browser downloads JSON file with all workout history
4. User saves file to iCloud Drive for safekeeping

---

## 4. Functional Requirements

### 4.1 Workout Logging - Weightlifting

**FR-1.1: Create Weightlifting Session**
- User can create a new workout for current date
- User can create workout for past date (backfilling)
- Each workout is timestamped
- User can add optional notes to workout

**FR-1.2: Add Exercises to Workout**
- User selects exercise from searchable dropdown
- Multiple exercises can be added to single workout
- Exercise order can be rearranged via drag-and-drop
- User can remove exercises from workout

**FR-1.3: Log Sets**
- For each exercise, user can add multiple sets
- Each set captures: reps (number), weight (lbs or kg)
- User can add/remove sets dynamically
- Optional RPE (Rate of Perceived Exertion) or RIR (Reps in Reserve) tracking

**FR-1.4: Edit/Delete Workouts**
- User can edit any past workout
- User can delete individual sets or entire workouts
- Confirmation required for destructive actions

### 4.2 Workout Logging - Cardio

**FR-2.1: Create Cardio Session**
- User can create a new cardio session for current or past date
- User selects cardio type: Treadmill or Stationary Bike
- Each session is timestamped
- User can add optional notes

**FR-2.2: Treadmill Session Fields**
- Duration (minutes:seconds)
- Distance (miles or km)
- Average Speed (mph or km/h) - auto-calculated or manual
- Average Incline (percentage, 0-15%)
- Max Incline (percentage, optional)
- Calories burned (optional, user-entered)

**FR-2.3: Stationary Bike Session Fields**
- Duration (minutes:seconds)
- Distance (miles or km, if available)
- Average Resistance Level (1-20 or similar scale)
- Average Cadence (RPM, optional)
- Calories burned (optional, user-entered)

**FR-2.4: Edit/Delete Cardio Sessions**
- User can edit any past cardio session
- User can delete sessions
- Confirmation required for destructive actions

### 4.3 Exercise Library

**FR-3.1: Pre-Populated Exercises**
- App ships with 50+ common weightlifting exercises
- Exercises categorized by muscle group:
  - Chest (Bench Press, Dumbbell Flyes, etc.)
  - Back (Deadlift, Pull-ups, Rows, etc.)
  - Legs (Squat, Leg Press, Lunges, etc.)
  - Shoulders (Overhead Press, Lateral Raises, etc.)
  - Arms (Bicep Curls, Tricep Extensions, etc.)
  - Core (Planks, Crunches, etc.)
- App includes 2 cardio types:
  - Treadmill
  - Stationary Bike

**FR-3.2: Custom Exercises**
- User can add custom weightlifting exercises
- Required fields: Exercise name, muscle group
- User can edit/delete custom exercises
- Custom exercises persist across sessions

**FR-3.3: Exercise Search**
- Real-time search/filter of exercise list
- Search by name or muscle group
- Recently used exercises appear at top

### 4.4 Progress Visualization

**FR-4.1: Workout History View**
- Chronological list of all workouts (weights and cardio combined)
- Visual indicator for workout type (weights vs cardio)
- Grouped by date with expandable details
- Shows exercises, sets, reps, weight for weightlifting
- Shows duration, distance, incline for cardio
- Filter by date range
- Filter by workout type (all, weights only, cardio only)
- Search by exercise name

**FR-4.2: Weightlifting Progress Charts**
- Line chart showing max weight over time per exercise
- Volume chart (total weight lifted per session)
- PR (personal record) indicators
- Configurable time ranges (1 month, 3 months, 6 months, 1 year, all)
- User selects exercise from dropdown

**FR-4.3: Cardio Progress Charts**
- Line chart showing distance over time
- Line chart showing duration over time
- Line chart showing average pace over time
- Line chart showing average incline over time (treadmill)
- Line chart showing average resistance over time (bike)
- Configurable time ranges
- Filter by cardio type (treadmill, bike, all)

**FR-4.4: Summary Statistics**
- Total workouts completed (weights + cardio)
- Total volume lifted (all-time)
- Total cardio time (all-time)
- Total cardio distance (all-time)
- Current PRs for each exercise
- Workout frequency (avg per week)
- Most trained muscle groups

### 4.5 Data Management

**FR-5.1: Export Data**
- One-tap export of all workout data
- Format: JSON file
- Includes: workouts, exercises, cardio sessions, settings
- Downloads to device via browser
- Filename includes timestamp

**FR-5.2: Import Data**
- User can upload previously exported JSON file
- Validates file format before import
- Options: Merge with existing data or replace all
- Shows preview before confirming import

**FR-5.3: Clear Data**
- User can delete all workout data
- Requires explicit confirmation
- Cannot be undone
- Preserves exercise library

**FR-5.4: Mock Data for Testing**
- Developer can seed database with realistic mock data
- Mock data includes 3 months of varied workouts
- Includes both weightlifting and cardio sessions
- Used for testing progress charts and edge cases

### 4.6 Settings & Preferences

**FR-6.1: Units**
- Toggle between lbs/kg for weights
- Toggle between miles/km for distance
- Applies to all inputs and displays
- Persists across sessions

**FR-6.2: Theme**
- Light mode and dark mode options
- System default option (follows iOS settings)
- High contrast option for outdoor use

**FR-6.3: Rest Timer**
- Optional countdown timer between sets
- Configurable duration (30s, 60s, 90s, 2min, 3min, custom)
- Audio/visual notification when complete
- Accessible from workout logging screen

### 4.7 PWA Features

**FR-7.1: Installation**
- Meets PWA installability criteria
- Custom app icon and splash screen
- Prompts user to install after first successful workout log
- Removes browser UI when installed

**FR-7.2: Offline Functionality**
- Entire app cached via service worker
- All features work offline after first load
- No degraded experience when offline

**FR-7.3: Performance**
- Initial page load < 2 seconds
- Interactions feel instant (< 100ms)
- Smooth animations at 60fps
- Efficient memory usage

---

## 5. Non-Functional Requirements

### 5.1 Performance
- **Load Time**: First contentful paint < 1.5 seconds on 4G
- **Time to Interactive**: < 2.5 seconds
- **Database Queries**: < 50ms for typical read operations
- **Animation Frame Rate**: 60fps for all UI transitions

### 5.2 Compatibility
- **Primary Target**: iOS 15+ (Safari)
- **Secondary Support**: Modern browsers (Chrome, Firefox, Edge)
- **Screen Sizes**: Optimized for iPhone SE (375px) to iPhone Pro Max (430px)
- **Responsive**: Works on tablets and desktops

### 5.3 Accessibility
- **WCAG 2.1 Level AA** compliance
- Touch targets minimum 44x44px
- Sufficient color contrast ratios
- Screen reader support for all interactive elements
- Keyboard navigation support

### 5.4 Security & Privacy
- No user authentication required
- No data transmitted to external servers
- No analytics or tracking
- No third-party scripts
- All data stored client-side only

### 5.5 Data Integrity
- Automatic backup of IndexedDB data
- Graceful handling of storage quota exceeded
- Data validation on all inputs
- Atomic transactions for data modifications

### 5.6 Usability
- Maximum 3 taps to complete any primary action
- Clear visual feedback for all interactions
- Undo capability for destructive actions
- Consistent UI patterns throughout app

---

## 6. Technical Architecture

### 6.1 Technology Stack

**Frontend Framework**
- **React 18.3+**: Component-based UI library
- **TypeScript**: Type safety and better developer experience
- **Vite**: Fast build tool and development server

**Styling**
- **Tailwind CSS 3.4+**: Utility-first CSS framework
- Custom iPhone-optimized components
- Dark mode support via Tailwind's dark: variant

**State Management**
- **Zustand**: Lightweight state management
- Minimal boilerplate, simple API
- Persisted state for user preferences

**Local Database**
- **IndexedDB**: Browser's built-in database
- **Dexie.js 3.2+**: IndexedDB wrapper with simpler API
- Supports complex queries, indexing, and transactions

**Data Visualization**
- **Recharts 2.10+**: React-based charting library
- Responsive, interactive charts

**PWA Infrastructure**
- **Vite PWA Plugin**: Automated service worker generation
- **Workbox**: Service worker routing and caching strategies
- Web App Manifest for installability

**Testing Framework**
- **Vitest**: Unit and integration testing (Jest-compatible)
- **React Testing Library**: Component testing
- **Playwright**: End-to-end testing for PWA features

**Development Tools**
- **ESLint**: Code linting
- **Prettier**: Code formatting

**Hosting**
- **Netlify**: Free tier hosting
- Automatic HTTPS
- CDN distribution
- Deploy via Git integration

### 6.2 Data Model

**Database Schema (IndexedDB)**

```typescript
// Exercises Table
interface Exercise {
  id: string; // UUID
  name: string;
  muscleGroup: 'chest' | 'back' | 'legs' | 'shoulders' | 'arms' | 'core';
  isCustom: boolean;
  createdAt: Date;
}

// Workouts Table (Weightlifting)
interface Workout {
  id: string; // UUID
  date: Date; // Date of workout
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Sets Table
interface WorkoutSet {
  id: string; // UUID
  workoutId: string; // Foreign key to Workout
  exerciseId: string; // Foreign key to Exercise
  setNumber: number; // Order within exercise (1, 2, 3...)
  reps: number;
  weight: number; // Always stored in lbs, converted on display
  rpe?: number; // Optional: Rate of Perceived Exertion (1-10)
  createdAt: Date;
}

// Cardio Sessions Table
interface CardioSession {
  id: string; // UUID
  date: Date;
  type: 'treadmill' | 'stationary-bike';
  duration: number; // seconds
  distance?: number; // Always stored in miles, converted on display
  avgSpeed?: number; // mph
  avgIncline?: number; // percentage (treadmill only)
  maxIncline?: number; // percentage (treadmill only)
  avgResistance?: number; // 1-20 scale (bike only)
  avgCadence?: number; // RPM (bike only)
  calories?: number;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Settings Table (single row)
interface Settings {
  id: 'settings'; // Always 'settings'
  weightUnit: 'lbs' | 'kg';
  distanceUnit: 'miles' | 'km';
  theme: 'light' | 'dark' | 'system';
  restTimerDefault: number; // seconds
}
```

**Indexes**
- Exercises: `name`, `muscleGroup`
- Workouts: `date` (for chronological queries)
- WorkoutSets: `workoutId`, `exerciseId`, `[workoutId+setNumber]` (compound)
- CardioSessions: `date`, `type`

### 6.3 Application Architecture

**Component Structure**
```
src/
├── components/
│   ├── layout/
│   │   ├── AppShell.tsx          # Main app container
│   │   ├── BottomNav.tsx         # Navigation bar
│   │   └── Header.tsx            # Page headers
│   ├── workout/
│   │   ├── WorkoutLogger.tsx     # Main workout logging interface
│   │   ├── ExerciseSelector.tsx  # Exercise search/select dropdown
│   │   ├── SetInput.tsx          # Reps/weight input fields
│   │   ├── WorkoutCard.tsx       # Display single workout
│   │   └── WorkoutTypeSelector.tsx # Choose weights vs cardio
│   ├── cardio/
│   │   ├── CardioLogger.tsx      # Cardio session logging
│   │   ├── TreadmillForm.tsx     # Treadmill-specific fields
│   │   ├── BikeForm.tsx          # Stationary bike fields
│   │   └── CardioCard.tsx        # Display single cardio session
│   ├── progress/
│   │   ├── ProgressChart.tsx     # Line chart component
│   │   ├── VolumeChart.tsx       # Volume bar chart
│   │   ├── CardioChart.tsx       # Cardio progress charts
│   │   ├── StatsCard.tsx         # Summary statistics
│   │   └── ExerciseHistory.tsx   # Exercise-specific history
│   ├── exercises/
│   │   ├── ExerciseList.tsx      # Browse all exercises
│   │   ├── ExerciseForm.tsx      # Add/edit exercise
│   │   └── ExerciseCard.tsx      # Single exercise display
│   └── settings/
│       ├── SettingsPanel.tsx     # All settings
│       ├── DataExport.tsx        # Export functionality
│       └── DataImport.tsx        # Import functionality
├── lib/
│   ├── db.ts                     # Dexie database setup
│   ├── queries.ts                # Database query functions
│   ├── seed.ts                   # Mock data seeding
│   └── utils.ts                  # Helper functions
├── stores/
│   └── settingsStore.ts          # Zustand store for settings
├── pages/
│   ├── Home.tsx                  # Workout logging page
│   ├── Progress.tsx              # Progress/charts page
│   ├── Exercises.tsx             # Exercise library page
│   └── Settings.tsx              # Settings page
├── types/
│   └── index.ts                  # TypeScript interfaces
└── App.tsx                       # Root component with routing
```

**Routing**
- Hash-based routing (react-router-dom with HashRouter)
- Routes:
  - `/` - Home (Workout Logger)
  - `/progress` - Progress & Charts
  - `/exercises` - Exercise Library
  - `/settings` - Settings & Data Management

### 6.4 Caching Strategy

**Service Worker Caching**
- **Precache**: HTML, CSS, JS, icons, fonts
- **Runtime Cache**: Cache-first for static assets
- **Offline Fallback**: Show cached app when offline

**IndexedDB Size Considerations**
- Typical workout: ~2KB
- Typical cardio session: ~500B
- 1000 workouts: ~2MB
- Exercise library: ~50KB
- Well within 50MB+ quota on modern iOS

---

## 7. User Interface Design

### 7.1 Design Principles

**Mobile-First**
- Thumb-friendly touch targets
- Bottom navigation for easy reach
- Minimal scrolling on primary flows
- Landscape mode support

**Simplicity**
- One primary action per screen
- Progressive disclosure of advanced features
- Clear visual hierarchy
- Generous white space

**Speed**
- Smart defaults reduce input
- Auto-complete and suggestions
- Quick-add buttons for common actions

**Feedback**
- Immediate visual response to taps
- Success confirmations
- Loading states for operations > 200ms
- Error messages with recovery options

### 7.2 Navigation Structure

**Bottom Tab Navigation (4 tabs)**
1. **Home** (🏠): Workout logging (default view)
2. **Progress** (📈): Charts and statistics
3. **Exercises** (💪): Exercise library
4. **Settings** (⚙️): Preferences and data management

### 7.3 Key Screens

**Home - Workout Logger**
- Toggle: "Weights" | "Cardio"
- Floating "+" button to start new workout
- Today's workout displayed if exists
- Recent workouts (last 3) below
- Empty state: "Start Your First Workout"

**Home - Cardio Logger**
- Select cardio type: Treadmill | Bike
- Form fields appropriate to type
- Duration picker (minutes:seconds)
- Number inputs for distance, incline, etc.
- Save button

**Progress - Charts View**
- Toggle: "Weights" | "Cardio"
- Exercise/metric dropdown selector at top
- Large interactive chart (75% of viewport)
- Time range tabs below chart
- Stats cards at bottom

**Exercises - Library**
- Search bar at top (sticky)
- Muscle group filter chips
- Scrollable list of exercises
- "+" button to add custom exercise

**Settings**
- Grouped sections (Units, Theme, Data)
- Toggle switches for boolean settings
- Action buttons for export/import/clear
- Version number at bottom

### 7.4 Color Palette

**Light Mode**
- Primary: Blue-600 (#2563EB)
- Background: White (#FFFFFF)
- Surface: Gray-50 (#F9FAFB)
- Text: Gray-900 (#111827)
- Border: Gray-200 (#E5E7EB)

**Dark Mode**
- Primary: Blue-400 (#60A5FA)
- Background: Gray-900 (#111827)
- Surface: Gray-800 (#1F2937)
- Text: Gray-100 (#F3F4F6)
- Border: Gray-700 (#374151)

**Semantic Colors**
- Success: Green-500
- Warning: Yellow-500
- Error: Red-500
- Info: Blue-500

### 7.5 Typography

**Font Family**
- System font stack: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto
- Fallback: sans-serif

**Font Sizes** (Tailwind scale)
- Headings: text-2xl, text-xl, text-lg
- Body: text-base
- Small: text-sm
- Tiny: text-xs

---

## 8. Implementation Phases

### Phase 1: Foundation & Core Weightlifting (Tasks 1-15)
**Goal**: Project setup and basic weightlifting logging

**Features**
- Project scaffolding with Vite + React + TypeScript
- Tailwind CSS configuration
- IndexedDB setup with Dexie
- Basic routing structure
- Exercise library with pre-populated data
- Create/view weightlifting workouts
- Log sets (reps + weight)
- Basic settings (units)

### Phase 2: Cardio & Data Management (Tasks 16-25)
**Goal**: Add cardio tracking and data import/export

**Features**
- Cardio session logging (treadmill + bike)
- Data export to JSON
- Data import from JSON
- Mock data seeding for testing
- Workout history view (combined weights + cardio)

### Phase 3: Progress Visualization (Tasks 26-35)
**Goal**: Charts and statistics

**Features**
- Weightlifting progress charts
- Cardio progress charts
- PR detection and display
- Summary statistics
- Time range filtering

### Phase 4: PWA & Polish (Tasks 36-45)
**Goal**: Full PWA functionality and UX refinement

**Features**
- Service worker setup
- Offline functionality
- Install prompt
- Dark mode
- Rest timer
- Edit/delete workouts
- Workout notes

### Phase 5: Optimization & Deployment (Tasks 46-55)
**Goal**: Performance, testing, and deployment

**Features**
- Performance optimization
- Accessibility audit
- E2E testing
- Deployment to Netlify
- Documentation

---

## 9. Testing Strategy

### 9.1 Unit Tests (Vitest)
- Database queries and mutations
- Utility functions (unit conversion, calculations)
- Data validation logic

### 9.2 Component Tests (React Testing Library)
- Form inputs and validation
- Navigation and routing
- State management

### 9.3 Integration Tests
- Full workout logging flow
- Data export/import cycle
- Settings persistence

### 9.4 E2E Tests (Playwright)
- PWA installation
- Offline functionality
- Complete user flows

### 9.5 Manual Testing Checklist
- iOS Safari on multiple iPhone sizes
- PWA installation and launch
- Offline mode verification

---

## 10. Deployment

### 10.1 Hosting Platform: Netlify (Free Tier)
- **Build Minutes**: 300/month
- **Bandwidth**: 100GB/month
- **Automatic HTTPS**: Via Let's Encrypt
- **CDN**: Global edge network

### 10.2 Deployment Steps (for user)
1. Create GitHub repository
2. Push code to GitHub
3. Connect Netlify to GitHub repository
4. Configure build settings
5. Deploy

### 10.3 Build Configuration
```toml
# netlify.toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

---

## 11. Appendices

### 11.1 Glossary

- **PWA**: Progressive Web App - web application that can be installed and used like a native app
- **IndexedDB**: Browser's built-in NoSQL database for storing large amounts of structured data
- **Service Worker**: JavaScript that runs in background, enabling offline functionality
- **PR**: Personal Record - the maximum weight lifted for a given exercise
- **RPE**: Rate of Perceived Exertion (1-10 scale)
- **RIR**: Reps in Reserve - how many more reps could be performed
- **Volume**: Total weight lifted (sets × reps × weight)

### 11.2 Pre-Populated Exercise Library

**Chest** (7 exercises)
- Barbell Bench Press, Dumbbell Bench Press, Incline Barbell Bench Press, Incline Dumbbell Bench Press, Dumbbell Flyes, Cable Flyes, Push-ups

**Back** (8 exercises)
- Conventional Deadlift, Barbell Row, Dumbbell Row, Pull-ups, Lat Pulldown, Seated Cable Row, T-Bar Row, Face Pulls

**Legs** (10 exercises)
- Barbell Back Squat, Barbell Front Squat, Romanian Deadlift, Leg Press, Bulgarian Split Squat, Lunges, Leg Extension, Leg Curl, Calf Raise, Hip Thrust

**Shoulders** (7 exercises)
- Overhead Press, Dumbbell Shoulder Press, Lateral Raises, Front Raises, Rear Delt Flyes, Upright Row, Arnold Press

**Arms** (8 exercises)
- Barbell Curl, Dumbbell Curl, Hammer Curl, Preacher Curl, Tricep Pushdown, Overhead Tricep Extension, Dips, Close-Grip Bench Press

**Core** (6 exercises)
- Plank, Side Plank, Crunches, Russian Twists, Hanging Leg Raises, Cable Crunches

**Cardio** (2 types)
- Treadmill, Stationary Bike

---

## Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | Dec 18, 2025 | Product Team | Initial draft |
| 1.1 | Dec 18, 2025 | Product Team | Added cardio tracking, testing strategy, deployment details |

---

**End of Product Requirements Document**
