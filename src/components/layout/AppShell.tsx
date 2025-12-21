import BottomNav from './BottomNav';
import OfflineIndicator from './OfflineIndicator';
import InstallPrompt from './InstallPrompt';

interface AppShellProps {
  children: React.ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Skip to main content link for keyboard users */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-white focus:rounded-lg focus:outline-none"
      >
        Skip to main content
      </a>
      <OfflineIndicator />
      <main id="main-content" className="pb-20" tabIndex={-1}>
        {children}
      </main>
      <BottomNav />
      <InstallPrompt />
    </div>
  );
}
