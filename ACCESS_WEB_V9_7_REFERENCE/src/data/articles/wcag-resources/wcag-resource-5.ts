import type { Article } from '../../../types/blog';

export const wcagResource5: Article = {
  "id": "wcag-resource-5",
  "slug": "wcag-resource-perceivable-text-alternatives-alt-text",
  "title": "Perceivable: Text Alternatives (Alt Text)",
  "description": "Guideline 1.1: Provide text alternatives for any non-text content so that it can be changed into other forms people need, such as large print, brai...",
  "content": "# Perceivable: Text Alternatives (Alt Text)\n\n**Guideline 1.1**: Provide text alternatives for any non-text content so that it can be changed into other forms people need, such as large print, braille, speech, symbols, or simpler language.\n\n**What is Alt Text?**: Alternative text (`alt` attribute on `<img>` tags) provides a textual description of an image for screen reader users or when images fail to load.\n\n**Best Practices**:\n*   Be accurate and equivalent in presenting the content and function of the image.\n*   Be succinct. Describe what's important without being overly verbose.\n*   Avoid phrases like \"image of...\" or \"picture of...\".\n*   For complex images (charts, graphs), provide a brief alt text and a longer description nearby or linked.\n*   For decorative images that convey no information, use `alt=\"\"` (null alt attribute).\n*   For images used as links, the alt text should describe the link's destination or function.\n\n**Example**:\n```html\n<!-- Informative image -->\n<img src=\"golden-retriever.jpg\" alt=\"A golden retriever puppy playing fetch in a park.\">\n\n<!-- Decorative image -->\n<img src=\"decorative-border.png\" alt=\"\">\n\n<!-- Image link -->\n<a href=\"products.html\">\n  <img src=\"cart-icon.svg\" alt=\"View your shopping cart\">\n</a>\n```",
  "category": "wcag-resources",
  "tags": [
    "WCAG",
    "Accessibility",
    "Web Standards",
    "ARIA",
    "Screen Readers",
    "Perceivable",
    "Alt Text",
    "Form Controls"
  ],
  "author": {
    "name": "Accessibility Team",
    "avatar": "https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    "role": "WCAG Specialists"
  },
  "publishedAt": "2024-10-23T10:27:38.899Z",
  "updatedAt": "2025-02-09T18:22:09.158Z",
  "readingTime": "3 min read",
  "vectorImage": "https://images.unsplash.com/photo-1588196749597-9ff075ee6b5b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
  "isResource": true,
  "wcagReference": "https://www.w3.org/WAI/WCAG21/Understanding/perceivable",
  "tableOfContents": [
    {
      "id": "guideline-11",
      "title": "Guideline 1.1",
      "level": 2
    },
    {
      "id": "what-is-alt-text",
      "title": "What is Alt Text?",
      "level": 2
    },
    {
      "id": "best-practices",
      "title": "Best Practices",
      "level": 2
    },
    {
      "id": "example",
      "title": "Example",
      "level": 2
    }
  ]

};
