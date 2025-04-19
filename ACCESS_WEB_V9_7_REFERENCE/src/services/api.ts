/**
 * API Service
 * 
 * Provides centralized access to API endpoints with secure communication,
 * error handling, and standardized response processing.
 */

import { apiClient } from '../utils/apiClient';
import { ErrorType, createError, handleApiError } from '../utils/errorHandler';
import { sanitizeObject } from '../utils/sanitization';
import { API_BASE_URL, API_VERSION } from '../utils/environment';
import authApi from './authApi';
import accessibilityApi from './accessibilityApi';

// Re-export specialized API services
export { authApi, accessibilityApi };

// Base endpoint for API requests
const baseEndpoint = `${API_BASE_URL}/${API_VERSION}`;

// API response interface
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: Record<string, any>;
  };
}

/**
 * Make a GET request to the API with error handling
 * @param endpoint API endpoint (without base URL)
 * @param params URL parameters
 * @returns Response data
 */
export async function apiGet<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
  try {
    // Build query string
    const queryString = params
      ? '?' + new URLSearchParams(sanitizeObject(params) as Record<string, string>).toString()
      : '';
    
    // Make request
    const response = await apiClient.get<ApiResponse<T>>(`${baseEndpoint}/${endpoint}${queryString}`);
    
    // Handle response
    if (!response.success) {
      throw createError(
        ErrorType.API,
        response.error?.code || 'api_error',
        response.error?.message || 'API request failed',
        response.error?.details
      );
    }
    
    // Return data
    return response.data as T;
  } catch (error) {
    // Transform error to AppError
    throw handleApiError(error, `Failed to get data from ${endpoint}`);
  }
}

/**
 * Make a POST request to the API with error handling
 * @param endpoint API endpoint (without base URL)
 * @param data Request body data
 * @returns Response data
 */
export async function apiPost<T>(endpoint: string, data?: Record<string, any>): Promise<T> {
  try {
    // Make request with sanitized data
    const sanitizedData = data ? sanitizeObject(data) : undefined;
    const response = await apiClient.post<ApiResponse<T>>(`${baseEndpoint}/${endpoint}`, sanitizedData);
    
    // Handle response
    if (!response.success) {
      throw createError(
        ErrorType.API,
        response.error?.code || 'api_error',
        response.error?.message || 'API request failed',
        response.error?.details
      );
    }
    
    // Return data
    return response.data as T;
  } catch (error) {
    // Transform error to AppError
    throw handleApiError(error, `Failed to post data to ${endpoint}`);
  }
}

/**
 * Make a PUT request to the API with error handling
 * @param endpoint API endpoint (without base URL)
 * @param data Request body data
 * @returns Response data
 */
export async function apiPut<T>(endpoint: string, data?: Record<string, any>): Promise<T> {
  try {
    // Make request with sanitized data
    const sanitizedData = data ? sanitizeObject(data) : undefined;
    const response = await apiClient.put<ApiResponse<T>>(`${baseEndpoint}/${endpoint}`, sanitizedData);
    
    // Handle response
    if (!response.success) {
      throw createError(
        ErrorType.API,
        response.error?.code || 'api_error',
        response.error?.message || 'API request failed',
        response.error?.details
      );
    }
    
    // Return data
    return response.data as T;
  } catch (error) {
    // Transform error to AppError
    throw handleApiError(error, `Failed to update data at ${endpoint}`);
  }
}

/**
 * Make a DELETE request to the API with error handling
 * @param endpoint API endpoint (without base URL)
 * @returns Response data
 */
export async function apiDelete<T>(endpoint: string): Promise<T> {
  try {
    // Make request
    const response = await apiClient.delete<ApiResponse<T>>(`${baseEndpoint}/${endpoint}`);
    
    // Handle response
    if (!response.success) {
      throw createError(
        ErrorType.API,
        response.error?.code || 'api_error',
        response.error?.message || 'API request failed',
        response.error?.details
      );
    }
    
    // Return data
    return response.data as T;
  } catch (error) {
    // Transform error to AppError
    throw handleApiError(error, `Failed to delete resource at ${endpoint}`);
  }
}

export default {
  get: apiGet,
  post: apiPost,
  put: apiPut,
  delete: apiDelete,
  auth: authApi,
  accessibility: accessibilityApi
};