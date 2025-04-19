/**
 * Validation Utilities
 * 
 * Provides form and data validation using Zod for type-safe
 * schema validation with accessibility support.
 */

import { z } from 'zod';
import { createError, ErrorType } from './errorHandler';
import { sanitizeText } from './sanitization';

/**
 * Validate data against a schema
 * @param schema Zod schema
 * @param data Data to validate
 * @returns Validated data or error
 */
export function validateData<T>(schema: z.ZodType<T>, data: unknown): { 
  success: boolean;
  data?: T;
  error?: string;
  errors?: Record<string, string>;
} {
  try {
    // Validate data against schema
    const validatedData = schema.parse(data);
    
    // Return success and validated data
    return {
      success: true,
      data: validatedData
    };
  } catch (error) {
    // Handle validation error
    if (error instanceof z.ZodError) {
      // Format errors
      const errors: Record<string, string> = {};
      
      // Extract error messages by path
      error.errors.forEach(err => {
        const path = err.path.join('.');
        errors[path || 'root'] = sanitizeText(err.message);
      });
      
      // Return validation error
      return {
        success: false,
        error: 'Validation failed. Please check your input.',
        errors
      };
    }
    
    // Return unexpected error
    return {
      success: false,
      error: error instanceof Error 
        ? sanitizeText(error.message) 
        : 'An unexpected error occurred during validation.'
    };
  }
}

/**
 * Email schema with reasonable validation
 */
export const emailSchema = z
  .string()
  .min(5, 'Email is required')
  .max(100, 'Email is too long')
  .email('Please enter a valid email address')
  .transform(email => email.toLowerCase().trim());

/**
 * Password schema with security requirements
 */
export const passwordSchema = z
  .string()
  .min(10, 'Password must be at least 10 characters long')
  .max(100, 'Password is too long')
  .regex(
    /[A-Z]/,
    'Password must contain at least one uppercase letter'
  )
  .regex(
    /[a-z]/,
    'Password must contain at least one lowercase letter'
  )
  .regex(
    /[0-9]/,
    'Password must contain at least one number'
  )
  .regex(
    /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/,
    'Password must contain at least one special character'
  );

/**
 * Username schema
 */
export const usernameSchema = z
  .string()
  .min(3, 'Username must be at least 3 characters long')
  .max(30, 'Username must be at most 30 characters long')
  .regex(
    /^[a-zA-Z0-9_-]+$/,
    'Username can only contain letters, numbers, underscores, and hyphens'
  )
  .transform(username => username.trim());

/**
 * URL schema with security validation
 */
export const urlSchema = z
  .string()
  .url('Please enter a valid URL')
  .refine(
    url => /^https?:\/\//.test(url),
    'URL must start with http:// or https://'
  )
  .transform(url => url.trim());

/**
 * Validate a form using a Zod schema
 * @param formData Form data
 * @param schema Zod schema
 * @returns Validated data or throws error
 */
export function validateForm<T>(
  formData: FormData | Record<string, any>,
  schema: z.ZodType<T>
): T {
  try {
    // Convert FormData to object if needed
    const dataObj = formData instanceof FormData
      ? Object.fromEntries(formData.entries())
      : formData;
    
    // Validate data
    const result = validateData(schema, dataObj);
    
    // If validation failed, throw error
    if (!result.success) {
      throw createError(
        ErrorType.VALIDATION,
        'form_validation_failed',
        result.error || 'Form validation failed',
        { validationErrors: result.errors },
        'Please check the form for errors and try again.',
        'The form contains errors. Please review and correct the highlighted fields.'
      );
    }
    
    // Return validated data
    return result.data as T;
  } catch (error) {
    // Rethrow AppError
    if ((error as any).type === ErrorType.VALIDATION) {
      throw error;
    }
    
    // Create and throw validation error
    throw createError(
      ErrorType.VALIDATION,
      'form_validation_error',
      error instanceof Error 
        ? error.message 
        : 'An unexpected error occurred during form validation',
      { originalError: error },
      'There was a problem with your form submission. Please try again.',
      'Form validation error. Please review your input and try again.'
    );
  }
}

export default {
  validateData,
  validateForm,
  emailSchema,
  passwordSchema,
  usernameSchema,
  urlSchema
};