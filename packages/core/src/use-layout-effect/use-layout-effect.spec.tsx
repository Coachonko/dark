import { render } from '@dark-engine/platform-browser';

import { component } from '../component';
import { useUpdate } from '../use-update';
import { useLayoutEffect } from './use-layout-effect';

let host: HTMLElement = null;

beforeEach(() => {
  host = document.createElement('div');
});

describe('@core/use-layout-effect', () => {
  test('runs sync', () => {
    const effectFn = jest.fn();
    const App = component(() => {
      useLayoutEffect(() => effectFn(), []);

      return null;
    });

    render(App(), host);
    expect(effectFn).toBeCalledTimes(1);
  });

  test('fires on mount event', () => {
    const mockFn = jest.fn();

    const $render = (props = {}) => {
      render(App(props), host);
    };

    const App = component(() => {
      useLayoutEffect(() => mockFn(), []);

      return null;
    });

    $render();
    expect(mockFn).toBeCalledTimes(1);

    $render();
    expect(mockFn).toBeCalledTimes(1);
  });

  test('works correctly with deps', () => {
    type AppProps = {
      x: number;
    };
    const effectFn = jest.fn();
    const dropFn = jest.fn();

    const $render = (props: AppProps) => {
      render(App(props), host);
    };

    const App = component<AppProps>(({ x }) => {
      useLayoutEffect(() => {
        effectFn();
        return () => dropFn();
      }, [x]);

      return null;
    });

    $render({ x: 1 });
    expect(effectFn).toBeCalledTimes(1);
    expect(dropFn).toBeCalledTimes(0);

    $render({ x: 1 });
    expect(effectFn).toBeCalledTimes(1);
    expect(dropFn).toBeCalledTimes(0);

    $render({ x: 2 });
    expect(effectFn).toBeCalledTimes(2);
    expect(dropFn).toBeCalledTimes(1);

    $render({ x: 3 });
    expect(effectFn).toBeCalledTimes(3);
    expect(dropFn).toBeCalledTimes(2);
  });

  test('fires on every render without deps', () => {
    const effectFn = jest.fn();
    const dropFn = jest.fn();

    const $render = (props = {}) => {
      render(App(props), host);
    };

    const App = component(() => {
      useLayoutEffect(() => {
        effectFn();
        return () => dropFn();
      });

      return null;
    });

    $render();
    expect(effectFn).toBeCalledTimes(1);
    expect(dropFn).toBeCalledTimes(0);

    $render();
    expect(effectFn).toBeCalledTimes(2);
    expect(dropFn).toBeCalledTimes(1);

    $render();
    expect(effectFn).toBeCalledTimes(3);
    expect(dropFn).toBeCalledTimes(2);
  });

  test('drops effect on unmount event', () => {
    const effectFn = jest.fn();
    const dropFn = jest.fn();
    const App = component(() => {
      useLayoutEffect(() => {
        effectFn();
        return () => dropFn();
      }, []);

      return null;
    });

    render(App(), host);
    expect(effectFn).toBeCalledTimes(1);
    expect(dropFn).toBeCalledTimes(0);

    render(null, host);
    expect(effectFn).toBeCalledTimes(1);
    expect(dropFn).toBeCalledTimes(1);

    render(App(), host);
    expect(effectFn).toBeCalledTimes(2);
    expect(dropFn).toBeCalledTimes(1);
  });

  test('can trigger many effects', () => {
    const effectFn1 = jest.fn();
    const dropFn1 = jest.fn();
    const effectFn2 = jest.fn();
    const dropFn2 = jest.fn();

    const $render = (props = {}) => {
      render(App(props), host);
    };

    const App = component(() => {
      useLayoutEffect(() => {
        effectFn1();
        return () => dropFn1();
      });
      useLayoutEffect(() => {
        effectFn2();
        return () => dropFn2();
      });

      return null;
    });

    $render();
    expect(effectFn1).toBeCalledTimes(1);
    expect(effectFn2).toBeCalledTimes(1);
    expect(dropFn1).toBeCalledTimes(0);
    expect(dropFn2).toBeCalledTimes(0);

    $render();
    expect(effectFn1).toBeCalledTimes(2);
    expect(effectFn2).toBeCalledTimes(2);
    expect(dropFn1).toBeCalledTimes(1);
    expect(dropFn2).toBeCalledTimes(1);

    $render();
    expect(effectFn1).toBeCalledTimes(3);
    expect(effectFn2).toBeCalledTimes(3);
    expect(dropFn1).toBeCalledTimes(2);
    expect(dropFn2).toBeCalledTimes(2);
  });

  test('can work with nested components correctly', () => {
    const effectFn1 = jest.fn();
    const dropFn1 = jest.fn();
    const effectFn2 = jest.fn();
    const dropFn2 = jest.fn();

    const $render = (props = {}) => {
      render(App(props), host);
    };

    const Child = component(() => {
      useLayoutEffect(() => {
        effectFn2();
        return () => dropFn2();
      });

      return null;
    });

    const App = component(() => {
      useLayoutEffect(() => {
        effectFn1();
        return () => dropFn1();
      });

      return <Child />;
    });

    $render();
    expect(effectFn1).toBeCalledTimes(1);
    expect(effectFn2).toBeCalledTimes(1);
    expect(dropFn1).toBeCalledTimes(0);
    expect(dropFn2).toBeCalledTimes(0);
    expect(effectFn1.mock.invocationCallOrder[0]).toBeLessThan(effectFn2.mock.invocationCallOrder[0]);

    $render();
    expect(effectFn1).toBeCalledTimes(2);
    expect(effectFn2).toBeCalledTimes(2);
    expect(dropFn1).toBeCalledTimes(1);
    expect(dropFn2).toBeCalledTimes(1);
    expect(effectFn1.mock.invocationCallOrder[1]).toBeLessThan(effectFn2.mock.invocationCallOrder[1]);
    expect(dropFn1.mock.invocationCallOrder[0]).toBeLessThan(dropFn2.mock.invocationCallOrder[0]);

    $render();
    expect(effectFn1).toBeCalledTimes(3);
    expect(effectFn2).toBeCalledTimes(3);
    expect(dropFn1).toBeCalledTimes(2);
    expect(dropFn2).toBeCalledTimes(2);
    expect(effectFn1.mock.invocationCallOrder[2]).toBeLessThan(effectFn2.mock.invocationCallOrder[2]);
    expect(dropFn1.mock.invocationCallOrder[1]).toBeLessThan(dropFn2.mock.invocationCallOrder[1]);
  });

  test('can call render #1', () => {
    const mockFn = jest.fn();

    const $render = (props = {}) => {
      render(App(props), host);
    };

    const App = component(() => {
      useLayoutEffect(() => {
        $render();
      }, []);

      mockFn();

      return null;
    });

    $render();
    expect(mockFn).toBeCalledTimes(2);
  });

  test('can call render #2', () => {
    const mockFn = jest.fn();

    const $render = (props = {}) => {
      render(App(props), host);
    };

    const App = component(() => {
      const update = useUpdate();

      useLayoutEffect(() => {
        update();
      }, []);

      mockFn();

      return null;
    });

    $render();
    expect(mockFn).toBeCalledTimes(2);
  });
});
