export const initialState = (playerCount, game) => ({
  players: (new Array(playerCount)).map((_, i) => ({
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
  let newState = state;

  switch (action.type) {
    case 'SET_SCORE':
      state.players[action.index].score = action.value;
      break;

    case 'CHANGE_NAME':
      state.players[action.index].name = action.name;
      break;

    case 'BUZZ_IN':
      state.buzzingIn = action.index;
      break;

    case 'WRONG_ANSWER':
      const clue = state.game[state.round][state.category][state.clueIndex].value;
      state.players[state.buzzingIn].score -= action.wager || clue.value;
      if (action.wager) {
        state.game[state.round][state.category][state.clueIndex].completed = true;
      }
      state.buzzingIn = null;
      break;

    case 'CORRECT_ANSWER':
      const clue = state.game[state.round][state.category][state.clueIndex].value;
      state.players[state.buzzingIn].score += action.wager || clue.value;
      state.game[state.round][state.category][state.clueIndex].completed = true;
      state.buzzingIn = null;
      break;

    case 'END_CLUE':
      state.game[state.round][state.category][state.clueIndex].completed = true;
      break;

    default:
      throw `Unknown action type ${action.type}`;
  }
}
