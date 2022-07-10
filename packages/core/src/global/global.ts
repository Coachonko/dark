import type { Platform } from './model';

export const platform: Platform = {
  raf: () => {
    throw new Error('raf not installed by renderer');
  },
  scheduleCallback: () => {
    throw new Error('scheduleCallback not installed by renderer');
  },
  shouldYeildToHost: () => {
    throw new Error('shouldYeildToHost not installed by renderer');
  },
  createNativeElement: () => {
    throw new Error('createNativeElement not installed by renderer');
  },
  applyCommits: () => {
    throw new Error('applyCommits not installed by renderer');
  },
  detectIsPortal: () => {
    throw new Error('detectIsPortal not installed by renderer');
  },
  unmountPortal: () => {
    throw new Error('unmountPortal not installed by renderer');
  },
};