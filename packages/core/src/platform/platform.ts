import type { Platform } from './types';

export const platform: Platform = {
  createNativeElement: () => {
    throw new Error('createNativeElement not installed by renderer');
  },
  requestAnimationFrame: () => {
    throw new Error('requestAnimationFrame not installed by renderer');
  },
  scheduleCallback: () => {
    throw new Error('scheduleCallback not installed by renderer');
  },
  shouldYeildToHost: () => {
    throw new Error('shouldYeildToHost not installed by renderer');
  },
  applyCommit: () => {
    throw new Error('applyCommit not installed by renderer');
  },
  finishCommitWork: () => {
    throw new Error('finishCommitWork not installed by renderer');
  },
  detectIsPortal: () => {
    throw new Error('detectIsPortal not installed by renderer');
  },
  unmountPortal: () => {
    throw new Error('unmountPortal not installed by renderer');
  },
};