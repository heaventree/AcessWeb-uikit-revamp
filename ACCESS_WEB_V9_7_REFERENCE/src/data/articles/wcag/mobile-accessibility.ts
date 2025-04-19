import type { Article } from '../../../types/blog';

export const wcagMobileAccessibility: Article = {
  id: 'wcag-mobile-accessibility',
  slug: 'wcag-2-1-mobile-accessibility-guide',
  title: 'WCAG 2.1 Mobile Accessibility: Complete Implementation Guide',
  description: 'A comprehensive guide to implementing WCAG 2.1 accessibility standards for mobile web applications, covering touch interactions, responsive design, and mobile-specific considerations.',
  content: `
# WCAG 2.1 Mobile Accessibility: Complete Implementation Guide

Mobile accessibility presents unique challenges and considerations beyond traditional desktop web accessibility. This guide covers implementing WCAG 2.1 standards specifically for mobile web applications.

## Understanding Mobile Accessibility

### Key Differences from Desktop

Mobile accessibility differs from desktop in several ways:
- Touch-based interaction
- Variable screen sizes
- Different input methods
- Network connectivity variations
- Device orientation changes
- Limited processing power

### Mobile-Specific Success Criteria

WCAG 2.1 added several success criteria specifically for mobile:
- 2.5.1 Pointer Gestures
- 2.5.2 Pointer Cancellation
- 2.5.3 Label in Name
- 2.5.4 Motion Actuation
- 1.3.4 Orientation
- 1.4.10 Reflow
- 1.4.11 Non-text Contrast
- 1.4.13 Content on Hover or Focus

## Implementation Guide

### 1. Touch Interactions

#### Touch Target Size

Ensure touch targets are large enough:

\`\`\`css
/* Base touch target styles */
.touch-target {
  min-width: 44px;
  min-height: 44px;
  padding: 12px;
  margin: 4px;
}

/* Adjusting for different device densities */
@media screen and (min-resolution: 192dpi) {
  .touch-target {
    min-width: 48px;
    min-height: 48px;
  }
}

/* Example button component */
.mobile-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 44px;
  min-height: 44px;
  padding: 12px 16px;
  border-radius: 8px;
  background: var(--primary-color);
  color: white;
  touch-action: manipulation;
}
\`\`\`

#### Gesture Handling

Implement accessible gesture controls:

\`\`\`typescript
interface GestureOptions {
  allowMultiplePoints?: boolean;
  requirePressure?: boolean;
  timeout?: number;
}

class AccessibleGestureHandler {
  private element: HTMLElement;
  private options: GestureOptions;
  private startPoint: { x: number; y: number } | null = null;
  private timeout: number | null = null;

  constructor(element: HTMLElement, options: GestureOptions = {}) {
    this.element = element;
    this.options = {
      allowMultiplePoints: false,
      requirePressure: false,
      timeout: 500,
      ...options
    };

    this.setupEventListeners();
  }

  private setupEventListeners() {
    // Touch events
    this.element.addEventListener('touchstart', this.handleTouchStart);
    this.element.addEventListener('touchmove', this.handleTouchMove);
    this.element.addEventListener('touchend', this.handleTouchEnd);

    // Mouse events for fallback
    this.element.addEventListener('mousedown', this.handleMouseDown);
    this.element.addEventListener('mousemove', this.handleMouseMove);
    this.element.addEventListener('mouseup', this.handleMouseUp);

    // Keyboard events for alternative interaction
    this.element.addEventListener('keydown', this.handleKeyDown);
  }

  private handleTouchStart = (e: TouchEvent) => {
    if (!this.options.allowMultiplePoints && e.touches.length > 1) {
      return;
    }

    this.startPoint = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY
    };

    if (this.options.timeout) {
      this.timeout = window.setTimeout(() => {
        this.cancelGesture();
      }, this.options.timeout);
    }
  };

  private handleTouchMove = (e: TouchEvent) => {
    if (!this.startPoint) return;

    const currentPoint = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY
    };

    this.processGestureMove(currentPoint);
  };

  private handleTouchEnd = () => {
    this.completeGesture();
  };

  // Mouse fallback handlers
  private handleMouseDown = (e: MouseEvent) => {
    this.startPoint = { x: e.clientX, y: e.clientY };
  };

  private handleMouseMove = (e: MouseEvent) => {
    if (!this.startPoint) return;
    this.processGestureMove({ x: e.clientX, y: e.clientY });
  };

  private handleMouseUp = () => {
    this.completeGesture();
  };

  // Keyboard alternative
  private handleKeyDown = (e: KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowLeft':
        this.emitGestureEvent('swipeleft');
        break;
      case 'ArrowRight':
        this.emitGestureEvent('swiperight');
        break;
      case 'ArrowUp':
        this.emitGestureEvent('swipeup');
        break;
      case 'ArrowDown':
        this.emitGestureEvent('swipedown');
        break;
    }
  };

  private processGestureMove(currentPoint: { x: number; y: number }) {
    if (!this.startPoint) return;

    const deltaX = currentPoint.x - this.startPoint.x;
    const deltaY = currentPoint.y - this.startPoint.y;

    // Emit progress event for continuous feedback
    this.emitGestureEvent('progress', { deltaX, deltaY });
  }

  private completeGesture() {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
    this.startPoint = null;
  }

  private cancelGesture() {
    this.emitGestureEvent('cancel');
    this.startPoint = null;
  }

  private emitGestureEvent(type: string, detail?: any) {
    const event = new CustomEvent(\`gesture\${type}\`, {
      bubbles: true,
      cancelable: true,
      detail
    });
    this.element.dispatchEvent(event);
  }
}
\`\`\`

### 2. Responsive Design

#### Viewport Configuration

Set up proper viewport settings:

\`\`\`html
<meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=yes, minimum-scale=1">
\`\`\`

#### Responsive Layout

Implement mobile-first responsive design:

\`\`\`css
/* Base mobile styles */
.container {
  width: 100%;
  padding: 16px;
  margin: 0 auto;
}

/* Responsive text sizing */
:root {
  --text-base: 16px;
  --text-scale-ratio: 1.2;
}

html {
  font-size: var(--text-base);
}

h1 {
  font-size: calc(var(--text-base) * var(--text-scale-ratio) * var(--text-scale-ratio));
  line-height: 1.2;
}

/* Breakpoint system */
@media (min-width: 640px) {
  .container {
    max-width: 640px;
  }
  :root {
    --text-base: 18px;
  }
}

@media (min-width: 768px) {
  .container {
    max-width: 768px;
  }
}

@media (min-width: 1024px) {
  .container {
    max-width: 1024px;
  }
  :root {
    --text-base: 20px;
  }
}

/* Reflow support */
@media screen and (max-width: 320px) {
  .content {
    word-wrap: break-word;
    overflow-wrap: break-word;
    hyphens: auto;
  }
}
\`\`\`

### 3. Mobile Forms

Create accessible mobile forms:

\`\`\`typescript
interface FormFieldProps {
  label: string;
  type: string;
  id: string;
  required?: boolean;
  pattern?: string;
  autocomplete?: string;
  inputmode?: 'none' | 'text' | 'decimal' | 'numeric' | 'tel' | 'search' | 'email' | 'url';
}

function MobileFormField({
  label,
  type,
  id,
  required = false,
  pattern,
  autocomplete,
  inputmode
}: FormFieldProps) {
  return (
    <div className="form-field">
      <label 
        htmlFor={id}
        className="block text-sm font-medium mb-2"
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      
      <input
        type={type}
        id={id}
        name={id}
        required={required}
        pattern={pattern}
        autoComplete={autocomplete}
        inputMode={inputmode}
        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        aria-required={required}
      />
    </div>
  );
}

function MobileForm() {
  return (
    <form className="space-y-6" noValidate>
      <MobileFormField
        label="Full Name"
        type="text"
        id="name"
        required
        autocomplete="name"
      />
      
      <MobileFormField
        label="Phone Number"
        type="tel"
        id="phone"
        pattern="[0-9]{10}"
        autocomplete="tel"
        inputmode="tel"
      />
      
      <MobileFormField
        label="Email"
        type="email"
        id="email"
        required
        autocomplete="email"
        inputmode="email"
      />
      
      <button
        type="submit"
        className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg text-lg font-medium"
      >
        Submit
      </button>
    </form>
  );
}
\`\`\`

### 4. Mobile Navigation

Implement accessible mobile navigation:

\`\`\`typescript
interface NavigationItem {
  label: string;
  href: string;
  icon?: React.ReactNode;
}

function MobileNavigation({ items }: { items: NavigationItem[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        !buttonRef.current?.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [isOpen]);

  return (
    <nav role="navigation">
      <button
        ref={buttonRef}
        aria-expanded={isOpen}
        aria-controls="mobile-menu"
        aria-label="Open menu"
        onClick={() => setIsOpen(!isOpen)}
        className="mobile-menu-button"
      >
        <span className="sr-only">Menu</span>
        <svg
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          {isOpen ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          )}
        </svg>
      </button>

      <div
        ref={menuRef}
        id="mobile-menu"
        className={\`mobile-menu \${isOpen ? 'open' : ''}\`}
        aria-hidden={!isOpen}
      >
        <ul className="menu-items">
          {items.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                className="menu-item"
                onClick={() => setIsOpen(false)}
              >
                {item.icon}
                <span>{item.label}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}

// Styles for mobile navigation
const styles = \`
.mobile-menu-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  background: transparent;
  border: none;
  color: currentColor;
  cursor: pointer;
}

.mobile-menu {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background: white;
  transform: translateX(-100%);
  transition: transform 0.3s ease-in-out;
  z-index: 50;
}

.mobile-menu.open {
  transform: translateX(0);
}

.menu-items {
  padding: 1rem;
  list-style: none;
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 1rem;
  color: inherit;
  text-decoration: none;
  font-size: 1.125rem;
}

.menu-item svg {
  width: 1.5rem;
  height: 1.5rem;
  margin-right: 0.75rem;
}

@media (prefers-reduced-motion: reduce) {
  .mobile-menu {
    transition: none;
  }
}
\`;
\`\`\`

### 5. Mobile-Specific Features

#### Orientation Support

Handle device orientation changes:

\`\`\`typescript
function useDeviceOrientation() {
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>(
    window.screen.orientation.type.includes('portrait') ? 'portrait' : 'landscape'
  );

  useEffect(() => {
    const handleOrientationChange = () => {
      setOrientation(
        window.screen.orientation.type.includes('portrait') ? 'portrait' : 'landscape'
      );
    };

    window.addEventListener('orientationchange', handleOrientationChange);
    return () => {
      window.removeEventListener('orientationchange', handleOrientationChange);
    };
  }, []);

  return orientation;
}

function OrientationAwareComponent({ children }: { children: React.ReactNode }) {
  const orientation = useDeviceOrientation();

  return (
    <div className={\`orientation-\${orientation}\`}>
      {children}
    </div>
  );
}
\`\`\`

#### Motion Control

Handle motion-based interactions:

\`\`\`typescript
interface MotionConfig {
  enabled: boolean;
  threshold?: number;
  timeout?: number;
}

function useDeviceMotion(config: MotionConfig) {
  const [isAvailable, setIsAvailable] = useState(false);
  const [motionData, setMotionData] = useState({
    acceleration: { x: 0, y: 0, z: 0 },
    rotationRate: { alpha: 0, beta: 0, gamma: 0 }
  });

  useEffect(() => {
    // Check if motion sensors are available
    if (typeof DeviceMotionEvent !== 'undefined') {
      setIsAvailable(true);
    }

    if (!config.enabled || !isAvailable) return;

    let timeout: number;

    const handleMotion = (event: DeviceMotionEvent) => {
      if (timeout) {
        window.clearTimeout(timeout);
      }

      timeout = window.setTimeout(() => {
        if (event.acceleration && event.rotationRate) {
          setMotionData({
            acceleration: {
              x: event.acceleration.x || 0,
              y: event.acceleration.y || 0,
              z: event.acceleration.z || 0
            },
            rotationRate: {
              alpha: event.rotationRate.alpha || 0,
              beta: event.rotationRate.beta || 0,
              gamma: event.rotationRate.gamma || 0
            }
          });
        }
      }, config.timeout || 100);
    };

    window.addEventListener('devicemotion', handleMotion);
    return () => {
      window.removeEventListener('devicemotion', handleMotion);
      if (timeout) {
        window.clearTimeout(timeout);
      }
    };
  }, [config.enabled, config.timeout]);

  return {
    isAvailable,
    motionData,
    hasMotion: 
      Math.abs(motionData.acceleration.x) > (config.threshold || 1) ||
      Math.abs(motionData.acceleration.y) > (config.threshold || 1) ||
      Math.abs(motionData.acceleration.z) > (config.threshold || 1)
  };
}
\`\`\`

## Testing Mobile Accessibility

### 1. Mobile Testing Tools

Use mobile-specific testing tools:

\`\`\`typescript
interface MobileTestConfig {
  viewport: {
    width: number;
    height: number;
    deviceScaleFactor: number;
    isMobile: boolean;
  };
  userAgent: string;
}

const mobileTestConfigs: Record<string, MobileTestConfig> = {
  iPhone12: {
    viewport: {
      width: 390,
      height: 844,
      deviceScaleFactor: 3,
      isMobile: true
    },
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1'
  },
  Pixel5: {
    viewport: {
      width: 393,
      height: 851,
      deviceScaleFactor: 2.75,
      isMobile: true
    },
    userAgent: 'Mozilla/5.0 (Linux; Android 11; Pixel 5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.91 Mobile Safari/537.36'
  }
};

class MobileAccessibilityTester {
  private config: MobileTestConfig;

  constructor(deviceName: keyof typeof mobileTestConfigs) {
    this.config = mobileTestConfigs[deviceName];
  }

  async testTouchTargets() {
    const touchTargets = document.querySelectorAll('button, a, [role="button"]');
    const violations: string[] = [];

    touchTargets.forEach((target) => {
      const rect = (target as HTMLElement).getBoundingClientRect();
      if (rect.width < 44 || rect.height < 44) {
        violations.push(\`Touch target \${target.tagName} is too small: \${rect.width}x\${rect.height}px\`);
      }
    });

    return violations;
  }

  async testSpacing() {
    const interactiveElements = document.querySelectorAll('button, a, input, select, textarea');
    const violations: string[] = [];

    interactiveElements.forEach((element) => {
      const rect = (element as HTMLElement).getBoundingClientRect();
      const style = window.getComputedStyle(element as Element);
      const margin = parseInt(style.marginTop) + parseInt(style.marginBottom);
      
      if (margin < 8) {
        violations.push(\`Element \${element.tagName} has insufficient vertical spacing: \${margin}px\`);
      }
    });

    return violations;
  }

  async testViewport() {
    const viewport = document.querySelector('meta[name="viewport"]');
    if (!viewport) {
      return ['Viewport meta tag is missing'];
    }

    const content = viewport.getAttribute('content');
    if (!content?.includes('width=device-width')) {
      return ['Viewport meta tag should include width=device-width'];
    }

    return [];
  }

  async testOrientation() {
    const orientationMeta = document.querySelector('meta[name="screen-orientation"]');
    if (orientationMeta) {
      const content = orientationMeta.getAttribute('content');
      if (content === 'lock') {
        return ['Screen orientation should not be locked unless essential'];
      }
    }
    return [];
  }

  async runAllTests() {
    const results = {
      touchTargets: await this.testTouchTargets(),
      spacing: await this.testSpacing(),
      viewport: await this.testViewport(),
      orientation: await this.testOrientation()
    };

    return {
      device: this.config,
      results,
      timestamp: new Date().toISOString(),
      summary: {
        totalViolations: Object.values(results).reduce(
          (sum, violations) => sum + violations.length,
          0
        )
      }
    };
  }
}
\`\`\`

### 2. Manual Testing Checklist

Create a mobile testing checklist:

\`\`\`typescript
const mobileTestingChecklist = {
  touch: [
    'Verify touch targets are at least 44x44px',
    'Test gesture alternatives',
    'Check touch feedback',
    'Verify tap spacing'
  ],
  orientation: [
    'Test portrait mode',
    'Test landscape mode',
    'Verify content reflow',
    'Check orientation-dependent features'
  ],
  responsiveness: [
    'Test different viewport sizes',
    'Verify text scaling',
    'Check image scaling',
    'Test responsive layouts'
  ],
  input: [
    'Test virtual keyboard interaction',
    'Verify form field types',
    'Check autocomplete functionality',
    'Test input modes'
  ],
  navigation: [
    'Test menu accessibility',
    'Verify skip links',
    'Check focus management',
    'Test back button behavior'
  ]
};

function MobileTestingGuide() {
  return (
    <div className="testing-guide">
      {Object.entries(mobileTestingChecklist).map(([category, items]) => (
        <section key={category}>
          <h2>{category.charAt(0).toUpperCase() + category.slice(1)} Tests</h2>
          <ul>
            {items.map((item, index) => (
              <li key={index}>
                <label>
                  <input type="checkbox" />
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

## Best Practices

### 1. Performance Optimization

Optimize for mobile performance:

\`\`\`typescript
// Image optimization
function OptimizedImage({
  src,
  alt,
  sizes,
  loading = 'lazy'
}: {
  src: string;
  alt: string;
  sizes: string;
  loading?: 'lazy' | 'eager';
}) {
  return (
    <picture>
      <source
        type="image/webp"
        srcSet={\`\${src}?format=webp&w=320 320w, \${src}?format=webp&w=640 640w\`}
        sizes={sizes}
      />
      <source
        type="image/jpeg"
        srcSet={\`\${src}?w=320 320w, \${src}?w=640 640w\`}
        sizes={sizes}
      />
      <img
        src={\`\${src}?w=640\`}
        alt={alt}
        loading={loading}
        className="w-full h-auto"
      />
    </picture>
  );
}

// Resource hints
function ResourceHints() {
  return (
    <head>
      <link
        rel="preconnect"
        href="https://fonts.googleapis.com"
        crossOrigin="anonymous"
      />
      <link
        rel="preload"
        href="/fonts/inter-var.woff2"
        as="font"
        type="font/woff2"
        crossOrigin="anonymous"
      />
      <link
        rel="prefetch"
        href="/app-shell.js"
      />
    </head>
  );
}
\`\`\`

### 2. Error Prevention

Implement mobile-friendly error prevention:

\`\`\`typescript
interface ValidationRule {
  test: (value: string) => boolean;
  message: string;
}

interface FieldValidation {
  [key: string]: ValidationRule[];
}

function useMobileFormValidation(validationRules: FieldValidation) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const validate = (name: string, value: string) => {
    const fieldRules = validationRules[name] || [];
    const fieldErrors = fieldRules
      .map(rule => (!rule.test(value) ? rule.message : null))
      .filter(Boolean);
    
    return fieldErrors[0] || '';
  };

  const handleBlur = (name: string, value: string) => {
    setTouched(prev => ({ ...prev, [name]: true }));
    const error = validate(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleChange = (name: string, value: string) => {
    if (touched[name]) {
      const error = validate(name, value);
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  };

  return {
    errors,
    handleBlur,
    handleChange,
    isValid: Object.keys(errors).length === 0
  };
}

// Example usage
function MobileForm() {
  const validation = useMobileFormValidation({
    email: [
      {
        test: (value) => /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(value),
        message: 'Please enter a valid email address'
      }
    ],
    phone: [
      {
        test: (value) => /^\\d{10}$/.test(value),
        message: 'Please enter a 10-digit phone number'
      }
    ]
  });

  return (
    <form noValidate>
      <div className="form-field">
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          inputMode="email"
          autoComplete="email"
          onBlur={(e) => validation.handleBlur('email', e.target.value)}
          onChange={(e) => validation.handleChange('email', e.target.value)}
          aria-invalid={!!validation.errors.email}
          aria-describedby={validation.errors.email ? 'email-error' : undefined}
        />
        {validation.errors.email && (
          <div id="email-error" className="error" role="alert">
            {validation.errors.email}
          </div>
        )}
      </div>
    </form>
  );
}
\`\`\`

## Resources and Tools

### Mobile Testing Tools
- [Chrome DevTools Mobile Simulator](https://developers.google.com/web/tools/chrome-devtools/device-mode)
- [Safari Web Inspector](https://developer.apple.com/safari/tools/)
- [Mobile Accessibility Testing Tools](https://www.w3.org/WAI/standards-guidelines/mobile/tools/)

### Guidelines and Documentation
- [WCAG 2.1 Mobile Accessibility](https://www.w3.org/WAI/standards-guidelines/mobile/)
- [Mobile Accessibility Testing Guide](https://www.w3.org/WAI/standards-guidelines/mobile/testing/)
- [Mobile Input Types](https://www.w3.org/WAI/WCAG21/Understanding/input-purposes.html)

## Conclusion

Mobile accessibility requires careful consideration of touch interactions, responsive design, and device-specific features. By following these guidelines and implementing proper testing procedures, you can create mobile web applications that are truly accessible to all users.

Remember that mobile accessibility is an ongoing process that requires regular testing and updates to ensure compatibility with new devices and technologies.
`,
  category: 'wcag',
  tags: ['WCAG 2.1', 'Mobile Accessibility', 'Touch Interactions', 'Responsive Design', 'Mobile Testing'],
  author: {
    name: 'Dr. Sarah Williams',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    role: 'Accessibility Expert'
  },
  publishedAt: '2024-03-19T16:00:00Z',
  readingTime: '25 min read',
  vectorImage: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
  tableOfContents: [
    { id: 'understanding-mobile-accessibility', title: 'Understanding Mobile Accessibility', level: 2 },
    { id: 'implementation-guide', title: 'Implementation Guide', level: 2 },
    { id: 'testing-mobile-accessibility', title: 'Testing Mobile Accessibility', level: 2 },
    { id: 'best-practices', title: 'Best Practices', level: 2 },
    { id: 'resources-and-tools', title: 'Resources and Tools', level: 2 }
  ]
};