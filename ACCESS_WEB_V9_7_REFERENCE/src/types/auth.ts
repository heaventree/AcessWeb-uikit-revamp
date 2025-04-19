/**
 * User role type 
 */
export type UserRole = 'admin' | 'user' | 'guest' | 'developer';

/**
 * User interface representing a user in the system
 */
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  organization?: string;
  createdAt?: string;
  updatedAt?: string;
  avatar?: string;
  settings?: UserSettings;
}

/**
 * User settings interface for user preferences
 */
export interface UserSettings {
  darkMode?: boolean;
  notifications?: NotificationSettings;
  accessibility?: AccessibilitySettings;
  dashboardLayout?: string;
}

/**
 * Notification settings for user
 */
export interface NotificationSettings {
  email: boolean;
  browser: boolean;
  reportFrequency?: 'daily' | 'weekly' | 'monthly' | 'never';
  newIssues: boolean;
  regressions: boolean;
  scanCompletion: boolean;
}

/**
 * Accessibility settings for user preferences
 */
export interface AccessibilitySettings {
  highContrast?: boolean;
  largeText?: boolean;
  reducedMotion?: boolean;
}

/**
 * Authentication error interface
 */
export interface AuthError {
  code: string;
  message: string;
}

/**
 * Login response from the server
 */
export interface LoginResponse {
  success: boolean;
  token?: string | Promise<string>;
  user?: User;
  error?: AuthError;
}

/**
 * Registration data sent to the server
 */
export interface RegistrationData {
  email: string;
  password: string;
  name: string;
  organization?: string;
}

/**
 * Registration response from the server
 */
export interface RegistrationResponse {
  success: boolean;
  token?: string | Promise<string>;
  user?: User;
  error?: AuthError;
}

/**
 * Password reset request
 */
export interface PasswordResetRequest {
  email: string;
}

/**
 * Password update request
 */
export interface PasswordUpdateRequest {
  currentPassword: string;
  newPassword: string;
}