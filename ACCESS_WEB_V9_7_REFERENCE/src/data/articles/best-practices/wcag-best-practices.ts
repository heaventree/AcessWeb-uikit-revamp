import type { Article } from '../../../types/blog';

export const wcagBestPractices: Article = {
  id: 'wcag-best-practices',
  slug: 'wcag-2-1-best-practices-and-patterns',
  title: 'WCAG 2.1 Best Practices and Design Patterns',
  description: 'A comprehensive collection of best practices, design patterns, and implementation strategies for meeting WCAG 2.1 accessibility standards.',
  content: `
# WCAG 2.1 Best Practices and Design Patterns

This guide provides practical best practices and proven design patterns for implementing WCAG 2.1 accessibility standards in your web applications.

## Core Best Practices

### 1. Semantic HTML First

Always prioritize semantic HTML over ARIA:

\`\`\`html
<!-- Bad: Divs with ARIA -->
<div role="navigation">
  <div role="list">
    <div role="listitem">Home</div>
  </div>
</div>

<!-- Good: Semantic HTML -->
<nav>
  <ul>
    <li><a href="/">Home</a></li>
  </ul>
</nav>
\`\`\`

### 2. Progressive Enhancement

Build with accessibility in mind from the start:

\`\`\`html
<!-- Bad: JavaScript-dependent button -->
<div onclick="handleClick()" class="button">
  Click Me
</div>

<!-- Good: Progressive enhancement -->
<button 
  type="button"
  onclick="handleClick()"
  class="button"
>
  Click Me
</button>
\`\`\`

### 3. Focus Management

Implement proper focus management:

\`\`\`typescript
function FocusManager() {
  const [focusableElements, setFocusableElements] = useState<HTMLElement[]>([]);
  
  useEffect(() => {
    // Get all focusable elements
    const elements = Array.from(
      document.querySelectorAll(
        'a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
    );
    
    setFocusableElements(elements as HTMLElement[]);
  }, []);

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Tab') {
      const currentIndex = focusableElements.indexOf(
        document.activeElement as HTMLElement
      );
      
      if (e.shiftKey) {
        // Move focus backward
        const prevIndex = (currentIndex - 1 + focusableElements.length) 
          % focusableElements.length;
        focusableElements[prevIndex].focus();
      } else {
        // Move focus forward
        const nextIndex = (currentIndex + 1) % focusableElements.length;
        focusableElements[nextIndex].focus();
      }
      
      e.preventDefault();
    }
  };

  return (
    <div onKeyDown={handleKeyDown}>
      {/* Content */}
    </div>
  );
}
\`\`\`

## Design Patterns

### 1. Accessible Modal

Create fully accessible modal dialogs:

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

### 2. Accessible Tabs

Implement accessible tab interfaces:

\`\`\`typescript
function AccessibleTabs({
  tabs
}: {
  tabs: Array<{ id: string; label: string; content: React.ReactNode; }>;
}) {
  const [activeTab, setActiveTab] = useState(tabs[0].id);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const currentIndex = tabs.findIndex(tab => tab.id === activeTab);
    
    switch (e.key) {
      case 'ArrowRight':
        const nextIndex = (currentIndex + 1) % tabs.length;
        setActiveTab(tabs[nextIndex].id);
        break;
      case 'ArrowLeft':
        const prevIndex = (currentIndex - 1 + tabs.length) % tabs.length;
        setActiveTab(tabs[prevIndex].id);
        break;
      case 'Home':
        setActiveTab(tabs[0].id);
        break;
      case 'End':
        setActiveTab(tabs[tabs.length - 1].id);
        break;
    }
  };

  return (
    <div className="tabs">
      <div
        role="tablist"
        onKeyDown={handleKeyDown}
        className="flex border-b"
      >
        {tabs.map(tab => (
          <button
            key={tab.id}
            role="tab"
            id={\`tab-\${tab.id}\`}
            aria-controls={\`panel-\${tab.id}\`}
            aria-selected={activeTab === tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={\`px-4 py-2 \${
              activeTab === tab.id
                ? 'border-b-2 border-blue-500'
                : 'text-gray-500'
            }\`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {tabs.map(tab => (
        <div
          key={tab.id}
          role="tabpanel"
          id={\`panel-\${tab.id}\`}
          aria-labelledby={\`tab-\${tab.id}\`}
          hidden={activeTab !== tab.id}
          className="p-4"
        >
          {tab.content}
        </div>
      ))}
    </div>
  );
}
\`\`\`

### 3. Accessible Forms

Create accessible form patterns:

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

## Testing Best Practices

### 1. Automated Testing

Set up comprehensive automated testing:

\`\`\`typescript
import { render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

describe('Accessibility Tests', () => {
  it('should have no accessibility violations', async () => {
    const { container } = render(<MyComponent />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should maintain proper focus management', () => {
    render(<MyComponent />);
    const button = screen.getByRole('button');
    button.focus();
    expect(document.activeElement).toBe(button);
  });

  it('should have proper ARIA attributes', () => {
    render(<MyComponent />);
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(dialog).toHaveAttribute('aria-labelledby');
  });
});
\`\`\`

### 2. Manual Testing

Create a comprehensive testing checklist:

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

Following WCAG 2.1 best practices requires a systematic approach to accessibility implementation. By using these patterns and following the testing guidelines, you can create web applications that are truly accessible to all users.

Remember that accessibility is an ongoing process that requires regular testing, monitoring, and updates to ensure your applications remain accessible as they evolve.
`,
  category: 'best-practices',
  tags: ['WCAG 2.1', 'Best Practices', 'Design Patterns', 'Implementation', 'Testing'],
  author: {
    name: 'Dr. Sarah Williams',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    role: 'Accessibility Expert'
  },
  publishedAt: '2024-03-19T19:00:00Z',
  readingTime: '20 min read',
  vectorImage: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
  tableOfContents: [
    { id: 'core-best-practices', title: 'Core Best Practices', level: 2 },
    { id: 'design-patterns', title: 'Design Patterns', level: 2 },
    { id: 'testing-best-practices', title: 'Testing Best Practices', level: 2 },
    { id: 'resources-and-tools', title: 'Resources and Tools', level: 2 }
  ]
};