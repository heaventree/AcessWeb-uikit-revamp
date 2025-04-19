/**
 * API Error Classes
 * 
 * This file defines a set of error classes for API-related errors.
 * These classes extend the built-in Error class to provide more specific error types
 * with additional metadata.
 */

/**
 * Base API Error Class
 */
export class ApiError extends Error {
  statusCode: number;
  
  constructor(message: string, statusCode = 500) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    
    // This is needed because we're extending a built-in class
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

/**
 * Network Error
 * 
 * Thrown when there's a network-related error (timeouts, disconnections, etc.)
 */
export class NetworkError extends ApiError {
  constructor(message: string) {
    super(message, 0); // Status code 0 indicates a network error
    this.name = 'NetworkError';
    
    Object.setPrototypeOf(this, NetworkError.prototype);
  }
}

/**
 * Authentication Error
 * 
 * Thrown when there's an authentication failure (invalid credentials, expired tokens, etc.)
 */
export class AuthenticationError extends ApiError {
  constructor(message: string = 'Authentication failed') {
    super(message, 401);
    this.name = 'AuthenticationError';
    
    Object.setPrototypeOf(this, AuthenticationError.prototype);
  }
}

/**
 * Authorization Error
 * 
 * Thrown when the user doesn't have permission to access a resource
 */
export class AuthorizationError extends ApiError {
  constructor(message: string = 'You do not have permission to access this resource') {
    super(message, 403);
    this.name = 'AuthorizationError';
    
    Object.setPrototypeOf(this, AuthorizationError.prototype);
  }
}

/**
 * Validation Error
 * 
 * Thrown when the API request doesn't meet validation requirements
 */
export class ValidationError extends ApiError {
  errors: Record<string, string>;
  
  constructor(message: string = 'Validation failed', errors: Record<string, string> = {}, statusCode = 400) {
    super(message, statusCode);
    this.name = 'ValidationError';
    this.errors = errors;
    
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}

/**
 * Not Found Error
 * 
 * Thrown when the requested resource doesn't exist
 */
export class NotFoundError extends ApiError {
  constructor(message: string = 'Resource not found') {
    super(message, 404);
    this.name = 'NotFoundError';
    
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}

/**
 * Rate Limit Error
 * 
 * Thrown when the API rate limit has been exceeded
 */
export class RateLimitError extends ApiError {
  retryAfter?: number;
  
  constructor(message: string = 'Rate limit exceeded', retryAfter?: number) {
    super(message, 429);
    this.name = 'RateLimitError';
    this.retryAfter = retryAfter;
    
    Object.setPrototypeOf(this, RateLimitError.prototype);
  }
}

/**
 * Server Error
 * 
 * Thrown when there's an internal server error
 */
export class ServerError extends ApiError {
  constructor(message: string = 'Internal server error') {
    super(message, 500);
    this.name = 'ServerError';
    
    Object.setPrototypeOf(this, ServerError.prototype);
  }
}

/**
 * Service Unavailable Error
 * 
 * Thrown when the service is temporarily unavailable
 */
export class ServiceUnavailableError extends ApiError {
  retryAfter?: number;
  
  constructor(message: string = 'Service temporarily unavailable', retryAfter?: number) {
    super(message, 503);
    this.name = 'ServiceUnavailableError';
    this.retryAfter = retryAfter;
    
    Object.setPrototypeOf(this, ServiceUnavailableError.prototype);
  }
}