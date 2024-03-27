import { useEffect, useState } from 'react';

import { useRouter } from 'next/router';
import {
  Options,
  useQueryState,
  UseQueryStateOptions,
  UseQueryStateReturn,
} from 'nuqs';

/**
 * Wrapper for nuqs useQueryState that handles the issue where source page is
 * rerendered on navigating to another page with different query state.

 * @see https://github.com/47ng/nuqs/issues/524
 */
export default function useSafeQueryState<T>(
  key: string,
  options: Pick<UseQueryStateOptions<string>, keyof Options>
): UseQueryStateReturn<string, undefined> {
  const [state, setState] = useQueryState(key, options);
  const [safeState, setSafeState] = useState(state);
  const [pathname, setPathname] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Set pathname on mount
    setPathname(router.pathname);
  }, [router.pathname]);

  useEffect(() => {
    function onRouteChangeStart(url: string) {
      // Clear pathname when starting to navigate to a different page
      if (pathname && !url.startsWith(pathname)) {
        setPathname(null);
      }
    }

    function onRouteChangeComplete() {
      // Set pathname after we have finished navigating to a different page
      setPathname(router.pathname);
    }

    router.events.on('routeChangeStart', onRouteChangeStart);
    router.events.on('routeChangeComplete', onRouteChangeComplete);

    return () => {
      router.events.off('routeChangeStart', onRouteChangeStart);
      router.events.off('routeChangeComplete', onRouteChangeComplete);
    };
  }, [pathname, router.events, router.pathname]);

  useEffect(() => {
    if (
      router.pathname !== pathname ||
      state === safeState ||
      JSON.stringify(state) === JSON.stringify(safeState)
    ) {
      return;
    }

    setSafeState(state);
  }, [pathname, router.pathname, safeState, state]);

  return [safeState, setState];
}
