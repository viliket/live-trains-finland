import { useEffect, useState } from 'react';

export const useTime = (refreshCycle = 1000) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const intervalId = setInterval(
      () => setCurrentTime(new Date()),
      refreshCycle
    );

    return () => clearInterval(intervalId);
  }, [refreshCycle]);

  return currentTime;
};
