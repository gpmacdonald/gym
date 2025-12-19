import { Header } from '../components/layout';

export default function Home() {
  return (
    <>
      <Header title="Home" />
      <div className="p-4">
        <p className="text-gray-600 dark:text-gray-400">
          Workout logging will go here
        </p>
      </div>
    </>
  );
}
