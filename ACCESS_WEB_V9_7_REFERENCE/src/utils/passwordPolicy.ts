/**
 * Password Policy
 * 
 * Enforces secure password requirements and account lockout
 * functionality to prevent brute force attacks.
 */

import { secureLocalStorage } from './secureStorage';
import { getEnvNumber } from './environment';

// Config constants - get from environment or use secure defaults
const MAX_FAILED_LOGIN_ATTEMPTS = getEnvNumber('VITE_MAX_FAILED_LOGIN_ATTEMPTS', 5);
const LOCKOUT_TIME = getEnvNumber('VITE_ACCOUNT_LOCKOUT_TIME', 15 * 60 * 1000); // 15 minutes in ms
const PASSWORD_MIN_LENGTH = getEnvNumber('VITE_PASSWORD_MIN_LENGTH', 10);
const PASSWORD_MAX_LENGTH = getEnvNumber('VITE_PASSWORD_MAX_LENGTH', 100);

// Storage keys
const FAILED_ATTEMPTS_KEY_PREFIX = 'failed_attempts_';
const LOCKOUT_TIME_KEY_PREFIX = 'lockout_until_';

/**
 * Account lockout manager
 */
export const AccountLockoutManager = {
  /**
   * Record a failed login attempt
   * @param email User email
   */
  recordFailedAttempt(email: string): void {
    const normalizedEmail = email.toLowerCase().trim();
    const key = `${FAILED_ATTEMPTS_KEY_PREFIX}${normalizedEmail}`;
    
    // Get current attempt count
    const currentAttemptsStr = secureLocalStorage.getItem(key) || '0';
    const currentAttempts = parseInt(currentAttemptsStr, 10);
    
    // Increment attempts
    const newAttempts = currentAttempts + 1;
    secureLocalStorage.setItem(key, newAttempts.toString());
    
    // Lock account if max attempts reached
    if (newAttempts >= MAX_FAILED_LOGIN_ATTEMPTS) {
      const lockoutUntil = Date.now() + LOCKOUT_TIME;
      secureLocalStorage.setItem(
        `${LOCKOUT_TIME_KEY_PREFIX}${normalizedEmail}`,
        lockoutUntil.toString()
      );
    }
  },
  
  /**
   * Reset failed login attempts
   * @param email User email
   */
  resetLockout(email: string): void {
    const normalizedEmail = email.toLowerCase().trim();
    
    // Remove lockout records
    secureLocalStorage.removeItem(`${FAILED_ATTEMPTS_KEY_PREFIX}${normalizedEmail}`);
    secureLocalStorage.removeItem(`${LOCKOUT_TIME_KEY_PREFIX}${normalizedEmail}`);
  },
  
  /**
   * Check if an account is locked
   * @param email User email
   * @returns True if account is locked
   */
  isAccountLocked(email: string): boolean {
    const normalizedEmail = email.toLowerCase().trim();
    const lockoutUntilStr = secureLocalStorage.getItem(
      `${LOCKOUT_TIME_KEY_PREFIX}${normalizedEmail}`
    );
    
    if (!lockoutUntilStr) {
      return false;
    }
    
    const lockoutUntil = parseInt(lockoutUntilStr, 10);
    
    // If lockout time has passed, reset lockout
    if (Date.now() > lockoutUntil) {
      this.resetLockout(normalizedEmail);
      return false;
    }
    
    return true;
  },
  
  /**
   * Get the remaining lockout time in seconds
   * @param email User email
   * @returns Remaining lockout time in seconds
   */
  getLockoutTimeRemaining(email: string): number {
    const normalizedEmail = email.toLowerCase().trim();
    const lockoutUntilStr = secureLocalStorage.getItem(
      `${LOCKOUT_TIME_KEY_PREFIX}${normalizedEmail}`
    );
    
    if (!lockoutUntilStr) {
      return 0;
    }
    
    const lockoutUntil = parseInt(lockoutUntilStr, 10);
    const remainingMs = Math.max(0, lockoutUntil - Date.now());
    return Math.ceil(remainingMs / 1000);
  },
  
  /**
   * Get the number of failed attempts
   * @param email User email
   * @returns Number of failed attempts
   */
  getFailedAttempts(email: string): number {
    const normalizedEmail = email.toLowerCase().trim();
    const attemptsStr = secureLocalStorage.getItem(
      `${FAILED_ATTEMPTS_KEY_PREFIX}${normalizedEmail}`
    );
    
    return attemptsStr ? parseInt(attemptsStr, 10) : 0;
  }
};

/**
 * Password policy validator
 */
export const PasswordPolicy = {
  /**
   * Validate password against policy
   * @param password Password to validate
   * @returns Validation result
   */
  validate(password: string): {
    valid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];
    
    // Length requirements
    if (password.length < PASSWORD_MIN_LENGTH) {
      errors.push(`Password must be at least ${PASSWORD_MIN_LENGTH} characters long.`);
    }
    
    if (password.length > PASSWORD_MAX_LENGTH) {
      errors.push(`Password must be at most ${PASSWORD_MAX_LENGTH} characters long.`);
    }
    
    // Complexity requirements
    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter.');
    }
    
    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter.');
    }
    
    if (!/[0-9]/.test(password)) {
      errors.push('Password must contain at least one number.');
    }
    
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      errors.push('Password must contain at least one special character.');
    }
    
    // Common patterns
    if (/^123|password|admin|qwerty|welcome/i.test(password)) {
      errors.push('Password contains a common pattern and is too easy to guess.');
    }
    
    return {
      valid: errors.length === 0,
      errors
    };
  },
  
  /**
   * Get password policy requirements
   * @returns Password policy requirements
   */
  getRequirements(): string[] {
    return [
      `At least ${PASSWORD_MIN_LENGTH} characters long`,
      'At least one uppercase letter',
      'At least one lowercase letter',
      'At least one number',
      'At least one special character'
    ];
  },
  
  /**
   * Estimate password strength
   * @param password Password to evaluate
   * @returns Strength score from 0-100
   */
  estimateStrength(password: string): number {
    if (!password) return 0;
    
    let score = 0;
    
    // Length score (up to 40 points)
    const lengthScore = Math.min(40, Math.floor((password.length / PASSWORD_MIN_LENGTH) * 20));
    score += lengthScore;
    
    // Character variety (up to 40 points)
    if (/[A-Z]/.test(password)) score += 10;
    if (/[a-z]/.test(password)) score += 10;
    if (/[0-9]/.test(password)) score += 10;
    if (/[^A-Za-z0-9]/.test(password)) score += 10;
    
    // Bonus for mixed character types (up to 20 points)
    if (/[A-Z].*[0-9]|[0-9].*[A-Z]/.test(password)) score += 5;
    if (/[a-z].*[0-9]|[0-9].*[a-z]/.test(password)) score += 5;
    if (/[A-Z].*[^A-Za-z0-9]|[^A-Za-z0-9].*[A-Z]/.test(password)) score += 5;
    if (/[a-z].*[^A-Za-z0-9]|[^A-Za-z0-9].*[a-z]/.test(password)) score += 5;
    
    // Penalties
    if (/^123|password|admin|qwerty|welcome/i.test(password)) score -= 30;
    if (password.length < PASSWORD_MIN_LENGTH) score = Math.min(score, 40);
    
    // Ensure score is between 0-100
    return Math.max(0, Math.min(100, score));
  },
  
  /**
   * Get password strength label
   * @param score Strength score
   * @returns Strength label
   */
  getStrengthLabel(score: number): 'very weak' | 'weak' | 'moderate' | 'strong' | 'very strong' {
    if (score < 20) return 'very weak';
    if (score < 40) return 'weak';
    if (score < 60) return 'moderate';
    if (score < 80) return 'strong';
    return 'very strong';
  }
};

export default {
  AccountLockoutManager,
  PasswordPolicy,
  MAX_FAILED_LOGIN_ATTEMPTS,
  LOCKOUT_TIME,
  PASSWORD_MIN_LENGTH,
  PASSWORD_MAX_LENGTH
};