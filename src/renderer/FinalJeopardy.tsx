import { useCallback, useEffect, useContext, useState } from 'react';

import { ReducerContext } from './reducer';
import useKeyEvent from './useKeyEvent';


const FinalJeopardy = () => {
  const [step, setStep] = useState('CATEGORY');
  const { state } = useContext(ReducerContext);

  const onKeyPressed = useCallback((key) => {
    if (key === 'space') {
      setStep('CLUE');
    }
  }, []);
  useKeyEvent(onKeyPressed);

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
