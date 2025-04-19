/**
 * Error Fallback Component
 * 
 * Provides an accessible error display with debugging information
 * and a retry mechanism for graceful error recovery.
 */

import { FC, ErrorInfo } from 'react';
import { getUserFriendlyErrorMessage } from '../utils/errorHandler';
import { isDevelopment } from '../utils/environment';

// Props for ErrorFallback component
export interface ErrorFallbackProps {
  /**
   * Error that occurred
   */
  error: Error | null;
  
  /**
   * Error information
   */
  errorInfo: ErrorInfo | null;
  
  /**
   * Function to reset error boundary
   */
  resetErrorBoundary: () => void;
  
  /**
   * Custom error message
   */
  errorMessage?: string;
  
  /**
   * Alternative custom error message
   */
  message?: string;
  
  /**
   * Error stack trace
   */
  errorStack?: string;
  
  /**
   * Whether to show detailed error information
   */
  showDetails?: boolean;
  
  /**
   * Custom error title
   */
  title?: string;
}

/**
 * Error Fallback Component
 * 
 * Displays an error message with retry option and debugging information in development mode
 */
const ErrorFallback: FC<ErrorFallbackProps> = ({
  error,
  errorInfo,
  resetErrorBoundary,
  errorMessage,
  message,
  errorStack,
  showDetails = isDevelopment(),
  title
}) => {
  // Get user-friendly error message
  const friendlyMessage = error
    ? getUserFriendlyErrorMessage(error)
    : 'An unexpected error occurred';
  
  // Use custom message if provided (support both message and errorMessage props)
  const displayMessage = message || errorMessage || friendlyMessage;
  
  // Use custom title if provided
  const displayTitle = title || 'Something went wrong';
  
  // Use error stack if available
  const displayStack = errorStack || (errorInfo ? errorInfo.componentStack : '');
  
  return (
    <div className="error-fallback" role="alert" aria-live="assertive">
      <div className="error-fallback-container">
        <div className="error-fallback-icon">
          <svg viewBox="0 0 24 24" width="40" height="40" fill="currentColor" aria-hidden="true">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
          </svg>
        </div>
        
        <div className="error-fallback-content">
          <h2 className="error-fallback-title">{displayTitle}</h2>
          
          <p className="error-fallback-message">{displayMessage}</p>
          
          <button
            onClick={resetErrorBoundary}
            className="error-fallback-button"
            aria-label="Try again"
          >
            Try Again
          </button>
          
          {showDetails && displayStack && (
            <details className="error-fallback-details">
              <summary className="error-fallback-summary">Technical Details</summary>
              <pre className="error-fallback-stack">{displayStack}</pre>
            </details>
          )}
        </div>
      </div>
      
      <style>
        {`
        .error-fallback {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 400px;
          padding: 20px;
          text-align: center;
        }
        
        .error-fallback-container {
          max-width: 500px;
          padding: 24px;
          border-radius: 8px;
          background-color: #fff;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        
        .error-fallback-icon {
          display: flex;
          justify-content: center;
          color: #e53e3e;
          margin-bottom: 16px;
        }
        
        .error-fallback-title {
          font-size: 20px;
          font-weight: 600;
          margin-bottom: 12px;
          color: #1a202c;
        }
        
        .error-fallback-message {
          margin-bottom: 16px;
          color: #4a5568;
        }
        
        .error-fallback-button {
          padding: 8px 16px;
          background-color: #3182ce;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-weight: 500;
        }
        
        .error-fallback-button:hover {
          background-color: #2b6cb0;
        }
        
        .error-fallback-button:focus {
          outline: 2px solid #3182ce;
          outline-offset: 2px;
        }
        
        .error-fallback-details {
          margin-top: 20px;
          text-align: left;
        }
        
        .error-fallback-summary {
          padding: 8px 0;
          cursor: pointer;
          color: #4a5568;
          font-weight: 500;
        }
        
        .error-fallback-stack {
          margin-top: 8px;
          padding: 16px;
          background: #f7fafc;
          border-radius: 4px;
          overflow-x: auto;
          font-size: 12px;
          color: #718096;
          white-space: pre-wrap;
          word-break: break-word;
        }
        `}
      </style>
    </div>
  );
};

export default ErrorFallback;