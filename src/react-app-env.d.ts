/// <reference types="vite/client" />
/// <reference types="vite-plugin-svgr/client" />

interface Window {
  require: NodeRequire;
}

declare module '*.svg' {
  import * as React from 'react';
  export const ReactComponent: React.FunctionComponent<React.SVGProps<SVGSVGElement> & { title?: string }>;
  const src: string;
  export default src;
}