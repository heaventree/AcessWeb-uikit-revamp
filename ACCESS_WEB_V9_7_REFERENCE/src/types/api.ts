import type { LegislationCompliance } from './index';

export interface APIKey {
  id: string;
  user_id: string;
  name: string;
  key: string;
  scopes: string[];
  last_used?: string;
  expires_at?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface APILog {
  id: string;
  api_key_id: string;
  endpoint: string;
  method: string;
  status_code: number;
  response_time: number;
  created_at: string;
}

export interface Webhook {
  id: string;
  user_id: string;
  url: string;
  events: string[];
  secret: string;
  is_active: boolean;
  last_triggered?: string;
  created_at: string;
  updated_at: string;
}

export interface APIError {
  code: string;
  message: string;
  details?: unknown;
}

export interface AccessibilityTestRequest {
  url: string;
  region?: string;
  standards?: string[];
  options?: {
    waitForTimeout?: number;
    maxPages?: number;
    checkSubdomains?: boolean;
    excludePaths?: string[];
    documentTesting?: {
      enabled: boolean;
      pdfAccessibility?: boolean;
      officeDocuments?: boolean;
    };
  };
}

export interface AccessibilityTestResponse {
  id: string;
  url: string;
  timestamp: string;
  status: 'completed' | 'in_progress' | 'failed';
  summary: {
    critical: number;
    serious: number;
    moderate: number;
    minor: number;
    passes: number;
    warnings: number;
    documentIssues?: number;
    pdfIssues?: number;
  };
  legislationCompliance: LegislationCompliance;
  issues: Array<{
    id: string;
    impact: 'critical' | 'serious' | 'moderate' | 'minor';
    description: string;
    helpUrl?: string;
    nodes: string[];
    wcagCriteria: string[];
    autoFixable?: boolean;
    fixSuggestion?: string;
    codeExample?: string;
    legislationRefs?: string[];
    documentType?: 'pdf' | 'word' | 'excel' | 'powerpoint' | 'other';
    documentDetails?: {
      filename?: string;
      pageCount?: number;
      hasStructure?: boolean;
      hasTags?: boolean;
      hasAltText?: boolean;
      hasLanguage?: boolean;
      readingOrder?: boolean;
      bookmarks?: boolean;
      formAccessibility?: boolean;
    };
  }>;
}

export interface StandardsInfo {
  id: string;
  name: string;
  version: string;
  region: string;
  description: string;
  requirements: Array<{
    id: string;
    description: string;
    level: string;
    wcagMapping?: string[];
  }>;
}

export interface RegionalStandards {
  eu: StandardsInfo[];
  uk: StandardsInfo[];
  usa: StandardsInfo[];
  canada: StandardsInfo[];
  australia: StandardsInfo[];
  japan: StandardsInfo[];
  global: StandardsInfo[];
}