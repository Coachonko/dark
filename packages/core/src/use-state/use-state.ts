import { detectIsFunction } from '../helpers';
import { type UpdateOptions, useUpdate } from '../use-update';
import { useMemo } from '../use-memo';
import { scope$$ } from '../scope';
import { useCallback } from '../use-callback';

type Value<T> = T | ((prevValue: T) => T);

function useState<T = unknown>(initialValue: T | (() => T)): [T, (value: Value<T>) => void] {
  const update = useUpdate();
  const scope = useMemo(
    () => ({
      value: detectIsFunction(initialValue) ? initialValue() : initialValue,
    }),
    [],
  );
  const setState = useCallback((sourceValue: Value<T>) => {
    const scope$ = scope$$();
    const isBatch = scope$.getIsBatchZone();
    const create = (): UpdateOptions => {
      const prevValue = scope.value;
      const newValue = detectIsFunction(sourceValue) ? sourceValue(prevValue) : sourceValue;
      const shouldUpdate = () => isBatch || !Object.is(prevValue, newValue);
      const setValue = () => (scope.value = newValue);
      const resetValue = () => (scope.value = prevValue);

      return { shouldUpdate, setValue, resetValue };
    };

    update(create);
  }, []);

  return [scope.value, setState];
}

export { useState };
