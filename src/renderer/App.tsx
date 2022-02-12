import { useEffect, useMemo } from 'react';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import Mousetrap from 'mousetrap';

import { KeyEventEmitter, KeyEventContext } from './KeyEvents';
import MainGame from './MainGame';
import Setup from './Setup';

export default function App() {
  const keyEventEmitter = useMemo(() => new KeyEventEmitter(), []);
  useEffect(() => {
    Mousetrap.bind('1', () => {
      keyEventEmitter.emit('keyPressed', '1');
    });
  }, [keyEventEmitter]);

  return (
    <KeyEventContext.Provider value={keyEventEmitter}>
      <Router>
        <Routes>
          <Route path="/" element={<Setup />} />
          <Route path="/game" element={<MainGame />} />
        </Routes>
      </Router>
    </KeyEventContext.Provider>
  );
}
