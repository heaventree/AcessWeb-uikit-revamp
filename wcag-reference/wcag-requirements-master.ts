import type { Requirement } from '../types';

// Master list of all WCAG and international requirements
export const masterRequirements: Requirement[] = [
  {
    id: '1.1.1',
    description: 'Non-text Content: Provide text alternatives for any non-text content',
    disabilitiesAffected: ['Blind'],
    standard: {
      name: 'WCAG 2.1',
      level: 'A'
    }
  },
  {
    id: '1.2.1',
    description: 'Audio-only and Video-only (Prerecorded): Provide alternatives for time-based media',
    disabilitiesAffected: ['Blind', 'Hearing'],
    standard: {
      name: 'WCAG 2.1',
      level: 'A'
    }
  },
  {
    id: '1.2.2',
    description: 'Captions (Prerecorded): Provide captions for all prerecorded audio content',
    disabilitiesAffected: ['Hearing'],
    standard: {
      name: 'WCAG 2.1',
      level: 'A'
    }
  },
  {
    id: '1.2.3',
    description: 'Audio Description or Media Alternative (Prerecorded): Provide alternatives for time-based media',
    disabilitiesAffected: ['Blind'],
    standard: {
      name: 'WCAG 2.1',
      level: 'A'
    }
  },
  {
    id: '1.2.4',
    description: 'Captions (Live): Provide captions for all live audio content',
    disabilitiesAffected: ['Hearing'],
    standard: {
      name: 'WCAG 2.1',
      level: 'AA'
    }
  },
  {
    id: '1.2.5',
    description: 'Audio Description (Prerecorded): Provide audio description for prerecorded video content',
    disabilitiesAffected: ['Blind'],
    standard: {
      name: 'WCAG 2.1',
      level: 'AA'
    }
  },
  {
    id: '1.2.6',
    description: 'Sign Language (Prerecorded): Provide sign language interpretation for prerecorded audio content',
    disabilitiesAffected: ['Hearing'],
    standard: {
      name: 'WCAG 2.1',
      level: 'AAA'
    }
  },
  {
    id: '1.2.7',
    description: 'Extended Audio Description (Prerecorded): Provide extended audio description for prerecorded video content',
    disabilitiesAffected: ['Blind'],
    standard: {
      name: 'WCAG 2.1',
      level: 'AAA'
    }
  },
  {
    id: '1.2.8',
    description: 'Media Alternative (Prerecorded): Provide alternatives for time-based media',
    disabilitiesAffected: ['Blind', 'Hearing'],
    standard: {
      name: 'WCAG 2.1',
      level: 'AAA'
    }
  },
  {
    id: '1.2.9',
    description: 'Audio-only (Live): Provide alternatives for live audio-only content',
    disabilitiesAffected: ['Hearing'],
    standard: {
      name: 'WCAG 2.1',
      level: 'AAA'
    }
  },
  {
    id: '1.3.1',
    description: 'Info and Relationships: Information, structure, and relationships can be programmatically determined',
    disabilitiesAffected: ['Blind'],
    standard: {
      name: 'WCAG 2.1',
      level: 'A'
    }
  },
  {
    id: '1.3.2',
    description: 'Meaningful Sequence: Present content in a meaningful sequence',
    disabilitiesAffected: ['Blind'],
    standard: {
      name: 'WCAG 2.1',
      level: 'A'
    }
  },
  {
    id: '1.3.3',
    description: 'Sensory Characteristics: Instructions do not rely solely on sensory characteristics',
    disabilitiesAffected: ['Blind', 'Hearing'],
    standard: {
      name: 'WCAG 2.1',
      level: 'A'
    }
  },
  {
    id: '1.3.4',
    description: 'Orientation: Content not restricted to specific display orientation',
    disabilitiesAffected: ['Mobility'],
    standard: {
      name: 'WCAG 2.1',
      level: 'AA'
    }
  },
  {
    id: '1.3.5',
    description: 'Identify Input Purpose: The purpose of each input field can be programmatically determined',
    disabilitiesAffected: ['Blind', 'Mobility'],
    standard: {
      name: 'WCAG 2.1',
      level: 'AA'
    }
  },
  {
    id: '1.3.6',
    description: 'Identify Purpose: The purpose of UI components can be programmatically determined',
    disabilitiesAffected: ['Blind'],
    standard: {
      name: 'WCAG 2.1',
      level: 'AAA'
    }
  },
  {
    id: '1.4.1',
    description: 'Use of Color: Color is not used as the only visual means of conveying information',
    disabilitiesAffected: ['Blind'],
    standard: {
      name: 'WCAG 2.1',
      level: 'A'
    }
  },
  {
    id: '1.4.2',
    description: 'Audio Control: Provide mechanism to pause, stop, or control audio volume',
    disabilitiesAffected: ['Hearing'],
    standard: {
      name: 'WCAG 2.1',
      level: 'A'
    }
  },
  {
    id: '1.4.3',
    description: 'Contrast (Minimum): Text has sufficient color contrast against its background',
    disabilitiesAffected: ['Blind'],
    standard: {
      name: 'WCAG 2.1',
      level: 'AA'
    }
  },
  {
    id: '1.4.4',
    description: 'Resize Text: Text can be resized without loss of functionality',
    disabilitiesAffected: ['Blind'],
    standard: {
      name: 'WCAG 2.1',
      level: 'AA'
    }
  },
  {
    id: '1.4.5',
    description: 'Images of Text: Use text instead of images of text where possible',
    disabilitiesAffected: ['Blind'],
    standard: {
      name: 'WCAG 2.1',
      level: 'AA'
    }
  },
  {
    id: '1.4.6',
    description: 'Contrast (Enhanced): Provide enhanced contrast for text and images',
    disabilitiesAffected: ['Blind'],
    standard: {
      name: 'WCAG 2.1',
      level: 'AAA'
    }
  },
  {
    id: '1.4.7',
    description: 'Low or No Background Audio: Audio content has no or very low background noise',
    disabilitiesAffected: ['Hearing'],
    standard: {
      name: 'WCAG 2.1',
      level: 'AAA'
    }
  },
  {
    id: '1.4.8',
    description: 'Visual Presentation: Provide specific visual presentation options',
    disabilitiesAffected: ['Blind'],
    standard: {
      name: 'WCAG 2.1',
      level: 'AAA'
    }
  },
  {
    id: '1.4.9',
    description: 'Images of Text (No Exception): Use text instead of images of text',
    disabilitiesAffected: ['Blind'],
    standard: {
      name: 'WCAG 2.1',
      level: 'AAA'
    }
  },
  {
    id: '1.4.10',
    description: 'Reflow: Content can be presented without loss of information or functionality',
    disabilitiesAffected: ['Blind', 'Mobility'],
    standard: {
      name: 'WCAG 2.1',
      level: 'AA'
    }
  },
  {
    id: '1.4.11',
    description: 'Non-text Contrast: Visual elements have sufficient contrast',
    disabilitiesAffected: ['Blind'],
    standard: {
      name: 'WCAG 2.1',
      level: 'AA'
    }
  },
  {
    id: '1.4.12',
    description: 'Text Spacing: No loss of content when text spacing is adjusted',
    disabilitiesAffected: ['Blind'],
    standard: {
      name: 'WCAG 2.1',
      level: 'AA'
    }
  },
  {
    id: '1.4.13',
    description: 'Content on Hover or Focus: Additional content is controllable',
    disabilitiesAffected: ['Blind', 'Mobility'],
    standard: {
      name: 'WCAG 2.1',
      level: 'AA'
    }
  },
  {
    id: '2.1.1',
    description: 'Keyboard: All functionality is available from a keyboard',
    disabilitiesAffected: ['Blind', 'Mobility'],
    standard: {
      name: 'WCAG 2.1',
      level: 'A'
    }
  },
  {
    id: '2.1.2',
    description: 'No Keyboard Trap: Keyboard focus is not trapped',
    disabilitiesAffected: ['Blind', 'Mobility'],
    standard: {
      name: 'WCAG 2.1',
      level: 'A'
    }
  },
  {
    id: '2.1.3',
    description: 'Keyboard (No Exception): All functionality is available from a keyboard',
    disabilitiesAffected: ['Blind', 'Mobility'],
    standard: {
      name: 'WCAG 2.1',
      level: 'AAA'
    }
  },
  {
    id: '2.1.4',
    description: 'Character Key Shortcuts: Provide mechanism to remap or disable keyboard shortcuts',
    disabilitiesAffected: ['Mobility'],
    standard: {
      name: 'WCAG 2.1',
      level: 'A'
    }
  },
  {
    id: '2.2.1',
    description: 'Timing Adjustable: Users can extend, adjust, or disable time limits',
    disabilitiesAffected: ['Blind', 'Mobility'],
    standard: {
      name: 'WCAG 2.1',
      level: 'A'
    }
  },
  {
    id: '2.2.2',
    description: 'Pause, Stop, Hide: Provide controls for moving, blinking, or auto-updating content',
    disabilitiesAffected: ['Blind'],
    standard: {
      name: 'WCAG 2.1',
      level: 'A'
    }
  },
  {
    id: '2.2.3',
    description: 'No Timing: Timing is not an essential part of the activity',
    disabilitiesAffected: ['Blind', 'Mobility'],
    standard: {
      name: 'WCAG 2.1',
      level: 'AAA'
    }
  },
  {
    id: '2.2.4',
    description: 'Interruptions: Users can postpone or suppress interruptions',
    disabilitiesAffected: ['Blind', 'Mobility'],
    standard: {
      name: 'WCAG 2.1',
      level: 'AAA'
    }
  },
  {
    id: '2.2.5',
    description: 'Re-authenticating: Data is not lost when re-authenticating',
    disabilitiesAffected: ['Blind', 'Mobility'],
    standard: {
      name: 'WCAG 2.1',
      level: 'AAA'
    }
  },
  {
    id: '2.2.6',
    description: 'Timeouts: Users are warned about timeouts that could cause data loss',
    disabilitiesAffected: ['Blind', 'Mobility'],
    standard: {
      name: 'WCAG 2.1',
      level: 'AAA'
    }
  },
  {
    id: '2.3.1',
    description: 'Three Flashes or Below Threshold: No content flashes more than three times per second',
    disabilitiesAffected: ['Blind'],
    standard: {
      name: 'WCAG 2.1',
      level: 'A'
    }
  },
  {
    id: '2.3.2',
    description: 'Three Flashes: No content flashes more than three times per second',
    disabilitiesAffected: ['Blind'],
    standard: {
      name: 'WCAG 2.1',
      level: 'AAA'
    }
  },
  {
    id: '2.3.3',
    description: 'Animation from Interactions: Users can disable non-essential animation',
    disabilitiesAffected: ['Blind'],
    standard: {
      name: 'WCAG 2.1',
      level: 'AAA'
    }
  },
  {
    id: '2.4.1',
    description: 'Bypass Blocks: Provide mechanism to bypass repeated blocks',
    disabilitiesAffected: ['Blind', 'Mobility'],
    standard: {
      name: 'WCAG 2.1',
      level: 'A'
    }
  },
  {
    id: '2.4.2',
    description: 'Page Titled: Pages have titles that describe topic or purpose',
    disabilitiesAffected: ['Blind'],
    standard: {
      name: 'WCAG 2.1',
      level: 'A'
    }
  },
  {
    id: '2.4.3',
    description: 'Focus Order: Focus order preserves meaning and operability',
    disabilitiesAffected: ['Blind', 'Mobility'],
    standard: {
      name: 'WCAG 2.1',
      level: 'A'
    }
  },
  {
    id: '2.4.4',
    description: 'Link Purpose (In Context): Purpose of each link can be determined from link text',
    disabilitiesAffected: ['Blind'],
    standard: {
      name: 'WCAG 2.1',
      level: 'A'
    }
  },
  {
    id: '2.4.5',
    description: 'Multiple Ways: More than one way is available to locate a page',
    disabilitiesAffected: ['Blind', 'Mobility'],
    standard: {
      name: 'WCAG 2.1',
      level: 'AA'
    }
  },
  {
    id: '2.4.6',
    description: 'Headings and Labels: Headings and labels describe topic or purpose',
    disabilitiesAffected: ['Blind'],
    standard: {
      name: 'WCAG 2.1',
      level: 'AA'
    }
  },
  {
    id: '2.4.7',
    description: 'Focus Visible: Keyboard focus indicator is visible',
    disabilitiesAffected: ['Blind', 'Mobility'],
    standard: {
      name: 'WCAG 2.1',
      level: 'AA'
    }
  },
  {
    id: '2.4.8',
    description: 'Location: Information about users location within a set of pages is available',
    disabilitiesAffected: ['Blind'],
    standard: {
      name: 'WCAG 2.1',
      level: 'AAA'
    }
  },
  {
    id: '2.4.9',
    description: 'Link Purpose (Link Only): Purpose of each link can be determined from link text alone',
    disabilitiesAffected: ['Blind'],
    standard: {
      name: 'WCAG 2.1',
      level: 'AAA'
    }
  },
  {
    id: '2.4.10',
    description: 'Section Headings: Section headings are used to organize content',
    disabilitiesAffected: ['Blind'],
    standard: {
      name: 'WCAG 2.1',
      level: 'AAA'
    }
  },
  {
    id: '2.5.1',
    description: 'Pointer Gestures: All functionality can be operated through simple pointer gestures',
    disabilitiesAffected: ['Mobility'],
    standard: {
      name: 'WCAG 2.1',
      level: 'A'
    }
  },
  {
    id: '2.5.2',
    description: 'Pointer Cancellation: Functions can be cancelled or undone',
    disabilitiesAffected: ['Mobility'],
    standard: {
      name: 'WCAG 2.1',
      level: 'A'
    }
  },
  {
    id: '2.5.3',
    description: 'Label in Name: Visual labels match their accessible names',
    disabilitiesAffected: ['Blind'],
    standard: {
      name: 'WCAG 2.1',
      level: 'A'
    }
  },
  {
    id: '2.5.4',
    description: 'Motion Actuation: Functionality can be operated without device motion',
    disabilitiesAffected: ['Mobility'],
    standard: {
      name: 'WCAG 2.1',
      level: 'A'
    }
  },
  {
    id: '2.5.5',
    description: 'Target Size: Target size is at least 44 by 44 CSS pixels',
    disabilitiesAffected: ['Mobility'],
    standard: {
      name: 'WCAG 2.1',
      level: 'AAA'
    }
  },
  {
    id: '2.5.6',
    description: 'Concurrent Input Mechanisms: Content can be operated through multiple input methods',
    disabilitiesAffected: ['Mobility'],
    standard: {
      name: 'WCAG 2.1',
      level: 'AAA'
    }
  },
  {
    id: '3.1.1',
    description: 'Language of Page: Default human language can be programmatically determined',
    disabilitiesAffected: ['Blind'],
    standard: {
      name: 'WCAG 2.1',
      level: 'A'
    }
  },
  {
    id: '3.1.2',
    description: 'Language of Parts: Language of content parts can be programmatically determined',
    disabilitiesAffected: ['Blind'],
    standard: {
      name: 'WCAG 2.1',
      level: 'AA'
    }
  },
  {
    id: '3.1.3',
    description: 'Unusual Words: Mechanism available to identify specific definitions of words',
    disabilitiesAffected: ['Blind'],
    standard: {
      name: 'WCAG 2.1',
      level: 'AAA'
    }
  },
  {
    id: '3.1.4',
    description: 'Abbreviations: Mechanism for identifying expanded form of abbreviations',
    disabilitiesAffected: ['Blind'],
    standard: {
      name: 'WCAG 2.1',
      level: 'AAA'
    }
  },
  {
    id: '3.1.5',
    description: 'Reading Level: Content is written as clearly and simply as possible',
    disabilitiesAffected: ['Blind'],
    standard: {
      name: 'WCAG 2.1',
      level: 'AAA'
    }
  },
  {
    id: '3.1.6',
    description: 'Pronunciation: Mechanism available to identify specific pronunciation',
    disabilitiesAffected: ['Blind', 'Hearing'],
    standard: {
      name: 'WCAG 2.1',
      level: 'AAA'
    }
  },
  {
    id: '3.2.1',
    description: 'On Focus: When an element receives focus, it does not initiate a change of context',
    disabilitiesAffected: ['Blind', 'Mobility'],
    standard: {
      name: 'WCAG 2.1',
      level: 'A'
    }
  },
  {
    id: '3.2.2',
    description: 'On Input: Changing a form control setting does not automatically cause a change of context',
    disabilitiesAffected: ['Blind', 'Mobility'],
    standard: {
      name: 'WCAG 2.1',
      level: 'A'
    }
  },
  {
    id: '3.2.3',
    description: 'Consistent Navigation: Navigation mechanisms are consistent across pages',
    disabilitiesAffected: ['Blind'],
    standard: {
      name: 'WCAG 2.1',
      level: 'AA'
    }
  },
  {
    id: '3.2.4',
    description: 'Consistent Identification: Components with same functionality are identified consistently',
    disabilitiesAffected: ['Blind'],
    standard: {
      name: 'WCAG 2.1',
      level: 'AA'
    }
  },
  {
    id: '3.2.5',
    description: 'Change on Request: Changes of context are initiated only by user request',
    disabilitiesAffected: ['Blind', 'Mobility'],
    standard: {
      name: 'WCAG 2.1',
      level: 'AAA'
    }
  },
  {
    id: '3.3.1',
    description: 'Error Identification: Input errors are clearly identified',
    disabilitiesAffected: ['Blind'],
    standard: {
      name: 'WCAG 2.1',
      level: 'A'
    }
  },
  {
    id: '3.3.2',
    description: 'Labels or Instructions: Labels or instructions are provided for user input',
    disabilitiesAffected: ['Blind'],
    standard: {
      name: 'WCAG 2.1',
      level: 'A'
    }
  },
  {
    id: '3.3.3',
    description: 'Error Suggestion: Suggestions for error correction are provided',
    disabilitiesAffected: ['Blind'],
    standard: {
      name: 'WCAG 2.1',
      level: 'AA'
    }
  },
  {
    id: '3.3.4',
    description: 'Error Prevention (Legal, Financial, Data): Submissions can be checked, confirmed, or reversed',
    disabilitiesAffected: ['Blind', 'Mobility'],
    standard: {
      name: 'WCAG 2.1',
      level: 'AA'
    }
  },
  {
    id: '3.3.5',
    description: 'Help: Context-sensitive help is available',
    disabilitiesAffected: ['Blind'],
    standard: {
      name: 'WCAG 2.1',
      level: 'AAA'
    }
  },
  {
    id: '3.3.6',
    description: 'Error Prevention (All): Submissions can be checked, confirmed, or reversed',
    disabilitiesAffected: ['Blind', 'Mobility'],
    standard: {
      name: 'WCAG 2.1',
      level: 'AAA'
    }
  },
  {
    id: '4.1.1',
    description: 'Parsing: Content implemented using markup languages has complete start and end tags',
    disabilitiesAffected: ['Blind'],
    standard: {
      name: 'WCAG 2.1',
      level: 'A'
    }
  },
  {
    id: '4.1.2',
    description: 'Name, Role, Value: For all UI components, name and role can be programmatically determined',
    disabilitiesAffected: ['Blind'],
    standard: {
      name: 'WCAG 2.1',
      level: 'A'
    }
  },
  {
    id: '4.1.3',
    description: 'Status Messages: Status messages can be programmatically determined',
    disabilitiesAffected: ['Blind'],
    standard: {
      name: 'WCAG 2.1',
      level: 'AA'
    }
  },

  // WCAG 2.2 New Success Criteria
  {
    id: '2.4.11',
    description: 'Focus Appearance: The focus indicator has sufficient area, contrast ratio, and is not obscured',
    disabilitiesAffected: ['Blind', 'Mobility'],
    standard: {
      name: 'WCAG 2.2',
      level: 'AA'
    }
  },
  {
    id: '2.4.12',
    description: 'Focus Not Obscured (Minimum): Focused user interface components are not entirely hidden by author-created content',
    disabilitiesAffected: ['Blind', 'Mobility'],
    standard: {
      name: 'WCAG 2.2',
      level: 'AA'
    }
  },
  {
    id: '2.4.13',
    description: 'Focus Not Obscured (Enhanced): Focused user interface components are not entirely hidden by any content',
    disabilitiesAffected: ['Blind', 'Mobility'],
    standard: {
      name: 'WCAG 2.2',
      level: 'AAA'
    }
  },
  {
    id: '2.5.7',
    description: 'Dragging Movements: All functionality that uses a dragging movement can be operated by a single pointer without dragging',
    disabilitiesAffected: ['Mobility'],
    standard: {
      name: 'WCAG 2.2',
      level: 'AA'
    }
  },
  {
    id: '2.5.8',
    description: 'Target Size (Minimum): Target size is at least 24 by 24 CSS pixels',
    disabilitiesAffected: ['Mobility'],
    standard: {
      name: 'WCAG 2.2',
      level: 'AA'
    }
  },
  {
    id: '3.2.6',
    description: 'Consistent Help: Help mechanisms that are repeated on multiple pages appear in the same relative order',
    disabilitiesAffected: ['Blind', 'Mobility'],
    standard: {
      name: 'WCAG 2.2',
      level: 'A'
    }
  },
  {
    id: '3.3.7',
    description: 'Redundant Entry: Information previously entered by or provided to the user is either auto-populated or available for selection',
    disabilitiesAffected: ['Blind', 'Mobility'],
    standard: {
      name: 'WCAG 2.2',
      level: 'A'
    }
  },
  {
    id: '3.3.8',
    description: 'Accessible Authentication (Minimum): Cognitive function tests are not required for authentication',
    disabilitiesAffected: ['Blind', 'Mobility'],
    standard: {
      name: 'WCAG 2.2',
      level: 'AA'
    }
  },
  {
    id: '3.3.9',
    description: 'Accessible Authentication (Enhanced): Authentication processes require no more than one cognitive function test',
    disabilitiesAffected: ['Blind', 'Mobility'],
    standard: {
      name: 'WCAG 2.2',
      level: 'AAA'
    }
  },

  // Japanese JIS X 8341-3:2016 Standards
  {
    id: 'JIS-1.1',
    description: 'Text alternatives for non-text content must follow JIS guidelines',
    disabilitiesAffected: ['Blind'],
    standard: {
      name: 'JIS X 8341-3',
      level: 'AA'
    }
  },
  {
    id: 'JIS-1.2',
    description: 'Japanese character encoding must be properly specified',
    disabilitiesAffected: ['Blind'],
    standard: {
      name: 'JIS X 8341-3',
      level: 'A'
    }
  },

  // Australian Standards (WCAG 2.1 Level AA+)
  {
    id: 'AUS-1.1',
    description: 'Content must meet Australian Government accessibility requirements',
    disabilitiesAffected: ['Blind', 'Mobility'],
    standard: {
      name: 'DTA Accessibility',
      level: 'AA'
    }
  },

  // UK Standards (WCAG 2.1 Level AA + GDS)
  {
    id: 'UK-1.1',
    description: 'Content must meet UK Government Digital Service Standards',
    disabilitiesAffected: ['Blind', 'Mobility'],
    standard: {
      name: 'GDS',
      level: 'AA'
    }
  },

  // EU Standards (EN 301 549)
  {
    id: 'EU-1.1',
    description: 'Content must comply with EN 301 549 V3.2.1 requirements',
    disabilitiesAffected: ['Blind', 'Mobility'],
    standard: {
      name: 'EN 301 549',
      level: 'AA'
    }
  },

  // USA Section 508
  {
    id: 'US-508-1.1',
    description: 'Content must comply with updated Section 508 requirements',
    disabilitiesAffected: ['Blind', 'Mobility'],
    standard: {
      name: 'Section 508',
      level: 'AA'
    }
  },

  // Canadian Standards (AODA)
  {
    id: 'CA-1.1',
    description: 'Content must meet AODA compliance requirements',
    disabilitiesAffected: ['Blind', 'Mobility'],
    standard: {
      name: 'AODA',
      level: 'AA'
    }
  }
];

export default masterRequirements;