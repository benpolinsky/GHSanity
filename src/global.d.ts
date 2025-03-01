declare module '*.module.css' {
  const classes: { [key: string]: string };
  export default classes;
}

declare module '*.svg?react' {
  import React from 'react';
  const ReactComponent: React.FC<React.SVGProps<SVGSVGElement>>;
  export default ReactComponent;
}

// Add Vite env variable type definitions
interface ImportMeta {
  env: {
    [key: string]: string;
    GITHUB_TOKEN: string;
  };
}
