import React, { useState, useEffect, useRef } from 'react';
import { X, Target, MessageSquare } from 'lucide-react';
import { getCssPath } from './utils/domUtils';

interface FeedbackWidgetProps {
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  onFeedbackSubmitted?: (feedback: any) => void;
  addToRoadmap?: boolean; // Whether to add to roadmap (true) or debug list (false)
  quickMode?: boolean; // If true, clicking the button immediately activates targeting mode
}

export const FeedbackWidget: React.FC<FeedbackWidgetProps> = ({
  position = 'bottom-right',
  onFeedbackSubmitted,
  addToRoadmap = false,
  quickMode = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isTargeting, setIsTargeting] = useState(false);
  const [hoveredElement, setHoveredElement] = useState<HTMLElement | null>(null);
  const [selectedElement, setSelectedElement] = useState<HTMLElement | null>(null);
  const [elementPath, setElementPath] = useState<string | null>(null);
  // Store coordinates for backend persistence (would be used in a real API implementation)
  const [coordinates, setCoordinates] = useState<{x: number, y: number} | null>(null);
  const [feedback, setFeedback] = useState({
    title: '',
    description: '',
    priority: addToRoadmap ? '2' : 'medium' // Default priority based on list type
  });
  
  const widgetRef = useRef<HTMLDivElement>(null);
  
  // Position styles
  const positionClasses = {
    'bottom-right': 'bottom-20 right-4',
    'bottom-left': 'bottom-20 left-4',
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4'
  };
  
  // Handle element targeting mode
  useEffect(() => {
    if (!isTargeting) return;
    
    // Prevent widget from being targeted
    const widgetElement = widgetRef.current;
    
    const handleMouseOver = (e: MouseEvent) => {
      if (widgetElement && widgetElement.contains(e.target as Node)) return;
      
      // Highlight the element under cursor
      const element = e.target as HTMLElement;
      if (element !== hoveredElement) {
        // Remove highlight from previous element
        if (hoveredElement) {
          hoveredElement.style.outline = '';
        }
        
        // Add highlight to current element
        element.style.outline = '2px solid #3b82f6';
        element.style.outlineOffset = '2px';
        setHoveredElement(element);
      }
    };
    
    const handleClick = (e: MouseEvent) => {
      if (widgetElement && widgetElement.contains(e.target as Node)) return;
      
      e.preventDefault();
      e.stopPropagation();
      
      const element = e.target as HTMLElement;
      setSelectedElement(element);
      
      // Get element path
      setElementPath(getCssPath(element));
      
      // Get click coordinates
      setCoordinates({
        x: e.pageX,
        y: e.pageY
      });
      
      // Exit targeting mode
      setIsTargeting(false);
      
      // Remove highlights
      document.body.querySelectorAll('*').forEach(el => {
        (el as HTMLElement).style.outline = '';
        (el as HTMLElement).style.outlineOffset = '';
      });
      
      // Open the feedback form immediately after selection
      setIsOpen(true);
      
      // Pre-fill title with element type
      const elementType = element.tagName.toLowerCase();
      setFeedback(prev => ({
        ...prev,
        title: `Feedback for ${elementType} element`
      }));
    };
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsTargeting(false);
        // Remove highlights
        document.body.querySelectorAll('*').forEach(el => {
          (el as HTMLElement).style.outline = '';
          (el as HTMLElement).style.outlineOffset = '';
        });
      }
    };
    
    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('click', handleClick, true);
    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('click', handleClick, true);
      document.removeEventListener('keydown', handleKeyDown);
      
      // Remove any lingering highlights
      document.body.querySelectorAll('*').forEach(el => {
        (el as HTMLElement).style.outline = '';
        (el as HTMLElement).style.outlineOffset = '';
      });
    };
  }, [isTargeting, hoveredElement]);
  
  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFeedback(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle select changes
  const handleSelectChange = (name: string, value: string) => {
    setFeedback(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!feedback.title || !feedback.description) {
      alert("Please fill in all required fields");
      return;
    }
    
    // Get current date
    const currentDate = new Date().toISOString().split('T')[0];
    
    // Create a new item based on whether it's roadmap or debug
    if (addToRoadmap) {
      // Create a roadmap item
      const newRoadmapItem = {
        id: `feedback-${Date.now()}`,
        title: feedback.title,
        description: feedback.description,
        status: 'planned',
        priority: parseInt(feedback.priority),
        category: 'ui',
        dependencies: []
      };
      
      // This would typically be an API call
      console.log('Adding to roadmap:', newRoadmapItem);
      
      // Call onFeedbackSubmitted with the new item
      if (onFeedbackSubmitted) {
        onFeedbackSubmitted(newRoadmapItem);
      }
    } else {
      // Create a debug item
      const newDebugItem = {
        id: `debug-feedback-${Date.now()}`,
        title: feedback.title,
        description: feedback.description,
        category: 'ui',
        status: 'identified',
        priority: feedback.priority as any,
        dateIdentified: currentDate,
        notes: `Element path: ${elementPath || 'Not specified'}`
      };
      
      // This would typically be an API call
      console.log('Adding to debug list:', newDebugItem);
      
      // Call onFeedbackSubmitted with the new item
      if (onFeedbackSubmitted) {
        onFeedbackSubmitted(newDebugItem);
      }
    }
    
    // Reset form
    setFeedback({
      title: '',
      description: '',
      priority: addToRoadmap ? '2' : 'medium'
    });
    setSelectedElement(null);
    setElementPath(null);
    setCoordinates(null);
    setIsOpen(false);
  };
  
  // Start targeting mode
  const startTargeting = () => {
    setIsTargeting(true);
    setIsOpen(false);
  };
  
  // Cancel targeting
  const cancelTargeting = () => {
    setIsTargeting(false);
    setSelectedElement(null);
    setElementPath(null);
    setCoordinates(null);
  };
  
  return (
    <div ref={widgetRef} className={`fixed z-50 ${positionClasses[position]}`}>
      {isTargeting && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center">
          <div className="bg-white rounded-lg p-4 max-w-[95vw] w-auto mx-2 shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Select an element</h2>
              <button 
                onClick={cancelTargeting}
                className="text-gray-500 hover:text-gray-700"
                aria-label="Cancel selection"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <p className="text-sm text-gray-500 mb-4">
              Click on any element on the page to provide feedback for it.
              Press ESC to cancel.
            </p>
          </div>
        </div>
      )}
      
      {isOpen && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg p-4 w-80 shadow-lg border border-gray-200 z-50 max-h-[80vh] overflow-y-auto max-w-[95vw] mx-auto my-2">
          <div className="flex justify-between items-center mb-4 sticky top-0 bg-white pb-2 border-b border-gray-100">
            <h3 className="font-medium">Submit Feedback</h3>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-gray-500 hover:text-gray-700"
              aria-label="Close feedback form"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="title">Title</label>
              <input
                id="title"
                name="title"
                value={feedback.title}
                onChange={handleInputChange}
                placeholder="Brief description of the issue"
                required
                className="w-full border border-gray-300 rounded-md p-2 text-sm"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                value={feedback.description}
                onChange={handleInputChange}
                placeholder="Detailed explanation of the feedback"
                required
                rows={4}
                className="w-full border border-gray-300 rounded-md p-2 text-sm"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="priority">Priority</label>
              <select
                id="priority"
                name="priority"
                value={feedback.priority}
                onChange={(e) => handleSelectChange('priority', e.target.value)}
                className="w-full border border-gray-300 rounded-md p-2 text-sm"
              >
                {addToRoadmap ? (
                  <>
                    <option value="1">Highest (1)</option>
                    <option value="2">High (2)</option>
                    <option value="3">Medium (3)</option>
                    <option value="4">Low (4)</option>
                    <option value="5">Lowest (5)</option>
                  </>
                ) : (
                  <>
                    <option value="critical">Critical</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                    <option value="very-low">Very Low</option>
                  </>
                )}
              </select>
            </div>
            
            <div className="pt-2">
              <button
                type="button"
                className="w-full mb-2 flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                onClick={startTargeting}
              >
                <Target className="h-4 w-4 mr-2" />
                Select Element
              </button>
              
              {selectedElement && (
                <div className="text-xs bg-gray-100 p-2 rounded mb-2 overflow-hidden">
                  <div className="font-medium mb-1">Selected Element:</div>
                  <div className="truncate">{elementPath}</div>
                </div>
              )}
              
              <button 
                type="submit"
                className="w-full flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                Submit Feedback
              </button>
            </div>
          </form>
        </div>
      )}
      
      {!isOpen && !isTargeting && (
        <button
          onClick={() => quickMode ? startTargeting() : setIsOpen(true)}
          className="rounded-full h-12 w-12 bg-blue-600 text-white shadow-lg flex items-center justify-center hover:bg-blue-700"
          aria-label={quickMode ? "Click to select an element" : "Open feedback form"}
          title={quickMode ? "Click to select an element for feedback" : "Open feedback form"}
        >
          <MessageSquare className="h-5 w-5" />
        </button>
      )}
    </div>
  );
};

export default FeedbackWidget;