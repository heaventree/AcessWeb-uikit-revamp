/**
 * Feedback System Types
 * This file contains type definitions for the feedback system.
 */

// Position coordinates for feedback placement
export interface Position {
  x: number;
  y: number;
}

// Feedback item status type
export type FeedbackStatus = 'pending' | 'inProgress' | 'resolved';

// Feedback item category type
export type FeedbackCategory = 'debug' | 'roadmap';

// Feedback item structure
export interface FeedbackItem {
  id: string;
  position: Position;
  elementPath: string;
  comment: string;
  status: FeedbackStatus;
  createdAt: string;
  category: FeedbackCategory;
  page: string; // The page URL path where the feedback was created
  updatedAt?: string;
  assignedTo?: string;
}

// Feedback creation payload
export interface CreateFeedbackPayload {
  elementPath: string;
  position: Position;
  comment: string;
  category: FeedbackCategory;
  page: string; // The page URL path where the feedback was created
}

// Feedback update payload
export interface UpdateFeedbackPayload {
  id: string;
  status?: FeedbackStatus;
  comment?: string;
  assignedTo?: string;
}