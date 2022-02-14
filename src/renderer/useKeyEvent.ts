import { useState, useEffect } from 'react';
import { EventRegister } from 'react-native-event-listeners';

const useKeyEvent = (callback) => {
  const [keyListener, setKeyListener] = useState(null);

  useEffect(() => {
    if (keyListener) EventRegister.rm(keyListener);
    setKeyListener(EventRegister.on('keyPressed', callback));
  }, [callback]);

  useEffect(() => {
    return () => {
      if (keyListener) EventRegister.rm(keyListener);
    };
  }, [keyListener]);
};

export default useKeyEvent;
