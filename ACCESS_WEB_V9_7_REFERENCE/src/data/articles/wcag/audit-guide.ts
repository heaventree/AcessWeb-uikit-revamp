import type { Article } from '../../../types/blog';

export const wcagAuditGuide: Article = {
  id: 'wcag-audit-guide',
  slug: 'wcag-2-1-audit-guide-comprehensive-testing',
  title: 'WCAG 2.1 Audit Guide: Comprehensive Accessibility Testing',
  description: 'A detailed guide to conducting thorough WCAG 2.1 accessibility audits, including automated testing, manual checks, and user testing methodologies.',
  content: `
# WCAG 2.1 Audit Guide: Comprehensive Accessibility Testing

This comprehensive guide will walk you through the process of conducting thorough accessibility audits to ensure WCAG 2.1 compliance. Learn how to combine automated testing, manual verification, and user testing for complete coverage.

## Planning Your Accessibility Audit

### 1. Audit Scope Definition

Before beginning your audit, clearly define:

- Pages and features to test
- Success criteria levels (A, AA, AAA)
- Testing environments and tools
- Documentation requirements
- Timeline and resources

### 2. Testing Environment Setup

Prepare your testing environment:

\`\`\`javascript
// Example Test Configuration
const auditConfig = {
  // Supported Browsers
  browsers: [
    'Chrome latest',
    'Firefox latest',
    'Safari latest',
    'Edge latest'
  ],
  
  // Screen Readers
  screenReaders: [
    'NVDA (Windows)',
    'VoiceOver (Mac)',
    'JAWS (Windows)'
  ],
  
  // Mobile Devices
  mobileDevices: [
    'iPhone SE',
    'iPhone 12',
    'iPad',
    'Android Pixel 5'
  ],
  
  // Automated Tools
  automatedTools: [
    'axe-core',
    'WAVE',
    'Lighthouse',
    'SiteImprove'
  ]
};
\`\`\`

## Automated Testing

### 1. Setting Up Automated Tests

Configure automated testing tools:

\`\`\`javascript
// axe-core Integration Example
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

describe('Accessibility Tests', () => {
  it('should have no accessibility violations', async () => {
    const { container } = render(<MyComponent />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

// Lighthouse CI Configuration
module.exports = {
  ci: {
    collect: {
      numberOfRuns: 3,
      startServerCommand: 'npm run start',
      url: ['http://localhost:3000'],
      settings: {
        preset: 'desktop',
        onlyCategories: ['accessibility'],
        skipAudits: ['robots-txt']
      }
    },
    assert: {
      assertions: {
        'categories:accessibility': ['error', { minScore: 0.9 }]
      }
    }
  }
};
\`\`\`

### 2. Custom Testing Scripts

Create custom testing utilities:

\`\`\`javascript
// Accessibility Testing Utilities
class AccessibilityTester {
  constructor() {
    this.violations = [];
    this.warnings = [];
    this.passes = [];
  }

  async testPage(url) {
    // Test structure
    await this.testHeadingStructure();
    await this.testLandmarks();
    await this.testImages();
    await this.testForms();
    await this.testKeyboard();
    
    return {
      violations: this.violations,
      warnings: this.warnings,
      passes: this.passes
    };
  }

  async testHeadingStructure() {
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    let previousLevel = 0;
    
    headings.forEach((heading) => {
      const level = parseInt(heading.tagName[1]);
      
      if (level - previousLevel > 1) {
        this.violations.push({
          type: 'heading-order',
          element: heading,
          message: \`Heading level skipped from \${previousLevel} to \${level}\`
        });
      }
      
      previousLevel = level;
    });
  }

  async testLandmarks() {
    // Check for required landmarks
    const landmarks = {
      banner: document.querySelector('[role="banner"], header'),
      main: document.querySelector('[role="main"], main'),
      navigation: document.querySelector('[role="navigation"], nav'),
      contentinfo: document.querySelector('[role="contentinfo"], footer')
    };
    
    Object.entries(landmarks).forEach(([name, element]) => {
      if (!element) {
        this.violations.push({
          type: 'landmark-missing',
          message: \`Missing \${name} landmark\`
        });
      }
    });
  }

  async testImages() {
    const images = document.querySelectorAll('img');
    
    images.forEach((img) => {
      if (!img.hasAttribute('alt')) {
        this.violations.push({
          type: 'image-alt',
          element: img,
          message: 'Image missing alt attribute'
        });
      }
    });
  }

  async testForms() {
    const formControls = document.querySelectorAll('input, select, textarea');
    
    formControls.forEach((control) => {
      const label = document.querySelector(\`label[for="\${control.id}"]\`);
      
      if (!label && !control.hasAttribute('aria-label')) {
        this.violations.push({
          type: 'form-label',
          element: control,
          message: 'Form control missing label'
        });
      }
    });
  }

  async testKeyboard() {
    const focusableElements = document.querySelectorAll(
      'a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    focusableElements.forEach((element) => {
      const styles = window.getComputedStyle(element);
      
      if (styles.outline === 'none' && styles.boxShadow === 'none') {
        this.warnings.push({
          type: 'focus-visible',
          element: element,
          message: 'Element may have insufficient focus indicator'
        });
      }
    });
  }
}
\`\`\`

## Manual Testing

### 1. Keyboard Navigation Testing

Create a keyboard testing checklist:

\`\`\`javascript
const keyboardTestScenarios = [
  {
    name: 'Navigation',
    steps: [
      'Press Tab to move through all interactive elements',
      'Verify focus order matches visual order',
      'Check for visible focus indicators',
      'Ensure no keyboard traps'
    ]
  },
  {
    name: 'Dropdowns',
    steps: [
      'Open with Enter or Space',
      'Navigate items with arrow keys',
      'Close with Escape',
      'Select with Enter'
    ]
  },
  {
    name: 'Modals',
    steps: [
      'Open with trigger key',
      'Focus trapped within modal',
      'Close with Escape',
      'Return focus on close'
    ]
  }
];

// Keyboard Testing Component
function KeyboardTester({ onComplete }) {
  const [currentScenario, setCurrentScenario] = useState(0);
  const [completedSteps, setCompletedSteps] = useState(new Set());
  
  const handleStepComplete = (step) => {
    setCompletedSteps(prev => new Set([...prev, step]));
  };
  
  return (
    <div className="keyboard-tester">
      {keyboardTestScenarios.map((scenario, index) => (
        <div key={index} className="scenario">
          <h3>{scenario.name}</h3>
          <ul>
            {scenario.steps.map((step, stepIndex) => (
              <li key={stepIndex}>
                <label>
                  <input
                    type="checkbox"
                    checked={completedSteps.has(\`\${index}-\${stepIndex}\`)}
                    onChange={() => handleStepComplete(\`\${index}-\${stepIndex}\`)}
                  />
                  {step}
                </label>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
\`\`\`

### 2. Screen Reader Testing

Document screen reader test cases:

\`\`\`javascript
const screenReaderTests = [
  {
    category: 'Page Structure',
    tests: [
      {
        name: 'Heading Navigation',
        steps: [
          'Use heading shortcut key (H)',
          'Verify logical heading structure',
          'Check heading content clarity'
        ]
      },
      {
        name: 'Landmark Navigation',
        steps: [
          'Navigate between landmarks',
          'Verify landmark roles',
          'Check landmark labels'
        ]
      }
    ]
  },
  {
    category: 'Interactive Elements',
    tests: [
      {
        name: 'Links and Buttons',
        steps: [
          'Navigate through all links',
          'Verify link purpose is clear',
          'Check button labels'
        ]
      },
      {
        name: 'Forms',
        steps: [
          'Check field labels',
          'Verify error messages',
          'Test required fields'
        ]
      }
    ]
  }
];

// Screen Reader Test Logger
class ScreenReaderTestLogger {
  constructor() {
    this.results = [];
  }

  logTest(category, test, result, notes) {
    this.results.push({
      timestamp: new Date().toISOString(),
      category,
      test,
      result,
      notes
    });
  }

  generateReport() {
    return {
      summary: {
        total: this.results.length,
        passed: this.results.filter(r => r.result === 'pass').length,
        failed: this.results.filter(r => r.result === 'fail').length
      },
      details: this.results
    };
  }
}
\`\`\`

### 3. Visual Testing

Create visual testing scenarios:

\`\`\`javascript
const visualTests = {
  colorContrast: {
    name: 'Color Contrast',
    tools: ['Color Contrast Analyzer'],
    checkpoints: [
      'Text against background (4.5:1)',
      'Large text against background (3:1)',
      'UI components against adjacent colors (3:1)'
    ]
  },
  
  textResize: {
    name: 'Text Resize',
    tools: ['Browser zoom'],
    checkpoints: [
      'Text scales up to 200%',
      'No loss of functionality',
      'No truncation or overlap'
    ]
  },
  
  responsiveLayout: {
    name: 'Responsive Design',
    tools: ['Browser dev tools'],
    checkpoints: [
      'Content reflows at different widths',
      'No horizontal scrolling at 320px',
      'Touch targets minimum 44x44px'
    ]
  }
};

// Visual Test Component
function VisualTester({ onComplete }) {
  const [results, setResults] = useState({});
  
  const handleTestResult = (test, checkpoint, passed) => {
    setResults(prev => ({
      ...prev,
      [test]: {
        ...prev[test],
        [checkpoint]: passed
      }
    }));
  };
  
  return (
    <div className="visual-tester">
      {Object.entries(visualTests).map(([key, test]) => (
        <div key={key} className="test-section">
          <h3>{test.name}</h3>
          <p>Tools: {test.tools.join(', ')}</p>
          
          <ul>
            {test.checkpoints.map((checkpoint, index) => (
              <li key={index}>
                <label>
                  <input
                    type="checkbox"
                    checked={results[key]?.[checkpoint] || false}
                    onChange={(e) => 
                      handleTestResult(key, checkpoint, e.target.checked)
                    }
                  />
                  {checkpoint}
                </label>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
\`\`\`

## User Testing

### 1. Test Participant Selection

Define participant criteria:

\`\`\`javascript
const userTestingGroups = [
  {
    category: 'Screen Reader Users',
    requirements: [
      'Regular screen reader usage',
      'Various proficiency levels',
      'Different screen readers'
    ]
  },
  {
    category: 'Keyboard-Only Users',
    requirements: [
      'No mouse usage',
      'Various assistive technologies',
      'Different keyboard layouts'
    ]
  },
  {
    category: 'Low Vision Users',
    requirements: [
      'Various vision conditions',
      'Different magnification tools',
      'Color vision deficiencies'
    ]
  }
];
\`\`\`

### 2. Test Scenarios

Create comprehensive test scenarios:

\`\`\`javascript
const userTestScenarios = [
  {
    task: 'Account Creation',
    steps: [
      'Navigate to sign up page',
      'Complete registration form',
      'Handle validation errors',
      'Confirm account creation'
    ]
  },
  {
    task: 'Content Navigation',
    steps: [
      'Find specific information',
      'Use site navigation',
      'Interact with dynamic content',
      'Return to homepage'
    ]
  },
  {
    task: 'Form Submission',
    steps: [
      'Locate contact form',
      'Fill required fields',
      'Upload attachments',
      'Submit and handle response'
    ]
  }
];

// User Testing Session Logger
class UserTestingLogger {
  constructor(participant, scenario) {
    this.session = {
      participant,
      scenario,
      startTime: new Date(),
      events: []
    };
  }

  logEvent(type, details) {
    this.session.events.push({
      timestamp: new Date(),
      type,
      details
    });
  }

  generateReport() {
    const endTime = new Date();
    const duration = endTime - this.session.startTime;
    
    return {
      participant: this.session.participant,
      scenario: this.session.scenario,
      duration,
      events: this.session.events,
      summary: this.generateSummary()
    };
  }

  generateSummary() {
    const issues = this.session.events.filter(
      e => e.type === 'issue'
    );
    
    return {
      totalIssues: issues.length,
      issuesByType: this.categorizeIssues(issues),
      completionSuccess: this.session.events.some(
        e => e.type === 'completion'
      )
    };
  }

  categorizeIssues(issues) {
    return issues.reduce((acc, issue) => {
      const category = issue.details.category;
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {});
  }
}
\`\`\`

## Reporting and Documentation

### 1. Issue Documentation

Create detailed issue reports:

\`\`\`javascript
class AccessibilityIssue {
  constructor(data) {
    this.id = Date.now();
    this.type = data.type;
    this.wcagCriteria = data.wcagCriteria;
    this.impact = data.impact;
    this.description = data.description;
    this.steps = data.steps;
    this.evidence = data.evidence;
    this.recommendation = data.recommendation;
  }

  toHTML() {
    return \`
      <div class="issue" id="issue-\${this.id}">
        <h3>\${this.type}</h3>
        <p><strong>WCAG Criteria:</strong> \${this.wcagCriteria}</p>
        <p><strong>Impact:</strong> \${this.impact}</p>
        <p>\${this.description}</p>
        
        <h4>Steps to Reproduce</h4>
        <ol>
          \${this.steps.map(step => \`<li>\${step}</li>\`).join('')}
        </ol>
        
        <h4>Evidence</h4>
        <pre><code>\${this.evidence}</code></pre>
        
        <h4>Recommendation</h4>
        <p>\${this.recommendation}</p>
      </div>
    \`;
  }
}
\`\`\`

### 2. Report Generation

Create comprehensive audit reports:

\`\`\`javascript
class AccessibilityReport {
  constructor(data) {
    this.metadata = {
      date: new Date(),
      version: '1.0',
      scope: data.scope,
      methodology: data.methodology
    };
    
    this.summary = {
      totalIssues: 0,
      criticalIssues: 0,
      seriousIssues: 0,
      moderate: 0,
      minor: 0
    };
    
    this.issues = [];
    this.recommendations = [];
  }

  addIssue(issue) {
    this.issues.push(issue);
    this.updateSummary(issue);
  }

  updateSummary(issue) {
    this.summary.totalIssues++;
    this.summary[issue.impact]++;
  }

  addRecommendation(recommendation) {
    this.recommendations.push(recommendation);
  }

  generateHTML() {
    return \`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <title>Accessibility Audit Report</title>
        <style>
          /* Report Styles */
          .report {
            max-width: 1200px;
            margin: 0 auto;
            padding: 2rem;
            font-family: system-ui, sans-serif;
          }
          
          .summary {
            background: #f5f5f5;
            padding: 1rem;
            border-radius: 4px;
            margin-bottom: 2rem;
          }
          
          .issues {
            display: grid;
            gap: 1rem;
          }
          
          .issue {
            border: 1px solid #ddd;
            padding: 1rem;
            border-radius: 4px;
          }
          
          .recommendations {
            background: #e6f3ff;
            padding: 1rem;
            border-radius: 4px;
            margin-top: 2rem;
          }
        </style>
      </head>
      <body>
        <div class="report">
          <h1>Accessibility Audit Report</h1>
          
          <section class="summary">
            <h2>Executive Summary</h2>
            <p>Audit Date: \${this.metadata.date.toLocaleDateString()}</p>
            <p>Total Issues: \${this.summary.totalIssues}</p>
            <ul>
              <li>Critical: \${this.summary.criticalIssues}</li>
              <li>Serious: \${this.summary.seriousIssues}</li>
              <li>Moderate: \${this.summary.moderate}</li>
              <li>Minor: \${this.summary.minor}</li>
            </ul>
          </section>
          
          <section class="issues">
            <h2>Detailed Findings</h2>
            \${this.issues.map(issue => issue.toHTML()).join('')}
          </section>
          
          <section class="recommendations">
            <h2>Recommendations</h2>
            <ul>
              \${this.recommendations.map(rec => \`<li>\${rec}</li>\`).join('')}
            </ul>
          </section>
        </div>
      </body>
      </html>
    \`;
  }
}
\`\`\`

## Tools and Resources

### Automated Testing Tools
- [axe DevTools](https://www.deque.com/axe/)
- [WAVE](https://wave.webaim.org/)
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)
- [SiteImprove](https://siteimprove.com/)

### Screen Readers
- [NVDA](https://www.nvaccess.org/)
- [JAWS](https://www.freedomscientific.com/products/software/jaws/)
- [VoiceOver](https://www.apple.com/accessibility/mac/vision/)

### Browser Extensions
- [Web Developer](https://chrispederick.com/work/web-developer/)
- [Accessibility Insights](https://accessibilityinsights.io/)
- [Color Contrast Analyzer](https://developer.paciellogroup.com/resources/contrastanalyser/)

### Documentation
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [WAI-ARIA Practices](https://www.w3.org/WAI/ARIA/apg/)
- [WebAIM Articles](https://webaim.org/articles/)

## Conclusion

Conducting thorough accessibility audits is crucial for ensuring your web applications are truly accessible to all users. By combining automated testing, manual verification, and user testing, you can identify and address accessibility issues effectively.

Remember that accessibility testing is an iterative process. Regular audits and continuous monitoring help maintain accessibility standards and improve user experience for everyone.
`,
  category: 'wcag',
  tags: ['WCAG 2.1', 'Accessibility', 'Testing', 'Audit', 'Compliance'],
  author: {
    name: 'Dr. Sarah Williams',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    role: 'Accessibility Expert'
  },
  publishedAt: '2024-03-19T15:00:00Z',
  readingTime: '18 min read',
  vectorImage: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
  tableOfContents: [
    { id: 'planning-your-accessibility-audit', title: 'Planning Your Accessibility Audit', level: 2 },
    { id: 'automated-testing', title: 'Automated Testing', level: 2 },
    { id: 'manual-testing', title: 'Manual Testing', level: 2 },
    { id: 'user-testing', title: 'User Testing', level: 2 },
    { id: 'reporting-and-documentation', title: 'Reporting and Documentation', level: 2 },
    { id: 'tools-and-resources', title: 'Tools and Resources', level: 2 }
  ]
};