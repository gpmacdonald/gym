interface HeaderProps {
  title: string;
  rightAction?: React.ReactNode;
}

export default function Header({ title, rightAction }: HeaderProps) {
  return (
    <header className="sticky top-0 z-10 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 pt-[env(safe-area-inset-top)]">
      <div className="flex items-center justify-between h-14 px-4">
        <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
          {title}
        </h1>
        {rightAction && <div>{rightAction}</div>}
      </div>
    </header>
  );
}
