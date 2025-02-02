export {};

declare global {
  interface Window {
    acquireVsCodeApi?: () => any;
  }
}
