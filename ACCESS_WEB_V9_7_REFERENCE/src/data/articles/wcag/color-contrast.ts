import type { Article } from '../../../types/blog';

export const wcagColorContrast: Article = {
  id: 'wcag-color-contrast',
  slug: 'wcag-2-1-color-contrast-guide',
  title: 'WCAG 2.1 Color Contrast: A Complete Guide to Accessible Colors',
  description: 'A comprehensive guide to understanding and implementing WCAG 2.1 color contrast requirements, including tools, techniques, and best practices for creating accessible color schemes.',
  content: `
# WCAG 2.1 Color Contrast: A Complete Guide to Accessible Colors

Color contrast is a fundamental aspect of web accessibility. This comprehensive guide covers everything you need to know about implementing WCAG 2.1 color contrast requirements to ensure your content is readable by all users.

## Understanding Color Contrast Requirements

### WCAG Success Criteria

WCAG 2.1 includes specific requirements for color contrast:

1. **1.4.3 Contrast (Minimum) - Level AA**
   - Text and images of text have a contrast ratio of at least 4.5:1
   - Large text (18pt or 14pt bold) has a contrast ratio of at least 3:1

2. **1.4.6 Contrast (Enhanced) - Level AAA**
   - Text and images of text have a contrast ratio of at least 7:1
   - Large text (18pt or 14pt bold) has a contrast ratio of at least 4.5:1

3. **1.4.11 Non-text Contrast - Level AA**
   - Visual information required to identify UI components has a contrast ratio of at least 3:1
   - Applies to form controls, focus indicators, and other interface elements

## Implementing Accessible Color Contrast

### 1. Base Color System

Create a color system with accessibility built in:

\`\`\`css
:root {
  /* Primary Colors with Accessible Variants */
  --primary-50: #f0f9ff;  /* Light background */
  --primary-100: #e0f2fe; /* Light background */
  --primary-200: #bae6fd; /* Light background */
  --primary-300: #7dd3fc; /* Light background */
  --primary-400: #38bdf8; /* Light background */
  --primary-500: #0ea5e9; /* Border, icons */
  --primary-600: #0284c7; /* Primary text on light */
  --primary-700: #0369a1; /* Primary text on light */
  --primary-800: #075985; /* Primary text on light */
  --primary-900: #0c4a6e; /* Primary text on light */

  /* Neutral Colors for Text */
  --gray-50: #f9fafb;   /* Background */
  --gray-100: #f3f4f6;  /* Background */
  --gray-200: #e5e7eb;  /* Background */
  --gray-300: #d1d5db;  /* Disabled background */
  --gray-400: #9ca3af;  /* Disabled text */
  --gray-500: #6b7280;  /* Secondary text */
  --gray-600: #4b5563;  /* Primary text */
  --gray-700: #374151;  /* Primary text */
  --gray-800: #1f2937;  /* Primary text */
  --gray-900: #111827;  /* Primary text */

  /* Semantic Colors */
  --success-50: #f0fdf4;
  --success-500: #22c55e;
  --success-700: #15803d;
  
  --error-50: #fef2f2;
  --error-500: #ef4444;
  --error-700: #b91c1c;
  
  --warning-50: #fffbeb;
  --warning-500: #f59e0b;
  --warning-700: #b45309;
}

/* Base Text Styles with Accessible Contrast */
body {
  color: var(--gray-900);
  background-color: var(--gray-50);
}

/* Primary Text Styles */
.text-primary {
  color: var(--primary-700);
}

/* Secondary Text */
.text-secondary {
  color: var(--gray-600);
}

/* Links */
a {
  color: var(--primary-700);
  text-decoration: underline;
}

a:hover {
  color: var(--primary-800);
}

/* Form Elements */
input, 
select, 
textarea {
  border-color: var(--gray-300);
  color: var(--gray-900);
  background-color: white;
}

/* Buttons */
.btn-primary {
  background-color: var(--primary-600);
  color: white;
}

.btn-primary:hover {
  background-color: var(--primary-700);
}

.btn-secondary {
  background-color: var(--gray-200);
  color: var(--gray-900);
}

.btn-secondary:hover {
  background-color: var(--gray-300);
}
\`\`\`

### 2. Color Contrast Functions

Create utility functions to check contrast ratios:

\`\`\`typescript
interface RGB {
  r: number;
  g: number;
  b: number;
}

interface HSL {
  h: number;
  s: number;
  l: number;
}

class ColorContrastChecker {
  private static hexToRgb(hex: string): RGB {
    const result = /^#?([a-f\\d]{2})([a-f\\d]{2})([a-f\\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 0, g: 0, b: 0 };
  }

  private static rgbToHsl(rgb: RGB): HSL {
    let { r, g, b } = rgb;
    r /= 255;
    g /= 255;
    b /= 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0;
    let s = 0;
    const l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      
      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
          break;
      }
      
      h /= 6;
    }

    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100)
    };
  }

  private static getLuminance(rgb: RGB): number {
    const [rs, gs, bs] = Object.values(rgb).map(val => {
      val /= 255;
      return val <= 0.03928
        ? val / 12.92
        : Math.pow((val + 0.055) / 1.055, 2.4);
    });
    return rs * 0.2126 + gs * 0.7152 + bs * 0.0722;
  }

  static getContrastRatio(color1: string, color2: string): number {
    const l1 = this.getLuminance(this.hexToRgb(color1));
    const l2 = this.getLuminance(this.hexToRgb(color2));
    const lighter = Math.max(l1, l2);
    const darker = Math.min(l1, l2);
    return (lighter + 0.05) / (darker + 0.05);
  }

  static meetsWCAG2AA(color1: string, color2: string, isLargeText = false): boolean {
    const ratio = this.getContrastRatio(color1, color2);
    return isLargeText ? ratio >= 3 : ratio >= 4.5;
  }

  static meetsWCAG2AAA(color1: string, color2: string, isLargeText = false): boolean {
    const ratio = this.getContrastRatio(color1, color2);
    return isLargeText ? ratio >= 4.5 : ratio >= 7;
  }

  static getSuggestedColors(
    baseColor: string,
    backgroundColor: string,
    targetRatio: number
  ): string[] {
    const baseHsl = this.rgbToHsl(this.hexToRgb(baseColor));
    const suggestions: string[] = [];
    
    // Try adjusting lightness
    for (let l = 0; l <= 100; l += 5) {
      const adjustedColor = \`hsl(\${baseHsl.h}, \${baseHsl.s}%, \${l}%)\`;
      const ratio = this.getContrastRatio(adjustedColor, backgroundColor);
      
      if (ratio >= targetRatio) {
        suggestions.push(adjustedColor);
      }
    }
    
    return suggestions;
  }
}

// Example Usage
function ColorContrastTester() {
  const [foreground, setForeground] = useState('#000000');
  const [background, setBackground] = useState('#FFFFFF');
  const [results, setResults] = useState({
    ratio: 21,
    passesAA: true,
    passesAAA: true,
    passesAALarge: true,
    passesAAALarge: true
  });

  useEffect(() => {
    const ratio = ColorContrastChecker.getContrastRatio(foreground, background);
    setResults({
      ratio,
      passesAA: ColorContrastChecker.meetsWCAG2AA(foreground, background),
      passesAAA: ColorContrastChecker.meetsWCAG2AAA(foreground, background),
      passesAALarge: ColorContrastChecker.meetsWCAG2AA(foreground, background, true),
      passesAAALarge: ColorContrastChecker.meetsWCAG2AAA(foreground, background, true)
    });
  }, [foreground, background]);

  return (
    <div className="color-tester">
      <div className="inputs">
        <div>
          <label htmlFor="foreground">Text Color:</label>
          <input
            type="color"
            id="foreground"
            value={foreground}
            onChange={(e) => setForeground(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="background">Background Color:</label>
          <input
            type="color"
            id="background"
            value={background}
            onChange={(e) => setBackground(e.target.value)}
          />
        </div>
      </div>

      <div className="preview" style={{ color: foreground, backgroundColor }}>
        Sample Text
      </div>

      <div className="results">
        <p>Contrast Ratio: {results.ratio.toFixed(2)}:1</p>
        <ul>
          <li>
            WCAG 2.1 AA: {results.passesAA ? '✅' : '❌'}
            {results.passesAALarge ? ' (Passes for large text)' : ''}
          </li>
          <li>
            WCAG 2.1 AAA: {results.passesAAA ? '✅' : '❌'}
            {results.passesAAALarge ? ' (Passes for large text)' : ''}
          </li>
        </ul>
      </div>
    </div>
  );
}
\`\`\`

### 3. Component-Level Implementation

Create accessible component styles:

\`\`\`typescript
interface ThemeColors {
  primary: string;
  secondary: string;
  background: string;
  text: string;
  border: string;
}

function createAccessibleTheme(baseColors: ThemeColors) {
  const checker = new ColorContrastChecker();
  
  // Verify text contrast
  const textContrast = checker.getContrastRatio(
    baseColors.text,
    baseColors.background
  );
  
  if (textContrast < 4.5) {
    throw new Error('Insufficient contrast for body text');
  }

  // Create button styles
  const buttonStyles = {
    primary: {
      background: baseColors.primary,
      text: checker.getContrastRatio(baseColors.primary, '#FFFFFF') >= 4.5
        ? '#FFFFFF'
        : '#000000'
    },
    secondary: {
      background: baseColors.secondary,
      text: checker.getContrastRatio(baseColors.secondary, '#FFFFFF') >= 4.5
        ? '#FFFFFF'
        : '#000000'
    }
  };

  return {
    colors: baseColors,
    components: {
      button: buttonStyles,
      input: {
        background: baseColors.background,
        text: baseColors.text,
        border: baseColors.border,
        placeholder: \`\${baseColors.text}80\` // 50% opacity
      }
    }
  };
}

// Example Components
function AccessibleButton({
  variant = 'primary',
  children,
  ...props
}: {
  variant?: 'primary' | 'secondary';
  children: React.ReactNode;
}) {
  const theme = useTheme();
  const styles = theme.components.button[variant];

  return (
    <button
      style={{
        backgroundColor: styles.background,
        color: styles.text,
        padding: '0.5rem 1rem',
        border: 'none',
        borderRadius: '0.25rem',
        fontSize: '1rem',
        cursor: 'pointer'
      }}
      {...props}
    >
      {children}
    </button>
  );
}

function AccessibleInput({
  label,
  id,
  ...props
}: {
  label: string;
  id: string;
}) {
  const theme = useTheme();
  const styles = theme.components.input;

  return (
    <div>
      <label
        htmlFor={id}
        style={{
          color: theme.colors.text,
          display: 'block',
          marginBottom: '0.5rem'
        }}
      >
        {label}
      </label>
      <input
        id={id}
        style={{
          backgroundColor: styles.background,
          color: styles.text,
          border: \`1px solid \${styles.border}\`,
          padding: '0.5rem',
          borderRadius: '0.25rem',
          width: '100%'
        }}
        {...props}
      />
    </div>
  );
}
\`\`\`

### 4. Testing Color Contrast

Implement contrast testing utilities:

\`\`\`typescript
interface ContrastTestResult {
  element: HTMLElement;
  foreground: string;
  background: string;
  ratio: number;
  passesAA: boolean;
  passesAAA: boolean;
  isLargeText: boolean;
}

class ContrastTester {
  static async testPage(): Promise<ContrastTestResult[]> {
    const results: ContrastTestResult[] = [];
    const elements = document.querySelectorAll('*');

    elements.forEach(element => {
      const styles = window.getComputedStyle(element);
      const foreground = styles.color;
      const background = this.getEffectiveBackground(element as HTMLElement);
      
      if (foreground && background) {
        const fontSize = parseFloat(styles.fontSize);
        const fontWeight = styles.fontWeight;
        const isLargeText = fontSize >= 18 || (fontSize >= 14 && fontWeight >= '700');
        
        const ratio = ColorContrastChecker.getContrastRatio(
          this.rgbToHex(foreground),
          this.rgbToHex(background)
        );

        results.push({
          element: element as HTMLElement,
          foreground,
          background,
          ratio,
          passesAA: isLargeText ? ratio >= 3 : ratio >= 4.5,
          passesAAA: isLargeText ? ratio >= 4.5 : ratio >= 7,
          isLargeText
        });
      }
    });

    return results;
  }

  private static getEffectiveBackground(element: HTMLElement): string {
    let current = element;
    let bg = window.getComputedStyle(current).backgroundColor;

    while (bg === 'transparent' || bg === 'rgba(0, 0, 0, 0)') {
      current = current.parentElement as HTMLElement;
      if (!current) break;
      bg = window.getComputedStyle(current).backgroundColor;
    }

    return bg || '#FFFFFF';
  }

  private static rgbToHex(rgb: string): string {
    const match = rgb.match(/^rgb\\((\\d+),\\s*(\\d+),\\s*(\\d+)\\)$/);
    if (!match) return rgb;
    
    const [_, r, g, b] = match;
    return \`#\${[r, g, b].map(x => {
      const hex = parseInt(x).toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    }).join('')}\`;
  }
}

// Example Usage
function ContrastTestingTool() {
  const [results, setResults] = useState<ContrastTestResult[]>([]);
  const [loading, setLoading] = useState(false);

  const runTest = async () => {
    setLoading(true);
    try {
      const testResults = await ContrastTester.testPage();
      setResults(testResults);
    } catch (error) {
      console.error('Error running contrast test:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contrast-tester">
      <button
        onClick={runTest}
        disabled={loading}
        className="test-button"
      >
        {loading ? 'Testing...' : 'Test Page Contrast'}
      </button>

      {results.length > 0 && (
        <div className="results">
          <h2>Contrast Test Results</h2>
          <div className="summary">
            <p>
              Total Elements Tested: {results.length}
            </p>
            <p>
              Passing AA: {
                results.filter(r => r.passesAA).length
              }
            </p>
            <p>
              Passing AAA: {
                results.filter(r => r.passesAAA).length
              }
            </p>
          </div>

          <div className="violations">
            <h3>Contrast Violations</h3>
            {results
              .filter(r => !r.passesAA)
              .map((result, index) => (
                <div key={index} className="violation">
                  <p>
                    Element: {result.element.tagName.toLowerCase()}
                    {result.element.className && 
                      \` (.\${result.element.className})\`
                    }
                  </p>
                  <p>
                    Contrast Ratio: {result.ratio.toFixed(2)}:1
                  </p>
                  <p>
                    Required: {
                      result.isLargeText ? '3:1 (AA) / 4.5:1 (AAA)' 
                                       : '4.5:1 (AA) / 7:1 (AAA)'
                    }
                  </p>
                  <div 
                    className="sample" 
                    style={{
                      color: result.foreground,
                      backgroundColor: result.background,
                      padding: '1rem',
                      marginTop: '0.5rem'
                    }}
                  >
                    Sample Text
                  </div>
                </div>
              ))
            }
          </div>
        </div>
      )}
    </div>
  );
}
\`\`\`

## Best Practices

### 1. Color Palette Design

Create accessible color palettes:

1. **Start with Base Colors**
   - Choose primary and secondary colors
   - Create light and dark variants
   - Test contrast ratios early

2. **Use Color Scales**
   - Create 10-step scales (50-900)
   - Ensure adjacent steps have sufficient contrast
   - Test text combinations

3. **Consider Color Blindness**
   - Don't rely on color alone
   - Use patterns and icons
   - Test with color blindness simulators

### 2. Text Styling

Implement accessible text styles:

1. **Font Sizes**
   - Use relative units (rem/em)
   - Maintain minimum sizes
   - Consider responsive scaling

2. **Font Weights**
   - Use appropriate weights for contrast
   - Consider bold for emphasis
   - Test different combinations

3. **Line Heights**
   - Maintain readable spacing
   - Adjust for different sizes
   - Consider language requirements

### 3. Interface Components

Design accessible UI components:

1. **Buttons and Controls**
   - Use sufficient contrast
   - Include hover/focus states
   - Add visual feedback

2. **Form Elements**
   - Clear labels and borders
   - Visible focus states
   - Error state contrast

3. **Icons and Graphics**
   - Maintain 3:1 contrast ratio
   - Include text alternatives
   - Test against backgrounds

## Tools and Resources

### Color Contrast Tools
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [Contrast Ratio Calculator](https://contrast-ratio.com/)
- [Colorable](https://colorable.jxnblk.com/)
- [Who Can Use](https://whocanuse.com/)

### Color Palette Generators
- [Coolors](https://coolors.co/)
- [Adobe Color](https://color.adobe.com/)
- [Palette.app](https://palettte.app/)
- [ColorBox](https://colorbox.io/)

### Testing Tools
- [axe DevTools](https://www.deque.com/axe/)
- [WAVE](https://wave.webaim.org/)
- [Contrast Analyzer](https://developer.paciellogroup.com/resources/contrastanalyser/)

## Conclusion

Color contrast is a fundamental aspect of web accessibility that affects all users. By following these guidelines and implementing proper testing procedures, you can ensure your web content is readable and accessible to everyone.

Remember that color contrast is not just about meeting minimum requirements—it's about creating a better user experience for all users, regardless of their visual abilities.
`,
  category: 'wcag',
  tags: ['WCAG 2.1', 'Color Contrast', 'Accessibility', 'Design', 'UI/UX'],
  author: {
    name: 'Dr. Sarah Williams',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    role: 'Accessibility Expert'
  },
  publishedAt: '2024-03-19T17:00:00Z',
  readingTime: '20 min read',
  vectorImage: 'https://images.unsplash.com/photo-1452421822248-d4c2b47f0c81?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
  tableOfContents: [
    { id: 'understanding-color-contrast-requirements', title: 'Understanding Color Contrast Requirements', level: 2 },
    { id: 'implementing-accessible-color-contrast', title: 'Implementing Accessible Color Contrast', level: 2 },
    { id: 'best-practices', title: 'Best Practices', level: 2 },
    { id: 'tools-and-resources', title: 'Tools and Resources', level: 2 }
  ]
};