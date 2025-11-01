/// <reference types="node" />
/// <reference types="react" />
/// <reference types="react-dom" />

import 'react';

declare module '*.svg' {
  import * as React from 'react';

  const ReactComponent: React.FunctionComponent<
    React.SVGProps<SVGSVGElement> & { title?: string }
  >;

  export default ReactComponent;
}

declare module '*.svg?url' {
  const content: {
    src: string;
  };

  export default content;
}

declare module 'react' {
  interface CSSProperties {
    [key: `--${string}`]: string | number;
  }
}
