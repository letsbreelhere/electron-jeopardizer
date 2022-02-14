import { useEffect, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { parse } from 'node-html-parser';
import DatePicker from 'react-date-picker';
import moment from 'moment';

import './Setup.scss';
import parseJ from './JarchiveParser';
import { ReducerContext } from './reducer';

const Setup = () => {
  const [date, setDate] = useState(new Date());
  const [loadStep, setLoadStep] = useState(null);
  const [loading, setLoading] = useState(false);
  const [playerCount, setPlayerCount] = useState(3);
  const navigate = useNavigate();
  const { state, dispatch } = useContext(ReducerContext);

  useEffect(() => {
    new Audio('static://../../assets/sounds/intro.wav').play();
  }, []);

  const onClick = async () => {
    let game;
    setLoading(true);
    setLoadStep('Getting clues...');
    const formattedDate = moment(date).format('YYYY-MM-DD');
    const savedSetup = await electron.ipc.invoke(
      'loadGameSetup',
      `${formattedDate}.json`
    );
    if (savedSetup) {
      game = savedSetup;
    } else {
      const clueHtml = await electron.ipc.invoke(
        'httpGet',
        `http://www.j-archive.com/search.php?search=date%3A${formattedDate}`
      );
      const img = parse(clueHtml).querySelector('img.game_dynamics');
      if (img) {
        const gameId = img._attrs['src'].replace('chartgame.php?game_id=', '');
        setLoadStep('Getting responses...');
        const responseHtml = await electron.ipc.invoke(
          'httpGet',
          `http://www.j-archive.com/showgameresponses.php?game_id=${gameId}`
        );
        game = await parseJ(clueHtml, responseHtml);
        await electron.ipc.invoke(
          'saveGameSetup',
          `${formattedDate}.json`,
          JSON.stringify(game)
        );
      } else {
        setLoadStep(
          "Error getting game. There probably isn't a game for that date."
        );
        setLoading(false);
        return;
      }
    }

    setLoadStep(null);
    setLoading(false);

    await dispatch({
      type: 'SETUP_COMPLETE',
      playerCount,
      game,
    });

    await navigate('/game', { replace: true });
  };

  return (
    <div className="setup">
      <div className="game-date">
        <DatePicker
          onChange={(date) => {
            setDate(date);
            setLoadStep(null);
          }}
          value={date}
          clearIcon={null}
          calendarIcon={null}
        />
        <div className="player-count">
          <label># of players</label>
          <div className="counter">
            <button
              type="button"
              className="dec"
              onClick={() => playerCount > 1 && setPlayerCount(playerCount - 1)}
            >
              –
            </button>
            <input
              min={1}
              max={10}
              type="number"
              value={playerCount}
              onChange={(e) => setPlayerCount(Number(e.target.value))}
            />
            <button
              type="button"
              className="inc"
              onClick={() =>
                playerCount < 10 && setPlayerCount(playerCount + 1)
              }
            >
              +
            </button>
          </div>
        </div>

        <button disabled={loading} onClick={onClick} className="play">
          Let's play!
        </button>

        <div className="load-step">{loadStep}</div>
      </div>
    </div>
  );
};

export default Setup;
