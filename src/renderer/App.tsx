import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';

import MainGame from './MainGame';
import Setup from './Setup';
import Mousetrap from 'mousetrap';
Mousetrap.bind('a', () => console.log('a'))

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Setup />} />
        <Route path="/game" element={<MainGame />} />
      </Routes>
    </Router>
  );
};
