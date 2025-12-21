import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Home, Progress, Exercises, Settings } from './pages';
import { AppShell } from './components/layout';
import { useTheme } from './lib/theme';

function App() {
  // Apply theme on mount and listen for changes
  useTheme();

  return (
    <HashRouter>
      <AppShell>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/progress" element={<Progress />} />
          <Route path="/exercises" element={<Exercises />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AppShell>
    </HashRouter>
  );
}

export default App;
