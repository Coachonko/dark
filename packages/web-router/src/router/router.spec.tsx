import { type DarkElement, type MutableRef, component, useRef, Fragment, useLayoutEffect } from '@dark-engine/core';
import { createBrowserEnv, replacer, resetBrowserHistory, sleep, click } from '@test-utils';

import { type Routes } from '../create-routes';
import { type RouterRef, Router } from './router';
import { NavLink } from '../nav-link';

type AppProps = {
  url: string;
};

let { host, render, unmount } = createBrowserEnv();

beforeEach(() => {
  ({ host, render, unmount } = createBrowserEnv());
});

afterEach(() => {
  resetBrowserHistory();
  host.parentElement === document.body && document.body.removeChild(host);
});

describe('@web-router/router', () => {
  test('can render simple routes correctly', () => {
    const routes: Routes = [
      {
        path: 'first',
        component: component(() => <div>first</div>),
      },
      {
        path: 'second',
        component: component(() => <div>second</div>),
      },
      {
        path: 'third',
        component: component(() => <div>third</div>),
      },
    ];

    const App = component<AppProps>(({ url }) => {
      return (
        <Router routes={routes} url={url}>
          {slot => slot}
        </Router>
      );
    });

    render(<App url='/first' />);
    expect(host.innerHTML).toBe(`<div>first</div>`);

    render(<App url='/second' />);
    expect(host.innerHTML).toBe(`<div>second</div>`);

    render(<App url='/third' />);
    expect(host.innerHTML).toBe(`<div>third</div>`);
  });

  test('can render incorrect routes correctly', () => {
    const routes: Routes = [
      {
        path: 'first',
        component: component(() => <div>first</div>),
      },
      {
        path: 'second',
        component: component(() => <div>second</div>),
      },
      {
        path: 'third',
        component: component(() => <div>third</div>),
      },
      {
        path: '**',
        component: component(() => null),
      },
    ];

    const App = component<AppProps>(({ url }) => {
      return (
        <Router routes={routes} url={url}>
          {slot => slot}
        </Router>
      );
    });

    render(<App url='/' />);
    expect(host.innerHTML).toBe(replacer);

    render(<App url='' />);
    expect(host.innerHTML).toBe(replacer);

    render(<App url='/xxx' />);
    expect(host.innerHTML).toBe(replacer);

    render(<App url='/second' />);
    expect(host.innerHTML).toBe(`<div>second</div>`);

    render(<App url='/second1' />);
    expect(host.innerHTML).toBe(replacer);

    render(<App url='/second/1' />);
    expect(host.innerHTML).toBe(replacer);

    render(<App url='/first/1/xxx' />);
    expect(host.innerHTML).toBe(replacer);

    render(<App url='/some/broken/url' />);
    expect(host.innerHTML).toBe(replacer);
  });

  test('can render nested routes correctly', () => {
    const routes: Routes = [
      {
        path: 'first',
        component: component(() => <div>first</div>),
      },
      {
        path: 'second',
        component: component<{ slot: DarkElement }>(({ slot }) => <second>{slot}</second>),
        children: [
          {
            path: 'a',
            component: component(() => <div>a</div>),
          },
          {
            path: 'b',
            component: component(() => <div>b</div>),
          },
        ],
      },
      {
        path: 'third',
        component: component(() => <div>third</div>),
      },
    ];

    const App = component<AppProps>(({ url }) => {
      return (
        <Router routes={routes} url={url}>
          {slot => slot}
        </Router>
      );
    });

    render(<App url='/first' />);
    expect(host.innerHTML).toBe(`<div>first</div>`);

    render(<App url='/second' />);
    expect(host.innerHTML).toBe(`<second>${replacer}</second>`);

    render(<App url='/second/a' />);
    expect(host.innerHTML).toBe(`<second><div>a</div></second>`);

    render(<App url='/second/b' />);
    expect(host.innerHTML).toBe(`<second><div>b</div></second>`);

    expect(() => render(<App url='/second/b/some/broken/route' />)).toThrowError();

    unmount();
    render(<App url='/third' />);
    expect(host.innerHTML).toBe(`<div>third</div>`);
  });

  test('can render deeply nested routes correctly', () => {
    const routes: Routes = [
      {
        path: 'first',
        component: component(() => <div>first</div>),
      },
      {
        path: 'second',
        component: component<{ slot: DarkElement }>(({ slot }) => <second>{slot}</second>),
        children: [
          {
            path: 'a',
            component: component<{ slot: DarkElement }>(({ slot }) => <a>{slot}</a>),
            children: [
              {
                path: '1',
                component: component(() => <div>1</div>),
              },
              {
                path: '2',
                component: component(() => <div>2</div>),
              },
            ],
          },
          {
            path: 'b',
            component: component<{ slot: DarkElement }>(({ slot }) => <b>{slot}</b>),
            children: [
              {
                path: '1',
                component: component(() => <div>1</div>),
              },
              {
                path: '2',
                component: component(() => <div>2</div>),
              },
            ],
          },
        ],
      },
      {
        path: 'third',
        component: () => <div>third</div>,
      },
    ];

    const App = component<AppProps>(({ url }) => {
      return (
        <Router routes={routes} url={url}>
          {slot => slot}
        </Router>
      );
    });

    render(<App url='/first' />);
    expect(host.innerHTML).toBe(`<div>first</div>`);

    render(<App url='/second' />);
    expect(host.innerHTML).toBe(`<second>${replacer}</second>`);

    render(<App url='/third' />);
    expect(host.innerHTML).toBe(`<div>third</div>`);

    render(<App url='/second/a' />);
    expect(host.innerHTML).toBe(`<second><a>${replacer}</a></second>`);

    render(<App url='/second/a/1' />);
    expect(host.innerHTML).toBe(`<second><a><div>1</div></a></second>`);

    render(<App url='/second/a/2' />);
    expect(host.innerHTML).toBe(`<second><a><div>2</div></a></second>`);

    render(<App url='/second/b' />);
    expect(host.innerHTML).toBe(`<second><b>${replacer}</b></second>`);

    render(<App url='/second/b/1' />);
    expect(host.innerHTML).toBe(`<second><b><div>1</div></b></second>`);

    render(<App url='/second/b/2' />);
    expect(host.innerHTML).toBe(`<second><b><div>2</div></b></second>`);
  });

  test('can work with redirects correctly', () => {
    const routes: Routes = [
      {
        path: 'first',
        redirectTo: 'second',
      },
      {
        path: 'second',
        component: component(() => <div>second</div>),
      },
      {
        path: 'third',
        component: component(() => <div>third</div>),
      },
    ];

    const App = component<AppProps>(({ url }) => {
      return (
        <Router routes={routes} url={url}>
          {slot => slot}
        </Router>
      );
    });

    render(<App url='/first' />);
    expect(host.innerHTML).toBe(`<div>second</div>`);

    render(<App url='/second' />);
    expect(host.innerHTML).toBe(`<div>second</div>`);

    render(<App url='/third' />);
    expect(host.innerHTML).toBe(`<div>third</div>`);
  });

  test('can work with chained redirects correctly', () => {
    const routes: Routes = [
      {
        path: 'first',
        redirectTo: 'second',
      },
      {
        path: 'second',
        redirectTo: 'third',
      },
      {
        path: 'third',
        redirectTo: 'fourth',
      },
      {
        path: 'fourth',
        component: component(() => <div>fourth</div>),
      },
    ];
    const App = component<AppProps>(({ url }) => {
      return (
        <Router routes={routes} url={url}>
          {slot => slot}
        </Router>
      );
    });

    render(<App url='/first' />);
    expect(host.innerHTML).toBe(`<div>fourth</div>`);

    render(<App url='/second' />);
    expect(host.innerHTML).toBe(`<div>fourth</div>`);

    render(<App url='/third' />);
    expect(host.innerHTML).toBe(`<div>fourth</div>`);

    render(<App url='/fourth' />);
    expect(host.innerHTML).toBe(`<div>fourth</div>`);
  });

  test('can work with redirects in nested routes correctly', () => {
    const routes: Routes = [
      {
        path: 'first',
        redirectTo: 'second',
      },
      {
        path: 'second',
        component: component<{ slot: DarkElement }>(({ slot }) => <second>{slot}</second>),
        children: [
          {
            path: 'a',
            redirectTo: 'b',
          },
          {
            path: 'b',
            redirectTo: 'c',
          },
          {
            path: 'c',
            component: component(() => <div>c</div>),
          },
        ],
      },
      {
        path: 'third',
        redirectTo: 'fourth',
      },
      {
        path: 'fourth',
        component: component(() => <div>fourth</div>),
      },
    ];

    const App = component<AppProps>(({ url }) => {
      return (
        <Router routes={routes} url={url}>
          {slot => slot}
        </Router>
      );
    });

    render(<App url='/second/a' />);
    expect(host.innerHTML).toBe(`<second><div>c</div></second>`);

    render(<App url='/second/b' />);
    expect(host.innerHTML).toBe(`<second><div>c</div></second>`);

    render(<App url='/second/c' />);
    expect(host.innerHTML).toBe(`<second><div>c</div></second>`);
  });

  test('can work with root redirect correctly #1', () => {
    const routes: Routes = [
      {
        path: 'first',
        component: component(() => <div>first</div>),
      },
      {
        path: '',
        redirectTo: 'first',
      },
    ];

    const App = component<AppProps>(({ url }) => {
      return (
        <Router routes={routes} url={url}>
          {slot => slot}
        </Router>
      );
    });

    render(<App url='/' />);
    expect(host.innerHTML).toBe(`<div>first</div>`);
  });

  test('can work with root redirect correctly #2', () => {
    const routes: Routes = [
      {
        path: '',
        component: component(() => <div>root</div>),
      },
      {
        path: 'second',
        component: component(() => <div>second</div>),
      },
      {
        path: 'third',
        component: component(() => <div>third</div>),
      },
      {
        path: '**',
        redirectTo: '',
      },
    ];

    const App = component<AppProps>(({ url }) => {
      return (
        <Router routes={routes} url={url}>
          {slot => slot}
        </Router>
      );
    });

    render(<App url='/' />);
    expect(host.innerHTML).toBe(`<div>root</div>`);

    render(<App url='' />);
    expect(host.innerHTML).toBe(`<div>root</div>`);

    render(<App url='/broken' />);
    expect(host.innerHTML).toBe(`<div>root</div>`);

    render(<App url='/second' />);
    expect(host.innerHTML).toBe(`<div>second</div>`);

    render(<App url='/third' />);
    expect(host.innerHTML).toBe(`<div>third</div>`);
  });

  test('can work with root redirect with full path strategy correctly', () => {
    const routes: Routes = [
      {
        path: 'first',
        component: component(() => <div>first</div>),
      },
      {
        path: '/',
        redirectTo: '/first',
        pathMatch: 'full',
      },
    ];
    const App = component<AppProps>(({ url }) => {
      return (
        <Router routes={routes} url={url}>
          {slot => slot}
        </Router>
      );
    });

    render(<App url='/' />);
    expect(host.innerHTML).toBe(`<div>first</div>`);
  });

  test('can combine match strategies correctly', () => {
    const routes: Routes = [
      {
        path: 'first',
        component: component(() => <div>first</div>),
      },
      {
        path: 'second',
        component: component<{ slot: DarkElement }>(({ slot }) => <second>{slot}</second>),
        children: [
          {
            path: '/second/a',
            redirectTo: '/second/b',
            pathMatch: 'full',
          },
          {
            path: 'b',
            component: component(() => <div>b</div>),
          },
        ],
      },
    ];

    const App = component<AppProps>(({ url }) => {
      return (
        <Router routes={routes} url={url}>
          {slot => slot}
        </Router>
      );
    });

    render(<App url='/second/a' />);
    expect(host.innerHTML).toBe(`<second><div>b</div></second>`);
  });

  test('can work with wildcard routes correctly', () => {
    const routes: Routes = [
      {
        path: 'first',
        component: component(() => <div>first</div>),
      },
      {
        path: 'second',
        component: component<{ slot: DarkElement }>(({ slot }) => <second>{slot}</second>),
        children: [
          {
            path: 'a',
            component: component(() => <div>a</div>),
          },
          {
            path: 'b',
            component: component(() => <div>b</div>),
          },
        ],
      },
      {
        path: '',
        redirectTo: 'first',
      },
      {
        path: '**',
        component: component(() => <div>404</div>),
      },
    ];

    const App = component<AppProps>(({ url }) => {
      return (
        <Router routes={routes} url={url}>
          {slot => slot}
        </Router>
      );
    });

    render(<App url='/' />);
    expect(host.innerHTML).toBe(`<div>first</div>`);

    render(<App url='/first' />);
    expect(host.innerHTML).toBe(`<div>first</div>`);

    render(<App url='/second/a' />);
    expect(host.innerHTML).toBe(`<second><div>a</div></second>`);

    render(<App url='/broken/url' />);
    expect(host.innerHTML).toBe(`<div>404</div>`);
  });

  test('can work with wildcard in nested routes correctly', () => {
    const routes: Routes = [
      {
        path: 'first',
        component: component(() => <div>first</div>),
      },
      {
        path: 'second',
        component: component<{ slot: DarkElement }>(({ slot }) => <second>{slot}</second>),
        children: [
          {
            path: 'a',
            component: component(() => <div>a</div>),
          },
          {
            path: 'b',
            component: component(() => <div>b</div>),
          },
          {
            path: '**',
            component: component(() => <div>404</div>),
          },
        ],
      },
      {
        path: '',
        redirectTo: 'first',
      },
      {
        path: '**',
        component: component(() => <div>404</div>),
      },
    ];

    const App = component<AppProps>(({ url }) => {
      return (
        <Router routes={routes} url={url}>
          {slot => slot}
        </Router>
      );
    });

    render(<App url='/second/a' />);
    expect(host.innerHTML).toBe(`<second><div>a</div></second>`);

    render(<App url='/second/broken/url' />);
    expect(host.innerHTML).toBe(`<second><div>404</div></second>`);

    render(<App url='/second/a/broken/url' />);
    expect(host.innerHTML).toBe(`<second><div>404</div></second>`);

    render(<App url='/broken/url' />);
    expect(host.innerHTML).toBe(`<div>404</div>`);
  });

  test('can combine wildcard routes and redirects in nested routes correctly', () => {
    const routes: Routes = [
      {
        path: 'first',
        component: component(() => <div>first</div>),
      },
      {
        path: 'second',
        component: component<{ slot: DarkElement }>(({ slot }) => <second>{slot}</second>),
        children: [
          {
            path: 'a',
            component: component(() => <div>a</div>),
          },
          {
            path: 'b',
            component: component(() => <div>b</div>),
          },
          {
            path: '**',
            redirectTo: 'a',
          },
        ],
      },
      {
        path: '**',
        redirectTo: 'first',
      },
    ];

    const App = component<AppProps>(({ url }) => {
      return (
        <Router routes={routes} url={url}>
          {slot => slot}
        </Router>
      );
    });

    render(<App url='/second/a' />);
    expect(host.innerHTML).toBe(`<second><div>a</div></second>`);

    render(<App url='/second/broken/url' />);
    expect(host.innerHTML).toBe(`<second><div>a</div></second>`);

    render(<App url='/second/a/broken/url' />);
    expect(host.innerHTML).toBe(`<second><div>a</div></second>`);

    render(<App url='/broken/url' />);
    expect(host.innerHTML).toBe(`<div>first</div>`);
  });

  test('can combine wildcard routes and redirects in deeply nested routes correctly', () => {
    const routes: Routes = [
      {
        path: 'first',
        component: component(() => <div>first</div>),
      },
      {
        path: 'second',
        component: component<{ slot: DarkElement }>(({ slot }) => <second>{slot}</second>),
        children: [
          {
            path: 'a',
            component: component(() => <div>a</div>),
          },
          {
            path: 'b',
            component: component<{ slot: DarkElement }>(({ slot }) => <b>{slot}</b>),
            children: [
              {
                path: '1',
                component: component(() => <div>1</div>),
              },
              {
                path: '2',
                component: component(() => <div>2</div>),
              },
              {
                path: '**',
                redirectTo: '1',
              },
            ],
          },
          {
            path: '**',
            redirectTo: 'a',
          },
        ],
      },
      {
        path: '**',
        redirectTo: 'first',
      },
    ];

    const App = component<AppProps>(({ url }) => {
      return (
        <Router routes={routes} url={url}>
          {slot => slot}
        </Router>
      );
    });

    render(<App url='/second/a' />);
    expect(host.innerHTML).toBe(`<second><div>a</div></second>`);

    render(<App url='/second/broken/url' />);
    expect(host.innerHTML).toBe(`<second><div>a</div></second>`);

    render(<App url='/second/a/broken/url' />);
    expect(host.innerHTML).toBe(`<second><div>a</div></second>`);

    render(<App url='/second/b' />);
    expect(host.innerHTML).toBe(`<second><b>${replacer}</b></second>`);

    render(<App url='/second/b/' />);
    expect(host.innerHTML).toBe(`<second><b>${replacer}</b></second>`);

    render(<App url='/second/b/1' />);
    expect(host.innerHTML).toBe(`<second><b><div>1</div></b></second>`);

    render(<App url='/second/b/1/' />);
    expect(host.innerHTML).toBe(`<second><b><div>1</div></b></second>`);

    render(<App url='/second/b/broken/url' />);
    expect(host.innerHTML).toBe(`<second><b><div>1</div></b></second>`);

    render(<App url='/second/b/1/broken/url' />);
    expect(host.innerHTML).toBe(`<second><b><div>1</div></b></second>`);

    render(<App url='/second/b/2/broken/url' />);
    expect(host.innerHTML).toBe(`<second><b><div>1</div></b></second>`);

    render(<App url='/broken/url' />);
    expect(host.innerHTML).toBe(`<div>first</div>`);
  });

  test('can work with parameters correctly', () => {
    const routes: Routes = [
      {
        path: 'first',
        component: component(() => <div>first</div>),
      },
      {
        path: 'second/:id',
        component: component<{ slot: DarkElement }>(({ slot }) => <second>{slot}</second>),
        children: [
          {
            path: 'a',
            component: component(() => <div>a</div>),
          },
          {
            path: 'b/:id',
            component: component(() => <div>b</div>),
          },
        ],
      },
    ];

    const App = component<AppProps>(({ url }) => {
      return (
        <Router routes={routes} url={url}>
          {slot => slot}
        </Router>
      );
    });

    render(<App url='/second/1/a/' />);
    expect(host.innerHTML).toBe(`<second><div>a</div></second>`);

    render(<App url='/second/2/a/' />);
    expect(host.innerHTML).toBe(`<second><div>a</div></second>`);

    render(<App url='/second/1/b/2' />);
    expect(host.innerHTML).toBe(`<second><div>b</div></second>`);

    render(<App url='/second/100/b/2000' />);
    expect(host.innerHTML).toBe(`<second><div>b</div></second>`);
  });

  test('can render flatten tree routes', () => {
    const routes: Routes = [
      {
        path: 'first',
        component: component(() => <div>first</div>),
      },
      {
        path: 'second/a/1',
        component: component(() => <div>second/a/1</div>),
      },
      {
        path: 'second/a/2',
        component: component(() => <div>second/a/2</div>),
      },
      {
        path: 'second/a',
        component: component(() => <div>second/a</div>),
      },
      {
        path: 'second/b',
        redirectTo: 'third',
      },
      {
        path: 'second',
        component: component(() => <div>second</div>),
      },
      {
        path: 'third',
        component: component(() => <div>third</div>),
      },
      {
        path: '**',
        redirectTo: 'first',
      },
    ];

    const App = component<AppProps>(({ url }) => {
      return (
        <Router routes={routes} url={url}>
          {slot => slot}
        </Router>
      );
    });

    render(<App url='/' />);
    expect(host.innerHTML).toBe(`<div>first</div>`);

    render(<App url='/first' />);
    expect(host.innerHTML).toBe(`<div>first</div>`);

    render(<App url='/second' />);
    expect(host.innerHTML).toBe(`<div>second</div>`);

    render(<App url='/second/a' />);
    expect(host.innerHTML).toBe(`<div>second/a</div>`);

    render(<App url='/second/a/1' />);
    expect(host.innerHTML).toBe(`<div>second/a/1</div>`);

    render(<App url='/second/a/2' />);
    expect(host.innerHTML).toBe(`<div>second/a/2</div>`);

    render(<App url='/second/b' />);
    expect(host.innerHTML).toBe(`<div>third</div>`);

    render(<App url='/third' />);
    expect(host.innerHTML).toBe(`<div>third</div>`);
  });

  test('can render combined tree strategies', () => {
    const routes: Routes = [
      {
        path: 'first',
        component: component(() => <div>first</div>),
      },
      {
        path: 'second/a',
        component: component<{ slot: DarkElement }>(({ slot }) => <second:a>{slot}</second:a>),
        children: [
          {
            path: '1',
            component: component(() => <div>1</div>),
          },
          {
            path: '2',
            component: component(() => <div>2</div>),
          },
          {
            path: '',
            redirectTo: '2',
          },
          {
            path: '**',
            redirectTo: '2',
          },
        ],
      },
      {
        path: 'second/b',
        redirectTo: 'third',
      },
      {
        path: 'second',
        component: component(() => <div>second</div>),
      },
      {
        path: 'third',
        component: component(() => <div>third</div>),
      },
      {
        path: '**',
        redirectTo: 'first',
      },
    ];

    const App = component<AppProps>(({ url }) => {
      return (
        <Router routes={routes} url={url}>
          {slot => slot}
        </Router>
      );
    });

    render(<App url='/' />);
    expect(host.innerHTML).toBe(`<div>first</div>`);

    render(<App url='/first' />);
    expect(host.innerHTML).toBe(`<div>first</div>`);

    render(<App url='/second' />);
    expect(host.innerHTML).toBe(`<div>second</div>`);

    render(<App url='/second/a' />);
    expect(host.innerHTML).toBe(`<second:a><div>2</div></second:a>`);

    render(<App url='/second/a/1' />);
    expect(host.innerHTML).toBe(`<second:a><div>1</div></second:a>`);

    render(<App url='/second/a/2' />);
    expect(host.innerHTML).toBe(`<second:a><div>2</div></second:a>`);

    render(<App url='/second/b' />);
    expect(host.innerHTML).toBe(`<div>third</div>`);

    render(<App url='/third' />);
    expect(host.innerHTML).toBe(`<div>third</div>`);
  });

  test('can render combined roots, wildcards and parameters', () => {
    const routes: Routes = [
      {
        path: 'first',
        component: component<{ slot: DarkElement }>(({ slot }) => <first>{slot}</first>),
        children: [
          {
            path: 'nested',
            component: component(() => <div>nested</div>),
          },
          {
            path: ':id',
            component: component(() => <div>:id</div>),
          },
          {
            path: '',
            component: component(() => <div>root</div>),
          },
          {
            path: '**',
            redirectTo: '',
          },
        ],
      },
      {
        path: 'second',
        component: component(() => <div>second</div>),
      },
      {
        path: 'third',
        component: component(() => <div>third</div>),
      },
      {
        path: '',
        redirectTo: 'first',
      },
      {
        path: '**',
        redirectTo: 'first',
      },
    ];

    const App = component<AppProps>(({ url }) => {
      return (
        <Router routes={routes} url={url}>
          {slot => slot}
        </Router>
      );
    });

    render(<App url='/' />);
    expect(host.innerHTML).toBe(`<first><div>root</div></first>`);

    render(<App url='/first' />);
    expect(host.innerHTML).toBe(`<first><div>root</div></first>`);

    render(<App url='/first/666' />);
    expect(host.innerHTML).toBe(`<first><div>:id</div></first>`);

    render(<App url='/first/666/broken' />);
    expect(host.innerHTML).toBe(`<first><div>root</div></first>`);

    render(<App url='/second' />);
    expect(host.innerHTML).toBe(`<div>second</div>`);

    render(<App url='/third' />);
    expect(host.innerHTML).toBe(`<div>third</div>`);

    render(<App url='/broken/url' />);
    expect(host.innerHTML).toBe(`<first><div>root</div></first>`);
  });

  test('a history updates correctly with wildcard routing', async () => {
    let routerRef: MutableRef<RouterRef> = null;
    const routes: Routes = [
      {
        path: 'first',
        component: component(() => <div>first</div>),
      },
      {
        path: 'second',
        component: component(() => <div>second</div>),
      },
      {
        path: 'third',
        component: component(() => <div>third</div>),
      },
      {
        path: '',
        redirectTo: 'first',
      },
      {
        path: '**',
        component: component(() => <div>404</div>),
      },
    ];

    const App = component(() => {
      routerRef = useRef<RouterRef>(null);

      return (
        <Router ref={routerRef} routes={routes}>
          {slot => slot}
        </Router>
      );
    });

    render(<App />);

    routerRef.current.navigateTo('/broken/');
    await sleep(0);
    expect(host.innerHTML).toBe(`<div>404</div>`);
    expect(location.href).toBe('http://localhost/broken/');
  });

  test('can render nested indexed routes', () => {
    // https://github.com/atellmer/dark/issues/53
    const routes: Routes = [
      {
        path: '/',
        component: component<{ slot: DarkElement }>(({ slot }) => <root>{slot}</root>),
        children: [
          {
            path: '/',
            component: component(() => <home>/</home>),
          },
          {
            path: 'contact',
            component: component(() => <contact>/</contact>),
          },
          {
            path: 'de',
            component: Fragment,
            children: [
              {
                path: '/',
                component: component(() => <home>de</home>),
              },
              {
                path: 'contact',
                component: component(() => <contact>de</contact>),
              },
            ],
          },
        ],
      },
      {
        path: '**',
        redirectTo: '/',
      },
    ];

    const App = component<AppProps>(({ url }) => {
      return (
        <Router routes={routes} url={url}>
          {slot => slot}
        </Router>
      );
    });

    render(<App url='/' />);
    expect(host.innerHTML).toMatchInlineSnapshot(`"<root><home>/</home></root>"`);

    render(<App url='/contact' />);
    expect(host.innerHTML).toMatchInlineSnapshot(`"<root><contact>/</contact></root>"`);

    render(<App url='/de' />);
    expect(host.innerHTML).toMatchInlineSnapshot(`"<root><home>de</home></root>"`);

    render(<App url='/de/contact' />);
    expect(host.innerHTML).toMatchInlineSnapshot(`"<root><contact>de</contact></root>"`);

    render(<App url='/de///contact///' />);
    expect(host.innerHTML).toMatchInlineSnapshot(`"<root><contact>de</contact></root>"`);

    render(<App url='/broken' />);
    expect(host.innerHTML).toMatchInlineSnapshot(`"<root><home>/</home></root>"`);

    render(<App url='/de/broken' />);
    expect(host.innerHTML).toMatchInlineSnapshot(`"<root><home>/</home></root>"`);

    render(<App url='/de/contact/broken' />);
    expect(host.innerHTML).toMatchInlineSnapshot(`"<root><home>/</home></root>"`);
  });

  test('can render i18n static routes', () => {
    // https://github.com/atellmer/dark/issues/53
    const routes: Routes = [
      ...['en', 'it', 'fr'].map(lang => ({
        path: lang,
        component: component<{ slot: DarkElement }>(({ slot }) => (
          <root>
            {lang}:{slot || '/'}
          </root>
        )),
        children: [
          {
            path: 'contact',
            component: component(() => <contact>{lang}</contact>),
          },
          {
            path: '**',
            pathMatch: 'full',
            redirectTo: '/not-found',
          },
        ],
      })),
      {
        path: '',
        component: component<{ slot: DarkElement }>(({ slot }) => <root>{slot || '/'}</root>),
        children: [
          {
            path: 'contact',
            component: component(() => <contact>/</contact>),
          },
          {
            path: 'not-found',
            component: component(() => <not-found>/</not-found>),
          },
        ],
      },
      {
        path: '**',
        redirectTo: 'not-found',
      },
    ] as Routes;

    const App = component<AppProps>(({ url }) => {
      return (
        <Router routes={routes} url={url}>
          {slot => slot}
        </Router>
      );
    });

    render(<App url='/' />);
    expect(host.innerHTML).toMatchInlineSnapshot(`"<root>/</root>"`);

    render(<App url='/contact' />);
    expect(host.innerHTML).toMatchInlineSnapshot(`"<root><contact>/</contact></root>"`);

    render(<App url='/en' />);
    expect(host.innerHTML).toMatchInlineSnapshot(`"<root>en:/</root>"`);

    render(<App url='/en/contact' />);
    expect(host.innerHTML).toMatchInlineSnapshot(`"<root>en:<contact>en</contact></root>"`);

    render(<App url='/it' />);
    expect(host.innerHTML).toMatchInlineSnapshot(`"<root>it:/</root>"`);

    render(<App url='/it/contact' />);
    expect(host.innerHTML).toMatchInlineSnapshot(`"<root>it:<contact>it</contact></root>"`);

    render(<App url='/fr' />);
    expect(host.innerHTML).toMatchInlineSnapshot(`"<root>fr:/</root>"`);

    render(<App url='/fr/contact' />);
    expect(host.innerHTML).toMatchInlineSnapshot(`"<root>fr:<contact>fr</contact></root>"`);

    render(<App url='/broken' />);
    expect(host.innerHTML).toMatchInlineSnapshot(`"<root><not-found>/</not-found></root>"`);

    render(<App url='/en/broken' />);
    expect(host.innerHTML).toMatchInlineSnapshot(`"<root><not-found>/</not-found></root>"`);

    render(<App url='/en/contact/broken' />);
    expect(host.innerHTML).toMatchInlineSnapshot(`"<root><not-found>/</not-found></root>"`);
  });

  test('can render in concurrent mode correctly', async () => {
    jest.useRealTimers();
    let x = 0;
    const routes: Routes = [
      {
        path: 'first',
        component: component(() => <div>first</div>),
      },
      {
        path: 'second',
        component: component(() => <div>second</div>),
      },
      {
        path: 'third',
        component: component(() => <div>third</div>),
      },
      {
        path: '**',
        redirectTo: 'first',
      },
    ];

    const Content = component<{ slot: DarkElement }>(({ slot }) => {
      useLayoutEffect(() => {
        const linkToFirst = document.querySelector('a[href="/first"]');
        const linkToSecond = document.querySelector('a[href="/second"]');
        const linkToThird = document.querySelector('a[href="/third"]');
        const map = {
          1: () => {
            expect(host.innerHTML).toMatchInlineSnapshot(
              `"<a href="/first">first</a><a href="/second">second</a><a href="/third">third</a><div><div>first</div></div>"`,
            );
          },
          2: () => {
            expect(host.innerHTML).toMatchInlineSnapshot(
              `"<a href="/first" class="active-link">first</a><a href="/second">second</a><a href="/third">third</a><div><div>first</div></div>"`,
            );
            click(linkToSecond);
          },
          3: () => {
            expect(host.innerHTML).toMatchInlineSnapshot(
              `"<a href="/first">first</a><a href="/second" class="active-link">second</a><a href="/third">third</a><div><div>second</div></div>"`,
            );
            click(linkToThird);
          },
          4: () => {
            expect(host.innerHTML).toMatchInlineSnapshot(
              `"<a href="/first">first</a><a href="/second">second</a><a href="/third" class="active-link">third</a><div><div>third</div></div>"`,
            );
            click(linkToFirst);
          },
          5: () => {
            expect(host.innerHTML).toMatchInlineSnapshot(
              `"<a href="/first" class="active-link">first</a><a href="/second">second</a><a href="/third">third</a><div><div>first</div></div>"`,
            );
          },
        };

        x++;
        map[x]();
      });

      return (
        <>
          <NavLink to='/first'>first</NavLink>
          <NavLink to='/second'>second</NavLink>
          <NavLink to='/third'>third</NavLink>
          <div>{slot}</div>
        </>
      );
    });

    const App = component(() => {
      return (
        <Router routes={routes} mode='concurrent'>
          {slot => <Content>{slot}</Content>}
        </Router>
      );
    });

    document.body.appendChild(host);
    render(<App />);
    await sleep(200);
  });
});
