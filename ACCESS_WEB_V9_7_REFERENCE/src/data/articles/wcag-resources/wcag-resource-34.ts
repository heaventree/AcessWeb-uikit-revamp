import type { Article } from '../../../types/blog';

export const wcagResource34: Article = {
  "id": "wcag-resource-34",
  "slug": "wcag-resource-accessible-data-tables",
  "title": "Accessible Data Tables",
  "description": "Structural Elements:\n- Use `<caption>` to provide a title for the table\n- Use `<th>` for header cells and `<td>` for data cells\n- Use `scope` attri...",
  "content": "# Accessible Data Tables\n\n**Structural Elements**:\n- Use `<caption>` to provide a title for the table\n- Use `<th>` for header cells and `<td>` for data cells\n- Use `scope` attributes on header cells\n- Include `<thead>`, `<tbody>`, and `<tfoot>` for complex tables\n\n**Additional Techniques**:\n- Add `summary` attribute for complex tables (HTML4) or descriptive text for HTML5\n- Use `aria-describedby (references another element as the description)` to associate descriptions with tables\n- Consider responsive design techniques for mobile viewing\n- Avoid merged cells when possible",
  "category": "wcag-resources",
  "tags": [
    "WCAG",
    "Accessibility",
    "Web Standards",
    "ARIA",
    "Semantic HTML",
    "Mobile Accessibility"
  ],
  "author": {
    "name": "Accessibility Team",
    "avatar": "https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    "role": "WCAG Specialists"
  },
  "publishedAt": "2023-07-12T16:14:56.895Z",
  "updatedAt": "2024-06-06T12:59:12.403Z",
  "readingTime": "3 min read",
  "vectorImage": "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
  "isResource": true,
  "wcagReference": "https://www.w3.org/WAI/WCAG21/Understanding/info-and-relationships",
  "tableOfContents": [
    {
      "id": "structural-elements",
      "title": "Structural Elements",
      "level": 2
    },
    {
      "id": "additional-techniques",
      "title": "Additional Techniques",
      "level": 2
    }
  ]

};
