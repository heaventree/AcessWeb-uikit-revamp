import type { Article } from '../../../types/blog';

export const implementationGuideArticle: Article = {
  id: 'implementation-guide',
  slug: 'web-accessibility-implementation-best-practices',
  title: 'Web Accessibility Implementation: Best Practices Guide',
  description: 'A comprehensive guide to implementing web accessibility best practices, including code examples, testing strategies, and common patterns.',
  content: `
# Web Accessibility Implementation: Best Practices Guide

This comprehensive guide covers practical implementation strategies and best practices for creating accessible web applications. Learn how to write accessible code, test effectively, and maintain accessibility throughout your development process.

## Foundational Principles

### Semantic HTML

Always start with proper semantic HTML structure:

\`\`\`html
<!-- Bad Example -->
<div class="header">
  <div class="nav">
    <div class="nav-item">Home</div>
  </div>
</div>

<!-- Good Example -->
<header>
  <nav>
    <ul>
      <li><a href="/">Home</a></li>
    </ul>
  </nav>
</header>
\`\`\`

### ARIA Usage

Follow the ARIA authoring practices:

\`\`\`html
<!-- Only use ARIA when necessary -->
<button 
  aria-expanded="false"
  aria-controls="menu-content"
>
  Toggle Menu
</button>

<!-- Don't override semantic HTML -->
<button role="button"> <!-- Redundant! -->
  Click Me
</button>
\`\`\`

## Common Patterns

### 1. Modal Dialogs

Create accessible modal dialogs:

\`\`\`typescript
function AccessibleModal({
  isOpen,
  onClose,
  title,
  children
}: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) {
  const modalRef = useRef<HTMLDivElement>(null);
  const previousFocus = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      // Store current focus
      previousFocus.current = document.activeElement as HTMLElement;
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

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className="fixed inset-0 flex items-center justify-center p-4"
        onKeyDown={handleKeyDown}
        tabIndex={-1}
      >
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
          <header className="p-4 border-b">
            <h2 id="modal-title" className="text-xl font-semibold">
              {title}
            </h2>
          </header>

          <div className="p-4">
            {children}
          </div>

          <footer className="p-4 border-t">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 rounded-lg"
            >
              Close
            </button>
          </footer>
        </div>
      </div>
    </>
  );
}
\`\`\`

### 2. Navigation Menus

Implement accessible navigation:

\`\`\`typescript
function AccessibleNavigation({
  items
}: {
  items: Array<{ href: string; label: string; }>
}) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLUListElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const menuItems = menuRef.current?.querySelectorAll('a');
    if (!menuItems?.length) return;

    const currentIndex = Array.from(menuItems).indexOf(
      document.activeElement as HTMLAnchorElement
    );

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
    <nav aria-label="Main navigation">
      <button
        aria-expanded={isOpen}
        aria-controls="nav-menu"
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden"
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
        role="menubar"
      >
        {items.map((item) => (
          <li key={item.href} role="none">
            <a
              href={item.href}
              role="menuitem"
              className="nav-link"
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

### 3. Form Controls

Create accessible form controls:

\`\`\`typescript
function AccessibleForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    // Validate fields
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      // Focus first field with error
      const firstError = Object.keys(newErrors)[0];
      document.getElementById(firstError)?.focus();
      return;
    }

    // Submit form...
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="space-y-6"
    >
      <div className="form-group">
        <label htmlFor="name" className="block text-sm font-medium">
          Name
          <span aria-hidden="true" className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          aria-required="true"
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? 'name-error' : undefined}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        />
        {errors.name && (
          <div
            id="name-error"
            className="mt-1 text-sm text-red-600"
            role="alert"
          >
            {errors.name}
          </div>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="email" className="block text-sm font-medium">
          Email
          <span aria-hidden="true" className="text-red-500">*</span>
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          aria-required="true"
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? 'email-error' : undefined}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        />
        {errors.email && (
          <div
            id="email-error"
            className="mt-1 text-sm text-red-600"
            role="alert"
          >
            {errors.email}
          </div>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="message" className="block text-sm font-medium">
          Message
          <span aria-hidden="true" className="text-red-500">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          rows={4}
          aria-required="true"
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? 'message-error' : undefined}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        />
        {errors.message && (
          <div
            id="message-error"
            className="mt-1 text-sm text-red-600"
            role="alert"
          >
            {errors.message}
          </div>
        )}
      </div>

      <button
        type="submit"
        className="px-4 py-2 bg-blue-600 text-white rounded-lg"
      >
        Submit
      </button>
    </form>
  );
}
\`\`\`

## Testing Strategies

### 1. Automated Testing

Set up automated accessibility testing:

\`\`\`typescript
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

### 2. Manual Testing

Create a manual testing checklist:

\`\`\`typescript
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

function AccessibilityTester() {
  const [results, setResults] = useState<Record<string, boolean>>({});

  const handleCheck = (category: string, item: string) => {
    setResults(prev => ({
      ...prev,
      [\`\${category}-\${item}\`]: !prev[\`\${category}-\${item}\`]
    }));
  };

  return (
    <div className="accessibility-tester">
      {Object.entries(accessibilityChecklist).map(([category, items]) => (
        <section key={category}>
          <h2>{category.charAt(0).toUpperCase() + category.slice(1)} Tests</h2>
          <ul>
            {items.map((item) => (
              <li key={item}>
                <label>
                  <input
                    type="checkbox"
                    checked={results[\`\${category}-\${item}\`] || false}
                    onChange={() => handleCheck(category, item)}
                  />
                  <span>{item}</span>
                </label>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
\`\`\`

## Maintenance and Monitoring

### 1. Accessibility Monitoring

Implement continuous monitoring:

\`\`\`typescript
class AccessibilityMonitor {
  private static instance: AccessibilityMonitor;
  private violations: Set<string> = new Set();
  private observers: Set<(violations: string[]) => void> = new Set();

  private constructor() {
    this.setupMutationObserver();
    this.setupIntersectionObserver();
  }

  static getInstance() {
    if (!AccessibilityMonitor.instance) {
      AccessibilityMonitor.instance = new AccessibilityMonitor();
    }
    return AccessibilityMonitor.instance;
  }

  private setupMutationObserver() {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach((node) => {
            if (node instanceof HTMLElement) {
              this.checkElement(node);
            }
          });
        }
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  private setupIntersectionObserver() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          this.checkElement(entry.target as HTMLElement);
        }
      });
    });

    document.querySelectorAll('*').forEach((element) => {
      observer.observe(element);
    });
  }

  private checkElement(element: HTMLElement) {
    // Check for common accessibility issues
    if (element instanceof HTMLImageElement && !element.alt) {
      this.addViolation(\`Missing alt text: \${element.src}\`);
    }

    if (element instanceof HTMLButtonElement && !element.textContent?.trim()) {
      this.addViolation(\`Empty button: \${element.outerHTML}\`);
    }

    const ariaLabel = element.getAttribute('aria-label');
    const ariaLabelledBy = element.getAttribute('aria-labelledby');
    if (ariaLabel && ariaLabelledBy) {
      this.addViolation(
        \`Both aria-label and aria-labelledby used: \${element.outerHTML}\`
      );
    }
  }

  private addViolation(violation: string) {
    this.violations.add(violation);
    this.notifyObservers();
  }

  private notifyObservers() {
    const violations = Array.from(this.violations);
    this.observers.forEach((observer) => observer(violations));
  }

  subscribe(callback: (violations: string[]) => void) {
    this.observers.add(callback);
    return () => this.observers.delete(callback);
  }

  getViolations() {
    return Array.from(this.violations);
  }

  clearViolations() {
    this.violations.clear();
    this.notifyObservers();
  }
}

// Example usage
function AccessibilityMonitoring() {
  const [violations, setViolations] = useState<string[]>([]);

  useEffect(() => {
    const monitor = AccessibilityMonitor.getInstance();
    const unsubscribe = monitor.subscribe(setViolations);
    return unsubscribe;
  }, []);

  return (
    <div className="accessibility-monitor">
      <h2>Accessibility Issues</h2>
      {violations.length > 0 ? (
        <ul className="violations-list">
          {violations.map((violation, index) => (
            <li key={index} className="text-red-600">
              {violation}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-green-600">
          No accessibility issues detected
        </p>
      )}
    </div>
  );
}
\`\`\`

## Resources and Tools

### Development Tools
- [axe DevTools](https://www.deque.com/axe/)
- [WAVE](https://wave.webaim.org/)
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)
- [React Axe](https://github.com/dequelabs/react-axe)

### Testing Tools
- [Jest Axe](https://github.com/nickcolley/jest-axe)
- [Cypress Axe](https://github.com/component-driven/cypress-axe)
- [Pa11y](https://pa11y.org/)
- [Accessibility Insights](https://accessibilityinsights.io/)

### Documentation
- [WAI-ARIA Practices](https://www.w3.org/WAI/ARIA/apg/)
- [MDN Accessibility Guide](https://developer.mozilla.org/en-US/docs/Web/Accessibility)
- [A11Y Project Patterns](https://www.a11yproject.com/patterns/)

## Conclusion

Implementing accessibility best practices requires attention to detail and a commitment to inclusive design throughout the development process. By following these guidelines and using the provided code examples, you can create web applications that are truly accessible to all users.

Remember that accessibility is an ongoing process that requires regular testing, monitoring, and updates to ensure your applications remain accessible as they evolve.
`,
  category: 'best-practices',
  tags: ['Accessibility', 'Implementation', 'Best Practices', 'Testing', 'Development'],
  author: {
    name: 'Dr. Sarah Williams',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    role: 'Accessibility Expert'
  },
  publishedAt: '2024-03-19T18:00:00Z',
  readingTime: '25 min read',
  vectorImage: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
  tableOfContents: [
    { id: 'foundational-principles', title: 'Foundational Principles', level: 2 },
    { id: 'common-patterns', title: 'Common Patterns', level: 2 },
    { id: 'testing-strategies', title: 'Testing Strategies', level: 2 },
    { id: 'maintenance-and-monitoring', title: 'Maintenance and Monitoring', level: 2 },
    { id: 'resources-and-tools', title: 'Resources and Tools', level: 2 }
  ]
};