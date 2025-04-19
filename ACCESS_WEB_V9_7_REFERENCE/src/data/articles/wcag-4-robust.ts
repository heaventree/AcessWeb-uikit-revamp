import type { Article } from '../../types/blog';

export const robustArticle: Article = {
  id: 'wcag-4-robust',
  slug: 'wcag-2-1-robust-understanding-the-fourth-principle',
  title: 'WCAG 2.1 Robust: Understanding the Fourth Principle',
  description: 'A comprehensive guide to making web content robust and compatible with current and future user tools, including assistive technologies.',
  content: `
# WCAG 2.1 Robust: Understanding the Fourth Principle

Content must be robust enough that it can be interpreted reliably by a wide variety of user agents, including assistive technologies. This principle ensures that your content remains accessible as technologies advance.

## Understanding Robust Content

The Robust principle focuses on ensuring your web content works with:

* Current and future web browsers
* Screen readers and other assistive technologies
* Different devices and platforms
* Future technologies as they emerge

### Why Robustness Matters

Consider these facts:

* Users rely on various assistive technologies
* Web technologies constantly evolve
* Devices and platforms continue to diversify
* Backward compatibility remains crucial

## 4.1 Compatible

### Ensuring Compatibility

Content must be compatible with current and future user tools:

\`\`\`html
<!-- Good Example - Valid HTML -->
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Accessible Page</title>
</head>
<body>
  <main>
    <h1>Main Content</h1>
    <p>Valid, well-structured content.</p>
  </main>
</body>
</html>

<!-- Bad Example - Invalid HTML -->
<html>
  <body>
    <h1>Missing DOCTYPE and language</h1>
    <p>Poorly structured content.
  </body>
\`\`\`

### Using ARIA Properly

Follow ARIA authoring practices:

\`\`\`html
<!-- Good Example - Proper ARIA Usage -->
<button 
  aria-expanded="false"
  aria-controls="menu"
  aria-label="Toggle menu"
>
  <span aria-hidden="true">☰</span>
</button>

<div 
  id="menu"
  role="menu"
  hidden
>
  <button role="menuitem">Option 1</button>
  <button role="menuitem">Option 2</button>
</div>

<!-- Bad Example - Improper ARIA Usage -->
<div 
  role="button"
  aria-label="Toggle menu"
  aria-expanded="false"
  onclick="toggleMenu()"
>
  Menu
</div>
\`\`\`

## Implementing Robust Components

### 1. Form Controls

Create robust form components:

\`\`\`typescript
function AccessibleForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    preferences: []
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form data
    const errors = validateForm(formData);
    if (errors.length > 0) {
      // Announce errors to screen readers
      announceErrors(errors);
      return;
    }
    
    // Process form...
  };

  return (
    <form 
      onSubmit={handleSubmit}
      noValidate
      aria-live="polite"
    >
      <div className="form-group">
        <label htmlFor="name">
          Name
          <span aria-hidden="true" className="required">*</span>
        </label>
        <input
          type="text"
          id="name"
          name="name"
          required
          aria-required="true"
          value={formData.name}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label htmlFor="email">
          Email
          <span aria-hidden="true" className="required">*</span>
        </label>
        <input
          type="email"
          id="email"
          name="email"
          required
          aria-required="true"
          value={formData.email}
          onChange={handleChange}
        />
      </div>

      <fieldset>
        <legend>Preferences</legend>
        <div className="checkbox-group">
          {preferences.map(pref => (
            <label key={pref.id}>
              <input
                type="checkbox"
                name="preferences"
                value={pref.id}
                checked={formData.preferences.includes(pref.id)}
                onChange={handlePreferenceChange}
              />
              {pref.label}
            </label>
          ))}
        </div>
      </fieldset>

      <button type="submit">Submit</button>
    </form>
  );
}
\`\`\`

### 2. Custom Components

Implement robust custom components:

\`\`\`typescript
interface TabProps {
  id: string;
  label: string;
  selected: boolean;
  onSelect: () => void;
}

function AccessibleTabs({ tabs, activeTab, onChange }) {
  const [focusedTab, setFocusedTab] = useState(activeTab);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const tabCount = tabs.length;
    const currentIndex = tabs.findIndex(tab => tab.id === focusedTab);

    switch (e.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        e.preventDefault();
        const nextIndex = (currentIndex + 1) % tabCount;
        setFocusedTab(tabs[nextIndex].id);
        break;
      case 'ArrowLeft':
      case 'ArrowUp':
        e.preventDefault();
        const prevIndex = (currentIndex - 1 + tabCount) % tabCount;
        setFocusedTab(tabs[prevIndex].id);
        break;
      case 'Home':
        e.preventDefault();
        setFocusedTab(tabs[0].id);
        break;
      case 'End':
        e.preventDefault();
        setFocusedTab(tabs[tabCount - 1].id);
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        onChange(focusedTab);
        break;
    }
  };

  return (
    <div className="tabs-container">
      <div
        role="tablist"
        onKeyDown={handleKeyDown}
        className="tabs-list"
      >
        {tabs.map(tab => (
          <button
            key={tab.id}
            role="tab"
            id={\`tab-\${tab.id}\`}
            aria-controls={\`panel-\${tab.id}\`}
            aria-selected={tab.id === activeTab}
            tabIndex={tab.id === focusedTab ? 0 : -1}
            onClick={() => onChange(tab.id)}
            onFocus={() => setFocusedTab(tab.id)}
            className={\`tab \${
              tab.id === activeTab ? 'active' : ''
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
          hidden={tab.id !== activeTab}
          className="tab-panel"
        >
          {tab.content}
        </div>
      ))}
    </div>
  );
}
\`\`\`

### 3. Error Handling

Implement robust error handling:

\`\`\`typescript
interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error to monitoring service
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          role="alert"
          className="error-boundary"
        >
          <h2>Something went wrong</h2>
          <p>
            We're sorry, but there was an error loading this content.
            Please try refreshing the page.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="refresh-button"
          >
            Refresh Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
\`\`\`

## Testing Robustness

### 1. Automated Testing

Set up comprehensive testing:

\`\`\`typescript
import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';

describe('Component Robustness', () => {
  it('should have valid HTML structure', () => {
    const { container } = render(<MyComponent />);
    expect(container).toBeValidHTML();
  });

  it('should have no accessibility violations', async () => {
    const { container } = render(<MyComponent />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should handle different screen sizes', () => {
    const { container } = render(<MyComponent />);
    
    // Test mobile view
    window.innerWidth = 375;
    fireEvent(window, new Event('resize'));
    expect(container).toMatchSnapshot('mobile');

    // Test desktop view
    window.innerWidth = 1024;
    fireEvent(window, new Event('resize'));
    expect(container).toMatchSnapshot('desktop');
  });

  it('should work with keyboard navigation', () => {
    render(<MyComponent />);
    const element = screen.getByRole('button');
    
    // Test keyboard interaction
    element.focus();
    fireEvent.keyDown(element, { key: 'Enter' });
    expect(screen.getByText('Activated')).toBeInTheDocument();
  });
});
\`\`\`

### 2. Cross-Browser Testing

Create a testing checklist:

\`\`\`typescript
const browserTestingChecklist = {
  modern: [
    'Chrome latest',
    'Firefox latest',
    'Safari latest',
    'Edge latest'
  ],
  legacy: [
    'Internet Explorer 11',
    'Older Safari versions',
    'Older Chrome versions'
  ],
  mobile: [
    'iOS Safari',
    'Chrome for Android',
    'Samsung Internet'
  ],
  assistive: [
    'NVDA',
    'VoiceOver',
    'JAWS',
    'TalkBack'
  ]
};

function BrowserTester() {
  const [results, setResults] = useState({});

  const runTests = async () => {
    // Run automated tests
    const testResults = {};
    
    for (const category in browserTestingChecklist) {
      testResults[category] = await Promise.all(
        browserTestingChecklist[category].map(async browser => {
          try {
            // Run tests for this browser
            return { browser, status: 'passed' };
          } catch (error) {
            return { browser, status: 'failed', error };
          }
        })
      );
    }
    
    setResults(testResults);
  };

  return (
    <div className="browser-tester">
      <button onClick={runTests}>Run Browser Tests</button>
      
      {Object.entries(results).map(([category, tests]) => (
        <div key={category}>
          <h3>{category}</h3>
          <ul>
            {tests.map(test => (
              <li key={test.browser}>
                {test.browser}: {test.status}
                {test.error && (
                  <span className="error">{test.error.message}</span>
                )}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
\`\`\`

## Common Mistakes to Avoid

1. **Invalid HTML**
   - Missing required attributes
   - Improper nesting
   - Unclosed elements

2. **Improper ARIA Usage**
   - Invalid role values
   - Conflicting attributes
   - Redundant roles

3. **Poor Error Handling**
   - Silent failures
   - Unclear error messages
   - No fallback content

4. **Incomplete Testing**
   - Limited browser testing
   - No assistive technology testing
   - Missing edge cases

## Resources and Tools

### Development Tools
- [HTML Validator](https://validator.w3.org/)
- [ARIA Validator](https://w3c.github.io/aria-validator/)
- [Browser Testing Tools](https://www.browserstack.com/)
- [Accessibility Testing Tools](https://www.deque.com/axe/)

### Documentation
- [ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
- [MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/Accessibility)
- [Can I Use](https://caniuse.com/)
- [WebAIM Articles](https://webaim.org/articles/)

## Conclusion

The Robust principle ensures your web content remains accessible across different technologies and over time. By following these guidelines and implementing proper testing procedures, you can create web applications that work reliably for all users.

Remember: If your content isn't robust, it may become inaccessible as technologies change. Making your content robust helps ensure long-term accessibility and compatibility.
`,
  category: 'wcag',
  tags: ['WCAG 2.1', 'Accessibility', 'Robust', 'Compatibility', 'Testing'],
  author: {
    name: 'Dr. Sarah Williams',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    role: 'Accessibility Expert'
  },
  publishedAt: '2024-03-19T15:00:00Z',
  readingTime: '16 min read',
  vectorImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
  wcagReference: 'WCAG4',
  tableOfContents: [
    { id: 'understanding-robust-content', title: 'Understanding Robust Content', level: 2 },
    { id: 'compatible', title: '4.1 Compatible', level: 2 },
    { id: 'implementing-robust-components', title: 'Implementing Robust Components', level: 2 },
    { id: 'testing-robustness', title: 'Testing Robustness', level: 2 },
    { id: 'common-mistakes', title: 'Common Mistakes to Avoid', level: 2 },
    { id: 'resources', title: 'Resources and Tools', level: 2 }
  ]
};