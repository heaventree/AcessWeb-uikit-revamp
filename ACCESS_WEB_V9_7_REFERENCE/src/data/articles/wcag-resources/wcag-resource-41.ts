import type { Article } from '../../../types/blog';

export const wcagResource41: Article = {
  "id": "wcag-resource-41",
  "slug": "wcag-resource-ensuring-accessibility-in-single-page-applications-spas",
  "title": "Ensuring Accessibility in Single Page Applications (SPAs)",
  "description": "This article covers the WCAG requirements for Ensuring Accessibility in Single Page Applications (SPAs), including challenges:\n- focus management during routing changes\n- announcing dynamic content updates\n- maintaining keyboard navigation\n- browser histo....",
  "content": "# Ensuring Accessibility in Single Page Applications (SPAs)\n\n**Common Challenges**:\n- Focus management during routing changes\n- Announcing dynamic content updates\n- Maintaining keyboard navigation (where Tab key navigates between elements, Enter/Space activates them)\n- Browser history and back button functionality\n\n**Solutions**:\n- Use ARIA live regions for dynamic updates\n- Manually manage focus when content changes\n- Implement proper routing with history API\n- Use semantic HTML despite the dynamic nature\n- Test thoroughly with screen readers and keyboards",
  "category": "wcag-resources",
  "tags": [
    "WCAG",
    "Accessibility",
    "Web Standards",
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
  "publishedAt": "2023-04-10T15:50:44.872Z",
  "updatedAt": "2024-12-04T10:04:21.719Z",
  "readingTime": "3 min read",
  "vectorImage": "https://images.unsplash.com/photo-1517292987719-0369a794ec0f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
  "isResource": true,
  "wcagReference": "https://www.w3.org/WAI/WCAG21/Understanding/",
  "tableOfContents": [
    {
      "id": "common-challenges",
      "title": "Common Challenges",
      "level": 2
    },
    {
      "id": "solutions",
      "title": "Solutions",
      "level": 2
    }
  ]

};
