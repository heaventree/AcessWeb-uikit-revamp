import type { Article } from '../../../types/blog';

export const eaaGuideArticle: Article = {
  id: 'eaa-guide',
  slug: 'european-accessibility-act-complete-guide',
  title: 'European Accessibility Act (EAA): Complete Implementation Guide',
  description: 'A comprehensive guide to understanding and implementing the European Accessibility Act (EAA) requirements for digital accessibility compliance in the EU.',
  content: `
# European Accessibility Act (EAA): Complete Implementation Guide

The European Accessibility Act (EAA) represents a significant step forward in digital accessibility legislation within the European Union. This comprehensive guide explains the EAA's requirements and how organizations can ensure compliance.

## Understanding the European Accessibility Act

### What is the EAA?

The European Accessibility Act (Directive (EU) 2019/882) is a law that aims to improve the functioning of the internal market for accessible products and services. It sets common accessibility requirements for certain digital products and services across all EU member states.

### Timeline and Implementation

- Adopted: April 17, 2019
- Member States Transposition: By June 28, 2022
- Application of Measures: From June 28, 2025
- Service Providers Transition: Until June 28, 2030

## Scope and Requirements

### Products and Services Covered

The EAA applies to:
- Computers and operating systems
- Payment terminals and ATMs
- E-commerce services
- Banking services
- Electronic communications
- Emergency communications
- Digital television services
- E-books and dedicated software

### Key Technical Requirements

1. **Information Provision**
   - Multiple sensory channels
   - Alternatives to complex content
   - Clear and understandable presentation

2. **User Interface**
   - Keyboard accessibility
   - Flexible timing controls
   - Alternative input methods
   - Proper focus management

3. **Support Services**
   - Accessible documentation
   - Alternative formats
   - Clear communication channels

## Technical Implementation Guide

### 1. Information Accessibility

#### Text Alternatives
\`\`\`html
<!-- Good Example -->
<figure>
  <img 
    src="chart.png" 
    alt="Sales growth chart showing 25% increase in Q4 2023"
  >
  <figcaption>
    Detailed breakdown of quarterly sales performance
  </figcaption>
</figure>

<!-- For Complex Images -->
<img 
  src="infographic.png" 
  alt="Key statistics from annual report" 
  aria-describedby="detailed-description"
>
<div id="detailed-description" class="sr-only">
  [Detailed description of the infographic content]
</div>
\`\`\`

#### Multimedia Content
\`\`\`html
<video controls>
  <source src="presentation.mp4" type="video/mp4">
  <track 
    kind="captions" 
    src="captions.vtt" 
    srclang="en" 
    label="English"
  >
  <track 
    kind="descriptions" 
    src="descriptions.vtt" 
    srclang="en"
  >
</video>
\`\`\`

### 2. User Interface Components

#### Keyboard Navigation
\`\`\`javascript
// Accessible Menu Component
class AccessibleMenu {
  constructor(menuElement) {
    this.menu = menuElement;
    this.items = Array.from(this.menu.querySelectorAll('[role="menuitem"]'));
    this.currentIndex = 0;
    
    this.setupKeyboardNavigation();
  }

  setupKeyboardNavigation() {
    this.menu.addEventListener('keydown', (e) => {
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          this.currentIndex = Math.min(this.currentIndex + 1, this.items.length - 1);
          this.items[this.currentIndex].focus();
          break;
        case 'ArrowUp':
          e.preventDefault();
          this.currentIndex = Math.max(this.currentIndex - 1, 0);
          this.items[this.currentIndex].focus();
          break;
      }
    });
  }
}
\`\`\`

#### Focus Management
\`\`\`javascript
// Focus Management in Modal Dialogs
function AccessibleModal({ isOpen, onClose, children }) {
  const modalRef = useRef(null);
  const previousFocus = useRef(null);

  useEffect(() => {
    if (isOpen) {
      previousFocus.current = document.activeElement;
      modalRef.current?.focus();
      
      // Trap focus within modal
      const focusableElements = modalRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      
      const firstFocusable = focusableElements[0];
      const lastFocusable = focusableElements[focusableElements.length - 1];
      
      function handleTabKey(e) {
        if (e.key === 'Tab') {
          if (e.shiftKey) {
            if (document.activeElement === firstFocusable) {
              e.preventDefault();
              lastFocusable.focus();
            }
          } else {
            if (document.activeElement === lastFocusable) {
              e.preventDefault();
              firstFocusable.focus();
            }
          }
        }
      }
      
      modalRef.current.addEventListener('keydown', handleTabKey);
      return () => {
        modalRef.current?.removeEventListener('keydown', handleTabKey);
      };
    } else if (previousFocus.current) {
      previousFocus.current.focus();
    }
  }, [isOpen]);

  return (
    <div
      ref={modalRef}
      role="dialog"
      aria-modal="true"
      tabIndex="-1"
      className="modal"
    >
      {children}
    </div>
  );
}
\`\`\`

### 3. Error Prevention and Recovery

#### Form Validation
\`\`\`javascript
// Accessible Form Validation
function validateForm(formData) {
  const errors = [];
  
  // Real-time validation
  formData.forEach((value, field) => {
    const error = validateField(field, value);
    if (error) {
      announceError(field, error);
      errors.push({ field, error });
    }
  });
  
  // Error summary
  if (errors.length > 0) {
    const summary = document.getElementById('error-summary');
    summary.innerHTML = createErrorSummary(errors);
    summary.focus();
    return false;
  }
  
  return true;
}

function announceError(field, error) {
  const element = document.getElementById(\`\${field}-error\`);
  element.textContent = error;
  element.setAttribute('role', 'alert');
}

function createErrorSummary(errors) {
  return \`
    <h2>Please correct the following errors:</h2>
    <ul>
      \${errors.map(({ field, error }) => \`
        <li>
          <a href="#\${field}">\${error}</a>
        </li>
      \`).join('')}
    </ul>
  \`;
}
\`\`\`

## Compliance Testing

### Automated Testing

Use tools that support EAA requirements:
- axe-core for automated testing
- Lighthouse for performance and accessibility
- WAVE for visual assessment
- Color contrast analyzers

### Manual Testing Checklist

1. **Keyboard Navigation**
   - All functionality available without mouse
   - Visible focus indicators
   - No keyboard traps

2. **Screen Reader Testing**
   - Proper heading structure
   - Meaningful link text
   - Accurate form labels
   - Image alternatives

3. **Visual Testing**
   - Text resizing
   - Color contrast
   - Content reflow
   - Text spacing

4. **Cognitive Testing**
   - Clear instructions
   - Error identification
   - Consistent navigation
   - Timeout warnings

## Documentation Requirements

### Accessibility Statement

Organizations must provide an accessibility statement that includes:

\`\`\`html
<div class="accessibility-statement">
  <h1>Accessibility Statement</h1>
  
  <section>
    <h2>Commitment to Accessibility</h2>
    <p>
      [Organization Name] is committed to ensuring digital accessibility
      for people with disabilities. We are continually improving the user
      experience for everyone and applying the relevant accessibility
      standards.
    </p>
  </section>
  
  <section>
    <h2>Measures to Support Accessibility</h2>
    <ul>
      <li>Regular accessibility audits</li>
      <li>Staff training on accessibility</li>
      <li>User testing with disabled individuals</li>
      <li>Continuous monitoring and updates</li>
    </ul>
  </section>
  
  <section>
    <h2>Conformance Status</h2>
    <p>
      Our website follows the European Accessibility Act requirements
      and WCAG 2.1 Level AA standards.
    </p>
  </section>
  
  <section>
    <h2>Contact Information</h2>
    <p>
      If you encounter any accessibility barriers or have suggestions
      for improvement, please contact us:
    </p>
    <ul>
      <li>Email: accessibility@example.com</li>
      <li>Phone: +XX XXX XXX XXX</li>
      <li>Postal Address: [Address]</li>
    </ul>
  </section>
</div>
\`\`\`

## Market Surveillance and Enforcement

### Compliance Monitoring

Organizations should:
- Maintain documentation of conformity
- Conduct regular compliance audits
- Update accessibility statements
- Monitor user feedback
- Track accessibility improvements

### Penalties and Enforcement

Non-compliance can result in:
- Market withdrawal of products
- Service suspension requirements
- Financial penalties
- Legal proceedings
- Reputational damage

## Resources and Tools

### Official Resources
- [European Commission EAA Page](https://ec.europa.eu/social/main.jsp?catId=1202)
- [EN 301 549 Standard](https://www.etsi.org/standards/get-standards)
- [W3C WAI Resources](https://www.w3.org/WAI/)

### Development Tools
- WCAG-EM Report Tool
- Accessibility Insights
- axe DevTools
- Screen readers (NVDA, JAWS, VoiceOver)

### Training Resources
- W3C Web Accessibility Tutorials
- European Disability Forum Resources
- WebAIM Articles
- A11Y Project Guidelines

## Conclusion

The European Accessibility Act represents a significant step forward in ensuring digital accessibility across the EU. By following these guidelines and maintaining a proactive approach to accessibility, organizations can ensure compliance while creating better experiences for all users.

Remember that accessibility is an ongoing process that requires regular attention and updates. Stay informed about legal requirements, technical standards, and best practices to maintain EAA compliance and provide an inclusive digital experience for all users.
`,
  category: 'accessibility',
  tags: ['EAA', 'European Accessibility Act', 'EU Compliance', 'Digital Accessibility', 'Web Standards'],
  author: {
    name: 'Dr. Sarah Williams',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    role: 'Accessibility Expert'
  },
  publishedAt: '2024-03-19T11:00:00Z',
  readingTime: '15 min read',
  vectorImage: 'https://images.unsplash.com/photo-1529693662653-9d480530a697?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
  tableOfContents: [
    { id: 'understanding-the-european-accessibility-act', title: 'Understanding the European Accessibility Act', level: 2 },
    { id: 'scope-and-requirements', title: 'Scope and Requirements', level: 2 },
    { id: 'technical-implementation-guide', title: 'Technical Implementation Guide', level: 2 },
    { id: 'compliance-testing', title: 'Compliance Testing', level: 2 },
    { id: 'documentation-requirements', title: 'Documentation Requirements', level: 2 },
    { id: 'market-surveillance-and-enforcement', title: 'Market Surveillance and Enforcement', level: 2 },
    { id: 'resources-and-tools', title: 'Resources and Tools', level: 2 }
  ]
};