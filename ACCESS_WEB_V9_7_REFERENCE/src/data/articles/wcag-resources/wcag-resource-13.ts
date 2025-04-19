import type { Article } from '../../../types/blog';

export const wcagResource13: Article = {
  "id": "wcag-resource-13",
  "slug": "wcag-resource-keyboard-navigation-best-practices",
  "title": "Keyboard Navigation Best Practices",
  "description": "Foundation: Ensure every interactive element (links, buttons, form fields, custom widgets) can be reached and operated using only the keyboard (Gui...",
  "content": "# Keyboard Navigation Best Practices\n\n**Foundation**: Ensure every interactive element (links, buttons, form fields, custom widgets) can be reached and operated using only the keyboard (Guideline 2.1.1 - Level A (minimum accessibility requirements)).\n\n**Best Practices**:\n*   **Logical Focus Order (Guideline 2.4.3 - Level A (minimum accessibility requirements))**: The sequence in which elements receive focus when tabbing should make sense, usually following the visual flow (left-to-right, top-to-bottom). Modify the DOM order or use `tabindex=\"0\"` carefully if needed, avoid positive `tabindex` values.\n*   **Visible Focus Indicator (Guideline 2.4.7 - Level AA)**: The element that currently has keyboard focus must have a highly visible outline or style. Browsers provide default indicators, but they are often customized (or unfortunately, removed `outline: none;`). Ensure custom focus styles are clear and have good contrast.\n*   **Avoid Keyboard Traps (Guideline 2.1.2 - Level A)**: Users must always be able to tab *out* of any component or section. This is especially critical for modals and widgets.\n*   **Standard Interactions**: Use `Enter` for activating links and buttons, `Spacebar` for toggling checkboxes/radio buttons and activating buttons. Follow ARIA patterns for custom widgets.\n\n**Example CSS for Visible Focus**:\n```css\n/* Basic visible focus */\na:focus, button:focus, input:focus, select:focus, textarea:focus {\n  outline: 2px solid blue;\n  outline-offset: 2px;\n}\n\n/* Removing outline only if providing a better alternative */\nbutton:focus {\n  outline: none; /* Only if replacing */\n  box-shadow: 0 0 0 3px lightblue; /* Example alternative */\n}\n```",
  "category": "wcag-resources",
  "tags": [
    "WCAG",
    "Accessibility",
    "Web Standards",
    "Color Contrast",
    "Keyboard Accessibility",
    "ARIA",
    "Screen Readers",
    "Keyboard Navigation",
    "Semantic HTML",
    "Form Controls"
  ],
  "author": {
    "name": "Accessibility Team",
    "avatar": "https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    "role": "WCAG Specialists"
  },
  "publishedAt": "2023-10-24T16:14:22.999Z",
  "updatedAt": "2023-12-15T14:45:10.701Z",
  "readingTime": "3 min read",
  "vectorImage": "https://images.unsplash.com/photo-1470790376778-a9fbc86d70e2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
  "isResource": true,
  "wcagReference": "https://www.w3.org/WAI/WCAG21/Understanding/keyboard",
  "tableOfContents": [
    {
      "id": "foundation",
      "title": "Foundation",
      "level": 2
    },
    {
      "id": "best-practices",
      "title": "Best Practices",
      "level": 2
    },
    {
      "id": "logical-focus-order-guideline-243-level-a",
      "title": "Logical Focus Order (Guideline 2.4.3 - Level A)",
      "level": 2
    },
    {
      "id": "visible-focus-indicator-guideline-247-level-aa",
      "title": "Visible Focus Indicator (Guideline 2.4.7 - Level AA)",
      "level": 2
    },
    {
      "id": "avoid-keyboard-traps-guideline-212-level-a",
      "title": "Avoid Keyboard Traps (Guideline 2.1.2 - Level A)",
      "level": 2
    },
    {
      "id": "standard-interactions",
      "title": "Standard Interactions",
      "level": 2
    },
    {
      "id": "example-css-for-visible-focus",
      "title": "Example CSS for Visible Focus",
      "level": 2
    }
  ]

};
