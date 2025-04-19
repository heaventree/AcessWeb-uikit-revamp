import React, { ReactNode, useState } from 'react';

interface TooltipProps {
  children: ReactNode;
  content: string;
  position?: 'top' | 'right' | 'bottom' | 'left';
  delay?: number;
}

const Tooltip: React.FC<TooltipProps> = ({
  children,
  content,
  position = 'top',
  delay = 300,
}) => {
  const [show, setShow] = useState(false);
  const [timeoutId, setTimeoutId] = useState<number | null>(null);

  // Positions
  const positionClasses = {
    top: 'bottom-full left-1/2 transform -translate-x-1/2 -translate-y-2 mb-1',
    right: 'left-full top-1/2 transform -translate-y-1/2 translate-x-2 ml-1',
    bottom: 'top-full left-1/2 transform -translate-x-1/2 translate-y-2 mt-1',
    left: 'right-full top-1/2 transform -translate-y-1/2 -translate-x-2 mr-1',
  };

  // Arrow positions
  const arrowClasses = {
    top: 'bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full border-l-transparent border-r-transparent border-b-transparent',
    right: 'left-0 top-1/2 transform -translate-y-1/2 -translate-x-full border-t-transparent border-b-transparent border-r-transparent',
    bottom: 'top-0 left-1/2 transform -translate-x-1/2 -translate-y-full border-l-transparent border-r-transparent border-t-transparent',
    left: 'right-0 top-1/2 transform -translate-y-1/2 translate-x-full border-t-transparent border-b-transparent border-l-transparent',
  };

  const handleMouseEnter = () => {
    const id = window.setTimeout(() => {
      setShow(true);
    }, delay);
    setTimeoutId(id);
  };

  const handleMouseLeave = () => {
    if (timeoutId) {
      window.clearTimeout(timeoutId);
      setTimeoutId(null);
    }
    setShow(false);
  };

  return (
    <div className="relative inline-block" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      {children}
      {show && (
        <div
          className={`absolute z-10 px-3 py-2 text-sm font-medium text-white bg-gray-900 rounded-md shadow-sm opacity-90 whitespace-nowrap ${positionClasses[position]}`}
          role="tooltip"
        >
          {content}
          <div
            className={`absolute w-0 h-0 border-4 border-gray-900 ${arrowClasses[position]}`}
          ></div>
        </div>
      )}
    </div>
  );
};

export default Tooltip;