import { dom, replacer, createBrowserEnv, nextTick, sleep } from '@test-utils';
import { type Module, lazy } from '../lazy';
import { component } from '../component';
import { Suspense } from './suspense';

let { host, render } = createBrowserEnv();

beforeEach(() => {
  jest.useRealTimers();
  ({ host, render } = createBrowserEnv());
});

describe('@core/suspense', () => {
  test('shows fallback correctly', async () => {
    const make = () => {
      const content1 = () => dom`<div>loading...</div>${replacer}`;
      const content2 = () => dom`<div>lazy</div>`;

      return new Promise(async resolve => {
        const Lazy = lazy(
          () =>
            new Promise<Module>(resolve => {
              setTimeout(() => {
                resolve({ default: component(() => <div>lazy</div>) });
              }, 10);
            }),
          async () => {
            expect(host.innerHTML).toBe(content1());
            await nextTick();
            expect(host.innerHTML).toBe(content2());
            render(<App />);
            expect(host.innerHTML).toBe(content2());
            resolve(null);
          },
        );
        const App = component(() => {
          return (
            <Suspense fallback={<div>loading...</div>}>
              <Lazy />
            </Suspense>
          );
        });

        render(<App />);
        expect(host.innerHTML).toBe(content1());
        await sleep(1);
        expect(host.innerHTML).toBe(content1());
      });
    };

    await make();
  });

  test('can work with conditional rendering', async () => {
    const make = () => {
      const content1 = () => dom`<div>loading...</div>${replacer}`;
      const content2 = () => dom`<div>lazy</div>`;
      const content3 = () => replacer;

      return new Promise(resolve => {
        const Lazy = lazy(
          () =>
            new Promise<Module>(resolve => {
              setTimeout(() => {
                resolve({ default: component(() => <div>lazy</div>) });
              }, 10);
            }),
          async () => {
            await nextTick();
            expect(host.innerHTML).toBe(content2());
            render(<App isOpen={false} />);
            expect(host.innerHTML).toBe(content3());
            render(<App isOpen={true} />);
            expect(host.innerHTML).toBe(content2());
            resolve(null);
          },
        );
        const App = component<{ isOpen: boolean }>(({ isOpen }) => {
          return isOpen ? (
            <Suspense fallback={<div>loading...</div>}>
              <Lazy />
            </Suspense>
          ) : null;
        });

        render(<App isOpen={true} />);
        expect(host.innerHTML).toBe(content1());
      });
    };

    await make();
  });

  test('can render and wait more than one lazy components correctly', async () => {
    const make = () => {
      const content1 = () => dom`
        <div>loading...</div>
        ${replacer}
        ${replacer}
      `;
      const content2 = () =>
        dom`
        <div>lazy 1</div>
        <div>lazy 2</div>
      `;
      return new Promise(resolve => {
        const Lazy1 = lazy(
          () =>
            new Promise<Module>(resolve => {
              setTimeout(() => {
                resolve({ default: component(() => <div>lazy 1</div>) });
              }, 10);
            }),
          async () => {
            await nextTick();
            expect(host.innerHTML).toBe(content1());
          },
        );
        const Lazy2 = lazy(
          () =>
            new Promise<Module>(resolve => {
              setTimeout(() => {
                resolve({ default: component(() => <div>lazy 2</div>) });
              }, 20);
            }),
          async () => {
            await nextTick();
            expect(host.innerHTML).toBe(content2());
            resolve(null);
          },
        );

        const App = component(() => {
          return (
            <Suspense fallback={<div>loading...</div>}>
              <Lazy1 />
              <Lazy2 />
            </Suspense>
          );
        });

        render(<App />);
        expect(host.innerHTML).toBe(content1());
      });
    };

    await make();
  });

  test('can render and wait nested lazy components correctly', async () => {
    const make = () => {
      const content1 = () => dom`
        <div>loading...</div>
        ${replacer}
      `;
      const content2 = () => dom`
        <div>loading...</div>
        <div style="display: none;">lazy 1</div>
        ${replacer}
      `;
      const content3 = () => dom`
        <div>lazy 1</div>
        <div>lazy 2</div>
      `;

      return new Promise(resolve => {
        const Lazy1 = lazy(
          () =>
            new Promise<Module>(resolve => {
              setTimeout(() => {
                resolve({
                  default: component(() => (
                    <>
                      <div>lazy 1</div>
                      <Lazy2 />
                    </>
                  )),
                });
              }, 10);
            }),
          async () => {
            await nextTick();
            expect(host.innerHTML).toBe(content2());
          },
        );
        const Lazy2 = lazy(
          () =>
            new Promise<Module>(resolve => {
              setTimeout(() => {
                resolve({ default: component(() => <div>lazy 2</div>) });
              }, 20);
            }),
          async () => {
            await nextTick();
            expect(host.innerHTML).toBe(content3());
            resolve(null);
          },
        );

        const App = component(() => {
          return (
            <Suspense fallback={<div>loading...</div>}>
              <Lazy1 />
            </Suspense>
          );
        });

        render(<App />);
        expect(host.innerHTML).toBe(content1());
      });
    };

    await make();
  });

  test('can render and wait nested lazy components with many root tags correctly', async () => {
    const make = () => {
      const content1 = () => dom`
        <div>loading 1...</div>
        <div>loading 2...</div>
        ${replacer}
      `;
      const content2 = () => dom`
        <div>loading 1...</div>
        <div>loading 2...</div>
        <div style=\"display: none;\">lazy 1</div>
        <div style=\"display: none;\">lazy 11</div>
        ${replacer}
        <div style=\"display: none;\">lazy 111</div>
      `;
      const content3 = () => dom`
        <div>lazy 1</div>
        <div>lazy 11</div>
        <div>lazy 2</div>
        <div>lazy 22</div>
        <div>lazy 222</div>
        <div>lazy 111</div>
      `;
      return new Promise(resolve => {
        const Lazy1 = lazy(
          () =>
            new Promise<Module>(resolve => {
              setTimeout(() => {
                resolve({
                  default: component(() => (
                    <>
                      <div>lazy 1</div>
                      <div>lazy 11</div>
                      <Lazy2 />
                      <div>lazy 111</div>
                    </>
                  )),
                });
              }, 10);
            }),
          async () => {
            await nextTick();
            expect(host.innerHTML).toBe(content2());
          },
        );
        const Lazy2 = lazy(
          () =>
            new Promise<Module>(resolve => {
              setTimeout(() => {
                resolve({
                  default: component(() => (
                    <>
                      <div>lazy 2</div>
                      <div>lazy 22</div>
                      <div>lazy 222</div>
                    </>
                  )),
                });
              }, 20);
            }),
          async () => {
            await nextTick();
            expect(host.innerHTML).toBe(content3());
            resolve(null);
          },
        );

        const App = component(() => {
          return (
            <Suspense
              fallback={
                <>
                  <div>loading 1...</div>
                  <div>loading 2...</div>
                </>
              }>
              <Lazy1 />
            </Suspense>
          );
        });

        render(<App />);
        expect(host.innerHTML).toBe(content1());
      });
    };

    await make();
  });

  test('can render nested suspenses correctly', async () => {
    const make = () => {
      const content1 = () => dom`
        <div>loading 1...</div>
        <div>loading 2...</div>
        ${replacer}
      `;
      const content2 = () => dom`
        <div>loading 1...</div>
        <div>loading 2...</div>
        <div style="display: none;">lazy 1</div>
        <div style="display: none;">lazy 11</div>
        ${replacer}
        <div style="display: none;">lazy 111</div>
      `;
      const content3 = () => dom`
        <div>lazy 1</div>
        <div>lazy 11</div>
        <div>nested loading...</div>
        ${replacer}
        <div>lazy 111</div>
      `;
      const content4 = () => dom`
        <div>lazy 1</div>
        <div>lazy 11</div>
        <div>lazy 3</div>
        <div>lazy 33</div>
        <div>lazy 333</div>
        <div>lazy 111</div>
      `;

      return new Promise(resolve => {
        const Lazy1 = lazy(
          () =>
            new Promise<Module>(resolve => {
              setTimeout(() => {
                resolve({
                  default: component(() => (
                    <>
                      <div>lazy 1</div>
                      <div>lazy 11</div>
                      <Lazy2 />
                      <div>lazy 111</div>
                    </>
                  )),
                });
              }, 10);
            }),
          async () => {
            await nextTick();
            expect(host.innerHTML).toBe(content2());
          },
        );
        const Lazy2 = lazy(
          () =>
            new Promise<Module>(resolve => {
              setTimeout(() => {
                resolve({
                  default: component(() => (
                    <Suspense fallback={<div>nested loading...</div>}>
                      <Lazy3 />
                    </Suspense>
                  )),
                });
              }, 20);
            }),
          async () => {
            await nextTick();
            expect(host.innerHTML).toBe(content3());
          },
        );
        const Lazy3 = lazy(
          () =>
            new Promise<Module>(resolve => {
              setTimeout(() => {
                resolve({
                  default: component(() => (
                    <>
                      <div>lazy 3</div>
                      <div>lazy 33</div>
                      <div>lazy 333</div>
                    </>
                  )),
                });
              }, 30);
            }),
          async () => {
            await nextTick();
            expect(host.innerHTML).toBe(content4());
            resolve(null);
          },
        );

        const App = component(() => {
          return (
            <Suspense
              fallback={
                <>
                  <div>loading 1...</div>
                  <div>loading 2...</div>
                </>
              }>
              <Lazy1 />
            </Suspense>
          );
        });

        render(<App />);
        expect(host.innerHTML).toBe(content1());
      });
    };

    await make();
  });
});
