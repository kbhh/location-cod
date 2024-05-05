import React, { useState, useCallback } from 'react';
import BackgroundTimer from 'react-native-background-timer';

export default function useTimmer() {
  const [time, setTime] = useState(0);

  const start = useCallback(() => {
    BackgroundTimer.runBackgroundTimer(() => {
      setTime((prevTime) => prevTime + 3);
    }, 3000);
  }, []);

  const stop = () => {
    BackgroundTimer.stopBackgroundTimer();
  };

  return { time, start };
}
