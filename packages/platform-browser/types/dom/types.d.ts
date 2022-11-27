export declare type DOMElement = HTMLElement | SVGElement | Text | Comment;
export declare type DOMFragment = {
  fragment: DocumentFragment;
  callback: () => void;
};