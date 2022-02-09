import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './App.css';
import { parse } from 'node-html-parser';
import parseJ from './JarchiveParser';

const Board = ({ round }) => {
  return (
    <ul className="categories">
      {Object.entries(round).map(([category, clues]) => (
        <li>
          <h1>{category}</h1>
          <ul className="clues">
            {clues.map(clue => (
              <li>
              ${clue.value}
              </li>
            ))}
          </ul>
        </li>
    ))}
    </ul>
  )
}

const Startup = () => {
  const [game, setGame] = useState(null);
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
    <Board
      round={game.firstRound}
    />
  );
};

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Startup />} />
      </Routes>
    </Router>
  );
}
