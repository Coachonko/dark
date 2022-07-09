import { detectIsUndefined } from '@dark/core/internal/helpers';
import { componentFiberHelper } from '@dark/core/scope';
import { detectIsDepsDifferent } from '@dark/core/shared';

function useCallback<T = Function>(callback: T, deps: Array<any>): T {
  const fiber = componentFiberHelper.get();
  const { hook } = fiber;
  const { idx, values } = hook;

  if (detectIsUndefined(values[idx])) {
    values[idx] = {
      deps,
      value: callback,
    };

    hook.idx++;

    return callback;
  }

  const hookValue = values[idx];
  const prevDeps = hookValue.deps as Array<any>;
  const isDepsDifferent = detectIsDepsDifferent(deps, prevDeps);

  if (isDepsDifferent) {
    hookValue.deps = deps;
    hookValue.value = callback;
  }

  hook.idx++;

  return hookValue.value;
}

export { useCallback };
