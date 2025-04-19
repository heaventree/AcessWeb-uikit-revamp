/**
 * Non-Destructive Accessibility Fix System
 * 
 * This module provides functionality for generating, applying, and managing
 * non-destructive accessibility fixes for websites, with a focus on WordPress sites.
 */

// Export types
export * from './types';

// Export core fix engine
export { FixEngine } from './fix-engine';

// Export fix templates
export { wcagFixTemplates } from './fix-templates';

// Export platform implementations
export {
  getPlatformImplementation,
  WordPressImplementation,
  GenericImplementation
} from './platform-implementations';

// Export sample fixes
export { commonFixes } from './samples/common-fixes';

// Create and export a singleton instance of the fix engine
import { FixEngine } from './fix-engine';
export const fixEngine = new FixEngine();