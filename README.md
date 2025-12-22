# Personal Fitness Tracker PWA

A Progressive Web Application for tracking weightlifting workouts and cardio sessions. Works entirely offline after the first load, stores all data locally on your device, and requires no account or subscription.

## Features

- **Weightlifting Tracking**: Log exercises, sets, reps, and weight
- **Cardio Tracking**: Log treadmill and bike sessions with duration, distance, and more
- **Progress Charts**: Visualize your strength and cardio progress over time
- **Exercise Library**: Pre-populated with common exercises, add your own custom ones
- **Offline-First**: Works without internet after initial load
- **PWA Installable**: Add to home screen for app-like experience
- **Data Privacy**: All data stays on your device
- **Import/Export**: Backup and restore your data anytime

## Tech Stack

- **Framework**: React 19 with TypeScript
- **Styling**: Tailwind CSS 4
- **Database**: IndexedDB via Dexie.js
- **State Management**: Zustand
- **Charts**: Recharts
- **Icons**: Lucide React
- **Build Tool**: Vite 7
- **PWA**: vite-plugin-pwa
- **Testing**: Vitest + React Testing Library + Playwright

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd fitness-tracker

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint |
| `npm run format` | Format code with Prettier |
| `npm test` | Run unit tests |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:coverage` | Run tests with coverage report |
| `npm run test:e2e` | Run Playwright E2E tests |
| `npm run test:e2e:ui` | Run E2E tests with Playwright UI |

## Project Structure

```
src/
├── components/           # React components
│   ├── cardio/          # Cardio logging components
│   ├── charts/          # Progress visualization charts
│   ├── exercises/       # Exercise library components
│   ├── layout/          # App shell, navigation
│   ├── settings/        # Settings page components
│   ├── shared/          # Reusable UI components
│   └── workout/         # Workout logging components
├── lib/                  # Core utilities
│   ├── db.ts            # Dexie database setup
│   ├── queries.ts       # Database query functions
│   ├── seed.ts          # Initial exercise data
│   └── pwa.ts           # PWA utilities
├── pages/               # Route page components
├── stores/              # Zustand state stores
├── types/               # TypeScript type definitions
└── test/                # Test utilities
```

## User Guide

### Logging a Weight Workout

1. From the home screen, tap **Start Weight Workout**
2. Tap **Add Exercise** to select an exercise from the library
3. Enter reps and weight for your first set
4. Tap **Add Set** to log the set
5. Repeat for additional sets or exercises
6. Tap **Save Workout** when finished

### Logging a Cardio Session

1. From the home screen, switch to the **Cardio** tab
2. Tap **Start Cardio Workout**
3. Select your cardio type (Treadmill, Bike, etc.)
4. Enter duration, distance, and other details
5. Tap **Save Session** when finished

### Viewing Progress

Navigate to the **Progress** page to see:
- Strength progress charts for each exercise
- Cardio performance trends
- Personal records (PRs)
- Weekly summaries

### Managing Exercises

Navigate to the **Exercises** page to:
- Browse all available exercises
- Filter by muscle group
- Search for specific exercises
- Add custom exercises

### Data Management

Navigate to **Settings** to:
- Export all your data as a JSON backup file
- Import data from a backup file
- Generate mock data for testing
- Clear all data to start fresh

### Installing as an App

**On iOS Safari:**
1. Tap the Share button
2. Select "Add to Home Screen"
3. Confirm the installation

**On Android Chrome:**
1. Tap the menu (three dots)
2. Select "Add to Home Screen" or "Install App"
3. Confirm the installation

## Testing

### Unit Tests

The project includes comprehensive unit tests for:
- Database queries and operations
- React component behavior
- State management stores
- Utility functions

```bash
npm test                 # Run all tests
npm run test:coverage    # Run with coverage report
```

### E2E Tests

Playwright E2E tests cover critical user flows:
- Smoke tests (navigation, page loads)
- Workout logging flow
- Cardio logging flow
- Data management (export, import, mock data)

```bash
npm run test:e2e         # Run all E2E tests
npm run test:e2e:ui      # Run with Playwright UI
npm run test:e2e:headed  # Run with visible browser
```

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

### Quick Deploy to Netlify

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start)

1. Push your code to GitHub
2. Connect the repository to Netlify
3. Build command: `npm run build`
4. Publish directory: `dist`

## Browser Support

- Chrome/Edge 90+
- Firefox 90+
- Safari 14+ (including iOS)
- Samsung Internet 15+

## Accessibility

The app follows WCAG 2.1 guidelines:
- Semantic HTML structure
- ARIA labels where needed
- Keyboard navigation support
- Focus management
- Color contrast compliance
- Screen reader compatibility

## License

MIT License - see LICENSE file for details.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests (`npm test && npm run test:e2e`)
5. Submit a pull request

---

Built with React, TypeScript, and Tailwind CSS
