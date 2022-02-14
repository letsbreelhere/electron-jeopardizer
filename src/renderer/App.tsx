import { useEffect, useReducer } from 'react';
import {
  MemoryRouter as Router,
  Routes,
  Route,
  useNavigate,
} from 'react-router-dom';
import Mousetrap from 'mousetrap';

import { EventRegister } from 'react-native-event-listeners';
import Settings from './Settings';
import Setup from './Setup';
import MainGame from './MainGame';
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
];

const NavigationListener = () => {
  const navigate = useNavigate();

  useEffect(() => {
    electron.ipc.on('openSettings', () =>
      navigate('/settings', { replace: false })
    );
  }, []);

  return null;
};

const App = () => {
  useEffect(() => {
    keysToWatch.forEach((n) => {
      Mousetrap.bind(`${n}`, () => {
        EventRegister.emit('keyPressed', `${n}`);
      });
    });
  }, []);

  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <ReducerContext.Provider value={{ state: derivedState(state), dispatch }}>
      <Router>
        <NavigationListener />
        <Routes>
          <Route path="/" element={<Setup />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/game" element={<MainGame />} />
        </Routes>
      </Router>
    </ReducerContext.Provider>
  );
};

export default App;
