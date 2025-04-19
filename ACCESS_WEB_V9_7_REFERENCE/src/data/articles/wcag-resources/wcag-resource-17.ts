import type { Article } from '../../../types/blog';

export const wcagResource17: Article = {
  "id": "wcag-resource-17",
  "slug": "wcag-resource-accessible-pdfs",
  "title": "Accessible PDFs",
  "description": "Challenge: PDFs are often created with print in mind and can be highly inaccessible if not properly tagged and structured. They can act as barriers...",
  "content": "# Accessible PDFs\n\n**Challenge**: PDFs are often created with print in mind and can be highly inaccessible if not properly tagged and structured. They can act as barriers for screen reader users and keyboard navigation (where Tab key navigates between elements, Enter/Space activates them).\n\n**Creating Accessible PDFs (Ideally from Source)**:\n*   **Use Authoring Tools Correctly**: Create accessible source documents (e.g., in Microsoft Word, Google Docs, Adobe InDesign) using built-in accessibility features (styles for headings, alt text for images, proper list formatting, defined table headers).\n*   **Tagging**: When exporting/saving as PDF, ensure it's a \"Tagged PDF\". Tags provide the underlying structure (headings, paragraphs, lists, tables, images, reading order) that assistive technologies rely on.\n*   **Reading Order**: Verify the reading order in the tagged PDF matches the logical visual order.\n*   **Alt Text**: Ensure all informative images have alternative text. Mark decorative images as artifacts.\n*   **Table Structure**: Tag tables correctly with headers associated with data cells.\n*   **Forms**: Tag PDF form fields with labels and tooltips. Ensure logical tab order.\n*   **Language**: Specify the document language.\n*   **Document Title**: Set a meaningful document title in the metadata.\n*   **Bookmarks**: Add bookmarks for long documents to aid navigation.\n\n**Checking and Remediating**:\n*   **Adobe Acrobat Pro**: Use the built-in Accessibility Checker tool to identify issues. Use the Reading Order tool and Tags panel to review and fix structure and tagging problems.\n*   **Manual Checks**: Test with a screen reader (NVDA, JAWS, VoiceOver) and keyboard navigation.\n\n**Recommendation**: Prefer HTML content over PDF where possible, as HTML is inherently more flexible and accessible. If PDFs are necessary, always ensure they are created or remediated for accessibility.",
  "category": "wcag-resources",
  "tags": [
    "WCAG",
    "Accessibility",
    "Web Standards",
    "Keyboard Accessibility",
    "ARIA",
    "Screen Readers",
    "Keyboard Navigation",
    "Alt Text",
    "Semantic HTML",
    "Form Controls"
  ],
  "author": {
    "name": "Accessibility Team",
    "avatar": "https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    "role": "WCAG Specialists"
  },
  "publishedAt": "2024-08-30T00:52:12.130Z",
  "updatedAt": "2025-02-06T16:16:19.110Z",
  "readingTime": "3 min read",
  "vectorImage": "https://images.unsplash.com/photo-1497493292307-31c376b6e479?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
  "isResource": true,
  "wcagReference": "https://www.w3.org/WAI/WCAG21/Understanding/",
  "tableOfContents": [
    {
      "id": "challenge",
      "title": "Challenge",
      "level": 2
    },
    {
      "id": "creating-accessible-pdfs-ideally-from-source",
      "title": "Creating Accessible PDFs (Ideally from Source)",
      "level": 2
    },
    {
      "id": "use-authoring-tools-correctly",
      "title": "Use Authoring Tools Correctly",
      "level": 2
    },
    {
      "id": "tagging",
      "title": "Tagging",
      "level": 2
    },
    {
      "id": "reading-order",
      "title": "Reading Order",
      "level": 2
    },
    {
      "id": "alt-text",
      "title": "Alt Text",
      "level": 2
    },
    {
      "id": "table-structure",
      "title": "Table Structure",
      "level": 2
    },
    {
      "id": "forms",
      "title": "Forms",
      "level": 2
    },
    {
      "id": "language",
      "title": "Language",
      "level": 2
    },
    {
      "id": "document-title",
      "title": "Document Title",
      "level": 2
    },
    {
      "id": "bookmarks",
      "title": "Bookmarks",
      "level": 2
    },
    {
      "id": "checking-and-remediating",
      "title": "Checking and Remediating",
      "level": 2
    },
    {
      "id": "adobe-acrobat-pro",
      "title": "Adobe Acrobat Pro",
      "level": 2
    },
    {
      "id": "manual-checks",
      "title": "Manual Checks",
      "level": 2
    },
    {
      "id": "recommendation",
      "title": "Recommendation",
      "level": 2
    }
  ]

};
