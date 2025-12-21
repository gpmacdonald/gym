import { Header } from '../components/layout';
import { ExerciseList } from '../components/exercises';

export default function Exercises() {
  return (
    <>
      <Header title="Exercise Library" />
      <div className="p-4">
        <ExerciseList />
      </div>
    </>
  );
}
