import { Trophy } from 'lucide-react';

interface PRBadgeProps {
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

const sizeClasses = {
  sm: 'w-3 h-3',
  md: 'w-4 h-4',
  lg: 'w-5 h-5',
};

export default function PRBadge({ size = 'md', showLabel = false }: PRBadgeProps) {
  return (
    <span className="inline-flex items-center gap-1 text-yellow-500">
      <Trophy className={sizeClasses[size]} />
      {showLabel && (
        <span className="text-xs font-semibold uppercase tracking-wider">PR</span>
      )}
    </span>
  );
}
