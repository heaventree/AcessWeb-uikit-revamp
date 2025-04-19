import React, { useEffect } from 'react';
import { addToRoadmap, addToDebugList } from '../../services/feedbackService';
import SimpleFeedbackSystem from './SimpleFeedbackSystem';

// Import the proper types from the data files
import { FeatureStatus, RoadmapFeature } from '../../data/roadmapData';
import { DebugItemStatus, DebugItemCategory, DebugItemPriority } from '../../data/debugData';

/**
 * Container for the feedback system that syncs with backend storage
 */
const FeedbackContainer: React.FC = () => {
  // Listen for feedback items changes and sync with backend
  useEffect(() => {
    // Event listener for the SimpleFeedbackSystem custom event
    const handleFeedbackUpdated = (event: CustomEvent) => {
      const newItem = event.detail;
      if (newItem) {
        // Determine if it's roadmap or debug feedback
        if (newItem.category === 'roadmap') {
          // Convert status to proper FeatureStatus type
          let featureStatus: FeatureStatus = 'planned';
          if (newItem.status === 'resolved') featureStatus = 'completed';
          else if (newItem.status === 'inProgress') featureStatus = 'in-progress';
          
          // Format for roadmap with the correct types
          const roadmapItem: Omit<RoadmapFeature, 'id'> = {
            title: newItem.comment,
            description: `Element path: ${newItem.elementPath}`,
            status: featureStatus,
            priority: newItem.status === 'resolved' ? 3 : 
                     newItem.status === 'inProgress' ? 2 : 1,
            category: 'ui',
            dependencies: []
          };
          addToRoadmap(roadmapItem);
        } else {
          // Convert status to proper DebugItemStatus type
          let debugStatus: DebugItemStatus = 'identified';
          if (newItem.status === 'resolved') debugStatus = 'testing'; // Fixed from 'resolved' to valid value 'testing'
          else if (newItem.status === 'inProgress') debugStatus = 'in-progress';
          
          // Set priority correctly
          const priorityValue: DebugItemPriority = 
            newItem.status === 'resolved' ? 'low' : 
            newItem.status === 'inProgress' ? 'high' : 'critical';
          
          // Format for debug with correct types
          addToDebugList({
            title: newItem.comment,
            description: `Element path: ${newItem.elementPath}`,
            category: 'ui' as DebugItemCategory,
            status: debugStatus,
            priority: priorityValue,
            notes: `Coordinates: x=${newItem.position.x}, y=${newItem.position.y}`
          });
        }
      }
    };

    // Add event listener for feedback updates
    window.addEventListener('feedbackUpdated', handleFeedbackUpdated as EventListener);

    return () => {
      window.removeEventListener('feedbackUpdated', handleFeedbackUpdated as EventListener);
    };
  }, []);

  return (
    <SimpleFeedbackSystem />
  );
};

export default FeedbackContainer;