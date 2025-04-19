/**
 * Sanitization Utilities
 * 
 * Provides secure data sanitization utilities to protect against
 * XSS and other injection attacks.
 */

import DOMPurify from 'dompurify';
import { logError } from './errorHandler';

/**
 * Default DOMPurify configuration
 */
const DEFAULT_SANITIZE_CONFIG: DOMPurify.Config = {
  USE_PROFILES: { html: true },
  ALLOWED_TAGS: [
    'a', 'b', 'br', 'code', 'div', 'em', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'i', 'li', 'ol', 'p', 'pre', 'span', 'strong', 'table', 'tbody', 'td',
    'th', 'thead', 'tr', 'ul'
  ],
  ALLOWED_ATTR: [
    'aria-*', 'class', 'data-*', 'href', 'id', 'rel', 'style', 'target', 'title'
  ],
  FORBID_TAGS: ['script', 'style', 'iframe', 'object', 'form', 'input', 'button'],
  FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover', 'eval'],
  ALLOW_ARIA_ATTR: true,
  ALLOW_DATA_ATTR: true,
  SAFE_FOR_TEMPLATES: true,
  SAFE_FOR_JQUERY: true,
  SANITIZE_DOM: true,
  ADD_ATTR: ['target']
};

/**
 * Configure DOMPurify defaults
 */
export function configureSanitizerDefaults(): void {
  try {
    // Add hooks for additional security
    DOMPurify.addHook('afterSanitizeAttributes', function(node) {
      // Set all links to open in a new tab and add security attributes
      if (node.tagName === 'A') {
        node.setAttribute('target', '_blank');
        node.setAttribute('rel', 'noopener noreferrer');
        
        // Ensure links only use safe protocols
        if (node.getAttribute('href')) {
          const href = node.getAttribute('href') || '';
          const isExternal = href.startsWith('http://') || href.startsWith('https://');
          
          if (isExternal) {
            // Add warning class to external links
            node.classList.add('external-link');
          } else if (!href.startsWith('/') && !href.startsWith('#') && !href.startsWith('mailto:')) {
            // Suspicious protocol, make it a placeholder
            node.setAttribute('href', '#invalid-link');
            node.classList.add('invalid-link');
          }
        }
      }
      
      // Remove JS events from all elements
      node.removeAttribute('onload');
      node.removeAttribute('onerror');
      node.removeAttribute('onclick');
      node.removeAttribute('onmouseover');
      
      // Allow only certain inline styles and sanitize them
      if (node.hasAttribute('style')) {
        const style = node.getAttribute('style') || '';
        const sanitizedStyle = sanitizeStyles(style);
        
        if (sanitizedStyle) {
          node.setAttribute('style', sanitizedStyle);
        } else {
          node.removeAttribute('style');
        }
      }
    });
  } catch (error) {
    logError(error, { context: 'configureSanitizerDefaults' });
  }
}

/**
 * Sanitize HTML content
 * @param html HTML content to sanitize
 * @param config Optional DOMPurify config
 * @returns Sanitized HTML
 */
export function sanitizeHtml(html: string, config?: DOMPurify.Config): string {
  try {
    const mergedConfig = {
      ...DEFAULT_SANITIZE_CONFIG,
      ...(config || {})
    };
    
    return DOMPurify.sanitize(html, mergedConfig);
  } catch (error) {
    logError(error, { context: 'sanitizeHtml' });
    return '';
  }
}

/**
 * Sanitize plain text (remove all HTML)
 * @param text Text to sanitize
 * @returns Sanitized text
 */
export function sanitizeText(text: string): string {
  try {
    if (!text) return '';
    
    // Use DOMPurify with strict config to strip all HTML
    const config: DOMPurify.Config = {
      ALLOWED_TAGS: [],
      ALLOWED_ATTR: [],
      KEEP_CONTENT: true
    };
    
    return DOMPurify.sanitize(text, config);
  } catch (error) {
    logError(error, { context: 'sanitizeText' });
    return '';
  }
}

/**
 * Sanitize URL
 * @param url URL to sanitize
 * @returns Sanitized URL
 */
export function sanitizeUrl(url: string): string {
  try {
    if (!url) return '';
    
    // Validate URL format
    try {
      // Use URL constructor to validate
      new URL(url);
      
      // Check for unsafe protocols
      const protocol = url.split(':')[0].toLowerCase();
      const safeProtocols = ['http', 'https', 'mailto', 'tel', 'ftp'];
      
      if (!safeProtocols.includes(protocol)) {
        return '#';
      }
      
      // Sanitize URL components
      return DOMPurify.sanitize(url, {
        ALLOWED_TAGS: [],
        ALLOWED_ATTR: []
      });
    } catch (error) {
      // Not a valid URL
      return '#';
    }
  } catch (error) {
    logError(error, { context: 'sanitizeUrl' });
    return '#';
  }
}

/**
 * Sanitize CSS styles
 * @param styles CSS styles to sanitize
 * @returns Sanitized styles
 */
export function sanitizeStyles(styles: string): string {
  try {
    if (!styles) return '';
    
    // Split styles by semicolon
    const styleProperties = styles.split(';').filter(Boolean);
    const allowedProperties = [
      'color', 'background-color', 'font-size', 'font-weight', 'font-style',
      'text-align', 'text-decoration', 'margin', 'padding', 'border',
      'display', 'width', 'height', 'max-width', 'max-height'
    ];
    
    // Filter and validate each property
    const sanitizedProperties = styleProperties
      .map(prop => {
        const [name, value] = prop.split(':').map(s => s.trim());
        
        // Check if property is allowed
        if (!allowedProperties.includes(name)) {
          return null;
        }
        
        // Check for potentially unsafe values
        if (
          value.includes('javascript:') ||
          value.includes('expression') ||
          value.includes('url(') ||
          value.includes('eval(')
        ) {
          return null;
        }
        
        return `${name}: ${value}`;
      })
      .filter(Boolean);
    
    return sanitizedProperties.join('; ');
  } catch (error) {
    logError(error, { context: 'sanitizeStyles' });
    return '';
  }
}

/**
 * Sanitize a filename to be safe for storage
 * @param filename Filename to sanitize
 * @returns Sanitized filename
 */
export function sanitizeFilename(filename: string): string {
  try {
    if (!filename) return '';
    
    // Remove path traversal and special characters
    const sanitized = filename
      .replace(/[/\\?%*:|"<>]/g, '')
      .replace(/\.\./g, '');
    
    return sanitized || 'file';
  } catch (error) {
    logError(error, { context: 'sanitizeFilename' });
    return 'file';
  }
}

// Export directly to ensure it's available for named imports

/**
 * Recursively sanitize an object's string properties
 * @param obj Object to sanitize
 * @returns Sanitized object
 */
export function sanitizeObject<T extends Record<string, any>>(obj: T): T {
  try {
    if (!obj || typeof obj !== 'object') {
      return obj;
    }

    // Create a copy of the object to avoid modifying the original
    const result = { ...obj };

    // Process each property
    Object.keys(result).forEach(key => {
      const value = result[key];

      // Handle different types
      if (typeof value === 'string') {
        // Sanitize string values
        result[key] = sanitizeText(value);
      } else if (value && typeof value === 'object' && !Array.isArray(value)) {
        // Recursively sanitize nested objects
        result[key] = sanitizeObject(value);
      } else if (Array.isArray(value)) {
        // Sanitize arrays
        result[key] = value.map(item => {
          if (typeof item === 'string') {
            return sanitizeText(item);
          } else if (item && typeof item === 'object') {
            return sanitizeObject(item);
          }
          return item;
        });
      }
      // Leave other types unchanged
    });

    return result;
  } catch (error) {
    logError(error, { context: 'sanitizeObject' });
    return obj;
  }
}

export default {
  configureSanitizerDefaults,
  sanitizeHtml,
  sanitizeText,
  sanitizeUrl,
  sanitizeStyles,
  sanitizeFilename,
  sanitizeObject
};