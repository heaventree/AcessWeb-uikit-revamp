import type { Article } from '../../../types/blog';

export const wcagResource27: Article = {
  "id": "wcag-resource-27",
  "slug": "wcag-resource-focus-management-for-screen-reader-users",
  "title": "Focus Management for Screen Reader Users",
  "description": "Importance: Proper focus management is essential for screen reader users to navigate and interact with web content effectively.",
  "content": "# Focus Management for Screen Reader Users\n\n**Importance**: Proper focus management is essential for screen reader users to navigate and interact with web content effectively.\n\n**Best Practices**:\n- Use proper tabindex values (avoid positive values when possible).\n- Manage focus when content changes dynamically.\n- Use focus indicators that are visible and meet contrast requirements.\n- Implement keyboard focus order that follows logical document flow.\n- Restore focus to appropriate elements after modal dialogs close.",
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
    "Semantic HTML"
  ],
  "author": {
    "name": "Accessibility Team",
    "avatar": "https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    "role": "WCAG Specialists"
  },
  "publishedAt": "2024-10-18T08:28:08.906Z",
  "updatedAt": "2024-12-28T12:50:35.763Z",
  "readingTime": "3 min read",
  "vectorImage": "https://images.unsplash.com/photo-1468436139062-f60a71c5c892?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
  "isResource": true,
  "wcagReference": "https://www.w3.org/WAI/WCAG21/Understanding/focus-visible",
  "tableOfContents": [
    {
      "id": "importance",
      "title": "Importance",
      "level": 2
    },
    {
      "id": "best-practices",
      "title": "Best Practices",
      "level": 2
    }
  ]

};
