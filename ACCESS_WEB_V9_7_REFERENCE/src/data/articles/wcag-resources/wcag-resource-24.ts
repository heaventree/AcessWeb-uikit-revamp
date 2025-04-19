import type { Article } from '../../../types/blog';

export const wcagResource24: Article = {
  "id": "wcag-resource-24",
  "slug": "wcag-resource-accessible-drag-and-drop-interfaces",
  "title": "Accessible Drag-and-Drop Interfaces",
  "description": "Challenge: Drag-and-drop functionality relies heavily on visual pointer interaction and can be completely inaccessible to keyboard-only users and s...",
  "content": "# Accessible Drag-and-Drop Interfaces\n\n**Challenge**: Drag-and-drop functionality relies heavily on visual pointer interaction and can be completely inaccessible to keyboard-only users and screen reader users if not implemented carefully.\n\n**Making Drag-and-Drop Accessible (WCAG 2.5.7 - Level A (minimum accessibility requirements)A)**:\n*   **Provide a Keyboard Alternative**: The core requirement is that any action achievable via drag-and-drop must also be achievable using only the keyboard. This often involves providing buttons or menu options like \"Move Up,\" \"Move Down,\" \"Move to Folder,\" etc.\n*   **Use ARIA for Custom Widgets**: If implementing a custom drag-and-drop interface, use appropriate ARIA roles, states, and properties to communicate the functionality to assistive technologies. This is complex and requires following patterns from the ARIA Authoring Practices Guide (APG), such as Listbox reordering.\n    *   Identify draggable items (`role=\"option\"`, `aria-grabbed=\"false\"`).\n    *   Identify drop targets (`aria-dropeffect`).\n    *   Manage focus appropriately during the keyboard-based move operation.\n    *   Announce actions and outcomes using `aria-live` regions (e.g., \"Item moved to position 3\").\n*   **Clear Visual Cues**: Provide clear visual indicators during both mouse and keyboard drag operations (e.g., highlighting drop targets, showing item position).\n*   **Focus Management**: Ensure focus moves logically when using the keyboard alternative.\n\n**Simpler Approach**: Often, the most accessible solution is to design the interface *without* relying on drag-and-drop as the primary interaction method. Provide standard buttons, links, or form controls that achieve the same outcome. If drag-and-drop is added, ensure the keyboard alternative is robust and easy to use.",
  "category": "wcag-resources",
  "tags": [
    "WCAG",
    "Accessibility",
    "Web Standards",
    "Keyboard Accessibility",
    "ARIA",
    "Screen Readers",
    "Form Controls"
  ],
  "author": {
    "name": "Accessibility Team",
    "avatar": "https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    "role": "WCAG Specialists"
  },
  "publishedAt": "2024-05-21T13:53:27.379Z",
  "updatedAt": "2025-03-17T23:19:37.656Z",
  "readingTime": "3 min read",
  "vectorImage": "https://images.unsplash.com/photo-1468436139062-f60a71c5c892?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
  "isResource": true,
  "wcagReference": "https://www.w3.org/WAI/WCAG21/Understanding/",
  "tableOfContents": [
    {
      "id": "challenge",
      "title": "Challenge",
      "level": 2
    },
    {
      "id": "making-drag-and-drop-accessible-wcag-257-level-aa",
      "title": "Making Drag-and-Drop Accessible (WCAG 2.5.7 - Level AA)",
      "level": 2
    },
    {
      "id": "provide-a-keyboard-alternative",
      "title": "Provide a Keyboard Alternative",
      "level": 2
    },
    {
      "id": "use-aria-for-custom-widgets",
      "title": "Use ARIA for Custom Widgets",
      "level": 2
    },
    {
      "id": "clear-visual-cues",
      "title": "Clear Visual Cues",
      "level": 2
    },
    {
      "id": "focus-management",
      "title": "Focus Management",
      "level": 2
    },
    {
      "id": "simpler-approach",
      "title": "Simpler Approach",
      "level": 2
    }
  ]

};
