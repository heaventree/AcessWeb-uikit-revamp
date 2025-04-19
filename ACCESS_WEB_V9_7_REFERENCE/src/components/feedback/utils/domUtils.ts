/**
 * DOM utility functions for the feedback widget
 */

/**
 * Get a CSS selector path to identify an element in the DOM 
 * @param element The DOM element to get the path for
 * @returns A CSS selector path string that can be used to find the element
 */
export function getCssPath(element: HTMLElement): string {
  if (!element) return '';
  if (element === document.body) return 'body';
  
  const path = [];
  let currentElement: HTMLElement | null = element;
  
  while (currentElement && currentElement !== document.body) {
    let selector = currentElement.tagName.toLowerCase();
    
    // Add id if available (which gives us a very specific selector)
    if (currentElement.id) {
      selector += `#${currentElement.id}`;
      path.unshift(selector);
      break;
    }
    
    // Add classes if available
    if (currentElement.className) {
      const classes = currentElement.className.split(/\s+/).filter(c => c);
      if (classes.length) {
        selector += `.${classes.join('.')}`;
      }
    }
    
    // Add position among siblings if needed
    const siblings = Array.from(currentElement.parentElement?.children || []);
    if (siblings.length > 1) {
      const index = siblings.indexOf(currentElement) + 1;
      selector += `:nth-child(${index})`;
    }
    
    path.unshift(selector);
    currentElement = currentElement.parentElement;
  }
  
  return path.join(' > ');
}

/**
 * Find an element in the DOM using a CSS selector path
 * @param path CSS selector path
 * @returns The DOM element if found, null otherwise
 */
export function findElementByPath(path: string): HTMLElement | null {
  try {
    return document.querySelector(path) as HTMLElement;
  } catch (e) {
    console.error('Error finding element by path:', e);
    return null;
  }
}

/**
 * Highlight an element in the DOM
 * @param element The element to highlight
 * @param color The highlight color
 */
export function highlightElement(
  element: HTMLElement | null, 
  color: string = '#3b82f6'
): void {
  if (!element) return;
  
  // Store original styles
  const originalOutline = element.style.outline;
  const originalOutlineOffset = element.style.outlineOffset;
  
  // Apply highlight
  element.style.outline = `2px solid ${color}`;
  element.style.outlineOffset = '2px';
  
  // Remove highlight after 2 seconds
  setTimeout(() => {
    element.style.outline = originalOutline;
    element.style.outlineOffset = originalOutlineOffset;
  }, 2000);
}