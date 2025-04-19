/**
 * Feedback Service
 * This file contains the service methods for managing feedback items.
 */

import { FeedbackItem, CreateFeedbackPayload, UpdateFeedbackPayload } from '../types';

// Local storage key for feedback items
const STORAGE_KEY = 'feedbackItems';

/**
 * Get all feedback items from storage
 */
export const getAllFeedbackItems = (): FeedbackItem[] => {
  try {
    const items = localStorage.getItem(STORAGE_KEY);
    return items ? JSON.parse(items) : [];
  } catch (error) {
    console.error('Error getting feedback items:', error);
    return [];
  }
};

/**
 * Save all feedback items to storage
 */
export const saveFeedbackItems = (items: FeedbackItem[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    // Dispatch event for subscribers
    const event = new CustomEvent('feedbackItemsUpdated', { detail: items });
    window.dispatchEvent(event);
  } catch (error) {
    console.error('Error saving feedback items:', error);
  }
};

/**
 * Create a new feedback item
 */
export const createFeedbackItem = (payload: CreateFeedbackPayload): FeedbackItem => {
  const items = getAllFeedbackItems();
  
  const newItem: FeedbackItem = {
    id: `feedback-${Date.now()}`,
    position: payload.position,
    elementPath: payload.elementPath,
    comment: payload.comment,
    status: 'pending',
    createdAt: new Date().toISOString(),
    category: payload.category,
  };
  
  items.push(newItem);
  saveFeedbackItems(items);
  
  // Dispatch event for new item
  const event = new CustomEvent('feedbackCreated', { detail: newItem });
  window.dispatchEvent(event);
  
  return newItem;
};

/**
 * Update a feedback item
 */
export const updateFeedbackItem = (payload: UpdateFeedbackPayload): FeedbackItem | null => {
  const items = getAllFeedbackItems();
  const index = items.findIndex(item => item.id === payload.id);
  
  if (index === -1) return null;
  
  // Update the item
  const updatedItem: FeedbackItem = {
    ...items[index],
    ...(payload.status && { status: payload.status }),
    ...(payload.comment && { comment: payload.comment }),
    ...(payload.assignedTo && { assignedTo: payload.assignedTo }),
    updatedAt: new Date().toISOString(),
  };
  
  items[index] = updatedItem;
  saveFeedbackItems(items);
  
  // Dispatch event for updated item
  const event = new CustomEvent('feedbackUpdated', { detail: updatedItem });
  window.dispatchEvent(event);
  
  return updatedItem;
};

/**
 * Delete a feedback item
 */
export const deleteFeedbackItem = (id: string): boolean => {
  const items = getAllFeedbackItems();
  const newItems = items.filter(item => item.id !== id);
  
  if (newItems.length === items.length) return false;
  
  saveFeedbackItems(newItems);
  
  // Dispatch event for deleted item
  const event = new CustomEvent('feedbackDeleted', { detail: { id } });
  window.dispatchEvent(event);
  
  return true;
};

/**
 * Reset all feedback items
 */
export const resetFeedbackItems = (): void => {
  localStorage.removeItem(STORAGE_KEY);
  
  // Dispatch event for reset
  const event = new CustomEvent('feedbackReset');
  window.dispatchEvent(event);
};