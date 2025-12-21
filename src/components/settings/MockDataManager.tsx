import { useState, useEffect } from 'react';
import { Database, Trash2, Loader2 } from 'lucide-react';
import { seedMockData, clearMockData, hasMockData } from '../../lib/seed';
import { ConfirmDialog } from '../common';

export default function MockDataManager() {
  const [hasData, setHasData] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSeeding, setIsSeeding] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    checkMockData();
  }, []);

  async function checkMockData() {
    setIsLoading(true);
    try {
      const result = await hasMockData();
      setHasData(result);
    } catch (error) {
      console.error('Failed to check mock data:', error);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSeedData() {
    setIsSeeding(true);
    setMessage(null);
    try {
      const result = await seedMockData();
      setMessage({
        type: 'success',
        text: `Created ${result.workouts} workouts with ${result.sets} sets and ${result.cardioSessions} cardio sessions`,
      });
      setHasData(true);
    } catch (error) {
      setMessage({
        type: 'error',
        text: 'Failed to seed mock data',
      });
      console.error(error);
    } finally {
      setIsSeeding(false);
    }
  }

  async function handleClearData() {
    setIsClearing(true);
    setMessage(null);
    try {
      await clearMockData();
      setMessage({
        type: 'success',
        text: 'Mock data cleared successfully',
      });
      setHasData(false);
      setShowClearConfirm(false);
    } catch (error) {
      setMessage({
        type: 'error',
        text: 'Failed to clear mock data',
      });
      console.error(error);
    } finally {
      setIsClearing(false);
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
        <Loader2 className="w-4 h-4 animate-spin" />
        <span>Checking mock data...</span>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-medium text-gray-900 dark:text-white">Mock Data</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {hasData
              ? 'Sample workout data is loaded'
              : 'Generate sample data for testing'}
          </p>
        </div>
        {hasData ? (
          <button
            type="button"
            onClick={() => setShowClearConfirm(true)}
            disabled={isClearing}
            className="flex items-center gap-2 px-4 py-2 text-red-600 dark:text-red-400 border border-red-300 dark:border-red-600 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors disabled:opacity-50"
          >
            {isClearing ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Trash2 className="w-4 h-4" />
            )}
            Clear
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSeedData}
            disabled={isSeeding}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {isSeeding ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Database className="w-4 h-4" />
            )}
            {isSeeding ? 'Generating...' : 'Generate'}
          </button>
        )}
      </div>

      {message && (
        <p
          className={`text-sm ${
            message.type === 'success'
              ? 'text-green-600 dark:text-green-400'
              : 'text-red-600 dark:text-red-400'
          }`}
        >
          {message.text}
        </p>
      )}

      {showClearConfirm && (
        <ConfirmDialog
          title="Clear Mock Data?"
          message="This will delete all workout and cardio session data. Your custom exercises will be kept. This action cannot be undone."
          confirmLabel="Clear Data"
          variant="danger"
          isLoading={isClearing}
          onConfirm={handleClearData}
          onCancel={() => setShowClearConfirm(false)}
        />
      )}
    </div>
  );
}
