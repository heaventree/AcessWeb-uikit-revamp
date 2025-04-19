/**
 * Profile Page Component
 * 
 * User profile management with accessibility features
 * and security integration.
 */

import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '../contexts/AuthContext';
import { z } from 'zod';
import { validateForm, passwordSchema } from '../utils/validation';

// Profile update schema
const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(50, 'Name must be less than 50 characters'),
  email: z.string().email('Please enter a valid email address')
});

// Password update schema
const passwordUpdateSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: passwordSchema,
  confirmPassword: z.string().min(1, 'Please confirm your password')
}).refine(data => data.newPassword === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword']
});

type ProfileFormData = z.infer<typeof profileSchema>;
type PasswordFormData = z.infer<typeof passwordUpdateSchema>;

/**
 * Profile Page Component
 */
function ProfilePage(): JSX.Element {
  // Get auth context
  const { user, updateProfile, logout } = useAuth();
  
  // Profile form state
  const [profileData, setProfileData] = useState<ProfileFormData>({
    name: user?.name || '',
    email: user?.email || ''
  });
  
  // Password form state
  const [passwordData, setPasswordData] = useState<PasswordFormData>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  // Form errors
  const [profileErrors, setProfileErrors] = useState<Record<string, string>>({});
  const [passwordErrors, setPasswordErrors] = useState<Record<string, string>>({});
  
  // General error and success messages
  const [profileMessage, setProfileMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [passwordMessage, setPasswordMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  
  // Loading states
  const [isProfileUpdating, setIsProfileUpdating] = useState(false);
  const [isPasswordUpdating, setIsPasswordUpdating] = useState(false);
  
  /**
   * Handle profile form change
   */
  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field
    if (profileErrors[name]) {
      setProfileErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
    
    // Clear general message
    if (profileMessage) {
      setProfileMessage(null);
    }
  };
  
  /**
   * Handle password form change
   */
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field
    if (passwordErrors[name]) {
      setPasswordErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
    
    // Clear general message
    if (passwordMessage) {
      setPasswordMessage(null);
    }
  };
  
  /**
   * Handle profile update
   */
  const handleProfileUpdate = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    
    // Reset errors and messages
    setProfileErrors({});
    setProfileMessage(null);
    
    try {
      // Loading state
      setIsProfileUpdating(true);
      
      // Validate form data
      try {
        const validatedData = validateForm(profileData, profileSchema);
        
        // Update profile
        await updateProfile(validatedData);
        
        // Set success message
        setProfileMessage({
          type: 'success',
          text: 'Profile updated successfully!'
        });
      } catch (validationError: any) {
        // Set validation errors
        if (validationError.validationErrors) {
          setProfileErrors(validationError.validationErrors);
        } else {
          setProfileMessage({
            type: 'error',
            text: validationError.message || 'Validation failed. Please check your input.'
          });
        }
      }
    } catch (error: any) {
      // Handle update error
      setProfileMessage({
        type: 'error',
        text: error.message || 'Failed to update profile. Please try again.'
      });
    } finally {
      // Reset loading state
      setIsProfileUpdating(false);
    }
  };
  
  /**
   * Handle password update
   */
  const handlePasswordUpdate = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    
    // Reset errors and messages
    setPasswordErrors({});
    setPasswordMessage(null);
    
    try {
      // Loading state
      setIsPasswordUpdating(true);
      
      // Validate form data
      try {
        const validatedData = validateForm(passwordData, passwordUpdateSchema);
        
        // Update password (mock implementation)
        // In a real app, we would call an API endpoint to update the password
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Clear password form
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
        
        // Set success message
        setPasswordMessage({
          type: 'success',
          text: 'Password updated successfully!'
        });
      } catch (validationError: any) {
        // Set validation errors
        if (validationError.validationErrors) {
          setPasswordErrors(validationError.validationErrors);
        } else {
          setPasswordMessage({
            type: 'error',
            text: validationError.message || 'Validation failed. Please check your input.'
          });
        }
      }
    } catch (error: any) {
      // Handle update error
      setPasswordMessage({
        type: 'error',
        text: error.message || 'Failed to update password. Please try again.'
      });
    } finally {
      // Reset loading state
      setIsPasswordUpdating(false);
    }
  };
  
  /**
   * Handle logout
   */
  const handleLogout = async (): Promise<void> => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };
  
  return (
    <>
      <Helmet>
        <title>WCAG Accessibility Audit - Profile</title>
        <meta name="description" content="Manage your WCAG Accessibility Audit profile" />
      </Helmet>
      
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
            <h1 className="text-2xl font-bold text-gray-900">Your Profile</h1>
          </div>
        </header>
        
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">
                  Profile Information
                </h2>
                
                {/* Profile update form */}
                <form onSubmit={handleProfileUpdate} noValidate>
                  {/* General message */}
                  {profileMessage && (
                    <div className={`rounded-md ${profileMessage.type === 'success' ? 'bg-green-50' : 'bg-red-50'} p-4 mb-4`} role="alert">
                      <div className="flex">
                        <div className="ml-3">
                          <p className={`text-sm font-medium ${profileMessage.type === 'success' ? 'text-green-800' : 'text-red-800'}`}>
                            {profileMessage.text}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-1 gap-6">
                    {/* Name */}
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                        Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        id="name"
                        value={profileData.name}
                        onChange={handleProfileChange}
                        className={`mt-1 block w-full ${
                          profileErrors.name ? 'border-red-300' : 'border-gray-300'
                        } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                        aria-invalid={!!profileErrors.name}
                        aria-describedby={profileErrors.name ? 'name-error' : undefined}
                      />
                      {profileErrors.name && (
                        <p className="mt-2 text-sm text-red-600" id="name-error">
                          {profileErrors.name}
                        </p>
                      )}
                    </div>
                    
                    {/* Email */}
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        id="email"
                        value={profileData.email}
                        onChange={handleProfileChange}
                        className={`mt-1 block w-full ${
                          profileErrors.email ? 'border-red-300' : 'border-gray-300'
                        } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                        aria-invalid={!!profileErrors.email}
                        aria-describedby={profileErrors.email ? 'email-error' : undefined}
                      />
                      {profileErrors.email && (
                        <p className="mt-2 text-sm text-red-600" id="email-error">
                          {profileErrors.email}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <button
                      type="submit"
                      disabled={isProfileUpdating}
                      className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400 disabled:cursor-not-allowed"
                      aria-busy={isProfileUpdating}
                    >
                      {isProfileUpdating ? 'Updating...' : 'Update Profile'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
          
          <div className="px-4 py-6 sm:px-0">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">
                  Change Password
                </h2>
                
                {/* Password update form */}
                <form onSubmit={handlePasswordUpdate} noValidate>
                  {/* General message */}
                  {passwordMessage && (
                    <div className={`rounded-md ${passwordMessage.type === 'success' ? 'bg-green-50' : 'bg-red-50'} p-4 mb-4`} role="alert">
                      <div className="flex">
                        <div className="ml-3">
                          <p className={`text-sm font-medium ${passwordMessage.type === 'success' ? 'text-green-800' : 'text-red-800'}`}>
                            {passwordMessage.text}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-1 gap-6">
                    {/* Current password */}
                    <div>
                      <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">
                        Current Password
                      </label>
                      <input
                        type="password"
                        name="currentPassword"
                        id="currentPassword"
                        value={passwordData.currentPassword}
                        onChange={handlePasswordChange}
                        className={`mt-1 block w-full ${
                          passwordErrors.currentPassword ? 'border-red-300' : 'border-gray-300'
                        } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                        aria-invalid={!!passwordErrors.currentPassword}
                        aria-describedby={passwordErrors.currentPassword ? 'current-password-error' : undefined}
                      />
                      {passwordErrors.currentPassword && (
                        <p className="mt-2 text-sm text-red-600" id="current-password-error">
                          {passwordErrors.currentPassword}
                        </p>
                      )}
                    </div>
                    
                    {/* New password */}
                    <div>
                      <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                        New Password
                      </label>
                      <input
                        type="password"
                        name="newPassword"
                        id="newPassword"
                        value={passwordData.newPassword}
                        onChange={handlePasswordChange}
                        className={`mt-1 block w-full ${
                          passwordErrors.newPassword ? 'border-red-300' : 'border-gray-300'
                        } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                        aria-invalid={!!passwordErrors.newPassword}
                        aria-describedby={passwordErrors.newPassword ? 'new-password-error' : undefined}
                      />
                      {passwordErrors.newPassword && (
                        <p className="mt-2 text-sm text-red-600" id="new-password-error">
                          {passwordErrors.newPassword}
                        </p>
                      )}
                    </div>
                    
                    {/* Confirm password */}
                    <div>
                      <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        name="confirmPassword"
                        id="confirmPassword"
                        value={passwordData.confirmPassword}
                        onChange={handlePasswordChange}
                        className={`mt-1 block w-full ${
                          passwordErrors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                        } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                        aria-invalid={!!passwordErrors.confirmPassword}
                        aria-describedby={passwordErrors.confirmPassword ? 'confirm-password-error' : undefined}
                      />
                      {passwordErrors.confirmPassword && (
                        <p className="mt-2 text-sm text-red-600" id="confirm-password-error">
                          {passwordErrors.confirmPassword}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <button
                      type="submit"
                      disabled={isPasswordUpdating}
                      className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400 disabled:cursor-not-allowed"
                      aria-busy={isPasswordUpdating}
                    >
                      {isPasswordUpdating ? 'Updating...' : 'Change Password'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
          
          <div className="px-4 py-6 sm:px-0">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">
                  Account Actions
                </h2>
                
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      Log Out
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}

export default ProfilePage;