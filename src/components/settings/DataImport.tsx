import { useState, useRef } from 'react';
import { Upload, AlertCircle, Check, FileJson } from 'lucide-react';
import {
  parseImportFile,
  validateImportFile,
  importData,
  type ValidationResult,
  type ImportResult,
} from '../../lib/dataImport';
import type { ExportData } from '../../lib/dataExport';

type ImportMode = 'merge' | 'replace';

export default function DataImport() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [parsedData, setParsedData] = useState<ExportData | null>(null);
  const [validation, setValidation] = useState<ValidationResult | null>(null);
  const [importMode, setImportMode] = useState<ImportMode>('merge');
  const [isImporting, setIsImporting] = useState(false);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    setParsedData(null);
    setValidation(null);
    setImportResult(null);
    setError(null);

    try {
      const data = await parseImportFile(file);
      const validationResult = validateImportFile(data);
      setValidation(validationResult);

      if (validationResult.valid) {
        setParsedData(data as ExportData);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to parse file');
    }
  };

  const handleImport = async () => {
    if (!parsedData) return;

    setIsImporting(true);
    setError(null);

    try {
      const result = await importData(parsedData, importMode);
      setImportResult(result);

      if (result.success) {
        // Reset state after successful import
        setSelectedFile(null);
        setParsedData(null);
        setValidation(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Import failed');
    } finally {
      setIsImporting(false);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setParsedData(null);
    setValidation(null);
    setImportResult(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div>
      <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        Restore Your Data
      </h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
        Import a previously exported backup file.
      </p>

      {/* File Input */}
      <div className="mb-4">
        <input
          ref={fileInputRef}
          type="file"
          accept=".json,application/json"
          onChange={handleFileSelect}
          className="hidden"
          id="import-file"
        />
        <label
          htmlFor="import-file"
          className="flex items-center justify-center gap-2 w-full py-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:border-primary transition-colors"
        >
          <Upload className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          <span className="text-gray-600 dark:text-gray-400">
            {selectedFile ? selectedFile.name : 'Select backup file'}
          </span>
        </label>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-2">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      {/* Validation Errors */}
      {validation && !validation.valid && (
        <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-sm font-medium text-red-600 dark:text-red-400 mb-1">
            Invalid backup file:
          </p>
          <ul className="text-sm text-red-600 dark:text-red-400 list-disc list-inside">
            {validation.errors.map((err, i) => (
              <li key={i}>{err}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Preview */}
      {validation?.valid && validation.preview && (
        <div className="mb-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div className="flex items-center gap-2 mb-3">
            <FileJson className="w-5 h-5 text-primary" />
            <p className="font-medium text-gray-900 dark:text-white">
              Data Preview
            </p>
          </div>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="text-gray-600 dark:text-gray-400">Workouts:</div>
            <div className="text-gray-900 dark:text-white font-medium">
              {validation.preview.workouts}
            </div>
            <div className="text-gray-600 dark:text-gray-400">Sets:</div>
            <div className="text-gray-900 dark:text-white font-medium">
              {validation.preview.sets}
            </div>
            <div className="text-gray-600 dark:text-gray-400">
              Cardio Sessions:
            </div>
            <div className="text-gray-900 dark:text-white font-medium">
              {validation.preview.cardioSessions}
            </div>
            <div className="text-gray-600 dark:text-gray-400">
              Custom Exercises:
            </div>
            <div className="text-gray-900 dark:text-white font-medium">
              {validation.preview.exercises}
            </div>
          </div>

          {/* Import Mode */}
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Import Mode
            </p>
            <div className="flex gap-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="importMode"
                  value="merge"
                  checked={importMode === 'merge'}
                  onChange={() => setImportMode('merge')}
                  className="text-primary"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Merge
                </span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="importMode"
                  value="replace"
                  checked={importMode === 'replace'}
                  onChange={() => setImportMode('replace')}
                  className="text-primary"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Replace
                </span>
              </label>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {importMode === 'merge'
                ? 'Add imported data to existing data'
                : 'Clear existing data before importing'}
            </p>
          </div>

          {/* Import Button */}
          <div className="mt-4 flex gap-2">
            <button
              type="button"
              onClick={handleReset}
              className="flex-1 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleImport}
              disabled={isImporting}
              className="flex-1 py-2 bg-primary text-white rounded-lg disabled:opacity-50 font-medium"
            >
              {isImporting ? 'Importing...' : 'Import Data'}
            </button>
          </div>
        </div>
      )}

      {/* Success Message */}
      {importResult?.success && (
        <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Check className="w-5 h-5 text-green-500" />
            <p className="font-medium text-green-600 dark:text-green-400">
              Import successful!
            </p>
          </div>
          <p className="text-sm text-green-600 dark:text-green-400">
            Imported {importResult.imported.workouts} workouts,{' '}
            {importResult.imported.sets} sets,{' '}
            {importResult.imported.cardioSessions} cardio sessions
            {importResult.imported.exercises > 0 &&
              `, ${importResult.imported.exercises} custom exercises`}
          </p>
        </div>
      )}
    </div>
  );
}
