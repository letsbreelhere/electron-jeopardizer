import { useState, useEffect, useReducer } from 'react';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import Mousetrap from 'mousetrap';

import { EventRegister } from 'react-native-event-listeners';
import Settings from './Settings';
import Setup from './Setup';
import MainGame from './MainGame';
import { reducer, initialState, derivedState } from './reducer';
import { ReducerContext } from './reducer';
import audio from './audio';

const keysToWatch = [
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  'space',
  'escape',
  'y',
  'n',
];

const App = () => {
  useEffect(() => {
    keysToWatch.forEach((n) => {
      Mousetrap.bind(`${n}`, () => {
        EventRegister.emit('keyPressed', `${n}`);
      });
    });
  }, []);

  useEffect(() => {
    electron.ipc.on('openSettings', () => setShowPrefs(true));
  }, []);

  const [state, dispatch] = useReducer(reducer, initialState);
  const [showPrefs, setShowPrefs] = useState(false);

  return (
    <>
      {showPrefs && <Settings onClose={() => setShowPrefs(false)} />}
      <ReducerContext.Provider value={{ state: derivedState(state), dispatch }}>
        <Router>
          <Routes>
            <Route path="/" element={<Setup />} />
            <Route path="/game" element={<MainGame />} />
          </Routes>
        </Router>
      </ReducerContext.Provider>
    </>
  );
};

export default App;
