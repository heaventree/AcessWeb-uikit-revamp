import type { ReactNode, ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'link';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  rightIcon?: ReactNode;
  isLoading?: boolean;
  loadingText?: string;
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = "",
  onClick,
  rightIcon,
  disabled = false,
  type = 'button',
  isLoading = false,
  loadingText,
  'aria-describedby': ariaDescribedby,
  ...props
}: ButtonProps) {
  const baseStyle = "inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500";
  
  const variantStyles = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 shadow",
    secondary: "bg-blue-100 text-blue-900 hover:bg-blue-200",
    outline: "border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800",
    ghost: "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800",
    link: "text-blue-600 dark:text-blue-400 underline-offset-4 hover:underline"
  };
  
  const sizeStyles = {
    sm: "text-xs px-2.5 py-1.5 rounded min-h-[32px] min-w-[32px]",
    md: "text-sm px-4 py-2 rounded-md min-h-[40px] min-w-[40px]",
    lg: "text-base px-6 py-3 rounded-md min-h-[48px] min-w-[48px]"
  };

  const isDisabled = disabled || isLoading;
  
  return (
    <button
      className={`${baseStyle} ${variantStyles[variant]} ${sizeStyles[size]} ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
      onClick={onClick}
      disabled={isDisabled}
      type={type}
      aria-disabled={isDisabled}
      aria-describedby={ariaDescribedby}
      aria-busy={isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <span className="animate-spin mr-2" aria-hidden="true">
            <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </span>
          <span>{loadingText || children}</span>
          <span className="sr-only">Loading</span>
        </>
      ) : (
        <>
          {children}
          {rightIcon && <span className="ml-2" aria-hidden="true">{rightIcon}</span>}
        </>
      )}
    </button>
  );
}