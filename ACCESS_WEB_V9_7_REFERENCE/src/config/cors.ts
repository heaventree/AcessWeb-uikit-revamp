/**
 * CORS Configuration
 * 
 * Defines secure Cross-Origin Resource Sharing settings to
 * prevent unauthorized cross-origin requests.
 */

import { IS_DEVELOPMENT_MODE, getEnvString } from '../utils/environment';

/**
 * CORS configuration interface
 */
export interface CorsConfig {
  /**
   * Allowed origins
   */
  allowedOrigins: string[];

  /**
   * Allowed HTTP methods
   */
  allowedMethods: string[];

  /**
   * Allowed HTTP headers
   */
  allowedHeaders: string[];

  /**
   * Exposed HTTP headers
   */
  exposedHeaders: string[];

  /**
   * Whether to allow credentials
   */
  allowCredentials: boolean;

  /**
   * Max age for preflight requests
   */
  maxAge: number;
}

/**
 * Default CORS configuration
 */
export const DEFAULT_CORS_CONFIG: CorsConfig = {
  // Default to allow only our own domain in production,
  // or localhost in development
  allowedOrigins: IS_DEVELOPMENT_MODE
    ? ['http://localhost:*', 'https://localhost:*']
    : [getEnvString('ALLOWED_ORIGIN', 'https://accessibility.example.com')],

  // Standard allowed methods
  allowedMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],

  // Standard allowed headers + our custom ones
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-CSRF-Token',
    'X-Requested-With',
    'Accept',
    'Accept-Version',
    'Content-Length',
    'Content-MD5',
    'Date',
    'X-Api-Version'
  ],

  // Headers we want to expose to the client
  exposedHeaders: [
    'X-Total-Count',
    'X-Pagination-Page',
    'X-Pagination-Limit'
  ],

  // Allow credentials for authenticated requests
  allowCredentials: true,

  // Cache preflight requests for 1 hour (3600 seconds)
  maxAge: 3600
};

/**
 * Get the CORS configuration
 * @param override Optional override settings
 * @returns CORS configuration
 */
export function getCorsConfig(override?: Partial<CorsConfig>): CorsConfig {
  if (!override) {
    return DEFAULT_CORS_CONFIG;
  }

  return {
    ...DEFAULT_CORS_CONFIG,
    ...override,
    // Merge arrays instead of replacing them
    allowedOrigins: override.allowedOrigins
      ? [...DEFAULT_CORS_CONFIG.allowedOrigins, ...override.allowedOrigins]
      : DEFAULT_CORS_CONFIG.allowedOrigins,
    allowedMethods: override.allowedMethods
      ? [...DEFAULT_CORS_CONFIG.allowedMethods, ...override.allowedMethods]
      : DEFAULT_CORS_CONFIG.allowedMethods,
    allowedHeaders: override.allowedHeaders
      ? [...DEFAULT_CORS_CONFIG.allowedHeaders, ...override.allowedHeaders]
      : DEFAULT_CORS_CONFIG.allowedHeaders,
    exposedHeaders: override.exposedHeaders
      ? [...DEFAULT_CORS_CONFIG.exposedHeaders, ...override.exposedHeaders]
      : DEFAULT_CORS_CONFIG.exposedHeaders
  };
}

/**
 * Create CORS headers for fetch requests
 * @param config CORS configuration
 * @returns Headers object
 */
export function createCorsHeaders(config: CorsConfig = DEFAULT_CORS_CONFIG): Record<string, string> {
  return {
    'Access-Control-Allow-Origin': config.allowedOrigins.join(', '),
    'Access-Control-Allow-Methods': config.allowedMethods.join(', '),
    'Access-Control-Allow-Headers': config.allowedHeaders.join(', '),
    'Access-Control-Expose-Headers': config.exposedHeaders.join(', '),
    'Access-Control-Allow-Credentials': config.allowCredentials ? 'true' : 'false',
    'Access-Control-Max-Age': config.maxAge.toString()
  };
}

/**
 * Check if an origin is allowed
 * @param origin Origin to check
 * @param config CORS configuration
 * @returns True if origin is allowed
 */
export function isOriginAllowed(origin: string, config: CorsConfig = DEFAULT_CORS_CONFIG): boolean {
  // Check direct match
  if (config.allowedOrigins.includes(origin)) {
    return true;
  }

  // Check wildcard matches
  return config.allowedOrigins.some(allowedOrigin => {
    // Handle wildcard subdomains
    if (allowedOrigin.includes('*')) {
      const regexPattern = allowedOrigin
        .replace(/\./g, '\\.')  // Escape dots
        .replace(/\*/g, '.*');  // Replace * with .*
      
      const regex = new RegExp(`^${regexPattern}$`);
      return regex.test(origin);
    }
    
    return false;
  });
}

export default {
  DEFAULT_CORS_CONFIG,
  getCorsConfig,
  createCorsHeaders,
  isOriginAllowed
};