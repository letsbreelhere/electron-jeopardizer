import { useLocation } from 'react-router-dom';
import { useEffect, useReducer, useState } from 'react';

import { reducer, initialState } from './reducer';
import './App.scss';
import './Scores.scss'

const Board = ({ round, onClueSelect }) => {
  return (
    <ul className="categories">
      {Object.entries(round).map(([category, clues]) => (
        <li key={category}>
          <h1>{category}</h1>
          <ul className="clues">
            {clues.map((clue, i) => (
              <li key={clue.id}>
                {clue.unrevealed ? '-' : (
                  <a onClick={() => onClueSelect(category, i)}>
                    ${clue.value}
                  </a>
                )}
              </li>
            ))}
          </ul>
        </li>
    ))}
    </ul>
  )
};

const ClueModal = ({ clue, onClose }) => (
  <>
    <div className="clue-shroud" onClick={onClose} />
    <div className="clue-modal">
      <div className="clue-text">
        {clue.text}
      </div>
    </div>
  </>
);

const NameEditor = ({ value, onSave }) => {
  const [name, setName] = useState(value);
  const handleKeyDown = e => {
    if (e.key === 'Enter') {
      onSave(name);
    }
  }
  return (
    <input
      autoFocus
      spellCheck={false}
      className="name-edit"
      value={name}
      onKeyDown={handleKeyDown}
      onChange={e => setName(e.target.value)}
      onBlur={() => onSave(name)}
      onFocus={e => e.target.select()}
    />
  )
}

const ScoreDisplay = ({ players, dispatch }) => {
  const [editingName, setEditingName] = useState(null);
  const saveName = (name, i) => {
    dispatch({type: 'CHANGE_NAME', index: i, name})
    setEditingName(null);
  }

  return (
    <div className="score-display">
      {players.map((player, i) => (
        <div key={i} className="player">
          <div onClick={() => !editingName && setEditingName(i)} className="name">
            {editingName === i ? (
              <NameEditor
                value={player.name}
                onSave={name => saveName(name, i)}
              />
            ) : (
              player.name
            )}
          </div>
          <div className="score">
            ${player.score}
          </div>
        </div>
      ))}
    </div>
  )
};

const MainGame = () => {
  const location = useLocation();
  const game = location.state.game;
  const [state, dispatch] = useReducer(reducer, initialState(location.state.playerCount, game));

  if (!game) return null;

  const clue = state.clueIndex !== null && state.game[state.round][state.category][state.clueIndex];

  return (
    <>
      {clue && (
        <ClueModal clue={clue} onClose={() => dispatch({type: 'END_CLUE'})}/>
      )}
      <Board
        round={state.game[state.round]}
        onClueSelect={(category, index) => dispatch({ type: 'SELECT_CLUE', category, index })}
      />
      <ScoreDisplay dispatch={dispatch} players={state.players} />
    </>
  );
};

export default MainGame;
