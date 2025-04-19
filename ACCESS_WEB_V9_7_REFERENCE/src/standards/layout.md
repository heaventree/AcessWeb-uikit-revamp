# Layout Standards

## Container System
1. Regular Pages
   - Use .container class
   - max-width-5xl (1024px)
   - Consistent padding

2. Admin Pages
   - Use .container-wide class
   - max-width-7xl (1280px)
   - Same padding system

## Vertical Spacing
1. Page Sections
   - Use .section class
   - 4rem padding (64px) on mobile
   - 6rem padding (96px) on desktop

2. Components
   - Use .component-spacing
   - 2rem gap (32px) between components

## Implementation
1. Every page should use:
   - .page-container for background/min-height
   - .container or .container-wide for width
   - .section for vertical spacing
   - .component-spacing for elements

2. Standard Structure:
```html
<div class="page-container">
  <div class="container">
    <div class="section">
      <div class="component-spacing">
        <!-- Content -->
      </div>
    </div>
  </div>
</div>
```