import { useNavigate, useLocation, MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './App.scss';
import { parse } from 'node-html-parser';
import parseJ from './JarchiveParser';
import DatePicker from 'react-date-picker';
import moment from 'moment';

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

const Setup = () => {
  const [date, setDate] = useState(new Date());
  const [loadStep, setLoadStep] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const onClick = async () => {
    let game;
    setLoading(true);
    setLoadStep('Getting clues...');
    const formattedDate = moment(date).format('YYYY-MM-DD');
    const savedSetup = await electron.ipc.invoke('loadGameSetup', `${formattedDate}.json`);
    if (savedSetup) {
      console.warn(savedSetup)
      game = savedSetup;
    } else {
      const clueHtml = await electron.ipc.invoke(
        'httpGet',
        `http://www.j-archive.com/search.php?search=date%3A${formattedDate}`
      );
      const img = parse(clueHtml).querySelector('img.game_dynamics')
      if (img) {
        const gameId = img._attrs['src'].replace('chartgame.php?game_id=', '');
        setLoadStep('Getting responses...');
        const responseHtml = await electron.ipc.invoke(
          'httpGet',
          `http://www.j-archive.com/showgameresponses.php?game_id=${gameId}`
        );
        game = await parseJ(clueHtml, responseHtml);
        await electron.ipc.invoke('saveGameSetup', `${formattedDate}.json`, JSON.stringify(game));
      } else {
        setLoadStep("Error getting game. There probably isn't a game for that date.")
        setLoading(false);
      }
    }
    setLoadStep(null);
    setLoading(false);

    await navigate(
      '/game',
      {
        replace: true,
        state: { game }
      }
    )
  }

  return (
    <div className="setup">
      <div className="game-date">
        <h1>Select a game date</h1>
        <DatePicker
          onChange={date => { setDate(date); setLoadStep(null) }}
          value={date}
        />

        <button disabled={loading} onClick={onClick} className="play">
          Let's play!
        </button>

        <div className="load-step">
          {loadStep}
        </div>
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
