/**
 * Responsive Design Analyzer
 * 
 * This utility analyzes HTML for responsive design patterns and mobile-friendliness
 * to ensure content is accessible on various device sizes as per WCAG requirements.
 * 
 * Incorporates both WCAG 2.1 and 2.2 standards for mobile accessibility.
 */

import type { AccessibilityIssue } from '../types';

interface ResponsiveAnalysisOptions {
  checkMetaViewport: boolean;
  checkMediaQueries: boolean;
  checkTouchTargets: boolean;
  checkFontSizes: boolean;
  checkResponsiveImages: boolean;
  checkOrientation: boolean;
  checkTextSpacing: boolean;
  checkReflow: boolean;
}

const defaultOptions: ResponsiveAnalysisOptions = {
  checkMetaViewport: true,
  checkMediaQueries: true,
  checkTouchTargets: true,
  checkFontSizes: true,
  checkResponsiveImages: true,
  checkOrientation: true,
  checkTextSpacing: true,
  checkReflow: true
};

/**
 * Analyzes HTML for responsive design and mobile-friendliness issues
 * based on WCAG 2.1 and 2.2 requirements for mobile accessibility
 */
export function analyzeResponsiveDesign(
  html: string,
  options: Partial<ResponsiveAnalysisOptions> = {}
): AccessibilityIssue[] {
  const issues: AccessibilityIssue[] = [];
  
  // Apply default options
  const opts = { ...defaultOptions, ...options };
  
  try {
    // Parse HTML string to a DOM
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    
    // Check viewport meta tag (crucial for mobile)
    if (opts.checkMetaViewport) {
      issues.push(...checkViewportMeta(doc));
    }
    
    // Check font sizes for readability (WCAG 1.4.4)
    if (opts.checkFontSizes) {
      issues.push(...checkFontSizes(doc));
    }
    
    // Check touch target sizes (WCAG 2.5.5 [AAA] and 2.5.8 [AA])
    if (opts.checkTouchTargets) {
      issues.push(...checkTouchTargets(doc));
    }
    
    // Check responsive images (relevant for WCAG 1.4.10 Reflow)
    if (opts.checkResponsiveImages) {
      issues.push(...checkResponsiveImages(doc));
    }
    
    // Check for media queries in stylesheets (essential for responsiveness)
    if (opts.checkMediaQueries) {
      issues.push(...checkMediaQueries(doc));
    }
    
    // Check for orientation restrictions (WCAG 1.3.4)
    if (opts.checkOrientation) {
      issues.push(...checkOrientationRestrictions(doc));
    }
    
    // Check for text spacing adaptability (WCAG 1.4.12)
    if (opts.checkTextSpacing) {
      issues.push(...checkTextSpacing(doc));
    }
    
    // Check for content reflow at 320px (WCAG 1.4.10)
    if (opts.checkReflow) {
      issues.push(...checkContentReflow(doc));
    }
    
    return issues;
  } catch (error) {
    console.error('Error analyzing responsive design:', error);
    return [{
      id: 'responsive-analysis-error',
      impact: 'moderate',
      description: 'An error occurred while analyzing responsive design patterns.',
      nodes: ['<div>Error analyzing responsive design</div>'],
      wcagCriteria: ['1.4.4', '1.4.10'],
      autoFixable: false
    }];
  }
}

/**
 * Checks if the page has a properly configured viewport meta tag
 */
function checkViewportMeta(doc: Document): AccessibilityIssue[] {
  const viewportMeta = doc.querySelector('meta[name="viewport"]');
  
  if (!viewportMeta) {
    return [{
      id: 'missing-viewport-meta',
      impact: 'serious',
      description: 'The page is missing a viewport meta tag, which is essential for proper mobile rendering.',
      nodes: ['<head>...</head>'],
      wcagCriteria: ['1.4.10'],
      autoFixable: true,
      fixSuggestion: 'Add a viewport meta tag to the <head> section of your HTML.',
      structureType: 'responsive',
      structureDetails: {
        elementType: 'meta',
        suggestedStructure: '<meta name="viewport" content="width=device-width, initial-scale=1.0">'
      }
    }];
  }
  
  const content = viewportMeta.getAttribute('content') || '';
  const issues: AccessibilityIssue[] = [];
  
  // Check for proper viewport configuration
  if (!content.includes('width=device-width')) {
    issues.push({
      id: 'improper-viewport-configuration',
      impact: 'moderate',
      description: 'The viewport meta tag is missing "width=device-width", which is needed for responsive design.',
      nodes: [viewportMeta.outerHTML],
      wcagCriteria: ['1.4.10'],
      autoFixable: true,
      fixSuggestion: 'Update the viewport meta tag to include width=device-width.',
      structureType: 'responsive',
      structureDetails: {
        elementType: 'meta',
        suggestedStructure: '<meta name="viewport" content="width=device-width, initial-scale=1.0">'
      }
    });
  }
  
  // Check for user-scalable=no, which prevents zooming (critical accessibility issue)
  if (content.includes('user-scalable=no') || content.includes('maximum-scale=1')) {
    issues.push({
      id: 'disabled-zoom',
      impact: 'critical',
      description: 'The page prevents zooming, which violates WCAG 1.4.4 (Resize Text) requirements and makes the content inaccessible to users with low vision.',
      nodes: [viewportMeta.outerHTML],
      wcagCriteria: ['1.4.4', '1.4.10'],
      autoFixable: true,
      fixSuggestion: 'Remove "user-scalable=no" and ensure maximum-scale is at least 5.0.',
      structureType: 'responsive',
      structureDetails: {
        elementType: 'meta',
        suggestedStructure: '<meta name="viewport" content="width=device-width, initial-scale=1.0">'
      }
    });
  }
  
  return issues;
}

/**
 * Checks for adequate touch target sizes (WCAG 2.5.5 AAA and 2.5.8 AA in WCAG 2.2)
 */
function checkTouchTargets(doc: Document): AccessibilityIssue[] {
  const issues: AccessibilityIssue[] = [];
  const recommendedTouchSize = 44; // 44px is the recommended minimum size (2.5.5 AAA)
  const minimumTouchSize = 24;    // 24px is the minimum size (2.5.8 AA in WCAG 2.2)
  
  // Find potentially small interactive elements
  const interactiveElements = doc.querySelectorAll('a, button, input[type="button"], input[type="submit"], input[type="reset"], input[type="checkbox"], input[type="radio"], select, [role="button"], [role="link"], [role="menuitem"], [role="checkbox"], [role="radio"], [role="tab"]');
  
  // Arrays to track elements of different size ranges
  const criticallySmallElements: Element[] = []; // Smaller than 24px (fails 2.5.8 AA)
  const moderatelySmallElements: Element[] = []; // Between 24px and 44px (fails 2.5.5 AAA but passes 2.5.8 AA)
  
  interactiveElements.forEach((el) => {
    const styles = window.getComputedStyle(el as Element);
    const width = parseInt(styles.width, 10);
    const height = parseInt(styles.height, 10);
    
    // Calculate effective sizes
    const effectiveWidth = width;
    const effectiveHeight = height;
    
    // Skip hidden elements
    if (styles.display === 'none' || styles.visibility === 'hidden' || styles.opacity === '0') {
      return;
    }
    
    // Check if the element is critically small (fails WCAG 2.5.8 AA)
    if ((effectiveWidth > 0 && effectiveWidth < minimumTouchSize) || 
        (effectiveHeight > 0 && effectiveHeight < minimumTouchSize)) {
      criticallySmallElements.push(el);
    } 
    // Check if element is moderately small (fails WCAG 2.5.5 AAA but passes 2.5.8 AA)
    else if ((effectiveWidth > 0 && effectiveWidth < recommendedTouchSize) || 
             (effectiveHeight > 0 && effectiveHeight < recommendedTouchSize)) {
      moderatelySmallElements.push(el);
    }
  });
  
  // Report critically small elements (fails WCAG 2.5.8 AA)
  if (criticallySmallElements.length > 0) {
    issues.push({
      id: 'critical-touch-target-size',
      impact: 'serious',
      description: `Found ${criticallySmallElements.length} interactive elements with touch targets smaller than 24×24 pixels, which fails WCAG 2.5.8 Target Size (Minimum) (AA).`,
      nodes: criticallySmallElements.slice(0, 3).map(el => (el as HTMLElement).outerHTML),
      wcagCriteria: ['2.5.8'],
      autoFixable: false,
      fixSuggestion: 'Ensure all interactive elements have a touch target size of at least 24×24 pixels, preferably 44×44 pixels for optimal usability.',
      structureType: 'responsive',
      structureDetails: {
        elementType: 'touch-target',
        suggestedStructure: `/* CSS example */
.button, a.nav-link {
  min-width: 24px; /* Minimum for WCAG 2.5.8 AA */
  min-height: 24px;
  /* Recommended size for WCAG 2.5.5 AAA */
  /* min-width: 44px; */
  /* min-height: 44px; */
  padding: 10px;
}`
      }
    });
  }
  
  // Report moderately small elements (fails WCAG 2.5.5 AAA but passes 2.5.8 AA)
  if (moderatelySmallElements.length > 0) {
    issues.push({
      id: 'moderate-touch-target-size',
      impact: 'moderate',
      description: `Found ${moderatelySmallElements.length} interactive elements with touch targets smaller than the recommended 44×44 pixels (WCAG 2.5.5 AAA), but larger than the minimum 24×24 pixels.`,
      nodes: moderatelySmallElements.slice(0, 3).map(el => (el as HTMLElement).outerHTML),
      wcagCriteria: ['2.5.5'],
      autoFixable: false,
      fixSuggestion: 'For enhanced accessibility, increase touch target sizes to at least 44×44 pixels.',
      structureType: 'responsive',
      structureDetails: {
        elementType: 'touch-target',
        suggestedStructure: `/* CSS example for optimal touch targets */
.button, a.nav-link {
  min-width: 44px;
  min-height: 44px;
  padding: 12px;
}`
      }
    });
  }
  
  return issues;
}

/**
 * Checks for responsive image usage
 */
function checkResponsiveImages(doc: Document): AccessibilityIssue[] {
  const issues: AccessibilityIssue[] = [];
  const images = doc.querySelectorAll('img');
  const nonResponsiveImages: Element[] = [];
  const largeImages: Element[] = [];
  
  images.forEach((img) => {
    const imgElement = img as HTMLImageElement;
    const styles = window.getComputedStyle(imgElement);
    
    // Skip hidden images
    if (styles.display === 'none' || styles.visibility === 'hidden') {
      return;
    }
    
    // Check if image has responsive attributes
    const hasSrcset = imgElement.hasAttribute('srcset');
    const hasSizes = imgElement.hasAttribute('sizes');
    const hasPictureParent = !!imgElement.closest('picture');
    
    // Check if image has responsive CSS
    const hasResponsiveCSS = styles.maxWidth === '100%' || 
                             styles.maxWidth.endsWith('%') || 
                             styles.width === '100%' || 
                             styles.width.endsWith('%');
    
    // Identify large, non-responsive images
    if (imgElement.naturalWidth > 600 && !hasSrcset && !hasPictureParent) {
      largeImages.push(imgElement);
    }
    
    // Identify all non-responsive images (no responsive attributes or CSS)
    if (!hasSrcset && !hasSizes && !hasPictureParent && !hasResponsiveCSS) {
      nonResponsiveImages.push(imgElement);
    }
  });
  
  // Report large, non-responsive images (more serious issue)
  if (largeImages.length > 0) {
    issues.push({
      id: 'large-non-responsive-images',
      impact: 'serious',
      description: `Found ${largeImages.length} large images (>600px width) that are not responsive, potentially causing horizontal scrolling or performance issues on mobile devices.`,
      nodes: largeImages.slice(0, 3).map(el => (el as HTMLElement).outerHTML),
      wcagCriteria: ['1.4.10'],
      autoFixable: false,
      fixSuggestion: 'Use responsive image techniques (srcset, sizes, picture element) for large images, and ensure images can scale with the viewport.',
      structureType: 'responsive',
      structureDetails: {
        elementType: 'image',
        suggestedStructure: `<!-- Option 1: Using srcset and sizes -->
<img srcset="image-320w.jpg 320w,
             image-480w.jpg 480w,
             image-800w.jpg 800w"
     sizes="(max-width: 320px) 280px,
            (max-width: 480px) 440px,
            800px"
     src="image-800w.jpg" alt="Description of image">

<!-- Option 2: Using picture element -->
<picture>
  <source media="(max-width: 480px)" srcset="image-small.jpg">
  <source media="(max-width: 800px)" srcset="image-medium.jpg">
  <img src="image-large.jpg" alt="Description of image">
</picture>

<!-- Option 3: Simple responsive CSS -->
<img src="image.jpg" alt="Description" style="max-width: 100%; height: auto;">`
      }
    });
  }
  // Report other non-responsive images if no large images were found
  else if (nonResponsiveImages.length > 0) {
    issues.push({
      id: 'non-responsive-images',
      impact: 'moderate',
      description: `Found ${nonResponsiveImages.length} images without responsive attributes or CSS, which may not adapt properly to different viewport sizes.`,
      nodes: nonResponsiveImages.slice(0, 3).map(el => (el as HTMLElement).outerHTML),
      wcagCriteria: ['1.4.10'],
      autoFixable: false,
      fixSuggestion: 'Apply responsive image techniques or at minimum add "max-width: 100%; height: auto;" CSS to images.',
      structureType: 'responsive',
      structureDetails: {
        elementType: 'image',
        suggestedStructure: `<img src="image.jpg" alt="Description" style="max-width: 100%; height: auto;">`
      }
    });
  }
  
  return issues;
}

/**
 * Checks for adequate font sizes and if text is readable on mobile
 */
function checkFontSizes(doc: Document): AccessibilityIssue[] {
  const issues: AccessibilityIssue[] = [];
  const bodyStyle = window.getComputedStyle(doc.body);
  const bodyFontSize = parseInt(bodyStyle.fontSize, 10);
  
  // Check body font size (should generally be at least 16px for readability)
  if (bodyFontSize < 16) {
    issues.push({
      id: 'small-base-font-size',
      impact: 'moderate',
      description: `The base font size is ${bodyFontSize}px, which may be too small for comfortable reading on mobile devices and could violate WCAG 1.4.4 (Resize Text).`,
      nodes: ['<body style="font-size: ' + bodyFontSize + 'px">...</body>'],
      wcagCriteria: ['1.4.4'],
      autoFixable: false,
      fixSuggestion: 'Increase the base font size to at least 16px for better readability.',
      structureType: 'responsive',
      structureDetails: {
        elementType: 'font-size',
        suggestedStructure: `body {
  font-size: 16px;
}

/* Or better, use relative units: */
body {
  font-size: 100%; /* This is typically 16px in most browsers */
}`
      }
    });
  }
  
  // Find text elements with very small font sizes
  const textElements = doc.querySelectorAll('p, span, li, a, div:not(:empty)');
  const smallTextElements: Element[] = [];
  
  textElements.forEach((el) => {
    const styles = window.getComputedStyle(el as Element);
    
    // Skip elements that don't contain direct text or are hidden
    if (!el.textContent?.trim() || 
        styles.display === 'none' || 
        styles.visibility === 'hidden' || 
        styles.opacity === '0') {
      return;
    }
    
    if (styles.fontSize) {
      const size = parseInt(styles.fontSize, 10);
      if (size < 12) { // 12px is generally considered the minimum readable size
        smallTextElements.push(el);
      }
    }
  });
  
  if (smallTextElements.length > 0) {
    issues.push({
      id: 'too-small-text',
      impact: 'serious',
      description: `Found ${smallTextElements.length} text elements with font sizes smaller than 12px, which may be difficult to read, especially on mobile devices.`,
      nodes: smallTextElements.slice(0, 3).map(el => (el as HTMLElement).outerHTML),
      wcagCriteria: ['1.4.4'],
      autoFixable: false,
      fixSuggestion: 'Increase the font size of small text to at least 12px, preferably 16px for body text. Use relative units (rem or em) instead of pixels for better user control.',
      structureType: 'responsive',
      structureDetails: {
        elementType: 'font-size',
        suggestedStructure: `/* Use relative units for better scaling */
p, li, span, div {
  font-size: 1rem; /* Equivalent to 16px at browser default */
}

.legal-text, .footnote {
  font-size: 0.875rem; /* Equivalent to 14px at browser default */
}`
      }
    });
  }
  
  return issues;
}

/**
 * Checks for media queries in stylesheets, essential for responsive design
 */
function checkMediaQueries(doc: Document): AccessibilityIssue[] {
  const issues: AccessibilityIssue[] = [];
  const styleSheets = Array.from(doc.styleSheets);
  let mediaQueriesFound = false;
  let mobileMediaQueryFound = false;
  
  try {
    // Check for media queries in stylesheets
    for (const sheet of styleSheets) {
      try {
        if (sheet.href && !sheet.href.startsWith(window.location.origin)) {
          // Skip external stylesheets for security reasons
          continue;
        }
        
        const rules = (sheet as CSSStyleSheet).cssRules;
        for (let i = 0; i < rules.length; i++) {
          const rule = rules[i];
          if (rule instanceof CSSMediaRule) {
            mediaQueriesFound = true;
            
            // Check if there's a media query targeting mobile viewport sizes
            const mediaText = rule.media.mediaText.toLowerCase();
            if (mediaText.includes('max-width') && 
                (mediaText.includes('480px') || 
                 mediaText.includes('600px') || 
                 mediaText.includes('767px') || 
                 mediaText.includes('768px'))) {
              mobileMediaQueryFound = true;
            }
          }
        }
        
        if (mediaQueriesFound && mobileMediaQueryFound) break;
      } catch (e) {
        // Security error, likely from cross-origin stylesheet
        console.warn('Could not access rules in stylesheet', e);
      }
    }
  } catch (e) {
    console.error('Error checking for media queries:', e);
  }
  
  if (!mediaQueriesFound) {
    issues.push({
      id: 'no-media-queries',
      impact: 'serious',
      description: 'No media queries were detected in the stylesheets, which strongly suggests the page is not responsive and may not adapt well to different viewport sizes, violating WCAG 1.4.10 (Reflow).',
      nodes: ['<style>...</style>'],
      wcagCriteria: ['1.4.10'],
      autoFixable: false,
      fixSuggestion: 'Implement media queries in your CSS to adapt your layout for different viewport sizes.',
      structureType: 'responsive',
      structureDetails: {
        elementType: 'css',
        suggestedStructure: `/* Example media queries */
@media screen and (max-width: 768px) {
  /* Styles for tablets and smaller */
  .container {
    width: 100%;
    padding: 0 20px;
  }
  
  .nav {
    flex-direction: column;
  }
}

@media screen and (max-width: 480px) {
  /* Styles for mobile devices */
  .multi-column {
    display: block;
  }
  
  h1 {
    font-size: 1.8rem;
  }
}`
      }
    });
  } else if (!mobileMediaQueryFound) {
    issues.push({
      id: 'no-mobile-media-queries',
      impact: 'moderate',
      description: 'Media queries were found, but none specifically targeting mobile viewport sizes (≤768px). This may indicate incomplete responsive design implementation.',
      nodes: ['<style>...</style>'],
      wcagCriteria: ['1.4.10'],
      autoFixable: false,
      fixSuggestion: 'Add media queries specifically targeting mobile viewport sizes (e.g., max-width: 480px, max-width: 768px).',
      structureType: 'responsive',
      structureDetails: {
        elementType: 'css',
        suggestedStructure: `/* Mobile-specific media query */
@media screen and (max-width: 480px) {
  /* Mobile-specific styles */
  .container {
    padding: 0 10px;
  }
  .multi-column {
    display: block;
  }
}`
      }
    });
  }
  
  return issues;
}

/**
 * Checks for orientation restrictions (WCAG 1.3.4)
 */
function checkOrientationRestrictions(doc: Document): AccessibilityIssue[] {
  // Look for CSS that might restrict orientation
  const styleSheets = Array.from(doc.styleSheets);
  let orientationRestrictionFound = false;
  
  try {
    for (const sheet of styleSheets) {
      try {
        if (sheet.href && !sheet.href.startsWith(window.location.origin)) {
          continue; // Skip external stylesheets
        }
        
        const rules = (sheet as CSSStyleSheet).cssRules;
        for (let i = 0; i < rules.length; i++) {
          const rule = rules[i];
          if (rule instanceof CSSMediaRule) {
            const mediaText = rule.media.mediaText.toLowerCase();
            // Check for orientation-specific media queries that hide or severely alter content
            if ((mediaText.includes('orientation: portrait') || 
                 mediaText.includes('orientation: landscape')) && 
                rule.cssRules.length > 0) {
              
              // Check if the rule contains display: none or visibility: hidden
              for (let j = 0; j < rule.cssRules.length; j++) {
                const cssRule = rule.cssRules[j] as CSSStyleRule;
                if (cssRule.style && 
                    (cssRule.style.display === 'none' || 
                     cssRule.style.visibility === 'hidden' ||
                     cssRule.style.opacity === '0')) {
                  orientationRestrictionFound = true;
                  break;
                }
              }
            }
          }
          
          if (orientationRestrictionFound) break;
        }
        
        if (orientationRestrictionFound) break;
      } catch (e) {
        console.warn('Could not access rules in stylesheet', e);
      }
    }
  } catch (e) {
    console.error('Error checking for orientation restrictions:', e);
  }
  
  // Also look for scripts that might force orientation
  const scripts = doc.querySelectorAll('script');
  let orientationScriptFound = false;
  
  for (const script of Array.from(scripts)) {
    const scriptContent = script.textContent || '';
    if (scriptContent.includes('screen.orientation.lock') || 
        scriptContent.includes('lockOrientation') || 
        scriptContent.includes('orientation === "portrait"') || 
        scriptContent.includes('orientation === "landscape"')) {
      orientationScriptFound = true;
      break;
    }
  }
  
  if (orientationRestrictionFound || orientationScriptFound) {
    return [{
      id: 'orientation-restriction',
      impact: 'serious',
      description: 'Content appears to be restricted to a specific screen orientation (portrait or landscape), which violates WCAG 1.3.4 (Orientation) AA.',
      nodes: ['<body>...</body>'],
      wcagCriteria: ['1.3.4'],
      autoFixable: false,
      fixSuggestion: 'Ensure content is not restricted to a single orientation. Remove code that forces a specific orientation or hides content based on orientation.',
      structureType: 'responsive',
      structureDetails: {
        elementType: 'orientation',
        suggestedStructure: `/* Instead of hiding content based on orientation, adapt it */
@media (orientation: portrait) {
  .content {
    /* Adapt layout for portrait, but don't hide */
    flex-direction: column;
  }
}

@media (orientation: landscape) {
  .content {
    /* Adapt layout for landscape, but don't hide */
    flex-direction: row;
  }
}`
      }
    }];
  }
  
  return [];
}

/**
 * Checks for text spacing adaptability (WCAG 1.4.12)
 */
function checkTextSpacing(doc: Document): AccessibilityIssue[] {
  // Look for fixed height containers that might crop text
  const textContainers = doc.querySelectorAll('p, div, li, td, th, blockquote');
  const potentialIssues: Element[] = [];
  
  textContainers.forEach(container => {
    if (!container.textContent?.trim()) return; // Skip empty containers
    
    const styles = window.getComputedStyle(container as Element);
    
    // Skip hidden elements
    if (styles.display === 'none' || styles.visibility === 'hidden') {
      return;
    }
    
    // Check for fixed heights with overflow hidden
    if (styles.height && 
        !styles.height.includes('%') && 
        !styles.height.includes('auto') && 
        styles.overflow === 'hidden') {
      potentialIssues.push(container);
    }
    
    // Check for elements with line-height set in px instead of relative units
    if (styles.lineHeight && 
        (styles.lineHeight.includes('px') || 
         (!styles.lineHeight.includes('em') && 
          !styles.lineHeight.includes('rem') && 
          !styles.lineHeight.includes('%')))) {
      potentialIssues.push(container);
    }
  });
  
  if (potentialIssues.length > 0) {
    return [{
      id: 'text-spacing-issues',
      impact: 'moderate',
      description: `Found ${potentialIssues.length} elements that may have issues with text spacing adaptability (fixed heights with overflow hidden or fixed line heights), potentially violating WCAG 1.4.12 (Text Spacing) AA.`,
      nodes: potentialIssues.slice(0, 3).map(el => (el as HTMLElement).outerHTML),
      wcagCriteria: ['1.4.12'],
      autoFixable: false,
      fixSuggestion: 'Use relative units for line heights and avoid fixed-height containers with overflow: hidden for text content. Ensure content can adapt to increased text spacing without loss of content or functionality.',
      structureType: 'responsive',
      structureDetails: {
        elementType: 'text-spacing',
        suggestedStructure: `/* Recommended CSS for text containers */
p, div, li {
  /* Use relative units for line height */
  line-height: 1.5;
  
  /* Avoid fixed heights for text containers */
  min-height: [value]px; /* If needed */
  height: auto;
  
  /* If overflow control is needed, allow scrolling rather than hiding */
  max-height: [value]px; /* If needed */
  overflow-y: auto; /* Instead of hidden */
}`
      }
    }];
  }
  
  return [];
}

/**
 * Checks for content reflow at 320px (WCAG 1.4.10)
 */
function checkContentReflow(doc: Document): AccessibilityIssue[] {
  // Look for elements with fixed widths that may cause horizontal scrolling
  const allElements = doc.querySelectorAll('*');
  const potentialIssues: Element[] = [];
  
  // Check for elements with fixed widths greater than 320px
  allElements.forEach(el => {
    const styles = window.getComputedStyle(el as Element);
    
    // Skip elements that are hidden or have no dimensions
    if (styles.display === 'none' || 
        styles.visibility === 'hidden' || 
        !styles.width || 
        styles.width === 'auto' || 
        styles.width === '0px') {
      return;
    }
    
    // Check for fixed width greater than 320px
    const width = parseInt(styles.width, 10);
    if (width > 320 && 
        !styles.width.includes('%') && 
        !styles.width.includes('vw') && 
        !styles.maxWidth.includes('%') && 
        !styles.maxWidth.includes('vw') && 
        styles.position !== 'absolute' && 
        styles.position !== 'fixed') {
      potentialIssues.push(el);
    }
    
    // Check for min-width that could force horizontal scrolling
    if (styles.minWidth && 
        !styles.minWidth.includes('%') && 
        !styles.minWidth.includes('vw') && 
        parseInt(styles.minWidth, 10) > 320) {
      potentialIssues.push(el);
    }
  });
  
  // Check for tables without responsive handling
  const tables = doc.querySelectorAll('table');
  tables.forEach(table => {
    const styles = window.getComputedStyle(table);
    if (!styles.overflow.includes('auto') && 
        !styles.maxWidth.includes('%') && 
        !styles.maxWidth.includes('vw')) {
      potentialIssues.push(table);
    }
  });
  
  if (potentialIssues.length > 0) {
    return [{
      id: 'reflow-issues',
      impact: 'serious', 
      description: `Found ${potentialIssues.length} elements with fixed widths greater than 320px that may cause horizontal scrolling on small viewports, violating WCAG 1.4.10 (Reflow) AA.`,
      nodes: potentialIssues.slice(0, 3).map(el => (el as HTMLElement).outerHTML),
      wcagCriteria: ['1.4.10'],
      autoFixable: false,
      fixSuggestion: 'Use responsive design techniques. Replace fixed-width elements with fluid widths (%, vw) or add max-width: 100% to prevent content from exceeding viewport width.',
      structureType: 'responsive',
      structureDetails: {
        elementType: 'reflow',
        suggestedStructure: `/* Make elements responsive */
.container, .content, div, table {
  max-width: 100%;
  width: auto; /* or use percentage width */
}

/* For tables, add horizontal scrolling if needed */
.table-container {
  width: 100%;
  overflow-x: auto;
}

/* Use CSS Grid or Flexbox for responsive layouts */
.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}`
      }
    }];
  }
  
  return [];
}