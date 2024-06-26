import { type WidgetEventTypes, QWidget } from '@nodegui/nodegui';
import { NodeType, ROOT, detectIsFunction } from '@dark-engine/core';

import type { QElement, WidgetProps } from '../shared';
import { createSetterName, detectIsContainer } from '../utils';
import { createSyntheticEventHandler } from '../events';
import { getElementFactory } from '../registry';
import { TEXT_ATTR } from '../constants';

class NativeElement {
  type: NodeType;
  parentElement: TagNativeElement = null;

  constructor(type: NodeType) {
    this.type = type;
  }

  getText(): string {
    return this.type;
  }
}
class TagNativeElement<T extends QElement = QElement> extends NativeElement {
  name: string = null;
  attrs: Record<string, AttributeValue> = {};
  children: Array<NativeElement> = [];
  private nativeView: T;
  private eventListeners: Map<string, (e: any) => void> = new Map();

  constructor(name: string) {
    super(NodeType.TAG);
    this.name = name;
    this.nativeView = getElementFactory(name).create() as T;
  }

  getNativeView(): T {
    if (this.name === ROOT) {
      const tag = this.children[0] as TagNativeElement;

      return tag.getNativeView() as T;
    }

    return this.nativeView;
  }

  appendChild(element: NativeElement) {
    element.parentElement = this;
    this.children.push(element);

    if (element.type === NodeType.TAG) {
      const parent = this.nativeView;
      const child = (element as TagNativeElement).getNativeView();

      detectIsContainer(parent) && parent.appendChild(child);
    } else if (element.type === NodeType.TEXT) {
      this.updateText();
    }
  }

  insertBefore(element: NativeElement, siblingElement: NativeElement) {
    if (!siblingElement) {
      return this.appendChild(element);
    }

    const idx = this.children.findIndex(node => node === siblingElement);

    if (idx === -1) {
      return this.appendChild(element);
    }

    if (element.parentElement) {
      element.parentElement.removeChild(element);
    }

    this.children.splice(idx, 0, element);
    element.parentElement = this;

    if (element.type === NodeType.TAG) {
      const parent = this.nativeView;
      const child = (element as TagNativeElement).getNativeView();
      const sibling = (siblingElement as TagNativeElement).getNativeView() as QWidget;
      const idx = this.children.filter(node => node.type === NodeType.TAG).findIndex(node => node === element);

      detectIsContainer(parent) && parent.insertBefore(child, sibling, idx);
    } else if (element.type === NodeType.TEXT) {
      this.updateText();
    }
  }

  removeChild(element: NativeElement) {
    const idx = this.children.findIndex(node => node === element);

    if (idx !== -1) {
      this.children.splice(idx, 1);
      element.parentElement = null;

      if (element.type === NodeType.TAG) {
        const parent = this.nativeView;
        const child = (element as TagNativeElement).getNativeView();

        detectIsContainer(parent) && parent.removeChild(child);
      } else if (element.type === NodeType.TEXT) {
        this.updateText();
      }
    }
  }

  getAttribute(name: string): AttributeValue {
    return this.attrs[name];
  }

  setAttribute(name: string, value: AttributeValue) {
    const setterName = createSetterName(name);

    defaultAttrSetter(this, name, value);

    if (!detectIsFunction(this.nativeView[setterName])) return;

    if (!this.nativeView[INITIAL_ATTR_VALUE]) {
      this.nativeView[INITIAL_ATTR_VALUE] = {};
    }

    this.nativeView[INITIAL_ATTR_VALUE][name] = this.nativeView[name];
    this.nativeView[setterName](value);
    this.attrs[name] = value;
  }

  removeAttribute(name: string) {
    const setterName = createSetterName(name);

    if (!detectIsFunction(this.nativeView[setterName])) return;

    const initialValue = this.nativeView[INITIAL_ATTR_VALUE][name];

    this.nativeView[setterName](initialValue);
    delete this.nativeView[INITIAL_ATTR_VALUE][name];
    delete this.attrs[name];
  }

  updateText() {
    let text = '';

    for (const child of this.children) {
      if (child.type === NodeType.TEXT) {
        text += (child as TextNativeElement).value;
      }
    }

    this.setAttribute(TEXT_ATTR, text);
  }

  getText() {
    return this.getAttribute(TEXT_ATTR) as string;
  }

  addEventListener(eventName: string, handler: Function) {
    const syntheticHandler = createSyntheticEventHandler(eventName, handler);

    this.removeEventListener(eventName);
    this.eventListeners.set(eventName, syntheticHandler);
    this.nativeView.addEventListener(eventName as WidgetEventTypes, syntheticHandler);
  }

  removeEventListener(eventName: string) {
    const handler = this.eventListeners.get(eventName);

    this.eventListeners.delete(eventName);
    this.nativeView.removeEventListener(eventName as WidgetEventTypes, handler);
  }
}

class TextNativeElement extends NativeElement {
  private _value = '';

  constructor(text: string) {
    super(NodeType.TEXT);
    this._value = text;
  }

  get value(): string {
    return this._value;
  }

  set value(value: string) {
    this._value = value;

    if (this.parentElement?.type === NodeType.TAG) {
      this.parentElement.updateText();
    }
  }

  getText() {
    return this._value;
  }
}

class CommentNativeElement extends NativeElement {
  private _value = '';

  constructor(text: string) {
    super(NodeType.COMMENT);
    this._value = `<!--${text}-->`;
  }

  get value(): string {
    return this._value;
  }

  set value(value: string) {
    this._value = value;
  }

  getText() {
    return this._value;
  }
}

type Setter<T = WidgetProps> = Partial<
  Record<T extends WidgetProps ? keyof WidgetProps : string, (widget: QWidget, value: AttributeValue) => void>
>;

function createAttrSetter<T>(setter: Setter<T>) {
  const map: Setter = {
    id: (w: QWidget, n: string) => w.setObjectName(n),
    posX: (w: QWidget, n: number) => w.move(n, w.y()),
    posY: (w: QWidget, n: number) => w.move(w.x(), n),
    width: (w: QWidget, n: number) => w.resize(n, w.height()),
    height: (w: QWidget, n: number) => w.resize(w.width(), n),
    style: (w: QWidget, n: string) => w.setInlineStyle(n),
    ...setter,
  };

  return (element: TagNativeElement, name: string, value: AttributeValue) => {
    const widget = element.getNativeView() as QWidget;

    if (!QWidget.isPrototypeOf(widget) && !(widget instanceof QWidget)) return;

    map[name] && map[name](widget, value);
  };
}

const defaultAttrSetter = createAttrSetter({});

export type AttributeValue = string | number | boolean | object;

export const INITIAL_ATTR_VALUE = '_INITIAL_ATTR_VALUE';

export type PlainNativeElement = TextNativeElement | CommentNativeElement;

export { NativeElement, TagNativeElement, TextNativeElement, CommentNativeElement, createAttrSetter };
