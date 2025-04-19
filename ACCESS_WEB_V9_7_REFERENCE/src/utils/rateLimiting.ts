/**
 * Rate Limiting Utilities
 * 
 * Provides client-side rate limiting for API calls and form submissions
 * to prevent abuse and brute force attacks.
 */

import { getEnvNumber } from './environment';
import { ErrorType, createError, logError } from './errorHandler';
import { secureLocalStorage } from './secureStorage';

// Constants
const RATE_LIMIT_PREFIX = 'rate_limit_';
const DEFAULT_MAX_ATTEMPTS = getEnvNumber('VITE_RATE_LIMIT_MAX_ATTEMPTS', 5);
const DEFAULT_TIMEOUT_MS = getEnvNumber('VITE_RATE_LIMIT_TIMEOUT_MS', 60 * 1000); // 1 minute
const DEFAULT_COOLDOWN_MS = getEnvNumber('VITE_RATE_LIMIT_COOLDOWN_MS', 15 * 60 * 1000); // 15 minutes

// Rate limit data
interface RateLimitData {
  attempts: number;
  timestamp: number;
  blocked: boolean;
  blockedUntil: number;
}

/**
 * Set up rate limiting
 */
export function setupRateLimiting(): void {
  // No specific setup needed, included for consistency with other modules
}

/**
 * Check if an action is rate limited
 * @param key Rate limit key
 * @param maxAttempts Maximum attempts allowed
 * @param timeoutMs Timeout in milliseconds
 * @param cooldownMs Cooldown in milliseconds
 * @returns Whether the action is rate limited
 */
export function isRateLimited(
  key: string,
  maxAttempts: number = DEFAULT_MAX_ATTEMPTS,
  timeoutMs: number = DEFAULT_TIMEOUT_MS,
  cooldownMs: number = DEFAULT_COOLDOWN_MS
): boolean {
  try {
    // Generate storage key
    const storageKey = `${RATE_LIMIT_PREFIX}${key}`;
    
    // Get current data
    const dataString = secureLocalStorage.getItem(storageKey);
    const data: RateLimitData = dataString 
      ? JSON.parse(dataString) 
      : { attempts: 0, timestamp: Date.now(), blocked: false, blockedUntil: 0 };
    
    const now = Date.now();
    
    // Check if blocked
    if (data.blocked) {
      // If block period has expired, reset the block
      if (now >= data.blockedUntil) {
        // Reset data
        data.blocked = false;
        data.attempts = 0;
        data.timestamp = now;
        data.blockedUntil = 0;
        
        // Save updated data
        secureLocalStorage.setItem(storageKey, JSON.stringify(data));
        
        // Not rate limited anymore
        return false;
      }
      
      // Still blocked
      return true;
    }
    
    // Check if timeout has expired
    if (now - data.timestamp > timeoutMs) {
      // Reset attempts after timeout
      data.attempts = 0;
      data.timestamp = now;
      
      // Save updated data
      secureLocalStorage.setItem(storageKey, JSON.stringify(data));
      
      // Not rate limited
      return false;
    }
    
    // Check if max attempts reached
    if (data.attempts >= maxAttempts) {
      // Block for cooldown period
      data.blocked = true;
      data.blockedUntil = now + cooldownMs;
      
      // Save updated data
      secureLocalStorage.setItem(storageKey, JSON.stringify(data));
      
      // Rate limited
      return true;
    }
    
    // Not rate limited
    return false;
  } catch (error) {
    logError(error, { context: 'isRateLimited' });
    return false; // Don't block if there's an error
  }
}

/**
 * Increment attempt counter for rate limiting
 * @param key Rate limit key
 * @param maxAttempts Maximum attempts allowed
 * @param timeoutMs Timeout in milliseconds
 * @param cooldownMs Cooldown in milliseconds
 * @returns Whether the action is now rate limited
 */
export function incrementRateLimitCounter(
  key: string,
  maxAttempts: number = DEFAULT_MAX_ATTEMPTS,
  timeoutMs: number = DEFAULT_TIMEOUT_MS,
  cooldownMs: number = DEFAULT_COOLDOWN_MS
): boolean {
  try {
    // Generate storage key
    const storageKey = `${RATE_LIMIT_PREFIX}${key}`;
    
    // Get current data
    const dataString = secureLocalStorage.getItem(storageKey);
    const data: RateLimitData = dataString 
      ? JSON.parse(dataString) 
      : { attempts: 0, timestamp: Date.now(), blocked: false, blockedUntil: 0 };
    
    const now = Date.now();
    
    // Check if blocked
    if (data.blocked) {
      return true; // Already rate limited
    }
    
    // Check if timeout has expired
    if (now - data.timestamp > timeoutMs) {
      // Reset attempts after timeout
      data.attempts = 1; // Start with 1 for this attempt
      data.timestamp = now;
    } else {
      // Increment attempts
      data.attempts++;
    }
    
    // Check if max attempts reached
    if (data.attempts >= maxAttempts) {
      // Block for cooldown period
      data.blocked = true;
      data.blockedUntil = now + cooldownMs;
    }
    
    // Save updated data
    secureLocalStorage.setItem(storageKey, JSON.stringify(data));
    
    // Return whether the action is now rate limited
    return data.blocked;
  } catch (error) {
    logError(error, { context: 'incrementRateLimitCounter' });
    return false; // Don't block if there's an error
  }
}

/**
 * Reset rate limit counter
 * @param key Rate limit key
 */
export function resetRateLimit(key: string): void {
  try {
    // Generate storage key
    const storageKey = `${RATE_LIMIT_PREFIX}${key}`;
    
    // Remove rate limit data
    secureLocalStorage.removeItem(storageKey);
  } catch (error) {
    logError(error, { context: 'resetRateLimit' });
  }
}

/**
 * Get time until rate limit expires
 * @param key Rate limit key
 * @returns Time in milliseconds until rate limit expires, or 0 if not rate limited
 */
export function getRateLimitRemainingTime(key: string): number {
  try {
    // Generate storage key
    const storageKey = `${RATE_LIMIT_PREFIX}${key}`;
    
    // Get current data
    const dataString = secureLocalStorage.getItem(storageKey);
    
    if (!dataString) {
      return 0; // No rate limit data
    }
    
    const data: RateLimitData = JSON.parse(dataString);
    
    // If not blocked, no remaining time
    if (!data.blocked) {
      return 0;
    }
    
    // Calculate remaining time
    const now = Date.now();
    const remainingTime = data.blockedUntil - now;
    
    // Return 0 if already expired
    return Math.max(0, remainingTime);
  } catch (error) {
    logError(error, { context: 'getRateLimitRemainingTime' });
    return 0;
  }
}

/**
 * Get remaining attempts before rate limit
 * @param key Rate limit key
 * @param maxAttempts Maximum attempts allowed
 * @returns Remaining attempts, or 0 if rate limited
 */
export function getRateLimitRemainingAttempts(
  key: string,
  maxAttempts: number = DEFAULT_MAX_ATTEMPTS
): number {
  try {
    // Generate storage key
    const storageKey = `${RATE_LIMIT_PREFIX}${key}`;
    
    // Get current data
    const dataString = secureLocalStorage.getItem(storageKey);
    
    if (!dataString) {
      return maxAttempts; // No rate limit data, all attempts available
    }
    
    const data: RateLimitData = JSON.parse(dataString);
    
    // If blocked, no attempts remaining
    if (data.blocked) {
      return 0;
    }
    
    // Check if timeout has expired
    const now = Date.now();
    if (now - data.timestamp > DEFAULT_TIMEOUT_MS) {
      return maxAttempts; // Timeout expired, all attempts available
    }
    
    // Calculate remaining attempts
    return Math.max(0, maxAttempts - data.attempts);
  } catch (error) {
    logError(error, { context: 'getRateLimitRemainingAttempts' });
    return maxAttempts; // Return max attempts if there's an error
  }
}

/**
 * Rate limit options interface
 */
interface RateLimitOptions {
  /**
   * Rate limit key
   */
  key: string;
  
  /**
   * Time window in milliseconds
   */
  windowMs?: number;
  
  /**
   * Maximum requests allowed in the time window
   */
  maxRequests?: number;
  
  /**
   * Cooldown period in milliseconds when rate limit is exceeded
   */
  cooldownMs?: number;
}

/**
 * Check rate limit and increment counter
 * Throws error if rate limited
 * @param options Rate limit options
 */
export function checkRateLimit(options: RateLimitOptions): void {
  const { 
    key, 
    windowMs = DEFAULT_TIMEOUT_MS, 
    maxRequests = DEFAULT_MAX_ATTEMPTS,
    cooldownMs = DEFAULT_COOLDOWN_MS 
  } = options;
  
  // Check if rate limited
  if (isRateLimited(key, maxRequests, windowMs, cooldownMs)) {
    const remainingTime = getRateLimitRemainingTime(key);
    const formattedTime = formatRateLimitTime(remainingTime);
    
    throw createError(
      ErrorType.RATE_LIMIT,
      'rate_limit_exceeded',
      `Rate limit exceeded. Please try again in ${formattedTime}.`,
      { key, windowMs, maxRequests, remainingTime }
    );
  }
  
  // Increment rate limit counter
  incrementRateLimitCounter(key, maxRequests, windowMs, cooldownMs);
}

/**
 * Format remaining time as a human-readable string
 * @param ms Milliseconds
 * @returns Formatted time string
 */
export function formatRateLimitTime(ms: number): string {
  if (ms <= 0) {
    return 'now';
  }
  
  const seconds = Math.floor(ms / 1000);
  
  if (seconds < 60) {
    return `${seconds} second${seconds !== 1 ? 's' : ''}`;
  }
  
  const minutes = Math.floor(seconds / 60);
  
  if (minutes < 60) {
    return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
  }
  
  const hours = Math.floor(minutes / 60);
  
  return `${hours} hour${hours !== 1 ? 's' : ''}`;
}

export default {
  setupRateLimiting,
  isRateLimited,
  incrementRateLimitCounter,
  resetRateLimit,
  getRateLimitRemainingTime,
  getRateLimitRemainingAttempts,
  formatRateLimitTime,
  checkRateLimit
};