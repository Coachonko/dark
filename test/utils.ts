import { REPLACER } from '@dark-engine/core/constants';
import { createRoot } from '@dark-engine/platform-browser';

const dom = (strings: TemplateStringsArray, ...args: Array<string | number | boolean>) => {
  const markup = strings
    .map((x, idx) => x + (typeof args[idx] !== 'undefined' ? args[idx] : ''))
    .join('')
    .replace(/\s*(?=\<).*?\s*/gm, '')
    .trim();

  return markup;
};

const waitNextTick = () => Promise.resolve();

const createReplacerString = () => `<!--${REPLACER}-->`;

const createTestHostNode = () => document.createElement('div');

const fireEvent = (element: Element, eventName: string, value?: any) => {
  if (element instanceof HTMLInputElement && eventName === 'input') {
    element.value = value;
  }

  const event = new Event(eventName, {
    bubbles: true,
    cancelable: true,
  });

  element.dispatchEvent(event);
};

const click = (element: Element) => fireEvent(element, 'click');

const setInputValue = (element: HTMLInputElement, value: string) => fireEvent(element, 'input', value);

const sleep = (ms = 10) => new Promise(resolve => setTimeout(resolve, ms));

const replacer = createReplacerString();

let host: HTMLElement = null;
let root: ReturnType<typeof createRoot> = null;

function createEnv() {
  root && root.unmount();
  host && host.parentElement === document.body && document.body.removeChild(host);
  host = createTestHostNode();
  root = createRoot(host);
  const render = root.render;

  document.body.appendChild(host);

  return {
    host,
    root,
    render,
    addEventListener,
  };
}

export {
  dom,
  waitNextTick,
  createReplacerString,
  createTestHostNode,
  fireEvent,
  click,
  setInputValue,
  sleep,
  replacer,
  createEnv,
};
