/**
 * Unauthorized Page Component
 * 
 * Displayed when a user attempts to access a page they don't have permission for,
 * with accessibility features and helpful navigation options.
 */

import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

/**
 * Unauthorized Page Component
 */
function UnauthorizedPage(): JSX.Element {
  // Get auth context and navigation
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Handle go back button
  const handleGoBack = (): void => {
    navigate(-1);
  };
  
  return (
    <>
      <Helmet>
        <title>WCAG Accessibility Audit - Unauthorized Access</title>
        <meta name="description" content="You don't have permission to access this page" />
      </Helmet>
      
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="flex justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          
          <h1 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Access Denied
          </h1>
          <p className="mt-2 text-center text-sm text-gray-600">
            You don't have permission to access this page.
          </p>
        </div>
        
        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <div className="space-y-4">
              <p className="text-sm text-gray-700">
                This area requires additional permissions. Here are some options:
              </p>
              
              <div className="space-y-3">
                {user ? (
                  // Options for authenticated users
                  <>
                    <Link
                      to="/dashboard"
                      className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Go to Dashboard
                    </Link>
                    
                    <button
                      onClick={handleGoBack}
                      className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Go Back
                    </button>
                  </>
                ) : (
                  // Options for unauthenticated users
                  <>
                    <Link
                      to="/login"
                      className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Sign In
                    </Link>
                    
                    <Link
                      to="/"
                      className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Return to Home
                    </Link>
                  </>
                )}
              </div>
              
              <div className="pt-4 text-center border-t border-gray-200">
                <p className="text-sm text-gray-600">
                  Need more access? <Link to="/contact" className="font-medium text-blue-600 hover:text-blue-500">Contact an administrator</Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default UnauthorizedPage;