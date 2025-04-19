# Universal Standards for AccessWeb

## Layout & Spacing
1. Page Container
   - All pages must use `.page-container` class
   - Includes standard top padding (130px) and bottom padding
   - Includes min-height and background color

2. Content Container
   - Use `.container` class for consistent width and padding
   - Maximum width: max-w-7xl
   - Responsive padding: px-4 sm:px-6 lg:px-8

3. Section Spacing
   - Use `.section` class for vertical padding
   - Use `.section-container` for sections with container
   - Standard spacing between sections: space-y-16 md:space-y-24
   - Standard spacing between components: space-y-6

4. Component Spacing
   - Headings: mb-8
   - Form groups: mb-6
   - Grid gaps: gap-6
   - Lists: space-y-4

## Typography
1. Font Families
   - Primary: Inter
   - Display: Plus Jakarta Sans
   - System fallbacks included

2. Heading Sizes
   - H1: text-4xl md:text-5xl font-bold
   - H2: text-3xl font-bold
   - H3: text-2xl font-semibold
   - H4: text-xl font-semibold

3. Text Colors
   - Primary: text-gray-900
   - Secondary: text-gray-600
   - Muted: text-gray-400

## Components
1. Cards
   - Use `.card` class
   - Consistent padding and shadow
   - Rounded corners

2. Buttons
   - Use `.btn` base class
   - Variants: .btn-primary, .btn-secondary
   - Consistent padding and transitions

3. Forms
   - Use `.form-group` for spacing
   - Use `.input` for form controls
   - Use `.label` for form labels

## Grid System
1. Standard Grid
   - Use grid-cols-1 as base
   - Responsive: md:grid-cols-2 lg:grid-cols-3
   - Standard gap: gap-6

## Dark Mode
1. Color Schemes
   - Light background: bg-gray-50
   - Dark background: dark:bg-gray-900
   - Card background: bg-white dark:bg-gray-800

## Accessibility
1. Focus States
   - Visible focus indicators
   - Consistent ring color and width
   - Proper contrast

2. Interactive Elements
   - Minimum touch targets
   - Clear hover states
   - Proper spacing

## Animation
1. Transitions
   - Use consistent durations
   - Smooth easing
   - Respect reduced motion

## Implementation
1. Page Structure
   - Always use .page-container
   - Always use .container for content
   - Follow standard spacing
   - Use semantic HTML

2. Component Usage
   - Use provided utility classes
   - Maintain consistent spacing
   - Follow responsive patterns