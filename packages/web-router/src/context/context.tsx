import { createContext, useContext } from '@dark-engine/core';

import { type RouterLocation } from '../location';
import { type RouterHistory } from '../history';
import { type Route } from '../create-routes';
import { illegal } from '../utils';

export type ActiveRouteContextValue = {
  location: RouterLocation;
  params: Map<string, string>;
  route: Route;
};

const ActiveRouteContext = createContext<ActiveRouteContextValue>(null, { displayName: 'ActiveRoute' });

const useActiveRouteContext = () => useContext(ActiveRouteContext);

export type RouterHistoryContextValue = {
  history: RouterHistory;
};

const RouterHistoryContext = createContext<RouterHistoryContextValue>(null, { displayName: 'RouterHistory' });

const useRouterHistoryContext = () => useContext(RouterHistoryContext);

const CurrentPathContext = createContext<string>(null, { displayName: 'CurrentPath' });

const useCurrentPathContext = () => useContext(CurrentPathContext);

function checkContextValue(value: ActiveRouteContextValue | RouterHistoryContextValue) {
  if (!value) {
    illegal(`Illegal hook's invoke outside router!`);
  }
}

export {
  ActiveRouteContext,
  useActiveRouteContext,
  RouterHistoryContext,
  useRouterHistoryContext,
  CurrentPathContext,
  useCurrentPathContext,
  checkContextValue,
};
