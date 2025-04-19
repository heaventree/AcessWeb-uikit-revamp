import type { Article } from '../../../types/blog';

export const wcagResource18: Article = {
  "id": "wcag-resource-18",
  "slug": "wcag-resource-testing-accessibility-with-screen-readers",
  "title": "Testing Accessibility with Screen Readers",
  "description": "Purpose: To understand how users who are blind or have low vision experience your website and identify barriers they might encounter.",
  "content": "# Testing Accessibility with Screen Readers\n\n**Purpose**: To understand how users who are blind or have low vision experience your website and identify barriers they might encounter.\n\n**Popular Screen Readers**:\n*   **NVDA (NonVisual Desktop Access)**: Free, open-source for Windows. Widely used.\n*   **JAWS (Job Access With Speech)**: Commercial, feature-rich for Windows. Common in enterprise.\n*   **VoiceOver**: Built-in to macOS and iOS. Free.\n*   **TalkBack**: Built-in to Android. Free.\n*   **Narrator**: Built-in to Windows. Improving but historically less used than NVDA/JAWS.\n\n**Basic Testing Steps**:\n1.  **Choose a Browser/Screen Reader Combo**: Common pairs are NVDA+Firefox, JAWS+Chrome, VoiceOver+Safari.\n2.  **Learn Basic Commands**: Familiarize yourself with essential navigation keys (reading text, moving by headings/links/landmarks, activating controls, interacting with forms/tables). Each screen reader has different commands.\n3.  **Navigate the Page**:\n    *   Listen to the page title. Is it descriptive?\n    *   Listen as the page loads. Is content announced clearly?\n    *   Navigate using headings (`H` key in NVDA/JAWS). Is the heading structure logical?\n    *   Navigate using links (`K` key). Are link texts descriptive?\n    *   Navigate using landmarks (`R` key). Are regions like navigation, main content, footer defined?\n    *   Navigate using form controls (`F` key). Are labels announced correctly? Can you fill out the form?\n    *   Navigate tables (`T` key). Are headers announced with data cells?\n4.  **Interact with Elements**: Activate buttons, links, custom widgets. Do they announce their state (e.g., expanded/collapsed)? Are dynamic updates (e.g., error messages via `aria-live (indicates dynamic content updates)`) announced?\n5.  **Check Images**: Are alt texts meaningful? Are decorative images silent?\n\n**Important**: This provides a basic check. True usability testing involves observing experienced screen reader users interacting with your site.",
  "category": "wcag-resources",
  "tags": [
    "WCAG",
    "Accessibility",
    "Web Standards",
    "ARIA",
    "Screen Readers",
    "Alt Text",
    "Semantic HTML",
    "Form Controls"
  ],
  "author": {
    "name": "Accessibility Team",
    "avatar": "https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    "role": "WCAG Specialists"
  },
  "publishedAt": "2023-07-03T23:54:25.681Z",
  "updatedAt": "2024-04-03T00:15:47.999Z",
  "readingTime": "3 min read",
  "vectorImage": "https://images.unsplash.com/photo-1499750310107-5fef28a66643?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
  "isResource": true,
  "wcagReference": "https://www.w3.org/WAI/WCAG21/Understanding/",
  "tableOfContents": [
    {
      "id": "purpose",
      "title": "Purpose",
      "level": 2
    },
    {
      "id": "popular-screen-readers",
      "title": "Popular Screen Readers",
      "level": 2
    },
    {
      "id": "nvda-nonvisual-desktop-access",
      "title": "NVDA (NonVisual Desktop Access)",
      "level": 2
    },
    {
      "id": "jaws-job-access-with-speech",
      "title": "JAWS (Job Access With Speech)",
      "level": 2
    },
    {
      "id": "voiceover",
      "title": "VoiceOver",
      "level": 2
    },
    {
      "id": "talkback",
      "title": "TalkBack",
      "level": 2
    },
    {
      "id": "narrator",
      "title": "Narrator",
      "level": 2
    },
    {
      "id": "basic-testing-steps",
      "title": "Basic Testing Steps",
      "level": 2
    },
    {
      "id": "choose-a-browserscreen-reader-combo",
      "title": "Choose a Browser/Screen Reader Combo",
      "level": 2
    },
    {
      "id": "learn-basic-commands",
      "title": "Learn Basic Commands",
      "level": 2
    },
    {
      "id": "navigate-the-page",
      "title": "Navigate the Page",
      "level": 2
    },
    {
      "id": "interact-with-elements",
      "title": "Interact with Elements",
      "level": 2
    },
    {
      "id": "check-images",
      "title": "Check Images",
      "level": 2
    },
    {
      "id": "important",
      "title": "Important",
      "level": 2
    }
  ]

};
