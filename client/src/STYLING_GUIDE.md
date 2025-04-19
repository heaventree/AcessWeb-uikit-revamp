# AccessWebPro UI Skin - Styling Guide

This document provides essential styling guidelines to ensure consistent implementation of the UI skin across all components.

## Core Design Principles

### Visual Hierarchy
- Primary actions use solid, pill-shaped buttons with brand colors
- Secondary actions use more subtle styling but maintain sufficient contrast
- Content is organized in clear sections with adequate spacing
- Information density is balanced for readability

### Minimalist Aesthetic
- Clean, uncluttered layouts with ample whitespace
- Visual elements serve a clear purpose
- Limited use of decorative elements
- Strong focus on content and functionality

## Color System

### Primary Colors
- Primary Blue: #0066FF
  - Used for primary actions, links, and key UI elements
  - Dark mode variant: brighter blue (#3B82F6) for better visibility

- Teal/Mint Accent: #0fae96
  - Used for secondary elements, highlights, and success states
  - Dark mode variant: brighter teal (#2DD4BF)

### UI Colors
- Background: Light gray (#F8FAFC) in light mode, Dark blue-gray (#0F172A) in dark mode
- Foreground (Text): Dark blue-gray (#0F172A) in light mode, Very light gray (#F8FAFC) in dark mode
- Border: Light gray (#E2E8F0) in light mode, Medium gray-blue (#334155) in dark mode
- Muted: Medium gray (#64748B) in light mode, Light gray (#94A3B8) in dark mode

### Feedback Colors
- Success: Green (#22C55E)
- Warning: Amber (#F59E0B)
- Error: Red (#EF4444)
- Info: Blue (#3B82F6)

## Typography

### Font Family
- Primary: System UI font stack (native sans-serif)
- Monospace: For code examples and technical content

### Font Sizing
- Base: 16px (1rem)
- Scale: 1.25 ratio
- Headings:
  - H1: 2rem (32px)
  - H2: 1.75rem (28px)
  - H3: 1.5rem (24px)
  - H4: 1.25rem (20px)
  - H5: 1.125rem (18px)
  - H6: 1rem (16px)

### Font Weight
- Regular text: 400
- Section headings: 600
- Page titles: 700
- Interface labels: 500

## UI Elements

### Buttons
- Primary: Solid pill shape with brand color (#0066FF), white text, subtle hover effect
- Secondary: Pill shape with lighter styling, clear hover state
- Ghost: Minimal styling with hover effect for tertiary actions
- Icon buttons: Clear touch target (minimum 44x44px)

### Cards
- Light shadow (2px blur)
- 8px border radius
- Consistent padding (16px-24px)
- Optional highlight border on active/selected state

### Form Elements
- Inputs: Clear borders, consistent padding, visible focus states
- Checkboxes: Custom styling with animated checks
- Radio buttons: Custom styling with brand colors
- Selects: Custom dropdown styling with animated transitions
- Validation: Clear error states with appropriate feedback

### Modals & Dialogs
- Centered overlay with background dimming
- Card-like styling with clear headers
- Prominent action buttons
- Close button for dismissal

## Spacing System

### Base Unit
- 4px base unit
- Spacing scale: 4, 8, 12, 16, 24, 32, 48, 64, 96

### Content Spacing
- Paragraph margins: 16px (1rem)
- Section spacing: 48px (3rem)
- Component internal spacing: 16px (1rem)
- List item spacing: 8px (0.5rem)

## Accessibility Considerations

### Contrast
- Text meets WCAG AA standards (4.5:1 for normal text, 3:1 for large text)
- UI elements meet 3:1 contrast ratio against adjacent colors
- Focus states have sufficient contrast

### Interactive States
- Clear hover states on all interactive elements
- Distinct focus styling for keyboard navigation
- Active/pressed states for buttons and controls

### Responsiveness
- Mobile-first approach
- Standard breakpoints:
  - sm: 640px
  - md: 768px
  - lg: 1024px
  - xl: 1280px
  - 2xl: 1536px

### Dark Mode
- Not just inverted colors, but thoughtfully designed for reduced eye strain
- Slightly reduced contrast (but still meeting WCAG requirements)
- Softer shadows and glow effects