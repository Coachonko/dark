import { createBrowserEnv } from '@test-utils';

import { component } from '../component';
import { useSyncExternalStore } from './use-sync-external-store';

let { render } = createBrowserEnv();

beforeEach(() => {
  ({ render } = createBrowserEnv());
});

function createStore<T>(initialState: T) {
  let state = initialState;
  const listeners = new Set<() => void>();

  const getState = () => state;

  const setState = (fn: (prevState: T) => T) => {
    state = fn(state);
    listeners.forEach(fn => fn());
  };

  const subscribe = (listener: () => void) => {
    listeners.add(listener);

    return () => {
      listeners.delete(listener);
    };
  };

  return { getState, setState, subscribe };
}

describe('@core/use-sync-external-store', () => {
  test('works correctly', () => {
    const store = createStore(0);
    let state: number;

    const App = component(() => {
      state = useSyncExternalStore(store.subscribe, store.getState);

      return null;
    });

    render(<App />);
    expect(state).toBe(store.getState());
    expect(state).toBe(0);

    store.setState(x => x + 1);
    expect(state).toBe(store.getState());
    expect(state).toBe(1);

    store.setState(x => x + 1);
    expect(state).toBe(store.getState());
    expect(state).toBe(2);
  });
});
