/**
 * WCAG Fix Templates Library
 * 
 * This module provides a collection of templates for common WCAG accessibility fixes.
 * Each template includes metadata and a function to generate a fix payload.
 */

import { CSSProperty, FixTemplate, FixTemplateParams } from './types';

/**
 * Collection of WCAG fix templates
 */
export const wcagFixTemplates: Record<string, FixTemplate> = {
  // 1.4.3 - Contrast (Minimum)
  contrastFix: {
    name: "Color Contrast Fix",
    description: "Improves text contrast ratio to meet WCAG AA requirements",
    wcagCriteria: ["1.4.3"],
    generateFix: (params: FixTemplateParams & {
      foregroundColor: string;
      backgroundColor?: string;
    }): any => {
      const cssProperties: CSSProperty[] = [
        { name: "color", value: params.foregroundColor }
      ];
      
      if (params.backgroundColor) {
        cssProperties.push({ name: "background-color", value: params.backgroundColor });
      }
      
      return {
        targetSelector: params.selector,
        cssProperties,
        description: `Improves text contrast ratio by setting text color to ${params.foregroundColor}`,
        wcagCriteria: ["1.4.3"]
      };
    }
  },
  
  // 1.4.6 - Contrast (Enhanced)
  enhancedContrastFix: {
    name: "Enhanced Color Contrast Fix",
    description: "Improves text contrast ratio to meet WCAG AAA requirements",
    wcagCriteria: ["1.4.6"],
    generateFix: (params: FixTemplateParams & {
      foregroundColor: string;
      backgroundColor?: string;
    }): any => {
      const cssProperties: CSSProperty[] = [
        { name: "color", value: params.foregroundColor }
      ];
      
      if (params.backgroundColor) {
        cssProperties.push({ name: "background-color", value: params.backgroundColor });
      }
      
      return {
        targetSelector: params.selector,
        cssProperties,
        description: `Improves text contrast ratio to AAA level by setting text color to ${params.foregroundColor}`,
        wcagCriteria: ["1.4.6"]
      };
    }
  },
  
  // 2.4.7 - Focus Visible
  focusIndicatorFix: {
    name: "Focus Indicator Fix",
    description: "Adds a visible focus indicator for keyboard navigation",
    wcagCriteria: ["2.4.7"],
    generateFix: (params: FixTemplateParams & {
      outlineColor?: string;
      outlineWidth?: string;
      outlineStyle?: string;
      outlineOffset?: string;
    }): any => {
      const color = params.outlineColor || "#2196F3";
      const width = params.outlineWidth || "3px";
      const style = params.outlineStyle || "solid";
      const offset = params.outlineOffset || "2px";
      
      return {
        targetSelector: `${params.selector}:focus`,
        cssProperties: [
          { name: "outline", value: `${width} ${style} ${color}` },
          { name: "outline-offset", value: offset }
        ],
        description: `Adds visible focus indicator with ${color} outline`,
        wcagCriteria: ["2.4.7"]
      };
    }
  },
  
  // 1.3.1 - Info and Relationships (Semantic Structure)
  semanticDisplayFix: {
    name: "Semantic Display Fix",
    description: "Improves semantic display of elements without changing HTML structure",
    wcagCriteria: ["1.3.1"],
    generateFix: (params: FixTemplateParams & {
      displayAs: "block" | "list-item" | "table" | "table-cell" | "flex" | "inline-block";
    }): any => {
      return {
        targetSelector: params.selector,
        cssProperties: [
          { name: "display", value: params.displayAs }
        ],
        description: `Changes display to ${params.displayAs} for proper semantic structure`,
        wcagCriteria: ["1.3.1"]
      };
    }
  },
  
  // 1.4.4 - Resize Text
  textResizeFix: {
    name: "Text Resize Fix",
    description: "Ensures text can be resized up to 200% without loss of content or function",
    wcagCriteria: ["1.4.4"],
    generateFix: (params: FixTemplateParams & {
      fontSize?: string;
      lineHeight?: string;
      maxWidth?: string;
    }): any => {
      const cssProperties: CSSProperty[] = [];
      
      if (params.fontSize) {
        cssProperties.push({ name: "font-size", value: params.fontSize });
      }
      
      if (params.lineHeight) {
        cssProperties.push({ name: "line-height", value: params.lineHeight });
      }
      
      if (params.maxWidth) {
        cssProperties.push({ name: "max-width", value: params.maxWidth });
      }
      
      return {
        targetSelector: params.selector,
        cssProperties,
        description: "Ensures text can be properly resized without breaking layout",
        wcagCriteria: ["1.4.4"]
      };
    }
  },
  
  // 2.5.8 - Target Size (Minimum) - New in WCAG 2.2
  targetSizeFix: {
    name: "Target Size Fix",
    description: "Increases interactive element size to meet minimum target size requirements",
    wcagCriteria: ["2.5.8"],
    generateFix: (params: FixTemplateParams & {
      minSize?: string;
      padding?: string;
    }): any => {
      const minSize = params.minSize || "44px";
      const padding = params.padding || "12px";
      
      return {
        targetSelector: params.selector,
        cssProperties: [
          { name: "min-width", value: minSize },
          { name: "min-height", value: minSize },
          { name: "padding", value: padding }
        ],
        description: `Increases interactive element size to at least ${minSize}`,
        wcagCriteria: ["2.5.8"]
      };
    }
  },
  
  // 1.4.10 - Reflow
  reflowFix: {
    name: "Reflow Fix",
    description: "Ensures content reflows properly on small screens without horizontal scrolling",
    wcagCriteria: ["1.4.10"],
    generateFix: (params: FixTemplateParams & {
      maxWidth?: string;
      boxSizing?: string;
    }): any => {
      return {
        targetSelector: params.selector,
        cssProperties: [
          { name: "max-width", value: params.maxWidth || "100%" },
          { name: "box-sizing", value: params.boxSizing || "border-box" },
          { name: "overflow-wrap", value: "break-word" },
          { name: "word-wrap", value: "break-word" }
        ],
        description: "Ensures content reflows properly for small screens without horizontal scrolling",
        wcagCriteria: ["1.4.10"]
      };
    }
  },
  
  // 1.4.11 - Non-Text Contrast
  nonTextContrastFix: {
    name: "Non-Text Contrast Fix",
    description: "Improves contrast for non-text elements like icons, buttons, and UI controls",
    wcagCriteria: ["1.4.11"],
    generateFix: (params: FixTemplateParams & {
      backgroundColor?: string;
      borderColor?: string;
      outlineColor?: string;
    }): any => {
      const cssProperties: CSSProperty[] = [];
      
      if (params.backgroundColor) {
        cssProperties.push({ name: "background-color", value: params.backgroundColor });
      }
      
      if (params.borderColor) {
        cssProperties.push({ name: "border-color", value: params.borderColor });
        cssProperties.push({ name: "border-width", value: "2px" });
        cssProperties.push({ name: "border-style", value: "solid" });
      }
      
      if (params.outlineColor) {
        cssProperties.push({ name: "outline", value: `2px solid ${params.outlineColor}` });
      }
      
      return {
        targetSelector: params.selector,
        cssProperties,
        description: "Improves contrast for non-text elements to meet WCAG requirements",
        wcagCriteria: ["1.4.11"]
      };
    }
  },
  
  // 1.4.12 - Text Spacing
  textSpacingFix: {
    name: "Text Spacing Fix",
    description: "Ensures proper text spacing for improved readability",
    wcagCriteria: ["1.4.12"],
    generateFix: (params: FixTemplateParams): any => {
      return {
        targetSelector: params.selector,
        cssProperties: [
          { name: "line-height", value: "1.5" },
          { name: "letter-spacing", value: "0.12em" },
          { name: "word-spacing", value: "0.16em" },
          { name: "padding-top", value: "0.5em" },
          { name: "padding-bottom", value: "0.5em" }
        ],
        description: "Adjusts text spacing to improve readability and meet WCAG requirements",
        wcagCriteria: ["1.4.12"]
      };
    }
  },
  
  // 2.4.3 - Focus Order
  focusOrderStyleFix: {
    name: "Focus Order Style Fix",
    description: "Applies visual styling to improve focus order perception",
    wcagCriteria: ["2.4.3"],
    generateFix: (params: FixTemplateParams & {
      focusOrderStyles?: boolean;
    }): any => {
      return {
        targetSelector: params.selector,
        cssProperties: [
          { name: "position", value: "relative" },
          { name: "z-index", value: "1" }
        ],
        description: "Applies styling to help with focus order perception",
        wcagCriteria: ["2.4.3"]
      };
    }
  },
  
  // 1.3.4 - Orientation
  orientationFix: {
    name: "Orientation Fix",
    description: "Ensures content works in both portrait and landscape orientations",
    wcagCriteria: ["1.3.4"],
    generateFix: (params: FixTemplateParams): any => {
      return {
        targetSelector: params.selector,
        cssProperties: [
          { name: "max-width", value: "100%" },
          { name: "height", value: "auto" },
          { name: "min-height", value: "auto" }
        ],
        description: "Makes content responsive to different screen orientations",
        wcagCriteria: ["1.3.4"]
      };
    }
  },
  
  // 2.5.5 - Target Size (Enhanced)
  enhancedTargetSizeFix: {
    name: "Enhanced Target Size Fix",
    description: "Increases target size for pointer inputs to enhanced level",
    wcagCriteria: ["2.5.5"],
    generateFix: (params: FixTemplateParams): any => {
      return {
        targetSelector: params.selector,
        cssProperties: [
          { name: "min-width", value: "44px" },
          { name: "min-height", value: "44px" },
          { name: "padding", value: "10px" },
          { name: "margin", value: "5px" }
        ],
        description: "Increases touch target size to at least 44px for better usability",
        wcagCriteria: ["2.5.5"]
      };
    }
  },
};