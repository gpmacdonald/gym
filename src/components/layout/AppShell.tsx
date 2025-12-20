import BottomNav from './BottomNav';
import OfflineIndicator from './OfflineIndicator';

interface AppShellProps {
  children: React.ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <OfflineIndicator />
      <main className="pb-20">{children}</main>
      <BottomNav />
    </div>
  );
}
