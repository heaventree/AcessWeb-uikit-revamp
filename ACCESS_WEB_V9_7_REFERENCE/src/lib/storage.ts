/**
 * Storage service for managing local browser storage
 * This provides a consistent API for storing and retrieving data from localStorage
 */

class StorageService {
  private prefix: string;

  constructor(prefix: string = 'accessweb_') {
    this.prefix = prefix;
  }

  /**
   * Get item from storage
   */
  async getItem<T>(key: string): Promise<T | null> {
    try {
      const item = localStorage.getItem(this.getKey(key));
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error(`Error getting item from storage: ${key}`, error);
      return null;
    }
  }

  /**
   * Set item in storage
   */
  async setItem<T>(key: string, value: T): Promise<void> {
    try {
      localStorage.setItem(this.getKey(key), JSON.stringify(value));
    } catch (error) {
      console.error(`Error setting item in storage: ${key}`, error);
    }
  }

  /**
   * Remove item from storage
   */
  async removeItem(key: string): Promise<void> {
    try {
      localStorage.removeItem(this.getKey(key));
    } catch (error) {
      console.error(`Error removing item from storage: ${key}`, error);
    }
  }

  /**
   * Clear all storage with prefix
   */
  async clear(): Promise<void> {
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith(this.prefix)) {
          localStorage.removeItem(key);
        }
      }
    } catch (error) {
      console.error('Error clearing storage', error);
    }
  }

  /**
   * Get prefixed key
   */
  private getKey(key: string): string {
    return `${this.prefix}${key}`;
  }
}

export const storageService = new StorageService();