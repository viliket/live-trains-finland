import { useEffect, useState } from 'react';

export function useUrlHashState(hash: string): boolean {
  const [state, setState] = useState<boolean>(false);

  useEffect(() => {
    const onHashChange = () => {
      setState(window.location.hash === hash);
    };
    window.addEventListener('hashchange', onHashChange);
    setState(window.location.hash === hash);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, [hash]);

  return state;
}
