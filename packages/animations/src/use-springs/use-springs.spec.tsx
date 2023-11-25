/** @jsx h */

import { h, component, useState } from '@dark-engine/core';
import { dom, createEnv, mockPlatformRaf } from '@test-utils';

import { type SpringApi, useSprings } from './use-springs';
import { Animated } from '../animated';
import { type SpringValue } from '../shared';
import { range } from '../utils';

let { host, render } = createEnv();

beforeEach(() => {
  ({ host, render } = createEnv());
  mockPlatformRaf();
});

describe('[@animations/use-springs]', () => {
  test('has an api with required methods', () => {
    type SpringProps = 'scale';
    let api: SpringApi<SpringProps> = null;
    const App = component(() => {
      const [_, _api] = useSprings<SpringProps>(1, () => ({
        from: { scale: 0 },
        to: { scale: 1 },
      }));

      api = _api;

      return null;
    });

    render(<App />);
    expect(api.start).toBeDefined();
    expect(api.pause).toBeDefined();
    expect(api.reset).toBeDefined();
    expect(api.resume).toBeDefined();
    expect(api.cancel).toBeDefined();
    expect(api.chain).toBeDefined();
    expect(api.delay).toBeDefined();
    expect(api.on).toBeDefined();
    expect(api.once).toBeDefined();
  });

  test('can animate a simple value via api', () => {
    jest.useFakeTimers();
    const content = (scale: number) => dom`
      <div style="transform: scale(${scale});">A</div>
    `;
    type SpringProps = 'scale';
    let api: SpringApi<SpringProps> = null;
    const App = component(() => {
      const [springs, _api] = useSprings<SpringProps>(1, () => ({
        from: { scale: 0 },
        to: { scale: 1 },
      }));

      api = _api;

      return springs.map((spring, idx) => {
        return (
          <Animated key={idx} spring={spring} fn={styleFn}>
            <div>A</div>
          </Animated>
        );
      });
    });

    const spy = jest.fn();
    const styleFn = (element: HTMLDivElement, value: SpringValue<SpringProps>) => {
      spy(value);
      element.style.setProperty('transform', `scale(${value.scale})`);
    };

    render(<App />);
    expect(host.innerHTML).toBe(content(0));
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith({ scale: 0 });
    spy.mockClear();

    api.start();
    jest.runAllTimers();
    expect(host.innerHTML).toBe(content(1));
    expect(spy).toHaveBeenCalledTimes(51);
    expect(spy).toHaveBeenCalledWith({ scale: 0.2692 });
    expect(spy).toHaveBeenCalledWith({ scale: 0.6093 });
    expect(spy).toHaveBeenCalledWith({ scale: 0.8721 });
    expect(spy).toHaveBeenCalledWith({ scale: 1 });
  });

  test('can animate a complex value via api', () => {
    jest.useFakeTimers();
    const content = (scale: number, opacity: number) => dom`
      <div style="transform: scale(${scale}); opacity: ${opacity};">A</div>
    `;
    type SpringProps = 'scale' | 'opacity';
    let api: SpringApi<SpringProps> = null;
    const App = component(() => {
      const [springs, _api] = useSprings<SpringProps>(1, () => ({
        from: { scale: 0, opacity: 0 },
        to: { scale: 2, opacity: 1 },
      }));

      api = _api;

      return springs.map((spring, idx) => {
        return (
          <Animated key={idx} spring={spring} fn={styleFn}>
            <div>A</div>
          </Animated>
        );
      });
    });

    const spy = jest.fn();
    const styleFn = (element: HTMLDivElement, value: SpringValue<SpringProps>) => {
      spy(value);
      element.style.setProperty('transform', `scale(${value.scale})`);
      element.style.setProperty('opacity', `${value.opacity}`);
    };

    render(<App />);
    expect(host.innerHTML).toBe(content(0, 0));
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith({ scale: 0, opacity: 0 });
    spy.mockClear();

    api.start();
    jest.runAllTimers();
    expect(host.innerHTML).toBe(content(2, 1));
    expect(spy).toHaveBeenCalledTimes(56);
    expect(spy).toHaveBeenCalledWith({ scale: 0.3768, opacity: 0.1884 });
    expect(spy).toHaveBeenCalledWith({ scale: 1.7782, opacity: 0.8891 });
    expect(spy).toHaveBeenCalledWith({ scale: 1.9701, opacity: 0.985 });
    expect(spy).toHaveBeenCalledWith({ scale: 2, opacity: 1 });
  });

  test('can animate a simple value via state', () => {
    jest.useFakeTimers();
    const content = (scale: number) => dom`
      <div style="transform: scale(${scale});">A</div>
    `;
    type SpringProps = 'scale';
    let setIsOpen: (x: boolean) => void;
    const App = component(() => {
      const [isOpen, _setIsOpen] = useState(false);
      const [springs] = useSprings<SpringProps>(
        1,
        () => ({
          from: { scale: 0 },
          to: { scale: isOpen ? 1 : 0 },
        }),
        [isOpen],
      );

      setIsOpen = _setIsOpen;

      return springs.map((spring, idx) => {
        return (
          <Animated key={idx} spring={spring} fn={styleFn}>
            <div>A</div>
          </Animated>
        );
      });
    });

    const spy = jest.fn();
    const styleFn = (element: HTMLDivElement, value: SpringValue<SpringProps>) => {
      spy(value);
      element.style.setProperty('transform', `scale(${value.scale})`);
    };

    render(<App />);
    expect(host.innerHTML).toBe(content(0));
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith({ scale: 0 });
    spy.mockClear();

    setIsOpen(true);
    jest.runAllTimers();
    expect(host.innerHTML).toBe(content(1));
    expect(spy).toHaveBeenCalledTimes(51);
    expect(spy).toHaveBeenCalledWith({ scale: 0.1106 });
    expect(spy).toHaveBeenCalledWith({ scale: 0.6589 });
    expect(spy).toHaveBeenCalledWith({ scale: 0.8721 });
    expect(spy).toHaveBeenCalledWith({ scale: 1 });
    spy.mockClear();

    setIsOpen(false);
    jest.runAllTimers();
    expect(host.innerHTML).toBe(content(0));
    expect(spy).toHaveBeenCalledTimes(52);
    expect(spy).toHaveBeenCalledWith({ scale: 0.9565 });
    expect(spy).toHaveBeenCalledWith({ scale: 0.5087 });
    expect(spy).toHaveBeenCalledWith({ scale: 0.0543 });
    expect(spy).toHaveBeenCalledWith({ scale: 0 });
    spy.mockClear();

    setIsOpen(true);
    jest.runAllTimers();
    expect(host.innerHTML).toBe(content(1));
    expect(spy).toHaveBeenCalledTimes(52);
    expect(spy).toHaveBeenCalledWith({ scale: 0.1106 });
    expect(spy).toHaveBeenCalledWith({ scale: 0.5535 });
    expect(spy).toHaveBeenCalledWith({ scale: 0.9964 });
    expect(spy).toHaveBeenCalledWith({ scale: 1 });
  });

  test('can animate a complex value via state', () => {
    jest.useFakeTimers();
    const content = (scale: number, opacity: number) => dom`
      <div style="transform: scale(${scale}); opacity: ${opacity};">A</div>
    `;
    type SpringProps = 'scale' | 'opacity';
    let setIsOpen: (x: boolean) => void;
    const App = component(() => {
      const [isOpen, _setIsOpen] = useState(false);
      const [springs] = useSprings<SpringProps>(
        1,
        () => ({
          from: { scale: 0, opacity: 0 },
          to: { scale: isOpen ? 1 : 0, opacity: isOpen ? 1 : 0 },
        }),
        [isOpen],
      );

      setIsOpen = _setIsOpen;

      return springs.map((spring, idx) => {
        return (
          <Animated key={idx} spring={spring} fn={styleFn}>
            <div>A</div>
          </Animated>
        );
      });
    });

    const spy = jest.fn();
    const styleFn = (element: HTMLDivElement, value: SpringValue<SpringProps>) => {
      spy(value);
      element.style.setProperty('transform', `scale(${value.scale})`);
      element.style.setProperty('opacity', `${value.opacity}`);
    };

    render(<App />);
    expect(host.innerHTML).toBe(content(0, 0));
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith({ scale: 0, opacity: 0 });
    spy.mockClear();

    setIsOpen(true);
    jest.runAllTimers();
    expect(host.innerHTML).toBe(content(1, 1));
    expect(spy).toHaveBeenCalledTimes(51);
    expect(spy).toHaveBeenCalledWith({ scale: 0.1106, opacity: 0.1106 });
    expect(spy).toHaveBeenCalledWith({ scale: 0.6589, opacity: 0.6589 });
    expect(spy).toHaveBeenCalledWith({ scale: 0.8721, opacity: 0.8721 });
    expect(spy).toHaveBeenCalledWith({ scale: 1, opacity: 1 });
    spy.mockClear();

    setIsOpen(false);
    jest.runAllTimers();
    expect(host.innerHTML).toBe(content(0, 0));
    expect(spy).toHaveBeenCalledTimes(52);
    expect(spy).toHaveBeenCalledWith({ scale: 0.9565, opacity: 0.9565 });
    expect(spy).toHaveBeenCalledWith({ scale: 0.5087, opacity: 0.5087 });
    expect(spy).toHaveBeenCalledWith({ scale: 0.0543, opacity: 0.0543 });
    expect(spy).toHaveBeenCalledWith({ scale: 0, opacity: 0 });
    spy.mockClear();

    setIsOpen(true);
    jest.runAllTimers();
    expect(host.innerHTML).toBe(content(1, 1));
    expect(spy).toHaveBeenCalledTimes(52);
    expect(spy).toHaveBeenCalledWith({ scale: 0.1106, opacity: 0.1106 });
    expect(spy).toHaveBeenCalledWith({ scale: 0.5535, opacity: 0.5535 });
    expect(spy).toHaveBeenCalledWith({ scale: 0.9964, opacity: 0.9964 });
    expect(spy).toHaveBeenCalledWith({ scale: 1, opacity: 1 });
  });

  test('can animate a value without initial "to" parameter', () => {
    jest.useFakeTimers();
    const content = (scale: number) => dom`
      <div style="transform: scale(${scale});">A</div>
    `;
    type SpringProps = 'scale';
    let api: SpringApi<SpringProps> = null;
    const App = component(() => {
      const [springs, _api] = useSprings<SpringProps>(1, () => ({
        from: { scale: 0 },
      }));

      api = _api;

      return springs.map((spring, idx) => {
        return (
          <Animated key={idx} spring={spring} fn={styleFn}>
            <div>A</div>
          </Animated>
        );
      });
    });

    const spy = jest.fn();
    const styleFn = (element: HTMLDivElement, value: SpringValue<SpringProps>) => {
      spy(value);
      element.style.setProperty('transform', `scale(${value.scale})`);
    };

    render(<App />);
    expect(host.innerHTML).toBe(content(0));
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith({ scale: 0 });
    spy.mockClear();

    api.start(() => ({ to: { scale: 1 } }));
    jest.runAllTimers();
    expect(host.innerHTML).toBe(content(1));
    expect(spy).toHaveBeenCalledTimes(51);
    expect(spy).toHaveBeenCalledWith({ scale: 0.2692 });
    expect(spy).toHaveBeenCalledWith({ scale: 0.6093 });
    expect(spy).toHaveBeenCalledWith({ scale: 0.8721 });
    expect(spy).toHaveBeenCalledWith({ scale: 1 });
    spy.mockClear();

    api.start(() => ({ to: { scale: 0.5 } }));
    jest.runAllTimers();

    expect(host.innerHTML).toBe(content(0.5));
    expect(spy).toHaveBeenCalledTimes(47);
    expect(spy).toHaveBeenCalledWith({ scale: 0.5 });
  });

  test('can use a custom spring config', () => {
    jest.useFakeTimers();
    const content = (x: number) => dom`
      <div style="transform: translate3d(${x}px, 0, 0);">A</div>
    `;
    type SpringProps = 'x';
    let api: SpringApi<SpringProps> = null;
    const App = component(() => {
      const [springs, _api] = useSprings<SpringProps>(1, () => ({
        from: { x: 0 },
        to: { x: 50 },
        config: () => ({ mass: 5, tension: 1000, friction: 20, fix: 0 }),
      }));

      api = _api;

      return springs.map((spring, idx) => {
        return (
          <Animated key={idx} spring={spring} fn={styleFn}>
            <div>A</div>
          </Animated>
        );
      });
    });

    const spy = jest.fn();
    const styleFn = (element: HTMLDivElement, value: SpringValue<SpringProps>) => {
      spy(value);
      element.style.setProperty('transform', `translate3d(${value.x}px, 0, 0)`);
    };

    render(<App />);
    expect(host.innerHTML).toBe(content(0));
    spy.mockClear();

    api.start();
    jest.runAllTimers();
    expect(host.innerHTML).toBe(content(50));
    expect(spy).toHaveBeenCalledTimes(186);
    expect(spy).toHaveBeenCalledWith({ x: 3 });
    expect(spy).toHaveBeenCalledWith({ x: 22 });
    expect(spy).toHaveBeenCalledWith({ x: 41 });
    expect(spy).toHaveBeenCalledWith({ x: 50 });
  });

  test('can use a different spring config', () => {
    jest.useFakeTimers();
    const content = (x: number, y: number) => dom`
      <div style="transform: translate3d(${x}px, ${y}px, 0);">A</div>
    `;
    type SpringProps = 'x' | 'y';
    let api: SpringApi<SpringProps> = null;
    const App = component(() => {
      const [springs, _api] = useSprings<SpringProps>(1, () => ({
        from: { x: 0, y: 0 },
        to: { x: 50, y: 50 },
        config: key => ({ mass: 5, tension: key === 'x' ? 1000 : 2000, friction: 20, fix: 0 }),
      }));

      api = _api;

      return springs.map((spring, idx) => {
        return (
          <Animated key={idx} spring={spring} fn={styleFn}>
            <div>A</div>
          </Animated>
        );
      });
    });

    const spy = jest.fn();
    const styleFn = (element: HTMLDivElement, value: SpringValue<SpringProps>) => {
      spy(value);
      element.style.setProperty('transform', `translate3d(${value.x}px, ${value.y}px, 0)`);
    };

    render(<App />);
    expect(host.innerHTML).toBe(content(0, 0));
    spy.mockClear();

    api.start();
    jest.runAllTimers();
    expect(host.innerHTML).toBe(content(50, 50));
    expect(spy).toHaveBeenCalledTimes(227);
    expect(spy).toHaveBeenCalledWith({ x: 3, y: 5 });
    expect(spy).toHaveBeenCalledWith({ x: 22, y: 41 });
    expect(spy).toHaveBeenCalledWith({ x: 41, y: 68 });
    expect(spy).toHaveBeenCalledWith({ x: 50, y: 50 });
  });

  test('can animate a value via api with many controllers #1', () => {
    jest.useFakeTimers();
    const count = 4;
    const content = (scale: number) =>
      range(count)
        .map(
          (_, idx) => dom`
            <div style="transform: scale(${scale});">${idx}</div>
          `,
        )
        .join('');
    type SpringProps = 'scale';
    let api: SpringApi<SpringProps> = null;
    const App = component(() => {
      const [springs, _api] = useSprings<SpringProps>(count, () => ({
        from: { scale: 0 },
        to: { scale: 1 },
      }));

      api = _api;

      return springs.map((spring, idx) => {
        return (
          <Animated key={idx} spring={spring} fn={styleFn}>
            <div>{idx}</div>
          </Animated>
        );
      });
    });

    const spy = jest.fn();
    const styleFn = (element: HTMLDivElement, value: SpringValue<SpringProps>) => {
      spy(value);
      element.style.setProperty('transform', `scale(${value.scale})`);
    };

    render(<App />);
    expect(host.innerHTML).toBe(content(0));
    expect(spy).toHaveBeenCalledTimes(1 * count);
    expect(spy).toHaveBeenCalledWith({ scale: 0 });
    spy.mockClear();

    api.start();
    jest.runAllTimers();
    expect(host.innerHTML).toBe(content(1));
    expect(spy).toHaveBeenCalledTimes(51 * count);
  });

  test('can animate a value via api with many controllers #2', () => {
    jest.useFakeTimers();
    let count = 4;
    const content = (scale: number) =>
      range(count)
        .map(
          (_, idx) => dom`
            <div style="transform: scale(${scale});">${idx}</div>
          `,
        )
        .join('');
    type SpringProps = 'scale';
    let api: SpringApi<SpringProps> = null;
    const App = component(() => {
      const [springs, _api] = useSprings<SpringProps>(count, () => ({
        from: { scale: 0 },
        to: { scale: 1 },
      }));

      api = _api;

      return springs.map((spring, idx) => {
        return (
          <Animated key={idx} spring={spring} fn={styleFn}>
            <div>{idx}</div>
          </Animated>
        );
      });
    });

    const spy = jest.fn();
    const styleFn = (element: HTMLDivElement, value: SpringValue<SpringProps>) => {
      spy(value);
      element.style.setProperty('transform', `scale(${value.scale})`);
    };

    render(<App />);
    expect(host.innerHTML).toBe(content(0));
    expect(spy).toHaveBeenCalledTimes(1 * count);
    expect(spy).toHaveBeenCalledWith({ scale: 0 });
    spy.mockClear();

    api.start();
    jest.runAllTimers();
    expect(host.innerHTML).toBe(content(1));
    expect(spy).toHaveBeenCalledTimes(51 * count);
    spy.mockClear();

    count += 2;
    render(<App />);
    api.start(() => ({ to: { scale: 0 } }));
    jest.runAllTimers();
    expect(host.innerHTML).toBe(content(0));
    expect(spy).toHaveBeenCalledTimes(212);
    spy.mockClear();

    count -= 1;
    render(<App />);
    api.start(() => ({ to: { scale: 2 } }));
    jest.runAllTimers();
    expect(host.innerHTML).toBe(content(2));
    expect(spy).toHaveBeenCalledTimes(285);
  });

  test('pass idx to configurator', () => {
    jest.useFakeTimers();
    const count = 4;
    type SpringProps = 'scale';
    let api: SpringApi<SpringProps> = null;
    const spy = jest.fn();
    const App = component(() => {
      const [springs, _api] = useSprings<SpringProps>(count, idx => {
        spy(idx);
        return {
          from: { scale: 0 },
          to: { scale: 1 },
        };
      });

      api = _api;

      return springs.map((spring, idx) => {
        return (
          <Animated key={idx} spring={spring} fn={styleFn}>
            <div>{idx}</div>
          </Animated>
        );
      });
    });

    const styleFn = (element: HTMLDivElement, value: SpringValue<SpringProps>) => {
      element.style.setProperty('transform', `scale(${value.scale})`);
    };

    render(<App />);
    api.start();
    jest.runAllTimers();

    range(count).forEach((_, idx) => expect(spy).toHaveBeenCalledWith(idx));
  });

  test(`doesn't throw an exception without notifier`, () => {
    jest.useFakeTimers();

    const make = () => {
      const count = 4;
      let api: SpringApi = null;
      const App = component(() => {
        const [_, _api] = useSprings(count, () => ({
          from: { scale: 0 },
          to: { scale: 1 },
        }));

        api = _api;

        return null;
      });

      render(<App />);
      api.start();
      jest.runAllTimers();
    };

    expect(make).not.toThrow();
  });
});
