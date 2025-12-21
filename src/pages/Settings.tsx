import { Header } from '../components/layout';
import { ThemeToggle, DataExport, DataImport } from '../components/settings';

export default function Settings() {
  return (
    <>
      <Header title="Settings" />
      <div className="p-4 space-y-6">
        {/* Appearance Section */}
        <section>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Appearance
          </h2>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <ThemeToggle />
          </div>
        </section>

        {/* Data Management Section */}
        <section>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Data Management
          </h2>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 space-y-6">
            <DataExport />
            <hr className="border-gray-200 dark:border-gray-700" />
            <DataImport />
          </div>
        </section>
      </div>
    </>
  );
}
