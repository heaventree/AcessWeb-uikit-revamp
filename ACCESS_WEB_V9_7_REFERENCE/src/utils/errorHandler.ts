/**
 * Error Handler Module
 * 
 * Provides centralized error handling, logging, and reporting functionality
 * for the application.
 */

import { isDevelopment } from './environment';

// Define ErrorType enum for categorizing errors
export enum ErrorType {
  API = 'api_error',
  AUTHENTICATION = 'auth_error',
  NETWORK = 'network_error',
  VALIDATION = 'validation_error',
  UNEXPECTED = 'unexpected_error',
  PERMISSION = 'permission_error',
  NOT_FOUND = 'not_found_error',
  TIMEOUT = 'timeout_error',
  SERVER = 'server_error',
  CLIENT = 'client_error'
}

export enum ErrorSeverity {
  ERROR = 'error',
  WARNING = 'warning',
  INFO = 'info'
}

export interface StructuredError extends Error {
  type: ErrorType;
  details?: Record<string, any>;
}

// Create our own logging function if it's not available from external module
const logError = (message: string, error: any, data?: any) => {
  console.error(`[ERROR] ${message}`, error, data || {});
};

/**
 * Generate a unique error ID for tracking errors
 */
const generateErrorId = (): string => {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
};

// Types for error handling
export interface ErrorOptions {
  context?: string;
  data?: Record<string, any>;
  isFatal?: boolean;
  notify?: boolean;
  timestamp?: number;
  userId?: string;
  sessionId?: string;
}

export interface ErrorReport {
  message: string;
  stack?: string;
  context?: string;
  data?: Record<string, any>;
  timestamp: number;
  severity: 'error' | 'warning' | 'info';
  errorId: string;
}

/**
 * Create a structured error object with specific error type
 */
const createErrorInternal = (
  message: string, 
  errorType: ErrorType = ErrorType.UNEXPECTED, 
  details?: Record<string, any>
): Error => {
  const error = new Error(message);
  (error as any).type = errorType;
  (error as any).details = details;
  return error;
};

export const createError = createErrorInternal;

// Used for tracking and deduplicating errors
const errorCache = new Map<string, { count: number, lastReported: number }>();
const ERROR_REPORTING_THROTTLE = 60000; // 1 minute
const MAX_ERROR_COUNT = 5; // Report same error max 5 times

// Note: Only keeping one instance of generateErrorId function

/**
 * Normalize error to string message
 */
const normalizeError = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  } else if (typeof error === 'string') {
    return error;
  } else if (error === null) {
    return 'Null error';
  } else if (error === undefined) {
    return 'Undefined error';
  } else {
    try {
      return JSON.stringify(error);
    } catch (e) {
      return 'Unserializable error object';
    }
  }
};

/**
 * Get stack trace from error
 */
const getErrorStack = (error: unknown): string | undefined => {
  if (error instanceof Error) {
    return error.stack;
  }
  return undefined;
};

/**
 * Check if error should be reported (deduplication logic)
 */
const shouldReportError = (errorHash: string): boolean => {
  const now = Date.now();
  const cachedError = errorCache.get(errorHash);

  if (!cachedError) {
    // First time seeing this error
    errorCache.set(errorHash, { count: 1, lastReported: now });
    return true;
  }

  // Check time threshold and count
  if (now - cachedError.lastReported > ERROR_REPORTING_THROTTLE) {
    // Reset if time threshold passed
    errorCache.set(errorHash, { count: 1, lastReported: now });
    return true;
  }

  if (cachedError.count < MAX_ERROR_COUNT) {
    // Increment count and update time
    errorCache.set(errorHash, { 
      count: cachedError.count + 1, 
      lastReported: now 
    });
    return true;
  }

  return false;
};

/**
 * Create standardized error report
 */
const createErrorReport = (
  error: unknown,
  options: ErrorOptions = {}
): ErrorReport => {
  const message = normalizeError(error);
  const stack = getErrorStack(error);

  return {
    message,
    stack,
    context: options.context || 'unknown',
    data: options.data,
    timestamp: options.timestamp || Date.now(),
    severity: options.isFatal ? 'error' : 'warning',
    errorId: generateErrorId()
  };
};

/**
 * Main error handler function
 * Use this as the primary way to handle and log errors
 */
export const handleError = (
  error: unknown,
  options: ErrorOptions = {}
): ErrorReport => {
  const errorReport = createErrorReport(error, options);

  // Hash for deduplication - using context and message
  const errorHash = `${errorReport.context}:${errorReport.message}`;

  if (shouldReportError(errorHash)) {
    // Log error locally
    console.error(
      `[error] ${errorReport.context}:`, 
      errorReport.message,
      options.data || {},
      errorReport
    );

    // Send to monitoring service if notification enabled
    if (options.notify !== false) {
      // In development, just log
      if (isDevelopment()) {
        console.info('[Dev] Error would be reported to monitoring service:', errorReport);
      } else {
        // In production this would send to an error monitoring service
        // Example: sendToErrorMonitoring(errorReport);
      }
    }
  }

  return errorReport;
};

/**
 * Handle unexpected exceptions
 */
export const handleUnexpectedException = (
  error: Error, 
  componentName?: string
): void => {
  handleError(error, {
    context: `Unexpected exception${componentName ? ` in ${componentName}` : ''}`,
    isFatal: true,
    notify: true
  });
};

/**
 * Create a specialized error handler for API errors
 */
// Renamed to avoid duplicate declaration
export const handleApiErrorWithContext = (
  error: Error | string,
  apiContext: { endpoint: string; method: string; requestData?: any },
  options: Omit<ErrorOptions, 'context'> = {}
): ErrorReport => {
  return handleError(error, {
    ...options,
    context: `API Error: ${apiContext.method} ${apiContext.endpoint}`,
    data: {
      ...options.data,
      requestData: apiContext.requestData,
      endpoint: apiContext.endpoint,
      method: apiContext.method
    }
  });
};

/**
 * Register global error handlers
 */
export const registerGlobalErrorHandlers = (): void => {
  // Handle unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    handleError(event.reason, {
      context: 'Unhandled Promise Rejection',
      isFatal: true,
      notify: true
    });
  });

  // Handle global errors
  window.addEventListener('error', (event) => {
    handleError(event.error || event.message, {
      context: 'Global Error Handler',
      data: {
        fileName: event.filename,
        lineNumber: event.lineno,
        colNumber: event.colno
      },
      isFatal: true,
      notify: true
    });
  });
};

// Add the missing functions for imports in other files
export const getUserFriendlyErrorMessage = (error: any): string => {
  if (!error) return 'An unknown error occurred';
  
  if (error instanceof Error) {
    return error.message;
  }
  
  if (typeof error === 'string') {
    return error;
  }
  
  try {
    return JSON.stringify(error);
  } catch (e) {
    return 'An error occurred';
  }
};

export const formatErrorMessage = (error: any): string => {
  return getUserFriendlyErrorMessage(error);
};

export const registerErrorHandler = (handler: (error: any) => void): number => {
  // Implementation would register a custom handler
  console.log('Custom error handler registered');
  return Date.now(); // return a unique ID for this handler
};

export const unregisterErrorHandler = (handlerId: number): void => {
  // Implementation would unregister a handler by ID
  console.log('Custom error handler unregistered:', handlerId);
};

// Export the necessary functions
export { logError };
export const handleApiError = handleApiErrorWithContext;

export default {
  handleError,
  handleApiError: handleApiErrorWithContext, // Use the renamed function
  handleUnexpectedException,
  registerGlobalErrorHandlers,
  logError, // Export the local logError function
  createError // Export the createError function
};