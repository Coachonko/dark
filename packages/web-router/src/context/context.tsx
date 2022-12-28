import { createContext, useContext } from '@dark-engine/core';
import { type RouterHistory } from '../history';
import { type Route } from '../create-routes';

export type ActiveRouteContextValue = {
  paramsMap: Map<string, string>;
  matched: Route;
  url: string;
};

const ActiveRouteContext = createContext<ActiveRouteContextValue>(null, { displayName: 'ActiveRoute' });

function useActiveRouteContext() {
  const value = useContext(ActiveRouteContext);

  return value;
}

export type RouterHistoryContextValue = {
  history: RouterHistory;
};

const RouterHistoryContext = createContext<RouterHistoryContextValue>(null, { displayName: 'RouterHistory' });

function useRouterHistoryContext() {
  const value = useContext(RouterHistoryContext);

  return value;
}

function checkContextValue(value: ActiveRouteContextValue | RouterHistoryContextValue) {
  if (!value) {
    throw new Error('[web-router]:  Illegal invoke hook outside router!');
  }
}

export { ActiveRouteContext, useActiveRouteContext, RouterHistoryContext, useRouterHistoryContext, checkContextValue };
