# AccessWebPro UI Skin Implementation Guide

This document provides comprehensive guidelines for implementing the AccessWebPro UI skin across the application. It covers the design system, component styles, and implementation strategies.

## Table of Contents

1. [Color System](#color-system)
2. [Typography](#typography)
3. [Component Styling](#component-styling)
4. [Page-Specific Guidelines](#page-specific-guidelines)
5. [Responsive Design](#responsive-design)
6. [Accessibility Compliance](#accessibility-compliance)
7. [Implementation Workflow](#implementation-workflow)

## Color System

### Primary Colors
- Primary Teal/Mint: `#0fae96` (light mode), `#5eead4` (dark mode)
- Secondary Blue: `#0066FF`

### UI States
- Hover Effect (Light Mode): `bg-[#0fae96]/5` (5% opacity)
- Hover Effect (Dark Mode): `bg-[#0fae96]/10` (10% opacity)
- Active State (Light Mode): `bg-[#e6f8f5] text-[#0fae96]`
- Active State (Dark Mode): `bg-[#0fae96]/20 text-[#5eead4]`

### Semantic Colors
- Success: `#10b981`
- Warning: `#f59e0b`
- Error: `#ef4444`
- Info: `#3b82f6`

### Implementation Strategy
When implementing the color system:
1. Replace all hardcoded colors with the appropriate variables
2. Use semantic color variables for consistent meaning
3. Always include dark mode alternatives

## Typography

### Font System
- Base font size: 16px (1rem)
- Line heights: 1.5 for body text, 1.2 for headings
- Font weights: 400 (regular), 500 (medium), 600 (semibold), 700 (bold)

### Text Styles
- Body text: `text-base text-gray-700 dark:text-gray-300`
- Headings: 
  - H1: `text-3xl md:text-4xl font-bold text-gray-900 dark:text-white`
  - H2: `text-2xl md:text-3xl font-bold text-gray-900 dark:text-white`
  - H3: `text-xl md:text-2xl font-semibold text-gray-900 dark:text-white`
  - H4: `text-lg font-semibold text-gray-900 dark:text-white`
- Small/Helper text: `text-sm text-gray-500 dark:text-gray-400`

### Implementation Strategy
1. Maintain consistent type scale throughout the application
2. Use appropriate heading levels for semantic structure
3. Ensure text contrast meets WCAG AA standards (4.5:1 for normal text)

## Component Styling

### Buttons
- Primary Button: `bg-[#0066FF] hover:bg-[#0066FF]/90 text-white px-6 py-2 rounded-full`
- Secondary Button: `bg-white dark:bg-slate-800 text-muted-foreground border border-gray-200 dark:border-slate-700 hover:bg-gray-100 dark:hover:bg-slate-700 px-6 py-2 rounded-full`
- Icon Button: `rounded-full p-2 hover:bg-[#0fae96]/5 dark:hover:bg-[#0fae96]/10`

### Cards
- Basic Card: `bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl shadow-sm p-6`
- Hoverable Card: Add `hover:shadow-md transition-all duration-200` to basic card
- Feature Card: Add `rounded-full bg-[#0fae96]/10 dark:bg-[#0fae96]/20 p-3 inline-block mb-4` for icon container

### Form Elements
- Input: `border-gray-200 dark:border-slate-700 rounded-lg p-3 text-base focus-visible:ring-1 focus-visible:ring-[#0fae96]`
- Checkbox: `rounded border-gray-300 text-[#0fae96] focus:ring-[#0fae96] h-5 w-5`
- Select: `border-gray-200 dark:border-slate-700 rounded-lg p-3 text-base`

### Pills / Tags
- Standard Pill: `px-4 py-2 rounded-full text-base font-medium`
- Colored Pill: `bg-[COLOR]/10 text-[COLOR] px-4 py-2 rounded-full`
- Badge: `text-xs px-2 py-0.5 rounded-full`

### Implementation Notes
- Maintain consistent border radius (rounded-lg or rounded-xl for containers, rounded-full for pills)
- Consistent spacing patterns (p-6 for card padding, gap-4 for spacing between elements)
- Always include hover and focus states for interactive elements

## Page-Specific Guidelines

### WCAG Checker Page
The WCAG Checker page should be styled following these guidelines:

#### Container & Card
- Page container: `container mx-auto p-6`
- Main card: `max-w-3xl mx-auto bg-white dark:bg-slate-800 rounded-xl shadow-sm p-8`

#### Header
- Title: `text-3xl font-semibold text-center mb-2 text-gray-900 dark:text-white`
- Description: `text-gray-600 dark:text-gray-400 text-center mb-6`

#### Country Tabs
- Container: `flex flex-wrap justify-center gap-2 mb-6`
- Active tab: `px-4 py-2 rounded-full bg-[#e6f8f5] text-[#0fae96] dark:bg-[#0fae96]/20 dark:text-[#5eead4]`
- Inactive tab: `px-4 py-2 rounded-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700`

#### Standards Pills
- Container: `flex flex-wrap justify-center gap-2 mb-8`
- Pills should use the colored pill style: `bg-[COLOR]/10 text-[COLOR] px-4 py-1.5 rounded-full`
- Color mapping:
  - EN 301 549: Rose/Pink (`#ef4444`)
  - EAA: Amber (`#f59e0b`)
  - WCAG 2.1: Primary Teal (`#0fae96`)
  - WCAG 2.2: Purple (`#8b5cf6`)

#### Testing Options
- Container: `bg-[#0fae96]/5 dark:bg-[#0fae96]/10 rounded-lg p-4 mb-8`
- Grid layout: `grid grid-cols-2 gap-4`
- Checkbox: `rounded border-gray-300 text-[#0fae96] focus:ring-[#0fae96] h-5 w-5`
- PRO badge: `ml-1 bg-[#0fae96] text-white text-xs px-1.5 py-0.5 rounded-full`

#### URL Input
- Container: `flex flex-col sm:flex-row gap-3 mb-4`
- Input: `border-gray-200 dark:border-slate-700 rounded-lg p-3 text-base focus-visible:ring-1 focus-visible:ring-[#0fae96] flex-1`
- Button: `bg-[#0066FF] hover:bg-[#0066FF]/90 text-white px-6 py-2 rounded-full`

#### Help Text
- `text-[#0fae96] dark:text-[#5eead4] text-sm text-center`

## Responsive Design

### Breakpoints
- Mobile: Default styles
- Tablet: `md:` (768px and above)
- Desktop: `lg:` (1024px and above)
- Large desktop: `xl:` (1280px and above)

### Layout Guidelines
- Use `flex-col sm:flex-row` for vertical-to-horizontal layouts
- Apply responsive margins and padding: `p-4 md:p-6 lg:p-8`
- Adjust font sizes for readability: `text-2xl md:text-3xl lg:text-4xl`

### Implementation Strategy
1. Start with mobile designs first
2. Add breakpoints progressively for larger screens
3. Test all layouts at common breakpoints

## Accessibility Compliance

### Color Contrast
- Ensure background-to-text contrast ratio of at least 4.5:1
- Use the provided contrast checking utility for verification

### Focus States
- All interactive elements must include:
  - `focus-visible:ring-2`
  - `focus-visible:ring-[#0fae96]`
  - `focus-visible:ring-offset-2`

### Keyboard Navigation
- Preserve tab order
- Ensure all interactive elements are keyboard accessible

### Screen Reader Support
- Include appropriate aria-labels
- Maintain semantic HTML structure

## Implementation Workflow

### Recommended Approach
1. Start with global styles (colors, typography, theme toggle)
2. Update common components (buttons, inputs, cards)
3. Apply page-specific styles in priority order
4. Test for responsive behavior and accessibility compliance

### Testing Checklist
- Verify all styles in both light and dark modes
- Test keyboard navigation
- Validate color contrast with the contrast checker utility
- Verify responsive layouts at all breakpoints

### Common Issues and Solutions
- If styles aren't applying, check specificity and class order
- For dark mode issues, ensure `.dark` classes are properly applied
- For focus state problems, verify that focus-visible polyfill is present