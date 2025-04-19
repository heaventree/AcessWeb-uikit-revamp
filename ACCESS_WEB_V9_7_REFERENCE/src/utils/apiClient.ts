/**
 * API Client Utility
 * 
 * Provides secure, centralized HTTP client functionality with built-in
 * error handling, retry logic, and security features.
 */

import { appendCsrfHeader } from './csrfProtection';
import { ErrorType, createError } from './errorHandler';
import { applySecurityHeadersToRequest } from './securityHeaders';
import { checkRateLimit } from './rateLimiting';
import { API_TIMEOUT } from './environment';

/**
 * Base configuration for API requests
 */
export interface ApiClientConfig {
  /**
   * Base URL for API requests
   */
  baseUrl?: string;
  
  /**
   * Default timeout in milliseconds
   */
  timeout?: number;
  
  /**
   * Default headers for all requests
   */
  defaultHeaders?: HeadersInit;
  
  /**
   * Whether to include CSRF protection
   */
  csrfProtection?: boolean;
  
  /**
   * Whether to retry failed requests
   */
  retry?: boolean;
  
  /**
   * Maximum number of retry attempts
   */
  maxRetries?: number;
  
  /**
   * Custom request transformer
   */
  requestTransformer?: (init: RequestInit) => RequestInit;
  
  /**
   * Custom response transformer
   */
  responseTransformer?: <T>(response: Response) => Promise<T>;
}

/**
 * Default API client configuration
 */
const DEFAULT_CONFIG: ApiClientConfig = {
  baseUrl: '',
  timeout: API_TIMEOUT,
  defaultHeaders: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  csrfProtection: true,
  retry: true,
  maxRetries: 3
};

/**
 * API client for making HTTP requests with built-in security
 */
class ApiClient {
  private config: ApiClientConfig;
  
  constructor(config: Partial<ApiClientConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }
  
  /**
   * Make a GET request
   * @param url URL to request
   * @param options Request options
   * @returns Response data
   */
  async get<T>(url: string, options: RequestInit = {}): Promise<T> {
    return this.request<T>(url, { ...options, method: 'GET' });
  }
  
  /**
   * Make a POST request
   * @param url URL to request
   * @param data Request body data
   * @param options Request options
   * @returns Response data
   */
  async post<T>(url: string, data?: any, options: RequestInit = {}): Promise<T> {
    return this.request<T>(url, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined
    });
  }
  
  /**
   * Make a PUT request
   * @param url URL to request
   * @param data Request body data
   * @param options Request options
   * @returns Response data
   */
  async put<T>(url: string, data?: any, options: RequestInit = {}): Promise<T> {
    return this.request<T>(url, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined
    });
  }
  
  /**
   * Make a DELETE request
   * @param url URL to request
   * @param options Request options
   * @returns Response data
   */
  async delete<T>(url: string, options: RequestInit = {}): Promise<T> {
    return this.request<T>(url, { ...options, method: 'DELETE' });
  }
  
  /**
   * Make a generic HTTP request with security features
   * @param url URL to request
   * @param options Request options
   * @returns Response data
   */
  private async request<T>(url: string, options: RequestInit): Promise<T> {
    // Apply rate limiting check
    checkRateLimit({
      key: 'api',
      windowMs: 60000, // 1 minute
      maxRequests: 100 // 100 requests per minute
    });
    
    // Prepare request options
    const init = this.prepareRequestOptions(options);
    
    // Add security headers
    applySecurityHeadersToRequest(init);
    
    // Add CSRF protection
    if (this.config.csrfProtection && typeof appendCsrfHeader === 'function') {
      if (!init.headers) {
        init.headers = new Headers();
      } else if (!(init.headers instanceof Headers)) {
        init.headers = new Headers(init.headers as Record<string, string>);
      }
      
      appendCsrfHeader(init.headers as Headers);
    }
    
    // Apply custom request transformer if provided
    const transformedInit = this.config.requestTransformer 
      ? this.config.requestTransformer(init) 
      : init;
    
    // Resolve full URL
    const fullUrl = this.resolveUrl(url);
    
    // Make the request with timeout
    try {
      const response = await this.fetchWithTimeout(fullUrl, transformedInit);
      
      // Handle error responses
      if (!response.ok) {
        throw await this.handleErrorResponse(response);
      }
      
      // Parse and transform response
      return this.parseResponse<T>(response);
    } catch (error) {
      // Retry logic for network errors and timeouts
      if (
        this.config.retry && 
        this.shouldRetry(error, options.method || 'GET')
      ) {
        // Get retry count
        const retryCount = (options as any)._retryCount || 0;
        
        // Check if we've reached max retries
        if (retryCount < (this.config.maxRetries || 0)) {
          // Increment retry count
          const nextOptions = { 
            ...options, 
            _retryCount: retryCount + 1 
          };
          
          // Exponential backoff
          const delay = Math.pow(2, retryCount) * 300;
          
          // Wait and retry
          await new Promise(resolve => setTimeout(resolve, delay));
          return this.request<T>(url, nextOptions);
        }
      }
      
      // Re-throw the error
      throw error;
    }
  }
  
  /**
   * Prepare request options with defaults
   * @param options User-provided options
   * @returns Merged options
   */
  private prepareRequestOptions(options: RequestInit): RequestInit {
    // Merge with default headers
    const headers = new Headers(this.config.defaultHeaders || {});
    
    // Add user-provided headers
    if (options.headers) {
      if (options.headers instanceof Headers) {
        for (const [key, value] of (options.headers as Headers).entries()) {
          headers.set(key, value);
        }
      } else {
        Object.entries(options.headers as Record<string, string>).forEach(
          ([key, value]) => headers.set(key, value)
        );
      }
    }
    
    // Merge options
    return {
      ...options,
      headers,
      credentials: options.credentials || 'include'
    };
  }
  
  /**
   * Parse the response body based on content type
   * @param response Fetch Response object
   * @returns Parsed response data
   */
  private async parseResponse<T>(response: Response): Promise<T> {
    // Check content type
    const contentType = response.headers.get('content-type') || '';
    
    let data: any;
    
    if (contentType.includes('application/json')) {
      data = await response.json();
    } else if (contentType.includes('text/')) {
      data = await response.text();
    } else {
      // Binary data or other format
      data = await response.blob();
    }
    
    // Apply custom response transformer if provided
    if (this.config.responseTransformer) {
      return this.config.responseTransformer<T>(response);
    }
    
    return data as T;
  }
  
  /**
   * Handle error responses
   * @param response Error response
   * @returns Error to throw
   */
  private async handleErrorResponse(response: Response): Promise<Error> {
    // Try to parse error data from response
    let errorData: any;
    
    try {
      // Try to get JSON error
      const contentType = response.headers.get('content-type') || '';
      
      if (contentType.includes('application/json')) {
        errorData = await response.json();
      } else {
        errorData = await response.text();
      }
    } catch (e) {
      errorData = { message: 'Failed to parse error response' };
    }
    
    // Map status codes to error types
    let errorType = ErrorType.API;
    
    switch (response.status) {
      case 400:
        errorType = ErrorType.VALIDATION;
        break;
      case 401:
      case 403:
        errorType = ErrorType.AUTHENTICATION;
        break;
      case 404:
        errorType = ErrorType.API;
        break;
      case 429:
        errorType = ErrorType.RATE_LIMIT;
        break;
      default:
        if (response.status >= 500) {
          errorType = ErrorType.API;
        }
    }
    
    // Create standardized error
    return createError(
      errorType,
      `http_${response.status}`,
      typeof errorData === 'string' 
        ? errorData 
        : errorData.message || `HTTP error ${response.status}`,
      {
        status: response.status,
        url: response.url,
        data: errorData
      }
    );
  }
  
  /**
   * Determine if a request should be retried
   * @param error Error that occurred
   * @param method HTTP method
   * @returns True if request should be retried
   */
  private shouldRetry(error: any, method: string): boolean {
    // Only retry safe methods by default
    const safeMethod = ['GET', 'HEAD', 'OPTIONS'].includes(method);
    
    // Check if network error or timeout
    const isNetworkError = error.name === 'TypeError' && 
      error.message.includes('network');
    const isTimeoutError = error.name === 'AbortError';
    
    // Also retry server errors for safe methods
    const isServerError = error.name === 'AppError' && 
      error.type === ErrorType.API && 
      error.details?.status >= 500;
    
    return (isNetworkError || isTimeoutError || (isServerError && safeMethod));
  }
  
  /**
   * Fetch with timeout support
   * @param url URL to fetch
   * @param options Fetch options
   * @returns Fetch response
   */
  private async fetchWithTimeout(url: string, options: RequestInit): Promise<Response> {
    const timeout = this.config.timeout || DEFAULT_CONFIG.timeout;
    
    // Create abort controller
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    
    try {
      // Make request with abort signal
      const response = await fetch(url, {
        ...options,
        signal: controller.signal
      });
      
      return response;
    } finally {
      // Clear timeout
      clearTimeout(timeoutId);
    }
  }
  
  /**
   * Resolve a URL against the base URL
   * @param url URL to resolve
   * @returns Full URL
   */
  private resolveUrl(url: string): string {
    // If URL already includes protocol or is absolute, return as is
    if (/^(https?:)?\/\//.test(url) || !this.config.baseUrl) {
      return url;
    }
    
    // Remove trailing slash from base URL
    const base = this.config.baseUrl.replace(/\/$/, '');
    
    // Remove leading slash from URL
    const path = url.replace(/^\//, '');
    
    // Join base and path
    return `${base}/${path}`;
  }
}

// Create and export a default API client instance
export const apiClient = new ApiClient();

export default apiClient;