import { render } from '@dark-engine/platform-browser';

import { component } from '../component';
import { memo } from './memo';

let host: HTMLElement = null;

beforeEach(() => {
  host = document.createElement('div');
});

describe('@core/memo', () => {
  test('works correctly by default', () => {
    const mockFn = jest.fn();

    const $render = (props = {}) => {
      render(MemoApp(props), host);
    };

    const App = component(() => {
      mockFn();
      return null;
    });

    const MemoApp = memo(App);

    $render();
    expect(mockFn).toBeCalledTimes(1);
    $render();
    expect(mockFn).toBeCalledTimes(1);
  });

  test('works correctly with custom props comparer', () => {
    type AppProps = { name: string; age: number };
    const mockFn = jest.fn();

    const $render = (props: AppProps) => {
      render(MemoApp(props), host);
    };

    const App = component<AppProps>(() => {
      mockFn();
      return null;
    });
    const MemoApp = memo<AppProps>(App, (props, nextProps) => props.name !== nextProps.name);

    $render({ name: 'Alex', age: 24 });
    expect(mockFn).toBeCalledTimes(1);

    $render({ name: 'Alex', age: 26 });
    expect(mockFn).toBeCalledTimes(1);

    $render({ name: 'Jane', age: 24 });
    expect(mockFn).toBeCalledTimes(2);

    $render({ name: 'Jane', age: 28 });
    expect(mockFn).toBeCalledTimes(2);
  });
});
