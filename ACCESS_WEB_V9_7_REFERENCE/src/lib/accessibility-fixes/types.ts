/**
 * Types for the Non-Destructive Accessibility Fix System
 */

/**
 * CSS Property for a fix
 */
export interface CSSProperty {
  name: string;
  value: string;
}

/**
 * Payload for an accessibility fix
 */
export interface FixPayload {
  id: string;                    // Unique identifier for the fix
  targetSelector: string;        // CSS selector targeting the element(s)
  cssProperties: CSSProperty[];  // CSS properties to apply
  wcagCriteria: string[];        // WCAG criteria addressed (e.g., "1.4.3")
  description: string;           // Human-readable description
  createdAt: string;             // ISO date when fix was created
  appliedAt?: string;            // ISO date when fix was applied
  revertedAt?: string;           // ISO date when fix was reverted (if applicable)
  metadata: Record<string, any>; // Additional metadata for tracking
}

/**
 * Result of applying a fix
 */
export interface ApplyResult {
  success: boolean;
  fixId?: string;
  error?: string;
}

/**
 * Result of reverting a fix
 */
export interface RevertResult {
  success: boolean;
  fixId?: string;
  error?: string;
}

/**
 * Result of validating a fix
 */
export interface ValidationResult {
  valid: boolean;
  issues?: string[];
}

/**
 * Base website interface for applying fixes
 */
export interface Website {
  id: string;
  name: string;
  url: string;
  platform: 'wordpress' | 'generic' | 'custom';
  metadata: Record<string, any>;
}

/**
 * WordPress specific website interface
 */
export interface WordPressSite extends Website {
  platform: 'wordpress';
  apiUrl: string;
  credentials: {
    username?: string;
    applicationPassword?: string;
    jwtToken?: string;
  };
}

/**
 * Interface for platform-specific implementations
 */
export interface PlatformImplementation {
  applyFix(site: Website, fix: FixPayload): Promise<ApplyResult>;
  revertFix(site: Website, fixId: string): Promise<RevertResult>;
  listAppliedFixes(site: Website): Promise<FixPayload[]>;
  getFixStatus(site: Website, fixId: string): Promise<FixStatus>;
}

/**
 * Status of a fix
 */
export enum FixStatus {
  NOT_APPLIED = 'not_applied',
  APPLIED = 'applied',
  REVERTED = 'reverted',
  PARTIALLY_APPLIED = 'partially_applied',
  ERROR = 'error',
}

/**
 * Core fix engine interface
 */
export interface AccessibilityFixEngine {
  generateFix(issue: AccessibilityIssue): FixPayload;
  validateFix(fix: FixPayload): ValidationResult;
  applyFix(site: Website, fix: FixPayload): Promise<ApplyResult>;
  revertFix(site: Website, fixId: string): Promise<RevertResult>;
  listAppliedFixes(site: Website): Promise<FixPayload[]>;
}

/**
 * Accessibility issue to be fixed
 */
export interface AccessibilityIssue {
  id: string;
  wcagCriteria: string[];
  description: string;
  element: {
    selector: string;
    tagName: string;
    attributes: Record<string, string>;
    computedStyles?: Record<string, string>;
  };
  severity: 'critical' | 'serious' | 'moderate' | 'minor';
  pageUrl: string;
  detectedAt: string;
}

/**
 * Fix template parameters
 */
export interface FixTemplateParams {
  selector: string;
  [key: string]: any;
}

/**
 * Fix template function type
 */
export type FixTemplateGenerator = (params: FixTemplateParams) => Partial<FixPayload>;

/**
 * Fix template definition
 */
export interface FixTemplate {
  name: string;
  description: string;
  wcagCriteria: string[];
  generateFix: FixTemplateGenerator;
}