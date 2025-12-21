import { useEffect, useRef } from 'react';
import { AlertTriangle } from 'lucide-react';

interface ConfirmDialogProps {
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'warning';
  isLoading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'danger',
  isLoading = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const cancelButtonRef = useRef<HTMLButtonElement>(null);

  // Focus the cancel button when dialog opens
  useEffect(() => {
    cancelButtonRef.current?.focus();
  }, []);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isLoading) {
        onCancel();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onCancel, isLoading]);

  const confirmButtonClass =
    variant === 'danger'
      ? 'bg-red-500 hover:bg-red-600 text-white'
      : 'bg-yellow-500 hover:bg-yellow-600 text-white';

  const iconClass =
    variant === 'danger'
      ? 'text-red-500 bg-red-100 dark:bg-red-900/30'
      : 'text-yellow-500 bg-yellow-100 dark:bg-yellow-900/30';

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-dialog-title"
      aria-describedby="confirm-dialog-description"
    >
      <div className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-sm overflow-hidden">
        <div className="p-6">
          {/* Icon */}
          <div
            className={`w-12 h-12 rounded-full ${iconClass} flex items-center justify-center mx-auto mb-4`}
            aria-hidden="true"
          >
            <AlertTriangle className="w-6 h-6" />
          </div>

          {/* Title */}
          <h2
            id="confirm-dialog-title"
            className="text-lg font-semibold text-gray-900 dark:text-white text-center mb-2"
          >
            {title}
          </h2>

          {/* Message */}
          <p
            id="confirm-dialog-description"
            className="text-gray-600 dark:text-gray-400 text-center text-sm"
          >
            {message}
          </p>
        </div>

        {/* Actions */}
        <div className="flex border-t border-gray-200 dark:border-gray-700">
          <button
            ref={cancelButtonRef}
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="flex-1 py-3 px-4 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors disabled:opacity-50 min-h-[44px]"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className={`flex-1 py-3 px-4 font-medium transition-colors disabled:opacity-50 min-h-[44px] ${confirmButtonClass}`}
          >
            {isLoading ? 'Deleting...' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
