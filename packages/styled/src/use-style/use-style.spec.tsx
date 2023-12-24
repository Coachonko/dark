/** @jsx h */
import { h, component } from '@dark-engine/core';

import { createBrowserEnv, dom } from '@test-utils';
import { useStyle } from './use-style';

let { render, host } = createBrowserEnv();

beforeEach(() => {
  ({ render, host } = createBrowserEnv());
});

describe('[@styled/use-style]', () => {
  test('transforms the string style to the object correctly', () => {
    let style: { root: object; button: object };
    const App = component(() => {
      style = useStyle(styled => ({
        root: styled`
          position: absolute;
          transform: translate(10px, 10px);
          text-transform: uppercase;
        `,
        button: styled`
          color: pink;
        `,
      }));

      return null;
    });

    render(<App />);
    expect(style.root).toEqual({
      position: 'absolute',
      transform: 'translate(10px, 10px)',
      'text-transform': 'uppercase',
    });
    expect(style.button).toEqual({ color: 'pink' });
  });

  test('renders styles correctly', () => {
    type AppProps = { color: string };
    const content = (color: string) => dom`
      <div style="position: absolute; transform: translate(10px, 10px); text-transform: uppercase; background-image: url(https://images.com/1);">
        <button style="color: ${color};">click</button>
      </div>  
    `;
    let color = 'pink';
    const App = component<AppProps>(({ color }) => {
      const style = useStyle(styled => ({
        root: styled`
          position: absolute;
          transform: translate(10px, 10px);
          text-transform: uppercase;
          background-image: url('https://images.com/1');
        `,
        button: styled`
          color: ${color};
        `,
      }));

      return (
        <div style={style.root}>
          <button style={style.button}>click</button>
        </div>
      );
    });

    render(<App color={color} />);
    expect(host.innerHTML).toBe(content(color));

    color = 'blue';
    render(<App color={color} />);
    expect(host.innerHTML).toBe(content(color));
  });
});