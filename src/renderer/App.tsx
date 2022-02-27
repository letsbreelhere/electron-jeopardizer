import { useState, useEffect, useReducer } from 'react';
import {
  useNavigate,
  MemoryRouter as Router,
  Routes,
  Route,
} from 'react-router-dom';
import Mousetrap from 'mousetrap';

import { EventRegister } from 'react-native-event-listeners';
import Settings from './Settings';
import Setup from './Setup';
import MainGame from './MainGame';
import { ReducerContext, reducer, initialState, derivedState } from './reducer';

const keysToWatch = ['f1', 'f2', 'f3', 'f4', 'space', 'escape', 'y', 'n'];

const Init = () => {
  const navigate = useNavigate();
  const onClick = () => navigate('/setup', { replace: true });

  return (
    <div style={{ width: '100vw', height: '100vh' }} onClick={onClick}></div>
  );
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
  const [showPrefs, setShowPrefs] = useState(false);

  useEffect(() => {
    electron.ipc.on('openSettings', () => setShowPrefs(true));
  }, []);

  return (
    <>
      {showPrefs && <Settings onClose={() => setShowPrefs(false)} />}
      <ReducerContext.Provider value={{ state: derivedState(state), dispatch }}>
        <Router>
          <Routes>
            <Route path="/" element={<Init />} />
            <Route path="/setup" element={<Setup />} />
            <Route path="/game" element={<MainGame />} />
          </Routes>
        </Router>
      </ReducerContext.Provider>
    </>
  );
};

export default App;
