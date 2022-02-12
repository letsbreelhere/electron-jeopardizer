import { useLocation } from 'react-router-dom';
import {
  useContext,
  createContext,
  useEffect,
  useReducer,
  useState,
} from 'react';
import classNames from 'classnames';

import { KeyEventContext } from './KeyEvents';
import { reducer, initialState } from './reducer';
import './App.scss';
import './Scores.scss';

const ReducerContext = createContext({
  state: null,
  dispatch: (...args) => console.warn('Attempted to dispatch before context loaded'),
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

const ClueModal = ({ clue, onClose }) => (
  <>
    <div className="clue-shroud" onClick={onClose} />
    <div className="clue-modal">
      <div className="clue-text">{clue.text}</div>
    </div>
  </>
);

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

const ScoreDisplay = ({ players }) => {
  const [editingName, setEditingName] = useState(null);
  const { dispatch } = useContext(ReducerContext);
  const saveName = (name, i) => {
    dispatch({ type: 'CHANGE_NAME', index: i, name });
    setEditingName(null);
  };

  return (
    <div className="score-display">
      {players.map((player, i) => (
        <div key={i} className="player">
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

  const keyEvents = useContext(KeyEventContext);
  keyEvents.on('keyPressed', () => dispatch({ type: 'BUZZ_IN', index: 0 }));

  if (!game) return null;

  const clue =
    state.clueIndex !== null &&
    state.game[state.round][state.category][state.clueIndex];

  return (
    <ReducerContext.Provider value={{ state, dispatch }}>
      {clue && (
        <ClueModal clue={clue} onClose={() => dispatch({ type: 'END_CLUE' })} />
      )}
      <Board
        round={state.game[state.round]}
        onClueSelect={(category, index) =>
          dispatch({ type: 'SELECT_CLUE', category, index })
        }
      />
      <ScoreDisplay players={state.players} />
    </ReducerContext.Provider>
  );
};

export default MainGame;
