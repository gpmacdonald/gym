import { WifiOff } from 'lucide-react';
import { useOnlineStatus } from '../../lib/pwa';

export default function OfflineIndicator() {
  const isOnline = useOnlineStatus();

  if (isOnline) {
    return null;
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-amber-500 text-white px-4 py-2 flex items-center justify-center gap-2 text-sm">
      <WifiOff className="w-4 h-4" />
      <span>You're offline - changes will sync when back online</span>
    </div>
  );
}
