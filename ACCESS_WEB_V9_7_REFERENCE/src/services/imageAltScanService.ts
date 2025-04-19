/**
 * Image Alt Scan Service
 * 
 * This service provides functionality to scan images for missing, empty, or problematic 
 * alt text attributes. It's designed to help identify and fix WCAG 1.1.1 compliance issues
 * related to non-text content accessibility.
 */

import { v4 as uuidv4 } from 'uuid';

export interface ImageIssue {
  id: string;
  url: string;
  element: string;
  selector: string;
  issueType: 'missing' | 'empty' | 'redundant' | 'suspicious' | 'duplicate';
  impact: 'critical' | 'serious' | 'moderate' | 'minor';
  description: string;
  wcagCriteria: string;
  suggestedFix?: string;
  suggestedAlt?: string;
  fixed?: boolean;
}

export interface ScanResult {
  id: string;
  url: string;
  timestamp: number;
  totalImages: number;
  issuesFound: number;
  issues: ImageIssue[];
}

export interface ScanOptions {
  includeDuplicateCheck: boolean;
  includeRedundantCheck: boolean;
  includeSuspiciousCheck: boolean;
  redundantPatterns: string[];
  suspiciousPatterns: string[];
}

const defaultScanOptions: ScanOptions = {
  includeDuplicateCheck: true,
  includeRedundantCheck: true,
  includeSuspiciousCheck: true,
  redundantPatterns: ['image', 'picture', 'photo', 'icon', 'graphic', 'logo'],
  suspiciousPatterns: ['img', 'DSC', 'IMG', 'untitled', 'image']
};

/**
 * Scans a DOM for images with accessibility issues
 */
export const scanImagesInDOM = (dom: Document, options: Partial<ScanOptions> = {}): ScanResult => {
  // Merge with default options
  const scanOptions = {
    ...defaultScanOptions,
    ...options
  };
  
  const images = Array.from(dom.querySelectorAll('img'));
  const issues: ImageIssue[] = [];
  
  // Track duplicate image sources and alt text
  const imageSources = new Map<string, string[]>();
  
  images.forEach((img) => {
    const src = img.getAttribute('src') || '';
    const alt = img.getAttribute('alt');
    
    // Check for missing alt attribute
    if (alt === null) {
      issues.push({
        id: uuidv4(),
        url: src,
        element: img.outerHTML,
        selector: generateSelector(img),
        issueType: 'missing',
        impact: 'critical',
        description: 'Image is missing an alt attribute',
        wcagCriteria: 'WCAG 1.1.1 (A)',
        suggestedFix: 'Add an alt attribute that describes the image content',
        suggestedAlt: generateAltSuggestion(img, src),
        fixed: false
      });
    } 
    // Check for empty alt attribute (may be valid for decorative images)
    else if (alt === '' && !isLikelyDecorative(img)) {
      issues.push({
        id: uuidv4(),
        url: src,
        element: img.outerHTML,
        selector: generateSelector(img),
        issueType: 'empty',
        impact: 'serious',
        description: 'Image has an empty alt attribute but doesn\'t appear to be decorative',
        wcagCriteria: 'WCAG 1.1.1 (A)',
        suggestedFix: 'Add descriptive alt text or ensure image is truly decorative',
        suggestedAlt: generateAltSuggestion(img, src),
        fixed: false
      });
    } 
    // Check for redundant terms in alt text
    else if (alt && scanOptions.includeRedundantCheck) {
      const redundantPattern = new RegExp(
        '\\b(' + scanOptions.redundantPatterns.join('|') + ')\\b', 
        'i'
      );
      
      if (redundantPattern.test(alt)) {
        issues.push({
          id: uuidv4(),
          url: src,
          element: img.outerHTML,
          selector: generateSelector(img),
          issueType: 'redundant',
          impact: 'moderate',
          description: `Alt text contains redundant words (${alt.match(redundantPattern)?.[0]})`,
          wcagCriteria: 'WCAG 1.1.1 (A)',
          suggestedFix: 'Remove redundant words from alt text',
          suggestedAlt: alt.replace(redundantPattern, '').replace(/\s+/g, ' ').trim(),
          fixed: false
        });
      }
    }
    
    // Check for suspicious alt text
    if (alt && scanOptions.includeSuspiciousCheck) {
      const suspiciousPattern = new RegExp(
        '\\b(' + scanOptions.suspiciousPatterns.join('|') + ')\\b', 
        'i'
      );
      
      if (suspiciousPattern.test(alt)) {
        issues.push({
          id: uuidv4(),
          url: src,
          element: img.outerHTML,
          selector: generateSelector(img),
          issueType: 'suspicious',
          impact: 'moderate',
          description: `Alt text contains suspicious patterns (${alt.match(suspiciousPattern)?.[0]})`,
          wcagCriteria: 'WCAG 1.1.1 (A)',
          suggestedFix: 'Replace with more descriptive alt text',
          suggestedAlt: generateAltSuggestion(img, src),
          fixed: false
        });
      }
    }
    
    // Track for duplicates
    if (scanOptions.includeDuplicateCheck && src && alt) {
      if (!imageSources.has(src)) {
        imageSources.set(src, [alt]);
      } else {
        imageSources.get(src)?.push(alt);
      }
    }
  });
  
  // Check for duplicate images with same alt text
  if (scanOptions.includeDuplicateCheck) {
    imageSources.forEach((alts, src) => {
      if (alts.length > 1) {
        // Find all images with this source
        const duplicateImages = Array.from(dom.querySelectorAll(`img[src="${src}"]`));
        
        // Skip if these appear to be in a gallery
        if (areImagesLikelyInGallery(duplicateImages)) {
          return;
        }
        
        // Create issues for all but the first occurrence
        duplicateImages.slice(1).forEach((img) => {
          issues.push({
            id: uuidv4(),
            url: src,
            element: img.outerHTML,
            selector: generateSelector(img),
            issueType: 'duplicate',
            impact: 'minor',
            description: 'Duplicate image with identical alt text',
            wcagCriteria: 'WCAG 1.1.1 (A)',
            suggestedFix: 'Consider using CSS for decorative duplicates or provide unique context in alt text',
            suggestedAlt: img.getAttribute('alt') + ' (in different context)',
            fixed: false
          });
        });
      }
    });
  }
  
  return {
    id: uuidv4(),
    url: dom.location.href,
    timestamp: Date.now(),
    totalImages: images.length,
    issuesFound: issues.length,
    issues
  };
};

/**
 * Determines if an image appears to be decorative based on its attributes and context
 */
const isLikelyDecorative = (img: Element): boolean => {
  // Check for role="presentation" or role="none"
  if (img.getAttribute('role') === 'presentation' || img.getAttribute('role') === 'none') {
    return true;
  }
  
  // Check if it's a small icon
  const width = parseInt(img.getAttribute('width') || '0', 10);
  const height = parseInt(img.getAttribute('height') || '0', 10);
  
  if ((width > 0 && width <= 24) && (height > 0 && height <= 24)) {
    return true;
  }
  
  // Check for CSS classes that suggest it's decorative
  const className = img.className;
  if (className && /\b(icon|decoration|separator|spacer|bullet)\b/i.test(className)) {
    return true;
  }
  
  // Check if it's in a typical decorative container
  const parent = img.parentElement;
  if (parent) {
    if (
      parent.tagName === 'BUTTON' || 
      parent.tagName === 'A' ||
      parent.getAttribute('role') === 'button'
    ) {
      // Might be a button icon - check if there's text content
      if (parent.textContent && parent.textContent.trim()) {
        return true;
      }
    }
  }
  
  return false;
};

/**
 * Checks if images appear to be in a gallery or slideshow
 */
const areImagesLikelyInGallery = (images: Element[]): boolean => {
  if (images.length <= 1) return false;
  
  // Check if images share a common parent with gallery-like classes or roles
  const parents = images.map(img => img.parentElement);
  const uniqueParents = new Set(parents);
  
  if (uniqueParents.size === 1) {
    const parent = parents[0];
    if (parent) {
      const className = parent.className;
      const role = parent.getAttribute('role');
      
      // Check for gallery/slideshow classes or ARIA roles
      if (
        className && /\b(gallery|slideshow|carousel|slider)\b/i.test(className) ||
        role === 'listbox' || role === 'list'
      ) {
        return true;
      }
      
      // Check for nearby navigation controls
      const siblings = Array.from(parent.children);
      const hasControls = siblings.some(el => 
        /\b(prev|next|arrow|dot|indicator|pagination|thumbnail)\b/i.test(el.className) ||
        el.getAttribute('aria-label')?.includes('slide')
      );
      
      if (hasControls) return true;
    }
  }
  
  return false;
};

/**
 * Generates a CSS selector for an element to help locate it
 */
const generateSelector = (element: Element): string => {
  const tagName = element.tagName.toLowerCase();
  let selector = tagName;
  
  // Add ID if present
  if (element.id) {
    selector += `#${element.id}`;
    return selector;
  }
  
  // Add classes if present (up to 2 classes)
  const classes = Array.from(element.classList).slice(0, 2);
  if (classes.length > 0) {
    selector += `.${classes.join('.')}`;
  }
  
  // Add attribute selectors for common attributes
  const src = element.getAttribute('src');
  if (src) {
    const filename = src.split('/').pop()?.split('?')[0];
    if (filename) {
      selector += `[src$="${filename}"]`;
      return selector;
    }
  }
  
  // If no unique identifiers, build a path
  if (selector === tagName) {
    let parent = element.parentElement;
    let nthChild = 1;
    const siblings = parent ? Array.from(parent.children) : [];
    
    for (let i = 0; i < siblings.indexOf(element as Node); i++) {
      if (siblings[i].nodeName === element.nodeName) {
        nthChild++;
      }
    }
    
    if (parent) {
      const parentTag = parent.tagName.toLowerCase();
      let parentSelector = parentTag;
      
      if (parent.id) {
        parentSelector += `#${parent.id}`;
      } else if (parent.classList.length > 0) {
        parentSelector += `.${parent.classList[0]}`;
      }
      
      selector = `${parentSelector} > ${selector}:nth-of-type(${nthChild})`;
    } else {
      selector += `:nth-of-type(${nthChild})`;
    }
  }
  
  return selector;
};

/**
 * Generate a suggested alt text based on image properties and context
 */
const generateAltSuggestion = (img: Element, src: string): string => {
  // Try to extract from image filename
  const filename = src.split('/').pop()?.split('?')[0] || '';
  let filenameText = '';
  
  if (filename) {
    // Remove file extension and replace dashes, underscores with spaces
    filenameText = filename
      .replace(/\.[^.]+$/, '')
      .replace(/[-_]/g, ' ')
      .replace(/([a-z])([A-Z])/g, '$1 $2') // Add spaces in camelCase
      .replace(/\b[a-z]/g, match => match.toUpperCase()) // Capitalize first letter of each word
      .trim();
      
    // Filter out non-descriptive words often found in image filenames
    if (/^(image|img|photo|pic|DSC_|IMG_)\d*$/i.test(filenameText)) {
      filenameText = '';
    }
  }
  
  // Try to extract from the title attribute
  const title = img.getAttribute('title');
  
  // Try to extract from surrounding context
  const parent = img.parentElement;
  let parentContext = '';
  
  if (parent) {
    // Check for figure caption
    const caption = parent.tagName === 'FIGURE' 
      ? parent.querySelector('figcaption')?.textContent?.trim() 
      : null;
      
    if (caption) {
      return caption;
    }
    
    // Check for heading sibling
    const headings = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
    for (const heading of headings) {
      const headingElem = img.parentElement?.querySelector(heading);
      if (headingElem && headingElem.textContent) {
        parentContext = headingElem.textContent.trim();
        break;
      }
    }
    
    // Check for nearby text
    if (!parentContext) {
      // Get text directly in the parent, without text from other elements
      const walker = document.createTreeWalker(
        parent, 
        NodeFilter.SHOW_TEXT, 
        { acceptNode: node => node.textContent?.trim() ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT }
      );
      let node;
      let textContent = '';
      
      while ((node = walker.nextNode())) {
        textContent += ' ' + node.textContent?.trim();
      }
      
      if (textContent.trim()) {
        parentContext = textContent.trim().substring(0, 100);
      }
    }
    
    // Look at aria-label on parent
    if (!parentContext) {
      const ariaLabel = parent.getAttribute('aria-label');
      if (ariaLabel) {
        parentContext = ariaLabel;
      }
    }
  }
  
  // Prioritize which text to use
  if (title) {
    return title;
  } else if (parentContext) {
    return parentContext;
  } else if (filenameText) {
    return filenameText;
  }
  
  // If nothing else works, return a generic placeholder
  return 'Image needs description';
};

/**
 * Fix an image alt text issue by applying the suggested fix
 */
export const fixImageAltIssue = (
  dom: Document, 
  issue: ImageIssue, 
  newAltText: string
): boolean => {
  try {
    // Find the element using the selector
    const element = dom.querySelector(issue.selector);
    
    if (element && element instanceof HTMLImageElement) {
      element.setAttribute('alt', newAltText);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Error fixing image alt issue:', error);
    return false;
  }
};

/**
 * Integration adapters for platform-specific implementations
 */

/**
 * WordPress integration adapter
 */
export const wordPressAdapter = {
  /**
   * Start a scan of a WordPress site for image alt issues
   */
  async scan(siteUrl: string, apiKey: string, options: Partial<ScanOptions> = {}): Promise<ScanResult> {
    try {
      // This would be a real API call in production
      // const response = await fetch(`${siteUrl}/wp-json/wcag-scanner/v1/scan-images`, {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'X-API-Key': apiKey
      //   },
      //   body: JSON.stringify({ options })
      // });
      
      // const data = await response.json();
      // return data;
      
      // Simulated response
      return {
        id: uuidv4(),
        url: siteUrl,
        timestamp: Date.now(),
        totalImages: 42,
        issuesFound: 7,
        issues: [
          {
            id: uuidv4(),
            url: `${siteUrl}/wp-content/uploads/2023/05/product-image.jpg`,
            element: '<img src="/wp-content/uploads/2023/05/product-image.jpg">',
            selector: '.product-image img',
            issueType: 'missing',
            impact: 'critical',
            description: 'Product image is missing an alt attribute',
            wcagCriteria: 'WCAG 1.1.1 (A)',
            suggestedFix: 'Add an alt attribute that describes the product',
            suggestedAlt: 'Blue denim jacket with metal buttons',
            fixed: false
          },
          // More simulated issues would go here
        ]
      };
    } catch (error) {
      console.error('Error scanning WordPress site:', error);
      throw error;
    }
  },
  
  /**
   * Fix image alt issues on a WordPress site
   */
  async fixIssues(siteUrl: string, apiKey: string, issues: ImageIssue[], fixes: Record<string, string>): Promise<boolean> {
    try {
      // This would be a real API call in production
      // const response = await fetch(`${siteUrl}/wp-json/wcag-scanner/v1/fix-image-alts`, {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'X-API-Key': apiKey
      //   },
      //   body: JSON.stringify({ issues, fixes })
      // });
      
      // const data = await response.json();
      // return data.success;
      
      // Simulated response
      return true;
    } catch (error) {
      console.error('Error fixing WordPress image issues:', error);
      throw error;
    }
  }
};

/**
 * Shopify integration adapter
 */
export const shopifyAdapter = {
  /**
   * Start a scan of a Shopify store for image alt issues
   */
  async scan(shopDomain: string, accessToken: string, options: Partial<ScanOptions> = {}): Promise<ScanResult> {
    try {
      // This would be a real API call in production
      // const response = await fetch(`https://${shopDomain}/admin/api/2023-01/themes/assets.json`, {
      //   method: 'GET',
      //   headers: {
      //     'X-Shopify-Access-Token': accessToken
      //   }
      // });
      
      // const { assets } = await response.json();
      
      // Scan theme files for image tags without alt attributes
      // Process and return results
      
      // Simulated response
      return {
        id: uuidv4(),
        url: `https://${shopDomain}`,
        timestamp: Date.now(),
        totalImages: 65,
        issuesFound: 12,
        issues: [
          {
            id: uuidv4(),
            url: `https://${shopDomain}/cdn/shop/products/t-shirt-1.jpg`,
            element: '<img src="{{ product.featured_image | img_url: \'master\' }}">',
            selector: '.product-template img',
            issueType: 'missing',
            impact: 'critical',
            description: 'Product image is missing an alt attribute',
            wcagCriteria: 'WCAG 1.1.1 (A)',
            suggestedFix: 'Add alt="{{ product.featured_image.alt | escape }}" to the image tag',
            suggestedAlt: '{{ product.featured_image.alt | escape }}',
            fixed: false
          },
          // More simulated issues would go here
        ]
      };
    } catch (error) {
      console.error('Error scanning Shopify store:', error);
      throw error;
    }
  },
  
  /**
   * Fix image alt issues on a Shopify store
   */
  async fixIssues(shopDomain: string, accessToken: string, issues: ImageIssue[], fixes: Record<string, string>): Promise<boolean> {
    try {
      // For each issue, find the template file and modify it
      for (const issueId in fixes) {
        const issue = issues.find(i => i.id === issueId);
        const newAlt = fixes[issueId];
        
        if (issue) {
          // Find which asset (template file) contains this issue
          // const asset = ... 
          
          // Update the template file with the fix
          // const updatedValue = ...
          
          // This would be a real API call in production
          // await fetch(`https://${shopDomain}/admin/api/2023-01/themes/assets.json`, {
          //   method: 'PUT',
          //   headers: {
          //     'Content-Type': 'application/json',
          //     'X-Shopify-Access-Token': accessToken
          //   },
          //   body: JSON.stringify({
          //     asset: {
          //       key: asset.key,
          //       value: updatedValue
          //     }
          //   })
          // });
        }
      }
      
      // Simulated response
      return true;
    } catch (error) {
      console.error('Error fixing Shopify image issues:', error);
      throw error;
    }
  }
};

// Export the service as default
export default {
  scanImagesInDOM,
  fixImageAltIssue,
  wordPressAdapter,
  shopifyAdapter
};