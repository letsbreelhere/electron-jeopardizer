import { useContext, useCallback, useEffect, useState } from 'react';
import { ReducerContext } from './reducer';
import useKeyEvent from './useKeyEvent';
import audio from './audio';

const DailyDouble = () => {
  const { state, dispatch } = useContext(ReducerContext);

  // TODO: Older games have different round maxes. This should pull the maximum
  // score for a clue in the current round.
  const maxForRound = state.round === 'firstRound' ? 1000 : 2000;

  const max = Math.max(maxForRound, state.currentPlayer.score);
  const [wager, setWager] = useState(max);
  const [showBanner, setShowBanner] = useState(true);

  const onFinish= wager => dispatch({ type: 'SET_WAGER', wager })

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      if (wager <= max && wager >= 5) onFinish(wager);
    }
  };

  const onKeyPressed = useCallback(
    (key) => {
      if (key === 'space') {
        if (showBanner) {
          setShowBanner(false);
        }
      }
    },
    [setShowBanner, showBanner, wager]
  );
  useKeyEvent(onKeyPressed);

  useEffect(() => {
    audio.setup('daily_double.wav').play();
  }, []);

  return (
    <>
      {showBanner && (
        <div onClick={() => setShowBanner(false)} className="flip-container">
          <img
            className="dd flipper"
            src={require('./images/daily_double.jpg')}
          />
        </div>
      )}
      <div className="shroud" />
      <div className="wager-modal modal">
        <h1>Daily Double!</h1>
        <div className="wager-content">
          What is your wager?
          <div className="input-box">
            <span className="prefix">$</span>
            <input
              autoFocus
              onKeyDown={handleKeyDown}
              type="numeric"
              value={wager}
              onChange={(e) => setWager(Number(e.target.value))}
              onFocus={(e) => e.target.select()}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default DailyDouble;
