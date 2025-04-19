
import { applySecurityHeaders } from '../../utils/securityHeaders';

/**
 * Middleware for applying security headers to all responses
 */
export const securityHeadersMiddleware = (req: any, res: any, next: any) => {
  // Apply security headers from our utility
  applySecurityHeaders(res);
  
  // Continue to next middleware
  next();
};
