/* eslint-disable @typescript-eslint/no-explicit-any */
declare module '*.sprite.svg' {
  const inlineSvg: {
    id: string;
    viewBox: string;
    content: string;
  };
  export default inlineSvg;
}
declare module '*.svg' {
  const content: any;
  export default content;
}
