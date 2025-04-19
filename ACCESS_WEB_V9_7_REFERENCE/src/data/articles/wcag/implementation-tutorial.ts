import type { Article } from '../../../types/blog';

export const wcagImplementationTutorial: Article = {
  id: 'wcag-implementation-tutorial',
  slug: 'wcag-2-1-implementation-tutorial-practical-guide',
  title: 'WCAG 2.1 Implementation Tutorial: A Practical Guide',
  description: 'A hands-on tutorial for implementing WCAG 2.1 accessibility standards in your web applications, with practical code examples and best practices.',
  content: `
# WCAG 2.1 Implementation Tutorial: A Practical Guide

This hands-on tutorial will guide you through implementing WCAG 2.1 accessibility standards in your web applications. We'll cover practical examples, common patterns, and best practices for creating accessible user interfaces.

## Setting Up Accessibility Infrastructure

### 1. Basic HTML Structure

Start with a properly structured HTML document:

\`\`\`html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Accessible Web Application</title>
  
  <!-- Preload Critical Resources -->
  <link 
    rel="preload" 
    href="/fonts/inter-var.woff2" 
    as="font" 
    type="font/woff2" 
    crossorigin
  >
</head>
<body>
  <!-- Skip Link -->
  <a href="#main" class="skip-link">
    Skip to main content
  </a>

  <!-- Header -->
  <header role="banner">
    <nav role="navigation" aria-label="Main">
      <!-- Navigation Content -->
    </nav>
  </header>

  <!-- Main Content -->
  <main id="main" role="main">
    <!-- Page Content -->
  </main>

  <!-- Footer -->
  <footer role="contentinfo">
    <!-- Footer Content -->
  </footer>
</body>
</html>
\`\`\`

### 2. CSS Base Styles

Establish accessible base styles:

\`\`\`css
/* Base Accessibility Styles */
:root {
  /* System Font Stack */
  --font-system: system-ui, -apple-system, BlinkMacSystemFont, 
    'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  
  /* Spacing Scale */
  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-3: 1rem;
  --space-4: 1.5rem;
  --space-5: 2rem;
  
  /* Color Variables */
  --color-text: #1a1a1a;
  --color-background: #ffffff;
  --color-primary: #2563eb;
  --color-error: #dc2626;
  --color-success: #059669;
}

/* Base Styles */
html {
  font-family: var(--font-system);
  font-size: 100%;
  line-height: 1.5;
  color: var(--color-text);
  background-color: var(--color-background);
}

/* Focus Styles */
*:focus {
  outline: 3px solid var(--color-primary);
  outline-offset: 2px;
}

/* Skip Link */
.skip-link {
  position: absolute;
  top: -40px;
  left: 0;
  padding: var(--space-3);
  background: var(--color-primary);
  color: white;
  z-index: 100;
}

.skip-link:focus {
  top: 0;
}

/* Reduced Motion */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}

/* High Contrast Mode */
@media (forced-colors: active) {
  :root {
    --color-primary: CanvasText;
  }
}
\`\`\`

## Implementing Common Components

### 1. Accessible Navigation

Create a responsive, accessible navigation menu:

\`\`\`jsx
function Navigation({ items }) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  
  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    const menuItems = menuRef.current?.querySelectorAll('a');
    if (!menuItems?.length) return;
    
    const currentIndex = Array.from(menuItems).indexOf(document.activeElement);
    
    switch (e.key) {
      case 'ArrowDown':
      case 'ArrowRight':
        e.preventDefault();
        const nextIndex = (currentIndex + 1) % menuItems.length;
        menuItems[nextIndex].focus();
        break;
      case 'ArrowUp':
      case 'ArrowLeft':
        e.preventDefault();
        const prevIndex = (currentIndex - 1 + menuItems.length) % menuItems.length;
        menuItems[prevIndex].focus();
        break;
      case 'Home':
        e.preventDefault();
        menuItems[0].focus();
        break;
      case 'End':
        e.preventDefault();
        menuItems[menuItems.length - 1].focus();
        break;
    }
  };

  return (
    <nav role="navigation" aria-label="Main">
      <button
        aria-expanded={isOpen}
        aria-controls="nav-menu"
        onClick={() => setIsOpen(!isOpen)}
        className="nav-toggle"
      >
        <span className="sr-only">
          {isOpen ? 'Close menu' : 'Open menu'}
        </span>
        <span aria-hidden="true">☰</span>
      </button>

      <ul
        id="nav-menu"
        ref={menuRef}
        onKeyDown={handleKeyDown}
        className={\`nav-menu \${isOpen ? 'is-open' : ''}\`}
      >
        {items.map((item) => (
          <li key={item.id}>
            <a
              href={item.href}
              aria-current={item.isCurrent ? 'page' : undefined}
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
\`\`\`

### 2. Accessible Form Components

Create accessible form controls with proper validation:

\`\`\`jsx
function AccessibleForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [errors, setErrors] = useState({});
  
  const validateField = (name, value) => {
    switch (name) {
      case 'name':
        return value.trim() ? '' : 'Name is required';
      case 'email':
        return /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(value) 
          ? '' 
          : 'Valid email is required';
      case 'message':
        return value.trim().length >= 10 
          ? '' 
          : 'Message must be at least 10 characters';
      default:
        return '';
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    const error = validateField(name, value);
    if (error) {
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate all fields
    const newErrors = {};
    Object.keys(formData).forEach(field => {
      const error = validateField(field, formData[field]);
      if (error) newErrors[field] = error;
    });
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      // Focus first field with error
      const firstErrorField = Object.keys(newErrors)[0];
      document.getElementById(firstErrorField)?.focus();
      return;
    }
    
    // Submit form...
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="form-group">
        <label htmlFor="name">Name:</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          onBlur={handleBlur}
          aria-required="true"
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? 'name-error' : undefined}
        />
        {errors.name && (
          <div id="name-error" className="error" role="alert">
            {errors.name}
          </div>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          onBlur={handleBlur}
          aria-required="true"
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? 'email-error' : undefined}
        />
        {errors.email && (
          <div id="email-error" className="error" role="alert">
            {errors.email}
          </div>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="message">Message:</label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          onBlur={handleBlur}
          aria-required="true"
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? 'message-error' : undefined}
        />
        {errors.message && (
          <div id="message-error" className="error" role="alert">
            {errors.message}
          </div>
        )}
      </div>

      <button type="submit">Submit</button>
    </form>
  );
}
\`\`\`

### 3. Modal Dialog

Create an accessible modal dialog:

\`\`\`jsx
function AccessibleModal({ isOpen, onClose, title, children }) {
  const modalRef = useRef(null);
  const previousFocus = useRef(null);

  useEffect(() => {
    if (isOpen) {
      // Store current focus
      previousFocus.current = document.activeElement;
      // Focus modal
      modalRef.current?.focus();
      // Prevent page scroll
      document.body.style.overflow = 'hidden';
    } else {
      // Restore focus
      previousFocus.current?.focus();
      // Restore scroll
      document.body.style.overflow = '';
    }
  }, [isOpen]);

  // Handle keyboard events
  const handleKeyDown = (e) => {
    if (!isOpen) return;

    // Close on escape
    if (e.key === 'Escape') {
      onClose();
      return;
    }

    // Trap focus
    if (e.key === 'Tab') {
      const focusableElements = modalRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="modal-backdrop"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className="modal"
        onKeyDown={handleKeyDown}
        tabIndex="-1"
      >
        <header className="modal-header">
          <h2 id="modal-title">{title}</h2>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="close-button"
          >
            ×
          </button>
        </header>

        <div className="modal-content">
          {children}
        </div>
      </div>
    </>
  );
}
\`\`\`

## Handling Dynamic Content

### 1. Loading States

Implement accessible loading indicators:

\`\`\`jsx
function LoadingSpinner({ isLoading, loadingText = 'Loading...' }) {
  return isLoading ? (
    <div
      role="status"
      aria-live="polite"
      className="loading-spinner"
    >
      <svg
        className="spinner"
        viewBox="0 0 50 50"
        aria-hidden="true"
      >
        <circle
          className="path"
          cx="25"
          cy="25"
          r="20"
          fill="none"
          strokeWidth="5"
        />
      </svg>
      <span className="sr-only">{loadingText}</span>
    </div>
  ) : null;
}
\`\`\`

### 2. Live Regions

Implement live regions for dynamic updates:

\`\`\`jsx
function LiveAnnouncement({ message, type = 'polite' }) {
  return (
    <div
      role="status"
      aria-live={type}
      className="sr-only"
    >
      {message}
    </div>
  );
}

function NotificationSystem() {
  const [notifications, setNotifications] = useState([]);

  const addNotification = (message) => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message }]);
    
    // Remove after 5 seconds
    setTimeout(() => {
      setNotifications(prev => 
        prev.filter(note => note.id !== id)
      );
    }, 5000);
  };

  return (
    <>
      {/* Visual Notifications */}
      <div className="notifications-container">
        {notifications.map(note => (
          <div key={note.id} className="notification">
            {note.message}
          </div>
        ))}
      </div>

      {/* Screen Reader Announcements */}
      <LiveAnnouncement 
        message={notifications[notifications.length - 1]?.message} 
      />
    </>
  );
}
\`\`\`

## Testing Implementation

### 1. Automated Testing

Set up automated accessibility testing:

\`\`\`javascript
// Jest + Testing Library Example
import { render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

describe('AccessibleComponent', () => {
  it('should have no accessibility violations', async () => {
    const { container } = render(<AccessibleComponent />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have proper ARIA attributes', () => {
    render(<AccessibleComponent />);
    const element = screen.getByRole('button');
    expect(element).toHaveAttribute('aria-label');
  });
});
\`\`\`

### 2. Manual Testing Checklist

Create a testing checklist:

\`\`\`javascript
const accessibilityChecklist = {
  keyboard: [
    'All interactive elements are focusable',
    'Focus order is logical',
    'Focus indicator is visible',
    'No keyboard traps',
    'Shortcuts work as expected'
  ],
  screenReader: [
    'All content is announced',
    'Headings are properly structured',
    'Images have alt text',
    'Forms have proper labels',
    'Live regions work'
  ],
  visual: [
    'Color contrast meets WCAG requirements',
    'Text is readable at 200% zoom',
    'Layout works at all breakpoints',
    'Focus indicators are visible'
  ],
  interaction: [
    'Touch targets are large enough',
    'Error messages are clear',
    'Required fields are marked',
    'Time limits are adjustable'
  ]
};
\`\`\`

## Best Practices and Tips

### 1. Progressive Enhancement

Build with accessibility in mind from the start:

\`\`\`javascript
// Instead of relying on JavaScript for basic functionality
const button = document.createElement('button');
button.onclick = () => showMenu();

// Use HTML first, enhance with JavaScript
<button
  type="button"
  onClick={showMenu}
  onKeyDown={handleKeyboard}
>
  Menu
</button>
\`\`\`

### 2. Semantic HTML

Use semantic elements whenever possible:

\`\`\`html
<!-- Instead of -->
<div class="button" onclick="submit()">Submit</div>

<!-- Use -->
<button type="submit">Submit</button>

<!-- Instead of -->
<div class="navigation">
  <div class="navigation-item">Home</div>
</div>

<!-- Use -->
<nav>
  <ul>
    <li><a href="/">Home</a></li>
  </ul>
</nav>
\`\`\`

### 3. ARIA Use

Follow the ARIA authoring practices:

\`\`\`html
<!-- Use ARIA only when necessary -->
<button aria-expanded="false" aria-controls="menu">
  Toggle Menu
</button>

<!-- Don't override semantic HTML with ARIA -->
<button role="button"> <!-- Redundant! -->
  Click Me
</button>
\`\`\`

## Resources and Tools

### Development Tools
- [axe DevTools](https://www.deque.com/axe/)
- [WAVE Web Accessibility Tool](https://wave.webaim.org/)
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)
- [Color Contrast Analyzer](https://www.tpgi.com/color-contrast-checker/)

### Testing Resources
- [NVDA Screen Reader](https://www.nvaccess.org/)
- [VoiceOver (Mac)](https://www.apple.com/accessibility/mac/vision/)
- [Keyboard Navigation Testing](https://webaim.org/techniques/keyboard/)
- [ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)

## Conclusion

Implementing WCAG 2.1 standards requires attention to detail and a commitment to accessibility throughout the development process. By following these implementation guidelines and regularly testing your work, you can create web applications that are truly accessible to all users.

Remember that accessibility is an ongoing process. Keep learning, testing, and improving your implementations to ensure the best possible experience for all users.
`,
  category: 'wcag',
  tags: ['WCAG 2.1', 'Accessibility', 'Implementation', 'Web Development', 'Tutorial'],
  author: {
    name: 'Dr. Sarah Williams',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    role: 'Accessibility Expert'
  },
  publishedAt: '2024-03-19T14:00:00Z',
  readingTime: '20 min read',
  vectorImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
  tableOfContents: [
    { id: 'setting-up-accessibility-infrastructure', title: 'Setting Up Accessibility Infrastructure', level: 2 },
    { id: 'implementing-common-components', title: 'Implementing Common Components', level: 2 },
    { id: 'handling-dynamic-content', title: 'Handling Dynamic Content', level: 2 },
    { id: 'testing-implementation', title: 'Testing Implementation', level: 2 },
    { id: 'best-practices-and-tips', title: 'Best Practices and Tips', level: 2 },
    { id: 'resources-and-tools', title: 'Resources and Tools', level: 2 }
  ]
};