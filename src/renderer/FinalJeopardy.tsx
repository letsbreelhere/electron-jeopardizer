import { useCallback, useEffect, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { ReducerContext } from './reducer';
import useKeyEvent from './useKeyEvent';
import audio from './audio';

const nextStep: { [name: string]: string } = {
  CATEGORY: 'CLUE',
  CLUE: 'ANSWERING',
  ANSWERING: 'DONE',
};

const FinalJeopardy = () => {
  const [step, setStep] = useState('CATEGORY');
  const { state, dispatch } = useContext(ReducerContext);
  const navigate = useNavigate();

  const onKeyPressed = useCallback(
    (key) => {
      if (key === 'space' && nextStep[step]) {
        setStep(nextStep[step]);
      }
    },
    [step]
  );
  useKeyEvent(onKeyPressed);

  useEffect(() => {
    switch (step) {
      case 'CLUE':
        audio.setup('reveal.wav').play();
        break;
      case 'ANSWERING':
        audio.setup('final_jeopardy.wav').play();
        electron.ipc.invoke(
          'discordSend',
          `FINAL JEOPARDY (${state.game.finalJeopardy.category}): ${state.game.finalJeopardy.response}`
        );
        break;
      case 'DONE':
        dispatch({ type: 'NEXT_GAME' });
        navigate('/setup');
        break;
      default:
        break;
    }
  }, [step]);

  return (
    <>
      <ul className="categories" />
      <div className="modal final-jeopardy-modal">
        <div className="content">
          {step === 'CATEGORY'
            ? state.game.finalJeopardy.category
            : state.game.finalJeopardy.text}
        </div>
      </div>
    </>
  );
};

export default FinalJeopardy;
