import { User } from './auth';

export interface EmailVerification {
  email: string;
  code: string;
  expiresAt: string;
}

export interface WCAGInfo {
  description: string;
  successCriteria: string;
  suggestedFix: string;
  codeExample?: string;
}

export interface Requirement {
  id: string;
  description: string;
  disabilitiesAffected: ('Blind' | 'Hearing' | 'Mobility')[];
  standard: {
    name: string;
    level: 'A' | 'AA' | 'AAA';
  };
}

export interface Package {
  id: string;
  name: string;
  price: number;
  description: string;
  features: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  company: string;
  plan: string;
  status: 'active' | 'inactive' | 'pending';
  joinedDate: string;
  domains: string[];
  paymentMethod?: string;
  subscriptionId?: string;
}

export interface PaymentGateway {
  id: string;
  name: 'stripe' | 'paypal' | 'gocardless' | 'revolut';
  isActive: boolean;
  config: {
    mode: 'test' | 'live';
    apiKey?: string;
    secretKey?: string;
    clientId?: string;
    clientSecret?: string;
    webhookSecret?: string;
  };
  lastUpdated: string;
}

export interface PaymentTransaction {
  id: string;
  clientId: string;
  amount: number;
  status: 'completed' | 'failed' | 'pending' | 'refunded';
  date: string;
  planId: string;
  paymentMethod: string;
}

export interface Report {
  id: string;
  clientId: string;
  url: string;
  scanDate: string;
  issues: {
    critical: number;
    serious: number;
    moderate: number;
    minor: number;
  };
  status: 'completed' | 'in_progress' | 'failed';
}

export interface CMSPage {
  id: string;
  title: string;
  slug: string;
  content: string;
  lastModified: string;
  isPublished: boolean;
  meta: {
    description?: string;
    keywords?: string[];
  };
}

export interface AccessibilityIssue {
  id: string;
  impact: 'critical' | 'serious' | 'moderate' | 'minor';
  description: string;
  helpUrl?: string;
  nodes: string[];
  wcagCriteria: string[];
  url?: string;
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
  mediaType?: 'audio' | 'video' | 'embedded';
  mediaDetails?: {
    source?: string;
    duration?: number;
    hasCaptions?: boolean;
    hasTranscript?: boolean;
    hasAudioDescription?: boolean;
    hasAccessibleControls?: boolean;
    autoplay?: boolean;
    playerType?: string;
    format?: string;
    fileSize?: number;
    hasSignLanguage?: boolean;
    keyboardAccessible?: boolean;
  };
  structureType?: 'heading' | 'landmark' | 'semantic' | 'url' | 'navigation' | 'responsive';
  structureDetails?: {
    elementType?: string;
    expectedLevel?: number;
    actualLevel?: number;
    multipleH1s?: boolean;
    missingLandmark?: boolean;
    unSemanticElement?: string;
    urlIssues?: string[];
    readabilityScore?: 'good' | 'moderate' | 'poor';
    suggestedStructure?: string;
  };
}

export interface LegislationCompliance {
  ada: boolean;
  section508: boolean;
  aoda: boolean;
  en301549: boolean;
  eea: boolean;
  jis: boolean;
  dta: boolean;
  gds: boolean;
}

export interface TestResult {
  url: string;
  timestamp: string;
  issues: AccessibilityIssue[];
  passes: AccessibilityIssue[];
  warnings: AccessibilityIssue[];
  summary: {
    critical: number;
    serious: number;
    moderate: number;
    minor: number;
    passes: number;
    warnings: number;
    documentIssues?: number;
    pdfIssues?: number;
    mediaIssues?: number;
    audioIssues?: number;
    videoIssues?: number;
    structureIssues?: number;
    headingIssues?: number;
    semanticIssues?: number;
    urlIssues?: number;
  };
  legislationCompliance?: LegislationCompliance;
}

export interface MonitoringAlert {
  id: string;
  monitor_id: string;
  type: 'error' | 'warning' | 'info';
  message: string;
  data: any;
  acknowledged_at: string | null;
  created_at: string;
}

export interface SubscriptionFeature {
  id: string;
  subscription_id: string;
  feature_key: string;
  max_value: number | null;
  current_value: number;
  is_enabled: boolean;
  created_at: string;
  updated_at: string;
}

export interface SubscriptionUsage {
  id: string;
  subscription_id: string;
  feature_key: string;
  usage_count: number;
  usage_date: string;
  created_at: string;
  updated_at: string;
}

export interface LegislationMapping {
  criteria: string[];
  standards: {
    [key: string]: string[];
  };
}

// Direct imports are used instead of re-exporting