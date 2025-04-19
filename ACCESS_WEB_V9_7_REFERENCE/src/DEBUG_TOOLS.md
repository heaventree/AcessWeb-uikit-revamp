# Development & Debugging Tools

This document provides information about the developer tools included in this application.

## Section Identifiers

Section Identifiers is a non-breaking feature that helps visualize the structure of the application by adding numbered labels to key sections and components.

### How to Use

1. A toggle button will appear in the top-right corner of the screen labeled "Section Identifiers"
2. Click the checkbox to enable/disable the section identifiers
3. Colored numbered labels will appear at the top-left corner of key sections
4. Hover over a label to see details about the element (tag, ID, classes)

### Types of Sections

Each section type is color-coded:

- **Red**: Main content sections
- **Green**: Article elements
- **Purple**: Card elements
- **Orange**: Form elements
- **Blue**: Other detected components

### Advanced Usage

For debugging in the console, you can use:

```javascript
// Enable section identifiers
window._devSectionIdentifiers.enable();

// Disable section identifiers
window._devSectionIdentifiers.disable();

// Toggle section identifiers
window._devSectionIdentifiers.toggle();

// Force refresh section identifiers
window._devSectionIdentifiers.refresh();
```

### Implementation Details

The Section Identifiers system is implemented as a non-breaking feature that:

1. Uses isolated CSS and JavaScript files
2. Doesn't modify existing DOM elements
3. Only adds visual indicators on top of the existing UI
4. Stores preferences in localStorage
5. Automatically adapts to DOM changes through MutationObserver

### Troubleshooting

If section identifiers aren't showing correctly:

1. Check that the toggle is enabled
2. Try refreshing the page
3. Check the console for any warnings
4. Manually refresh using `window._devSectionIdentifiers.refresh()`