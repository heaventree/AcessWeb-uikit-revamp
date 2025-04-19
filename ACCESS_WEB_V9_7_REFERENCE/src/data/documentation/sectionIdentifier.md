# Section Identifier System Guide

## Overview

The Section Identifier System provides visual indicators and unique identifiers for different sections of a webpage, helping you pinpoint exactly where accessibility issues exist. This system makes it easier to locate, track, and fix problems, especially when communicating with team members about specific accessibility concerns.

## Key Features

- **Visual Section Highlighting**: Clearly outlines different page sections
- **Persistent Identifiers**: Consistent IDs that remain stable across page navigation
- **Hierarchical Organization**: Structures identifiers to reflect the document hierarchy
- **Detailed Location Information**: Precise positioning of issues within sections
- **Copy-to-Clipboard**: Easy sharing of section references with team members

## How to Use

1. Navigate to the WCAG Checker page
2. Enter the URL you want to analyze
3. Click "Analyze URL"
4. After the analysis completes, hover over any issue to see its associated section identifier
5. Click the "Show Sections" button to highlight all page sections with their identifiers
6. Use the copy button next to any identifier to copy it to your clipboard for sharing

## Understanding Section Identifiers

### Identifier Format

Section identifiers follow a standardized format:

`SEC-[Type]-[Number]`

Where:
- **Type**: Indicates the semantic role of the section (HEAD, NAV, MAIN, SIDE, FOOT, etc.)
- **Number**: A unique sequence number for that section type

For example:
- `SEC-HEAD-1`: The primary header section
- `SEC-MAIN-1`: The main content area
- `SEC-NAV-2`: The second navigation section found on the page

### Color Coding

Sections are color-coded based on their type:

- **Header Sections**: Light blue
- **Navigation Sections**: Green
- **Main Content Sections**: Yellow
- **Sidebar Sections**: Purple
- **Footer Sections**: Gray
- **Form Sections**: Orange
- **Generic Sections**: Light gray

### Nested Sections

Nested sections use a hierarchical notation:

`SEC-MAIN-1.1`: First subsection within the main content
`SEC-MAIN-1.1.2`: Second sub-subsection within the first subsection

## Pro Tips

1. **Issue Referencing**: When reporting bugs or accessibility issues, always include the section identifier for clarity.

2. **Team Communication**: Use section identifiers when discussing specific areas of a page with designers and developers.

3. **Documentation**: Include section identifiers in your accessibility remediation documentation.

4. **Testing Focus**: During manual testing, use section identifiers to organize and prioritize your testing efforts.

5. **Progress Tracking**: Track improvements by section to show incremental progress in accessibility remediation.

## Related Resources

- [Semantic HTML Guide](https://developer.mozilla.org/en-US/docs/Learn/Accessibility/HTML)
- [Document Structure Best Practices](https://www.w3.org/WAI/tutorials/page-structure/)
- [ARIA Landmarks Guide](https://www.w3.org/WAI/ARIA/apg/practices/landmark-regions/)

For more detailed guidance on using section identifiers for accessibility testing and remediation, please contact our support team.