import { useState } from 'react';
import { Download, Check } from 'lucide-react';
import { exportAllData, downloadAsJson } from '../../lib/dataExport';

export default function DataExport() {
  const [isExporting, setIsExporting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    setSuccess(false);

    try {
      const data = await exportAllData();
      downloadAsJson(data);
      setSuccess(true);
      // Hide success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div>
      <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        Backup Your Data
      </h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
        Export all your workouts, cardio sessions, and settings to a JSON file.
      </p>
      <button
        type="button"
        onClick={handleExport}
        disabled={isExporting}
        className="w-full flex items-center justify-center gap-2 py-3 bg-primary text-white rounded-lg disabled:opacity-50 font-medium"
      >
        <Download className="w-5 h-5" />
        {isExporting ? 'Exporting...' : 'Export All Data'}
      </button>
      {success && (
        <p className="text-sm text-green-600 dark:text-green-400 mt-2 flex items-center gap-1">
          <Check className="w-4 h-4" />
          Data exported successfully
        </p>
      )}
    </div>
  );
}
