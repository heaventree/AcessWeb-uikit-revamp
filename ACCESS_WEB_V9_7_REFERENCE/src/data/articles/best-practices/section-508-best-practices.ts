import type { Article } from '../../../types/blog';

export const section508BestPractices: Article = {
  id: 'section-508-best-practices',
  slug: 'section-508-compliance-best-practices-implementation',
  title: 'Section 508 Compliance: Best Practices and Implementation Guide',
  description: 'A comprehensive guide to implementing Section 508 compliance requirements, including best practices, implementation patterns, and testing strategies for federal agencies and contractors.',
  content: `
# Section 508 Compliance: Best Practices and Implementation Guide

Section 508 of the Rehabilitation Act requires federal agencies to make their electronic and information technology accessible to people with disabilities. This comprehensive guide explains Section 508 requirements and how organizations can ensure compliance.

## Core Requirements

### 1. Technical Standards

Section 508 incorporates WCAG 2.0 Level AA success criteria and applies them to:

1. Web Content
   - Public-facing content
   - Internal agency communications
   - Web applications

2. Software
   - Desktop applications
   - Mobile applications
   - Operating systems

3. Electronic Documents
   - PDFs
   - Microsoft Office documents
   - Other electronic publications

### 2. Functional Performance Criteria

Ensure systems are usable by people with:

- Visual disabilities
- Hearing disabilities
- Motor disabilities
- Cognitive disabilities

## Implementation Patterns

### 1. Document Structure

Create properly structured documents:

\`\`\`html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Section 508 Compliant Document</title>
</head>
<body>
  <!-- Skip Navigation -->
  <a href="#main" class="skip-link">
    Skip to main content
  </a>

  <!-- Header -->
  <header role="banner">
    <nav role="navigation" aria-label="Main">
      <ul>
        <li><a href="/">Home</a></li>
        <li><a href="/about">About</a></li>
        <li><a href="/contact">Contact</a></li>
      </ul>
    </nav>
  </header>

  <!-- Main Content -->
  <main id="main" role="main">
    <h1>Welcome to Our Section 508 Compliant Site</h1>
    
    <section aria-labelledby="section-1">
      <h2 id="section-1">Important Information</h2>
      <p>Content goes here...</p>
    </section>
  </main>

  <!-- Footer -->
  <footer role="contentinfo">
    <p>&copy; 2024 Organization Name</p>
  </footer>
</body>
</html>
\`\`\`

### 2. Form Implementation

Create accessible forms:

\`\`\`typescript
function Section508Form() {
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

### 3. Tables and Data

Create accessible data tables:

\`\`\`typescript
interface TableData {
  id: string;
  name: string;
  role: string;
  department: string;
}

function AccessibleTable({
  data,
  caption
}: {
  data: TableData[];
  caption: string;
}) {
  return (
    <div className="table-container">
      <table>
        <caption>{caption}</caption>
        <thead>
          <tr>
            <th scope="col">Name</th>
            <th scope="col">Role</th>
            <th scope="col">Department</th>
          </tr>
        </thead>
        <tbody>
          {data.map(item => (
            <tr key={item.id}>
              <td>{item.name}</td>
              <td>{item.role}</td>
              <td>{item.department}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
\`\`\`

## Testing and Validation

### 1. Automated Testing

Set up automated accessibility testing:

\`\`\`typescript
import { render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

describe('Section508Component', () => {
  it('should have no accessibility violations', async () => {
    const { container } = render(<Section508Component />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have proper ARIA attributes', () => {
    render(<Section508Component />);
    const element = screen.getByRole('button');
    expect(element).toHaveAttribute('aria-label');
  });
});
\`\`\`

### 2. Manual Testing Checklist

Create a comprehensive testing checklist:

\`\`\`typescript
const section508Checklist = {
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

function Section508Tester() {
  const [results, setResults] = useState<Record<string, boolean>>({});

  const handleCheck = (category: string, item: string) => {
    setResults(prev => ({
      ...prev,
      [\`\${category}-\${item}\`]: !prev[\`\${category}-\${item}\`]
    }));
  };

  return (
    <div className="section508-tester">
      {Object.entries(section508Checklist).map(([category, items]) => (
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

## Resources and Tools

### Development Tools
- [axe DevTools](https://www.deque.com/axe/)
- [WAVE](https://wave.webaim.org/)
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)
- [Section 508 Testing Tools](https://www.section508.gov/test/)

### Documentation
- [Section508.gov](https://www.section508.gov/)
- [GSA Government-wide IT Accessibility Program](https://www.gsa.gov/about-us/organization/office-of-governmentwide-policy/office-of-information-integrity-and-access/it-accessibility-program)
- [U.S. Access Board](https://www.access-board.gov/)
- [WAI-ARIA Practices](https://www.w3.org/WAI/ARIA/apg/)

### Training Resources
- [Section 508 Training Courses](https://www.section508.gov/training/)
- [GSA Accessibility Requirements Tool](https://www.section508.gov/art/)
- [WebAIM Articles](https://webaim.org/articles/)
- [Deque University](https://dequeuniversity.com/)

## Conclusion

Section 508 compliance is essential for federal agencies and their partners to ensure digital accessibility for all users. By following these guidelines and maintaining a proactive approach to accessibility, organizations can meet their legal obligations while creating better experiences for everyone.

Remember that accessibility is an ongoing process that requires regular attention and updates. Stay informed about legal requirements, technical standards, and best practices to maintain Section 508 compliance and provide an inclusive digital experience for all users.
`,
  category: 'best-practices',
  tags: ['Section 508', 'Compliance', 'Best Practices', 'Implementation', 'Federal'],
  author: {
    name: 'Dr. Sarah Williams',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    role: 'Accessibility Expert'
  },
  publishedAt: '2024-03-19T22:00:00Z',
  readingTime: '25 min read',
  vectorImage: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
  tableOfContents: [
    { id: 'core-requirements', title: 'Core Requirements', level: 2 },
    { id: 'implementation-patterns', title: 'Implementation Patterns', level: 2 },
    { id: 'testing-and-compliance', title: 'Testing and Compliance', level: 2 },
    { id: 'resources-and-tools', title: 'Resources and Tools', level: 2 }
  ]
};