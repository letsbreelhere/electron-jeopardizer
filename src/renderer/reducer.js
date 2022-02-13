export const initialState = (playerCount, game) => ({
  players: (new Array(playerCount).fill({})).map((_, i) => ({
    name: `Player ${i+1}`,
    score: 0
  })),
  game,
  round: 'firstRound',
  category: null,
  clueIndex: null,
  controlsBoard: 0,
  buzzingIn: null,
  ddClue: null,
  wager: null,
});

const finishClue = state => {
  state.game[state.round][state.category][state.clueIndex].completed = true;
  state.buzzingIn = null;
  state.category = null;
  state.clueIndex = null;
}

export const reducer = (state, action) => {
  let newState = JSON.parse(JSON.stringify(state));
  let clue;

  switch (action.type) {
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
