/**
 * Security Provider
 * 
 * Provides a centralized security layer that combines multiple security
 * measures including CSP, rate limiting, CSRF protection, and data sanitization.
 */

import { ReactNode, useEffect, useState } from 'react';
import { initCSP, updateCSPNonce, validateCSP } from '../utils/contentSecurity';
import { setupRateLimiting } from '../utils/rateLimiting';
import { initCsrfProtection, generateCsrfToken, validateCsrfToken } from '../utils/csrfProtection';
import { configureSanitizerDefaults } from '../utils/sanitization';
import { setupSecureStorage, isSecureStorageInitialized } from '../utils/secureStorage';
import { loadEnvVariables } from '../utils/environment';

// Security provider props
interface SecurityProviderProps {
  /**
   * Child components
   */
  children: ReactNode;
}

/**
 * Security Provider Component
 * 
 * Configures and applies security measures for the entire application
 */
export function SecurityProvider({ children }: SecurityProviderProps): JSX.Element {
  // Track initialization state
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Initialize security features on mount
  useEffect(() => {
    const initializeSecurity = async () => {
      try {
        // Initialize environment variables
        loadEnvVariables();
        
        // Initialize Content Security Policy
        initCSP();
        
        // Configure sanitizer defaults
        configureSanitizerDefaults();
        
        // Setup CSRF protection
        initCsrfProtection();
        
        // Setup rate limiting
        setupRateLimiting();
        
        // Initialize secure storage
        await setupSecureStorage();
        
        // Update CSP nonce on each render for enhanced security
        updateCSPNonce();
        
        // Mark as initialized
        setIsInitialized(true);
      } catch (error) {
        console.error('Security initialization error:', error);
        // Continue anyway to avoid blocking the app
        setIsInitialized(true);
      }
    };
    
    initializeSecurity();
    
    // Set up interval to validate CSP
    const validateInterval = setInterval(() => {
      validateCSP();
    }, 60000); // Check every minute
    
    // Cleanup function
    return () => {
      clearInterval(validateInterval);
    };
  }, []);
  
  // Show nothing until security is initialized
  if (!isInitialized && !isSecureStorageInitialized()) {
    return null;
  }
  
  return (
    <>{children}</>
  );
}

// Re-export security utilities for use in components
export { 
  generateCsrfToken, 
  validateCsrfToken 
};

export default SecurityProvider;