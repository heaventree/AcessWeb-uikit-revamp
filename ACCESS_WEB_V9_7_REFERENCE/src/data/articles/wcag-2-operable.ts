import type { Article } from '../../types/blog';

export const operableArticle: Article = {
  id: 'wcag-2-operable',
  slug: 'wcag-2-1-operable-understanding-the-second-principle',
  title: 'WCAG 2.1 Operable: Understanding the Second Principle',
  description: 'A comprehensive guide to making web interfaces operable for all users, covering keyboard accessibility, timing, navigation, and input modalities.',
  content: `
# WCAG 2.1 Operable: Understanding the Second Principle

User interface components and navigation must be operable. This means that users must be able to operate the interface successfully, regardless of how they interact with the web.

## Understanding Operable Interfaces

The Operable principle ensures that all users can interact with your website's functionality, whether they're using a keyboard, mouse, touch screen, or assistive technology.

### Why Operability Matters

Consider these scenarios:

* Many users rely exclusively on keyboard navigation
* Some users need more time to complete tasks
* Users with motor impairments may have difficulty with precise movements
* Mobile users need touch-friendly interfaces

## 2.1 Keyboard Accessible

### Making Content Keyboard Accessible

All functionality must be available using only a keyboard:

\`\`\`html
<!-- Good Example -->
<button onclick="doSomething()" onkeypress="doSomething()">
  Click or press Enter
</button>

<!-- Better Example using semantic HTML -->
<button onclick="doSomething()">
  Click or press Enter
</button>

<!-- Poor Example -->
<div onclick="doSomething()">
  Click here
</div>
\`\`\`

### Focus Management

* Visible focus indicators
* Logical focus order
* No keyboard traps
* Skip navigation links

\`\`\`css
/* Enhance focus visibility */
:focus {
  outline: 3px solid #2563eb;
  outline-offset: 2px;
}

/* Hide skip link by default */
.skip-link {
  position: absolute;
  top: -40px;
  left: 0;
  background: #2563eb;
  color: white;
  padding: 8px;
  z-index: 100;
}

/* Show skip link on focus */
.skip-link:focus {
  top: 0;
}
\`\`\`

## 2.2 Enough Time

### Time Adjustments

Users must have enough time to read and use content:

* Adjustable time limits
* Pause, stop, or hide moving content
* No interruptions
* Re-authentication without data loss

\`\`\`javascript
// Good Example - Adjustable Timer
class SessionTimer {
  constructor(initialTime = 3600) {
    this.timeLeft = initialTime;
    this.isPaused = false;
  }

  extend() {
    this.timeLeft += 1800; // Add 30 minutes
  }

  pause() {
    this.isPaused = true;
  }

  resume() {
    this.isPaused = false;
  }
}
\`\`\`

## 2.3 Seizures and Physical Reactions

### Preventing Harmful Content

Content must not cause seizures or physical reactions:

* No flashing content
* Three flashes or below threshold
* Animation from interactions

\`\`\`css
/* Reduce motion when preferred */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
\`\`\`

## 2.4 Navigable

### Making Content Navigable

Users must be able to navigate, find content, and determine where they are:

* Descriptive page titles
* Meaningful sequence
* Multiple ways to find pages
* Clear headings and labels
* Visible focus indication

\`\`\`html
<!DOCTYPE html>
<html lang="en">
<head>
  <title>Product Catalog - Sports Equipment - ExampleStore</title>
</head>
<body>
  <nav aria-label="Main">
    <ul role="menubar">
      <li role="menuitem"><a href="/">Home</a></li>
      <li role="menuitem"><a href="/products">Products</a></li>
      <li role="menuitem" aria-current="page">Sports Equipment</li>
    </ul>
  </nav>
  
  <main>
    <h1>Sports Equipment</h1>
    <nav aria-label="Breadcrumb">
      <ol>
        <li><a href="/">Home</a></li>
        <li><a href="/products">Products</a></li>
        <li>Sports Equipment</li>
      </ol>
    </nav>
  </main>
</body>
</html>
\`\`\`

## 2.5 Input Modalities

### Supporting Different Input Methods

Content must be operable through various input methods:

* Touch targets
* Pointer gestures
* Motion actuation
* Label in name
* Concurrent input mechanisms

\`\`\`css
/* Ensure touch targets are large enough */
.button {
  min-width: 44px;
  min-height: 44px;
  padding: 12px;
}

/* Provide spacing between touch targets */
.nav-link {
  margin: 4px;
  padding: 12px;
}
\`\`\`

## Implementation Checklist

* Ensure keyboard accessibility
* Provide adequate timing controls
* Avoid harmful content
* Implement clear navigation
* Support multiple input methods
* Test with various devices
* Validate focus management
* Check touch target sizes

## Common Mistakes to Avoid

* Keyboard traps
* Missing focus indicators
* Auto-advancing content
* Flashing content
* Poor navigation structure
* Small touch targets
* Motion-dependent controls
* Missing skip links

## Testing Your Implementation

1. Keyboard navigation testing
2. Focus order verification
3. Touch target size checking
4. Motion reduction testing
5. Navigation structure review
6. Input method validation
7. Timing control verification

## Resources and Tools

* [WebAIM Keyboard Accessibility Guide](https://webaim.org/techniques/keyboard/)
* [WCAG Understanding SC 2.1.1](https://www.w3.org/WAI/WCAG21/Understanding/keyboard)
* [Touch Target Size Calculator](https://www.w3.org/WAI/WCAG21/Techniques/general/G208)
* [Navigation Accessibility Guide](https://www.w3.org/WAI/tutorials/menus/)

## Conclusion

The Operable principle ensures that all users can interact with your website effectively, regardless of their input method or physical capabilities. By implementing these guidelines, you create interfaces that are truly accessible to everyone.

Remember: If users cannot operate your interface, they cannot use your website. Making your content operable is crucial for creating inclusive web experiences.
`,
  category: 'wcag',
  tags: ['WCAG 2.1', 'Accessibility', 'Operable', 'Keyboard', 'Navigation', 'Input'],
  author: {
    name: 'Dr. Sarah Williams',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    role: 'Accessibility Expert'
  },
  publishedAt: '2024-03-19T13:00:00Z',
  readingTime: '15 min read',
  vectorImage: 'https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
  wcagReference: 'WCAG2',
  tableOfContents: [
    { id: 'understanding-operable-interfaces', title: 'Understanding Operable Interfaces', level: 2 },
    { id: 'keyboard-accessible', title: '2.1 Keyboard Accessible', level: 2 },
    { id: 'enough-time', title: '2.2 Enough Time', level: 2 },
    { id: 'seizures-and-physical-reactions', title: '2.3 Seizures and Physical Reactions', level: 2 },
    { id: 'navigable', title: '2.4 Navigable', level: 2 },
    { id: 'input-modalities', title: '2.5 Input Modalities', level: 2 },
    { id: 'implementation-checklist', title: 'Implementation Checklist', level: 2 },
    { id: 'common-mistakes', title: 'Common Mistakes to Avoid', level: 2 },
    { id: 'testing', title: 'Testing Your Implementation', level: 2 },
    { id: 'resources', title: 'Resources and Tools', level: 2 }
  ]
};