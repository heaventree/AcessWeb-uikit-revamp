/**
 * Register Page Component
 * 
 * Provides secure user registration with accessibility support
 * and comprehensive form validation.
 */

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '../contexts/AuthContext';
import { z } from 'zod';
import { validateForm, passwordSchema } from '../utils/validation';

// Registration form schema
const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(50, 'Name must be less than 50 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: passwordSchema,
  confirmPassword: z.string().min(1, 'Please confirm your password')
}).refine(data => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword']
});

type RegisterFormData = z.infer<typeof registerSchema>;

/**
 * Register Page Component
 */
function RegisterPage(): JSX.Element {
  // Get authentication context
  const { register } = useAuth();
  
  // Navigation
  const navigate = useNavigate();
  
  // Form state
  const [formData, setFormData] = useState<RegisterFormData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  
  // Error state
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [generalError, setGeneralError] = useState<string | null>(null);
  
  // Success state
  const [isSuccess, setIsSuccess] = useState(false);
  
  // Loading state
  const [isLoading, setIsLoading] = useState(false);
  
  /**
   * Handle form input change
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
    
    // Clear general error
    if (generalError) {
      setGeneralError(null);
    }
  };
  
  /**
   * Handle form submission
   */
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    
    // Reset errors
    setErrors({});
    setGeneralError(null);
    
    try {
      // Loading state
      setIsLoading(true);
      
      // Validate form data
      try {
        const validatedData = validateForm(formData, registerSchema);
        
        // Attempt registration
        await register({
          email: validatedData.email,
          password: validatedData.password,
          name: validatedData.name
        });
        
        // Set success
        setIsSuccess(true);
      } catch (validationError: any) {
        // Set validation errors
        if (validationError.validationErrors) {
          setErrors(validationError.validationErrors);
        } else {
          setGeneralError(validationError.message || 'Validation failed. Please check your input.');
        }
      }
    } catch (error: any) {
      // Handle registration error
      setGeneralError(error.message || 'Registration failed. Please try again.');
    } finally {
      // Reset loading state
      setIsLoading(false);
    }
  };
  
  // If registration successful, show success message
  if (isSuccess) {
    return (
      <>
        <Helmet>
          <title>WCAG Accessibility Audit - Registration Successful</title>
          <meta name="description" content="Registration successful for WCAG Accessibility Audit" />
        </Helmet>
        
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow">
            <div>
              <h1 className="text-center text-3xl font-extrabold text-gray-900">
                Registration Successful!
              </h1>
              <div className="mt-6 text-center text-green-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="mt-4 text-center text-gray-600">
                Thank you for registering! Please check your email to verify your account.
              </p>
              <div className="mt-6 text-center">
                <button
                  onClick={() => navigate('/login')}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Continue to Login
                </button>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
  
  return (
    <>
      <Helmet>
        <title>WCAG Accessibility Audit - Register</title>
        <meta name="description" content="Create a new WCAG Accessibility Audit account" />
      </Helmet>
      
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h1 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Create a new account
            </h1>
            <p className="mt-2 text-center text-sm text-gray-600">
              Or{' '}
              <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500 focus-ring">
                sign in to your existing account
              </Link>
            </p>
          </div>
          
          <form className="mt-8 space-y-6" onSubmit={handleSubmit} noValidate>
            {/* General error message */}
            {generalError && (
              <div className="rounded-md bg-red-50 p-4" role="alert">
                <div className="flex">
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">
                      {generalError}
                    </h3>
                  </div>
                </div>
              </div>
            )}
            
            <div className="rounded-md shadow-sm -space-y-px">
              {/* Name */}
              <div>
                <label htmlFor="name" className="sr-only">Full name</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className={`appearance-none rounded-none relative block w-full px-3 py-2 border ${
                    errors.name ? 'border-red-300 placeholder-red-300' : 'border-gray-300 placeholder-gray-500'
                  } text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm`}
                  placeholder="Full name"
                  aria-invalid={!!errors.name}
                  aria-describedby={errors.name ? 'name-error' : undefined}
                />
                {errors.name && (
                  <p className="mt-2 text-sm text-red-600" id="name-error">
                    {errors.name}
                  </p>
                )}
              </div>
              
              {/* Email */}
              <div>
                <label htmlFor="email" className="sr-only">Email address</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className={`appearance-none rounded-none relative block w-full px-3 py-2 border ${
                    errors.email ? 'border-red-300 placeholder-red-300' : 'border-gray-300 placeholder-gray-500'
                  } text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm`}
                  placeholder="Email address"
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? 'email-error' : undefined}
                />
                {errors.email && (
                  <p className="mt-2 text-sm text-red-600" id="email-error">
                    {errors.email}
                  </p>
                )}
              </div>
              
              {/* Password */}
              <div>
                <label htmlFor="password" className="sr-only">Password</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className={`appearance-none rounded-none relative block w-full px-3 py-2 border ${
                    errors.password ? 'border-red-300 placeholder-red-300' : 'border-gray-300 placeholder-gray-500'
                  } text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm`}
                  placeholder="Password"
                  aria-invalid={!!errors.password}
                  aria-describedby={errors.password ? 'password-error' : undefined}
                />
                {errors.password && (
                  <p className="mt-2 text-sm text-red-600" id="password-error">
                    {errors.password}
                  </p>
                )}
              </div>
              
              {/* Confirm Password */}
              <div>
                <label htmlFor="confirmPassword" className="sr-only">Confirm password</label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`appearance-none rounded-none relative block w-full px-3 py-2 border ${
                    errors.confirmPassword ? 'border-red-300 placeholder-red-300' : 'border-gray-300 placeholder-gray-500'
                  } text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm`}
                  placeholder="Confirm password"
                  aria-invalid={!!errors.confirmPassword}
                  aria-describedby={errors.confirmPassword ? 'confirm-password-error' : undefined}
                />
                {errors.confirmPassword && (
                  <p className="mt-2 text-sm text-red-600" id="confirm-password-error">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>
            </div>
            
            {/* Password requirements */}
            <div className="text-sm text-gray-600">
              <p>Password must contain:</p>
              <ul className="list-disc pl-5 mt-1">
                <li>At least 10 characters</li>
                <li>At least one uppercase letter</li>
                <li>At least one lowercase letter</li>
                <li>At least one number</li>
                <li>At least one special character</li>
              </ul>
            </div>
            
            {/* Submit button */}
            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400 disabled:cursor-not-allowed"
                aria-busy={isLoading}
              >
                {isLoading ? 'Creating account...' : 'Create account'}
              </button>
            </div>
            
            {/* Terms of service */}
            <div className="text-sm text-gray-600 text-center">
              By creating an account, you agree to our{' '}
              <Link to="/terms" className="font-medium text-blue-600 hover:text-blue-500 focus-ring">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link to="/privacy" className="font-medium text-blue-600 hover:text-blue-500 focus-ring">
                Privacy Policy
              </Link>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default RegisterPage;