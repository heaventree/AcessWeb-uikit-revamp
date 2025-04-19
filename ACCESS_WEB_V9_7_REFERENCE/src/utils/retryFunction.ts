import { QueryKey } from '@tanstack/react-query';

// Retry configuration for different query types
const retryConfig = {
  auth: {
    maxRetries: 0, // Don't retry auth errors
    retryableErrors: []
  },
  api: {
    maxRetries: 3,
    retryableErrors: [
      'network_error',
      'timeout',
      'rate_limit_exceeded',
      '5xx'
    ]
  },
  monitoring: {
    maxRetries: 5,
    retryableErrors: [
      'network_error',
      'timeout',
      'service_unavailable'
    ]
  }
};

// Helper to determine query type from query key
function getQueryType(queryKey: QueryKey): 'auth' | 'api' | 'monitoring' {
  const key = queryKey[0];
  if (typeof key === 'string') {
    if (key.includes('auth')) return 'auth';
    if (key.includes('monitor')) return 'monitoring';
  }
  return 'api';
}

// Helper to check if error is retryable
function isRetryableError(error: unknown, retryableErrors: string[]): boolean {
  if (error instanceof Error) {
    // Check for network errors
    if (error.name === 'NetworkError') return true;
    
    // Check for timeout errors
    if (error.name === 'TimeoutError') return true;
    
    // Check for rate limit errors
    if (error.message.includes('rate limit')) return true;
    
    // Check for 5xx errors
    if (error.message.includes('5')) return true;
    
    // Check custom error types
    return retryableErrors.some(type => 
      error.message.toLowerCase().includes(type.toLowerCase())
    );
  }
  return false;
}

export function retryFunction(
  failureCount: number,
  error: unknown,
  queryKey: QueryKey
): boolean {
  // Get retry config based on query type
  const type = getQueryType(queryKey);
  const config = retryConfig[type];
  
  // Don't retry if max retries exceeded
  if (failureCount >= config.maxRetries) {
    return false;
  }
  
  // Check if error is retryable
  return isRetryableError(error, config.retryableErrors);
}