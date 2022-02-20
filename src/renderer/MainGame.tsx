import { useLocation } from 'react-router-dom';
import { useContext, useCallback, useEffect, useState } from 'react';
import classNames from 'classnames';

import { ReducerContext } from './reducer';
import FinalJeopardy from './FinalJeopardy';
import useKeyEvent from './useKeyEvent';
import audio from './audio';

import './App.scss';
import './Scores.scss';

const Board = ({ round, onClueSelect }) => {
  const { state } = useContext(ReducerContext);

  useEffect(() => {
    audio.play('board.wav');
  }, [state.round]);

  return (
    <ul className="categories">
      {Object.entries(round).map(([category, clues]) => (
        <li key={category}>
          <h1 className={classNames({ selected: state.category === category })}>
            {category}
          </h1>
          <ul className="clues">
            {clues.map((clue, i) => (
              <li key={clue.id}>
                {!clue.completed && (
                  <a
                    className="clue-link"
                    onClick={() => onClueSelect(category, i)}
                  >
                    ${clue.value}
                  </a>
                )}
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ul>
  );
};

const ClueModal = ({ clue, onClose }) => {
  const [awaitingBuzz, setAwaitingBuzz] = useState(false);
  const [keyListener, setKeyListener] = useState(null);
  const { state, dispatch } = useContext(ReducerContext);

  useEffect(() => {
    electron.ipc.invoke(
      'discordSend',
      `${state.category} for $${state.wager || clue.value}: ${clue.response}`
    );
  }, [state, clue]);

  const onKeyPressed = useCallback(
    (key) => {
      if (key === 'escape') {
        dispatch({ type: 'STUMPER' });
        return;
      }

      if (!state.isBuzzingIn && key.match(/^f\d$/)) {
        const buzzingIn = Number(key.match(/\d/)[0]);
        if (buzzingIn <= state.players.length) {
          dispatch({ type: 'BUZZ_IN', index: buzzingIn - 1 });
        }
      } else {
        switch (key) {
          case 'y':
            dispatch({ type: 'CORRECT_ANSWER' });
            break;
          case 'n':
            dispatch({ type: 'WRONG_ANSWER' });
            break;
          default:
            break;
        }
      }
    },
    [state, dispatch]
  );
  useKeyEvent(onKeyPressed);

  return (
    <>
      <div className="shroud" onClick={onClose} />
      <div className="clue-modal modal">
        <div className="clue-text">{clue.text}</div>
      </div>
    </>
  );
};

const NameEditor = ({ value, onSave }) => {
  const [name, setName] = useState(value);
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      onSave(name);
    }
  };
  return (
    <input
      autoFocus
      spellCheck={false}
      className="name-edit"
      value={name}
      onKeyDown={handleKeyDown}
      onChange={(e) => setName(e.target.value)}
      onBlur={() => onSave(name)}
      onFocus={(e) => e.target.select()}
    />
  );
};

const ScoreDisplay = () => {
  const [editingName, setEditingName] = useState(null);
  const { state, dispatch } = useContext(ReducerContext);

  const saveName = (name, i) => {
    dispatch({ type: 'CHANGE_NAME', index: i, name });
    setEditingName(null);
  };
  const players = state.players;

  return (
    <div className="score-display">
      {players.map((player, i) => (
        <div
          key={i}
          className={classNames('player', {
            active:
              state.buzzingIn === i ||
              (!state.isBuzzingIn && !state.clue && state.controlsBoard === i),
          })}
        >
          <div
            onClick={() => !editingName && setEditingName(i)}
            className="name"
          >
            {editingName === i ? (
              <NameEditor
                value={player.name}
                onSave={(name) => saveName(name, i)}
              />
            ) : (
              player.name
            )}
          </div>
          <div className="score">${player.score}</div>
        </div>
      ))}
    </div>
  );
};

const WagerModal = ({ onFinish }) => {
  const { state, dispatch } = useContext(ReducerContext);

  // TODO: Older games have different round maxes. This should pull the maximum
  // score for a clue in the current round.
  const maxForRound = state.round === 'firstRound' ? 1000 : 2000;

  const max = Math.max(maxForRound, state.currentPlayer.score);
  const [wager, setWager] = useState(max);
  const [showBanner, setShowBanner] = useState(true);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      if (wager <= max && wager >= 5) onFinish(wager);
    }
  };

  const onKeyPressed = useCallback(
    (key) => {
      if (key === 'space') setShowBanner(false);
    },
    [setShowBanner]
  );
  useKeyEvent(onKeyPressed);

  useEffect(() => {
    audio.play('daily_double.wav');
  }, [])

  return (
    <>
      { showBanner && (
        <div className="flip-container">
          <img className="dd flipper" src={require('./images/daily_double.jpg')} />
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

const MainGame = () => {
  const { state, dispatch } = useContext(ReducerContext);

  return (
    <>
      {state.ddClue && (
        <WagerModal
          onFinish={(wager) => dispatch({ type: 'SET_WAGER', wager })}
        />
      )}
      {state.clue && (
        <ClueModal
          clue={state.clue}
          onClose={() => dispatch({ type: 'STUMPER' })}
        />
      )}
      {state.round === 'finalJeopardy' ? (
        <FinalJeopardy />
      ) : (
        <Board
          round={state.game[state.round]}
          onClueSelect={(category, index) => {
            if (state.game[state.round][category][index].dailyDouble) {
              dispatch({ type: 'START_WAGER', category, index });
            } else {
              dispatch({ type: 'SELECT_CLUE', category, index });
            }
          }}
        />
      )}
      <ScoreDisplay />
    </>
  );
};

export default MainGame;
