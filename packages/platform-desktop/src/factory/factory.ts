import { View, type ViewDef } from '@dark-engine/core';

type TagProps = Omit<ViewDef, 'as' | 'isVoid'>;

export const factory = (as: string) => (props?: TagProps) => View({ as, ...(props || {}) });

export const qMainWindow = factory('q:main-window');
export const qText = factory('q:text');
export const qPushButton = factory('q:push-button');
export const qImage = factory('q:image');
export const qAnimatedImage = factory('q:animated-image');
export const qScrollArea = factory('q:scroll-area');
export const qFlexLayout = factory('q:flex-layout');
export const qBoxLayout = factory('q:box-layout');
export const qLineEdit = factory('q:line-edit');
export const qDialog = factory('q:dialog');
export const qList = factory('q:list');
export const qListItem = factory('q:list-item');
export const qProgressBar = factory('q:progress-bar');
export const qSlider = factory('q:slider');
export const qCalendar = factory('q:calendar');
export const qSpinBox = factory('q:spin-box');
export const qCheckBox = factory('q:check-box');
export const qComboBox = factory('q:combo-box');
export const qPlainTextEdit = factory('q:plain-text-edit');
export const qDial = factory('q:dial');
export const qColorDialog = factory('q:color-dialog');
export const qErrorMessage = factory('q:error-message');
export const qFileDialog = factory('q:file-dialog');
export const qAction = factory('q:action');
export const qMenuBar = factory('q:menu-bar');
export const qMenu = factory('q:menu');
export const qFontDialog = factory('q:font-dialog');
export const qInputDialog = factory('q:input-dialog');
export const qProgressDialog = factory('q:progress-dialog');
export const qGridLayout = factory('q:grid-layout');
export const qGridItem = factory('q:grid-item');
export const qTab = factory('q:tab');
export const qTabItem = factory('q:tab-item');
export const qTable = factory('q:table');
export const qTableItem = factory('q:table-item');
export const qSystemTrayIcon = factory('q:system-tray-icon');
export const qRadioButton = factory('q:radio-button');
export const qTextBrowser = factory('q:text-browser');
export const qDateEdit = factory('q:date-edit');
export const qTimeEdit = factory('q:time-edit');
export const qDateTimeEdit = factory('q:date-time-edit');
export const qDoubleSpinBox = factory('q:double-spin-box');
export const qSvg = factory('q:svg');
export const qTree = factory('q:tree');
export const qTreeItem = factory('q:tree-item');
export const qStack = factory('q:stack');
export const qGroupBox = factory('q:group-box');
export const qMessageDialog = factory('q:message-dialog');
export const qStatusBar = factory('q:status-bar');
