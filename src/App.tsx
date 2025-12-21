import { lazy, Suspense } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppShell } from './components/layout';
import { useTheme } from './lib/theme';

// Lazy load pages for code splitting
const Home = lazy(() => import('./pages/Home'));
const Progress = lazy(() => import('./pages/Progress'));
const Exercises = lazy(() => import('./pages/Exercises'));
const Settings = lazy(() => import('./pages/Settings'));

// Loading fallback component
function PageLoader() {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

function App() {
  // Apply theme on mount and listen for changes
  useTheme();

  return (
    <HashRouter>
      <AppShell>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/progress" element={<Progress />} />
            <Route path="/exercises" element={<Exercises />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </AppShell>
    </HashRouter>
  );
}

export default App;
