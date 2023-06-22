import { QMainWindow, QWidget, WindowState, type QIcon, type QMainWindowSignals } from '@nodegui/nodegui';
import { type ComponentFactory, component, forwardRef } from '@dark-engine/core';

import type { WidgetProps, WithSlotProps, Container } from '../shared';
import { qMainWindow } from '../factory';
import { detectIsMenuBar } from './menu-bar';
import { detectIsStatusBar } from './status-bar';
import { detectIsSystemTrayIcon } from './system-tray-icon';
import { throwUnsupported } from '../utils';

export type WindowProps = WithSlotProps<
  {
    windowTitle: string;
    windowOpacity?: number;
    windowIcon?: QIcon;
    windowState?: WindowState;
  } & WidgetProps
>;
export type WindowRef = QDarkMainWindow;
export type MainWindowSignals = QMainWindowSignals;

const Window = forwardRef<WindowProps, WindowRef>(
  component((props, ref) => qMainWindow({ ref, ...props }), { displayName: 'Window' }),
) as ComponentFactory<WindowProps, WindowRef>;

class QDarkMainWindow extends QMainWindow implements Container {
  constructor() {
    super();
    this.show();
  }

  public detectIsContainer() {
    return true;
  }

  public appendChild(child: QWidget) {
    if (detectIsSystemTrayIcon(child)) return;
    if (detectIsMenuBar(child)) {
      this.setMenuBar(child);
    } else if (detectIsStatusBar(child)) {
      this.setStatusBar(child);
    } else {
      this.setCentralWidget(child);
    }
  }

  public insertBefore() {
    throwUnsupported(this);
  }

  public removeChild(child: QWidget) {
    child.close();
  }
}

export { Window, QDarkMainWindow };
