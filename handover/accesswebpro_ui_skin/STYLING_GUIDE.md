# AccessWebPro Styling Guide

## Color Palette

### Primary Colors
- Primary Blue: `#0066FF`
- Teal/Mint (Light Mode): `#0fae96`
- Teal/Mint (Dark Mode): `#5eead4`

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

## Typography

### Font Sizes
- Base Text: `text-base` (16px minimum for accessibility)
- Small Text: `text-sm` (Only for secondary information)
- Headings:
  - H1: `text-3xl md:text-4xl font-bold`
  - H2: `text-2xl md:text-3xl font-bold`
  - H3: `text-xl md:text-2xl font-semibold`
  - H4: `text-lg font-semibold`

### Font Weights
- Normal Text: `font-normal`
- Medium: `font-medium`
- Semi-bold: `font-semibold`
- Bold: `font-bold`

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

## Layout Guidelines

### Spacing
- Container: `container mx-auto px-4`
- Section Spacing: `mb-8` or `mb-16` for larger sections
- Element Spacing: `gap-4` or `space-y-4`

### Responsive Breakpoints
- Mobile First: Default styles for mobile
- Tablet: `md:` prefix (768px and up)
- Desktop: `lg:` prefix (1024px and up)
- Large Desktop: `xl:` prefix (1280px and up)

### Grid System
- Basic Grid: `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6`
- Two Column: `grid grid-cols-1 md:grid-cols-2 gap-6`
- Sidebar Layout: `grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-8`

## Accessibility Guidelines

### Focus States
- All interactive elements must have a visible focus state
- Use `focus-visible:ring-2 focus-visible:ring-[#0fae96] focus-visible:ring-offset-2`

### Text Contrast
- Ensure sufficient contrast between text and background
- Minimum contrast ratio of 4.5:1 for normal text, 3:1 for large text

### Screen Reader Support
- All images must have alt text
- All form elements must have associated labels
- Use ARIA attributes when necessary