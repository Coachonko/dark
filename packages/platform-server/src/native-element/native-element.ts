import { NodeType, detectIsBoolean, detectIsString } from '@dark-engine/core';
import {
  AS_ATTR,
  CLASS_ATTR,
  CLASS_NAME_ATTR,
  EXCLUDE_ATTR_MARK,
  DANGER_HTML_CONTENT,
  detectIsVoidElement,
} from '@dark-engine/platform-browser';

abstract class NativeElement {
  type: NodeType;
  parentElement: TagNativeElement = null;

  constructor(type: NodeType) {
    this.type = type;
  }

  abstract renderToString(): string;
  abstract renderToString(isRoot: boolean): string;

  abstract renderToChunk(): string;
  abstract renderToChunk(start: boolean, close?: boolean): string;
}

class TagNativeElement extends NativeElement {
  name: string = null;
  attrs: Record<string, AttributeValue> = {};
  children: Array<NativeElement> = [];

  constructor(name: string) {
    super(NodeType.TAG);
    this.name = name;
  }

  appendChild(element: NativeElement) {
    if (this.attrs[DANGER_HTML_CONTENT]) {
      throw new Error(`[platform-server]: element with danger content can't have a children!`);
    }

    element.parentElement = this;
    this.children.push(element);
  }

  setAttribute(name: string, value: AttributeValue) {
    let $name = name === CLASS_NAME_ATTR ? CLASS_ATTR : name;

    if ($name[0] === EXCLUDE_ATTR_MARK) return;
    if ($name === AS_ATTR) $name = name.slice(1, AS_ATTR.length);
    this.attrs[$name] = detectIsString(value) && $name !== DANGER_HTML_CONTENT ? escape(value) : value;
  }

  override renderToString(...args: Array<unknown>) {
    const isRoot = args[0] as boolean;
    const isVoid = detectIsVoidElement(this.name);
    const attrs = getAttributes(this.attrs);
    const danger = this.attrs[DANGER_HTML_CONTENT];

    if (isVoid) return `<${this.name}${attrs}>`;

    const children = danger ? String(danger) : this.children.map(x => x.renderToString()).join('');
    const value = isRoot ? children : `<${this.name}${attrs}>${children}</${this.name}>`;

    return value;
  }

  override renderToChunk(...args: Array<unknown>) {
    const start = args[0] as boolean;
    const close = args[1] as boolean;
    const content = args[2] as string;
    const isVoid = detectIsVoidElement(this.name);
    const attrs = getAttributes(this.attrs);
    const chunk = start
      ? close
        ? `<${this.name}${attrs}></${this.name}>`
        : `<${this.name}${attrs}>${content || ''}`
      : isVoid
      ? ''
      : `</${this.name}>`;

    return chunk;
  }
}

class TextNativeElement extends NativeElement {
  private value = '';

  constructor(text: string) {
    super(NodeType.TEXT);
    this.value = escape(text);
  }

  override renderToString() {
    return this.value;
  }

  override renderToChunk() {
    return this.value;
  }
}

class CommentNativeElement extends NativeElement {
  private value = '';

  constructor(text: string) {
    super(NodeType.COMMENT);
    this.value = `<!--${escape(text)}-->`;
  }

  override renderToString() {
    return this.value;
  }

  override renderToChunk() {
    return this.value;
  }
}

function getAttributes(map: TagNativeElement['attrs']) {
  let attrs = '';

  for (const key of Object.keys(map)) {
    if (key === DANGER_HTML_CONTENT) continue;
    const attr = ' ' + (detectIsBoolean(map[key]) ? (map[key] === true ? key : '') : `${key}="${map[key]}"`);

    attrs += attr;
  }

  return attrs;
}

function escape(value: string) {
  return value
    .split('')
    .map(x => escapeChar(x))
    .join('');
}

function escapeChar(char: string) {
  switch (char) {
    case '&':
      return '&amp;';
    case '<':
      return '&lt;';
    case '>':
      return '&gt;';
    case '"':
      return '&quot;';
    default:
      return char;
  }
}

export type AttributeValue = string | number | boolean;

export { NativeElement, TagNativeElement, TextNativeElement, CommentNativeElement };
