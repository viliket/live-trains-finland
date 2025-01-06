import { useEffect, useRef } from 'react';

const useAnimationFrame = (callback: FrameRequestCallback) => {
  const requestIdRef = useRef<number>(undefined);

  const animate = (time: DOMHighResTimeStamp) => {
    callback(time);
    requestIdRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    requestIdRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestIdRef.current !== undefined) {
        cancelAnimationFrame(requestIdRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};

export default useAnimationFrame;
