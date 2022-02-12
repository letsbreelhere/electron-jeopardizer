import { useEffect, useMemo } from 'react';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import Mousetrap from 'mousetrap';

import { EventRegister } from 'react-native-event-listeners'
import MainGame from './MainGame';
import Setup from './Setup';

export default function App() {
  useEffect(() => {
    Mousetrap.bind('1', () => {
      EventRegister.emit('keyPressed', '1');
    });
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Setup />} />
        <Route path="/game" element={<MainGame />} />
      </Routes>
    </Router>
  );
}
