interface DiffCache {
  [key: string]: {
    content: string;
    timestamp: number;
    hash: string;
  };
}

export class DiffManager {
  private static instance: DiffManager;
  private cache: DiffCache = {};
  private readonly cacheTimeout = 1000 * 60 * 5; // 5 minutes

  private constructor() {}

  static getInstance(): DiffManager {
    if (!DiffManager.instance) {
      DiffManager.instance = new DiffManager();
    }
    return DiffManager.instance;
  }

  private generateHash(content: string): string {
    let hash = 0;
    for (let i = 0; i < content.length; i++) {
      const char = content.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return hash.toString(36);
  }

  private cleanupCache(): void {
    const now = Date.now();
    Object.keys(this.cache).forEach(key => {
      if (now - this.cache[key].timestamp > this.cacheTimeout) {
        delete this.cache[key];
      }
    });
  }

  getDiff(key: string, newContent: string): string | null {
    this.cleanupCache();
    
    const hash = this.generateHash(newContent);
    const cached = this.cache[key];

    if (cached && cached.hash === hash) {
      return null; // Content hasn't changed
    }

    this.cache[key] = {
      content: newContent,
      timestamp: Date.now(),
      hash
    };

    return newContent;
  }

  invalidateCache(key: string): void {
    delete this.cache[key];
  }

  clearCache(): void {
    this.cache = {};
  }
}