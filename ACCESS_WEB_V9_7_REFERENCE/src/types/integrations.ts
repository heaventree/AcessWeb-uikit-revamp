/**
 * Integration Types
 * 
 * This file contains type definitions for the API integrations.
 */

/**
 * Common Types
 */

// Accessibility Issue Level
export type AccessibilityLevel = 'A' | 'AA' | 'AAA';

// Accessibility Issue Impact
export type AccessibilityImpact = 'critical' | 'serious' | 'moderate' | 'minor';

// Accessibility Issue Status
export type AccessibilityIssueStatus = 'new' | 'existing' | 'fixed' | 'false-positive' | 'ignored';

// Scan Status
export type ScanStatus = 'pending' | 'running' | 'completed' | 'failed';

/**
 * Base API Response
 */
export interface ApiResponse {
  success: boolean;
  message?: string;
  data?: any;
}

/**
 * WordPress Integration
 */
export interface WordPressSettings {
  siteUrl: string;
  apiKey: string;
  autofixEnabled?: boolean;
  monitoringEnabled?: boolean;
  monitoringInterval?: number; // in minutes
  scanLevel?: AccessibilityLevel;
  notifyOnIssue?: boolean;
  emailNotifications?: string[];
}

export interface WordPressPluginResponse extends ApiResponse {
  data?: {
    scan_id?: string;
    scan?: any;
    fixed?: boolean;
  };
}

/**
 * Shopify Integration
 */
export interface ShopifySettings {
  shopDomain: string;
  accessToken: string;
  currentThemeId?: string;
  createBackups?: boolean;
  autofixEnabled?: boolean;
  scanLevel?: AccessibilityLevel;
  notifyOnIssue?: boolean;
  emailNotifications?: string[];
}

export interface ShopifyAppResponse extends ApiResponse {
  data?: {
    scan_id?: string;
    scan?: any;
    fixed?: boolean;
    backup_theme_id?: string;
    backups?: {
      id: string;
      name: string;
      created: string;
    }[];
  };
}

/**
 * Custom API Integration
 */
export interface CustomAPISettings {
  baseUrl: string;
  apiKey: string;
  autofixEnabled?: boolean;
  scanLevel?: AccessibilityLevel;
  maxConcurrentScans?: number;
}

export interface CustomAPIResponse extends ApiResponse {
  data?: {
    scan_id?: string;
    scan?: any;
    total_requests?: number;
    remaining_requests?: number;
    reset_at?: string;
    scans?: ScanResult[];
    total?: number;
    has_more?: boolean;
    webhook_id?: string;
    secret?: string;
    webhooks?: APIWebhook[];
  };
}

/**
 * Common Data Models
 */

// Accessibility Issue
export interface AccessibilityIssue {
  id: string;
  wcag: string; // e.g., "1.1.1"
  level: AccessibilityLevel;
  impact: AccessibilityImpact;
  element?: string;
  html?: string;
  message: string;
  context?: string;
  help?: string;
  helpUrl?: string;
  selector?: string;
  status: AccessibilityIssueStatus;
  occurrences?: number;
  pages?: string[];
}

// Scan Result
export interface ScanResult {
  id: string;
  url: string;
  startTime: string;
  endTime: string;
  status: ScanStatus;
  progress: number;
  summary?: {
    total: number;
    critical: number;
    serious: number;
    moderate: number;
    minor: number;
    fixed?: number;
    ignored?: number;
  };
  items?: AccessibilityIssue[];
}

// API Webhook
export interface APIWebhook {
  id: string;
  url: string;
  events: string[];
  secret: string;
  active: boolean;
  created: string;
  lastTriggered?: string;
  failureCount?: number;
}

// API Usage Stats
export interface APIUsageStats {
  period: 'day' | 'week' | 'month' | 'year';
  totalRequests: number;
  uniqueEndpoints: number;
  avgResponseTime: number;
  errorRate: number;
  rateLimit: number;
  requestsRemaining: number;
  resetTime: string;
  dataPoints: {
    timestamp: string;
    requests: number;
    errors?: number;
    avgResponseTime?: number;
  }[];
}