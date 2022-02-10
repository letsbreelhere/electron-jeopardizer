import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './App.scss';
import { parse } from 'node-html-parser';
import parseJ from './JarchiveParser';
import DatePicker from 'react-date-picker';

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
  const [game, setGame] = useState(null);
  const [clue, setClue] = useState(null);
  useEffect(() => {
    const eff = async () => {
      const clueHtml = await electron.ipc.invoke(
        'httpGet',
        'http://www.j-archive.com/search.php?search=date%3A2021-01-26'
      );
      const gameId = parse(clueHtml).querySelector('img.game_dynamics')._attrs['src'].replace('chartgame.php?game_id=', '');
      const responseHtml = await electron.ipc.invoke(
        'httpGet',
        `http://www.j-archive.com/showgameresponses.php?game_id=${gameId}`
      );
      const parsed = await parseJ(clueHtml, responseHtml);
      setGame(parsed);
    }
    eff();
  }, [])

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

const Setup = () => {
  const [date, setDate] = useState(new Date());

  return (
    <div className="setup">
      <div className="game-date">
        <h1>Select a game date</h1>
        <DatePicker
          onChange={setDate}
          value={date}
        />

        {date && (
          <button className="play">
            Let's play!
          </button>
        )}
      </div>
    </div>
  )
}

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
