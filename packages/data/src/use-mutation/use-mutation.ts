import {
  logError,
  detectIsFunction,
  useUpdate,
  useMemo,
  throwThis,
  __useSSR as useSSR,
  __useInSuspense as useInSuspense,
} from '@dark-engine/core';

import { type InMemoryCache, checkCache } from '../cache';
import { useCache } from '../client';

type UseMutationOptions<T, P> = {
  refetchQueries?: Array<string>;
  onStart?: () => void;
  onSuccess?: (x: OnSuccessOptions<T, P>) => void;
  onError?: (err: any) => void;
};

function useMutation<M extends Mutation>(
  key: string,
  mutation: M,
  options?: UseMutationOptions<Awaited<ReturnType<M>>, Parameters<M>>,
) {
  type Params = Parameters<M>;
  type AwaitedResult = Awaited<ReturnType<M>>;
  const { refetchQueries = [], onStart, onSuccess, onError } = options || {};
  const scope = useMemo<Scope<ReturnType<M>>>(() => ({ promise: null }), []);
  const cache = useCache();
  const update = useUpdate();
  checkCache(cache);
  const { isServer } = useSSR();
  const inSuspense = useInSuspense();
  const state = useMemo<State<AwaitedResult>>(() => ({ isFetching: false, data: null, error: null }), []);
  const make = async (...args: Params) => {
    let data: AwaitedResult = null;

    state.isFetching = true;
    state.error = null;
    cache.__emit({ type: 'mutation', phase: 'start', key, data: args });
    !isServer && detectIsFunction(onStart) && onStart();

    try {
      data = (await mutation(...args)) as AwaitedResult;
      state.data = data;
      cache.__emit({ type: 'mutation', phase: 'finish', key, data });
      !isServer && detectIsFunction(onSuccess) && onSuccess({ cache, args, data });
      refetchQueries.forEach(key => cache.invalidate(key));
    } catch (err) {
      logError(err);
      state.error = String(err);
      cache.__emit({ type: 'mutation', phase: 'error', key, data: err });
      !isServer && detectIsFunction(onError) && onError(err);
    } finally {
      state.isFetching = false;

      if (!isServer) {
        update();
      }
    }

    return data;
  };

  const mutate = (...args: Params) => {
    const promise = make(...args);

    if (inSuspense) {
      scope.promise = promise;
    }

    update();
    return promise;
  };

  const result: MutationResult<AwaitedResult> = {
    isFetching: state.isFetching,
    data: state.data,
    error: state.error,
  };

  if (scope.promise) {
    const { promise } = scope;

    scope.promise = null;
    throwThis(promise);
  }

  return [mutate, result] as [(...args: Params) => ReturnType<M>, MutationResult<AwaitedResult>];
}

type Scope<T> = {
  promise: Promise<T>;
};

type OnSuccessOptions<T, P> = { cache: InMemoryCache; data: T; args: P };
type State<T> = { isFetching: boolean; data: T; error: string };
type MutationResult<T> = Pick<State<T>, 'isFetching' | 'data' | 'error'>;
type Mutation = (...args: Array<unknown>) => Promise<unknown>;

export { useMutation };
