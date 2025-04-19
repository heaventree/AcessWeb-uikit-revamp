import React, { useEffect } from 'react';
import FeedbackSystem from './FeedbackSystem';

/**
 * FeedbackContainer
 * 
 * Top-level container for the feedback system.
 * Handles initialization and lifecycle events.
 */
const FeedbackContainer: React.FC = () => {
  // Listen for feedback events
  useEffect(() => {
    // Handle feedback update events (can be used to sync with backend)
    const handleFeedbackUpdated = (event: CustomEvent) => {
      console.log('Feedback updated:', event.detail);
      // Here you could implement backend sync logic
    };
    
    // Add event listeners for feedback-related events
    window.addEventListener('feedbackUpdated', handleFeedbackUpdated as EventListener);
    
    return () => {
      // Clean up event listeners
      window.removeEventListener('feedbackUpdated', handleFeedbackUpdated as EventListener);
    };
  }, []);
  
  // Render the feedback system
  return <FeedbackSystem />;
};

export default FeedbackContainer;