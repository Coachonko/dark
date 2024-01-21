# @dark-engine/data 🌖

Declarative queries and mutations for Dark

Basic idea: A single API contract controlled by `typescript`, and different API implementations depending on the platform: `server` or `client`.
When rendering on the server, query will execute server code; when rendering on the client, it will execute client code. The implementation is not important to us because it is asynchronous and corresponds to a single contract. When rendering on the server, the server serializes the state of the query hooks. During hydration (if we render to the browser), the state coming from the server will be written to the necessary memory cells of the hooks as if the data was loaded from the browser.

This approach also eliminates the need to parse the request url on the server in order to understand what data needs to be prefetched for our application, because the application directly uses server-side methods on the server.

[More about Dark](https://github.com/atellmer/dark)

## Features
- 📝 Declarative
- 📬 App-level cache system
- 💾 Shared state between server and client
- ⚙️ Server asynchronous code in the app (in SSR)
- 🔄 Auto refetches
- 🌟 Optimistic updates
- 🥱 lazy queries support
- 🦾 All platforms: server, browser, native, desktop
- 🚫 No deps
- 📦 Small size (3 kB gzipped)

## Installation
npm:
```
npm install @dark-engine/data
```

yarn:
```
yarn add @dark-engine/data
```

CDN:
```html
<script src="https://unpkg.com/@dark-engine/data/dist/umd/dark-data.production.min.js"></script>
```

## Usage

```tsx
const { isFetching, data, error } = useQuery('users', api.fetchUsers);

if (isFetching && !data) return <div>Loading...</div>;
if (error) return <div>{error}</div>;

<ul>
  {data.map(x => <li key={x.id}>{x.name}</li>)}
</ul>
```

## API

```tsx
import {
  DataClient,
  DataClientProvider,
  InMemoryCache,
  useClient,
  useApi,
  useCache,
  useQuery,
  useLazyQuery,
  useMutation,
  VERSION,
} from '@dark-engine/data';
```

## `DataClient`, `InMemoryCache` and `DataClientProvider`

`DataClient` is a required object that includes a third-party asynchronous API and a cache object in which all results of calls to the API will be stored.

```tsx
// contract between server and browser
export type Api = {
  fetchUsers: () => Promise<Array<User>>;
}
```

```tsx
// on the server side
const api: Api = {
  fetchUsers: () => db.collection('users').find({}).toArray(),
}
```

```tsx
// on the browser side
const api: Api = {
  fetchUsers: () => fetch('url/to/api/users'),
}
```

```tsx
// in app
const App = component<{ api: Api }>(({ api }) => {
  const client = useMemo(() => new DataClient({ api, cache: new InMemoryCache() }), []);

  return (
    <DataClientProvider client={client}>
      ...
    </DataClientProvider>
  );
});
```

The full example of code see in `/examples`.

## `Query`

A `query` is an asynchronous request that appears synchronous in code, returning data and a loading status flag so that the wait interface can be rendered.

#### `useQuery`

`useQuery` hook is designed to work with asynchronous resources, such as network requests. When rendered in the browser, it knows how to interact with `Suspense`, display the loader, and also the error, if there is one. When rendering on the server, it immediately begins to load the resource in order to provide useful asynchronous content to the server. When hydrated, the state of the hook is restored as if it were running in the browser. This allows us to solve the problem with asynchronous data and how to work with it in the same way both in the browser and on the server.

```tsx
const { isFetching, data, error, refetch } = useQuery('users', api.fetchUsers);

if (isFetching && !data) return <div>Loading...</div>;
if (error) return <div>{error}</div>;

<ul>
  {data.map(x => <li key={x.id}>{x.name}</li>)}
</ul>
```

If you need to reload data depending on props, you can use `variables`.
In this example, when the `id` changes, a new fetch will be produced, the data of which will be stored in the cache with this new `id`.

```tsx
const { id } = props;
const { isFetching, data, error } = useQuery('user',  ({ id }) => api.fetchUser(id), {
  variables: { id },
  extractId: x => x.id,
});

...

<>
  <div>{data.id}</div>
  <div>{data.name}</div>
</>
```

#### `useLazyQuery`

Standard queries begin loading after the component is mounted in the tree. If you don't need this behavior, you can use `useLazyQuery`, which returns the content loading method and call it then you need it.

```tsx
const [fetchUsers, { isFetching, data, error }] = useLazyQuery('users', api.fetchUsers);

...

<button onClick={() => fetchUsers()}>Load</button>
```

## `Mutation`

A `mutation` is any asynchronous change that changes the state of the application.

#### `useMutation`

```tsx
const [addUser, { isFetching, data, error }] = useMutation('add-user', api.addUser);

...

<button onClick={() => addUser(newUser)}>add</button>
```

## Refetches

When you specify a set of related keys, the cached data for those keys will be marked as requiring updating. If there is or appears a `query` in the component tree that requests this key, it will perform a refresh and update the data in the `cache`. This allows you to automatically and reactively control the relevance of asynchronous data.

```tsx
const [addUser, { isFetching }] = useMutation('add-user', api.addUser, {
  refetchQueries: ['users']
});
```

## Optimistic updates

Sometimes you may want to update associated data immediately, rather than waiting for a second request to the server. For this, there is an optimistic update scenario in which, after a successful mutation, the data in the cache is replaced with new ones and marked as requiring final synchronization with the server. At the same time, it will look seamless to the user.

```tsx
const [addUser, { isFetching }] = useMutation('add-user', api.addProduct, {
  onSuccess: ({ cache, data: user }) => {
    const record = cache.read<Array<User>>('users');

    if (record) {
      const users = record.data;

      users.push(user);
      cache.optimistic('users', users);
    }
  },
});
```

## `useClient`, `useApi` and `useCache`

This is a set of utility hooks, each of which returns its own entity. The most important hook here is the `useApi`, as it allows you to move the request logic out of components into abstract hooks.

```tsx
function useUser(id: number) {
  const api = useApi();

  return useQuery('user', ({ id }) => api.fetchUser(id), {
    variables: { id },
    extractId: x => x.id,
  });
}
```

```tsx
const { isFetching, data: user } = useUser(id);

<>
  <div>{user.id}</div>
  <div>{user.name}</div>
</>
```

## Events

When working with queries and mutations, the client produces events that you can subscribe to in order to log or synchronize data with another part of the application state.

```tsx
const client = useClient();

// queries and mutations events
client.monitor(x => console.log(x)) // {type: 'query', phase: 'start', key: 'users', data: [...]}

// cache events (write, optimistic, invalidate, delete)
client.subscribe(x => console.log(x)); //{ type: 'write', key: 'users', record: {...} }
```

# LICENSE

MIT © [Alex Plex](https://github.com/atellmer)

