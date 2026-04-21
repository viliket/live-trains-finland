/// <reference types="node" />
/// <reference types="react" />
/// <reference types="react-dom" />

declare module '*.svg' {
  import * as React from 'react';

  const ReactComponent: React.FunctionComponent<
    React.SVGProps<SVGSVGElement> & { title?: string }
  >;

  export default ReactComponent;
}

declare module '*.svg?url' {
  const url: string;

  export default url;
}

declare module 'csstype' {
  interface Properties {
    [key: `--${string}`]: string | number;
  }
}
