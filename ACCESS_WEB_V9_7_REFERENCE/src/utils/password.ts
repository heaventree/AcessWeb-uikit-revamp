/**
 * Password utility functions for secure password handling
 */
import bcrypt from 'bcryptjs';

// Cost factor for bcrypt (higher is more secure but slower)
const SALT_ROUNDS = 10;

/**
 * Hash a password using bcrypt
 * @param password The plain text password to hash
 * @returns A promise that resolves to the hashed password
 */
export const hashPassword = async (password: string): Promise<string> => {
  try {
    // Generate a salt and hash the password
    return await bcrypt.hash(password, SALT_ROUNDS);
  } catch (error) {
    console.error('Error hashing password:', error);
    throw new Error('Failed to hash password');
  }
};

/**
 * Verify a password against a hash
 * @param password The plain text password to verify
 * @param hashedPassword The hashed password to compare against
 * @returns A promise that resolves to true if the password matches, false otherwise
 */
export const verifyPassword = async (
  password: string, 
  hashedPassword: string
): Promise<boolean> => {
  try {
    // Compare the password with the hash
    return await bcrypt.compare(password, hashedPassword);
  } catch (error) {
    console.error('Error verifying password:', error);
    return false;
  }
};

/**
 * Check if a password meets the complexity requirements
 * @param password The password to check
 * @returns An object with validation result and any error messages
 */
export const validatePasswordComplexity = (
  password: string
): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  // Minimum length check
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  
  // Contains uppercase letter
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  // Contains lowercase letter
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  // Contains number
  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  // Contains special character
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
};

/**
 * Generate a secure random password
 * @param length The length of the password (default: 12)
 * @returns A randomly generated password that meets complexity requirements
 */
export const generateSecurePassword = (length: number = 12): string => {
  const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
  const numberChars = '0123456789';
  const specialChars = '!@#$%^&*()_+-=[]{}|;:,.<>?';
  
  const allChars = uppercaseChars + lowercaseChars + numberChars + specialChars;
  
  // Ensure at least one of each character type
  let password = 
    uppercaseChars.charAt(Math.floor(Math.random() * uppercaseChars.length)) +
    lowercaseChars.charAt(Math.floor(Math.random() * lowercaseChars.length)) +
    numberChars.charAt(Math.floor(Math.random() * numberChars.length)) +
    specialChars.charAt(Math.floor(Math.random() * specialChars.length));
  
  // Fill the rest with random characters
  for (let i = 4; i < length; i++) {
    password += allChars.charAt(Math.floor(Math.random() * allChars.length));
  }
  
  // Shuffle the password characters
  return password
    .split('')
    .sort(() => 0.5 - Math.random())
    .join('');
};