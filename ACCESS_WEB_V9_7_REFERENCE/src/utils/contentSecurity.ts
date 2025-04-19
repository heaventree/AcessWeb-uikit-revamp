/**
 * Content Security Policy Utilities
 * 
 * Provides tools for implementing and managing Content Security Policy
 * to protect against XSS and other code injection attacks.
 */

import { getEnvString } from './environment';
import { logError } from './errorHandler';

// CSP nonce for inline scripts
let nonce = generateNonce();

/**
 * Initialize Content Security Policy
 */
export function initCSP(): void {
  try {
    // Generate nonce for this session
    updateCSPNonce();
    
    // Apply CSP meta tag
    applyCSPMetaTag();
    
    // Set up event handlers to detect CSP violations
    setupCSPViolationReporting();
  } catch (error) {
    logError(error, { context: 'initCSP' });
  }
}

/**
 * Generate a secure random nonce
 * @returns Generated nonce
 */
export function generateNonce(): string {
  try {
    // Generate random values for nonce
    const randomValues = new Uint8Array(16);
    crypto.getRandomValues(randomValues);
    
    // Convert to base64 string
    return btoa(String.fromCharCode(...randomValues))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');
  } catch (error) {
    logError(error, { context: 'generateNonce' });
    
    // Fallback to simpler method
    return `nonce-${Math.random().toString(36).substring(2, 15)}${Date.now().toString(36)}`;
  }
}

/**
 * Update CSP nonce
 */
export function updateCSPNonce(): void {
  try {
    // Generate new nonce
    nonce = generateNonce();
    
    // Update CSP meta tag with new nonce
    applyCSPMetaTag();
  } catch (error) {
    logError(error, { context: 'updateCSPNonce' });
  }
}

/**
 * Get current CSP nonce
 * @returns Current nonce
 */
export function getNonce(): string {
  return nonce;
}

/**
 * Apply CSP meta tag to document head
 */
function applyCSPMetaTag(): void {
  try {
    // Remove existing CSP meta tag if it exists
    const existingMetaTag = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
    
    if (existingMetaTag) {
      existingMetaTag.remove();
    }
    
    // Create new meta tag with CSP
    const metaTag = document.createElement('meta');
    metaTag.httpEquiv = 'Content-Security-Policy';
    metaTag.content = buildCSPContent();
    
    // Add to head
    document.head.appendChild(metaTag);
  } catch (error) {
    logError(error, { context: 'applyCSPMetaTag' });
  }
}

/**
 * Build CSP content string
 * @returns CSP content string
 */
export function buildCSPContent(): string {
  try {
    // Get CSP configuration from environment
    const reportUri = getEnvString('VITE_CSP_REPORT_URI', '/api/csp-report');
    const reportOnly = getEnvString('VITE_CSP_REPORT_ONLY', 'false') === 'true';
    
    // Build CSP directives
    const directives = [
      // Default (fallback) directive
      `default-src 'self'`,
      
      // Script sources
      `script-src 'self' 'nonce-${nonce}' https://cdn.jsdelivr.net https://cdn.tailwindcss.com`,
      
      // Style sources
      `style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net https://cdn.tailwindcss.com https://fonts.googleapis.com`,
      
      // Font sources
      `font-src 'self' https://fonts.gstatic.com`,
      
      // Image sources
      `img-src 'self' data: https:`,
      
      // Connect sources
      `connect-src 'self' https://api.accessibility-checker.org`,
      
      // Frame sources
      `frame-src 'self'`,
      
      // Media sources
      `media-src 'self'`,
      
      // Object sources (PDFs, Flash, etc.)
      `object-src 'none'`,
      
      // Base URI restriction
      `base-uri 'self'`,
      
      // Form action restriction
      `form-action 'self'`,
      
      // Frame ancestors restriction (prevents clickjacking)
      `frame-ancestors 'self'`,
      
      // Restrict use of dangerous features
      `block-all-mixed-content`,
      
      // Report violations
      `report-uri ${reportUri}`
    ];
    
    // Join directives
    const cspString = directives.join('; ');
    
    return cspString;
  } catch (error) {
    logError(error, { context: 'buildCSPContent' });
    
    // Fallback to basic CSP
    return `default-src 'self'; script-src 'self' 'nonce-${nonce}'; style-src 'self' 'unsafe-inline';`;
  }
}

/**
 * Set up event handlers to detect CSP violations
 */
function setupCSPViolationReporting(): void {
  try {
    // Listen for CSP violation reports
    document.addEventListener('securitypolicyviolation', (e) => {
      // Log CSP violations
      logError(new Error(`CSP Violation: ${e.violatedDirective}`), {
        context: 'CSP Violation',
        data: {
          blockedURI: e.blockedURI,
          violatedDirective: e.violatedDirective,
          originalPolicy: e.originalPolicy,
          disposition: e.disposition,
          documentURI: e.documentURI,
          effectiveDirective: e.effectiveDirective,
          sourceFile: e.sourceFile,
          lineNumber: e.lineNumber,
          columnNumber: e.columnNumber
        }
      });
    });
  } catch (error) {
    logError(error, { context: 'setupCSPViolationReporting' });
  }
}

/**
 * Validate CSP is correctly applied
 * @returns Whether CSP is correctly applied
 */
export function validateCSP(): boolean {
  try {
    // Check for CSP meta tag
    const metaTag = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
    
    if (!metaTag) {
      // CSP not found, reapply
      applyCSPMetaTag();
      return false;
    }
    
    // Check if CSP content includes current nonce
    const content = metaTag.getAttribute('content') || '';
    
    if (!content.includes(`nonce-${nonce}`)) {
      // Nonce mismatch, update CSP
      applyCSPMetaTag();
      return false;
    }
    
    return true;
  } catch (error) {
    logError(error, { context: 'validateCSP' });
    return false;
  }
}

/**
 * Add nonce to script element
 * @param script Script element to add nonce to
 */
export function addNonceToScript(script: HTMLScriptElement): void {
  try {
    script.nonce = nonce;
  } catch (error) {
    logError(error, { context: 'addNonceToScript' });
  }
}

export default {
  initCSP,
  updateCSPNonce,
  validateCSP,
  getNonce,
  addNonceToScript,
  buildCSPContent
};