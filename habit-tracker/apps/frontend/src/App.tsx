import { Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Routes>
      <Route path="/" element={<div>Dashboard placeholder</div>} />
      <Route path="/habits/new" element={<div>Add Habit placeholder</div>} />
      <Route path="/habits/:id" element={<div>Habit Details placeholder</div>} />
      <Route path="/habits/:id/edit" element={<div>Edit Habit placeholder</div>} />
    </Routes>
  );
}

export default App;
