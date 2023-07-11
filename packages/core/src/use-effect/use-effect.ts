import { detectIsUndefined, detectIsFunction, detectAreDepsDifferent } from '../helpers';
import { currentFiberStore, effectsStore } from '../scope';
import type { Fiber, Hook, HookValue } from '../fiber';
import type { Effect, DropEffect } from './types';

const $$useEffect = Symbol('use-effect');

const { useEffect, hasEffects, dropEffects } = createEffect($$useEffect, effectsStore);

function createEffect(token: Symbol, store: typeof effectsStore) {
  function useEffect(effect: Effect, deps?: Array<any>) {
    const fiber = currentFiberStore.get();
    const hook = fiber.hook as Hook<HookValue<DropEffect>>;
    const { idx, values } = hook;
    const runEffect = () => {
      values[idx] = {
        deps,
        token,
        value: undefined,
      };

      store.add(() => {
        values[idx].value = effect();
      });
    };

    if (detectIsUndefined(values[idx])) {
      runEffect();
    } else {
      const { deps: prevDeps, value: cleanup } = values[idx];
      const isDepsDifferent = deps ? detectAreDepsDifferent(deps, prevDeps) : true;

      if (isDepsDifferent) {
        detectIsFunction(cleanup) && cleanup();
        runEffect();
      }
    }

    hook.idx++;
  }

  function hasEffects(fiber: Fiber) {
    const { values } = fiber.hook as Hook<HookValue>;
    const hasEffect = values.some(x => x.token === token);

    return hasEffect;
  }

  function dropEffects(hook: Hook<HookValue<DropEffect>>) {
    for (const value of hook.values) {
      value.token === token && value.value && value.value();
    }
  }

  return {
    useEffect,
    hasEffects,
    dropEffects,
  };
}

export { useEffect, hasEffects, dropEffects, createEffect };
