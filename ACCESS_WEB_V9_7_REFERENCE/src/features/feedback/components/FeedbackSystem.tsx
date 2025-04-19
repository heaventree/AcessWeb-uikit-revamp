import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { Position } from '../types';
import { useFeedbackItems } from '../hooks/useFeedbackItems';
import { getElementPath, disableInteractiveElements, createTargetingOverlay, getStatusColor } from '../utils/domUtils';

/**
 * FeedbackSystem Component
 * 
 * Provides a comprehensive feedback system that allows users to:
 * - Click on any element to leave targeted feedback
 * - View existing feedback markers with their status
 * - Update feedback status through the UI
 * - Toggle between debug and roadmap feedback categories
 */
const FeedbackSystem: React.FC = () => {
  // State for the feedback system
  const {
    feedbackItems,
    selectedCategory,
    setSelectedCategory,
    addFeedbackItem,
    toggleFeedbackStatus,
    removeFeedbackItem,
    resetAllFeedback
  } = useFeedbackItems();
  
  // UI state
  const [isActive, setIsActive] = useState(false);
  const [hoveredElement, setHoveredElement] = useState<HTMLElement | null>(null);
  const [selectedElement, setSelectedElement] = useState<HTMLElement | null>(null);
  const [selectedPosition, setSelectedPosition] = useState<Position | null>(null);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [currentComment, setCurrentComment] = useState('');
  
  // Reference to the widget element to avoid self-selection
  const widgetRef = useRef<HTMLDivElement>(null);
  
  // Handle document interaction when feedback tool is active
  useEffect(() => {
    if (!isActive) return;
    
    // Store original element states and disable interactive elements
    const { cleanup, originalStates } = disableInteractiveElements(widgetRef);
    
    // Handle element highlighting with a shared function
    const highlightElement = (element: HTMLElement) => {
      // Skip if it's the same element we're already hovering
      if (element === hoveredElement) return;
      
      // Skip if it's part of our own widget
      if (widgetRef.current && widgetRef.current.contains(element)) return;
      
      // Clear highlight from the previous element if any
      if (hoveredElement) {
        // Restore original outline (or empty string)
        const originalState = originalStates.get(hoveredElement);
        hoveredElement.style.outline = originalState?.outline || '';
        hoveredElement.style.outlineOffset = originalState?.outlineOffset || '';
      }
      
      // Apply highlight to the current element
      element.style.outline = '2px solid #3b82f6';
      element.style.outlineOffset = '2px';
      setHoveredElement(element);
    };
    
    // Handle mouse movement for element highlighting - using capture phase
    const handleMouseOver = (e: MouseEvent) => {
      highlightElement(e.target as HTMLElement);
    };
    
    // Handle mousemove for more comprehensive element detection
    const handleMouseMove = (e: MouseEvent) => {
      // Get all elements at the current pointer position
      const elementsAtPoint = document.elementsFromPoint(e.clientX, e.clientY);
      
      // Skip if we're over our widget
      if (widgetRef.current && elementsAtPoint.some(el => widgetRef.current?.contains(el))) return;
      
      // Get the topmost element
      if (elementsAtPoint.length > 0) {
        highlightElement(elementsAtPoint[0] as HTMLElement);
      }
    };
    
    // Handle click to select an element and place a marker
    const handleClick = (e: MouseEvent) => {
      // Skip if clicking on our own widget
      if (widgetRef.current && widgetRef.current.contains(e.target as Node)) return;
      
      // Stop normal event behavior
      e.preventDefault();
      e.stopPropagation();
      
      // Get elements at click position to ensure we get the right one
      const elementsAtClick = document.elementsFromPoint(e.clientX, e.clientY);
      const clickedElement = elementsAtClick.length > 0 ? 
                           (elementsAtClick[0] as HTMLElement) : 
                           (e.target as HTMLElement);
      
      // Set the position and element for the feedback
      setSelectedPosition({ x: e.pageX, y: e.pageY });
      setSelectedElement(clickedElement);
      setShowCommentModal(true);
      
      // Clear all highlights
      document.body.querySelectorAll('*').forEach(el => {
        const htmlEl = el as HTMLElement;
        const originalState = originalStates.get(htmlEl) || { outline: '', outlineOffset: '' };
        htmlEl.style.outline = originalState.outline;
        htmlEl.style.outlineOffset = originalState.outlineOffset;
      });
      
      // Exit targeting mode but keep modal open
      setIsActive(false);
      
      // Restore pointer events on all elements
      originalStates.forEach((state, element) => {
        if (element) {
          element.style.pointerEvents = state.pointerEvents;
        }
      });
    };
    
    // Allow ESC to cancel
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsActive(false);
        
        // Restore all elements to their original state
        originalStates.forEach((state, element) => {
          if (element) {
            element.style.outline = state.outline;
            element.style.outlineOffset = state.outlineOffset;
            element.style.pointerEvents = state.pointerEvents;
          }
        });
      }
    };
    
    // Add a highlight overlay message to make it clear we're in targeting mode
    createTargetingOverlay();
    
    // Add all event listeners
    document.addEventListener('mouseover', handleMouseOver, true);
    document.addEventListener('mousemove', handleMouseMove, true);
    document.addEventListener('click', handleClick, true);
    document.addEventListener('keydown', handleKeyDown);
    
    // Change cursor to indicate clickable page
    document.body.style.cursor = 'crosshair';
    
    return () => {
      // Clean up event listeners
      document.removeEventListener('mouseover', handleMouseOver, true);
      document.removeEventListener('mousemove', handleMouseMove, true);
      document.removeEventListener('click', handleClick, true);
      document.removeEventListener('keydown', handleKeyDown);
      
      // Reset cursor
      document.body.style.cursor = '';
      
      // Remove the overlay
      const existingOverlay = document.getElementById('feedback-targeting-overlay');
      if (existingOverlay) {
        existingOverlay.remove();
      }
      
      // Clean up all element modifications
      cleanup();
    };
  }, [isActive, hoveredElement]);
  
  // Add a new feedback item
  const submitFeedback = () => {
    if (!selectedPosition || !selectedElement || !currentComment.trim()) return;
    
    addFeedbackItem(
      getElementPath(selectedElement),
      selectedPosition,
      currentComment.trim()
    );
    
    setCurrentComment('');
    setShowCommentModal(false);
    setSelectedElement(null);
  };
  
  // Render status icon
  const StatusIcon = ({ status }: { status: string }) => {
    if (status === 'pending') return <Clock className="h-3 w-3" />;
    if (status === 'inProgress') return <AlertCircle className="h-3 w-3" />;
    return <CheckCircle className="h-3 w-3" />;
  };
  
  return (
    <div ref={widgetRef}>
      {/* Feedback Button */}
      <div className="fixed right-4 top-1/2 -translate-y-1/2 z-50">
        {/* Category Switch */}
        <div className="mb-2 bg-white rounded-md shadow-sm border border-gray-200 p-1 flex text-xs">
          <button
            onClick={() => setSelectedCategory('debug')}
            className={`px-3 py-1 rounded-md transition-colors ${
              selectedCategory === 'debug' 
                ? 'bg-blue-100 text-blue-700' 
                : 'hover:bg-gray-100'
            }`}
          >
            Debug
          </button>
          <button
            onClick={() => setSelectedCategory('roadmap')}
            className={`px-3 py-1 rounded-md transition-colors ${
              selectedCategory === 'roadmap' 
                ? 'bg-blue-100 text-blue-700' 
                : 'hover:bg-gray-100'
            }`}
          >
            Roadmap
          </button>
        </div>
        
        <button
          onClick={() => setIsActive(!isActive)}
          className={`rounded-full h-12 w-12 shadow-lg flex items-center justify-center transition-colors ${
            isActive ? 'bg-red-500 text-white' : 'bg-blue-500 text-white'
          }`}
          title={isActive ? 'Cancel' : 'Click to add feedback'}
        >
          {isActive ? <X className="h-5 w-5" /> : <MessageSquare className="h-5 w-5" />}
        </button>
        
        {/* Reset button (only visible if feedback exists) */}
        {feedbackItems.length > 0 && (
          <button
            onClick={resetAllFeedback}
            className="mt-2 text-xs bg-white p-1 rounded border border-gray-200 hover:bg-gray-50 shadow-sm"
            title="Reset all feedback markers"
          >
            Reset All
          </button>
        )}
      </div>
      
      {/* Feedback Markers */}
      {feedbackItems.map(item => (
        <div
          key={item.id}
          className={`fixed z-40 rounded-full w-6 h-6 flex items-center justify-center cursor-pointer shadow-md text-white hover:scale-110 transition-transform ${getStatusColor(item.status, item.category)}`}
          style={{
            left: item.position.x,
            top: item.position.y,
            transform: 'translate(-50%, -50%)'
          }}
          title={`${item.comment.substring(0, 20)}${item.comment.length > 20 ? '...' : ''} (Click to change status, right-click to delete)`}
          onClick={() => toggleFeedbackStatus(item.id)}
          onContextMenu={(e) => {
            e.preventDefault();
            removeFeedbackItem(item.id);
          }}
        >
          <StatusIcon status={item.status} />
        </div>
      ))}
      
      {/* Comment Modal */}
      {showCommentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-4 w-80 max-w-[95vw] shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium">Add Feedback</h3>
              <button 
                onClick={() => {
                  setShowCommentModal(false);
                  setSelectedElement(null);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            
            <div className="text-xs bg-gray-100 p-2 rounded mb-4 overflow-hidden">
              <div className="font-medium mb-1">Element selected:</div>
              <div className="truncate opacity-60">
                {selectedElement ? getElementPath(selectedElement) : 'None'}
              </div>
            </div>
            
            <textarea
              value={currentComment}
              onChange={(e) => setCurrentComment(e.target.value)}
              placeholder="Enter your feedback here..."
              className="w-full border border-gray-300 rounded-md p-2 mb-4 h-24 text-sm"
              autoFocus
            />
            
            <div className="flex justify-end">
              <button
                onClick={submitFeedback}
                disabled={!currentComment.trim()}
                className={`px-4 py-2 rounded-md text-white ${
                  currentComment.trim() ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-300 cursor-not-allowed'
                }`}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
      
      {isActive && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-white px-4 py-2 rounded-md shadow-lg text-sm z-50 border border-gray-200">
          Click anywhere on the page to add feedback
        </div>
      )}
    </div>
  );
};

export default FeedbackSystem;