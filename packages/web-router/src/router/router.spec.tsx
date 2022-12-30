/** @jsx h */
import { createTestHostNode, createReplacerString } from '@test-utils';
import { h, createComponent } from '@dark-engine/core';
import { createRoot } from '@dark-engine/platform-browser';
import { type Routes } from '../create-routes';
import { Router } from './router';

type AppProps = {
  url: string;
};

let host: HTMLElement = null;
const replacer = createReplacerString();

beforeEach(() => {
  host = createTestHostNode();
});

afterAll(() => {
  host = null;
});

describe('[router/rendering]', () => {
  test('can render simple routes correctly', () => {
    const routes: Routes = [
      {
        path: 'first',
        component: createComponent(() => <div>first</div>),
      },
      {
        path: 'second',
        component: createComponent(() => <div>second</div>),
      },
      {
        path: 'third',
        component: createComponent(() => <div>third</div>),
      },
    ];

    const App = createComponent<AppProps>(({ url }) => {
      return (
        <Router routes={routes} url={url}>
          {slot => slot}
        </Router>
      );
    });

    const root = createRoot(host);

    root.render(<App url='/first' />);
    expect(host.innerHTML).toBe(`<div>first</div>`);

    root.render(<App url='/second' />);
    expect(host.innerHTML).toBe(`<div>second</div>`);

    root.render(<App url='/third' />);
    expect(host.innerHTML).toBe(`<div>third</div>`);

    root.unmount();
  });

  test('can render incorrect routes correctly', () => {
    const routes: Routes = [
      {
        path: 'first',
        component: createComponent(() => <div>first</div>),
      },
      {
        path: 'second',
        component: createComponent(() => <div>second</div>),
      },
      {
        path: 'third',
        component: createComponent(() => <div>third</div>),
      },
    ];

    const App = createComponent<AppProps>(({ url }) => {
      return (
        <Router routes={routes} url={url}>
          {slot => slot}
        </Router>
      );
    });

    const root = createRoot(host);

    root.render(<App url='/' />);
    expect(host.innerHTML).toBe(replacer);

    root.render(<App url='' />);
    expect(host.innerHTML).toBe(replacer);

    root.render(<App url='/xxx' />);
    expect(host.innerHTML).toBe(replacer);

    root.render(<App url='/second' />);
    expect(host.innerHTML).toBe(`<div>second</div>`);

    root.render(<App url='/second1' />);
    expect(host.innerHTML).toBe(replacer);

    root.render(<App url='/second/1' />);
    expect(host.innerHTML).toBe(replacer);

    root.render(<App url='/first/1/xxx' />);
    expect(host.innerHTML).toBe(replacer);

    root.render(<App url='/some/broken/url' />);
    expect(host.innerHTML).toBe(replacer);

    root.unmount();
  });

  test('can render nested routes correctly', () => {
    const routes: Routes = [
      {
        path: 'first',
        component: createComponent(() => <div>first</div>),
      },
      {
        path: 'second',
        component: createComponent(({ slot }) => <second>{slot}</second>),
        children: [
          {
            path: 'a',
            component: createComponent(() => <div>a</div>),
          },
          {
            path: 'b',
            component: createComponent(() => <div>b</div>),
          },
        ],
      },
      {
        path: 'third',
        component: createComponent(() => <div>third</div>),
      },
    ];

    const App = createComponent<AppProps>(({ url }) => {
      return (
        <Router routes={routes} url={url}>
          {slot => slot}
        </Router>
      );
    });

    const root = createRoot(host);

    root.render(<App url='/first' />);
    expect(host.innerHTML).toBe(`<div>first</div>`);

    root.render(<App url='/second' />);
    expect(host.innerHTML).toBe(`<second>${replacer}</second>`);

    root.render(<App url='/second/a' />);
    expect(host.innerHTML).toBe(`<second><div>a</div></second>`);

    root.render(<App url='/second/b' />);
    expect(host.innerHTML).toBe(`<second><div>b</div></second>`);

    root.render(<App url='/second/b/some/broken/route' />);
    expect(host.innerHTML).toBe(replacer);

    root.render(<App url='/third' />);
    expect(host.innerHTML).toBe(`<div>third</div>`);

    root.unmount();
  });

  test('can render deeply nested routes correctly', () => {
    const routes: Routes = [
      {
        path: 'first',
        component: createComponent(() => <div>first</div>),
      },
      {
        path: 'second',
        component: createComponent(({ slot }) => <second>{slot}</second>),
        children: [
          {
            path: 'a',
            component: createComponent(({ slot }) => <a>{slot}</a>),
            children: [
              {
                path: '1',
                component: createComponent(() => <div>1</div>),
              },
              {
                path: '2',
                component: createComponent(() => <div>2</div>),
              },
            ],
          },
          {
            path: 'b',
            component: createComponent(({ slot }) => <b>{slot}</b>),
            children: [
              {
                path: '1',
                component: createComponent(() => <div>1</div>),
              },
              {
                path: '2',
                component: createComponent(() => <div>2</div>),
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

    const App = createComponent<AppProps>(({ url }) => {
      return (
        <Router routes={routes} url={url}>
          {slot => slot}
        </Router>
      );
    });

    const root = createRoot(host);

    root.render(<App url='/first' />);
    expect(host.innerHTML).toBe(`<div>first</div>`);

    root.render(<App url='/second' />);
    expect(host.innerHTML).toBe(`<second>${replacer}</second>`);

    root.render(<App url='/third' />);
    expect(host.innerHTML).toBe(`<div>third</div>`);

    root.render(<App url='/second/a' />);
    expect(host.innerHTML).toBe(`<second><a>${replacer}</a></second>`);

    root.render(<App url='/second/a/1' />);
    expect(host.innerHTML).toBe(`<second><a><div>1</div></a></second>`);

    root.render(<App url='/second/a/2' />);
    expect(host.innerHTML).toBe(`<second><a><div>2</div></a></second>`);

    root.render(<App url='/second/b' />);
    expect(host.innerHTML).toBe(`<second><b>${replacer}</b></second>`);

    root.render(<App url='/second/b/1' />);
    expect(host.innerHTML).toBe(`<second><b><div>1</div></b></second>`);

    root.render(<App url='/second/b/2' />);
    expect(host.innerHTML).toBe(`<second><b><div>2</div></b></second>`);

    root.unmount();
  });

  test('can work with redirects correctly', () => {
    const routes: Routes = [
      {
        path: 'first',
        redirectTo: 'second',
      },
      {
        path: 'second',
        component: createComponent(() => <div>second</div>),
      },
      {
        path: 'third',
        component: createComponent(() => <div>third</div>),
      },
    ];

    const App = createComponent<AppProps>(({ url }) => {
      return (
        <Router routes={routes} url={url}>
          {slot => slot}
        </Router>
      );
    });

    const root = createRoot(host);

    root.render(<App url='/first' />);
    expect(host.innerHTML).toBe(`<div>second</div>`);

    root.render(<App url='/second' />);
    expect(host.innerHTML).toBe(`<div>second</div>`);

    root.render(<App url='/third' />);
    expect(host.innerHTML).toBe(`<div>third</div>`);

    root.unmount();
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
        component: createComponent(() => <div>fourth</div>),
      },
    ];
    const App = createComponent<AppProps>(({ url }) => {
      return (
        <Router routes={routes} url={url}>
          {slot => slot}
        </Router>
      );
    });

    const root = createRoot(host);

    root.render(<App url='/first' />);
    expect(host.innerHTML).toBe(`<div>fourth</div>`);

    root.render(<App url='/second' />);
    expect(host.innerHTML).toBe(`<div>fourth</div>`);

    root.render(<App url='/third' />);
    expect(host.innerHTML).toBe(`<div>fourth</div>`);

    root.render(<App url='/fourth' />);
    expect(host.innerHTML).toBe(`<div>fourth</div>`);

    root.unmount();
  });

  test('can work with redirects in nested routes correctly', () => {
    const routes: Routes = [
      {
        path: 'first',
        redirectTo: 'second',
      },
      {
        path: 'second',
        component: createComponent(({ slot }) => <second>{slot}</second>),
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
            component: createComponent(() => <div>c</div>),
          },
        ],
      },
      {
        path: 'third',
        redirectTo: 'fourth',
      },
      {
        path: 'fourth',
        component: createComponent(() => <div>fourth</div>),
      },
    ];

    const App = createComponent<AppProps>(({ url }) => {
      return (
        <Router routes={routes} url={url}>
          {slot => slot}
        </Router>
      );
    });

    const root = createRoot(host);

    root.render(<App url='/second/a' />);
    expect(host.innerHTML).toBe(`<second><div>c</div></second>`);

    root.render(<App url='/second/b' />);
    expect(host.innerHTML).toBe(`<second><div>c</div></second>`);

    root.render(<App url='/second/c' />);
    expect(host.innerHTML).toBe(`<second><div>c</div></second>`);

    root.unmount();
  });

  test('can work with root redirect correctly', () => {
    const routes: Routes = [
      {
        path: 'first',
        component: createComponent(() => <div>first</div>),
      },
      {
        path: '',
        redirectTo: 'first',
      },
    ];

    const App = createComponent<AppProps>(({ url }) => {
      return (
        <Router routes={routes} url={url}>
          {slot => slot}
        </Router>
      );
    });

    const root = createRoot(host);

    root.render(<App url='/' />);
    expect(host.innerHTML).toBe(`<div>first</div>`);

    root.unmount();
  });

  test('can work with root redirect with full path strategy correctly', () => {
    const routes: Routes = [
      {
        path: 'first',
        component: createComponent(() => <div>first</div>),
      },
      {
        path: '/',
        redirectTo: '/first',
        pathMatch: 'full',
      },
    ];
    const App = createComponent<AppProps>(({ url }) => {
      return (
        <Router routes={routes} url={url}>
          {slot => slot}
        </Router>
      );
    });

    const root = createRoot(host);

    root.render(<App url='/' />);
    expect(host.innerHTML).toBe(`<div>first</div>`);

    root.unmount();
  });

  test('can combine match strategies correctly', () => {
    const routes: Routes = [
      {
        path: 'first',
        component: createComponent(() => <div>first</div>),
      },
      {
        path: 'second',
        component: createComponent(({ slot }) => <second>{slot}</second>),
        children: [
          {
            path: '/second/a',
            redirectTo: '/second/b',
            pathMatch: 'full',
          },
          {
            path: 'b',
            component: createComponent(() => <div>b</div>),
          },
        ],
      },
    ];

    const App = createComponent<AppProps>(({ url }) => {
      return (
        <Router routes={routes} url={url}>
          {slot => slot}
        </Router>
      );
    });

    const root = createRoot(host);

    root.render(<App url='/second/a' />);
    expect(host.innerHTML).toBe(`<second><div>b</div></second>`);

    root.unmount();
  });

  test('can work with wildcard routes correctly', () => {
    const routes: Routes = [
      {
        path: 'first',
        component: createComponent(() => <div>first</div>),
      },
      {
        path: 'second',
        component: createComponent(({ slot }) => <second>{slot}</second>),
        children: [
          {
            path: 'a',
            component: createComponent(() => <div>a</div>),
          },
          {
            path: 'b',
            component: createComponent(() => <div>b</div>),
          },
        ],
      },
      {
        path: '',
        redirectTo: 'first',
      },
      {
        path: '**',
        component: createComponent(() => <div>404</div>),
      },
    ];

    const App = createComponent<AppProps>(({ url }) => {
      return (
        <Router routes={routes} url={url}>
          {slot => slot}
        </Router>
      );
    });

    const root = createRoot(host);

    root.render(<App url='/' />);
    expect(host.innerHTML).toBe(`<div>first</div>`);

    root.render(<App url='/first' />);
    expect(host.innerHTML).toBe(`<div>first</div>`);

    root.render(<App url='/second/a' />);
    expect(host.innerHTML).toBe(`<second><div>a</div></second>`);

    root.render(<App url='/broken/url' />);
    expect(host.innerHTML).toBe(`<div>404</div>`);

    root.unmount();
  });

  test('can work with wildcard in nested routes correctly', () => {
    const routes: Routes = [
      {
        path: 'first',
        component: createComponent(() => <div>first</div>),
      },
      {
        path: 'second',
        component: createComponent(({ slot }) => <second>{slot}</second>),
        children: [
          {
            path: 'a',
            component: createComponent(() => <div>a</div>),
          },
          {
            path: 'b',
            component: createComponent(() => <div>b</div>),
          },
          {
            path: '**',
            component: createComponent(() => <div>404</div>),
          },
        ],
      },
      {
        path: '',
        redirectTo: 'first',
      },
      {
        path: '**',
        component: createComponent(() => <div>404</div>),
      },
    ];

    const App = createComponent<AppProps>(({ url }) => {
      return (
        <Router routes={routes} url={url}>
          {slot => slot}
        </Router>
      );
    });

    const root = createRoot(host);

    root.render(<App url='/second/a' />);
    expect(host.innerHTML).toBe(`<second><div>a</div></second>`);

    root.render(<App url='/second/broken/url' />);
    expect(host.innerHTML).toBe(`<second><div>404</div></second>`);

    root.render(<App url='/second/a/broken/url' />);
    expect(host.innerHTML).toBe(`<second><div>404</div></second>`);

    root.render(<App url='/broken/url' />);
    expect(host.innerHTML).toBe(`<div>404</div>`);

    root.unmount();
  });

  test('can combine wildcard routes and redirects in nested routes correctly', () => {
    const routes: Routes = [
      {
        path: 'first',
        component: createComponent(() => <div>first</div>),
      },
      {
        path: 'second',
        component: createComponent(({ slot }) => <second>{slot}</second>),
        children: [
          {
            path: 'a',
            component: createComponent(() => <div>a</div>),
          },
          {
            path: 'b',
            component: createComponent(() => <div>b</div>),
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

    const App = createComponent<AppProps>(({ url }) => {
      return (
        <Router routes={routes} url={url}>
          {slot => slot}
        </Router>
      );
    });

    const root = createRoot(host);

    root.render(<App url='/second/a' />);
    expect(host.innerHTML).toBe(`<second><div>a</div></second>`);

    root.render(<App url='/second/broken/url' />);
    expect(host.innerHTML).toBe(`<second><div>a</div></second>`);

    root.render(<App url='/second/a/broken/url' />);
    expect(host.innerHTML).toBe(`<second><div>a</div></second>`);

    root.render(<App url='/broken/url' />);
    expect(host.innerHTML).toBe(`<div>first</div>`);

    root.unmount();
  });

  test('can combine wildcard routes and redirects in deeply nested routes correctly', () => {
    const routes: Routes = [
      {
        path: 'first',
        component: createComponent(() => <div>first</div>),
      },
      {
        path: 'second',
        component: createComponent(({ slot }) => <second>{slot}</second>),
        children: [
          {
            path: 'a',
            component: createComponent(() => <div>a</div>),
          },
          {
            path: 'b',
            component: createComponent(({ slot }) => <b>{slot}</b>),
            children: [
              {
                path: '1',
                component: createComponent(() => <div>1</div>),
              },
              {
                path: '2',
                component: createComponent(() => <div>2</div>),
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

    const App = createComponent<AppProps>(({ url }) => {
      return (
        <Router routes={routes} url={url}>
          {slot => slot}
        </Router>
      );
    });

    const root = createRoot(host);

    root.render(<App url='/second/a' />);
    expect(host.innerHTML).toBe(`<second><div>a</div></second>`);

    root.render(<App url='/second/broken/url' />);
    expect(host.innerHTML).toBe(`<second><div>a</div></second>`);

    root.render(<App url='/second/a/broken/url' />);
    expect(host.innerHTML).toBe(`<second><div>a</div></second>`);

    root.render(<App url='/second/b' />);
    expect(host.innerHTML).toBe(`<second><b>${replacer}</b></second>`);

    root.render(<App url='/second/b/' />);
    expect(host.innerHTML).toBe(`<second><b>${replacer}</b></second>`);

    root.render(<App url='/second/b/1' />);
    expect(host.innerHTML).toBe(`<second><b><div>1</div></b></second>`);

    root.render(<App url='/second/b/1/' />);
    expect(host.innerHTML).toBe(`<second><b><div>1</div></b></second>`);

    root.render(<App url='/second/b/broken/url' />);
    expect(host.innerHTML).toBe(`<second><b><div>1</div></b></second>`);

    root.render(<App url='/second/b/1/broken/url' />);
    expect(host.innerHTML).toBe(`<second><b><div>1</div></b></second>`);

    root.render(<App url='/second/b/2/broken/url' />);
    expect(host.innerHTML).toBe(`<second><b><div>1</div></b></second>`);

    root.render(<App url='/broken/url' />);
    expect(host.innerHTML).toBe(`<div>first</div>`);

    root.unmount();
  });

  test('can work with parameters correctly', () => {
    const routes: Routes = [
      {
        path: 'first',
        component: createComponent(() => <div>first</div>),
      },
      {
        path: 'second/:id',
        component: createComponent(({ slot }) => <second>{slot}</second>),
        children: [
          {
            path: 'a',
            component: createComponent(() => <div>a</div>),
          },
          {
            path: 'b/:id',
            component: createComponent(() => <div>b</div>),
          },
        ],
      },
    ];

    const App = createComponent<AppProps>(({ url }) => {
      return (
        <Router routes={routes} url={url}>
          {slot => slot}
        </Router>
      );
    });

    const root = createRoot(host);

    root.render(<App url='/second/1/a/' />);
    expect(host.innerHTML).toBe(`<second><div>a</div></second>`);

    root.render(<App url='/second/2/a/' />);
    expect(host.innerHTML).toBe(`<second><div>a</div></second>`);

    root.render(<App url='/second/1/b/2' />);
    expect(host.innerHTML).toBe(`<second><div>b</div></second>`);

    root.render(<App url='/second/100/b/2000' />);
    expect(host.innerHTML).toBe(`<second><div>b</div></second>`);

    root.unmount();
  });

  test('can render flatten tree routes', () => {
    const routes: Routes = [
      {
        path: 'first',
        component: createComponent(() => <div>first</div>),
      },
      {
        path: 'second/a/1',
        component: createComponent(() => <div>second/a/1</div>),
      },
      {
        path: 'second/a/2',
        component: createComponent(() => <div>second/a/2</div>),
      },
      {
        path: 'second/a',
        component: createComponent(() => <div>second/a</div>),
      },
      {
        path: 'second/b',
        redirectTo: 'third',
      },
      {
        path: 'second',
        component: createComponent(() => <div>second</div>),
      },
      {
        path: 'third',
        component: createComponent(() => <div>third</div>),
      },
      {
        path: '**',
        redirectTo: 'first',
      },
    ];

    const App = createComponent<AppProps>(({ url }) => {
      return (
        <Router routes={routes} url={url}>
          {slot => slot}
        </Router>
      );
    });

    const root = createRoot(host);

    root.render(<App url='/' />);
    expect(host.innerHTML).toBe(`<div>first</div>`);

    root.render(<App url='/first' />);
    expect(host.innerHTML).toBe(`<div>first</div>`);

    root.render(<App url='/second' />);
    expect(host.innerHTML).toBe(`<div>second</div>`);

    root.render(<App url='/second/a' />);
    expect(host.innerHTML).toBe(`<div>second/a</div>`);

    root.render(<App url='/second/a/1' />);
    expect(host.innerHTML).toBe(`<div>second/a/1</div>`);

    root.render(<App url='/second/a/2' />);
    expect(host.innerHTML).toBe(`<div>second/a/2</div>`);

    root.render(<App url='/second/b' />);
    expect(host.innerHTML).toBe(`<div>third</div>`);

    root.render(<App url='/third' />);
    expect(host.innerHTML).toBe(`<div>third</div>`);

    root.unmount();
  });

  test('can render combined tree strategies', () => {
    const routes: Routes = [
      {
        path: 'first',
        component: createComponent(() => <div>first</div>),
      },
      {
        path: 'second/a',
        component: createComponent(({ slot }) => <second:a>{slot}</second:a>),
        children: [
          {
            path: '1',
            component: createComponent(() => <div>1</div>),
          },
          {
            path: '2',
            component: createComponent(() => <div>2</div>),
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
        component: createComponent(() => <div>second</div>),
      },
      {
        path: 'third',
        component: createComponent(() => <div>third</div>),
      },
      {
        path: '**',
        redirectTo: 'first',
      },
    ];

    const App = createComponent<AppProps>(({ url }) => {
      return (
        <Router routes={routes} url={url}>
          {slot => slot}
        </Router>
      );
    });

    const root = createRoot(host);

    root.render(<App url='/' />);
    expect(host.innerHTML).toBe(`<div>first</div>`);

    root.render(<App url='/first' />);
    expect(host.innerHTML).toBe(`<div>first</div>`);

    root.render(<App url='/second' />);
    expect(host.innerHTML).toBe(`<div>second</div>`);

    root.render(<App url='/second/a' />);
    expect(host.innerHTML).toBe(`<second:a><div>2</div></second:a>`);

    root.render(<App url='/second/a/1' />);
    expect(host.innerHTML).toBe(`<second:a><div>1</div></second:a>`);

    root.render(<App url='/second/a/2' />);
    expect(host.innerHTML).toBe(`<second:a><div>2</div></second:a>`);

    root.render(<App url='/second/b' />);
    expect(host.innerHTML).toBe(`<div>third</div>`);

    root.render(<App url='/third' />);
    expect(host.innerHTML).toBe(`<div>third</div>`);

    root.unmount();
  });
});
