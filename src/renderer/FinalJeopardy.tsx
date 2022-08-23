import { useCallback, useEffect, useContext, useState } from 'react';

import { ReducerContext } from './reducer';
import useKeyEvent from './useKeyEvent';
import audio from './audio';

const nextStep: { [name: string]: string } = {
  CATEGORY: 'CLUE',
  CLUE: 'ANSWERING',
};

const FinalJeopardy = () => {
  const [step, setStep] = useState('CATEGORY');
  const { state } = useContext(ReducerContext);

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
    if (step === 'CLUE') {
      audio.setup('reveal.wav').play();
    } else if (step === 'ANSWERING') {
      audio.setup('final_jeopardy.wav').play();
      electron.ipc.invoke(
        'discordSend',
        `FINAL JEOPARDY (${state.game.finalJeopardy.category}): ${state.game.finalJeopardy.response}`
      );
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
