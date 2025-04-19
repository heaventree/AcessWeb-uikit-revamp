import React from 'react';
import { Shield, ShieldCheck, Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';

interface WCAGBadgeProps {
  level: 'A' | 'AA' | 'AAA';
  showTooltip?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

/**
 * A component that displays a WCAG compliance badge
 * - A: Minimum level of compliance
 * - AA: Widely accepted standard for public websites
 * - AAA: Highest level of compliance
 */
export function WCAGBadge({ level, showTooltip = true, size = 'md' }: WCAGBadgeProps) {
  // Determine badge styles based on compliance level
  const getBadgeStyles = () => {
    switch (level) {
      case 'A':
        return 'bg-blue-100 text-blue-700 border-blue-400 dark:bg-blue-900 dark:text-blue-200 dark:border-blue-700';
      case 'AA':
        return 'bg-green-100 text-green-700 border-green-400 dark:bg-green-900 dark:text-green-200 dark:border-green-700';
      case 'AAA':
        return 'bg-purple-100 text-purple-700 border-purple-400 dark:bg-purple-900 dark:text-purple-200 dark:border-purple-700';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-400 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600';
    }
  };

  // Get tooltip text based on level
  const getTooltipText = () => {
    switch (level) {
      case 'A':
        return 'WCAG 2.1 Level A Compliant - Meets basic accessibility requirements';
      case 'AA':
        return 'WCAG 2.1 Level AA Compliant - Meets standard accessibility requirements for public websites';
      case 'AAA':
        return 'WCAG 2.1 Level AAA Compliant - Meets the highest level of accessibility requirements';
      default:
        return 'WCAG Compliance';
    }
  };

  // Get icon based on level
  const getIcon = () => {
    switch (level) {
      case 'A':
        return <Shield className="h-3.5 w-3.5 mr-1" />;
      case 'AA':
        return <ShieldCheck className="h-3.5 w-3.5 mr-1" />;
      case 'AAA':
        return <ShieldCheck className="h-3.5 w-3.5 mr-1" />;
      default:
        return <Info className="h-3.5 w-3.5 mr-1" />;
    }
  };

  // Get class for size
  const getSizeClass = () => {
    switch (size) {
      case 'sm':
        return 'text-xs py-0.5 px-2';
      case 'lg':
        return 'text-sm py-1 px-3';
      case 'md':
      default:
        return 'text-xs py-0.5 px-2.5';
    }
  };

  const badge = (
    <Badge
      variant="outline"
      className={`${getBadgeStyles()} ${getSizeClass()} inline-flex items-center font-medium rounded border shadow-sm`}
    >
      {getIcon()}
      WCAG {level}
    </Badge>
  );

  if (!showTooltip) {
    return badge;
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          {badge}
        </TooltipTrigger>
        <TooltipContent>
          <p className="text-sm">{getTooltipText()}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export default WCAGBadge;