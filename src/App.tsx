import { useState } from 'react';

function App() {
  const [isDark, setIsDark] = useState(false);

  return (
    <div
      className={`min-h-screen p-8 ${isDark ? 'dark bg-background-dark text-text-dark' : 'bg-background text-text'}`}
    >
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold mb-4 text-primary">
          Fitness Tracker
        </h1>

        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Tailwind CSS v4 is configured and working!
        </p>

        {/* Test custom primary color */}
        <button
          onClick={() => setIsDark(!isDark)}
          className="bg-primary text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
        >
          Toggle {isDark ? 'Light' : 'Dark'} Mode
        </button>

        {/* Test semantic colors */}
        <div className="mt-6 space-y-2">
          <div className="p-3 bg-success/10 text-success rounded">
            Success message
          </div>
          <div className="p-3 bg-warning/10 text-warning rounded">
            Warning message
          </div>
          <div className="p-3 bg-error/10 text-error rounded">
            Error message
          </div>
          <div className="p-3 bg-info/10 text-info rounded">Info message</div>
        </div>

        {/* Test surface color */}
        <div className="mt-6 p-4 bg-surface rounded-lg border border-border">
          <p className="text-sm">This is a surface card with border</p>
        </div>
      </div>
    </div>
  );
}

export default App;
