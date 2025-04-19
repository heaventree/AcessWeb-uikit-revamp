/**
 * Error Boundary Component
 * 
 * Handles and displays errors gracefully, with accessibility features
 * and detailed logging for debugging.
 */

import { Component, ReactNode, ErrorInfo } from 'react';
import { logError, ErrorSeverity, formatErrorMessage } from '../utils/errorHandler';
import ErrorFallback from './ErrorFallback';
import { isDevelopment } from '../utils/environment';

// Standard error types for consistent handling
export type ErrorType = 'network' | 'auth' | 'validation' | 'unknown';

// Props for ErrorBoundary component
export interface ErrorBoundaryProps {
  /**
   * Child components to render
   */
  children: ReactNode;

  /**
   * Custom fallback component to render when an error occurs
   */
  fallback?: ReactNode;

  /**
   * Function to call when an error occurs
   */
  onError?: (error: Error, errorInfo: ErrorInfo) => void;

  /**
   * Optional label to identify this boundary in logs
   */
  label?: string;

  /**
   * Whether to reset the error state when changing routes
   */
  resetOnRouteChange?: boolean;

  /**
   * Whether to show detailed error information (dev mode)
   */
  showDetails?: boolean;
}

// State for ErrorBoundary component
export interface ErrorBoundaryState {
  /**
   * Whether an error has occurred
   */
  hasError: boolean;

  /**
   * Error that occurred
   */
  error: Error | null;

  /**
   * Error information
   */
  errorInfo: ErrorInfo | null;
}

/**
 * Error Boundary Component
 * 
 * Catches JavaScript errors in its child component tree,
 * logs those errors, and displays a fallback UI.
 */
class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  /**
   * Derive state from error
   * @param error Error that occurred
   * @returns State updates
   */
  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    // Update state to indicate an error occurred
    return {
      hasError: true,
      error
    };
  }

  /**
   * Component did catch an error
   * @param error Error that occurred
   * @param errorInfo Error information
   */
  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Set error info in state
    this.setState({
      errorInfo
    });

    // Log error
    logError(error, {
      context: `ErrorBoundary${this.props.label ? ` (${this.props.label})` : ''}`,
      data: {
        componentStack: errorInfo.componentStack
      },
      severity: ErrorSeverity.ERROR
    });

    // Call onError prop if provided
    if (this.props.onError) {
      try {
        this.props.onError(error, errorInfo);
      } catch (callbackError) {
        logError(callbackError, {
          context: 'ErrorBoundary.onError callback',
          severity: ErrorSeverity.WARNING
        });
      }
    }
  }

  /**
   * Reset error state
   */
  resetErrorState = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  };

  /**
   * Render component
   * @returns Rendered component
   */
  render(): ReactNode {
    // If we have an error, show the fallback UI
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Get error message and stack
      const errorMessage = this.state.error 
        ? formatErrorMessage(this.state.error) 
        : 'An unexpected error occurred';

      const errorStack = this.state.errorInfo
        ? this.state.errorInfo.componentStack
        : undefined;

      // Determine whether to show detailed error information
      const showDetails = this.props.showDetails !== undefined
        ? this.props.showDetails
        : isDevelopment();

      // Render default error fallback
      return (
        <ErrorFallback
          error={this.state.error}
          errorInfo={this.state.errorInfo}
          resetErrorBoundary={this.resetErrorState}
          errorMessage={errorMessage}
          errorStack={errorStack}
          showDetails={showDetails}
        />
      );
    }

    // Otherwise, render children normally
    return this.props.children;
  }
}

// Named export for direct import
export { ErrorBoundary };

// Default export
export default ErrorBoundary;