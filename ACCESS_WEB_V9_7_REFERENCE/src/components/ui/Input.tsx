import React, { InputHTMLAttributes, forwardRef } from 'react';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  fullWidth?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', error, fullWidth = false, ...props }, ref) => {
    const baseClasses = 'block rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm';
    const errorClasses = error ? 'border-red-300 text-red-900 placeholder-red-300' : 'border-gray-300';
    const widthClasses = fullWidth ? 'w-full' : '';
    
    return (
      <div>
        <input
          ref={ref}
          className={`${baseClasses} ${errorClasses} ${widthClasses} ${className}`}
          {...props}
        />
        {error && (
          <p className="mt-1 text-sm text-red-600" id={`${props.id}-error`}>
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;