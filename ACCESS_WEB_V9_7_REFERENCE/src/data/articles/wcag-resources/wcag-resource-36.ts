import type { Article } from '../../../types/blog';

export const wcagResource36: Article = {
  "id": "wcag-resource-36",
  "slug": "wcag-resource-accessible-drag-and-drop-interfaces",
  "title": "Accessible Drag and Drop Interfaces",
  "description": "Guidelines:\n- Always provide keyboard alternatives for drag operations\n- Use ARIA live regions to announce changes\n- Ensure visible focus indicator...",
  "content": "# Accessible Drag and Drop Interfaces\n\n**Guidelines**:\n- Always provide keyboard alternatives for drag operations\n- Use ARIA live regions to announce changes\n- Ensure visible focus indicators for draggable items\n- Implement clear instructions for both mouse and keyboard users\n\n**Implementation**:\n- Use aria-grabbed and aria-dropeffect (where supported)\n- Ensure high contrast between draggable items and background\n- Provide immediate feedback during interactions\n- Test with both keyboard and screen readers",
  "category": "wcag-resources",
  "tags": [
    "WCAG",
    "Accessibility",
    "Web Standards",
    "Color Contrast",
    "Keyboard Accessibility",
    "ARIA",
    "Screen Readers",
    "Keyboard Navigation"
  ],
  "author": {
    "name": "Accessibility Team",
    "avatar": "https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    "role": "WCAG Specialists"
  },
  "publishedAt": "2023-07-09T19:59:16.201Z",
  "updatedAt": "2025-03-05T03:28:58.734Z",
  "readingTime": "3 min read",
  "vectorImage": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
  "isResource": true,
  "wcagReference": "https://www.w3.org/WAI/WCAG21/Understanding/",
  "tableOfContents": [
    {
      "id": "guidelines",
      "title": "Guidelines",
      "level": 2
    },
    {
      "id": "implementation",
      "title": "Implementation",
      "level": 2
    }
  ]

};
