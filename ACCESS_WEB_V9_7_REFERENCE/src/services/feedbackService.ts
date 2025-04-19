/**
 * Feedback Service
 * 
 * Handles integration between the feedback widget and data storage
 * Adds feedback items to the appropriate lists (roadmap or debug)
 */

import { roadmapFeatures, RoadmapFeature } from '../data/roadmapData';
import { debugItems, DebugItem } from '../data/debugData';

// In-memory storage for roadmap and debug data
// This would be replaced with proper API calls in a production environment
let _roadmapFeatures = [...roadmapFeatures];
let _debugItems = [...debugItems];

/**
 * Add a feedback item to the roadmap
 */
export function addToRoadmap(item: Omit<RoadmapFeature, 'id'> & { id?: string }): RoadmapFeature {
  const newItem: RoadmapFeature = {
    id: item.id || `feedback-${Date.now()}`,
    title: item.title,
    description: item.description,
    status: item.status || 'planned',
    priority: item.priority || 3,
    category: item.category || 'ui',
    dependencies: item.dependencies || []
  };
  
  _roadmapFeatures.push(newItem);
  
  // In a real implementation, this would be an API call
  console.log('Added to roadmap:', newItem);
  
  return newItem;
}

/**
 * Add a feedback item to the debug list
 */
export function addToDebugList(item: Omit<DebugItem, 'id' | 'dateIdentified'> & { id?: string, dateIdentified?: string }): DebugItem {
  const currentDate = new Date().toISOString().split('T')[0];
  
  const newItem: DebugItem = {
    id: item.id || `debug-feedback-${Date.now()}`,
    title: item.title,
    description: item.description,
    category: item.category || 'ui',
    status: item.status || 'identified',
    priority: item.priority || 'medium',
    dateIdentified: item.dateIdentified || currentDate,
    notes: item.notes
  };
  
  _debugItems.push(newItem);
  
  // In a real implementation, this would be an API call
  console.log('Added to debug list:', newItem);
  
  return newItem;
}

/**
 * Get all roadmap features
 */
export function getRoadmapFeatures(): RoadmapFeature[] {
  return _roadmapFeatures;
}

/**
 * Get all debug items
 */
export function getDebugItems(): DebugItem[] {
  return _debugItems;
}