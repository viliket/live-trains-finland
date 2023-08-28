import { useEffect, useState } from 'react';

export const useTime = (refreshCycle = 1000) => {
  const [currentTime, setCurrentTime] = useState<Date>();

  useEffect(() => {
    setCurrentTime(new Date());
    const intervalId = setInterval(
      () => setCurrentTime(new Date()),
      refreshCycle
    );

    return () => clearInterval(intervalId);
  }, [refreshCycle]);

  return currentTime;
};
