import { useState } from 'react';

interface SkipLinkProps {
  targetId: string;
  className?: string;
}

/**
 * A skip navigation link that lets keyboard users skip to the main content
 * This is a crucial accessibility feature for keyboard navigation
 */
export function SkipLink({ targetId, className = "" }: SkipLinkProps) {
  const [isFocused, setIsFocused] = useState(false);
  
  return (
    <a
      href={`#${targetId}`}
      className={`
        fixed top-2 left-2 p-2 bg-blue-600 text-white font-medium rounded z-50
        transition-transform duration-200 ease-in-out
        ${isFocused ? 'transform-none' : '-translate-y-16'}
        focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2
        ${className}
      `}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
    >
      Skip to main content
    </a>
  );
}