import { useLocation } from 'react-router-dom';
import { useState } from 'react';

import './App.scss';
import './Scores.scss'

const Board = ({ round, onPickClue }) => {
  return (
    <ul className="categories">
      {Object.entries(round).map(([category, clues]) => (
        <li key={category}>
          <h1>{category}</h1>
          <ul className="clues">
            {clues.map(clue => (
              <li key={clue.id}>
                <a onClick={() => onPickClue(clue)}>
                  ${clue.value}
                </a>
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

const ScoreDisplay = ({ scores }) => {
  const [names, setNames] = useState(scores.map((_, i) => `Player ${i+1}`));
  const [editingName, setEditingName] = useState(null);
  const saveName = (name, i) => {
    const newNames = names;
    names[i] = name || `Player ${i+1}`;
    setNames(newNames);
    setEditingName(null);
  }

  return (
    <div className="score-display">
      {scores.map((score, i) => (
        <div key={i} className="player">
          <div onClick={() => !editingName && setEditingName(i)} className="name">
            {editingName === i ? (
              <NameEditor
                value={names[i]}
                onSave={name => saveName(name, i)}
              />
            ) : (
              names[i]
            )}
          </div>
          <div className="score">
            ${score}
          </div>
        </div>
      ))}
    </div>
  )
};

const MainGame = () => {
  const location = useLocation();
  const game = location.state.game;
  const [clue, setClue] = useState(null);
  const [scores, setScores] = useState(new Array(location.state.playerCount).fill(0));

  if (!game) return null;

  return (
    <>
      {clue && (
        <ClueModal clue={clue} onClose={() => setClue(null)}/>
      )}
      <Board
        round={game.firstRound}
        onPickClue={setClue}
      />
      <ScoreDisplay scores={scores} />
    </>
  );
};

export default MainGame;
