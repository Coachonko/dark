import { type ItemOptions, type SpringsApi, useSprings } from '../use-springs';
import { type SpringValue } from '../shared';

function useSpring<T extends string>(options: ItemOptions<T>, deps: Array<any> = []): [SpringValue<T>, SpringsApi<T>] {
  const [springs, api] = useSprings(1, () => options, deps);

  return [springs[0], api];
}

export { useSpring };
