import { useEffect, useReducer } from 'react';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import Mousetrap from 'mousetrap';

import { EventRegister } from 'react-native-event-listeners'
import MainGame from './MainGame';
import Setup from './Setup';
import { reducer, initialState, derivedState } from './reducer';
import { ReducerContext } from './reducer';

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
]
export default function App() {
  useEffect(() => {
    keysToWatch.forEach((n) => {
      Mousetrap.bind(`${n}`, () => {
        EventRegister.emit('keyPressed', `${n}`);
      });
    });
  }, []);

  const [state, dispatch] = useReducer(
    reducer,
    initialState
  );

  return (
    <ReducerContext.Provider value={{ state: derivedState(state), dispatch }}>
      <Router>
        <Routes>
          <Route path="/" element={<Setup />} />
          <Route path="/game" element={<MainGame />} />
        </Routes>
      </Router>
    </ReducerContext.Provider>
  );
}
