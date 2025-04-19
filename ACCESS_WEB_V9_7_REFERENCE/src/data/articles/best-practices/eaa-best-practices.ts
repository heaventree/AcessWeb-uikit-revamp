import type { Article } from '../../../types/blog';

export const eaaBestPractices: Article = {
  id: 'eaa-best-practices',
  slug: 'european-accessibility-act-best-practices-implementation',
  title: 'European Accessibility Act: Best Practices and Implementation Guide',
  description: 'A comprehensive guide to implementing European Accessibility Act (EAA) requirements, including best practices, implementation patterns, and compliance strategies.',
  content: `
# European Accessibility Act: Best Practices and Implementation Guide

This guide provides detailed best practices and implementation patterns for meeting European Accessibility Act (EAA) requirements in web applications.

## Core Requirements

### 1. Information Provision

Ensure information is provided through multiple channels:

\`\`\`typescript
interface ContentFormat {
  text: string;
  audio?: string;
  video?: string;
  braille?: string;
}

function AccessibleContent({
  content,
  formats
}: {
  content: string;
  formats: ContentFormat;
}) {
  return (
    <div className="accessible-content">
      <div className="text-content">
        {content}
      </div>
      
      <div className="alternative-formats">
        <h2>Alternative Formats</h2>
        
        {formats.audio && (
          <div className="audio-format">
            <h3>Audio Version</h3>
            <audio controls>
              <source src={formats.audio} type="audio/mpeg" />
              <a href={formats.audio}>Download Audio</a>
            </audio>
          </div>
        )}
        
        {formats.video && (
          <div className="video-format">
            <h3>Video Version</h3>
            <video controls>
              <source src={formats.video} type="video/mp4" />
              <a href={formats.video}>Download Video</a>
            </video>
          </div>
        )}
        
        {formats.braille && (
          <div className="braille-format">
            <h3>Braille Version</h3>
            <a href={formats.braille}>
              Download Braille Document (BRF)
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
\`\`\`

### 2. User Interface Components

Create accessible UI components:

\`\`\`typescript
interface UIComponentProps {
  label: string;
  description?: string;
  errorMessage?: string;
  required?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
}

function AccessibleUIComponent({
  label,
  description,
  errorMessage,
  required = false,
  disabled = false,
  children
}: UIComponentProps) {
  const id = useId();
  const descriptionId = description ? \`\${id}-description\` : undefined;
  const errorId = errorMessage ? \`\${id}-error\` : undefined;

  return (
    <div className="ui-component">
      <label
        htmlFor={id}
        className="component-label"
      >
        {label}
        {required && (
          <span className="required" aria-hidden="true">
            *
          </span>
        )}
      </label>
      
      {description && (
        <div
          id={descriptionId}
          className="component-description"
        >
          {description}
        </div>
      )}
      
      <div
        className={\`component-content \${
          disabled ? 'disabled' : ''
        } \${errorMessage ? 'has-error' : ''}\`}
      >
        {React.Children.map(children, child =>
          React.isValidElement(child)
            ? React.cloneElement(child, {
                id,
                'aria-describedby': [
                  descriptionId,
                  errorId
                ].filter(Boolean).join(' ') || undefined,
                'aria-required': required,
                'aria-invalid': !!errorMessage,
                disabled
              })
            : child
        )}
      </div>
      
      {errorMessage && (
        <div
          id={errorId}
          className="error-message"
          role="alert"
        >
          {errorMessage}
        </div>
      )}
    </div>
  );
}
\`\`\`

## Implementation Patterns

### 1. Language Support

Implement proper language handling:

\`\`\`typescript
interface LanguageOption {
  code: string;
  name: string;
  direction: 'ltr' | 'rtl';
}

function LanguageSelector({
  languages,
  current,
  onChange
}: {
  languages: LanguageOption[];
  current: string;
  onChange: (code: string) => void;
}) {
  return (
    <div className="language-selector">
      <label htmlFor="language-select">
        Select Language
      </label>
      
      <select
        id="language-select"
        value={current}
        onChange={(e) => onChange(e.target.value)}
        className="language-select"
      >
        {languages.map(lang => (
          <option
            key={lang.code}
            value={lang.code}
            lang={lang.code}
            dir={lang.direction}
          >
            {lang.name}
          </option>
        ))}
      </select>
    </div>
  );
}

function LocalizedContent({
  content,
  language
}: {
  content: Record<string, string>;
  language: string;
}) {
  return (
    <div
      lang={language}
      dir={language === 'ar' ? 'rtl' : 'ltr'}
    >
      {content[language] || content['en']}
    </div>
  );
}
\`\`\`

### 2. Input Methods

Support multiple input methods:

\`\`\`typescript
interface InputMethod {
  type: 'keyboard' | 'mouse' | 'touch' | 'voice';
  enabled: boolean;
}

function AccessibleInput({
  value,
  onChange,
  methods
}: {
  value: string;
  onChange: (value: string) => void;
  methods: InputMethod[];
}) {
  const [activeMethod, setActiveMethod] = useState<string>('keyboard');

  const handleVoiceInput = async () => {
    if ('webkitSpeechRecognition' in window) {
      const recognition = new webkitSpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        onChange(transcript);
      };
      
      recognition.start();
    }
  };

  return (
    <div className="accessible-input">
      <div className="input-methods">
        {methods.map(method => (
          <button
            key={method.type}
            onClick={() => setActiveMethod(method.type)}
            disabled={!method.enabled}
            aria-pressed={activeMethod === method.type}
            className={\`method-button \${
              activeMethod === method.type ? 'active' : ''
            }\`}
          >
            {method.type === 'voice' ? (
              <span onClick={handleVoiceInput}>
                Voice Input
              </span>
            ) : (
              method.type
            )}
          </button>
        ))}
      </div>

      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="input-field"
      />
    </div>
  );
}
\`\`\`

### 3. Error Prevention

Implement robust error prevention:

\`\`\`typescript
interface ValidationRule {
  test: (value: string) => boolean;
  message: string;
}

function ErrorPreventionForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validationRules: Record<string, ValidationRule[]> = {
    name: [
      {
        test: (value) => value.length >= 2,
        message: 'Name must be at least 2 characters'
      }
    ],
    email: [
      {
        test: (value) => /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(value),
        message: 'Please enter a valid email address'
      }
    ],
    phone: [
      {
        test: (value) => /^\\+?[\\d\\s-]{10,}$/.test(value),
        message: 'Please enter a valid phone number'
      }
    ]
  };

  const validateField = (name: string, value: string) => {
    const rules = validationRules[name] || [];
    for (const rule of rules) {
      if (!rule.test(value)) {
        return rule.message;
      }
    }
    return '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validate all fields
    const newErrors: Record<string, string> = {};
    Object.entries(formData).forEach(([name, value]) => {
      const error = validateField(name, value);
      if (error) {
        newErrors[name] = error;
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsSubmitting(false);
      return;
    }

    // Show confirmation dialog
    const confirmed = window.confirm(
      'Please review your information:\n\n' +
      \`Name: \${formData.name}\n\` +
      \`Email: \${formData.email}\n\` +
      \`Phone: \${formData.phone}\n\n\` +
      'Is this correct?'
    );

    if (confirmed) {
      try {
        // Submit form...
        console.log('Form submitted:', formData);
      } catch (error) {
        setErrors({
          submit: 'Failed to submit form. Please try again.'
        });
      }
    }

    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="form-group">
        <label htmlFor="name">Name</label>
        <input
          type="text"
          id="name"
          value={formData.name}
          onChange={(e) => {
            setFormData(prev => ({
              ...prev,
              name: e.target.value
            }));
            setErrors(prev => ({
              ...prev,
              name: ''
            }));
          }}
          onBlur={(e) => {
            const error = validateField('name', e.target.value);
            if (error) {
              setErrors(prev => ({
                ...prev,
                name: error
              }));
            }
          }}
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
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          value={formData.email}
          onChange={(e) => {
            setFormData(prev => ({
              ...prev,
              email: e.target.value
            }));
            setErrors(prev => ({
              ...prev,
              email: ''
            }));
          }}
          onBlur={(e) => {
            const error = validateField('email', e.target.value);
            if (error) {
              setErrors(prev => ({
                ...prev,
                email: error
              }));
            }
          }}
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
        <label htmlFor="phone">Phone</label>
        <input
          type="tel"
          id="phone"
          value={formData.phone}
          onChange={(e) => {
            setFormData(prev => ({
              ...prev,
              phone: e.target.value
            }));
            setErrors(prev => ({
              ...prev,
              phone: ''
            }));
          }}
          onBlur={(e) => {
            const error = validateField('phone', e.target.value);
            if (error) {
              setErrors(prev => ({
                ...prev,
                phone: error
              }));
            }
          }}
          aria-invalid={!!errors.phone}
          aria-describedby={errors.phone ? 'phone-error' : undefined}
        />
        {errors.phone && (
          <div id="phone-error" className="error" role="alert">
            {errors.phone}
          </div>
        )}
      </div>

      {errors.submit && (
        <div className="error" role="alert">
          {errors.submit}
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="submit-button"
      >
        {isSubmitting ? 'Submitting...' : 'Submit'}
      </button>
    </form>
  );
}
\`\`\`

## Testing and Compliance

### 1. Automated Testing

Set up comprehensive testing:

\`\`\`typescript
import { render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

describe('EAA Compliance Tests', () => {
  it('should have no accessibility violations', async () => {
    const { container } = render(<MyComponent />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should support keyboard navigation', () => {
    render(<MyComponent />);
    const element = screen.getByRole('button');
    element.focus();
    expect(document.activeElement).toBe(element);
  });

  it('should have proper ARIA attributes', () => {
    render(<MyComponent />);
    const element = screen.getByRole('textbox');
    expect(element).toHaveAttribute('aria-label');
    expect(element).toHaveAttribute('aria-required');
  });
});
\`\`\`

### 2. Manual Testing

Create a comprehensive testing checklist:

\`\`\`typescript
const eaaTestingChecklist = {
  information: [
    'Content available in multiple formats',
    'Clear and understandable presentation',
    'Proper language declarations',
    'Consistent terminology'
  ],
  interface: [
    'Multiple input methods supported',
    'Clear feedback mechanisms',
    'Error prevention and recovery',
    'Consistent navigation'
  ],
  compatibility: [
    'Works with assistive technologies',
    'Supports different browsers',
    'Functions across devices',
    'Maintains accessibility in updates'
  ],
  documentation: [
    'Accessibility features documented',
    'User instructions available',
    'Support information provided',
    'Regular updates maintained'
  ]
};

function ComplianceChecker() {
  const [results, setResults] = useState<Record<string, boolean>>({});

  const handleCheck = (category: string, item: string) => {
    setResults(prev => ({
      ...prev,
      [\`\${category}-\${item}\`]: !prev[\`\${category}-\${item}\`]
    }));
  };

  return (
    <div className="compliance-checker">
      {Object.entries(eaaTestingChecklist).map(([category, items]) => (
        <section key={category}>
          <h2>{category.charAt(0).toUpperCase() + category.slice(1)}</h2>
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

## Resources and Tools

### Development Tools
- [axe DevTools](https://www.deque.com/axe/)
- [WAVE](https://wave.webaim.org/)
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)
- [European Accessibility Checker](https://www.european-accessibility-checker.org/)

### Documentation
- [European Accessibility Act](https://ec.europa.eu/social/main.jsp?catId=1202)
- [EN 301 549](https://www.etsi.org/standards/get-standards)
- [WAI-ARIA Practices](https://www.w3.org/WAI/ARIA/apg/)
- [WCAG Guidelines](https://www.w3.org/WAI/standards-guidelines/wcag/)

### Training Resources
- [European Accessibility Training](https://www.accessibility.nl/en/training)
- [WAI Training Resources](https://www.w3.org/WAI/teach-advocate/)
- [Digital Accessibility Courses](https://www.accessibilityassociation.org/)

## Conclusion

Implementing EAA best practices requires a comprehensive approach that considers both technical implementation and organizational processes. By following these patterns and guidelines, organizations can create web applications that are truly accessible to all users while meeting European accessibility requirements.

Remember that EAA compliance is an ongoing process that requires regular monitoring, testing, and updates to ensure continued accessibility as technologies and standards evolve.
`,
  category: 'best-practices',
  tags: ['EAA', 'European Accessibility Act', 'Best Practices', 'Implementation', 'Compliance'],
  author: {
    name: 'Dr. Sarah Williams',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    role: 'Accessibility Expert'
  },
  publishedAt: '2024-03-19T21:00:00Z',
  readingTime: '25 min read',
  vectorImage: 'https://images.unsplash.com/photo-1529693662653-9d480530a697?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
  tableOfContents: [
    { id: 'core-requirements', title: 'Core Requirements', level: 2 },
    { id: 'implementation-patterns', title: 'Implementation Patterns', level: 2 },
    { id: 'testing-and-compliance', title: 'Testing and Compliance', level: 2 },
    { id: 'resources-and-tools', title: 'Resources and Tools', level: 2 }
  ]
};