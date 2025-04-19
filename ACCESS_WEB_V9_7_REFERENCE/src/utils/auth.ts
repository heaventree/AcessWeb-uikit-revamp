/**
 * Authentication Utilities
 * 
 * Provides secure JWT token handling with automatic key rotation,
 * token validation, and secure storage.
 */

import * as jose from 'jose';
import { createError, ErrorType, logError } from './errorHandler';
import { secureLocalStorage, secureSessionStorage } from './secureStorage';
import { getEnvNumber, getEnvString } from './environment';

// Configuration constants
const JWT_SECRET = getEnvString('VITE_JWT_SECRET', 'wcag_secure_jwt_secret_key_please_change_in_production');
const JWT_EXPIRY = getEnvNumber('VITE_JWT_EXPIRY', 60 * 60); // 1 hour in seconds
const REFRESH_TOKEN_EXPIRY = getEnvNumber('VITE_REFRESH_TOKEN_EXPIRY', 7 * 24 * 60 * 60); // 7 days in seconds
const AUTH_PERSISTENCE_KEY = 'auth_token';
const REFRESH_PERSISTENCE_KEY = 'refresh_token';
const USER_PERSISTENCE_KEY = 'auth_user';

// Define token payload interfaces
interface TokenPayload {
  sub: string;       // Subject (user ID)
  email?: string;    // User email
  name?: string;     // User name
  role?: string;     // User role
  iat: number;       // Issued at (timestamp)
  exp: number;       // Expiration (timestamp)
  iss?: string;      // Issuer
  aud?: string;      // Audience
  jti?: string;      // JWT ID (for blacklisting)
}

// User data interface
export interface UserData {
  id: string;
  email: string;
  name: string;
  role: string;
  [key: string]: any;
}

// Rotated key manager for JWT signing and verification
class JwtKeyManager {
  private currentKey: CryptoKey | null = null;
  private previousKey: CryptoKey | null = null;
  private keyGeneratedAt: number = 0;
  private readonly keyRotationInterval: number = 24 * 60 * 60 * 1000; // 24 hours in ms
  
  /**
   * Get current signing key, generating if needed
   * @returns Current signing key
   */
  async getCurrentSigningKey(): Promise<CryptoKey> {
    await this.rotateKeysIfNeeded();
    return this.currentKey!;
  }
  
  /**
   * Get verification keys (current and previous)
   * @returns Array of verification keys
   */
  async getVerificationKeys(): Promise<CryptoKey[]> {
    await this.rotateKeysIfNeeded();
    const keys: CryptoKey[] = [this.currentKey!];
    
    if (this.previousKey) {
      keys.push(this.previousKey);
    }
    
    return keys;
  }
  
  /**
   * Rotate keys if enough time has passed
   */
  private async rotateKeysIfNeeded(): Promise<void> {
    const now = Date.now();
    
    // Generate key if no current key or rotation interval has passed
    if (
      !this.currentKey ||
      now - this.keyGeneratedAt >= this.keyRotationInterval
    ) {
      // Move current key to previous
      if (this.currentKey) {
        this.previousKey = this.currentKey;
      }
      
      // Generate new current key
      try {
        this.currentKey = await this.generateKey();
        this.keyGeneratedAt = now;
      } catch (error) {
        logError(error, { context: 'JwtKeyManager.rotateKeysIfNeeded' });
        
        // If key generation fails, keep using old key
        if (!this.currentKey && this.previousKey) {
          this.currentKey = this.previousKey;
          this.previousKey = null;
        }
      }
    }
  }
  
  /**
   * Generate a new HMAC key for JWT signing
   * @returns Generated crypto key
   */
  private async generateKey(): Promise<CryptoKey> {
    // Convert JWT secret to bytes
    const encoder = new TextEncoder();
    const secretBytes = encoder.encode(JWT_SECRET);
    
    // Import as HMAC key
    return crypto.subtle.importKey(
      'raw',
      secretBytes,
      { name: 'HMAC', hash: 'SHA-256' },
      false, // Non-extractable
      ['sign', 'verify'] // Key usage
    );
  }
}

// Create key manager instance
const keyManager = new JwtKeyManager();

/**
 * Generate a JWT token for a user
 * @param user User data
 * @param expiresIn Expiration time in seconds
 * @returns Generated JWT token
 */
export async function generateToken(
  user: UserData,
  expiresIn: number = JWT_EXPIRY
): Promise<string> {
  try {
    // Get current signing key
    const key = await keyManager.getCurrentSigningKey();
    
    // Generate random JWT ID
    const keyId = crypto.randomUUID();
    
    // Create JWT payload
    const payload: TokenPayload = {
      sub: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + expiresIn,
      jti: keyId,
      iss: 'wcag-accessibility-service'
    };
    
    // Sign token
    const token = await new jose.SignJWT(payload)
      .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
      .sign(key);
    
    return token;
  } catch (error) {
    logError(error, { context: 'auth.generateToken' });
    throw createError(
      ErrorType.INTERNAL,
      'token_generation_failed',
      'Failed to generate authentication token',
      { originalError: error }
    );
  }
}

/**
 * Generate a refresh token for a user
 * @param userId User ID
 * @param expiresIn Expiration time in seconds
 * @returns Generated refresh token
 */
export async function generateRefreshToken(
  userId: string,
  expiresIn: number = REFRESH_TOKEN_EXPIRY
): Promise<string> {
  try {
    // Get current signing key
    const key = await keyManager.getCurrentSigningKey();
    
    // Create JWT payload for refresh token (minimal)
    const payload = {
      sub: userId,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + expiresIn,
      jti: crypto.randomUUID(),
      iss: 'wcag-accessibility-service',
      type: 'refresh'
    };
    
    // Sign token
    const token = await new jose.SignJWT(payload)
      .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
      .sign(key);
    
    return token;
  } catch (error) {
    logError(error, { context: 'auth.generateRefreshToken' });
    throw createError(
      ErrorType.INTERNAL,
      'refresh_token_generation_failed',
      'Failed to generate refresh token',
      { originalError: error }
    );
  }
}

/**
 * Verify a JWT token
 * @param token JWT token to verify
 * @returns Decoded token payload
 */
export async function verifyToken(token: string): Promise<TokenPayload> {
  try {
    // Get verification keys
    const keys = await keyManager.getVerificationKeys();
    
    // Try each key
    let verificationError: Error | null = null;
    
    for (const key of keys) {
      try {
        // Verify token with this key
        const { payload } = await jose.jwtVerify(token, key);
        return payload as TokenPayload;
      } catch (error) {
        // Store error but continue trying other keys
        verificationError = error as Error;
      }
    }
    
    // If we got here, none of the keys worked
    throw verificationError || new Error('Token verification failed');
  } catch (error) {
    // Check if token expired
    if (error instanceof Error && error.message.includes('expired')) {
      throw createError(
        ErrorType.AUTHENTICATION,
        'token_expired',
        'Authentication token has expired',
        { originalError: error }
      );
    }
    
    // General verification error
    throw createError(
      ErrorType.AUTHENTICATION,
      'token_invalid',
      'Invalid authentication token',
      { originalError: error }
    );
  }
}

/**
 * Verify a refresh token
 * @param token Refresh token to verify
 * @returns User ID from token
 */
export async function verifyRefreshToken(token: string): Promise<string> {
  try {
    // Verify token
    const payload = await verifyToken(token);
    
    // Check if it's a refresh token
    if (payload.type !== 'refresh') {
      throw new Error('Not a refresh token');
    }
    
    // Return user ID
    return payload.sub;
  } catch (error) {
    throw createError(
      ErrorType.AUTHENTICATION,
      'refresh_token_invalid',
      'Invalid refresh token',
      { originalError: error }
    );
  }
}

/**
 * Store authentication data securely
 * @param token JWT token
 * @param refreshToken Refresh token
 * @param user User data
 * @param rememberMe Whether to persist across sessions
 */
export function storeAuth(
  token: string,
  refreshToken: string,
  user: UserData,
  rememberMe: boolean = false
): void {
  try {
    // Determine storage to use
    const storage = rememberMe ? secureLocalStorage : secureSessionStorage;
    
    // Store tokens and user data
    storage.setItem(AUTH_PERSISTENCE_KEY, token);
    storage.setItem(REFRESH_PERSISTENCE_KEY, refreshToken);
    storage.setItem(USER_PERSISTENCE_KEY, JSON.stringify(user));
  } catch (error) {
    logError(error, { context: 'auth.storeAuth' });
    // Don't throw here to avoid breaking authentication flow
  }
}

/**
 * Get stored authentication data
 * @returns Authentication data or null if not logged in
 */
export function getStoredAuth(): {
  token: string;
  refreshToken: string;
  user: UserData;
} | null {
  try {
    // Try session storage first
    let token = secureSessionStorage.getItem(AUTH_PERSISTENCE_KEY);
    let refreshToken = secureSessionStorage.getItem(REFRESH_PERSISTENCE_KEY);
    let userData = secureSessionStorage.getItem(USER_PERSISTENCE_KEY);
    
    // If not in session storage, try local storage
    if (!token || !refreshToken || !userData) {
      token = secureLocalStorage.getItem(AUTH_PERSISTENCE_KEY);
      refreshToken = secureLocalStorage.getItem(REFRESH_PERSISTENCE_KEY);
      userData = secureLocalStorage.getItem(USER_PERSISTENCE_KEY);
    }
    
    // Return null if any required item is missing
    if (!token || !refreshToken || !userData) {
      return null;
    }
    
    // Parse user data
    const user = JSON.parse(userData) as UserData;
    
    // Return authenticated data
    return { token, refreshToken, user };
  } catch (error) {
    logError(error, { context: 'auth.getStoredAuth' });
    return null;
  }
}

/**
 * Clear stored authentication data (logout)
 */
export function clearAuth(): void {
  try {
    // Remove from both storages to ensure complete logout
    secureSessionStorage.removeItem(AUTH_PERSISTENCE_KEY);
    secureSessionStorage.removeItem(REFRESH_PERSISTENCE_KEY);
    secureSessionStorage.removeItem(USER_PERSISTENCE_KEY);
    
    secureLocalStorage.removeItem(AUTH_PERSISTENCE_KEY);
    secureLocalStorage.removeItem(REFRESH_PERSISTENCE_KEY);
    secureLocalStorage.removeItem(USER_PERSISTENCE_KEY);
  } catch (error) {
    logError(error, { context: 'auth.clearAuth' });
    // Don't throw here to ensure logout completes even with errors
  }
}

/**
 * Check if user is authenticated
 * @returns True if user is authenticated
 */
export function isAuthenticated(): boolean {
  return getStoredAuth() !== null;
}

/**
 * Get current authenticated user
 * @returns User data or null if not logged in
 */
export function getCurrentUser(): UserData | null {
  const authData = getStoredAuth();
  return authData ? authData.user : null;
}

/**
 * Check if token needs refresh
 * @param token JWT token
 * @returns True if token needs refresh
 */
export async function needsTokenRefresh(token: string): Promise<boolean> {
  try {
    // Decode token (without verification)
    const decoded = jose.decodeJwt(token);
    
    // Check if token is close to expiry
    const expiryBuffer = 5 * 60; // 5 minutes buffer
    const now = Math.floor(Date.now() / 1000);
    
    return !decoded.exp || decoded.exp < now + expiryBuffer;
  } catch (error) {
    // If decoding fails, assume token needs refresh
    logError(error, { context: 'auth.needsTokenRefresh' });
    return true;
  }
}

/**
 * Check if user has required role
 * @param requiredRole Required role
 * @param user User to check (defaults to current user)
 * @returns True if user has required role
 */
export function hasRole(requiredRole: string, user?: UserData): boolean {
  // Get user to check
  const userToCheck = user || getCurrentUser();
  
  // Not authenticated
  if (!userToCheck) {
    return false;
  }
  
  // Admin role has access to everything
  if (userToCheck.role === 'admin') {
    return true;
  }
  
  // Check if user has required role
  return userToCheck.role === requiredRole;
}

export default {
  generateToken,
  generateRefreshToken,
  verifyToken,
  verifyRefreshToken,
  storeAuth,
  getStoredAuth,
  clearAuth,
  isAuthenticated,
  getCurrentUser,
  needsTokenRefresh,
  hasRole
};