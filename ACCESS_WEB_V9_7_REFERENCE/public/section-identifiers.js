/**
 * Section Identifiers - WCAG Accessibility Audit Tool
 * 
 * This script implements a non-breaking section identification system
 * that helps visualize the structure of the website during development.
 * 
 * Features:
 * - Globally unique identifiers that persist across page navigation
 * - Bright pink highlighting for maximum visibility
 * - Detailed tooltips with component information
 * - Consistent element identification with localStorage persistence
 * - Smart detection of UI components and structures
 * - Toggleable via the control panel in the top right corner
 * 
 * Usage:
 * - Enable by clicking the "Section Identifiers" toggle
 * - Hover over identifiers to see detailed component information
 * - Use the ID numbers when communicating about specific UI elements
 * - IDs remain consistent when navigating between pages
 * 
 * Developer API (via console):
 * - window._devSectionIdentifiers.enable() - Turn on
 * - window._devSectionIdentifiers.disable() - Turn off
 * - window._devSectionIdentifiers.toggle() - Toggle state
 * - window._devSectionIdentifiers.refresh() - Refresh all markers
 * - window._devSectionIdentifiers.reset() - Clear all data and start fresh
 */

(function() {
  // Ensure we don't pollute the global namespace
  'use strict';

  // Configuration with namespaced localStorage keys
  const VERSION = '1.1';
  const IDENTIFIERS_ENABLED_KEY = 'wcagAccessWeb_sectionIds_enabled_v' + VERSION;
  const IDENTIFIERS_COUNTER_KEY = 'wcagAccessWeb_sectionIds_counter_v' + VERSION;
  const IDENTIFIERS_MAP_KEY = 'wcagAccessWeb_sectionIds_map_v' + VERSION;
  
  // Global counter for unique identifiers
  let globalCounter = 1;
  
  // Map to store element paths and their assigned IDs
  const elementIdentifierMap = new Map();
  
  // Cache DOM lookups
  let toggleButton = null;
  
  // Enable debug logging
  const DEBUG = true;
  function debugLog(...args) {
    if (DEBUG) {
      console.log('[SectionIdentifiers]', ...args);
    }
  }
  
  // Try to load the global counter from localStorage
  try {
    const savedCounter = parseInt(localStorage.getItem(IDENTIFIERS_COUNTER_KEY));
    if (!isNaN(savedCounter) && savedCounter > 1) {
      globalCounter = savedCounter;
      debugLog(`Loaded counter from localStorage: ${globalCounter}`);
    } else {
      debugLog('Starting with fresh counter at 1');
    }
  } catch (e) {
    console.warn('Error loading saved counter:', e);
  }
  
  // Try to load the element map from localStorage with error handling
  try {
    const savedMap = localStorage.getItem(IDENTIFIERS_MAP_KEY);
    if (savedMap) {
      try {
        const parsedMap = JSON.parse(savedMap);
        
        // Convert JSON object back to Map with validation
        Object.entries(parsedMap).forEach(([key, value]) => {
          if (key && key.length > 0 && typeof value === 'number') {
            elementIdentifierMap.set(key, value);
          }
        });
        
        debugLog(`Loaded element map from localStorage with ${elementIdentifierMap.size} entries`);
        
        // Check for map integrity - if we have a counter but no map entries, reset the counter
        if (elementIdentifierMap.size === 0 && globalCounter > 1) {
          debugLog('Warning: Counter exists but map is empty, resetting counter');
          globalCounter = 1;
        }
      } catch (parseError) {
        console.warn('Error parsing saved map, resetting:', parseError);
        // Clear corrupted data
        localStorage.removeItem(IDENTIFIERS_MAP_KEY);
        elementIdentifierMap.clear();
      }
    } else {
      debugLog('No element map found in localStorage, starting fresh');
    }
  } catch (e) {
    console.warn('Error accessing localStorage for element map:', e);
  }
  
  /**
   * Initialize the section identifiers system
   */
  function initSectionIdentifiers() {
    try {
      // Add the stylesheet to the document
      addStylesheet();
      
      // Create the toggle button if it doesn't exist
      createToggle();
      
      // Setup event delegation for dynamic content changes
      setupMutationObserver();
      
      // Check localStorage for user preference
      const enabled = localStorage.getItem(IDENTIFIERS_ENABLED_KEY) === 'true';
      setEnabled(enabled);
      
      // Initial render
      setTimeout(function() {
        refreshIdentifiers();
      }, 100);
    } catch (error) {
      console.warn('Error initializing section identifiers:', error);
    }
  }
  
  /**
   * Add the section identifiers stylesheet to the document
   */
  function addStylesheet() {
    try {
      // Check if the stylesheet is already added
      if (document.querySelector('link[href*="section-identifiers.css"]')) {
        return;
      }
      
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = '/section-identifiers.css';
      link.id = 'section-identifiers-styles';
      document.head.appendChild(link);
    } catch (error) {
      console.warn('Error adding section identifiers stylesheet:', error);
    }
  }
  
  /**
   * Create the toggle button
   */
  function createToggle() {
    try {
      // Remove existing toggle if any
      const existingToggle = document.querySelector('.section-identifiers-toggle');
      if (existingToggle) {
        existingToggle.remove();
      }
      
      // Create new toggle
      const toggle = document.createElement('div');
      toggle.className = 'section-identifiers-toggle';
      
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.id = 'section-identifiers-toggle-input';
      checkbox.checked = localStorage.getItem(IDENTIFIERS_ENABLED_KEY) === 'true';
      
      const label = document.createElement('label');
      label.htmlFor = 'section-identifiers-toggle-input';
      label.textContent = 'Section Identifiers';
      
      // Add a reset button
      const resetButton = document.createElement('button');
      resetButton.textContent = 'Reset IDs';
      resetButton.className = 'section-identifiers-reset-button';
      resetButton.style.marginLeft = '10px';
      resetButton.style.padding = '2px 6px';
      resetButton.style.backgroundColor = '#FF1493'; // Deep pink
      resetButton.style.color = 'white';
      resetButton.style.border = 'none';
      resetButton.style.borderRadius = '3px';
      resetButton.style.cursor = 'pointer';
      resetButton.style.fontSize = '11px';
      
      // Add the main components
      toggle.appendChild(checkbox);
      toggle.appendChild(label);
      toggle.appendChild(resetButton);
      
      // Add event listener for toggle
      checkbox.addEventListener('change', function(event) {
        // Prevent event bubbling
        event.stopPropagation();
        setEnabled(this.checked);
      });
      
      // Add reset button handler
      resetButton.addEventListener('click', function(event) {
        event.preventDefault();
        event.stopPropagation();
        
        // Confirm before resetting
        if (confirm('Reset all section identifiers? This will clear any saved IDs.')) {
          debugLog('User initiated reset of all section identifiers');
          resetIdentifiers();
          
          // Force refresh of the page to ensure clean state
          window.location.reload();
        }
      });
      
      document.body.appendChild(toggle);
      toggleButton = checkbox;
    } catch (error) {
      console.warn('Error creating section identifiers toggle:', error);
    }
  }
  
  /**
   * Enable or disable section identifiers
   */
  function setEnabled(enabled) {
    try {
      // Update body class
      if (enabled) {
        document.body.classList.add('section-identifiers-enabled');
      } else {
        document.body.classList.remove('section-identifiers-enabled');
      }
      
      // Update localStorage
      localStorage.setItem(IDENTIFIERS_ENABLED_KEY, enabled ? 'true' : 'false');
      
      // Update toggle if it exists
      if (toggleButton) {
        toggleButton.checked = enabled;
      }
      
      // Refresh identifiers
      refreshIdentifiers();
    } catch (error) {
      console.warn('Error setting section identifiers state:', error);
    }
  }
  
  /**
   * Set up mutation observer to watch for DOM changes
   */
  function setupMutationObserver() {
    try {
      // Create an observer instance
      const observer = new MutationObserver(function(mutations) {
        // Only refresh if the feature is enabled
        if (document.body.classList.contains('section-identifiers-enabled')) {
          // Debounce the refresh to avoid too many updates
          if (window._sectionIdentifiersTimeout) {
            clearTimeout(window._sectionIdentifiersTimeout);
          }
          
          window._sectionIdentifiersTimeout = setTimeout(function() {
            refreshIdentifiers();
            window._sectionIdentifiersTimeout = null;
          }, 200);
        }
      });
      
      // Configure and start the observer
      observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: false
      });
    } catch (error) {
      console.warn('Error setting up mutation observer:', error);
    }
  }
  
  /**
   * Generate a unique element path to identify elements across page loads
   * @param {Element} element - The DOM element
   * @returns {string} A unique path for the element
   */
  function generateElementPath(element) {
    try {
      // FIRST CHECK: Special case for navigation elements - use a more consistent approach
      // Navigation elements get special fixed identifiers for consistent identification across pages
      const isNavElement = element.tagName.toLowerCase() === 'nav' || 
                           element.getAttribute('role') === 'navigation' ||
                           (element.className && typeof element.className === 'string' && 
                            (element.className.includes('nav') || 
                             element.className.includes('menu') || 
                             element.className.includes('header') ||
                             element.className.includes('navbar')));
      
      // Second check: Special case for layout containers that might change per page
      const isLayoutContainer = (element.className && typeof element.className === 'string' && 
                               (element.className.includes('container') ||
                                element.className.includes('wrapper') ||
                                element.className.includes('layout') ||
                                element.className.includes('main'))) ||
                               element.tagName.toLowerCase() === 'main';
      
      // For nav elements, use FIXED identifiers that won't change between pages
      if (isNavElement) {
        // Check if this is the root navigation container (from main-nav-wrapper section type)
        // This is our MAIN target that's been changing between pages
        const navWrapperElements = document.querySelectorAll('.nav-wrapper, .nav-container, .navigation-wrapper, .navigation-container, .header-wrapper, header > div, .navbar-wrapper, .main-nav-wrapper');
        for (let i = 0; i < navWrapperElements.length; i++) {
          if (navWrapperElements[i] === element) {
            return 'FIXED-MAIN-NAV-WRAPPER'; // Most important ID to keep consistent!
          }
        }
        
        // Is parent of nav? These are often wrapper divs that can change between pages
        if (element.querySelector('nav') || 
            element.querySelector('[role="navigation"]') ||
            element.querySelector('.navbar, .navigation')) {
          return 'FIXED-NAV-PARENT-WRAPPER';
        }
        
        // For common main layout elements - critical to identify
        const tagName = element.tagName.toLowerCase();
        if (tagName === 'header') {
          return 'FIXED-SEMANTIC-HEADER';
        }
          
        // First, check for clear distinguishing features like IDs
        if (element.id && element.id.trim() !== '') {
          return `FIXED-NAV-ID-${element.id}`;
        }
        
        // Use tag name + role as a reliable identifier
        const role = element.getAttribute('role');
        
        if (role === 'navigation') {
          return `FIXED-NAV-ROLE-${tagName}`;
        }
        
        // For main navigation element (we assume only one)
        if (tagName === 'nav') {
          // Count which nav element this is (1st, 2nd, etc)
          const allNavs = document.querySelectorAll('nav');
          for (let i = 0; i < allNavs.length; i++) {
            if (allNavs[i] === element) {
              return `FIXED-SEMANTIC-NAV-${i + 1}`;
            }
          }
          return 'FIXED-SEMANTIC-NAV';
        }
        
        // For UL/OL inside navigation - very common pattern
        if ((tagName === 'ul' || tagName === 'ol') && 
            element.parentElement && 
            (element.parentElement.tagName.toLowerCase() === 'nav' || 
             element.parentElement.getAttribute('role') === 'navigation')) {
          return 'FIXED-NAV-LIST';
        }
        
        // For common navbar patterns
        if (element.className && typeof element.className === 'string') {
          if (element.className.includes('navbar')) {
            return 'FIXED-NAVBAR';
          }
          if (element.className.includes('nav-container')) {
            return 'FIXED-NAV-CONTAINER';
          }
          if (element.className.includes('nav-menu')) {
            return 'FIXED-NAV-MENU';
          }
          if (element.className.includes('topnav')) {
            return 'FIXED-TOP-NAV';
          }
          // More specific checks for app's patterns
          if (element.className.includes('main-nav') || 
              element.className.includes('main-navigation')) {
            return 'FIXED-MAIN-NAVIGATION';
          }
          if (element.className.includes('app-header') || 
              element.className.includes('site-header')) {
            return 'FIXED-SITE-HEADER';
          }
        }
        
        // Check for main nav container - a div with a class containing both 'nav' and 'container' or 'wrapper'
        if (element.className && 
            typeof element.className === 'string' && 
            element.className.includes('nav') && 
            (element.className.includes('container') || element.className.includes('wrapper'))) {
          return 'FIXED-NAV-WRAPPER-CONTAINER';
        }
        
        // Identify by child nav elements
        if (element.querySelector('nav') || element.querySelector('[role="navigation"]')) {
          return 'FIXED-CONTAINS-NAV-ELEMENT';
        }
        
        // Last resort - count position in DOM for nav elements
        const allNavLike = document.querySelectorAll('[class*="nav"], [class*="menu"], header, [role="navigation"]');
        for (let i = 0; i < allNavLike.length; i++) {
          if (allNavLike[i] === element) {
            return `FIXED-GENERIC-NAV-${i + 1}`;
          }
        }
        
        // Absolute fallback
        return 'FIXED-GENERIC-NAV';
      }
      
      if (isLayoutContainer) {
        const tagName = element.tagName.toLowerCase();
        
        if (tagName === 'main') {
          return 'semantic-main'; // main is a semantic element that should be consistent
        }
        
        if (element.id) {
          return `layout-${element.id}`; // Use ID-based layout identifier
        }
        
        // For other containers, use a simplified structural identifier
        return `${tagName}-layout-container`;
      }
      
      // Regular approach for most elements
      const tagName = element.tagName.toLowerCase();
      
      // If element has an ID, that's the most reliable identifier
      if (element.id) {
        return `${tagName}#${element.id}`;
      }
      
      // Collect element classes but filter out dynamic ones
      // and also filter out layout-related classes that might change between pages
      const classes = Array.from(element.classList)
        .filter(cls => !cls.match(/\d+/)) // Filter out classes with numbers
        .filter(cls => !cls.match(/random|uuid|guid|hash/i)) // Filter out likely dynamic classes
        .filter(cls => !cls.match(/^(container|wrapper|layout|content|main)$/)) // Filter layout classes
        .map(c => `.${c}`)
        .join('');
      
      // Get headings or strong textual elements that are likely to be stable
      let stableText = '';
      const headingElement = element.querySelector('h1, h2, h3, h4, h5, h6');
      if (headingElement && headingElement.textContent) {
        const headingText = headingElement.textContent.trim();
        if (headingText.length > 0 && headingText.length < 50) { // Only use reasonably sized headings
          stableText = `[heading="${headingText}"]`;
        }
      }
      
      // If no heading, check for other stable text like buttons, labels, etc.
      if (!stableText) {
        const stableElements = element.querySelectorAll('button, label, a[href], [aria-label]');
        if (stableElements.length === 1) {
          const textContent = stableElements[0].textContent || stableElements[0].getAttribute('aria-label');
          if (textContent && textContent.trim().length > 0 && textContent.trim().length < 30) {
            stableText = `[text="${textContent.trim()}"]`;
          }
        }
      }
      
      // For elements with no stable text or ID, try to compute a reliable position path
      let positionPath = '';
      if (!stableText && !element.id) {
        // Get the location within the DOM hierarchy
        positionPath = getPositionPath(element);
      }
      
      // For elements with role, use it for identification
      const role = element.getAttribute('role');
      const roleInfo = role ? `[role="${role}"]` : '';
      
      // If element has a name attribute (inputs, forms, etc.), use it
      const name = element.getAttribute('name');
      const nameInfo = name ? `[name="${name}"]` : '';
      
      // Try to find data attributes that might be stable
      const dataAttributes = [];
      for (let i = 0; i < element.attributes.length; i++) {
        const attr = element.attributes[i];
        if (attr.name.startsWith('data-') && !attr.name.match(/data-id|data-key|data-index|data-v-/)) {
          dataAttributes.push(`[${attr.name}="${attr.value}"]`);
        }
      }
      
      // Combine all the reliable identifiers
      const path = `${tagName}${classes}${roleInfo}${nameInfo}${dataAttributes.join('')}${stableText}${positionPath}`;
      
      // If path is empty or not specific enough, add more context
      if (path === tagName || path === `${tagName}${classes}` && !classes) {
        return `${getPositionPath(element, true)}`;
      }
      
      // We're NOT adding page context to maintain consistency across pages
      // This ensures the same element gets the same ID on different pages
      
      return path;
    } catch (e) {
      console.warn('Error generating element path:', e);
      // Fallback to random ID, but this will make identifiers inconsistent
      return `element-${Math.floor(Math.random() * 1000000)}`;
    }
  }
  
  /**
   * Get position path for an element
   * @param {Element} element - The DOM element
   * @param {boolean} extended - Whether to include more context
   * @returns {string} Position path
   */
  function getPositionPath(element, extended = false) {
    let path = '';
    let current = element;
    let depth = 0;
    
    // Traverse up to 5 levels to avoid too long paths
    while (current && current !== document.body && depth < 5) {
      // Get element's position among siblings of same type
      const siblings = Array.from(current.parentElement?.children || [])
        .filter(el => el.tagName === current.tagName);
      const position = siblings.indexOf(current);
      
      // Add to path
      if (position !== -1) {
        const currentTag = current.tagName.toLowerCase();
        
        // For extended path, include more information
        let additionalInfo = '';
        if (extended && current !== element) {
          // Add classes if available and not too many
          const classes = Array.from(current.classList)
            .filter(cls => !cls.match(/\d+/))
            .filter(cls => !cls.match(/random|uuid|guid|hash/i));
          
          if (classes.length > 0 && classes.length < 3) {
            additionalInfo = classes.map(c => `.${c}`).join('');
          }
          
          // Add ID if available
          if (current.id) {
            additionalInfo = `#${current.id}`;
          }
        }
        
        path = `/${currentTag}${additionalInfo}[${position + 1}]${path}`;
      }
      
      current = current.parentElement;
      depth++;
    }
    
    return path;
  }
  
  /**
   * Refresh all section identifiers
   */
  function refreshIdentifiers() {
    try {
      // Skip if the feature is disabled
      if (!document.body.classList.contains('section-identifiers-enabled')) {
        return;
      }
      
      // Clean up existing identifiers
      const existingIdentifiers = document.querySelectorAll('.section-identifier');
      existingIdentifiers.forEach(function(identifier) {
        identifier.remove();
      });
      
      // Find sections without modifying them
      const sections = findSections();
      
      // Create new identifiers with globally unique IDs
      sections.forEach(function(section) {
        const element = section.element;
        const elementPath = generateElementPath(element);
        
        // Check if this element already has a stable ID assigned
        let sectionId;
        if (elementIdentifierMap.has(elementPath)) {
          sectionId = elementIdentifierMap.get(elementPath);
        } else {
          // Assign new ID from the global counter
          sectionId = globalCounter++;
          elementIdentifierMap.set(elementPath, sectionId);
          
          // Save the updated data to localStorage
          saveIdentifiersData();
        }
        
        createIdentifier(section, sectionId);
      });
    } catch (error) {
      console.warn('Error refreshing section identifiers:', error);
    }
  }
  
  /**
   * Find all sections in the document with a more granular approach
   * With improved processing order to ensure consistent parent-child relationships
   */
  function findSections() {
    const sections = [];
    
    // Track processed elements to avoid duplicates with different types
    const processedElements = new Set();
    
    try {
      // Helper to add section if valid
      const addToSections = function(element, type, sections) {
        if (isValidSection(element) && !sections.some(s => s.element === element)) {
          // Prevent duplicate processing
          if (processedElements.has(element)) {
            return;
          }
          
          processedElements.add(element);
          sections.push({
            element: element,
            type: type
          });
        }
      };
      
      // ----------------
      // PRIORITY 1: Navigation Elements (process these first for consistency)
      // ----------------
      
      // IMPORTANT: Find main navigation wrapper first - highest priority for consistency
      // This is typically the first level container holding the navigation
      const navWrappers = document.querySelectorAll('.nav-wrapper, .nav-container, .navigation-wrapper, .navigation-container, .header-wrapper, header > div, .navbar-wrapper, .main-nav-wrapper');
      navWrappers.forEach(wrapper => {
        // Give top priority to these wrappers as they're often the structural container
        addToSections(wrapper, 'main-nav-wrapper', sections);
      });
      
      // Find navigation elements (these are crucial for cross-page consistency)
      const navElements = document.querySelectorAll('nav, [role="navigation"], header, .navbar, .navigation, [class*="navbar"], [class*="header"], [id*="nav"], [id*="menu"], [id*="header"]');
      navElements.forEach(nav => {
        addToSections(nav, 'navigation', sections);
        
        // Also add important children of navigation elements
        Array.from(nav.children).forEach(child => {
          if ((child.className && typeof child.className === 'string' && 
              (child.className.includes('nav') || 
               child.className.includes('menu') || 
               child.className.includes('links'))) ||
              child.tagName.toLowerCase() === 'ul' ||
              child.tagName.toLowerCase() === 'ol') {
            addToSections(child, 'nav-component', sections);
          }
        });
        
        // Special handling for parent container of nav elements
        // Often the direct parent is the wrapper that changes between pages
        if (nav.parentElement && 
            nav.parentElement !== document.body && 
            nav.parentElement.tagName.toLowerCase() !== 'main' &&
            !processedElements.has(nav.parentElement)) {
          addToSections(nav.parentElement, 'nav-parent-container', sections);
        }
      });
      
      // ----------------
      // Color Palette Generator Page - Specific Sections
      // ----------------
      
      // Find palette generator sections
      const generatorSections = document.querySelectorAll('.palette-generator, [id*="palette"], [class*="palette"]');
      generatorSections.forEach(section => {
        addToSections(section, 'generator', sections);
      });
      
      // Find all headings with content as sections
      const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
      headings.forEach(heading => {
        // Find the parent container of this heading
        let parentSection = heading.parentElement;
        if (parentSection && parentSection !== document.body) {
          addToSections(parentSection, 'section', sections);
        }
      });
      
      // Look for specific WCAG related sections
      const wcagSections = document.querySelectorAll('[class*="wcag"], [id*="wcag"], [class*="WCAG"], [id*="WCAG"]');
      wcagSections.forEach(section => {
        addToSections(section, 'wcag', sections);
      });
      
      // ----------------
      // Generic UI Components
      // ----------------
      
      // Method 1: Find main content sections first
      const mainSections = document.querySelectorAll('main, section, article, [role="main"] > div');
      mainSections.forEach(section => {
        addToSections(section, 'main', sections);
        
        // Look for direct children that are substantial sections
        Array.from(section.children).forEach(child => {
          // Only consider fairly substantial elements
          if (child.offsetHeight > 50 && child.offsetWidth > 50) {
            addToSections(child, 'sub-section', sections);
          }
        });
      });
      
      // Method 2: Find UI components by common class patterns
      [
        // UI Components
        '.card, [class*="card"], [class*="Card"]',
        '.panel, [class*="panel"], [class*="Panel"]',
        '.box, [class*="box"], [class*="Box"]',
        // Forms
        'form, [role="form"]',
        // Layout components
        '.container, [class*="container"], [class*="Container"]',
        '.wrapper, [class*="wrapper"], [class*="Wrapper"]',
        '.layout, [class*="layout"], [class*="Layout"]',
        // Interactive components
        '[class*="generator"], [id*="generator"]',
        '[class*="form-group"], [class*="form-section"]',
        // Results displays
        '[class*="results"], [id*="results"]',
        '[class*="output"], [id*="output"]',
        '.color-display, [class*="color-display"]'
      ].forEach(selector => {
        const elements = document.querySelectorAll(selector);
        elements.forEach(element => {
          // Avoid adding children of already added sections
          if (!isSectionChild(element, sections)) {
            // Get selector type for classification
            const type = selector.includes('card') ? 'card' 
                        : selector.includes('form') ? 'form'
                        : selector.includes('container') || selector.includes('wrapper') ? 'container'
                        : selector.includes('generator') ? 'generator'
                        : selector.includes('results') || selector.includes('output') ? 'results'
                        : 'component';
            
            addToSections(element, type, sections);
          }
        });
      });

      // Navigation elements were already processed at the beginning of the function
      
      // Look specifically for color palette output areas
      const colorOutputs = document.querySelectorAll('[class*="color-combination"], [class*="color-palette"], [class*="palette-output"]');
      colorOutputs.forEach(output => {
        addToSections(output, 'palette-output', sections);
      });
      
      // Find buttons groups - they're often important controls
      const buttonGroups = document.querySelectorAll('.btn-group, [class*="button-group"], [role="toolbar"]');
      buttonGroups.forEach(group => {
        addToSections(group, 'controls', sections);
      });
      
      // Special case: look for grid sections which are often results displays
      const gridSections = document.querySelectorAll('[class*="grid"]');
      gridSections.forEach(grid => {
        // Avoid tiny grids
        if (grid.offsetHeight > 100 && grid.offsetWidth > 100) {
          addToSections(grid, 'grid', sections);
        }
      });
      
      // Get React component containers
      const reactComponents = document.querySelectorAll('[class*="Component"], [class*="component"]');
      reactComponents.forEach(component => {
        if (!isSectionChild(component, sections)) {
          addToSections(component, 'react-component', sections);
        }
      });
      
    } catch (error) {
      console.warn('Error finding sections:', error);
    }
    
    return sections;
  }
  
  /**
   * Check if an element is a valid section - with more granular requirements
   */
  function isValidSection(element) {
    try {
      // Special case for navigation elements - these are ALWAYS valid
      // Nav elements are critical for cross-page consistency
      if (element.tagName.toLowerCase() === 'nav' || 
          element.getAttribute('role') === 'navigation' ||
          element.className && (
            element.className.includes('nav') || 
            element.className.includes('menu') ||
            element.className.includes('header')
          )) {
        return true;
      }
      
      // Get element dimensions
      const rect = element.getBoundingClientRect();
      
      // Skip extremely small elements (allowing more granular sections)
      // Relaxed from 100x100 to 50x50 to catch smaller UI elements
      if (rect.width < 50 || rect.height < 50) {
        return false;
      }
      
      // Skip hidden elements
      if (element.offsetParent === null) {
        return false;
      }
      
      // Skip elements with no meaningful content, but allow UI controls
      const hasUIControl = element.querySelector('button, input, select, textarea');
      const hasImage = element.querySelectorAll('img, svg').length > 0;
      const hasText = element.textContent.trim().length > 0;
      
      if (!hasText && !hasImage && !hasUIControl) {
        return false;
      }
      
      // Skip certain types of elements that are never sections
      const tagName = element.tagName.toLowerCase();
      if (['script', 'style', 'link', 'meta', 'head', 'html', 'body', 'br', 'hr'].includes(tagName)) {
        return false;
      }
      
      // Skip very simple inline elements
      if (['span', 'a', 'label', 'strong', 'em', 'i', 'b', 'u'].includes(tagName)) {
        // Unless they have specific classes that indicate they're components
        const classes = Array.from(element.classList);
        const isComponent = classes.some(cls => 
          cls.includes('component') || 
          cls.includes('container') || 
          cls.includes('card') || 
          cls.includes('button') || 
          cls.includes('control'));
          
        if (!isComponent) {
          return false;
        }
      }
      
      // Special case: identify palette generation regions
      if (element.className && typeof element.className === 'string') {
        if (element.className.includes('palette') || 
            element.className.includes('color-') || 
            element.className.includes('generator') ||
            element.id && element.id.includes('palette')) {
          // For palette-related elements, be more lenient with size
          return true;
        }
      }
      
      // Include all elements with IDs as they're likely important
      if (element.id && element.id.trim() !== '') {
        return true;
      }
      
      return true;
    } catch (error) {
      console.warn('Error checking if element is valid section:', error);
      return false;
    }
  }
  
  /**
   * Check if an element is a child of an existing section
   */
  function isSectionChild(element, sections) {
    try {
      return sections.some(function(section) {
        return section.element.contains(element) && section.element !== element;
      });
    } catch (error) {
      console.warn('Error checking if element is section child:', error);
      return false;
    }
  }
  
  /**
   * Create an identifier for a section with enhanced tooltip and appearance
   */
  function createIdentifier(section, index) {
    try {
      const element = section.element;
      const type = section.type;
      
      // Create the identifier element
      const identifier = document.createElement('div');
      identifier.className = 'section-identifier';
      identifier.textContent = index;
      identifier.setAttribute('data-section-type', type);
      identifier.setAttribute('data-global-id', index); // Add global ID attribute
      
      // Add additional information
      const elementId = element.id ? '#' + element.id : '';
      const elementClass = Array.from(element.classList).map(c => '.' + c).join('');
      const elementTag = element.tagName.toLowerCase();
      
      // Get element dimensions for tooltip
      const rect = element.getBoundingClientRect();
      const width = Math.round(rect.width);
      const height = Math.round(rect.height);
      
      // Get element content summary
      let contentSummary = '';
      if (element.textContent) {
        const text = element.textContent.trim();
        if (text.length > 0) {
          // Get first 50 chars of content as a preview (expanded from 30)
          contentSummary = text.length > 50 ? 
            text.substring(0, 50) + '...' : 
            text;
        }
      }
      
      // Get heading content if present
      const headingElement = element.querySelector('h1, h2, h3, h4, h5, h6');
      const headingText = headingElement ? headingElement.textContent.trim() : '';
      
      // Count child elements by type
      const childButtonCount = element.querySelectorAll('button').length;
      const childInputCount = element.querySelectorAll('input, select, textarea').length;
      const childLinkCount = element.querySelectorAll('a').length;
      const childImgCount = element.querySelectorAll('img, svg').length;
      const childCount = element.children.length;
      
      // Get all the different types of child elements
      const childTypes = {};
      Array.from(element.children).forEach(child => {
        const tagName = child.tagName.toLowerCase();
        childTypes[tagName] = (childTypes[tagName] || 0) + 1;
      });
      
      // Format child types for display
      const childTypesFormatted = Object.entries(childTypes)
        .map(([tag, count]) => `${tag}: ${count}`)
        .join(', ');
      
      // Get any ARIA attributes with better formatting
      const ariaAttributes = [];
      for (let i = 0; i < element.attributes.length; i++) {
        const attr = element.attributes[i];
        if (attr.name.startsWith('aria-') || attr.name === 'role') {
          ariaAttributes.push(`${attr.name}="${attr.value}"`);
        }
      }
      
      // Find event handlers (if possible in this browser)
      const hasClickHandler = element.onclick || element.getAttribute('onclick');
      const hasChangeHandler = element.onchange || element.getAttribute('onchange');
      const hasSubmitHandler = element.onsubmit || element.getAttribute('onsubmit');
      const hasKeyboardHandler = 
        element.onkeyup || element.onkeydown || element.onkeypress ||
        element.getAttribute('onkeyup') || element.getAttribute('onkeydown') || element.getAttribute('onkeypress');
      
      // Event handler information
      const eventHandlers = [];
      if (hasClickHandler) eventHandlers.push('click');
      if (hasChangeHandler) eventHandlers.push('change');
      if (hasSubmitHandler) eventHandlers.push('submit');
      if (hasKeyboardHandler) eventHandlers.push('keyboard');
      
      // Check for interactive elements with improved organization
      const interactiveInfo = [];
      if (childButtonCount > 0) interactiveInfo.push(`${childButtonCount} button(s)`);
      if (childInputCount > 0) interactiveInfo.push(`${childInputCount} form field(s)`);
      if (childLinkCount > 0) interactiveInfo.push(`${childLinkCount} link(s)`);
      if (childImgCount > 0) interactiveInfo.push(`${childImgCount} image(s)`);
      
      // Generate a unique selector for this element (for developer reference)
      const elementPath = generateElementPath(element);
      const shortPath = elementPath.length > 80 ? elementPath.substring(0, 80) + '...' : elementPath;
      
      // Structured data for tooltip
      const tooltipData = {
        id: `${index}`,
        type: type,
        element: `${elementTag}${elementId}${elementClass}`,
        size: `${width}×${height}px`,
        children: childCount > 0 ? `${childCount} total` + (childTypesFormatted ? ` (${childTypesFormatted})` : '') : null,
        aria: ariaAttributes.length > 0 ? ariaAttributes.join(', ') : null,
        interactive: interactiveInfo.length > 0 ? interactiveInfo.join(', ') : null,
        events: eventHandlers.length > 0 ? eventHandlers.join(', ') : null,
        heading: headingText || null,
        content: contentSummary || null,
        path: shortPath
      };
      
      // Store the tooltip data as a JSON string for the custom tooltip
      identifier.setAttribute('data-tooltip-json', JSON.stringify(tooltipData));
      
      // Also build a plain text version for fallback
      const tooltipInfo = [
        `ID: ${tooltipData.id} (${tooltipData.type})`,
        `Element: ${tooltipData.element}`,
        `Size: ${tooltipData.size}`,
        tooltipData.children ? `Children: ${tooltipData.children}` : '',
        tooltipData.aria ? `ARIA: ${tooltipData.aria}` : '',
        tooltipData.interactive ? `Interactive: ${tooltipData.interactive}` : '',
        tooltipData.events ? `Events: ${tooltipData.events}` : '',
        tooltipData.heading ? `Heading: ${tooltipData.heading}` : '',
        tooltipData.content ? `Content: "${tooltipData.content}"` : '',
        `Path: ${tooltipData.path}`
      ].filter(Boolean).join('\n');
      
      identifier.setAttribute('data-info', tooltipInfo);
      identifier.setAttribute('title', tooltipInfo); // Fallback tooltip
      
      // Set bright pink color for high visibility with improved styling
      // Make navigation elements stand out with special styling
      if (type === 'navigation' || type === 'nav-component') {
        identifier.style.backgroundColor = '#FF00FF'; // Magenta for nav elements
        identifier.style.color = 'white';
        identifier.style.fontWeight = 'bold';
        identifier.style.zIndex = '10000'; // Even higher z-index for nav elements
        identifier.style.boxShadow = '0 0 0 2px yellow'; // Yellow outline for extreme visibility
        identifier.style.border = '1px solid white'; // Extra border for navigation elements
      } else {
        identifier.style.backgroundColor = '#FF1493'; // Deep Pink for regular elements
        identifier.style.color = 'white';
        identifier.style.fontWeight = 'bold';
        identifier.style.zIndex = '9999';
        identifier.style.boxShadow = '0 0 0 1px #fff'; // White outline for visibility
      }
      
      // Position the identifier correctly based on element position
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
      
      identifier.style.top = rect.top + scrollTop + 'px';
      identifier.style.left = rect.left + scrollLeft + 'px';
      
      // Add custom tooltip event listeners
      identifier.addEventListener('mouseenter', function() {
        // Create or show tooltip
        showEnhancedTooltip(identifier, tooltipData);
      });
      
      identifier.addEventListener('mouseleave', function() {
        // Hide tooltip
        hideEnhancedTooltip();
      });
      
      // Append to document body (not to the element itself)
      document.body.appendChild(identifier);
      
      // Return the created identifier element
      return identifier;
    } catch (error) {
      console.warn('Error creating identifier:', error);
      return null;
    }
  }
  
  /**
   * Show enhanced tooltip with structured data
   */
  function showEnhancedTooltip(identifier, data) {
    try {
      // Remove any existing tooltips
      hideEnhancedTooltip();
      
      // Create tooltip container
      const tooltip = document.createElement('div');
      tooltip.className = 'section-identifier-tooltip';
      tooltip.id = 'section-identifier-tooltip';
      
      // Create tooltip header
      const header = document.createElement('div');
      header.className = 'tooltip-header';
      header.innerHTML = `<strong>Section ID: ${data.id}</strong> <span class="tooltip-type">${data.type}</span>`;
      tooltip.appendChild(header);
      
      // Create tooltip content
      const content = document.createElement('div');
      content.className = 'tooltip-content';
      
      // Add all data sections
      const addSection = (title, value) => {
        if (value) {
          const section = document.createElement('div');
          section.className = 'tooltip-section';
          section.innerHTML = `<strong>${title}:</strong> ${value}`;
          content.appendChild(section);
        }
      };
      
      addSection('Element', data.element);
      addSection('Size', data.size);
      addSection('Children', data.children);
      
      // Group interaction info
      if (data.interactive || data.events || data.aria) {
        const interactionSection = document.createElement('div');
        interactionSection.className = 'tooltip-section interaction';
        
        let interactionContent = '<strong>Interaction:</strong> ';
        if (data.interactive) interactionContent += `<div>${data.interactive}</div>`;
        if (data.events) interactionContent += `<div>Events: ${data.events}</div>`;
        if (data.aria) interactionContent += `<div>ARIA: ${data.aria}</div>`;
        
        interactionSection.innerHTML = interactionContent;
        content.appendChild(interactionSection);
      }
      
      // Content info
      if (data.heading || data.content) {
        const contentSection = document.createElement('div');
        contentSection.className = 'tooltip-section content';
        
        let contentInfo = '<strong>Content:</strong> ';
        if (data.heading) contentInfo += `<div>Heading: "${data.heading}"</div>`;
        if (data.content) contentInfo += `<div>Text: "${data.content}"</div>`;
        
        contentSection.innerHTML = contentInfo;
        content.appendChild(contentSection);
      }
      
      // Add path info
      const pathSection = document.createElement('div');
      pathSection.className = 'tooltip-section path';
      pathSection.innerHTML = `<strong>Path:</strong> <span class="tooltip-path">${data.path}</span>`;
      content.appendChild(pathSection);
      
      tooltip.appendChild(content);
      
      // Position tooltip relative to identifier
      const identifierRect = identifier.getBoundingClientRect();
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
      
      // Add tooltip to document
      document.body.appendChild(tooltip);
      
      // Position after adding to get accurate size
      const tooltipRect = tooltip.getBoundingClientRect();
      
      // Check if tooltip would go outside viewport
      let left = identifierRect.right + scrollLeft + 10;
      let top = identifierRect.top + scrollTop;
      
      // If tooltip would go outside right edge, position it to the left
      if (left + tooltipRect.width > window.innerWidth) {
        left = identifierRect.left + scrollLeft - tooltipRect.width - 10;
      }
      
      // If tooltip would go outside bottom edge, adjust top position
      if (top + tooltipRect.height > window.innerHeight + scrollTop) {
        top = window.innerHeight + scrollTop - tooltipRect.height - 10;
      }
      
      // Keep it within top bounds too
      top = Math.max(scrollTop + 5, top);
      
      tooltip.style.left = left + 'px';
      tooltip.style.top = top + 'px';
      
      // Make tooltip visible
      tooltip.style.opacity = '1';
    } catch (error) {
      console.warn('Error showing enhanced tooltip:', error);
    }
  }
  
  /**
   * Hide enhanced tooltip
   */
  function hideEnhancedTooltip() {
    try {
      const existing = document.getElementById('section-identifier-tooltip');
      if (existing) {
        existing.remove();
      }
    } catch (error) {
      console.warn('Error hiding enhanced tooltip:', error);
    }
  }
  
  // Initialize when the DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSectionIdentifiers);
  } else {
    // If the page is already loaded, run initialization now
    initSectionIdentifiers();
  }
  
  // Handle dynamic page navigation in SPAs
  window.addEventListener('popstate', refreshIdentifiers);
  
  // Re-detect sections on window resize
  let resizeTimeout;
  window.addEventListener('resize', function() {
    if (resizeTimeout) {
      clearTimeout(resizeTimeout);
    }
    
    resizeTimeout = setTimeout(function() {
      if (document.body.classList.contains('section-identifiers-enabled')) {
        refreshIdentifiers();
      }
    }, 250);
  });
  
  /**
   * Reset all section identifiers to start fresh
   */
  function resetIdentifiers() {
    try {
      debugLog('Resetting all section identifiers');
      
      // Remove existing identifiers from DOM
      const existingIdentifiers = document.querySelectorAll('.section-identifier');
      existingIdentifiers.forEach(function(identifier) {
        identifier.remove();
      });
      
      // Reset global counter
      globalCounter = 1;
      
      // Clear all stored identifiers
      elementIdentifierMap.clear();
      
      // Force clearing in localStorage with error handling
      try {
        localStorage.removeItem(IDENTIFIERS_MAP_KEY);
        localStorage.removeItem(IDENTIFIERS_COUNTER_KEY);
        localStorage.setItem(IDENTIFIERS_COUNTER_KEY, "1"); // Reset to 1
        
        // Log successful reset
        console.log("✅ Section identifiers have been completely reset! All elements will now receive new IDs.");
      } catch (error) {
        console.warn("Error clearing localStorage during reset:", error);
      }
      
      // Force re-detection of all sections with fresh IDs
      setTimeout(function() {
        refreshIdentifiers();
        
        // Save the fresh data to localStorage
        saveIdentifiersData();
        
        debugLog('Section identifiers have been completely reset and regenerated');
      }, 100);
      
      return true;
    } catch (error) {
      console.warn('Error resetting section identifiers:', error);
      return false;
    }
  }
  
  /**
   * Save identifiers data to localStorage with throttling
   */
  let saveTimeout = null;
  function saveIdentifiersData() {
    // Clear any pending save operation
    if (saveTimeout) {
      clearTimeout(saveTimeout);
    }
    
    // Schedule a new save operation with a small delay to batch multiple saves
    saveTimeout = setTimeout(function() {
      try {
        // Try-catch blocks for each operation to ensure robustness
        try {
          // Save the counter with explicit validation
          const counterValue = globalCounter.toString();
          if (typeof counterValue === 'string' && counterValue.trim() !== '') {
            localStorage.setItem(IDENTIFIERS_COUNTER_KEY, counterValue);
            debugLog(`Saved counter value: ${counterValue}`);
          } else {
            console.warn('Invalid counter value, not saving to localStorage');
          }
        } catch (counterError) {
          console.warn('Error saving counter to localStorage:', counterError);
        }
        
        try {
          // Convert the map to a JSON-compatible object, but enforce validation
          const mapEntries = Array.from(elementIdentifierMap.entries())
            .filter(([key, value]) => typeof key === 'string' && key.trim() !== '' && typeof value === 'number');
            
          // Only save if we have valid entries
          if (mapEntries.length > 0) {
            const mapObject = Object.fromEntries(mapEntries);
            const jsonString = JSON.stringify(mapObject);
            
            // Verify the JSON string is valid before saving
            if (jsonString && jsonString.length > 2) { // must be at least "{}"
              localStorage.setItem(IDENTIFIERS_MAP_KEY, jsonString);
              debugLog(`Saved ${mapEntries.length} identifiers to localStorage`);
            } else {
              console.warn('Generated invalid JSON for map, not saving');
            }
          } else {
            console.warn('No valid map entries to save');
          }
        } catch (mapError) {
          console.warn('Error saving map to localStorage:', mapError);
        }
      } catch (e) {
        console.warn('Error in saveIdentifiersData:', e);
        
        // Try a more conservative approach for large maps
        if (elementIdentifierMap.size > 100) {
          try {
            // Just save the counter if the map is too large to save
            localStorage.setItem(IDENTIFIERS_COUNTER_KEY, globalCounter.toString());
            console.warn('Map too large, only saved counter');
          } catch (innerError) {
            console.error('Failed to save even the counter:', innerError);
          }
        }
      }
      
      // Clear the timeout reference
      saveTimeout = null;
    }, 250); // Throttle to prevent excessive storage operations
  }
  
  // Export API for debugging purpose only (not for application use)
  window._devSectionIdentifiers = {
    refresh: refreshIdentifiers,
    enable: function() { setEnabled(true); },
    disable: function() { setEnabled(false); },
    toggle: function() { setEnabled(!document.body.classList.contains('section-identifiers-enabled')); },
    reset: resetIdentifiers,
    saveData: saveIdentifiersData
  };
})();