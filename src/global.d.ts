declare module '*.svg' {
  import type { h } from 'preact';
  export const ReactComponent: (props: h.JSX.SVGAttributes) => h.JSX.Element;
  export default ReactComponent;
}

declare interface Window {
  chrome: boolean;
}
