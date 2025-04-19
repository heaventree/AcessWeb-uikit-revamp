import type { Article } from '../../../types/blog';

export const wcagResource22: Article = {
  "id": "wcag-resource-22",
  "slug": "wcag-resource-accessible-carousels-and-sliders",
  "title": "Accessible Carousels and Sliders",
  "description": "Challenge: Carousels (also known as sliders or slideshows) are often inaccessible due to poor keyboard support, confusing screen reader announcemen...",
  "content": "# Accessible Carousels and Sliders\n\n**Challenge**: Carousels (also known as sliders or slideshows) are often inaccessible due to poor keyboard support, confusing screen reader announcements, and auto-playing content.\n\n**Accessibility Requirements**:\n*   **Pause/Stop/Hide Control (Guideline 2.2.2 - Level A (minimum accessibility requirements))**: If the carousel auto-plays or moves, provide a clear, keyboard-accessible control to pause, stop, or hide the movement. Pausing should be persistent.\n*   **Keyboard Accessibility**:\n    *   All controls (next/prev buttons, pagination dots/thumbnails) must be keyboard focusable and operable.\n    *   Content within slides (links, buttons) must be reachable via keyboard when the slide is visible.\n    *   Consider allowing `Tab` to move *out* of the carousel, using arrow keys for slide navigation once a control has focus.\n*   **Screen Reader Support**:\n    *   Use `aria-live (indicates dynamic content updates)=\"polite\"` (or `assertive` if essential, but usually polite) on the carousel region to announce slide changes, but avoid excessive verbosity.\n    *   Use `aria-roledescription` to give the carousel a meaningful name (e.g., `aria-roledescription=\"carousel\"`).\n    *   Use `aria-hidden=\"true\"` on non-visible slides to hide their content from screen readers.\n    *   Ensure controls have accessible names (e.g., `<button aria-label=\"Next Slide\">`, `<button aria-label=\"Go to slide 3\">`).\n    *   Consider using `role=\"region\"` with `aria-label` for the whole component.\n*   **Focus Management**: If slides change automatically, ensure focus isn't unexpectedly lost or moved in a confusing way.\n*   **Alternative Access**: Ensure the information presented in the carousel is available elsewhere on the page or site if the carousel itself cannot be made fully accessible.\n\n**Recommendation**: Use carousels sparingly. If used, prioritize accessibility from the start, following ARIA patterns (like the Carousel pattern in the APG) carefully. Often, simpler display methods (like grids or lists) are more accessible and user-friendly.",
  "category": "wcag-resources",
  "tags": [
    "WCAG",
    "Accessibility",
    "Web Standards",
    "Keyboard Accessibility",
    "ARIA",
    "Screen Readers",
    "Operable",
    "Keyboard Navigation",
    "Semantic HTML",
    "Form Controls"
  ],
  "author": {
    "name": "Accessibility Team",
    "avatar": "https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    "role": "WCAG Specialists"
  },
  "publishedAt": "2024-10-12T19:15:48.726Z",
  "updatedAt": "2025-02-23T04:11:11.817Z",
  "readingTime": "3 min read",
  "vectorImage": "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
  "isResource": true,
  "wcagReference": "https://www.w3.org/WAI/WCAG21/Understanding/",
  "tableOfContents": [
    {
      "id": "challenge",
      "title": "Challenge",
      "level": 2
    },
    {
      "id": "accessibility-requirements",
      "title": "Accessibility Requirements",
      "level": 2
    },
    {
      "id": "pausestophide-control-guideline-222-level-a",
      "title": "Pause/Stop/Hide Control (Guideline 2.2.2 - Level A)",
      "level": 2
    },
    {
      "id": "keyboard-accessibility",
      "title": "Keyboard Accessibility",
      "level": 2
    },
    {
      "id": "screen-reader-support",
      "title": "Screen Reader Support",
      "level": 2
    },
    {
      "id": "focus-management",
      "title": "Focus Management",
      "level": 2
    },
    {
      "id": "alternative-access",
      "title": "Alternative Access",
      "level": 2
    },
    {
      "id": "recommendation",
      "title": "Recommendation",
      "level": 2
    }
  ]

};
