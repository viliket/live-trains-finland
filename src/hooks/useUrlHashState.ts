import { SetStateAction, useEffect, useState } from 'react';

export function useUrlHashState(
  hash: string
): [state: boolean, setState: React.Dispatch<SetStateAction<boolean>>] {
  const [state, setState] = useState<boolean>(() =>
    typeof window !== 'undefined' ? window.location.hash === hash : false
  );

  useEffect(() => {
    const onHashChange = () => {
      setState(window.location.hash === hash);
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, [hash]);

  return [
    state,
    (setStateAction) => {
      if (
        (typeof setStateAction === 'boolean' && setStateAction) ||
        (typeof setStateAction === 'function' && setStateAction(state))
      ) {
        window.location.hash = hash;
        setState(true);
      } else if (window.location.hash === hash) {
        window.history.back();
      } else {
        setState(false);
      }
    },
  ];
}
