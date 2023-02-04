import type { TabView as NSTabView } from '@nativescript/core';
import { type Component, createComponent, forwardRef } from '@dark-engine/core';

import type { TabViewAttributes } from '../jsx';
import { tabView } from '../factory';

export type TabViewProps = TabViewAttributes;
export type TabViewRef = NSTabView;

const TabView = forwardRef<TabViewProps, TabViewRef>(
  createComponent((props, ref) => {
    return tabView({ ref, ...props });
  }),
) as Component<TabViewProps, TabViewRef>;

export { TabView };
