import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

/**
 * Email verification component that handles the verification process
 * when a user clicks on the verification link sent to their email.
 */
export const EmailVerification = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const { verifyEmail } = useAuth();
  const [verifying, setVerifying] = useState(true);
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const verify = async () => {
      if (token) {
        try {
          const success = await verifyEmail(token);
          setVerified(success);
          setVerifying(false);
          
          if (success) {
            // Redirect after a short delay to show the success message
            setTimeout(() => {
              navigate('/login?verified=true');
            }, 3000);
          }
        } catch (error) {
          setError('An error occurred during verification. Please try again.');
          setVerifying(false);
        }
      } else {
        setError('Invalid verification token.');
        setVerifying(false);
      }
    };

    verify();
  }, [token, verifyEmail, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Email Verification
          </h2>
        </div>
        
        <div className="mt-8 space-y-6">
          {verifying && (
            <div className="text-center">
              <p className="text-sm text-gray-600">
                Verifying your email address...
              </p>
              <div className="mt-4 flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
              </div>
            </div>
          )}
          
          {!verifying && verified && (
            <div className="rounded-md bg-green-50 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-green-800">
                    Your email has been successfully verified! Redirecting you to login...
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {!verifying && !verified && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-red-800">
                    {error || 'Email verification failed. Please try again or contact support.'}
                  </p>
                </div>
              </div>
            </div>
          )}
          
          <div className="text-center mt-4">
            <a
              href="/login"
              className="font-medium text-primary-600 hover:text-primary-500"
            >
              Return to login
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};