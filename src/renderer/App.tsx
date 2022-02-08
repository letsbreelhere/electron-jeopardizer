import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import './App.css';
import { parse } from 'node-html-parser';
import parseJ from './JarchiveParser';

const Startup = () => {
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
      console.warn(parsed)
    }
    eff();
  }, [])

  return (
    <div>
    </div>
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
