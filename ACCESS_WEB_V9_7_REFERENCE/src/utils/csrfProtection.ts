/**
 * CSRF Protection Utilities
 * 
 * Provides Cross-Site Request Forgery (CSRF) protection mechanisms
 * to prevent unauthorized requests.
 */

import { getEnvString } from './environment';
import { logError } from './errorHandler';
import { secureLocalStorage } from './secureStorage';

// CSRF token storage key
const CSRF_TOKEN_KEY = 'csrf_token';

// CSRF configuration
const CSRF_HEADER_NAME = 'X-CSRF-Token';
const CSRF_COOKIE_NAME = 'csrf_token';
const CSRF_SECRET = getEnvString('VITE_CSRF_SECRET', 'wcag_secure_csrf_secret_please_change_in_production');

/**
 * Initialize CSRF protection
 */
export function initCsrfProtection(): void {
  try {
    // Generate token if not exists
    const token = getCsrfToken() || generateCsrfToken();
    
    // Store token
    storeCsrfToken(token);
    
    // Set up CSRF token for AJAX requests
    setupCsrfForAjax();
  } catch (error) {
    logError(error, { context: 'initCsrfProtection' });
  }
}

/**
 * Generate a new CSRF token
 * @returns Generated CSRF token
 */
export function generateCsrfToken(): string {
  try {
    // Generate random values for token
    const randomBytes = new Uint8Array(32);
    crypto.getRandomValues(randomBytes);
    
    // Convert to base64 string and remove non-alphanumeric characters
    const token = btoa(String.fromCharCode(...randomBytes))
      .replace(/\+/g, '')
      .replace(/\//g, '')
      .replace(/=/g, '')
      .slice(0, 32);
    
    return token;
  } catch (error) {
    logError(error, { context: 'generateCsrfToken' });
    
    // Fallback to simpler method if Web Crypto API fails
    return Math.random().toString(36).substring(2, 15) + 
           Math.random().toString(36).substring(2, 15) +
           Date.now().toString(36);
  }
}

/**
 * Get stored CSRF token
 * @returns Stored CSRF token or null if not found
 */
export function getCsrfToken(): string | null {
  try {
    // Try to get from storage
    return secureLocalStorage.getItem(CSRF_TOKEN_KEY);
  } catch (error) {
    logError(error, { context: 'getCsrfToken' });
    return null;
  }
}

/**
 * Store CSRF token
 * @param token CSRF token to store
 */
function storeCsrfToken(token: string): void {
  try {
    // Store in local storage (securely)
    secureLocalStorage.setItem(CSRF_TOKEN_KEY, token);
    
    // Also store in a cookie for form submissions
    document.cookie = `${CSRF_COOKIE_NAME}=${token}; path=/; SameSite=Strict; Secure`;
  } catch (error) {
    logError(error, { context: 'storeCsrfToken' });
  }
}

/**
 * Set up CSRF token for AJAX requests
 */
function setupCsrfForAjax(): void {
  try {
    // Add CSRF token to all AJAX requests
    const originalOpen = XMLHttpRequest.prototype.open;
    
    XMLHttpRequest.prototype.open = function(...args) {
      // Call original method
      originalOpen.apply(this, args);
      
      // Add event listener to set CSRF header
      this.addEventListener('readystatechange', function() {
        if (this.readyState === 1) { // OPENED
          const token = getCsrfToken();
          
          if (token) {
            this.setRequestHeader(CSRF_HEADER_NAME, token);
          }
        }
      });
    };
    
    // Also protect fetch requests if available
    if (typeof window.fetch === 'function') {
      const originalFetch = window.fetch;
      
      window.fetch = function(input, init = {}) {
        // Add CSRF token to headers
        const token = getCsrfToken();
        
        if (token) {
          init.headers = {
            ...init.headers,
            [CSRF_HEADER_NAME]: token
          };
        }
        
        // Call original fetch
        return originalFetch(input, init);
      };
    }
  } catch (error) {
    logError(error, { context: 'setupCsrfForAjax' });
  }
}

/**
 * Validate CSRF token
 * @param token Token to validate
 * @returns Whether token is valid
 */
export function validateCsrfToken(token: string): boolean {
  try {
    const storedToken = getCsrfToken();
    
    // Check if token exists and matches stored token
    return !!storedToken && token === storedToken;
  } catch (error) {
    logError(error, { context: 'validateCsrfToken' });
    return false;
  }
}

/**
 * Refresh CSRF token
 */
export function refreshCsrfToken(): void {
  try {
    const newToken = generateCsrfToken();
    storeCsrfToken(newToken);
  } catch (error) {
    logError(error, { context: 'refreshCsrfToken' });
  }
}

/**
 * Create a hidden CSRF input field for forms
 * @returns HTML string with CSRF input element
 */
export function createCsrfInputField(): string {
  try {
    const token = getCsrfToken() || generateCsrfToken();
    
    if (!token) {
      return '';
    }
    
    return `<input type="hidden" name="_csrf" value="${token}" />`;
  } catch (error) {
    logError(error, { context: 'createCsrfInputField' });
    return '';
  }
}

/**
 * Add CSRF token to URL
 * @param url URL to add token to
 * @returns URL with CSRF token
 */
export function addCsrfToUrl(url: string): string {
  try {
    const token = getCsrfToken();
    
    if (!token) {
      return url;
    }
    
    // Parse URL
    const urlObj = new URL(url, window.location.origin);
    
    // Add token to query parameters
    urlObj.searchParams.set('_csrf', token);
    
    return urlObj.toString();
  } catch (error) {
    logError(error, { context: 'addCsrfToUrl' });
    return url;
  }
}

/**
 * Append CSRF header to Headers object for fetch requests
 * @param headers Headers object to append CSRF token to
 */
export function appendCsrfHeader(headers: Headers): void {
  try {
    const token = getCsrfToken();
    
    if (token) {
      headers.set(CSRF_HEADER_NAME, token);
    }
  } catch (error) {
    logError(error, { context: 'appendCsrfHeader' });
  }
}

export default {
  initCsrfProtection,
  generateCsrfToken,
  getCsrfToken,
  validateCsrfToken,
  refreshCsrfToken,
  createCsrfInputField,
  addCsrfToUrl,
  appendCsrfHeader
};