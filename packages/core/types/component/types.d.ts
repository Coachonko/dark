import type { ComponentFactory } from './component';
import type { DarkElementKey, DarkElement } from '../shared';
import type { Ref } from '../ref';
export declare type ComponentOptions<P extends StandardComponentProps> = Readonly<{
  displayName?: string;
  defaultProps?: Partial<P>;
  token?: Symbol;
  shouldUpdate?: ShouldUpdate<P>;
}>;
export declare type ShouldUpdate<P> = (props: P, nextProps: P) => boolean;
export declare type StandardComponentProps = KeyProps & RefProps;
export declare type KeyProps = {
  key?: DarkElementKey;
};
export declare type SlotProps<T = DarkElement> = Readonly<{
  slot: T;
}>;
export declare type RefProps<T = unknown> = {
  ref?: Ref<T>;
};
export declare type Component<P = any, R = any> = (props?: P, ref?: Ref<R>) => ComponentFactory<P>;
export declare type CreateElement<P extends StandardComponentProps, R = any> = (props: P, ref?: Ref<R>) => DarkElement;