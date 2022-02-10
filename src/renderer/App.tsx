import { useLocation, MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import { useState } from 'react';

import Setup from './Setup';

import parseJ from './JarchiveParser';
import './App.scss';

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
}

const ClueModal = ({ clue, onClose }) => (
  <>
    <div className="clue-shroud" onClick={onClose} />
    <div className="clue-modal">
      <div className="clue-text">
        {clue.text}
      </div>
    </div>
  </>
)

const ScoreDisplay = () => (
  <div className="score-display">
  </div>
)

const MainGame = () => {
  const location = useLocation();
  const game = location.state.game;
  const [clue, setClue] = useState(null);

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
      <ScoreDisplay />
    </>
  );
};

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Setup />} />
        <Route path="/game" element={<MainGame />} />
      </Routes>
    </Router>
  );
}
