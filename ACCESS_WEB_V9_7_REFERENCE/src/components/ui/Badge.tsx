import React, { ReactNode } from 'react';

export interface BadgeProps {
  children: ReactNode;
  color?: 'gray' | 'blue' | 'green' | 'red' | 'yellow' | 'purple';
  className?: string;
}

const Badge: React.FC<BadgeProps> = ({ 
  children, 
  color = 'gray', 
  className = '',
  ...props
}) => {
  // Base classes
  const baseClasses = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium';
  
  // Color variants
  const colorClasses = {
    gray: 'bg-gray-100 text-gray-800',
    blue: 'bg-blue-100 text-blue-800',
    green: 'bg-green-100 text-green-800',
    red: 'bg-red-100 text-red-800',
    yellow: 'bg-yellow-100 text-yellow-800',
    purple: 'bg-purple-100 text-purple-800',
  };
  
  return (
    <span
      className={`${baseClasses} ${colorClasses[color]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
};

export default Badge;