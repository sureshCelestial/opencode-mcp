import { Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import HabitForm from './pages/HabitForm';
import HabitDetails from './pages/HabitDetails';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/habits/new" element={<HabitForm />} />
      <Route path="/habits/:id" element={<HabitDetails />} />
      <Route path="/habits/:id/edit" element={<HabitForm />} />
    </Routes>
  );
}

export default App;
