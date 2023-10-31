import { useMemo, useUpdate, useLayoutEffect, detectIsFunction } from '@dark-engine/core';

import { type SpringValue } from '../shared';
import { type Updater, type GetPartialConfig, MotionController } from '../controller';

type UseMotionOptions<T extends string> = {
  from: SpringValue<T>;
  to?: SpringValue<T>;
  config?: GetPartialConfig<T>;
  loop?: boolean;
  reverse?: boolean;
  outside?: (spring: SpringValue<T>) => void;
};

function useMotion<T extends string>(options: UseMotionOptions<T>): [SpringValue<T>, MotionApi<T>] {
  const { from, to, config, loop, reverse, outside } = options;
  const update$ = useUpdate();
  const update = (value: SpringValue<T>) => (detectIsFunction(outside) ? outside(value) : update$());
  const scope = useMemo(() => ({ controller: new MotionController(from, to, update, config) }), []);
  const value = scope.controller.getValue();
  const api = useMemo<MotionApi<T>>(
    () => ({
      start: (fn?: Updater<T>) => {
        scope.controller.start(((pv: SpringValue<T>) => ({ ...to, ...(fn && fn(pv)) })) as Updater<T>);
      },
      reverse: () => scope.controller.reverse(),
      pause: () => scope.controller.pause(),
      reset: () => scope.controller.reset(),
      value: () => scope.controller.getValue(),
    }),
    [],
  );

  useLayoutEffect(() => () => scope.controller.cancel(), []);

  useLayoutEffect(() => {
    if (!loop) return;

    const unsubscribe = scope.controller.subscribe('end', ({ fromReverse }) => {
      if (reverse) {
        fromReverse ? api.start() : api.reverse();
      } else {
        api.reset();
        api.start();
      }
    });

    return unsubscribe;
  }, [loop, reverse]);

  return [value, api];
}

export type MotionApi<T extends string> = {
  start: (fn?: Updater<T>) => void;
  reverse: () => void;
  pause: () => void;
  reset: () => void;
  value: () => SpringValue<T>;
};

export { useMotion };
