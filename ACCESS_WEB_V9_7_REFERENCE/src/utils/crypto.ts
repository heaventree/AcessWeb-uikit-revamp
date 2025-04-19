/**
 * Cryptography Utilities
 * 
 * Provides secure cryptographic functions using Web Crypto API
 * for encryption, hashing, and random data generation.
 */

// Constants for encryption
const ALGORITHM = 'AES-GCM';
const KEY_LENGTH = 256; // bits
const ITERATION_COUNT = 100000;
const SALT_LENGTH = 16; // bytes
const IV_LENGTH = 12; // bytes
const AUTH_TAG_LENGTH = 16; // bytes

/**
 * Generate a cryptographically secure random string
 * @param length Length of the random string
 * @returns Random string in base64 format
 */
export function generateSecureRandomString(length: number): string {
  // Create random bytes
  const randomBytes = new Uint8Array(length);
  crypto.getRandomValues(randomBytes);
  
  // Convert to base64
  return btoa(String.fromCharCode.apply(null, Array.from(randomBytes)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

/**
 * Hash a string using SHA-256
 * @param data String to hash
 * @returns Hash as hex string
 */
export async function sha256Hash(data: string): Promise<string> {
  // Convert string to bytes
  const encoder = new TextEncoder();
  const dataBytes = encoder.encode(data);
  
  // Hash data
  const hashBuffer = await crypto.subtle.digest('SHA-256', dataBytes);
  
  // Convert to hex
  return Array.from(new Uint8Array(hashBuffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Generate a random salt for key derivation
 * @returns Salt as Uint8Array
 */
export function generateSalt(): Uint8Array {
  const salt = new Uint8Array(SALT_LENGTH);
  crypto.getRandomValues(salt);
  return salt;
}

/**
 * Generate a random initialization vector
 * @returns IV as Uint8Array
 */
export function generateIV(): Uint8Array {
  const iv = new Uint8Array(IV_LENGTH);
  crypto.getRandomValues(iv);
  return iv;
}

/**
 * Derive an encryption key from a password
 * @param password Password to derive key from
 * @param salt Salt for key derivation
 * @returns Derived key
 */
export async function deriveKey(password: string, salt: Uint8Array): Promise<CryptoKey> {
  // Convert password to bytes
  const encoder = new TextEncoder();
  const passwordBytes = encoder.encode(password);
  
  // Import password as key material
  const baseKey = await crypto.subtle.importKey(
    'raw',
    passwordBytes,
    { name: 'PBKDF2' },
    false,
    ['deriveKey']
  );
  
  // Derive key using PBKDF2
  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt,
      iterations: ITERATION_COUNT,
      hash: 'SHA-256'
    },
    baseKey,
    {
      name: ALGORITHM,
      length: KEY_LENGTH
    },
    false,
    ['encrypt', 'decrypt']
  );
}

/**
 * Simple synchronous encryption using XOR for storage (not for sensitive data)
 * This is a fallback when Web Crypto API async operations aren't suitable
 * @param data Data to encrypt
 * @param password Password for encryption
 * @returns Encrypted data as Base64 string
 */
export function encrypt(data: string, password: string): string {
  try {
    // For secure storage of non-sensitive data, use a simpler approach
    // that works synchronously for better compatibility with storage APIs
    
    // Create a hash of the password to use as the encryption key
    const passwordHash = password.split('').map(char => char.charCodeAt(0))
      .reduce((a, b) => a ^ b, 0).toString(16).repeat(8).slice(0, 32);
    
    // XOR encryption
    const result = [];
    for (let i = 0; i < data.length; i++) {
      const charCode = data.charCodeAt(i);
      const keyChar = passwordHash[i % passwordHash.length].charCodeAt(0);
      result.push(String.fromCharCode(charCode ^ keyChar));
    }
    
    // Return as Base64
    return btoa(result.join(''));
  } catch (error) {
    // Log error but don't expose details
    console.error('Encryption error');
    throw new Error('Encryption failed');
  }
}

/**
 * Simple synchronous decryption using XOR for storage (not for sensitive data)
 * This is a fallback when Web Crypto API async operations aren't suitable
 * @param encrypted Encrypted data as Base64 string
 * @param password Password for decryption
 * @returns Decrypted data
 */
export function decrypt(encrypted: string, password: string): string {
  try {
    // Create a hash of the password to use as the encryption key (same as encrypt)
    const passwordHash = password.split('').map(char => char.charCodeAt(0))
      .reduce((a, b) => a ^ b, 0).toString(16).repeat(8).slice(0, 32);
    
    // Decode Base64
    const encryptedData = atob(encrypted);
    
    // XOR decryption (same operation as encryption)
    const result = [];
    for (let i = 0; i < encryptedData.length; i++) {
      const charCode = encryptedData.charCodeAt(i);
      const keyChar = passwordHash[i % passwordHash.length].charCodeAt(0);
      result.push(String.fromCharCode(charCode ^ keyChar));
    }
    
    return result.join('');
  } catch (error) {
    // Log error but don't expose details
    console.error('Decryption error');
    throw new Error('Decryption failed: Invalid data format');
  }
}

/**
 * Create a deterministic key from a seed
 * @param seed Seed to derive key from
 * @returns Derived key as hex string
 */
export async function createDeterministicKey(seed: string): Promise<string> {
  return sha256Hash(seed);
}

/**
 * Compare a plain text password with a hashed password
 * @param plaintext Plain text password
 * @param hashed Hashed password
 * @returns True if passwords match
 */
export async function comparePasswords(plaintext: string, hashed: string): Promise<boolean> {
  const hashedPlaintext = await sha256Hash(plaintext);
  return hashedPlaintext === hashed;
}

export default {
  generateSecureRandomString,
  sha256Hash,
  generateSalt,
  generateIV,
  deriveKey,
  encrypt,
  decrypt,
  createDeterministicKey,
  comparePasswords
};