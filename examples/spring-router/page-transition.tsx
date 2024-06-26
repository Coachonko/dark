import { type DarkElement, component, useMemo } from '@dark-engine/core';
import { useLocation } from '@dark-engine/web-router';
import { styled } from '@dark-engine/styled';
import { type SpringValue, Animated, useTransition } from '@dark-engine/animations';

type PageTransitionProps = {
  slot: DarkElement;
};

const PageTransition = component<PageTransitionProps>(
  ({ slot }) => {
    const { pathname } = useLocation();
    const scope = useMemo(() => ({ pathname, slots: {} }), []);
    const items = useMemo(() => [pathname], [pathname]);
    const [transition] = useTransition(
      items,
      x => x,
      () => ({
        from: { y: 150, opacity: 0, scale: 1.4 },
        enter: { y: 0, opacity: 0, scale: 1 },
        leave: { y: 0, opacity: 0.5, scale: 0.7 },
        config: () => ({ tension: 400, friction: 100, mass: 5 }),
      }),
    );

    scope.pathname = pathname;
    scope.slots[pathname] = slot;

    return transition(({ spring, item }) => {
      return (
        <Animated spring={spring} fn={styleFn}>
          <Item>{scope.slots[item]}</Item>
        </Animated>
      );
    });
  },
  { displayName: 'PageTransition' },
);

const styleFn = (element: HTMLDivElement, value: SpringValue<'y' | 'opacity' | 'scale'>) => {
  element.style.setProperty('transform', `translate3d(0, ${value.y}vh, 0) scale(${value.scale})`);
  element.style.setProperty('--opacity', `${value.opacity}`);
};

const Item = styled.div`
  position: absolute;
  width: 100%;
  min-height: 100vh;
  background-color: #fff;
  will-change: transform;

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, var(--opacity));
    pointer-events: none;
    will-change: background-color;
  }
`;

export { PageTransition };
