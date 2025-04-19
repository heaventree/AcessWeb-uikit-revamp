/**
 * Environment Utilities
 * 
 * Provides a secure and centralized way to access environment variables
 * and configuration.
 */

import { logError } from './errorHandler';

// Cache for environment variables
const envCache: Record<string, string> = {};

/**
 * Load all environment variables into cache
 */
export function loadEnvVariables(): void {
  try {
    // Import.meta.env is available in Vite applications
    if (import.meta.env) {
      // Load all environment variables from import.meta.env
      Object.entries(import.meta.env).forEach(([key, value]) => {
        if (typeof value === 'string') {
          envCache[key] = value;
        }
      });
    }
    
    // Also load from process.env if available (for SSR or Node.js environments)
    if (typeof process !== 'undefined' && process.env) {
      Object.entries(process.env).forEach(([key, value]) => {
        if (typeof value === 'string') {
          envCache[key] = value;
        }
      });
    }
  } catch (error) {
    logError(error, { context: 'loadEnvVariables' });
  }
}

/**
 * Get any environment variable (alias for getEnvString for backward compatibility)
 * @param key Environment variable key
 * @param defaultValue Default value if environment variable is not set
 * @returns Environment variable value or default
 */
export function getEnvVariable(key: string, defaultValue: string = ''): string {
  return getEnvString(key, defaultValue);
}

/**
 * Get a string environment variable
 * @param key Environment variable key
 * @param defaultValue Default value if environment variable is not set
 * @returns Environment variable value or default
 */
export function getEnvString(key: string, defaultValue: string = ''): string {
  try {
    // Check cache first
    if (envCache[key]) {
      return envCache[key];
    }
    
    // Try to get from import.meta.env (Vite)
    if (import.meta.env && import.meta.env[key]) {
      const value = import.meta.env[key];
      
      if (typeof value === 'string') {
        // Cache value for future use
        envCache[key] = value;
        return value;
      }
    }
    
    // Try to get from process.env (Node.js)
    if (typeof process !== 'undefined' && process.env && process.env[key]) {
      const value = process.env[key];
      
      if (typeof value === 'string') {
        // Cache value for future use
        envCache[key] = value;
        return value;
      }
    }
    
    // Return default value if not found
    return defaultValue;
  } catch (error) {
    logError(error, { context: 'getEnvString', data: { key } });
    return defaultValue;
  }
}

/**
 * Get a number environment variable
 * @param key Environment variable key
 * @param defaultValue Default value if environment variable is not set or not a valid number
 * @returns Environment variable value as number or default
 */
export function getEnvNumber(key: string, defaultValue: number = 0): number {
  try {
    const stringValue = getEnvString(key, String(defaultValue));
    const numberValue = Number(stringValue);
    
    // Return default if not a valid number
    return isNaN(numberValue) ? defaultValue : numberValue;
  } catch (error) {
    logError(error, { context: 'getEnvNumber', data: { key } });
    return defaultValue;
  }
}

/**
 * Get a boolean environment variable
 * @param key Environment variable key
 * @param defaultValue Default value if environment variable is not set
 * @returns Environment variable value as boolean or default
 */
export function getEnvBoolean(key: string, defaultValue: boolean = false): boolean {
  try {
    const stringValue = getEnvString(key, String(defaultValue));
    
    // Check for truthy values
    return ['true', 'yes', '1'].includes(stringValue.toLowerCase());
  } catch (error) {
    logError(error, { context: 'getEnvBoolean', data: { key } });
    return defaultValue;
  }
}

/**
 * Get an array environment variable (comma-separated values)
 * @param key Environment variable key
 * @param defaultValue Default value if environment variable is not set
 * @returns Environment variable value as array or default
 */
export function getEnvArray(key: string, defaultValue: string[] = []): string[] {
  try {
    const stringValue = getEnvString(key, '');
    
    // Return default if empty
    if (!stringValue) {
      return defaultValue;
    }
    
    // Split by comma and trim each value
    return stringValue.split(',').map(item => item.trim());
  } catch (error) {
    logError(error, { context: 'getEnvArray', data: { key } });
    return defaultValue;
  }
}

/**
 * Get a JSON environment variable
 * @param key Environment variable key
 * @param defaultValue Default value if environment variable is not set or not valid JSON
 * @returns Environment variable value as parsed JSON or default
 */
export function getEnvJson<T>(key: string, defaultValue: T): T {
  try {
    const stringValue = getEnvString(key, '');
    
    // Return default if empty
    if (!stringValue) {
      return defaultValue;
    }
    
    // Parse JSON
    return JSON.parse(stringValue) as T;
  } catch (error) {
    logError(error, { context: 'getEnvJson', data: { key } });
    return defaultValue;
  }
}

/**
 * Check if running in development mode
 * @returns Whether running in development mode
 */
export function isDevelopment(): boolean {
  return getEnvString('NODE_ENV', 'development') === 'development';
}

/**
 * Check if running in production mode
 * @returns Whether running in production mode
 */
export function isProduction(): boolean {
  return getEnvString('NODE_ENV', 'development') === 'production';
}

/**
 * Check if running in test mode
 * @returns Whether running in test mode
 */
export function isTest(): boolean {
  return getEnvString('NODE_ENV', 'development') === 'test';
}

/**
 * API timeout in milliseconds
 */
export const API_TIMEOUT: number = getEnvNumber('VITE_API_TIMEOUT', 30000);

/**
 * API base URL
 */
export const API_BASE_URL: string = getEnvString('VITE_API_BASE_URL', 'http://localhost:3000/api');

/**
 * API version
 */
export const API_VERSION: string = getEnvString('VITE_API_VERSION', 'v1');

export default {
  loadEnvVariables,
  getEnvVariable,
  getEnvString,
  getEnvNumber,
  getEnvBoolean,
  getEnvArray,
  getEnvJson,
  isDevelopment,
  isProduction,
  isTest,
  API_TIMEOUT,
  API_BASE_URL,
  API_VERSION
};