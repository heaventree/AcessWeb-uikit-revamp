// Resource Link Types
export interface ResourceLink {
  id: string;
  title: string;
  url: string;
  description: string;
  relevance: number;
}

// Follow-up suggestion Types
export interface FollowUpSuggestion {
  text: string;
  description: string;
}

// Chat Message Types
export interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  resourceLinks?: ResourceLink[];
  followUpSuggestions?: FollowUpSuggestion[];
  isHighlighted?: boolean;
  isError?: boolean;
}

// Chat Session Types
export interface ChatSession {
  id: string;
  userId?: string;
  startTime: string;
  endTime?: string;
  messages: Message[];
  userRating?: number;
  feedback?: string;
  relatedResources?: ResourceLink[];
  topicSummary?: string;
}

// Analytics Types
export interface ChatStatistics {
  totalSessions: number;
  totalMessages: number;
  averageSessionLength: number;
  averageResponseTime: number;
  userSatisfactionScore: number;
  commonTopics: {
    topic: string;
    count: number;
  }[];
  dailyActivity: {
    date: string;
    sessions: number;
  }[];
  popularResources: {
    resourceId: string;
    title: string;
    views: number;
  }[];
  helpfulnessRatings: {
    rating: number;
    percentage: number;
  }[];
}

// Settings Types
export interface ChatSettings {
  greeting: string;
  enableAutoSuggestions: boolean;
  enableContentScanning: boolean;
  scanningFrequency: 'hourly' | 'daily' | 'weekly';
  aiModel: string;
  maxHistoryLength: number;
  autoLearningEnabled: boolean;
  followUpEnabled: boolean;
  showExpertTips: boolean;
}

// Training Data Types
export interface TrainingTopic {
  id: string;
  name: string;
  examples: string[];
  responses: string[];
  priority: number;
  relatedResources?: string[]; // IDs of related resources
  followUpSuggestions?: FollowUpSuggestion[];
}

// Content Audit Types
export interface ContentAuditResult {
  lastScan: string;
  scannedPages: number;
  extractedTopics: string[];
  newTopics: string[];
  contentGaps: {
    topic: string;
    confidence: number;
    suggestion: string;
  }[];
  resourceCoverage: {
    resourceId: string;
    title: string;
    coverageScore: number;
    gaps: string[];
  }[];
}