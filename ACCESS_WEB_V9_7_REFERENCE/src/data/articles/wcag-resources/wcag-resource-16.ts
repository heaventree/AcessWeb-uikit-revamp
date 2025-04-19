import type { Article } from '../../../types/blog';

export const wcagResource16: Article = {
  "id": "wcag-resource-16",
  "slug": "wcag-resource-accessible-tables",
  "title": "Accessible Tables",
  "description": "Purpose: Use HTML tables for presenting tabular data, not for layout. Ensure screen readers can correctly associate header cells with data cells.",
  "content": "# Accessible Tables\n\n**Purpose**: Use HTML tables for presenting tabular data, not for layout. Ensure screen readers can correctly associate header cells with data cells.\n\n**Key Practices**:\n*   **Use `<table>`, `<thead>`, `<tbody>`, `<tr>`, `<th>`, `<td>` correctly**: Structure the table logically.\n*   **Identify Headers (`<th>`)**: Use `<th>` elements for row and/or column headers.\n*   **Associate Headers with Data Cells (`scope` attribute)**:\n    *   Use `scope=\"col\"` on `<th>` elements that are headers for columns.\n    *   Use `scope=\"row\"` on `<th>` elements that are headers for rows.\n    *   For complex tables, `scope` might not be sufficient, and `id` and `headers` attributes may be needed (Guideline 1.3.1 - Level A).\n*   **Table Caption (`<caption>`)**: Provide a `<caption>` element immediately after the opening `<table>` tag to describe the table's content. This helps users understand the table's purpose before diving into the data. (Guideline 1.3.1 - Level A)\n*   **Simplicity**: Keep tables as simple as possible. Avoid merged cells (`colspan`, `rowspan`) if feasible, as they increase complexity for screen reader users. If used, ensure headers are correctly associated.\n\n**Example (Simple Table)**:\n```html\n<table>\n  <caption>Quarterly Sales Figures by Region</caption>\n  <thead>\n    <tr>\n      <th scope=\"col\">Region</th>\n      <th scope=\"col\">Q1 Sales</th>\n      <th scope=\"col\">Q2 Sales</th>\n    </tr>\n  </thead>\n  <tbody>\n    <tr>\n      <th scope=\"row\">North</th>\n      <td>$15,000</td>\n      <td>$18,000</td>\n    </tr>\n    <tr>\n      <th scope=\"row\">South</th>\n      <td>$12,000</td>\n      <td>$14,500</td>\n    </tr>\n  </tbody>\n</table>\n```",
  "category": "wcag-resources",
  "tags": [
    "WCAG",
    "Accessibility",
    "Web Standards",
    "ARIA",
    "Screen Readers",
    "Semantic HTML"
  ],
  "author": {
    "name": "Accessibility Team",
    "avatar": "https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    "role": "WCAG Specialists"
  },
  "publishedAt": "2023-02-21T13:01:46.059Z",
  "updatedAt": "2023-07-03T02:49:12.785Z",
  "readingTime": "3 min read",
  "vectorImage": "https://images.unsplash.com/photo-1517292987719-0369a794ec0f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
  "isResource": true,
  "wcagReference": "https://www.w3.org/WAI/WCAG21/Understanding/",
  "tableOfContents": [
    {
      "id": "purpose",
      "title": "Purpose",
      "level": 2
    },
    {
      "id": "key-practices",
      "title": "Key Practices",
      "level": 2
    },
    {
      "id": "use-table-thead-tbody-tr-th-td-correctly",
      "title": "Use `<table>`, `<thead>`, `<tbody>`, `<tr>`, `<th>`, `<td>` correctly",
      "level": 2
    },
    {
      "id": "identify-headers-th",
      "title": "Identify Headers (`<th>`)",
      "level": 2
    },
    {
      "id": "associate-headers-with-data-cells-scope-attribute",
      "title": "Associate Headers with Data Cells (`scope` attribute)",
      "level": 2
    },
    {
      "id": "table-caption-caption",
      "title": "Table Caption (`<caption>`)",
      "level": 2
    },
    {
      "id": "simplicity",
      "title": "Simplicity",
      "level": 2
    },
    {
      "id": "example-simple-table",
      "title": "Example (Simple Table)",
      "level": 2
    }
  ]

};
