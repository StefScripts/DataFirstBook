// Export all types from schema.ts
export * from './schema';

// Declare additional global types here
declare global {
  interface Window {
    fs: {
      readFile: (path: string, options?: { encoding?: string }) => Promise<string | ArrayBuffer>;
    };
  }
}
