import { createBrowserEnv } from '@test-utils';

import { component } from '../component';
import { type MutableRef, useRef } from './ref';

let { render } = createBrowserEnv();

beforeEach(() => {
  ({ render } = createBrowserEnv());
});

describe('@core/ref', () => {
  test('component ref is not available without forwarding', () => {
    let ref: MutableRef<HTMLDivElement> = null;

    const Child = component(() => {
      return <div />;
    });

    const App = component(() => {
      ref = useRef(null);

      return <Child ref={ref} />;
    });

    render(<App />);
    expect(ref.current).toBeFalsy();
  });

  test('can forward ref', () => {
    let ref: MutableRef<HTMLDivElement> = null;

    const Child = component<{ ref?: MutableRef<HTMLDivElement> }>(({ ref }) => <div ref={ref} />);

    const App = component(() => {
      ref = useRef(null);

      return <Child ref={ref} />;
    });

    render(<App />);
    expect(ref.current).toBeTruthy();
    expect(ref.current instanceof HTMLDivElement).toBeTruthy();
  });

  test('can store ref correctly', () => {
    let ref: MutableRef<HTMLDivElement> = null;

    const App = component(() => {
      ref = useRef(null);

      return <div ref={ref} />;
    });

    render(<App />);
    expect(ref.current).toBeTruthy();
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});
