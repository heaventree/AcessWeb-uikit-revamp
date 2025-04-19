import type { CSSProperties } from 'react';

interface ProgressProps {
  value: number;
  max: number;
  className?: string;
  barClassName?: string;
  style?: CSSProperties;
  label?: string;
  id?: string;
}

export function Progress({ 
  value, 
  max, 
  className = "", 
  barClassName = "",
  style,
  label,
  id
}: ProgressProps) {
  const percentage = Math.round((value / max) * 100);
  const progressId = id || `progress-${Math.random().toString(36).substring(2, 9)}`;
  const ariaLabel = label || `${percentage}% complete`;
  
  return (
    <div 
      className={`bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden ${className}`}
      role="progressbar" 
      aria-valuenow={value} 
      aria-valuemin={0} 
      aria-valuemax={max}
      aria-label={ariaLabel}
      id={progressId}
      // Add a data attribute for screen readers that support it
      data-percentage={`${percentage}%`}
    >
      <div 
        className={`h-full rounded-full bg-blue-600 transition-all duration-300 ease-in-out ${barClassName}`}
        style={{ width: `${percentage}%`, ...style }}
      />
      {/* Visually hidden text for screen readers */}
      <span className="sr-only">{ariaLabel}</span>
    </div>
  );
}