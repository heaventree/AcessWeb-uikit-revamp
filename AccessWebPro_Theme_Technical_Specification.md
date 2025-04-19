# AccessWebPro Theme Technical Specification

## Theme Architecture

The AccessWebPro UI skin is built on a modern CSS variable-based theming system that allows for consistent styling across the application while supporting both light and dark modes.

### CSS Variables Structure

The theme uses a hierarchical structure of CSS variables:

```css
:root {
  /* Base colors */
  --color-primary-50: 240, 249, 255;  /* #f0f9ff */
  --color-primary-100: 224, 242, 254; /* #e0f2fe */
  /* ... more color variables */
  
  /* Semantic meanings */
  --background: var(--color-neutral-50);
  --foreground: var(--color-neutral-900);
  --card: var(--color-white);
  --card-foreground: var(--color-neutral-900);
  /* ... more semantic variables */
  
  /* Component-specific variables */
  --button-primary-bg: var(--color-primary-600);
  --button-primary-text: var(--color-white);
  /* ... more component variables */
  
  /* Sizing and spacing */
  --spacing-1: 0.25rem;
  --spacing-2: 0.5rem;
  /* ... more spacing variables */
}

.dark {
  /* Dark mode overrides */
  --background: var(--color-neutral-950);
  --foreground: var(--color-neutral-50);
  --card: var(--color-neutral-900);
  --card-foreground: var(--color-neutral-50);
  /* ... more dark mode overrides */
}
```

### Theme Implementation

The theme is implemented through several key components:

1. **Base CSS Variables**: Defined in a global CSS file
2. **Theme Toggle**: A component that toggles between light and dark modes
3. **Component-Specific Styles**: Each component uses the theme variables for consistent styling

## Color System

### Primary Colors

The primary color palette is based on a teal/mint accent with the following key colors:

- Primary: #0fae96 (teal/mint accent)
- Secondary: #0066FF (blue)
- Success: #10b981 (green)
- Warning: #f59e0b (amber)
- Danger: #ef4444 (red)
- Info: #3b82f6 (blue)

### Neutral Colors

The neutral palette provides a range of grays for text, backgrounds, and borders:

- Neutral-50: #f9fafb (lightest)
- Neutral-100: #f3f4f6
- Neutral-200: #e5e7eb
- Neutral-300: #d1d5db
- Neutral-400: #9ca3af
- Neutral-500: #6b7280
- Neutral-600: #4b5563
- Neutral-700: #374151
- Neutral-800: #1f2937
- Neutral-900: #111827
- Neutral-950: #030712 (darkest)

## Accessibility Features

### Contrast Checking

The theme includes a contrast checking utility that ensures all color combinations meet WCAG standards:

```typescript
export function checkWCAGCompliance(
  foreground: string,
  background: string,
  isLargeText: boolean = false
): {
  ratio: number;
  AA: boolean;
  AAA: boolean;
  formattedRatio: string;
} {
  const ratio = getContrastRatio(foreground, background);
  
  // WCAG 2.1 Level AA requires a contrast ratio of at least:
  // 4.5:1 for normal text and 3:1 for large text
  const AA = isLargeText ? ratio >= 3 : ratio >= 4.5;
  
  // WCAG 2.1 Level AAA requires a contrast ratio of at least:
  // 7:1 for normal text and 4.5:1 for large text
  const AAA = isLargeText ? ratio >= 4.5 : ratio >= 7;
  
  return {
    ratio,
    AA,
    AAA,
    formattedRatio: formatContrastRatio(ratio)
  };
}
```

### Dark Mode Implementation

Dark mode is implemented using a class-based approach where the `.dark` class is added to the `html` element. The implementation avoids the React Context API due to issues with the previous implementation:

```typescript
// Simple theme toggle function
function toggleTheme() {
  const root = window.document.documentElement;
  
  if (root.classList.contains("dark")) {
    root.classList.remove("dark");
    root.classList.add("light");
    localStorage.setItem("accessweb-theme", "light");
  } else {
    root.classList.remove("light");
    root.classList.add("dark");
    localStorage.setItem("accessweb-theme", "dark");
  }
}
```

### WCAG Badge Component

The WCAG Badge component visually indicates compliance with WCAG standards:

```typescript
interface WCAGBadgeProps {
  level: 'A' | 'AA' | 'AAA';
  showTooltip?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function WCAGBadge({ level, showTooltip = true, size = 'md' }: WCAGBadgeProps) {
  // Component implementation
}
```

## Component Design System

### Components Structure

UI components are organized into these categories:

1. **Core Components**: Basic building blocks (buttons, inputs, cards)
2. **Composite Components**: Combinations of core components (forms, tables)
3. **Page Components**: Full page layouts and templates
4. **Utility Components**: Helpers for accessibility and other functions

### Styling Approach

Components use a combination of:

1. CSS variables for theming
2. Tailwind CSS for utility-based styling
3. CSS modules for component-specific styles

### Responsive Design

The theme implements responsive design using:

1. Mobile-first approach with progressive enhancement
2. Breakpoint-based media queries
3. Flexible layout techniques (CSS Grid and Flexbox)

## Integration Guidelines

### Adding the Theme to Existing Components

To apply the theme to existing components:

1. Import the base CSS variables
2. Replace hard-coded colors with theme variables
3. Add appropriate dark mode selectors

Example:
```css
.button {
  /* Before */
  background-color: #0066FF;
  color: white;
  
  /* After */
  background-color: var(--button-primary-bg);
  color: var(--button-primary-text);
}
```

### Creating New Themed Components

When creating new components:

1. Use the existing variable naming conventions
2. Test in both light and dark modes
3. Verify accessibility with the contrast checker

## Performance Considerations

### CSS Optimization

The theme is optimized for performance by:

1. Using CSS variables to minimize duplication
2. Separating theme variables from component styles
3. Structuring specificity to avoid unnecessary overrides

### Runtime Performance

The theme toggle avoids React Context for better performance and uses:

1. Direct DOM manipulation for class toggling
2. localStorage for theme persistence
3. Initial theme determination on first render only

## Appendix

### Color Palette Reference

| Color Name | Light Mode | Dark Mode |
|------------|------------|-----------|
| Background | #f9fafb | #030712 |
| Foreground | #111827 | #f9fafb |
| Primary | #0fae96 | #0fae96 |
| Secondary | #0066FF | #3b82f6 |
| Muted | #f3f4f6 | #1f2937 |
| Muted Foreground | #6b7280 | #9ca3af |
| Accent | #e5e7eb | #374151 |
| Accent Foreground | #111827 | #f9fafb |

### Spacing Scale

| Variable | Size | Pixels (approx.) |
|----------|------|------------------|
| --spacing-1 | 0.25rem | 4px |
| --spacing-2 | 0.5rem | 8px |
| --spacing-3 | 0.75rem | 12px |
| --spacing-4 | 1rem | 16px |
| --spacing-5 | 1.25rem | 20px |
| --spacing-6 | 1.5rem | 24px |
| --spacing-8 | 2rem | 32px |
| --spacing-10 | 2.5rem | 40px |
| --spacing-12 | 3rem | 48px |
| --spacing-16 | 4rem | 64px |