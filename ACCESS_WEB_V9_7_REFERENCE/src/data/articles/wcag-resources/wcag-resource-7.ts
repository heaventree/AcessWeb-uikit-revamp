import type { Article } from '../../../types/blog';

export const wcagResource7: Article = {
  "id": "wcag-resource-7",
  "slug": "wcag-resource-operable-keyboard-accessibility",
  "title": "Operable: Keyboard Accessibility",
  "description": "Guideline 2.1: Make all functionality available from a keyboard. Guideline 2.1: Make all functionality available from a keyboard.",
  "content": "# Operable: Keyboard Accessibility\n\n**Guideline 2.1**: Make all functionality available from a keyboard.\n\n**Why It Matters**: Many users rely solely on a keyboard or keyboard emulators (e.g., switch devices, voice control) to navigate and interact with web content due to motor impairments or visual disabilities (screen reader users).\n\n**Key Requirements**:\n*   **All Functionality**: Every action that can be performed with a mouse must also be achievable using only the keyboard (e.g., activating links, submitting forms, using widgets).\n*   **No Keyboard Trap**: Users must be able to navigate *away* from any component using the keyboard alone. They shouldn't get stuck in a part of the page. (Level A (minimum accessibility requirements))\n*   **Focus Order**: The order in which elements receive keyboard focus should be logical and predictable, typically following the visual layout. (Level A (minimum accessibility requirements))\n*   **Focus Visible**: When an element receives keyboard focus, there must be a clear visual indicator showing which element is focused. (Level A (minimum accessibility requirements)A)\n\n**Testing**: Use the `Tab` key to move forward, `Shift+Tab` to move backward, `Enter` or `Spacebar` to activate controls. Ensure all interactive elements are reachable and usable.",
  "category": "wcag-resources",
  "tags": [
    "WCAG",
    "Accessibility",
    "Web Standards",
    "Keyboard Accessibility",
    "ARIA",
    "Screen Readers",
    "Operable",
    "Keyboard Navigation",
    "Semantic HTML",
    "Form Controls"
  ],
  "author": {
    "name": "Accessibility Team",
    "avatar": "https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    "role": "WCAG Specialists"
  },
  "publishedAt": "2024-04-15T22:58:33.121Z",
  "updatedAt": "2024-09-13T13:45:35.039Z",
  "readingTime": "3 min read",
  "vectorImage": "https://images.unsplash.com/photo-1497493292307-31c376b6e479?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
  "isResource": true,
  "wcagReference": "https://www.w3.org/WAI/WCAG21/Understanding/operable",
  "tableOfContents": [
    {
      "id": "guideline-21",
      "title": "Guideline 2.1",
      "level": 2
    },
    {
      "id": "why-it-matters",
      "title": "Why It Matters",
      "level": 2
    },
    {
      "id": "key-requirements",
      "title": "Key Requirements",
      "level": 2
    },
    {
      "id": "all-functionality",
      "title": "All Functionality",
      "level": 2
    },
    {
      "id": "no-keyboard-trap",
      "title": "No Keyboard Trap",
      "level": 2
    },
    {
      "id": "focus-order",
      "title": "Focus Order",
      "level": 2
    },
    {
      "id": "focus-visible",
      "title": "Focus Visible",
      "level": 2
    },
    {
      "id": "testing",
      "title": "Testing",
      "level": 2
    }
  ]

};
