import React, { useEffect, useRef } from 'react';
import { CheckCircle, Clock, AlertCircle } from 'lucide-react';

// FeedbackItem type
interface Position {
  x: number;
  y: number;
}

type FeedbackStatus = 'pending' | 'inProgress' | 'resolved';
type FeedbackCategory = 'debug' | 'roadmap';

interface FeedbackItem {
  id: string;
  position: Position;
  elementPath: string;
  comment: string;
  status: FeedbackStatus;
  createdAt: string;
  category: FeedbackCategory;
  page: string;
}

// Props for FeedbackMarker component
interface FeedbackMarkerProps {
  item: FeedbackItem;
  onStatusChange: (id: string) => void;
  onDelete: (id: string) => void;
}

// StatusIcon component
const StatusIcon: React.FC<{ status: FeedbackStatus }> = ({ status }) => {
  if (status === 'resolved') return <CheckCircle className="h-3 w-3" />;
  if (status === 'inProgress') return <Clock className="h-3 w-3" />;
  return <AlertCircle className="h-3 w-3" />;
};

// Function to get color for status
const getStatusColor = (status: FeedbackStatus, category: FeedbackCategory): string => {
  if (status === 'pending') {
    return category === 'roadmap' ? 'bg-blue-500' : 'bg-red-500';
  } else if (status === 'inProgress') {
    return 'bg-yellow-500';
  } else {
    return 'bg-green-500';
  }
};

/**
 * FeedbackMarker Component
 * Displays a marker for feedback that sticks to the target element when scrolling
 */
const FeedbackMarker: React.FC<FeedbackMarkerProps> = ({ item, onStatusChange, onDelete }) => {
  const markerRef = useRef<HTMLDivElement>(null);
  
  // Effect to attach marker to element on scroll
  useEffect(() => {
    // Find the element by its path
    let targetElement: Element | null = null;
    
    try {
      // Try to simplify the selector to improve chances of finding it
      const simplifiedSelector = item.elementPath
        .split('>')
        .pop()
        ?.trim() || '';
        
      if (simplifiedSelector) {
        // Try to find the element using the selector
        const possibleElements = document.querySelectorAll(simplifiedSelector);
        
        if (possibleElements.length === 1) {
          targetElement = possibleElements[0];
        } else if (possibleElements.length > 1) {
          // If multiple elements match, find the one closest to the original click position
          const originalX = item.position.x;
          const originalY = item.position.y;
          
          let closestElement = null;
          let closestDistance = Infinity;
          
          possibleElements.forEach(el => {
            const rect = el.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2 + window.scrollX;
            const centerY = rect.top + rect.height / 2 + window.scrollY;
            
            const distance = Math.sqrt(
              Math.pow(centerX - originalX, 2) + 
              Math.pow(centerY - originalY, 2)
            );
            
            if (distance < closestDistance) {
              closestDistance = distance;
              closestElement = el;
            }
          });
          
          if (closestElement) {
            targetElement = closestElement;
          }
        }
      }
    } catch (error) {
      console.error('Error finding element by path:', error);
    }
    
    // If no element found, use the original fixed position
    if (!targetElement) {
      if (markerRef.current) {
        markerRef.current.style.position = 'absolute';
        markerRef.current.style.left = `${item.position.x}px`;
        markerRef.current.style.top = `${item.position.y}px`;
      }
      return;
    }
    
    // Function to update marker position based on element position
    const updatePosition = () => {
      if (!markerRef.current || !targetElement) return;
      
      const rect = targetElement.getBoundingClientRect();
      const scrollX = window.scrollX;
      const scrollY = window.scrollY;
      
      // Position at the top-right corner of the element
      markerRef.current.style.position = 'absolute';
      markerRef.current.style.left = `${rect.right + scrollX}px`;
      markerRef.current.style.top = `${rect.top + scrollY}px`;
    };
    
    // Set initial position
    updatePosition();
    
    // Update position on scroll and resize
    window.addEventListener('scroll', updatePosition);
    window.addEventListener('resize', updatePosition);
    
    // Clean up event listeners
    return () => {
      window.removeEventListener('scroll', updatePosition);
      window.removeEventListener('resize', updatePosition);
    };
  }, [item.elementPath, item.position.x, item.position.y]);
  
  return (
    <div
      ref={markerRef}
      className={`absolute z-40 rounded-full w-6 h-6 flex items-center justify-center cursor-pointer shadow-md text-white hover:scale-110 transition-transform ${getStatusColor(item.status, item.category)}`}
      style={{
        left: item.position.x,
        top: item.position.y,
        transform: 'translate(-50%, -50%)'
      }}
      title={`${item.comment.substring(0, 20)}${item.comment.length > 20 ? '...' : ''} (Click to change status, right-click to delete)`}
      onClick={() => onStatusChange(item.id)}
      onContextMenu={(e) => {
        e.preventDefault();
        onDelete(item.id);
      }}
    >
      <StatusIcon status={item.status} />
    </div>
  );
};

export default FeedbackMarker;