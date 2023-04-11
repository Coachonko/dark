import { type ComponentFactory, component } from '../component';
import { detectIsFunction, detectIsUndefined } from '../helpers';
import { useContext } from '../context';
import { forwardRef } from '../ref';
import { SuspenseContext } from '../suspense';
import { useUpdate } from '../use-update';
import { isHydrateZone } from '../scope';
import { $$lazy, $$loaded } from './utils';

const factoriesMap: Map<Function, ComponentFactory> = new Map();

function lazy<P, R = unknown>(module: () => Promise<LazyModule<P>>, done?: () => void) {
  return forwardRef(
    component<P, R>(
      function type(props, ref) {
        const { isLoaded, fallback, reg, unreg } = useContext(SuspenseContext);
        const update = useUpdate({ forceSync: true });
        const factory = factoriesMap.get(module);

        if (detectIsUndefined(factory)) {
          reg();
          factoriesMap.set(module, null);
          fetchModule(module).then(component => {
            unreg();
            type[$$loaded] = true;
            factoriesMap.set(module, component);
            !isHydrateZone.get() && update();
            detectIsFunction(done) && done();
          });
        }

        return factory ? factory(props, ref) : isLoaded ? fallback : null;
      },
      { token: $$lazy },
    ),
  );
}

function fetchModule(module: () => Promise<LazyModule>) {
  return new Promise<ComponentFactory>(resolve => {
    module().then(module => {
      if (process.env.NODE_ENV !== 'production') {
        if (!module.default) {
          throw new Error('[Dark]: Lazy loaded component should be exported as default!');
        }
      }

      resolve(module.default);
    });
  });
}

export type LazyModule<P = unknown> = {
  default: ComponentFactory<P>;
};

export { lazy, fetchModule };
