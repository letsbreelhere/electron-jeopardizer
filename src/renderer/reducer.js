import { createContext } from 'react';

export const initialState = {
  players: [],
  game: null,
  round: 'setup',
  category: null,
  clueIndex: null,
  controlsBoard: 0,
  buzzingIn: null,
  ddClue: null,
  wager: null,
  alreadyAnswered: {},
};

const finishClue = (state) => {
  state.game[state.round][state.category][state.clueIndex].completed = true;
  state.buzzingIn = null;
  state.category = null;
  state.clueIndex = null;
  state.alreadyAnswered = {};
  state.wager = null;

  const allClues = Object.values(state.game[state.round]).flat();
  if (allClues.every((clue) => clue.completed)) {
    if (state.round === 'firstRound') {
      state.round = 'secondRound';
      const minScore = Math.min(...state.players.map((p) => p.score));
      state.controlsBoard = state.players.map((p) => p.score).indexOf(minScore);
    } else {
      state.round = 'finalJeopardy';
      state.controlsBoard = null;
    }
  }
};

export const reducer = (state, action) => {
  let newState = JSON.parse(JSON.stringify(state));
  let clue;

  switch (action.type) {
    case 'SETUP_COMPLETE':
      newState.players = new Array(action.playerCount).fill({}).map((_, i) => ({
        name: `Player ${i + 1}`,
        score: 0,
      }));
      newState.game = action.game;
      newState.round = 'firstRound';
      break;

    case 'SET_SCORE':
      newState.players[action.index].score = action.value;
      break;

    case 'START_WAGER':
      newState.buzzingIn = state.controlsBoard;
      newState.ddClue = { category: action.category, index: action.index };
      break;

    case 'SET_WAGER':
      newState.wager = action.wager;
      newState.category = state.ddClue.category;
      newState.clueIndex = state.ddClue.index;
      newState.ddClue = null;
      break;

    case 'SELECT_CLUE':
      newState.category = action.category;
      newState.clueIndex = action.index;
      break;

    case 'CHANGE_NAME':
      newState.players[action.index].name = action.name;
      break;

    case 'BUZZ_IN':
      if (!state.alreadyAnswered[action.index]) {
        newState.buzzingIn = action.index;
        newState.alreadyAnswered[action.index] = true;
      }
      break;

    case 'WRONG_ANSWER':
      clue = state.game[state.round][state.category][state.clueIndex];
      newState.players[state.buzzingIn].score -= state.wager || clue.value;
      const allPlayersBuzzed =
        Object.keys(state.alreadyAnswered).length === state.players.length;
      if (state.wager || allPlayersBuzzed) {
        finishClue(newState);
      }
      newState.buzzingIn = null;
      break;

    case 'CORRECT_ANSWER':
      clue = state.game[state.round][state.category][state.clueIndex];
      newState.players[state.buzzingIn].score += state.wager || clue.value;
      newState.controlsBoard = state.buzzingIn;
      finishClue(newState);
      break;

    case 'STUMPER':
      finishClue(newState);
      break;

    default:
      throw `Unknown action type ${action.type}`;
  }

  return newState;
};

export const derivedState = (state) => ({
  ...state,
  isBuzzingIn: state.buzzingIn !== null,
  currentPlayer:
    state.buzzingIn !== null
      ? state.players[state.buzzingIn]
      : state.players[state.controlsBoard],
  clue: state.game?.[state.round]?.[state.category]?.[state.clueIndex],
});

export const ReducerContext = createContext({
  state: null,
  dispatch: (...args) =>
    console.warn('Attempted to dispatch before context loaded'),
});
