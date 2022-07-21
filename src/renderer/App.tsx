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

const keysToWatch = [
  'f1',
  'f2',
  'f3',
  'f4',
  'space',
  'escape',
  'tab',
  'y',
  'n',
];

const TitleScreen = () => {
  const navigate = useNavigate();
  const onClick = () => navigate('/setup', { replace: true });

  return (
    <a className="init" onClick={onClick}>
      <img alt="Jeopardy Logo" src={require('./images/jeopardy_logo.svg')} />
      <p>
        Click to continue
      </p>
    </a>
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
            <Route path="/" element={<TitleScreen />} />
            <Route path="/setup" element={<Setup />} />
            <Route path="/game" element={<MainGame />} />
          </Routes>
        </Router>
      </ReducerContext.Provider>
    </>
  );
};

export default App;
