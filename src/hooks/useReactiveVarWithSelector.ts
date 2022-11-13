import { ReactiveVar } from '@apollo/client';
import { useSyncExternalStoreWithSelector } from 'use-sync-external-store/with-selector';

function useReactiveVarWithSelector<T, Selection>(
  rv: ReactiveVar<T>,
  selector: (state: T) => Selection,
  isEqual?: (a: Selection, b: Selection) => boolean
): Selection {
  const value = useSyncExternalStoreWithSelector(
    (onStoreChange: () => void) => {
      let unsubscribe: () => void;
      const listener = () => {
        // Notify parent listener that the store has changed
        onStoreChange();

        // When variable value is changed, apollo-client notifies all the listeners
        // and then clears all the listeners. Thus, we need to add add a new listener
        // to suscribe to the next variable value change.
        // See https://github.com/apollographql/apollo-client/blob/main/src/cache/inmemory/reactiveVars.ts
        unsubscribe = rv.onNextChange(listener);
      };

      unsubscribe = rv.onNextChange(listener);
      return () => unsubscribe();
    },
    rv,
    undefined,
    selector,
    isEqual
  );

  return value;
}

export default useReactiveVarWithSelector;
