import type { Article } from '../../../types/blog';

export const wcagResource20: Article = {
  "id": "wcag-resource-20",
  "slug": "wcag-resource-accessible-navigation-menus",
  "title": "Accessible Navigation Menus",
  "description": "Goal: Ensure users can easily find and operate site navigation using various input methods and assistive technologies.",
  "content": "# Accessible Navigation Menus\n\n**Goal**: Ensure users can easily find and operate site navigation using various input methods and assistive technologies.\n\n**Best Practices**:\n*   **Use Semantic HTML**:\n    *   Wrap primary navigation in a `<nav>` element.\n    *   Use an unordered list (`<ul>`) for the menu items (`<li>`) containing links (`<a>`).\n*   **Identify the Navigation**: Use `aria-label (provides an accessible name)` or `aria-labelledby (references another element as the label)` on the `<nav>` element if there are multiple navigation landmarks (e.g., `<nav aria-label (provides an accessible name)=\"Main navigation\">`, `<nav aria-label=\"Footer navigation\">`).\n*   **Descriptive Link Text**: Links should clearly indicate their destination (Guideline 2.4.4 - Level A).\n*   **Keyboard Accessibility**:\n    *   All menu items must be reachable and activatable via keyboard (`Tab`, `Enter`).\n    *   Focus order must be logical.\n    *   Focus must be clearly visible.\n*   **Dropdown/Flyout Menus (Increased Complexity)**:\n    *   **Indicate Submenus**: Visually (e.g., arrow icon) and programmatically using `aria-haspopup=\"true\"` and `aria-expanded=\"false\"` (changes to `true` when open) on the controlling element (link or button).\n    *   **Keyboard Operation**: Follow standard patterns (e.g., `Enter`/`Space` or arrow keys to open/navigate submenus, `Escape` to close). Refer to ARIA Authoring Practices Guide (APG) for Menu or Disclosure patterns.\n    *   **Screen Reader Announcement**: Ensure the expanded/collapsed state is announced.\n    *   **Visibility**: Ensure submenus don't get clipped or hidden off-screen.\n*   **Mobile/Responsive Menus**: Ensure \"hamburger\" menus and their revealed content are fully keyboard accessible and correctly announced by screen readers (manage focus appropriately when opening/closing).",
  "category": "wcag-resources",
  "tags": [
    "WCAG",
    "Accessibility",
    "Web Standards",
    "Keyboard Accessibility",
    "ARIA",
    "Screen Readers",
    "Semantic HTML",
    "Form Controls"
  ],
  "author": {
    "name": "Accessibility Team",
    "avatar": "https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    "role": "WCAG Specialists"
  },
  "publishedAt": "2024-03-14T10:29:23.390Z",
  "updatedAt": "2025-01-17T06:57:39.149Z",
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
      "id": "best-practices",
      "title": "Best Practices",
      "level": 2
    },
    {
      "id": "use-semantic-html",
      "title": "Use Semantic HTML",
      "level": 2
    },
    {
      "id": "identify-the-navigation",
      "title": "Identify the Navigation",
      "level": 2
    },
    {
      "id": "descriptive-link-text",
      "title": "Descriptive Link Text",
      "level": 2
    },
    {
      "id": "keyboard-accessibility",
      "title": "Keyboard Accessibility",
      "level": 2
    },
    {
      "id": "dropdownflyout-menus-increased-complexity",
      "title": "Dropdown/Flyout Menus (Increased Complexity)",
      "level": 2
    },
    {
      "id": "indicate-submenus",
      "title": "Indicate Submenus",
      "level": 2
    },
    {
      "id": "keyboard-operation",
      "title": "Keyboard Operation",
      "level": 2
    },
    {
      "id": "screen-reader-announcement",
      "title": "Screen Reader Announcement",
      "level": 2
    },
    {
      "id": "visibility",
      "title": "Visibility",
      "level": 2
    },
    {
      "id": "mobileresponsive-menus",
      "title": "Mobile/Responsive Menus",
      "level": 2
    }
  ]

};
