import { type QIcon, type QVariant, type QComboBoxSignals, type QSize, QComboBox } from '@nodegui/nodegui';
import { type ComponentFactory, type Ref, component } from '@dark-engine/core';

import type { WidgetProps, WithStandardProps } from '../shared';
import { qComboBox } from '../factory';

// const items: Array<ComboBoxItem> = [{ text: 'Item 1', text: 'Item 2', text: 'Item 3' }];
// const comboBoxEvents = useEvents<ComboBoxSignals>(
//   {
//     currentIndexChanged: (e: SyntheticEvent<number>) => console.log(e.value),
//   },
// );
// <ComboBox currentIndex={currentIndex} items={items} on={comboBoxEvents} />

export type ComboBoxProps = WithStandardProps<
  {
    ref?: Ref<ComboBoxRef>;
    items: Array<ComboBoxItem>;
    currentIndex: number;
    iconSize?: QSize;
    editable?: boolean;
    maxCount?: number;
    maxVisibleItems?: number;
  } & WidgetProps
>;
export type ComboBoxRef = QDarkComboBox;
export type ComboBoxSignals = QComboBoxSignals;
export type ComboBoxItem = {
  text: string;
  icon?: QIcon;
  userData?: QVariant;
};

const ComboBox = component<ComboBoxProps>(props => qComboBox(props), {
  displayName: 'ComboBox',
}) as ComponentFactory<ComboBoxProps>;

class QDarkComboBox extends QComboBox {
  setItems(items: Array<ComboBoxItem>) {
    this.clear();
    items.forEach(x => this.addItem(x.icon, x.text, x.userData));
  }

  async setCurrentIndex(value: number) {
    await Promise.resolve();
    this.setProperty('currentIndex', value);
  }
}

export { ComboBox, QDarkComboBox };
