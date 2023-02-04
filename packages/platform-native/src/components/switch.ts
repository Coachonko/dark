import type { Switch as NSSwitch } from '@nativescript/core';
import { type Component, createComponent, forwardRef } from '@dark-engine/core';

import type { SwitchAttributes } from '../jsx';
import { _switch } from '../factory';

export type SwitchProps = SwitchAttributes;
export type SwitchRef = NSSwitch;

const Switch = forwardRef<SwitchProps, SwitchRef>(
  createComponent((props, ref) => {
    return _switch({ ref, ...props });
  }),
) as Component<SwitchProps, SwitchRef>;

export { Switch };
