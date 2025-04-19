/**
 * DOM Utilities for Feedback System
 * This file contains utility functions for working with DOM elements.
 */

/**
 * Get a simple CSS selector path for an element
 * Captures the essentials but keeps it simple for readability
 */
export const getElementPath = (element: HTMLElement): string => {
  if (!element) return '';
  if (element === document.body) return 'body';
  
  let selector = element.tagName.toLowerCase();
  
  // Add id if available (most specific)
  if (element.id) {
    selector += `#${element.id}`;
    return selector;
  }
  
  // Add classes if available
  if (element.className && typeof element.className === 'string') {
    const classes = element.className.split(/\\s+/).filter(c => c);
    if (classes.length) {
      selector += `.${classes.join('.')}`;
    }
  }
  
  // Add basic path info with parent element
  const parentElement = element.parentElement;
  if (parentElement && parentElement !== document.body) {
    return `${getElementPath(parentElement)} > ${selector}`;
  }
  
  return selector;
};

/**
 * Temporarily disable interactive elements while in targeting mode
 * Returns a cleanup function to restore original element states
 */
export const disableInteractiveElements = (widgetRef: React.RefObject<HTMLElement>): {
  cleanup: () => void;
  originalStates: Map<HTMLElement, {
    outline: string;
    outlineOffset: string;
    pointerEvents: string;
  }>;
} => {
  // Store original element states
  const originalStates = new Map<HTMLElement, {
    outline: string;
    outlineOffset: string;
    pointerEvents: string;
  }>();
  
  // Find all interactive elements
  const interactiveElements = document.querySelectorAll('button, a, input, select, [role="button"]');
  
  interactiveElements.forEach(el => {
    const htmlEl = el as HTMLElement;
    
    // Skip the feedback widget elements
    if (widgetRef.current && widgetRef.current.contains(htmlEl)) return;
    
    // Store original state
    originalStates.set(htmlEl, {
      outline: htmlEl.style.outline,
      outlineOffset: htmlEl.style.outlineOffset,
      pointerEvents: htmlEl.style.pointerEvents
    });
    
    // Disable normal interactive behavior
    htmlEl.style.pointerEvents = 'none';
  });
  
  // Return cleanup function
  return {
    cleanup: () => {
      originalStates.forEach((state, element) => {
        if (element) {
          element.style.outline = state.outline;
          element.style.outlineOffset = state.outlineOffset;
          element.style.pointerEvents = state.pointerEvents;
        }
      });
    },
    originalStates
  };
};

/**
 * Create overlay message for targeting mode
 */
export const createTargetingOverlay = (): HTMLElement => {
  const overlay = document.createElement('div');
  overlay.id = 'feedback-targeting-overlay';
  overlay.style.position = 'fixed';
  overlay.style.bottom = '16px';
  overlay.style.left = '50%';
  overlay.style.transform = 'translateX(-50%)';
  overlay.style.background = 'rgba(0, 0, 0, 0.8)';
  overlay.style.color = 'white';
  overlay.style.padding = '8px 16px';
  overlay.style.borderRadius = '4px';
  overlay.style.zIndex = '9999';
  overlay.style.fontWeight = 'bold';
  overlay.style.fontSize = '14px';
  overlay.textContent = 'Click on any element to leave feedback (ESC to cancel)';
  document.body.appendChild(overlay);
  
  return overlay;
};

/**
 * Get the status color for feedback markers
 */
export const getStatusColor = (status: string, category: string): string => {
  if (status === 'pending') {
    return category === 'roadmap' ? 'bg-blue-500' : 'bg-red-500';
  } else if (status === 'inProgress') {
    return category === 'roadmap' ? 'bg-indigo-500' : 'bg-orange-500';
  } else {
    return 'bg-green-500';
  }
};