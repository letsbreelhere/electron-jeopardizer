import { useLocation } from 'react-router-dom';
import {
  useContext,
  useCallback,
  useEffect,
  useMemo,
  createContext,
  useReducer,
  useState,
} from 'react';
import classNames from 'classnames';
import { EventRegister } from 'react-native-event-listeners';

import { EventRegister } from 'react-native-event-listeners';
import { reducer, initialState, derivedState } from './reducer';
import './App.scss';
import './Scores.scss';

const ReducerContext = createContext({
  state: null,
  dispatch: (...args) =>
    console.warn('Attempted to dispatch before context loaded'),
});

const Board = ({ round, onClueSelect }) => {
  const { state } = useContext(ReducerContext);
  return (
    <ul className="categories">
      {Object.entries(round).map(([category, clues]) => (
        <li key={category}>
          <h1 className={classNames({ selected: state.category === category })}>
            {category}
          </h1>
          <ul className="clues">
            {clues.map((clue, i) => (
              <li key={clue.id}>
                {!clue.unrevealed && (
                  <a onClick={() => onClueSelect(category, i)}>${clue.value}</a>
                )}
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ul>
  );
};

const ClueModal = ({ clue, onClose }) => {
  const [awaitingBuzz, setAwaitingBuzz] = useState(false);
  const [keyListener, setKeyListener] = useState(null);
  const { state, dispatch } = useContext(ReducerContext);

  const onKeyPressed = useCallback(
    (key) => {
      if (key === 'escape') {
        dispatch({ type: 'STUMPER' });
        return;
      }

      if (!state.isBuzzingIn) {
        const buzzingIn = Number(key);
        if (buzzingIn > 0 && buzzingIn <= state.players.length) {
          dispatch({ type: 'BUZZ_IN', index: Number(key) - 1 });
        }
      } else {
        switch (key) {
          case 'y':
            dispatch({ type: 'CORRECT_ANSWER' });
            break;
          case 'n':
            dispatch({ type: 'WRONG_ANSWER' });
            break;
        }
      }
    },
    [state]
  );

  useEffect(() => {
    // HACK: Ideally we should be able to remove just the previous state's
    // listener.
    EventRegister.rmAll();

    EventRegister.on('keyPressed', onKeyPressed)
  }, [onKeyPressed]);

  return (
    <>
      <div className="clue-shroud" onClick={onClose} />
      <div className="clue-modal">
        <div className="clue-text">{clue.text}</div>
      </div>
    </>
  );
};

const NameEditor = ({ value, onSave }) => {
  const [name, setName] = useState(value);
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      onSave(name);
    }
  };
  return (
    <input
      autoFocus
      spellCheck={false}
      className="name-edit"
      value={name}
      onKeyDown={handleKeyDown}
      onChange={(e) => setName(e.target.value)}
      onBlur={() => onSave(name)}
      onFocus={(e) => e.target.select()}
    />
  );
};

const ScoreDisplay = () => {
  const [editingName, setEditingName] = useState(null);
  const { state, dispatch } = useContext(ReducerContext);

  const saveName = (name, i) => {
    dispatch({ type: 'CHANGE_NAME', index: i, name });
    setEditingName(null);
  };
  const players = state.players;

  return (
    <div className="score-display">
      {players.map((player, i) => (
        <div
          key={i}
          className={classNames('player', { active: state.buzzingIn === i })}
        >
          <div
            onClick={() => !editingName && setEditingName(i)}
            className="name"
          >
            {editingName === i ? (
              <NameEditor
                value={player.name}
                onSave={(name) => saveName(name, i)}
              />
            ) : (
              player.name
            )}
          </div>
          <div className="score">${player.score}</div>
        </div>
      ))}
    </div>
  );
};

const MainGame = () => {
  const location = useLocation();
  const game = location.state.game;
  const [state, dispatch] = useReducer(
    reducer,
    initialState(location.state.playerCount, game)
  );

  if (!game) return null;

  const clue =
    state.clueIndex !== null &&
    state.game[state.round][state.category][state.clueIndex];

  return (
    <ReducerContext.Provider value={{ state: derivedState(state), dispatch }}>
      {clue && (
        <ClueModal clue={clue} onClose={() => dispatch({ type: 'END_CLUE' })} />
      )}
      <Board
        round={state.game[state.round]}
        onClueSelect={(category, index) =>
          dispatch({ type: 'SELECT_CLUE', category, index })
        }
      />
      <ScoreDisplay />
    </ReducerContext.Provider>
  );
};

export default MainGame;
