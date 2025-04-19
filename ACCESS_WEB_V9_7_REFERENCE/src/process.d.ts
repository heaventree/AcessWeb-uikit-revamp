// Type definitions for process module
declare module 'process' {
  const process: {
    env: Record<string, string | undefined>;
    nextTick: (callback: (...args: any[]) => void, ...args: any[]) => void;
    // Add any other process properties you need here
  };
  export default process;
}