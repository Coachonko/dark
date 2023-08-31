import { type Fiber } from '../fiber';
import { type TaskPriority } from '../constants';
import { type VirtualNode } from '../view';

export type Platform = {
  createElement: <N>(vNode: VirtualNode) => N;
  insertElement: <N>(node: N, idx: number, parent: N) => void; // browser only for Suspense
  raf: typeof requestAnimationFrame;
  caf: typeof cancelAnimationFrame;
  schedule: (callback: () => void, options?: ScheduleCallbackOptions) => void;
  shouldYield: () => boolean;
  hasPrimaryTask: () => boolean;
  cancelTask: () => void;
  commit: (fiber: Fiber) => void;
  finishCommit: () => void;
  detectIsDynamic: () => boolean;
  detectIsPortal: (instance: unknown) => boolean;
  unmountPortal: (fiber: Fiber) => void;
  chunk: (fiber: Fiber) => void;
};

export type ScheduleCallbackOptions = {
  priority?: TaskPriority;
  forceSync?: boolean;
  onCompleted?: () => void;
};

const platform: Platform = {
  createElement: () => {
    throw new Error(msg());
  },
  insertElement: () => {
    throw new Error(msg());
  },
  raf: () => {
    throw new Error(msg());
  },
  caf: () => {
    throw new Error(msg());
  },
  schedule: () => {
    throw new Error(msg());
  },
  shouldYield: () => {
    throw new Error(msg());
  },
  hasPrimaryTask: () => {
    throw new Error(msg());
  },
  cancelTask: () => {
    throw new Error(msg());
  },
  commit: () => {
    throw new Error(msg());
  },
  finishCommit: () => {
    throw new Error(msg());
  },
  detectIsDynamic: () => {
    throw new Error(msg());
  },
  detectIsPortal: () => {
    throw new Error(msg());
  },
  unmountPortal: () => {
    throw new Error(msg());
  },
  chunk: () => {
    throw new Error(msg());
  },
};

const msg = () => `Function not installed by renderer!`;

const detectIsServer = () => !platform.detectIsDynamic();

export { platform, detectIsServer };
