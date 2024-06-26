import { QLabel, QPixmap, AspectRatioMode, TransformationMode } from '@nodegui/nodegui';
import { type ComponentFactory, type Ref, component } from '@dark-engine/core';
import fetch from 'node-fetch';

import type { WidgetProps, WithStandardProps } from '../shared';
import { qImage } from '../factory';
import { detectisValidURL } from '../utils';

// <Image src='https://placehold.co/600x400' />

export type ImageProps = WithStandardProps<
  {
    ref?: Ref<ImageRef>;
    src?: string;
    buffer?: Buffer;
    aspectRatioMode?: AspectRatioMode;
    transformationMode?: TransformationMode;
  } & WidgetProps
>;
export type ImageRef = QDarkImage;

const Image = component<ImageProps>(props => qImage(props), { displayName: 'Image' }) as ComponentFactory<ImageProps>;

class QDarkImage extends QLabel {
  private aspectRatioMode: AspectRatioMode = AspectRatioMode.KeepAspectRatio;
  private transformationMode: TransformationMode = TransformationMode.FastTransformation;

  constructor() {
    super();
    this.setProperty('scaledContents', true);
  }

  async setSrc(value: string) {
    if (!value) return;
    try {
      this.setPixmap(this.scale(await createPixmapFromPath(value)));
    } catch (error) {
      console.warn(error);
    }
  }

  setBuffer(buffer: Buffer) {
    this.setPixmap(createPixmapFromBuffer(buffer));
  }

  setAspectRatioMode(mode: AspectRatioMode) {
    this.aspectRatioMode = mode;
    this.fit();
  }

  setTransformationMode(mode: TransformationMode) {
    this.transformationMode = mode;
    this.fit();
  }

  fit() {
    if (!this.pixmap()) return;
    this.setPixmap(this.scale(this.pixmap()));
  }

  scale(pixmap: QPixmap) {
    return pixmap.scaled(this.width(), this.height(), this.aspectRatioMode, this.transformationMode);
  }
}

async function createPixmapFromPath(src: string) {
  const pixmap = new QPixmap();

  if (detectisValidURL(src)) {
    const response = await fetch(src);
    const buffer = Buffer.from(await response.arrayBuffer());

    pixmap.loadFromData(buffer);
  } else {
    pixmap.load(src);
  }

  return pixmap;
}

function createPixmapFromBuffer(buffer: Buffer) {
  const pixmap = new QPixmap();

  pixmap.loadFromData(buffer);

  return pixmap;
}

export { Image, QDarkImage };
