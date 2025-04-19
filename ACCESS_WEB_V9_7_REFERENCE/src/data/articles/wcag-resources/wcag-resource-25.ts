import type { Article } from '../../../types/blog';

export const wcagResource25: Article = {
  "id": "wcag-resource-25",
  "slug": "wcag-resource-accessible-authentication-captchas",
  "title": "Accessible Authentication (CAPTCHAs)",
  "description": "Challenge: CAPTCHAs (Completely Automated Public Turing test to tell Computers and Humans Apart) are designed to block bots but often create signif...",
  "content": "# Accessible Authentication (CAPTCHAs)\n\n**Challenge**: CAPTCHAs (Completely Automated Public Turing test to tell Computers and Humans Apart) are designed to block bots but often create significant barriers for users with disabilities.\n*   **Visual CAPTCHAs**: Difficult or impossible for users with visual impairments.\n*   **Audio CAPTCHAs**: Difficult for users who are deaf or hard of hearing, or those without audio output. Often distorted and hard for anyone to understand.\n*   **Logic Puzzles/Cognitive Tests**: Can be barriers for users with cognitive disabilities.\n\n**WCAG Requirements**:\n*   **Guideline 1.1.1 (Text Alternatives)**: If CAPTCHA uses images or audio, text alternatives explaining its purpose are needed.\n*   **Alternatives**: Provide alternative forms of the CAPTCHA using different modalities (e.g., both visual and audio options).\n*   **WCAG 2.2 (newest standard, October 2023) - 3.3.8 Accessible Authentication (Minimum) (AA)**: Requires that authentication processes do not rely solely on a cognitive function test (like solving puzzles or transcription) unless an alternative method is available that doesn't, or a mechanism is available to assist the user (like helpdesk support).\n\n**Accessible Alternatives & Best Practices**:\n*   **Honeypot Fields**: Include hidden form fields that are invisible to users but visible to bots. If a bot fills them out, the submission is likely spam.\n*   **Time-Based Analysis**: Analyze submission timing (bots often fill forms instantly).\n*   **Risk Analysis Engines (e.g., Google reCAPTCHA v3)**: These work in the background, analyzing user behavior to provide a risk score without requiring direct user interaction in most cases. This is often the most accessible approach.\n*   **Simple Checkboxes (\"I'm not a robot\") (reCAPTCHA v2 Checkbox)**: Generally accessible, though may present a visual challenge if the risk score is low. Ensure keyboard accessibility.\n*   **Account-Based Security**: For logged-in users, rely on account security rather than CAPTCHAs.\n*   **Object Recognition (Less Ideal)**: CAPTCHAs asking users to identify objects in images (e.g., \"Select all squares with traffic lights\") still pose visual challenges.\n\n**Recommendation**: Avoid traditional image/audio CAPTCHAs. Implement invisible methods like reCAPTCHA v3 or honeypots first. If a visible challenge is deemed necessary, ensure accessible alternatives are provided that meet WCAG 3.3.8.",
  "category": "wcag-resources",
  "tags": [
    "WCAG",
    "Accessibility",
    "Web Standards",
    "Keyboard Accessibility",
    "WCAG 2.2",
    "Alt Text",
    "Form Controls"
  ],
  "author": {
    "name": "Accessibility Team",
    "avatar": "https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    "role": "WCAG Specialists"
  },
  "publishedAt": "2023-01-14T15:39:17.854Z",
  "updatedAt": "2023-12-23T01:45:58.500Z",
  "readingTime": "3 min read",
  "vectorImage": "https://images.unsplash.com/photo-1588196749597-9ff075ee6b5b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
  "isResource": true,
  "wcagReference": "https://www.w3.org/WAI/WCAG21/Understanding/",
  "tableOfContents": [
    {
      "id": "challenge",
      "title": "Challenge",
      "level": 2
    },
    {
      "id": "visual-captchas",
      "title": "Visual CAPTCHAs",
      "level": 2
    },
    {
      "id": "audio-captchas",
      "title": "Audio CAPTCHAs",
      "level": 2
    },
    {
      "id": "logic-puzzlescognitive-tests",
      "title": "Logic Puzzles/Cognitive Tests",
      "level": 2
    },
    {
      "id": "wcag-requirements",
      "title": "WCAG Requirements",
      "level": 2
    },
    {
      "id": "guideline-111-text-alternatives",
      "title": "Guideline 1.1.1 (Text Alternatives)",
      "level": 2
    },
    {
      "id": "alternatives",
      "title": "Alternatives",
      "level": 2
    },
    {
      "id": "wcag-22-338-accessible-authentication-minimum-aa",
      "title": "WCAG 2.2 - 3.3.8 Accessible Authentication (Minimum) (AA)",
      "level": 2
    },
    {
      "id": "accessible-alternatives-best-practices",
      "title": "Accessible Alternatives & Best Practices",
      "level": 2
    },
    {
      "id": "honeypot-fields",
      "title": "Honeypot Fields",
      "level": 2
    },
    {
      "id": "time-based-analysis",
      "title": "Time-Based Analysis",
      "level": 2
    },
    {
      "id": "risk-analysis-engines-eg-google-recaptcha-v3",
      "title": "Risk Analysis Engines (e.g., Google reCAPTCHA v3)",
      "level": 2
    },
    {
      "id": "simple-checkboxes-im-not-a-robot-recaptcha-v2-checkbox",
      "title": "Simple Checkboxes (\"I'm not a robot\") (reCAPTCHA v2 Checkbox)",
      "level": 2
    },
    {
      "id": "account-based-security",
      "title": "Account-Based Security",
      "level": 2
    },
    {
      "id": "object-recognition-less-ideal",
      "title": "Object Recognition (Less Ideal)",
      "level": 2
    },
    {
      "id": "recommendation",
      "title": "Recommendation",
      "level": 2
    }
  ]

};
