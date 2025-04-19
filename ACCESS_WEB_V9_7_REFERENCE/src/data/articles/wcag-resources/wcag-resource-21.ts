import type { Article } from '../../../types/blog';

export const wcagResource21: Article = {
  "id": "wcag-resource-21",
  "slug": "wcag-resource-accessible-error-messages",
  "title": "Accessible Error Messages",
  "description": "Goal: Ensure users understand when an error has occurred, what the error is, and how to fix it, regardless of ability.",
  "content": "# Accessible Error Messages\n\n**Goal**: Ensure users understand when an error has occurred, what the error is, and how to fix it, regardless of ability.\n\n**Key Principles (WCAG Guideline 3.3 - Input Assistance)**:\n*   **Identify the Error (Guideline 3.3.1 - Level A (minimum accessibility requirements))**:\n    *   Clearly indicate which field(s) are in error (e.g., change border color, add an icon, change label style). Don't rely on color alone.\n    *   Provide a text description of the error.\n*   **Describe the Error**: The error message itself should be clear and specific (e.g., \"Please enter a valid email address\" is better than \"Invalid input\").\n*   **Programmatic Association**: Link the error message text to the input field it relates to, typically using `aria-describedby`. This allows screen readers to announce the error when the user focuses on the field.\n    ```html\n    <label for=\"email\">Email:</label>\n    <input id=\"email\" name=\"email\" type=\"email\" aria-invalid=\"true\" aria-describedby=\"email-error\">\n    <span id=\"email-error\" class=\"error-message\">Error: Please enter a valid email format (e.g., name@example.com).</span>\n    ```\n*   **Announce Errors Dynamically (Client-side Validation)**:\n    *   Use an `aria-live` region (often `role=\"alert\"` for important errors) to announce errors as they occur or upon form submission attempt. This informs screen reader users immediately without them having to search for the error message.\n    *   Alternatively, move focus programmatically to the first field in error or to a summary of errors at the top of the form.\n*   **Provide Suggestions (Guideline 3.3.3 - Level AA)**: If possible, suggest how to fix the error (e.g., \"Password must be at least 8 characters long\").\n*   **Visibility**: Ensure error messages are visually close to the field in error and have sufficient color contrast.",
  "category": "wcag-resources",
  "tags": [
    "WCAG",
    "Accessibility",
    "Web Standards",
    "Color Contrast",
    "ARIA",
    "Screen Readers",
    "Form Controls"
  ],
  "author": {
    "name": "Accessibility Team",
    "avatar": "https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    "role": "WCAG Specialists"
  },
  "publishedAt": "2023-06-10T15:10:01.175Z",
  "updatedAt": "2024-10-26T11:20:11.836Z",
  "readingTime": "3 min read",
  "vectorImage": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
  "isResource": true,
  "wcagReference": "https://www.w3.org/WAI/WCAG21/Understanding/",
  "tableOfContents": [
    {
      "id": "goal",
      "title": "Goal",
      "level": 2
    },
    {
      "id": "key-principles-wcag-guideline-33-input-assistance",
      "title": "Key Principles (WCAG Guideline 3.3 - Input Assistance)",
      "level": 2
    },
    {
      "id": "identify-the-error-guideline-331-level-a",
      "title": "Identify the Error (Guideline 3.3.1 - Level A)",
      "level": 2
    },
    {
      "id": "describe-the-error",
      "title": "Describe the Error",
      "level": 2
    },
    {
      "id": "programmatic-association",
      "title": "Programmatic Association",
      "level": 2
    },
    {
      "id": "announce-errors-dynamically-client-side-validation",
      "title": "Announce Errors Dynamically (Client-side Validation)",
      "level": 2
    },
    {
      "id": "provide-suggestions-guideline-333-level-aa",
      "title": "Provide Suggestions (Guideline 3.3.3 - Level AA)",
      "level": 2
    },
    {
      "id": "visibility",
      "title": "Visibility",
      "level": 2
    }
  ]

};
