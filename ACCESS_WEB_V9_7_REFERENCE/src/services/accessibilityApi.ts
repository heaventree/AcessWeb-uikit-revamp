/**
 * Accessibility Testing API Service
 * 
 * Provides specialized endpoints for WCAG accessibility testing and analysis,
 * with secure error handling and data validation.
 */

import { apiClient } from '../utils/apiClient';
import { sanitizeObject, sanitizeUrl } from '../utils/sanitization';

// Base endpoints
const ACCESSIBILITY_ENDPOINTS = {
  TEST_URL: 'accessibility/test-url',
  TEST_HTML: 'accessibility/test-html',
  GET_REPORT: 'accessibility/report',
  LIST_REPORTS: 'accessibility/reports',
  DELETE_REPORT: 'accessibility/report',
  EXPORT_REPORT: 'accessibility/export',
  WCAG_GUIDELINES: 'accessibility/guidelines',
  REMEDIATION: 'accessibility/remediation'
};

/**
 * Accessibility test result interface
 */
export interface AccessibilityTestResult {
  id: string;
  url?: string;
  timestamp: string;
  score: number;
  issues: Array<{
    id: string;
    wcagGuideline: string;
    impact: 'critical' | 'serious' | 'moderate' | 'minor';
    type: string;
    message: string;
    context: string;
    selector: string;
    htmlCode: string;
    recommendation: string;
  }>;
  summary: {
    critical: number;
    serious: number;
    moderate: number;
    minor: number;
    total: number;
    passRate: number;
  };
}

/**
 * Remediation suggestion interface
 */
export interface RemediationSuggestion {
  issueId: string;
  original: string;
  suggested: string;
  explanation: string;
}

/**
 * WCAG guideline interface
 */
export interface WcagGuideline {
  id: string;
  number: string;
  name: string;
  description: string;
  level: 'A' | 'AA' | 'AAA';
  category: string;
  resources: Array<{
    title: string;
    url: string;
  }>;
}

/**
 * Test URL for accessibility issues
 * @param url URL to test
 * @param options Test options
 * @returns Accessibility test results
 */
export async function testUrl(
  url: string,
  options: {
    wcagLevel?: 'A' | 'AA' | 'AAA';
    includePdf?: boolean;
    includeScreenshots?: boolean;
    userAgent?: string;
    waitTime?: number;
  } = {}
): Promise<AccessibilityTestResult> {
  // Sanitize URL for security
  const sanitizedUrl = sanitizeUrl(url);
  
  if (!sanitizedUrl) {
    throw new Error('Invalid URL provided');
  }
  
  // Create payload with sanitized data
  const payload = sanitizeObject({
    url: sanitizedUrl,
    ...options
  });
  
  return apiClient.post<AccessibilityTestResult>(
    ACCESSIBILITY_ENDPOINTS.TEST_URL,
    payload
  );
}

/**
 * Test HTML content for accessibility issues
 * @param html HTML content to test
 * @param options Test options
 * @returns Accessibility test results
 */
export async function testHtml(
  html: string,
  options: {
    wcagLevel?: 'A' | 'AA' | 'AAA';
    baseUrl?: string;
  } = {}
): Promise<AccessibilityTestResult> {
  // Create payload with sanitized data
  const payload = sanitizeObject({
    html,
    baseUrl: options.baseUrl ? sanitizeUrl(options.baseUrl) : undefined,
    wcagLevel: options.wcagLevel
  });
  
  return apiClient.post<AccessibilityTestResult>(
    ACCESSIBILITY_ENDPOINTS.TEST_HTML,
    payload
  );
}

/**
 * Get details of a specific accessibility test report
 * @param reportId Report ID
 * @returns Accessibility test report
 */
export async function getReport(reportId: string): Promise<AccessibilityTestResult> {
  return apiClient.get<AccessibilityTestResult>(
    `${ACCESSIBILITY_ENDPOINTS.GET_REPORT}/${encodeURIComponent(reportId)}`
  );
}

/**
 * List all accessibility test reports
 * @param options List options
 * @returns List of accessibility test reports
 */
export async function listReports(
  options: {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortDir?: 'asc' | 'desc';
    filter?: Record<string, any>;
  } = {}
): Promise<{
  reports: AccessibilityTestResult[];
  total: number;
  page: number;
  limit: number;
}> {
  // Sanitize options
  const sanitizedOptions = sanitizeObject(options);
  
  // Build query string parameters
  const params = new URLSearchParams();
  
  if (sanitizedOptions.page) params.append('page', String(sanitizedOptions.page));
  if (sanitizedOptions.limit) params.append('limit', String(sanitizedOptions.limit));
  if (sanitizedOptions.sortBy) params.append('sortBy', sanitizedOptions.sortBy);
  if (sanitizedOptions.sortDir) params.append('sortDir', sanitizedOptions.sortDir);
  
  // Handle filters
  if (sanitizedOptions.filter) {
    Object.entries(sanitizedOptions.filter).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(`filter[${key}]`, String(value));
      }
    });
  }
  
  // Make request
  return apiClient.get<{
    reports: AccessibilityTestResult[];
    total: number;
    page: number;
    limit: number;
  }>(`${ACCESSIBILITY_ENDPOINTS.LIST_REPORTS}?${params.toString()}`);
}

/**
 * Delete an accessibility test report
 * @param reportId Report ID
 * @returns Success status
 */
export async function deleteReport(reportId: string): Promise<{
  success: boolean;
  message: string;
}> {
  return apiClient.delete<{
    success: boolean;
    message: string;
  }>(`${ACCESSIBILITY_ENDPOINTS.DELETE_REPORT}/${encodeURIComponent(reportId)}`);
}

/**
 * Export an accessibility test report
 * @param reportId Report ID
 * @param format Export format
 * @returns Exported report data or download URL
 */
export async function exportReport(
  reportId: string,
  format: 'pdf' | 'csv' | 'json' | 'html'
): Promise<Blob | { downloadUrl: string }> {
  const response = await apiClient.get<Blob | { downloadUrl: string }>(
    `${ACCESSIBILITY_ENDPOINTS.EXPORT_REPORT}/${encodeURIComponent(reportId)}/${format}`
  );
  
  return response;
}

/**
 * Get WCAG guidelines information
 * @param guidelineId Optional specific guideline ID
 * @returns WCAG guidelines information
 */
export async function getWcagGuidelines(
  guidelineId?: string
): Promise<WcagGuideline | WcagGuideline[]> {
  const endpoint = guidelineId
    ? `${ACCESSIBILITY_ENDPOINTS.WCAG_GUIDELINES}/${encodeURIComponent(guidelineId)}`
    : ACCESSIBILITY_ENDPOINTS.WCAG_GUIDELINES;
  
  return apiClient.get<WcagGuideline | WcagGuideline[]>(endpoint);
}

/**
 * Get remediation suggestions for an accessibility issue
 * @param issueId Issue ID
 * @param html HTML context
 * @returns Remediation suggestions
 */
export async function getRemediationSuggestions(
  issueId: string,
  html: string
): Promise<RemediationSuggestion[]> {
  return apiClient.post<RemediationSuggestion[]>(
    `${ACCESSIBILITY_ENDPOINTS.REMEDIATION}/${encodeURIComponent(issueId)}`,
    {
      html
    }
  );
}

export default {
  testUrl,
  testHtml,
  getReport,
  listReports,
  deleteReport,
  exportReport,
  getWcagGuidelines,
  getRemediationSuggestions
};