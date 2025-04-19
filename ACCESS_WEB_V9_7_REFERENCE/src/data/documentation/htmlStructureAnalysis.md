# HTML Structure Analysis Guide

## Overview

HTML Structure Analysis examines the structural elements of a webpage to ensure they follow accessibility best practices and WCAG guidelines. This feature identifies issues related to heading hierarchy, semantic HTML usage, and document structure that could impact screen reader users and those with cognitive disabilities.

## Key Features

- **Heading Structure Analysis**: Validates proper heading hierarchy (H1-H6)
- **Semantic HTML Detection**: Identifies proper (or improper) use of semantic elements
- **Document Outline Evaluation**: Assesses the logical structure of the document
- **URL Design Analysis**: Checks for user-friendly, accessible URL patterns
- **Navigation Structure Check**: Evaluates menu and navigation accessibility

## How to Use

1. Navigate to the WCAG Checker page
2. Enter the URL you want to analyze
3. Make sure the "Test HTML Structure" option is enabled (this is enabled by default)
4. Click "Analyze URL"
5. Navigate to the "Structure" tab in the results section to view structure-related issues

## Understanding the Results

### Structure Tab

The Structure tab in the results section organizes issues by category:

- **Heading Issues**: Problems with heading levels, hierarchy, or usage
- **Semantic Structure Issues**: Improper use of HTML5 semantic elements
- **Navigation Issues**: Problems with menus, links, or site architecture
- **URL Design Issues**: Problems with URL readability or structure

Each issue is marked with a severity indicator and includes:
- A detailed description of the problem
- The WCAG success criterion it violates
- A specific recommendation for fixing the issue

### Common Issues Detected

1. **Multiple H1 Tags**
   - WCAG Reference: 1.3.1 (Level A), 2.4.6 (Level AA)
   - Description: Only one main heading (H1) should exist on a page to properly define the page topic.
   - Solution: Keep only one H1 tag that clearly describes the page content.

2. **Skipped Heading Levels**
   - WCAG Reference: 1.3.1 (Level A)
   - Description: Heading levels should not be skipped (e.g., H2 to H4 without H3).
   - Solution: Ensure headings follow a proper hierarchical structure without gaps.

3. **Empty Headings**
   - WCAG Reference: 1.3.1 (Level A), 2.4.6 (Level AA)
   - Description: Headings without content provide no information to screen reader users.
   - Solution: Ensure all heading elements contain descriptive text.

4. **Missing Landmark Elements**
   - WCAG Reference: 1.3.1 (Level A), 2.4.1 (Level A)
   - Description: Semantic landmark elements help screen reader users navigate the page.
   - Solution: Use semantic elements like `<header>`, `<main>`, `<nav>`, and `<footer>`.

5. **Non-Descriptive URLs**
   - WCAG Reference: 2.4.4 (Level A)
   - Description: URLs with random strings or codes are less accessible and harder to share.
   - Solution: Use descriptive, keyword-rich URLs that indicate content purpose.

## Pro Tips

1. **Document Outline**: Use the HTML5 outline algorithm tools to verify your page structure.

2. **Heading Purpose**: Headings should clearly describe the section that follows them.

3. **ARIA Roles**: When semantic HTML elements aren't available, use appropriate ARIA roles.

4. **URL Best Practices**: Keep URLs concise, descriptive, and avoid special characters.

5. **Testing with Screen Readers**: Use a screen reader to navigate your page by headings and landmarks.

## Related Resources

- [WCAG 2.1 Info and Relationships](https://www.w3.org/WAI/WCAG21/Understanding/info-and-relationships.html)
- [Semantic HTML Guide](https://developer.mozilla.org/en-US/docs/Learn/Accessibility/HTML)
- [WebAIM: Semantic Structure](https://webaim.org/techniques/semanticstructure/)

For more detailed guidance on implementing proper HTML structure, please consult the WCAG documentation or contact our support team.