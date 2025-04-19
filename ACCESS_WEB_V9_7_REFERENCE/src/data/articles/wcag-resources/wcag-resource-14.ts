import type { Article } from '../../../types/blog';

export const wcagResource14: Article = {
  "id": "wcag-resource-14",
  "slug": "wcag-resource-accessible-forms-and-inputs",
  "title": "Accessible Forms and Inputs",
  "description": "Core Principle: Ensure users know what information is needed, can easily input it, understand the format required, and can correct errors.",
  "content": "# Accessible Forms and Inputs\n\n**Core Principle**: Ensure users know what information is needed, can easily input it, understand the format required, and can correct errors.\n\n**Key Practices**:\n*   **Labels (Guideline 3.3.2 - Level A (minimum accessibility requirements))**: Every form control (`input`, `textarea`, `select`) must have a programmatically associated label using `<label for=\"id\">` or `aria-label`/`aria-labelledby` if a visible label isn't feasible. Placeholder text is *not* a substitute for a label.\n*   **Instructions (Guideline 3.3.2 - Level A)**: Provide clear instructions or cues for required formats, constraints, or necessary information. Use `aria-describedby` to link instructions to the input.\n*   **Error Identification (Guideline 3.3.1 - Level A)**: If an input error is detected, identify the item in error clearly (e.g., changing the label color, adding an icon) and describe the error in text.\n*   **Error Suggestion (Guideline 3.3.3 - Level AA)**: If an error is detected and suggestions for correction are known, provide them to the user (unless it jeopardizes security).\n*   **Error Prevention (Guideline 3.3.4 - Level AA)**: For pages causing legal commitments or financial transactions, ensure submissions are reversible, checked for errors with an opportunity to correct, or confirmable before final submission.\n*   **Required Fields**: Clearly indicate required fields visually (e.g., asterisk, \"(required)\") and programmatically (using `required` or `aria-required=\"true\"`).\n\n**Example**:\n```html\n<label for=\"user-email\">Email Address <span aria-hidden=\"true\">*</span>:</label>\n<input type=\"email\" id=\"user-email\" name=\"email\" required aria-required=\"true\" aria-describedby=\"email-help email-error\">\n<span id=\"email-help\">Example: yourname@example.com</span>\n<span id=\"email-error\" class=\"error-message\" role=\"alert\">Please enter a valid email address.</span>\n```",
  "category": "wcag-resources",
  "tags": [
    "WCAG",
    "Accessibility",
    "Web Standards",
    "Color Contrast",
    "Form Controls"
  ],
  "author": {
    "name": "Accessibility Team",
    "avatar": "https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    "role": "WCAG Specialists"
  },
  "publishedAt": "2023-05-11T18:26:41.637Z",
  "updatedAt": "2024-11-25T17:30:19.004Z",
  "readingTime": "3 min read",
  "vectorImage": "https://images.unsplash.com/photo-1468436139062-f60a71c5c892?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
  "isResource": true,
  "wcagReference": "https://www.w3.org/WAI/WCAG21/Understanding/",
  "tableOfContents": [
    {
      "id": "core-principle",
      "title": "Core Principle",
      "level": 2
    },
    {
      "id": "key-practices",
      "title": "Key Practices",
      "level": 2
    },
    {
      "id": "labels-guideline-332-level-a",
      "title": "Labels (Guideline 3.3.2 - Level A)",
      "level": 2
    },
    {
      "id": "instructions-guideline-332-level-a",
      "title": "Instructions (Guideline 3.3.2 - Level A)",
      "level": 2
    },
    {
      "id": "error-identification-guideline-331-level-a",
      "title": "Error Identification (Guideline 3.3.1 - Level A)",
      "level": 2
    },
    {
      "id": "error-suggestion-guideline-333-level-aa",
      "title": "Error Suggestion (Guideline 3.3.3 - Level AA)",
      "level": 2
    },
    {
      "id": "error-prevention-guideline-334-level-aa",
      "title": "Error Prevention (Guideline 3.3.4 - Level AA)",
      "level": 2
    },
    {
      "id": "required-fields",
      "title": "Required Fields",
      "level": 2
    },
    {
      "id": "example",
      "title": "Example",
      "level": 2
    }
  ]

};
