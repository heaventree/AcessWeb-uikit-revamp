/**
 * Authentication Context
 * 
 * Provides centralized authentication state management and
 * secure authentication operations throughout the application.
 */

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback, useMemo } from 'react';
import { LoginResponse, RegistrationResponse } from '../services/authApi';
import { UserData, generateToken, generateRefreshToken, verifyToken, verifyRefreshToken, storeAuth, getStoredAuth, clearAuth, isAuthenticated, getCurrentUser, needsTokenRefresh, hasRole } from '../utils/auth';
import { logError, createError, ErrorType } from '../utils/errorHandler';
import { apiPost } from '../services/api';

// Authentication context interface
interface AuthContextType {
  /**
   * Current user data or null if not authenticated
   */
  user: UserData | null;
  
  /**
   * Whether user is authenticated
   */
  isAuthenticated: boolean;
  
  /**
   * Whether authentication is loading
   */
  isLoading: boolean;
  
  /**
   * Login function
   */
  login: (email: string, password: string, rememberMe?: boolean) => Promise<void>;
  
  /**
   * Register function
   */
  register: (userData: { email: string; password: string; name: string }) => Promise<void>;
  
  /**
   * Logout function
   */
  logout: () => Promise<void>;
  
  /**
   * Refresh token function
   */
  refreshToken: () => Promise<boolean>;
  
  /**
   * Check if user has specified role
   */
  hasRole: (role: string) => boolean;
  
  /**
   * Forgot password function
   */
  forgotPassword: (email: string) => Promise<void>;
  
  /**
   * Reset password function
   */
  resetPassword: (token: string, newPassword: string) => Promise<void>;
  
  /**
   * Update profile function
   */
  updateProfile: (profileData: Partial<UserData>) => Promise<void>;
}

// Create context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
  refreshToken: async () => false,
  hasRole: () => false,
  forgotPassword: async () => {},
  resetPassword: async () => {},
  updateProfile: async () => {}
});

// Provider props interface
interface AuthProviderProps {
  /**
   * Children components
   */
  children: ReactNode;
  
  /**
   * Optional initial user data
   */
  initialUser?: UserData | null;
}

/**
 * Authentication Provider Component
 * 
 * Provides authentication state and operations to the component tree
 */
export function AuthProvider({ children, initialUser = null }: AuthProviderProps): JSX.Element {
  // Authentication state
  const [user, setUser] = useState<UserData | null>(initialUser);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  // Init function to get stored auth data
  const initAuth = useCallback(async () => {
    try {
      // Skip if already initialized or no stored auth data
      if (!isLoading) return;
      
      // Check if user is authenticated
      const authData = getStoredAuth();
      
      if (authData) {
        // Verify token
        try {
          await verifyToken(authData.token);
          setUser(authData.user);
          
          // Check if token needs refresh
          if (await needsTokenRefresh(authData.token)) {
            await refreshTokenInternal();
          }
        } catch (error) {
          // Token verification failed, try refresh token
          const refreshSuccess = await refreshTokenInternal();
          
          // Clear auth if refresh failed
          if (!refreshSuccess) {
            clearAuth();
            setUser(null);
          }
        }
      } else {
        setUser(null);
      }
    } catch (error) {
      logError(error, { context: 'AuthContext.initAuth' });
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading]);
  
  // Initialize auth on component mount
  useEffect(() => {
    initAuth();
  }, [initAuth]);
  
  /**
   * Login function
   * @param email User email
   * @param password User password
   * @param rememberMe Whether to remember user
   */
  const login = async (email: string, password: string, rememberMe = false): Promise<void> => {
    try {
      // Send login request
      const response = await apiPost<LoginResponse>('auth/login', { email, password });
      
      // Store auth data
      storeAuth(response.token, response.refreshToken, response.user, rememberMe);
      
      // Update user data
      setUser(response.user);
    } catch (error) {
      logError(error, { context: 'AuthContext.login' });
      throw error;
    }
  };
  
  /**
   * Register function
   * @param userData User registration data
   */
  const register = async (userData: { email: string; password: string; name: string }): Promise<void> => {
    try {
      // Send registration request
      await apiPost<RegistrationResponse>('auth/register', userData);
      
      // Registration successful, but user not logged in yet
    } catch (error) {
      logError(error, { context: 'AuthContext.register' });
      throw error;
    }
  };
  
  /**
   * Logout function
   */
  const logout = async (): Promise<void> => {
    try {
      // Send logout request to invalidate token on server
      await apiPost('auth/logout');
    } catch (error) {
      logError(error, { context: 'AuthContext.logout' });
      // Continue with logout even if server request fails
    } finally {
      // Clear auth data
      clearAuth();
      
      // Clear user data
      setUser(null);
    }
  };
  
  /**
   * Internal refresh token function
   * @returns Whether refresh was successful
   */
  const refreshTokenInternal = async (): Promise<boolean> => {
    try {
      // Get stored auth data
      const authData = getStoredAuth();
      
      if (!authData) {
        return false;
      }
      
      // Verify refresh token
      const userId = await verifyRefreshToken(authData.refreshToken);
      
      // Send refresh token request
      const response = await apiPost<{
        token: string;
        refreshToken: string;
        expiresIn: number;
      }>('auth/refresh', { refreshToken: authData.refreshToken });
      
      // Store auth data
      storeAuth(response.token, response.refreshToken, authData.user, true);
      
      // Update user data
      setUser(authData.user);
      
      return true;
    } catch (error) {
      logError(error, { context: 'AuthContext.refreshTokenInternal' });
      return false;
    }
  };
  
  /**
   * Public refresh token function
   * @returns Whether refresh was successful
   */
  const refreshToken = async (): Promise<boolean> => {
    return refreshTokenInternal();
  };
  
  /**
   * Check if user has role
   * @param role Role to check
   * @returns Whether user has role
   */
  const checkRole = (role: string): boolean => {
    return hasRole(role, user);
  };
  
  /**
   * Forgot password function
   * @param email User email
   */
  const forgotPassword = async (email: string): Promise<void> => {
    try {
      // Send forgot password request
      await apiPost<{ success: boolean; message: string }>('auth/forgot-password', { email });
    } catch (error) {
      logError(error, { context: 'AuthContext.forgotPassword' });
      throw error;
    }
  };
  
  /**
   * Reset password function
   * @param token Reset token
   * @param newPassword New password
   */
  const resetPassword = async (token: string, newPassword: string): Promise<void> => {
    try {
      // Send reset password request
      await apiPost<{ success: boolean; message: string }>('auth/reset-password', {
        token,
        newPassword
      });
    } catch (error) {
      logError(error, { context: 'AuthContext.resetPassword' });
      throw error;
    }
  };
  
  /**
   * Update profile function
   * @param profileData Profile data to update
   */
  const updateProfile = async (profileData: Partial<UserData>): Promise<void> => {
    try {
      // Send update profile request
      const updatedUser = await apiPost<UserData>('auth/profile', profileData);
      
      // Update user data
      if (user) {
        const newUser = { ...user, ...updatedUser };
        setUser(newUser);
        
        // Update stored user data
        const authData = getStoredAuth();
        
        if (authData) {
          storeAuth(authData.token, authData.refreshToken, newUser, true);
        }
      }
    } catch (error) {
      logError(error, { context: 'AuthContext.updateProfile' });
      throw error;
    }
  };
  
  // Memoize context value to prevent unnecessary re-renders
  const contextValue = useMemo(
    () => ({
      user,
      isAuthenticated: !!user,
      isLoading,
      login,
      register,
      logout,
      refreshToken,
      hasRole: checkRole,
      forgotPassword,
      resetPassword,
      updateProfile
    }),
    [user, isLoading]
  );
  
  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Hook to use authentication context
 * @returns Authentication context
 */
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw createError(
      ErrorType.INTERNAL,
      'auth_context_missing',
      'useAuth must be used within an AuthProvider',
      undefined,
      'The authentication system is not properly configured. Please contact support.'
    );
  }
  
  return context;
}

export default AuthContext;