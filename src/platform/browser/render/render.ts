import { createApp, getAppUid, getRegistery, getVirtualDOM, setAppUid } from '@core/scope';
import { mountVirtualDOM, VirtualNode, MountedSource } from '@core/vdom';
import { isUndefined, getTime, isFunction } from '../../../helpers';
import { mountRealDOM, processDOM } from '../dom/dom';
import { clearUnmountedPortalContainers } from '../portal';

const zoneIdByRootNodeMap = new WeakMap();
let renderInProcess = false;
let isInternalRenderCall = false;
let zoneCount = 0;

function renderComponent(source: MountedSource, container: HTMLElement, onRender?: Function) {
  const time = getTime();
  const isMounted = !isUndefined(zoneIdByRootNodeMap.get(container));
  const prevZoneId = getAppUid();
  let zoneId = 0;

  if (!renderInProcess) {
    renderInProcess = true;
  } else {
    isInternalRenderCall = true;
  }

  if (!isMounted) {
    zoneIdByRootNodeMap.set(container, zoneCount);
    zoneCount++;
  }

  zoneId = zoneIdByRootNodeMap.get(container);

  setAppUid(zoneId);

  if (!isMounted) {
    let vNode: VirtualNode = null;
    const registry = getRegistery();
    const app = createApp(container);

    container.innerHTML = '';
    registry.set(zoneId, app);

    vNode = mountVirtualDOM({ mountedSource: source, fromRoot: true }) as VirtualNode;
    //console.log('vdom: ', vNode);
    app.vdom = vNode;
    const nodes = Array.from(mountRealDOM(vNode, app.nativeElement as HTMLElement).childNodes);
    for (const node of nodes) {
      container.appendChild(node);
    }
  } else {
    const app = getRegistery().get(zoneId);
    const vNode = getVirtualDOM(zoneId);
    const nextVNode: VirtualNode = mountVirtualDOM({ mountedSource: source, fromRoot: true }) as VirtualNode;

    processDOM({ vNode, nextVNode, container: app.nativeElement as HTMLElement });
    clearUnmountedPortalContainers(zoneId, time);
    app.vdom = nextVNode;
    //console.log('nextVNode: ', nextVNode);
  }

  if (!isInternalRenderCall) {
    renderInProcess = false;
  } else {
    isInternalRenderCall = false;
    setAppUid(prevZoneId);
  }

  isFunction(onRender) && onRender();
}

export {
  renderComponent, //
};
