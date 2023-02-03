import { Frame, Page, CoreTypes } from '@nativescript/core';
import {
  type DarkElement,
  h,
  createComponent,
  forwardRef,
  useRef,
  useEffect,
  useMemo,
  useState,
  useEvent,
  useContext,
  useImperativeHandle,
  createContext,
  detectIsFunction,
} from '@dark-engine/core';

import {
  type HistorySubscriber,
  createNavigationHistory,
  NavigationHistory,
  HistoryAction,
} from './navigation-history';
import { SLASH, TransitionName } from './constants';

type NavigationContainerProps = {
  slot: DarkElement;
  renderActionBar?: (pathname: string) => DarkElement;
  onNavigate?: (pathname: string) => void;
};

export type NavigationContainerRef = {
  navigateTo: NavigationContextValue['push'];
  goBack: NavigationContextValue['back'];
};

const NavigationContainer = forwardRef<NavigationContainerProps, NavigationContainerRef>(
  createComponent(({ slot, renderActionBar, onNavigate }, ref) => {
    const frameRef = useRef<Frame>(null);
    const pageRef = useRef<Page>(null);
    const [pathname, setPathname] = useState(SLASH);
    const [transition, setTransition] = useState<Transition>(null, { forceSync: true });
    const scope = useMemo<Scope>(
      () => ({ history: null, inTransition: false, transitions: { forward: [], backward: [] } }),
      [],
    );
    const {
      transitions: { forward, backward },
    } = scope;

    useEffect(() => {
      const history = createNavigationHistory(frameRef.current, pageRef.current);
      const unsubscribe = history.subscribe((pathname, action, options) => {
        const isReplace = action === HistoryAction.REPLACE;
        const isBack = action === HistoryAction.BACK;

        setPathname(pathname);
        !isReplace && scheduleTransition(pathname, isBack, options);
        detectIsFunction(onNavigate) && detectIsFunction(pathname);
      });

      scope.history = history;

      return () => {
        unsubscribe();
        history.dispose();
      };
    }, []);

    useEffect(() => {
      if (!transition) return;
      const timeout = transition.options.animated ? transition.options.transition.duration : 0;
      const timerId = setTimeout(() => {
        scope.inTransition = false;
        executeTransitions();
      }, timeout + WAITING_TIMEOUT);

      return () => clearTimeout(timerId);
    }, [transition]);

    const scheduleTransition = (to: string, isBack: boolean, options?: NavigationOptions) => {
      if (isBack) {
        const transition = backward.pop();

        forward.push(transition);
      } else {
        const from = scope.history.getBack();
        const forwardTransition: Transition = {
          from,
          to,
          isBack: false,
          options: resolveNavigationOptions(options),
        };
        const backwardTransition: Transition = {
          ...forwardTransition,
          isBack: true,
          from: forwardTransition.to,
          to: forwardTransition.from,
        };

        forward.push(forwardTransition);
        backward.push(backwardTransition);
      }

      executeTransitions();
    };

    const executeTransitions = () => {
      if (scope.inTransition) return;
      const transition = forward.shift();

      if (!transition) return setTransition(null);

      scope.inTransition = true;
      setTransition(transition);
    };

    const push = useEvent((pathname: string, options?: NavigationOptions) => scope.history.push(pathname, options));

    const replace = useEvent((pathname: string) => scope.history.replace(pathname));

    const back = useEvent(() => scope.history.back());

    const subscribe = useEvent((subscriber: HistorySubscriber) => scope.history.subscribe(subscriber));

    const contextValue = useMemo<NavigationContextValue>(
      () => ({ pathname, transition, push, replace, back, subscribe }),
      [pathname, transition],
    );

    useImperativeHandle(ref, () => ({ navigateTo: push, goBack: back }), []);

    const hasActionBar = detectIsFunction(renderActionBar);

    return (
      <NavigationContext.Provider value={contextValue}>
        <frame>
          <page actionBarHidden={!hasActionBar}>
            {hasActionBar && renderActionBar(pathname)}
            <stack-layout>
              <frame ref={frameRef} hidden>
                <page ref={pageRef} actionBarHidden />
              </frame>
              {slot}
            </stack-layout>
          </page>
        </frame>
      </NavigationContext.Provider>
    );
  }),
);

type Scope = {
  history: NavigationHistory;
  inTransition: boolean;
  transitions: {
    forward: Array<Transition>;
    backward: Array<Transition>;
  };
};

export type Transition = {
  from: string;
  to: string;
  isBack: boolean;
  options: NavigationOptions;
};

export type NavigationOptions = {
  animated?: boolean;
  transition?: AnimatedTransition;
};

type AnimatedTransition = {
  name?: TransitionName;
  duration?: number;
  curve?: string;
};

type NavigationContextValue = {
  transition: Transition | null;
  pathname: string;
  push: (pathname: string, options?: NavigationOptions) => void;
  replace: (pathname: string) => void;
  back: () => void;
  subscribe: (subscriber: HistorySubscriber) => () => void;
};

const NavigationContext = createContext<NavigationContextValue>(null);

function useNavigationContext() {
  const value = useContext(NavigationContext);

  return value;
}

function resolveNavigationOptions(nextOptions: NavigationOptions): NavigationOptions {
  const animated = nextOptions?.animated || false;
  const name = nextOptions?.transition?.name || TransitionName.SLIDE;
  const duration = nextOptions?.transition?.duration || DEFAULT_TRANSITION_DURATION;
  const curve = nextOptions?.transition?.curve || CoreTypes.AnimationCurve.easeInOut;
  const options: NavigationOptions = {
    animated,
    transition: { name, duration, curve },
  };

  return options;
}

const DEFAULT_TRANSITION_DURATION = 100;
const WAITING_TIMEOUT = 100;

export { NavigationContainer, useNavigationContext };
