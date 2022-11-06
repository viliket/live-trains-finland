import { useEffect, useRef } from 'react';

const useAnimationFrame = (callback: FrameRequestCallback) => {
  const requestIdRef = useRef<number>();
  const previousTimeRef = useRef<number>();

  const animate = (time: DOMHighResTimeStamp) => {
    if (previousTimeRef.current !== undefined) {
      const deltaTime = time - previousTimeRef.current;
      callback(deltaTime);
    }
    previousTimeRef.current = time;
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
