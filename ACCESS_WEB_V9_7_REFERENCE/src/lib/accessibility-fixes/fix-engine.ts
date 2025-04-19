/**
 * Core Accessibility Fix Engine
 * 
 * This module implements the core engine for generating, validating, applying, 
 * and reverting accessibility fixes in a non-destructive manner.
 */

import { v4 as uuidv4 } from 'uuid';
import { 
  AccessibilityFixEngine, 
  AccessibilityIssue, 
  ApplyResult, 
  FixPayload, 
  PlatformImplementation, 
  RevertResult, 
  ValidationResult, 
  Website 
} from './types';
import { wcagFixTemplates } from './fix-templates';
import { getPlatformImplementation } from './platform-implementations';

export class FixEngine implements AccessibilityFixEngine {
  /**
   * Generate a fix for an accessibility issue
   */
  generateFix(issue: AccessibilityIssue): FixPayload {
    // Identify which template to use based on WCAG criteria
    const applicableTemplates = this.findApplicableTemplates(issue);
    
    if (applicableTemplates.length === 0) {
      throw new Error(`No applicable fix template found for WCAG criteria: ${issue.wcagCriteria.join(', ')}`);
    }
    
    // Use the first matching template for now (future: could use more sophisticated selection)
    const templateName = applicableTemplates[0];
    const template = wcagFixTemplates[templateName];
    
    // Prepare template parameters based on the issue
    const params = this.prepareTemplateParams(issue);
    
    // Generate the fix using the template
    const partialFix = template.generateFix(params);
    
    // Create the complete fix payload
    const fixPayload: FixPayload = {
      id: `fix-${uuidv4()}`,
      targetSelector: partialFix.targetSelector || issue.element.selector,
      cssProperties: partialFix.cssProperties || [],
      wcagCriteria: partialFix.wcagCriteria || issue.wcagCriteria,
      description: partialFix.description || issue.description,
      createdAt: new Date().toISOString(),
      metadata: {
        issueId: issue.id,
        pageUrl: issue.pageUrl,
        severity: issue.severity,
        templateUsed: templateName,
        elementInfo: {
          tagName: issue.element.tagName,
          attributes: issue.element.attributes
        }
      }
    };
    
    return fixPayload;
  }
  
  /**
   * Validate a fix before applying it
   */
  validateFix(fix: FixPayload): ValidationResult {
    const issues: string[] = [];
    
    // Check for required fields
    if (!fix.targetSelector) {
      issues.push('Missing target selector');
    }
    
    if (!fix.cssProperties || fix.cssProperties.length === 0) {
      issues.push('No CSS properties specified');
    }
    
    if (!fix.wcagCriteria || fix.wcagCriteria.length === 0) {
      issues.push('No WCAG criteria specified');
    }
    
    // Validate CSS properties
    fix.cssProperties?.forEach(prop => {
      if (!prop.name || !prop.value) {
        issues.push(`Invalid CSS property: ${JSON.stringify(prop)}`);
      }
    });
    
    // Validate selector (basic check - more sophisticated validation would be added here)
    if (fix.targetSelector && (fix.targetSelector.includes('<') || fix.targetSelector.includes('>'))) {
      issues.push('Target selector contains potentially unsafe characters');
    }
    
    return {
      valid: issues.length === 0,
      issues: issues.length > 0 ? issues : undefined
    };
  }
  
  /**
   * Apply a fix to a website
   */
  async applyFix(site: Website, fix: FixPayload): Promise<ApplyResult> {
    // Validate the fix before applying
    const validation = this.validateFix(fix);
    if (!validation.valid) {
      return {
        success: false,
        error: `Fix validation failed: ${validation.issues?.join(', ')}`
      };
    }
    
    // Get the appropriate implementation for the website platform
    const implementation = getPlatformImplementation(site.platform);
    
    // Apply the fix using the platform-specific implementation
    try {
      // Set application timestamp
      const fixWithTimestamp: FixPayload = {
        ...fix,
        appliedAt: new Date().toISOString()
      };
      
      return await implementation.applyFix(site, fixWithTimestamp);
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error)
      };
    }
  }
  
  /**
   * Revert a previously applied fix
   */
  async revertFix(site: Website, fixId: string): Promise<RevertResult> {
    // Get the appropriate implementation for the website platform
    const implementation = getPlatformImplementation(site.platform);
    
    // Revert the fix using the platform-specific implementation
    try {
      return await implementation.revertFix(site, fixId);
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error)
      };
    }
  }
  
  /**
   * List all fixes applied to a website
   */
  async listAppliedFixes(site: Website): Promise<FixPayload[]> {
    // Get the appropriate implementation for the website platform
    const implementation = getPlatformImplementation(site.platform);
    
    // Get the list of applied fixes
    return await implementation.listAppliedFixes(site);
  }
  
  /**
   * Find templates applicable to the given accessibility issue
   */
  private findApplicableTemplates(issue: AccessibilityIssue): string[] {
    const applicableTemplates: string[] = [];
    
    for (const [templateName, template] of Object.entries(wcagFixTemplates)) {
      // Check if any of the template's criteria match the issue's criteria
      const hasMatchingCriteria = template.wcagCriteria.some(criteria => 
        issue.wcagCriteria.includes(criteria)
      );
      
      if (hasMatchingCriteria) {
        applicableTemplates.push(templateName);
      }
    }
    
    return applicableTemplates;
  }
  
  /**
   * Prepare parameters for the fix template based on the issue
   */
  private prepareTemplateParams(issue: AccessibilityIssue): any {
    // Base parameters that all templates need
    const params: any = {
      selector: issue.element.selector,
    };
    
    // Add computed styles if available
    if (issue.element.computedStyles) {
      params.computedStyles = issue.element.computedStyles;
    }
    
    // Add element info
    params.tagName = issue.element.tagName;
    params.attributes = issue.element.attributes;
    
    // Check for specific WCAG criteria and prepare relevant parameters
    
    // For contrast issues (1.4.3, 1.4.6)
    if (issue.wcagCriteria.some(c => ['1.4.3', '1.4.6'].includes(c))) {
      // If contrast-related info is in metadata, use it
      if (issue.element.computedStyles) {
        params.foregroundColor = this.suggestAccessibleColor(
          issue.element.computedStyles.color,
          issue.element.computedStyles.backgroundColor
        );
      } else {
        // Default fallback if no computed styles available
        params.foregroundColor = '#000000';
        params.backgroundColor = '#ffffff';
      }
    }
    
    // For focus visibility issues (2.4.7)
    if (issue.wcagCriteria.includes('2.4.7')) {
      params.outlineColor = '#2196F3';
      params.outlineWidth = '3px';
      params.outlineStyle = 'solid';
      params.outlineOffset = '2px';
    }
    
    // Add more criteria-specific parameter handling here
    
    return params;
  }
  
  /**
   * Suggest an accessible color with better contrast
   * This is a simplified implementation - a real one would use color contrast algorithms
   */
  private suggestAccessibleColor(currentColor: string, backgroundColor: string): string {
    // In a real implementation, this would analyze the current colors and suggest
    // a new color with sufficient contrast ratio.
    // For now, we'll return a safe high-contrast color
    return '#000000';
  }
}