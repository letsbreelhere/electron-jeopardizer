export const initialState = (playerCount, game) => ({
  players: (new Array(playerCount).fill({})).map((_, i) => ({
    name: `Player ${i+1}`,
    score: 0
  })),
  game,
  round: 'firstRound',
  category: null,
  clueIndex: null,
  buzzingIn: null,
});

export const reducer = (state, action) => {
  let newState = JSON.parse(JSON.stringify(state));
  let clue;

  switch (action.type) {
    case 'SET_SCORE':
      newState.players[action.index].score = action.value;
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
      clue = state.game[state.round][state.category][state.clueIndex].value;
      newState.players[state.buzzingIn].score -= action.wager || clue.value;
      if (action.wager) {
        newState.clueIndex = null;
        newState.game[state.round][state.category][state.clueIndex].completed = true;
      }
      newState.buzzingIn = null;
      break;

    case 'CORRECT_ANSWER':
      clue = state.game[state.round][state.category][state.clueIndex].value;
      newState.players[state.buzzingIn].score += action.wager || clue.value;
      newState.game[state.round][state.category][state.clueIndex].completed = true;
      newState.buzzingIn = null;
      newState.clueIndex = null;
      break;

    case 'END_CLUE':
      newState.buzzingIn = null;
      newState.clueIndex = null;
      newState.game[state.round][state.category][state.clueIndex].completed = true;
      break;

    default:
      throw `Unknown action type ${action.type}`;
  }

  return newState;
}
