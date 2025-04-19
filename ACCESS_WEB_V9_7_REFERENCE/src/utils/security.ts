/**
 * Security Utility
 * 
 * Provides security utilities for CSRF protection, content security, and
 * secure string operations.
 */

import { authStorage } from './secureStorage';
import { createError, ErrorType } from './errorHandler';

/**
 * CSRF protection utilities
 */
export const csrfProtection = {
  /**
   * Generate a secure CSRF token
   */
  generateToken(): string {
    // Generate a cryptographically secure random token
    let token = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const randomValues = new Uint32Array(32);
    
    // Use crypto.getRandomValues for secure random generation
    window.crypto.getRandomValues(randomValues);
    
    randomValues.forEach(value => {
      token += characters.charAt(value % characters.length);
    });
    
    // Store the token securely
    authStorage.setItem('csrf', token);
    return token;
  },
  
  /**
   * Get the current CSRF token or generate a new one
   */
  getToken(): string {
    const token = authStorage.getItem('csrf');
    return token || this.generateToken();
  },
  
  /**
   * Validate a CSRF token
   */
  validateToken(token: string): boolean {
    const storedToken = authStorage.getItem('csrf');
    
    if (!storedToken) {
      throw createError(
        ErrorType.SECURITY,
        'missing_csrf_token',
        'CSRF token is missing'
      );
    }
    
    // Validate the token using constant-time comparison to prevent timing attacks
    return this.constantTimeCompare(token, storedToken);
  },
  
  /**
   * Constant-time string comparison to prevent timing attacks
   */
  constantTimeCompare(a: string, b: string): boolean {
    if (a.length !== b.length) {
      return false;
    }
    
    let result = 0;
    for (let i = 0; i < a.length; i++) {
      result |= a.charCodeAt(i) ^ b.charCodeAt(i);
    }
    
    return result === 0;
  }
};

/**
 * Content security utilities
 */
export const contentSecurity = {
  /**
   * Sanitize HTML content to prevent XSS attacks
   */
  sanitizeHtml(html: string): string {
    // Create a new DOM parser
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    
    // Remove potentially dangerous elements and attributes
    const dangerousElements = ['script', 'iframe', 'object', 'embed'];
    const dangerousAttributes = ['onerror', 'onload', 'onclick', 'onmouseover'];
    
    // Process all elements
    dangerousElements.forEach(tag => {
      const elements = doc.getElementsByTagName(tag);
      while (elements.length > 0) {
        const element = elements[0];
        element.parentNode?.removeChild(element);
      }
    });
    
    // Process all elements for dangerous attributes
    const allElements = doc.getElementsByTagName('*');
    for (let i = 0; i < allElements.length; i++) {
      const element = allElements[i];
      
      // Remove dangerous attributes
      dangerousAttributes.forEach(attr => {
        if (element.hasAttribute(attr)) {
          element.removeAttribute(attr);
        }
      });
      
      // Sanitize URLs in href and src attributes
      ['href', 'src'].forEach(urlAttr => {
        if (element.hasAttribute(urlAttr)) {
          const url = element.getAttribute(urlAttr);
          if (url && (url.startsWith('javascript:') || url.startsWith('data:'))) {
            element.removeAttribute(urlAttr);
          }
        }
      });
    }
    
    return doc.body.innerHTML;
  },
  
  /**
   * Escape HTML special characters to prevent XSS
   */
  escapeHtml(text: string): string {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  },
  
  /**
   * Validate and sanitize URLs
   */
  sanitizeUrl(url: string): string {
    // Only allow http, https, and relative URLs
    if (!url.match(/^(https?:\/\/|\/)/)) {
      return '#'; // Return a safe default
    }
    
    return url;
  }
};

/**
 * Update the error type to include security errors
 */
// This is already done in our errorHandler.ts, keeping this comment as a reminder

export default {
  csrfProtection,
  contentSecurity
};