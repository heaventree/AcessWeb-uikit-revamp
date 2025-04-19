/**
 * Authentication API Service
 * 
 * Provides centralized, secure authentication API endpoints with
 * specialized handling for auth-related operations.
 */

import { apiClient } from '../utils/apiClient';
import { AccountLockoutManager } from '../utils/passwordPolicy';
import { ErrorType, createError } from '../utils/errorHandler';

// Auth API endpoints
const AUTH_ENDPOINTS = {
  LOGIN: 'auth/login',
  REGISTER: 'auth/register',
  LOGOUT: 'auth/logout',
  REFRESH_TOKEN: 'auth/refresh',
  VERIFY_EMAIL: 'auth/verify',
  FORGOT_PASSWORD: 'auth/forgot-password',
  RESET_PASSWORD: 'auth/reset-password',
  CHANGE_PASSWORD: 'auth/change-password',
  GET_PROFILE: 'auth/profile',
  UPDATE_PROFILE: 'auth/profile'
};

// Login response interface
export interface LoginResponse {
  token: string;
  refreshToken: string;
  expiresIn: number;
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
}

// Registration response interface
export interface RegistrationResponse {
  success: boolean;
  message: string;
  user?: {
    id: string;
    email: string;
  };
}

/**
 * Login user with email and password
 * @param email User email
 * @param password User password
 * @returns Login response
 */
export async function login(email: string, password: string): Promise<LoginResponse> {
  try {
    // Check if account is locked
    if (AccountLockoutManager.isAccountLocked(email)) {
      const timeRemaining = AccountLockoutManager.getLockoutTimeRemaining(email);
      throw createError(
        ErrorType.AUTHENTICATION,
        'account_locked',
        `Account is temporarily locked. Please try again in ${Math.ceil(timeRemaining / 60)} minutes`,
        { timeRemaining }
      );
    }
    
    // Make login request
    const response = await apiClient.post<LoginResponse>(AUTH_ENDPOINTS.LOGIN, {
      email,
      password
    });
    
    // Reset any failed attempts
    AccountLockoutManager.resetLockout(email);
    
    return response;
  } catch (error) {
    // Record failed attempt
    if (
      error instanceof Error &&
      (error as any).type === ErrorType.AUTHENTICATION
    ) {
      AccountLockoutManager.recordFailedAttempt(email);
    }
    
    throw error;
  }
}

/**
 * Register a new user
 * @param userData User registration data
 * @returns Registration response
 */
export async function register(userData: {
  email: string;
  password: string;
  name: string;
}): Promise<RegistrationResponse> {
  return apiClient.post<RegistrationResponse>(AUTH_ENDPOINTS.REGISTER, userData);
}

/**
 * Logout the current user
 * @returns Success status
 */
export async function logout(): Promise<boolean> {
  try {
    await apiClient.post(AUTH_ENDPOINTS.LOGOUT);
    return true;
  } catch (error) {
    console.error('Error during logout:', error);
    return false;
  }
}

/**
 * Refresh the authentication token
 * @param refreshToken Current refresh token
 * @returns New tokens
 */
export async function refreshToken(refreshToken: string): Promise<{
  token: string;
  refreshToken: string;
  expiresIn: number;
}> {
  return apiClient.post(AUTH_ENDPOINTS.REFRESH_TOKEN, { refreshToken });
}

/**
 * Verify email address
 * @param token Verification token
 * @returns Success status
 */
export async function verifyEmail(token: string): Promise<{
  success: boolean;
  message: string;
}> {
  return apiClient.post(AUTH_ENDPOINTS.VERIFY_EMAIL, { token });
}

/**
 * Request password reset
 * @param email User email
 * @returns Success status
 */
export async function forgotPassword(email: string): Promise<{
  success: boolean;
  message: string;
}> {
  return apiClient.post(AUTH_ENDPOINTS.FORGOT_PASSWORD, { email });
}

/**
 * Reset password with token
 * @param token Reset token
 * @param newPassword New password
 * @returns Success status
 */
export async function resetPassword(
  token: string,
  newPassword: string
): Promise<{
  success: boolean;
  message: string;
}> {
  return apiClient.post(AUTH_ENDPOINTS.RESET_PASSWORD, {
    token,
    newPassword
  });
}

/**
 * Change password (authenticated)
 * @param currentPassword Current password
 * @param newPassword New password
 * @returns Success status
 */
export async function changePassword(
  currentPassword: string,
  newPassword: string
): Promise<{
  success: boolean;
  message: string;
}> {
  return apiClient.post(AUTH_ENDPOINTS.CHANGE_PASSWORD, {
    currentPassword,
    newPassword
  });
}

/**
 * Get current user's profile
 * @returns User profile
 */
export async function getProfile(): Promise<any> {
  return apiClient.get(AUTH_ENDPOINTS.GET_PROFILE);
}

/**
 * Update user profile
 * @param profileData Profile data
 * @returns Updated profile
 */
export async function updateProfile(profileData: Record<string, any>): Promise<any> {
  return apiClient.put(AUTH_ENDPOINTS.UPDATE_PROFILE, profileData);
}

export default {
  login,
  register,
  logout,
  refreshToken,
  verifyEmail,
  forgotPassword,
  resetPassword,
  changePassword,
  getProfile,
  updateProfile
};