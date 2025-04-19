/**
 * Custom hook for managing feedback items
 */
import { useState, useEffect, useRef } from 'react';
import { FeedbackItem, FeedbackCategory } from '../types';
import { 
  getAllFeedbackItems, 
  saveFeedbackItems, 
  createFeedbackItem, 
  updateFeedbackItem, 
  deleteFeedbackItem,
  resetFeedbackItems
} from '../services/feedbackService';

export const useFeedbackItems = () => {
  const [feedbackItems, setFeedbackItems] = useState<FeedbackItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<FeedbackCategory>('debug');
  
  // Load feedback items on mount
  useEffect(() => {
    const items = getAllFeedbackItems();
    setFeedbackItems(items);
    
    // Listen for feedback updates from other components
    const handleFeedbackUpdated = () => {
      setFeedbackItems(getAllFeedbackItems());
    };
    
    window.addEventListener('feedbackItemsUpdated', handleFeedbackUpdated);
    window.addEventListener('feedbackCreated', handleFeedbackUpdated);
    window.addEventListener('feedbackUpdated', handleFeedbackUpdated);
    window.addEventListener('feedbackDeleted', handleFeedbackUpdated);
    window.addEventListener('feedbackReset', handleFeedbackUpdated);
    
    return () => {
      window.removeEventListener('feedbackItemsUpdated', handleFeedbackUpdated);
      window.removeEventListener('feedbackCreated', handleFeedbackUpdated);
      window.removeEventListener('feedbackUpdated', handleFeedbackUpdated);
      window.removeEventListener('feedbackDeleted', handleFeedbackUpdated);
      window.removeEventListener('feedbackReset', handleFeedbackUpdated);
    };
  }, []);
  
  // We don't need to save items on every change since we're already
  // handling specific actions (add, toggle, remove) with direct service calls
  // This prevents the circular update issue
  
  // Add a new feedback item
  const addFeedbackItem = (
    elementPath: string, 
    position: { x: number, y: number }, 
    comment: string
  ) => {
    const newItem = createFeedbackItem({
      elementPath,
      position,
      comment,
      category: selectedCategory
    });
    
    setFeedbackItems(prev => [...prev, newItem]);
    return newItem.id;
  };
  
  // Toggle the status of a feedback item (cycles through statuses)
  const toggleFeedbackStatus = (id: string) => {
    const item = feedbackItems.find(item => item.id === id);
    if (!item) return;
    
    const nextStatus = {
      pending: 'inProgress',
      inProgress: 'resolved',
      resolved: 'pending'
    }[item.status] as 'pending' | 'inProgress' | 'resolved';
    
    updateFeedbackItem({ id, status: nextStatus });
    
    setFeedbackItems(prev => 
      prev.map(item => 
        item.id === id ? { ...item, status: nextStatus } : item
      )
    );
  };
  
  // Delete a feedback item
  const removeFeedbackItem = (id: string) => {
    deleteFeedbackItem(id);
    setFeedbackItems(prev => prev.filter(item => item.id !== id));
  };
  
  // Reset all feedback
  const resetAllFeedback = () => {
    if (window.confirm('Are you sure you want to reset all feedback?')) {
      resetFeedbackItems();
      setFeedbackItems([]);
    }
  };
  
  return {
    feedbackItems,
    selectedCategory,
    setSelectedCategory,
    addFeedbackItem,
    toggleFeedbackStatus,
    removeFeedbackItem,
    resetAllFeedback
  };
};