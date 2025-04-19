// Type declaration for global Window object extensions
interface Window {
  process?: {
    env: Record<string, string | undefined>;
    [key: string]: any;
  };
  util?: any;
  stream?: any;
  Buffer?: any;
}