import {
  type Frame,
  type LayoutBase,
  type View,
  type ContentView,
  type FormattedString,
  type Span,
  Page,
} from '@nativescript/core';
import { ROOT } from '@dark-engine/core';

import { type TagNativeElement } from '../native-element';
import { illegal } from '../utils';

export const enum NSViewFlag {
  CONTENT_VIEW = 'CONTENT_VIEW',
  LAYOUT_VIEW = 'LAYOUT_VIEW',
  NO_CHILDREN = 'NO_CHILDREN',
}

export type NSElement = Frame | Page | LayoutBase | ContentView | View;

export type NSElementMeta = {
  flag?: NSViewFlag;
  isRoot?: boolean;
  add?: (childElement: TagNativeElement, parentElement: TagNativeElement, idx?: number) => void;
  remove?: (childElement: TagNativeElement, parentElement: TagNativeElement) => void;
};

type NSElementFactory = {
  create?: () => NSElement;
  meta?: NSElementMeta;
};

const viewMap: Record<string, NSElementFactory> = {};

function registerElement(name: string, getType: () => new () => NSElement, meta: NSElementMeta = {}) {
  viewMap[name] = {
    create: () => {
      const type = getType();

      return type ? new type() : null;
    },
    meta,
  };
}

function getElementFactory(name: string): NSElementFactory {
  const factory = viewMap[name] || null;

  if (!factory) {
    illegal(`The element with name "${name}" is not registered!`);
  }

  return factory;
}

registerElement(ROOT, () => null, { isRoot: true });

registerElement('frame', () => require('@nativescript/core').Frame, {
  add: (childElement, parentElement) => {
    const frame = parentElement.getNativeView() as Frame;
    const page = childElement.getNativeView();

    if (page instanceof Page) {
      if (frame.navigationQueueIsEmpty()) {
        frame.navigate(() => page);
      }
    } else {
      illegal('The frame must contain only a Page!');
    }
  },
});

registerElement('page', () => require('@nativescript/core').Page);
registerElement('content-view', () => require('@nativescript/core').ContentView, { flag: NSViewFlag.CONTENT_VIEW });
registerElement('scroll-view', () => require('@nativescript/core').ScrollView, { flag: NSViewFlag.CONTENT_VIEW });
registerElement('root-layout', () => require('@nativescript/core').RootLayout, { flag: NSViewFlag.LAYOUT_VIEW });
registerElement('absolute-layout', () => require('@nativescript/core').AbsoluteLayout, {
  flag: NSViewFlag.LAYOUT_VIEW,
});
registerElement('stack-layout', () => require('@nativescript/core').StackLayout, { flag: NSViewFlag.LAYOUT_VIEW });
registerElement('dock-layout', () => require('@nativescript/core').DockLayout, { flag: NSViewFlag.LAYOUT_VIEW });
registerElement('flexbox-layout', () => require('@nativescript/core').FlexboxLayout, { flag: NSViewFlag.LAYOUT_VIEW });
registerElement('grid-layout', () => require('@nativescript/core').GridLayout, { flag: NSViewFlag.LAYOUT_VIEW });
registerElement('wrap-layout', () => require('@nativescript/core').WrapLayout, { flag: NSViewFlag.LAYOUT_VIEW });
registerElement('label', () => require('@nativescript/core').Label);
registerElement('button', () => require('@nativescript/core').Button);
registerElement('html-view', () => require('@nativescript/core').HtmlView, { flag: NSViewFlag.NO_CHILDREN });
registerElement('web-view', () => require('@nativescript/core').WebView, { flag: NSViewFlag.NO_CHILDREN });
registerElement('action-bar', () => require('@nativescript/core').ActionBar);
registerElement('action-item', () => require('@nativescript/core').ActionItem);
registerElement('navigation-button', () => require('@nativescript/core').NavigationButton, {
  flag: NSViewFlag.NO_CHILDREN,
});
registerElement('activity-indicator', () => require('@nativescript/core').ActivityIndicator, {
  flag: NSViewFlag.NO_CHILDREN,
});
registerElement('formatted-string', () => require('@nativescript/core').FormattedString, {
  add(childElement, parentElement, idx) {
    const formattedString = parentElement.getNativeView() as unknown as FormattedString;
    const span = childElement.getNativeView() as unknown as Span;

    if (idx) {
      formattedString.spans.splice(idx, 0, span);
      return;
    }
    formattedString.spans.push(span);
  },
  remove(childElement, parentElement) {
    const formattedString = parentElement.getNativeView() as unknown as FormattedString;
    const span = childElement.getNativeView() as unknown as Span;
    const idx = formattedString.spans.indexOf(span);

    if (idx > -1) {
      formattedString.spans.splice(idx, 1);
    }
  },
});
registerElement('span', () => require('@nativescript/core').Span);
registerElement('image', () => require('@nativescript/core').Image, { flag: NSViewFlag.NO_CHILDREN });
registerElement('list-picker', () => require('@nativescript/core').ListPicker, { flag: NSViewFlag.NO_CHILDREN });
registerElement('placeholder', () => require('@nativescript/core').Placeholder, { flag: NSViewFlag.NO_CHILDREN });
registerElement('progress', () => require('@nativescript/core').Progress, { flag: NSViewFlag.NO_CHILDREN });
registerElement('search-bar', () => require('@nativescript/core').SearchBar, { flag: NSViewFlag.NO_CHILDREN });
registerElement('segmented-bar', () => require('@nativescript/core').SegmentedBar);
registerElement('segmented-bar-item', () => require('@nativescript/core').SegmentedBarItem, {
  flag: NSViewFlag.NO_CHILDREN,
});
registerElement('slider', () => require('@nativescript/core').Slider, { flag: NSViewFlag.NO_CHILDREN });
registerElement('switch', () => require('@nativescript/core').Switch, { flag: NSViewFlag.NO_CHILDREN });
registerElement('text-field', () => require('@nativescript/core').TextField, { flag: NSViewFlag.NO_CHILDREN });
registerElement('text-view', () => require('@nativescript/core').TextView, { flag: NSViewFlag.NO_CHILDREN });
registerElement('date-picker', () => require('@nativescript/core').DatePicker, { flag: NSViewFlag.NO_CHILDREN });
registerElement('time-picker', () => require('@nativescript/core').TimePicker, { flag: NSViewFlag.NO_CHILDREN });
registerElement('tab-view', () => require('@nativescript/core').TabView);
registerElement('tab-view-item', () => require('@nativescript/core').TabViewItem);
registerElement('internal:list-view', () => require('@nativescript/core').ListView, { flag: NSViewFlag.NO_CHILDREN });

export { getElementFactory, registerElement };
