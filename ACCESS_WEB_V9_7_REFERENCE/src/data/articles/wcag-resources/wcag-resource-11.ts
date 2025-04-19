import type { Article } from '../../../types/blog';

export const wcagResource11: Article = {
  "id": "wcag-resource-11",
  "slug": "wcag-resource-robust-compatibility-parsing-name-role-value",
  "title": "Robust: Compatibility (Parsing & Name, Role, Value)",
  "description": "Guideline 4.1: Maximize compatibility with current and future user agents, including assistive technologies.",
  "content": "# Robust: Compatibility (Parsing & Name, Role, Value)\n\n**Guideline 4.1**: Maximize compatibility with current and future user agents, including assistive technologies.\n\n**Key Success Criteria**:\n*   **Parsing (Level A (minimum accessibility requirements) - Obsolete in WCAG 2.2 (newest standard, October 2023))**: *Historically*, this required elements to have complete start/end tags, be nested correctly, avoid duplicate attributes, and have unique IDs. While removed from WCAG 2.2 (newest standard, October 2023) (as modern browsers handle minor errors well), writing valid, well-formed HTML is still crucial for baseline robustness.\n*   **Name, Role, Value (Level A (minimum accessibility requirements))**: For all user interface components (links, form elements, custom widgets), their *name* (label) and *role* (type of component) must be programmatically determinable (accessible to assistive tech). Their *states*, *properties*, and *values* (if they change) must also be programmatically determinable and notifications of changes must be available.\n\n**Importance**: Ensures that assistive technologies (like screen readers) can accurately interpret and interact with web content and controls. This is fundamental for enabling access. Using standard HTML controls correctly often satisfies this. ARIA (Accessible Rich Internet Applications) is used to define name, role, and value for custom controls.",
  "category": "wcag-resources",
  "tags": [
    "WCAG",
    "Accessibility",
    "Web Standards",
    "ARIA",
    "Screen Readers",
    "Robust",
    "WCAG 2.2",
    "Form Controls"
  ],
  "author": {
    "name": "Accessibility Team",
    "avatar": "https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    "role": "WCAG Specialists"
  },
  "publishedAt": "2023-06-23T16:25:59.113Z",
  "updatedAt": "2024-06-23T08:00:01.301Z",
  "readingTime": "3 min read",
  "vectorImage": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
  "isResource": true,
  "wcagReference": "https://www.w3.org/WAI/WCAG21/Understanding/robust",
  "tableOfContents": [
    {
      "id": "guideline-41",
      "title": "Guideline 4.1",
      "level": 2
    },
    {
      "id": "key-success-criteria",
      "title": "Key Success Criteria",
      "level": 2
    },
    {
      "id": "parsing-level-a-obsolete-in-wcag-22",
      "title": "Parsing (Level A - Obsolete in WCAG 2.2)",
      "level": 2
    },
    {
      "id": "name-role-value-level-a",
      "title": "Name, Role, Value (Level A)",
      "level": 2
    },
    {
      "id": "importance",
      "title": "Importance",
      "level": 2
    }
  ]

};
