import { createContext } from 'react';

export const initialState = {
  players: null,
  game: null,
  round: 'setup',
  category: null,
  clueIndex: null,
  controlsBoard: 0,
  buzzingIn: null,
  ddClue: null,
  wager: null,
};

const finishClue = state => {
  state.game[state.round][state.category][state.clueIndex].completed = true;
  state.buzzingIn = null;
  state.category = null;
  state.clueIndex = null;

  const allClues = Object.values(state.game[state.round]).flat();
  if (allClues.every(clue => clue.completed)) {
    if (state.round === 'firstRound') {
      state.round = 'secondRound';
    } else {
      state.round = 'finalJeopardy';
    }
  }
}

export const reducer = (state, action) => {
  let newState = JSON.parse(JSON.stringify(state));
  let clue;

  switch (action.type) {
    case 'SETUP_COMPLETE':
      newState.players = (new Array(action.playerCount).fill({})).map((_, i) => ({
        name: `Player ${i+1}`,
        score: 0
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
      newState.buzzingIn = action.index;
      break;

    case 'WRONG_ANSWER':
      clue = state.game[state.round][state.category][state.clueIndex];
      newState.players[state.buzzingIn].score -= state.wager || clue.value;
      if (state.wager) {
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
}

export const derivedState = state => ({
  ...state,
  isBuzzingIn: state.buzzingIn !== null,
  currentPlayer: (state.buzzingIn !== null) && state.players[state.buzzingIn],
  clue: state.game?.[state.round]?.[state.category]?.[state.clueIndex],
});

export const ReducerContext = createContext({
  state: null,
  dispatch: (...args) =>
    console.warn('Attempted to dispatch before context loaded'),
});
