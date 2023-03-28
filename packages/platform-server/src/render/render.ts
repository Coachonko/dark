import {
  type DarkElement,
  ROOT,
  Fiber,
  EffectTag,
  platform,
  flatten,
  TagVirtualNode,
  rootStore,
  wipRootStore,
  currentRootStore,
  nextUnitOfWorkStore,
  fiberMountStore,
  createReplacer,
  unmountRoot,
} from '@dark-engine/core';

import { createNativeElement, applyCommit, finishCommitWork } from '../dom';
import { scheduleCallback, shouldYeildToHost } from '../scheduler';
import { TagNativeElement } from '../native-element';

let isInjected = false;
let nextRootId = -1;

function inject() {
  platform.createNativeElement = createNativeElement as typeof platform.createNativeElement;
  platform.requestAnimationFrame = setTimeout.bind(this);
  platform.cancelAnimationFrame = setTimeout.bind(this);
  platform.scheduleCallback = scheduleCallback;
  platform.shouldYeildToHost = shouldYeildToHost;
  platform.applyCommit = applyCommit;
  platform.finishCommitWork = finishCommitWork;
  platform.detectIsDynamic = () => false;
  platform.detectIsPortal = () => false;
  platform.unmountPortal = () => {};
  platform.restart = () => {};
  isInjected = true;
}

function renderToString(element: DarkElement): string {
  !isInjected && inject();

  const rootId = getNextRootId();
  const callback = () => {
    rootStore.set(rootId);
    const fiber = new Fiber().mutate({
      element: new TagNativeElement(ROOT),
      inst: new TagVirtualNode(ROOT, {}, flatten([element || createReplacer()]) as TagVirtualNode['children']),
      tag: EffectTag.C,
    });

    fiberMountStore.reset();
    wipRootStore.set(fiber);
    nextUnitOfWorkStore.set(fiber);
  };

  platform.scheduleCallback(callback);

  const { element: nativeElement } = currentRootStore.get() as Fiber<TagNativeElement>;
  const content = nativeElement.renderToString(true);

  unmountRoot(rootId, () => {});

  return content;
}

const getNextRootId = () => ++nextRootId;

export { renderToString };
