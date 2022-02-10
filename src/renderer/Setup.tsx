import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { parse } from 'node-html-parser';
import DatePicker from 'react-date-picker';
import moment from 'moment';

import parseJ from './JarchiveParser';

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
};

export default Setup;
