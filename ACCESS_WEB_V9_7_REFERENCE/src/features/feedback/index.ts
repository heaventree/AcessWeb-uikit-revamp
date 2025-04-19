/**
 * Feedback System Module
 * 
 * This file serves as the main entry point for the feedback system feature.
 * It exports all the components, hooks, types, and services that make up the feedback system.
 */

// Export components
export { default as FeedbackContainer } from './components/FeedbackContainer';
export { default as FeedbackSystem } from './components/FeedbackSystem';

// Export hooks
export { useFeedbackItems } from './hooks/useFeedbackItems';

// Export types
export * from './types';

// Export services
export * from './services/feedbackService';

// Export utils
export * from './utils/domUtils';