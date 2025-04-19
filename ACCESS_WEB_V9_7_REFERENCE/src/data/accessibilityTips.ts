/**
 * Accessibility Quick Tips
 * 
 * This file contains tips for different types of web elements and common accessibility issues.
 * These tips will be shown in tooltips throughout the application to help users understand
 * accessibility requirements in context.
 */

export interface AccessibilityTip {
  id: string;
  element: string;
  title: string;
  tip: string;
  wcagReference?: string;
  learnMoreLink?: string;
}

const accessibilityTips: AccessibilityTip[] = [
  {
    id: 'image-alt',
    element: 'image',
    title: 'Image Alt Text',
    tip: 'All non-decorative images must have descriptive alt text. Keep it concise and meaningful.',
    wcagReference: 'WCAG 1.1.1 (Level A)',
    learnMoreLink: '/help/alt-text-guide'
  },
  {
    id: 'button-label',
    element: 'button',
    title: 'Button Labels',
    tip: 'Buttons should have descriptive text that clearly indicates the action they perform.',
    wcagReference: 'WCAG 2.4.6 (Level AA)',
    learnMoreLink: '/wcag-resources'
  },
  {
    id: 'color-contrast',
    element: 'text',
    title: 'Color Contrast',
    tip: 'Text should have a contrast ratio of at least 4.5:1 against its background (3:1 for large text).',
    wcagReference: 'WCAG 1.4.3 (Level AA)',
    learnMoreLink: '/tools/colors'
  },
  {
    id: 'form-labels',
    element: 'form',
    title: 'Form Labels',
    tip: 'All form controls should have associated labels that clearly describe the required input.',
    wcagReference: 'WCAG 3.3.2 (Level A)',
    learnMoreLink: '/wcag-resources'
  },
  {
    id: 'heading-structure',
    element: 'heading',
    title: 'Heading Structure',
    tip: 'Use headings (h1-h6) to create a logical document outline. Only one h1 per page.',
    wcagReference: 'WCAG 1.3.1 (Level A)',
    learnMoreLink: '/wcag-resources'
  },
  {
    id: 'links-purpose',
    element: 'link',
    title: 'Link Purpose',
    tip: 'Link text should make sense out of context and clearly indicate where the link will take the user.',
    wcagReference: 'WCAG 2.4.4 (Level A)',
    learnMoreLink: '/wcag-resources'
  },
  {
    id: 'keyboard-access',
    element: 'interactive',
    title: 'Keyboard Access',
    tip: 'All interactive elements should be fully operable using the keyboard alone.',
    wcagReference: 'WCAG 2.1.1 (Level A)',
    learnMoreLink: '/wcag-resources'
  },
  {
    id: 'aria-landmark',
    element: 'landmark',
    title: 'ARIA Landmarks',
    tip: 'Use semantic HTML or ARIA landmarks (e.g., header, nav, main, footer) to define page regions.',
    wcagReference: 'WCAG 1.3.1 (Level A)',
    learnMoreLink: '/wcag-resources'
  },
  {
    id: 'error-messages',
    element: 'error',
    title: 'Error Messages',
    tip: 'Clearly identify errors, describe them in text, and provide suggestions for correction.',
    wcagReference: 'WCAG 3.3.1 (Level A)',
    learnMoreLink: '/wcag-resources'
  },
  {
    id: 'tables-headers',
    element: 'table',
    title: 'Table Headers',
    tip: 'Data tables should include proper headers (th) with appropriate scope attributes.',
    wcagReference: 'WCAG 1.3.1 (Level A)',
    learnMoreLink: '/wcag-resources'
  },
  {
    id: 'focus-visible',
    element: 'focus',
    title: 'Focus Visibility',
    tip: 'The keyboard focus indicator must be visible. Never hide the outline without providing an alternative.',
    wcagReference: 'WCAG 2.4.7 (Level AA)',
    learnMoreLink: '/wcag-resources'
  },
  {
    id: 'motion-control',
    element: 'animation',
    title: 'Motion Control',
    tip: 'Provide controls to pause, stop, or hide any moving, blinking, or auto-updating content.',
    wcagReference: 'WCAG 2.2.2 (Level A)',
    learnMoreLink: '/wcag-resources'
  },
  {
    id: 'multimedia-captions',
    element: 'video',
    title: 'Multimedia Captions',
    tip: 'Videos must include synchronized captions for all audio content.',
    wcagReference: 'WCAG 1.2.2 (Level A)',
    learnMoreLink: '/wcag-resources'
  },
  {
    id: 'resize-text',
    element: 'responsive',
    title: 'Text Resizing',
    tip: 'Content should remain accessible when zoomed to 200% or when text is resized to 200%.',
    wcagReference: 'WCAG 1.4.4 (Level AA)',
    learnMoreLink: '/wcag-resources'
  },
  {
    id: 'input-purpose',
    element: 'input',
    title: 'Input Purpose',
    tip: 'Use autocomplete attributes on form fields collecting common user information.',
    wcagReference: 'WCAG 1.3.5 (Level AA)',
    learnMoreLink: '/wcag-resources'
  }
];

export default accessibilityTips;