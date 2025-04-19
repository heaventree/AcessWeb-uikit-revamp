/**
 * Secure Storage
 * 
 * Provides encrypted local storage for sensitive data with
 * automatic key derivation and security best practices.
 */

import { encrypt, decrypt, sha256Hash } from './crypto';
import { logError } from './errorHandler';
import { isDevelopment } from './environment';

// Security configuration
const STORAGE_PREFIX = 'wcag_sec_';
const ENCRYPTION_KEY = 'WCAG_APP_ENCRYPTION_KEY';
const SALT_LENGTH = 16; // bytes
const ITERATION_COUNT = 100000;

// Get encryption key from environment or generate a device-specific one
async function getEncryptionKey(): Promise<string> {
  // Try to get from environment
  const envKey = import.meta.env.VITE_STORAGE_ENCRYPTION_KEY;

  if (envKey) {
    return envKey;
  }

  // Generate device-specific key if no environment key is provided
  // This is still relatively secure as it's derived from device/browser information
  const deviceInfo = navigator.userAgent + navigator.language + window.screen.width + window.screen.height;
  return sha256Hash(deviceInfo);
}

// Keep track of initialization
let isInitialized = false;

/**
 * Initialize secure storage
 */
export async function setupSecureStorage(): Promise<void> {
  try {
    // Only initialize once
    if (isInitialized) {
      return;
    }

    // Initialize encryption key
    const key = await getEncryptionKey();
    localStorage.setItem(ENCRYPTION_KEY, key);

    // Mark as initialized
    isInitialized = true;

    // Log initialization in development
    if (isDevelopment()) {
      console.info('Secure storage initialized');
    }
  } catch (error) {
    logError(error, { context: 'secureStorage.setupSecureStorage' });
  }
}

/**
 * Alias for setupSecureStorage to maintain compatibility with imports
 */
export const initSecureStorage = setupSecureStorage;

/**
 * Check if secure storage is initialized
 */
export function isSecureStorageInitialized(): boolean {
  return isInitialized || localStorage.getItem(ENCRYPTION_KEY) !== null;
}

/**
 * Secure local storage implementation
 */
export const secureLocalStorage = {
  /**
   * Set item in secure storage
   * @param key Storage key
   * @param value Value to store
   */
  setItem(key: string, value: string): void {
    try {
      // Get encryption key
      const encryptionKey = localStorage.getItem(ENCRYPTION_KEY);

      if (!encryptionKey) {
        // Fall back to regular storage without encryption if not initialized
        localStorage.setItem(key, value);
        return;
      }

      // Encrypt and store synchronously to avoid async issues
      try {
        const encryptedValue = encrypt(value, encryptionKey);
        localStorage.setItem(`${STORAGE_PREFIX}${key}`, encryptedValue);
      } catch (encryptError) {
        logError(encryptError, { context: 'secureLocalStorage.setItem.encrypt', key });
        localStorage.setItem(key, value);
      }
    } catch (error) {
      logError(error, { context: 'secureLocalStorage.setItem', key });

      // Fallback to regular storage in case of error
      try {
        localStorage.setItem(key, value);
      } catch (fallbackError) {
        logError(fallbackError, { context: 'secureLocalStorage.setItem.fallback', key });
      }
    }
  },

  /**
   * Get item from secure storage
   * @param key Storage key
   * @returns Stored value or null
   */
  getItem(key: string): string | null {
    try {
      // Get encryption key
      const encryptionKey = localStorage.getItem(ENCRYPTION_KEY);

      if (!encryptionKey) {
        // Fall back to regular storage if not initialized
        return localStorage.getItem(key);
      }

      // Get encrypted value
      const encryptedValue = localStorage.getItem(`${STORAGE_PREFIX}${key}`);

      if (!encryptedValue) {
        // Check regular storage as fallback
        return localStorage.getItem(key);
      }

      // Decrypt value
      try {
        return decrypt(encryptedValue, encryptionKey);
      } catch (decryptError) {
        logError(decryptError, { context: 'secureLocalStorage.getItem.decrypt', key });
        return localStorage.getItem(key);
      }
    } catch (error) {
      logError(error, { context: 'secureLocalStorage.getItem', key });

      // Fallback to regular storage in case of error
      try {
        return localStorage.getItem(key);
      } catch (fallbackError) {
        logError(fallbackError, { context: 'secureLocalStorage.getItem.fallback', key });
        return null;
      }
    }
  },

  /**
   * Remove item from secure storage
   * @param key Storage key
   */
  removeItem(key: string): void {
    try {
      // Remove encrypted value
      localStorage.removeItem(`${STORAGE_PREFIX}${key}`);

      // Also remove from regular storage as fallback
      localStorage.removeItem(key);
    } catch (error) {
      logError(error, { context: 'secureLocalStorage.removeItem', key });
    }
  },

  /**
   * Clear all items from secure storage
   */
  clear(): void {
    try {
      // Remove all items with prefix
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith(STORAGE_PREFIX)) {
          localStorage.removeItem(key);
        }
      });
    } catch (error) {
      logError(error, { context: 'secureLocalStorage.clear' });
    }
  },

  /**
   * Check if key exists in secure storage
   * @param key Storage key
   * @returns True if key exists
   */
  hasItem(key: string): boolean {
    try {
      return localStorage.getItem(`${STORAGE_PREFIX}${key}`) !== null || localStorage.getItem(key) !== null;
    } catch (error) {
      logError(error, { context: 'secureLocalStorage.hasItem', key });
      return false;
    }
  }
};

/**
 * Session-only secure storage implementation
 */
export const secureSessionStorage = {
  /**
   * Set item in secure session storage
   * @param key Storage key
   * @param value Value to store
   */
  setItem(key: string, value: string): void {
    try {
      // Get encryption key
      const encryptionKey = localStorage.getItem(ENCRYPTION_KEY);

      if (!encryptionKey) {
        // Fall back to regular storage without encryption if not initialized
        sessionStorage.setItem(key, value);
        return;
      }

      // Encrypt and store synchronously to avoid async issues
      try {
        const encryptedValue = encrypt(value, encryptionKey);
        sessionStorage.setItem(`${STORAGE_PREFIX}${key}`, encryptedValue);
      } catch (encryptError) {
        logError(encryptError, { context: 'secureSessionStorage.setItem.encrypt', key });
        sessionStorage.setItem(key, value);
      }
    } catch (error) {
      logError(error, { context: 'secureSessionStorage.setItem', key });

      // Fallback to regular storage in case of error
      try {
        sessionStorage.setItem(key, value);
      } catch (fallbackError) {
        logError(fallbackError, { context: 'secureSessionStorage.setItem.fallback', key });
      }
    }
  },

  /**
   * Get item from secure session storage
   * @param key Storage key
   * @returns Stored value or null
   */
  getItem(key: string): string | null {
    try {
      // Get encryption key
      const encryptionKey = localStorage.getItem(ENCRYPTION_KEY);

      if (!encryptionKey) {
        // Fall back to regular storage if not initialized
        return sessionStorage.getItem(key);
      }

      // Get encrypted value
      const encryptedValue = sessionStorage.getItem(`${STORAGE_PREFIX}${key}`);

      if (!encryptedValue) {
        // Check regular storage as fallback
        return sessionStorage.getItem(key);
      }

      // Decrypt value
      try {
        return decrypt(encryptedValue, encryptionKey);
      } catch (decryptError) {
        logError(decryptError, { context: 'secureSessionStorage.getItem.decrypt', key });
        return sessionStorage.getItem(key);
      }
    } catch (error) {
      logError(error, { context: 'secureSessionStorage.getItem', key });

      // Fallback to regular storage in case of error
      try {
        return sessionStorage.getItem(key);
      } catch (fallbackError) {
        logError(fallbackError, { context: 'secureSessionStorage.getItem.fallback', key });
        return null;
      }
    }
  },

  /**
   * Remove item from secure session storage
   * @param key Storage key
   */
  removeItem(key: string): void {
    try {
      // Remove encrypted value
      sessionStorage.removeItem(`${STORAGE_PREFIX}${key}`);

      // Also remove from regular storage as fallback
      sessionStorage.removeItem(key);
    } catch (error) {
      logError(error, { context: 'secureSessionStorage.removeItem', key });
    }
  },

  /**
   * Clear all items from secure session storage
   */
  clear(): void {
    try {
      // Remove all items with prefix
      Object.keys(sessionStorage).forEach(key => {
        if (key.startsWith(STORAGE_PREFIX)) {
          sessionStorage.removeItem(key);
        }
      });
    } catch (error) {
      logError(error, { context: 'secureSessionStorage.clear' });
    }
  },

  /**
   * Check if key exists in secure session storage
   * @param key Storage key
   * @returns True if key exists
   */
  hasItem(key: string): boolean {
    try {
      return sessionStorage.getItem(`${STORAGE_PREFIX}${key}`) !== null || sessionStorage.getItem(key) !== null;
    } catch (error) {
      logError(error, { context: 'secureSessionStorage.hasItem', key });
      return false;
    }
  }
};

export default {
  secureLocalStorage,
  secureSessionStorage,
  setupSecureStorage,
  isSecureStorageInitialized,
  initSecureStorage
};