/**
 * Common Accessibility Fix Samples
 * 
 * This file provides ready-to-use fix samples for common WCAG issues.
 * These samples can be directly applied to websites or used as templates.
 */

import { FixPayload } from '../types';
import { v4 as uuidv4 } from 'uuid';

/**
 * Generate a unique ID for a fix
 */
function generateFixId(): string {
  return `fix-${uuidv4()}`;
}

/**
 * Create a timestamp for the current time
 */
function generateTimestamp(): string {
  return new Date().toISOString();
}

/**
 * Common Accessibility Fixes
 */
export const commonFixes = {
  /**
   * Fix low contrast text
   */
  textContrast: (selector: string = 'p, h1, h2, h3, h4, h5, h6'): FixPayload => ({
    id: generateFixId(),
    targetSelector: selector,
    cssProperties: [
      { name: 'color', value: '#000000' }
    ],
    wcagCriteria: ['1.4.3'],
    description: 'Improves text contrast by setting text color to black',
    createdAt: generateTimestamp(),
    metadata: {}
  }),
  
  /**
   * Add focus indicators to interactive elements
   */
  focusIndicators: (selector: string = 'a, button, input, select, textarea, [tabindex]'): FixPayload => ({
    id: generateFixId(),
    targetSelector: `${selector}:focus`,
    cssProperties: [
      { name: 'outline', value: '3px solid #2196F3' },
      { name: 'outline-offset', value: '2px' }
    ],
    wcagCriteria: ['2.4.7'],
    description: 'Adds visible focus indicators for keyboard navigation',
    createdAt: generateTimestamp(),
    metadata: {}
  }),
  
  /**
   * Increase target size for interactive elements
   */
  increaseTargetSize: (selector: string = 'button, a.button, input[type="button"], input[type="submit"]'): FixPayload => ({
    id: generateFixId(),
    targetSelector: selector,
    cssProperties: [
      { name: 'min-width', value: '44px' },
      { name: 'min-height', value: '44px' },
      { name: 'padding', value: '10px' }
    ],
    wcagCriteria: ['2.5.8'],
    description: 'Increases target size for better touch accessibility',
    createdAt: generateTimestamp(),
    metadata: {}
  }),
  
  /**
   * Fix text spacing for readability
   */
  improveTextSpacing: (selector: string = '.content, article, main'): FixPayload => ({
    id: generateFixId(),
    targetSelector: selector,
    cssProperties: [
      { name: 'line-height', value: '1.5' },
      { name: 'letter-spacing', value: '0.12em' },
      { name: 'word-spacing', value: '0.16em' }
    ],
    wcagCriteria: ['1.4.12'],
    description: 'Improves text spacing for better readability',
    createdAt: generateTimestamp(),
    metadata: {}
  }),
  
  /**
   * Fix content reflow for small screens
   */
  contentReflow: (selector: string = 'table, img, iframe, div.wide'): FixPayload => ({
    id: generateFixId(),
    targetSelector: selector,
    cssProperties: [
      { name: 'max-width', value: '100%' },
      { name: 'height', value: 'auto' },
      { name: 'overflow', value: 'auto' }
    ],
    wcagCriteria: ['1.4.10'],
    description: 'Ensures content reflows properly on small screens',
    createdAt: generateTimestamp(),
    metadata: {}
  }),
  
  /**
   * Improve form field labels
   */
  formFieldLabels: (selector: string = 'label'): FixPayload => ({
    id: generateFixId(),
    targetSelector: selector,
    cssProperties: [
      { name: 'display', value: 'block' },
      { name: 'margin-bottom', value: '5px' },
      { name: 'font-weight', value: '500' }
    ],
    wcagCriteria: ['3.3.2'],
    description: 'Improves visibility of form field labels',
    createdAt: generateTimestamp(),
    metadata: {}
  }),
  
  /**
   * Skip to content link
   */
  skipToContentLink: (): FixPayload => ({
    id: generateFixId(),
    targetSelector: 'a.skip-to-content, a.skip-link',
    cssProperties: [
      { name: 'position', value: 'absolute' },
      { name: 'top', value: '5px' },
      { name: 'left', value: '5px' },
      { name: 'background', value: '#ffffff' },
      { name: 'padding', value: '10px' },
      { name: 'z-index', value: '9999' },
      { name: 'transition', value: 'transform 0.3s' },
      { name: 'transform', value: 'translateY(-100%)' }
    ],
    wcagCriteria: ['2.4.1'],
    description: 'Enhances skip to content link visibility on focus',
    createdAt: generateTimestamp(),
    metadata: {}
  }),
  
  /**
   * Skip to content link focus state
   */
  skipToContentLinkFocus: (): FixPayload => ({
    id: generateFixId(),
    targetSelector: 'a.skip-to-content:focus, a.skip-link:focus',
    cssProperties: [
      { name: 'transform', value: 'translateY(0)' }
    ],
    wcagCriteria: ['2.4.1'],
    description: 'Shows skip to content link when focused',
    createdAt: generateTimestamp(),
    metadata: {}
  }),
  
  /**
   * Improved error messages
   */
  errorMessages: (): FixPayload => ({
    id: generateFixId(),
    targetSelector: '.error, .form-error, .validation-error',
    cssProperties: [
      { name: 'color', value: '#d32f2f' },
      { name: 'font-weight', value: '500' },
      { name: 'padding', value: '5px' },
      { name: 'border-left', value: '3px solid #d32f2f' }
    ],
    wcagCriteria: ['3.3.1'],
    description: 'Enhances visibility of error messages',
    createdAt: generateTimestamp(),
    metadata: {}
  }),
  
  /**
   * Improved focus for form fields
   */
  formFieldFocus: (): FixPayload => ({
    id: generateFixId(),
    targetSelector: 'input:focus, select:focus, textarea:focus',
    cssProperties: [
      { name: 'border-color', value: '#2196F3' },
      { name: 'outline', value: 'none' },
      { name: 'box-shadow', value: '0 0 0 3px rgba(33, 150, 243, 0.3)' }
    ],
    wcagCriteria: ['2.4.7'],
    description: 'Enhances focus state for form fields',
    createdAt: generateTimestamp(),
    metadata: {}
  })
};