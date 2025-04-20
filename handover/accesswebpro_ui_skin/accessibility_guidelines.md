# AccessWebPro Accessibility Guidelines

This document provides comprehensive accessibility guidelines to ensure that the AccessWebPro UI skin meets WCAG 2.1 AA standards, while striving for AAA where possible.

## Core Principles

### 1. Perceivable
Information and user interface components must be presentable to users in ways they can perceive.

### 2. Operable
User interface components and navigation must be operable.

### 3. Understandable
Information and the operation of the user interface must be understandable.

### 4. Robust
Content must be robust enough that it can be interpreted by a wide variety of user agents, including assistive technologies.

## Implementation Guidelines

### Color Contrast

#### Requirements
- Normal text (less than 18pt or 14pt bold): Minimum contrast ratio of 4.5:1 (AA) or 7:1 (AAA)
- Large text (at least 18pt or 14pt bold): Minimum contrast ratio of 3:1 (AA) or 4.5:1 (AAA)
- UI components and graphical objects: Minimum contrast ratio of 3:1

#### Implementation
- Use the AccessWebPro contrast checking utility to verify all color combinations
- Primary text color (#111827) on white background has a contrast ratio of 16.1:1, exceeding AAA requirements
- Primary brand color (#0fae96) should only be used for large text or UI components, not for body text

#### Example
```jsx
// Good practice - sufficient contrast
<p className="text-gray-900 dark:text-white">High contrast text</p>

// Bad practice - insufficient contrast
<p className="text-gray-400">Low contrast text</p>
```

### Focus States

#### Requirements
- All interactive elements must have a visible focus indicator
- Focus indicators must have sufficient contrast against the background
- Focus states should be consistent throughout the application

#### Implementation
- Use the following focus styles for all interactive elements:
  ```css
  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0fae96] focus-visible:ring-offset-2
  ```
- Ensure focus order follows a logical sequence (typically document order)
- Never remove focus indicators with `outline: none` without providing an alternative

#### Example
```jsx
<button className="px-4 py-2 rounded-full bg-[#0066FF] text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0fae96] focus-visible:ring-offset-2">
  Accessible Button
</button>
```

### Text & Typography

#### Requirements
- Base font size should be at least 16px (1rem)
- Line height should be at least 1.5 for body text
- Text should be resizable up to 200% without loss of content or functionality
- Do not use text as images; use actual text with appropriate styling

#### Implementation
- Use relative units (rem, em) for font sizes, not px
- Apply the following base typography:
  ```css
  body {
    font-size: 16px;
    line-height: 1.5;
    font-weight: 400;
  }
  ```
- Ensure text has sufficient contrast against its background

#### Example
```jsx
// Good practice - using relative units
<p className="text-base leading-relaxed">Readable text with good line height</p>

// Bad practice - using fixed pixels
<p style={{ fontSize: '12px', lineHeight: '1.2' }}>Too small with tight line height</p>
```

### Keyboard Navigation

#### Requirements
- All interactive elements must be keyboard accessible
- Custom components must use appropriate ARIA roles and keyboard interactions
- Keyboard focus must be visible at all times
- Avoid keyboard traps where focus cannot move away from a component

#### Implementation
- Use semantic HTML elements whenever possible (`button`, `a`, `input`, etc.)
- For custom components, implement keyboard event handlers (Enter, Space, arrow keys)
- Test all interactive elements using only the keyboard

#### Example
```jsx
// Good practice - semantic button element
<button onClick={handleAction} className="...">Action</button>

// Bad practice - non-interactive div with onClick
<div onClick={handleAction} className="...">Not keyboard accessible</div>
```

### Screen Reader Support

#### Requirements
- All images must have appropriate alt text
- Form controls must have associated labels
- ARIA attributes should be used appropriately when native HTML is insufficient
- Semantic HTML should be used for structure (headings, landmarks, lists)

#### Implementation
- Use semantic HTML elements (`nav`, `main`, `section`, `h1-h6`, etc.)
- Add `aria-label` or `aria-labelledby` to elements that require additional context
- Use `aria-expanded`, `aria-controls`, and `aria-hidden` appropriately

#### Example
```jsx
// Good practice - proper alt text and semantic structure
<figure>
  <img src="chart.png" alt="Chart showing accessibility compliance rates by industry" />
  <figcaption>Figure 1: Industry compliance comparison</figcaption>
</figure>

// Bad practice - missing alt text
<img src="chart.png" />
```

### Responsive Design & Zoom Support

#### Requirements
- Content must be accessible when zoomed to 200%
- Layouts should be responsive and adapt to different viewport sizes
- Avoid horizontal scrolling at standard viewport widths
- Touch targets should be at least 44x44 pixels

#### Implementation
- Use responsive design with Tailwind's breakpoint system
- Ensure all interactive elements have sufficient spacing
- Test layouts at various zoom levels (125%, 150%, 175%, 200%)

#### Example
```jsx
// Good practice - responsive layout with appropriate spacing
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  <button className="p-4">Large touch target</button>
</div>

// Bad practice - fixed width that causes horizontal scrolling
<div style={{ width: '1200px' }}>
  <button className="p-1">Small touch target</button>
</div>
```

### Form Accessibility

#### Requirements
- All form controls must have explicit labels
- Error messages should be clear and programmatically associated with the relevant field
- Required fields should be indicated both visually and programmatically
- Form validation should not rely solely on color

#### Implementation
- Use `<label>` elements with `htmlFor` attributes
- Apply `aria-invalid="true"` to fields with validation errors
- Use `aria-required="true"` for required fields
- Provide clear error messages with icons or patterns in addition to color

#### Example
```jsx
// Good practice - properly labeled form field with error state
<div>
  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
    Email Address <span className="text-red-500">*</span>
  </label>
  <input
    id="email"
    type="email"
    aria-required="true"
    aria-invalid={hasError}
    aria-describedby={hasError ? "email-error" : undefined}
    className={`mt-1 block w-full rounded-md ${
      hasError ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-[#0fae96] focus:ring-[#0fae96]'
    }`}
  />
  {hasError && (
    <p id="email-error" className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center">
      <svg><!-- Error icon --></svg>
      <span>Please enter a valid email address</span>
    </p>
  )}
</div>
```

## WCAG-Specific Components

The AccessWebPro UI includes several specialized components to support accessibility goals:

### WCAG Compliance Badge

Use this component to indicate WCAG compliance levels for specific elements:

```jsx
<WCAGBadge level="AA" showTooltip={true} size="md" />
```

### Contrast Ratio Display

Use this component when showing color combinations:

```jsx
<ContrastRatio foreground="#111827" background="#FFFFFF" />
```

### Skip Navigation Link

Include at the top of each page to allow keyboard users to bypass navigation:

```jsx
<a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 focus:z-50 focus:p-4 focus:bg-white focus:text-[#0fae96]">
  Skip to main content
</a>
```

## Testing Methodology

### Automated Testing
- Run axe-core or similar tools to catch common issues
- Verify all pages meet WCAG 2.1 AA standards

### Manual Testing
- Test with keyboard only (Tab, Shift+Tab, Enter, Space, Arrow keys)
- Test with screen readers (NVDA, VoiceOver, JAWS)
- Test at various zoom levels (125%, 150%, 175%, 200%)
- Test with different color contrast settings

### User Testing
- Include users with disabilities in testing sessions
- Test with assistive technology users
- Address all feedback related to accessibility barriers

## Common Issues and Solutions

### Focus Management
- **Issue**: Focus is lost after modal dialogs close
- **Solution**: Return focus to the triggering element using `useRef` and `focus()`

### Color Contrast
- **Issue**: Brand colors fail contrast requirements for text
- **Solution**: Use darker shades of the brand color for text elements

### Keyboard Traps
- **Issue**: Custom dropdowns trap keyboard focus
- **Solution**: Implement proper keyboard event handlers, including Escape key to close

### Missing Alternative Text
- **Issue**: Decorative images have meaningless alt text
- **Solution**: Use `alt=""` for decorative images, meaningful alt text for informative images

## Compliance Checklist

Use this checklist before finalizing any component or page:

- [ ] All text meets contrast requirements (4.5:1 for normal text, 3:1 for large text)
- [ ] All interactive elements have visible focus states
- [ ] All interactive elements are keyboard accessible
- [ ] All images have appropriate alt text
- [ ] Form fields have associated labels
- [ ] Error messages are clear and programmatically associated
- [ ] Page is navigable with screen readers
- [ ] Content is accessible at 200% zoom
- [ ] ARIA attributes are used correctly
- [ ] Semantic HTML is used for page structure