import { useCallback, useEffect, useContext, useState } from 'react';
import { ReducerContext } from './reducer';
import { EventRegister } from 'react-native-event-listeners';

const FinalJeopardy = () => {
  const [step, setStep] = useState('CATEGORY');
  const { state } = useContext(ReducerContext);

  const onKeyPressed = useCallback(key => {
    if (key === 'space') {
      setStep('CLUE');
    }
  }, []);

  useEffect(() => {
    EventRegister.rmAll();
    EventRegister.on('keyPressed', onKeyPressed);

    return EventRegister.rmAll;
  }, []);

  return (
    <>
      <ul className="categories" />
      <div className="modal final-jeopardy-modal">
        <div className="content">
          {step === 'CATEGORY' ? (
            state.game.finalJeopardy.category
          ) : (
            state.game.finalJeopardy.text
          )}
        </div>
      </div>
    </>
  )
}

export default FinalJeopardy;
