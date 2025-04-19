import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { FiUser, FiLock, FiMail, FiLogIn, FiUserPlus } from 'react-icons/fi';
import { useAuth } from '../hooks/useAuth';
import { PasswordStrengthMeter } from '../components/PasswordStrengthMeter';

type AuthMode = 'login' | 'register';

export function AuthPage() {
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [verificationSent, setVerificationSent] = useState(false);
  const [verificationEmail, setVerificationEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, register, isAuthenticated, isDevelopmentMode } = useAuth();
  const navigate = useNavigate();
  // Get the redirect value from the URL search parameters
  const searchParams = new URLSearchParams(window.location.search);
  const redirect = searchParams.get('redirect') || undefined;
  
  // Auto-redirect if already authenticated or in development mode
  useEffect(() => {
    if (isAuthenticated) {
      const redirectPath = redirect ? decodeURIComponent(redirect) : '/dashboard';
      navigate(redirectPath, { replace: true });
    } else if (isDevelopmentMode) {
      // In development mode, automatically log in
      console.info('🔓 Development mode: Auto-logging in user');
      const redirectPath = redirect ? decodeURIComponent(redirect) : '/dashboard';
      navigate(redirectPath, { replace: true });
    }
  }, [isAuthenticated, isDevelopmentMode, navigate, redirect]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      if (mode === 'login') {
        // Handle login
        const result = await login(email, password);
        if (result.success) {
          toast.success('Login successful!');
          // Redirect user to the previous page or dashboard
          const redirectPath = redirect ? decodeURIComponent(redirect) : '/dashboard';
          navigate(redirectPath);
        } else {
          toast.error(result.error?.message || 'Login failed');
        }
      } else {
        // Handle registration
        const result = await register({ email, password, name });
        if (result.success) {
          setVerificationSent(true);
          setVerificationEmail(email);
          
          // Store token in session storage for verification page
          if (result.verificationToken) {
            sessionStorage.setItem('verification_token', result.verificationToken);
          }
          
          toast.success('Registration successful! Please verify your email.');
        } else {
          toast.error(result.error?.message || 'Registration failed');
        }
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleMode = () => {
    setMode(prevMode => prevMode === 'login' ? 'register' : 'login');
    // Reset form fields when switching modes
    setPassword('');
  };

  if (verificationSent) {
    return (
      <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-md w-full space-y-8 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-green-50 p-6 rounded-lg border border-green-200">
              <h1 className="text-2xl font-bold mb-4 text-green-700">Verification Email Sent</h1>
              <p className="mb-4 text-gray-600">
                We've sent a verification email to <strong>{email}</strong>. 
                Please check your inbox and click the verification link to complete your registration.
              </p>
              <p className="text-sm text-gray-500 mb-4">
                If you don't see the email, please check your spam folder or try resending the verification email.
              </p>
              <Link
                to="/login"
                className="inline-block bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition duration-150"
              >
                Return to Login
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-md w-full space-y-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {mode === 'login' ? 'Sign in to your account' : 'Create a new account'}
          </h1>
          <p className="mt-2 text-center text-sm text-gray-600">
            {mode === 'login' ? (
              <>
                Or{' '}
                <button
                  onClick={toggleMode}
                  className="font-medium text-primary-600 hover:text-primary-500 focus:outline-none focus:underline transition duration-150 ease-in-out"
                >
                  create a new account
                </button>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <button
                  onClick={toggleMode}
                  className="font-medium text-primary-600 hover:text-primary-500 focus:outline-none focus:underline transition duration-150 ease-in-out"
                >
                  Sign in
                </button>
              </>
            )}
          </p>
        </motion.div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            {mode === 'register' && (
              <div>
                <label htmlFor="name" className="sr-only">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiUser className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    required={mode === 'register'}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="appearance-none rounded-lg relative block w-full pl-10 px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
                    placeholder="Full Name"
                  />
                </div>
              </div>
            )}

            <div>
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiMail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none rounded-lg relative block w-full pl-10 px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
                  placeholder="Email address"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiLock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none rounded-lg relative block w-full pl-10 px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
                  placeholder="Password"
                />
              </div>
            </div>
          </div>

          {mode === 'register' && <PasswordStrengthMeter password={password} />}

          {mode === 'login' && (
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <Link to="/forgot-password" className="font-medium text-primary-600 hover:text-primary-500">
                  Forgot your password?
                </Link>
              </div>
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="group relative w-full flex justify-center py-2 px-4 border-none text-sm font-medium rounded-lg text-white bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
              ) : (
                <span className="flex items-center">
                  {mode === 'login' ? (
                    <>
                      <FiLogIn className="mr-2" /> Sign in
                    </>
                  ) : (
                    <>
                      <FiUserPlus className="mr-2" /> Sign up
                    </>
                  )}
                </span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}