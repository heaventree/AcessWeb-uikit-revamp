import type { WCAGInfo } from '../types';

const ruleToWCAGMap: Record<string, string[]> = {
  'landmark-no-duplicate-banner': ['WCAG1.3.1', 'WCAG4.1.1'],
  'landmark-no-duplicate-contentinfo': ['WCAG1.3.1', 'WCAG4.1.1'],
  'landmark-banner-is-top-level': ['WCAG1.3.1'],
  'landmark-contentinfo-is-top-level': ['WCAG1.3.1'],
  'landmark-complementary-is-top-level': ['WCAG1.3.1'],
  'landmark-unique': ['WCAG1.3.1', 'WCAG4.1.1'],
  'landmark-no-duplicate-main': ['WCAG1.3.1', 'WCAG4.1.1'],
  'button-name': ['WCAG4.1.2', 'WCAG2.5.3'],
  'image-alt': ['WCAG1.1.1'],
  'link-name': ['WCAG2.4.4', 'WCAG4.1.2'],
  'color-contrast': ['WCAG1.4.3'],
  'region': ['WCAG1.3.1'],
  'list': ['WCAG1.3.1'],
  'listitem': ['WCAG1.3.1'],
  'heading-order': ['WCAG1.3.1', 'WCAG2.4.6'],
  'label': ['WCAG3.3.2', 'WCAG4.1.2'],
  'form-label': ['WCAG3.3.2', 'WCAG4.1.2'],
  'form-field-multiple-labels': ['WCAG3.3.2'],
  'label-title-only': ['WCAG3.3.2'],
  'frame-title': ['WCAG4.1.2'],
  'html-has-lang': ['WCAG3.1.1'],
  'html-lang-valid': ['WCAG3.1.1'],
  'duplicate-id': ['WCAG4.1.1'],
  'aria-roles': ['WCAG4.1.2'],
  'aria-valid-attr': ['WCAG4.1.2']
};

const wcagDatabase: Record<string, WCAGInfo> = {
  'WCAG1.1.1': {
    description: 'All non-text content that is presented to the user has a text alternative that serves the equivalent purpose.',
    successCriteria: 'Provide text alternatives for any non-text content so that it can be changed into other forms people need, such as large print, braille, speech, symbols or simpler language.',
    suggestedFix: 'Add descriptive alt text to images, provide transcripts for audio/video content, and ensure all non-text content has a text equivalent.',
    codeExample: `<!-- Good Example -->
<img src="logo.png" alt="Company Name Logo">
<img src="chart.png" alt="Sales growth chart showing 25% increase in Q4">
<img src="decoration.png" alt="" role="presentation">

<!-- Bad Example -->
<img src="logo.png">
<img src="chart.png" alt="chart">
<img src="photo.jpg" alt="image">`
  },
  'WCAG1.3.1': {
    description: 'Information, structure, and relationships conveyed through presentation can be programmatically determined.',
    successCriteria: 'Use semantic HTML elements and ARIA landmarks to convey document structure. Ensure form controls have proper labels and relationships.',
    suggestedFix: 'Use appropriate HTML elements like nav, main, article, aside. Use proper heading hierarchy. Associate form labels with controls.',
    codeExample: `<!-- Good Example -->
<nav aria-label="Main">
  <ul>
    <li><a href="/">Home</a></li>
  </ul>
</nav>

<main>
  <h1>Main Content</h1>
  <article>
    <h2>Article Title</h2>
    <p>Content...</p>
  </article>
</main>`
  },
  'WCAG1.4.3': {
    description: 'The visual presentation of text and images of text has a contrast ratio of at least 4.5:1.',
    successCriteria: 'Text must have sufficient contrast against its background: 4.5:1 for normal text, 3:1 for large text.',
    suggestedFix: 'Adjust text or background colors to meet minimum contrast requirements. Use a color contrast checker to verify ratios.',
    codeExample: `/* Good Example */
.text-content {
  color: #333333; /* Dark gray text */
  background-color: #FFFFFF; /* White background */
  /* Contrast ratio: 12.63:1 */
}

/* Bad Example */
.text-content {
  color: #999999; /* Light gray text */
  background-color: #FFFFFF; /* White background */
  /* Contrast ratio: 2.85:1 */
}`
  },
  'WCAG2.4.4': {
    description: 'The purpose of each link can be determined from the link text alone or from the link text together with its programmatically determined context.',
    successCriteria: 'Link text should clearly indicate where the link will take the user, without needing additional context.',
    suggestedFix: 'Use descriptive link text that makes sense out of context. Avoid generic phrases like "click here" or "learn more".',
    codeExample: `<!-- Good Example -->
<a href="privacy.pdf">Download Privacy Policy (PDF)</a>
<a href="contact.html">Contact our support team</a>

<!-- Bad Example -->
<a href="privacy.pdf">click here</a>
<a href="contact.html">learn more</a>`
  },
  'WCAG2.5.3': {
    description: 'For user interface components with labels that include text or images of text, the name contains the text that is presented visually.',
    successCriteria: 'The accessible name of a component should match its visible label text.',
    suggestedFix: 'Ensure that button and control labels match their visible text. Use aria-label only when necessary.',
    codeExample: `<!-- Good Example -->
<button>Submit Form</button>

<!-- Bad Example -->
<button aria-label="Submit">Send</button>`
  },
  'WCAG3.1.1': {
    description: 'The default human language of each web page can be programmatically determined.',
    successCriteria: 'The HTML element must have a valid lang attribute that identifies the primary language of the page.',
    suggestedFix: 'Add a lang attribute with the appropriate language code to the HTML element.',
    codeExample: `<!-- Good Example -->
<!DOCTYPE html>
<html lang="en">
  <head>...</head>
  <body>...</body>
</html>

<!-- Bad Example -->
<!DOCTYPE html>
<html>
  <head>...</head>
  <body>...</body>
</html>`
  },
  'WCAG4.1.2': {
    description: 'For all user interface components, the name and role can be programmatically determined; states, properties, and values can be programmatically set.',
    successCriteria: 'All interactive elements must have accessible names and roles. Custom controls must implement proper ARIA attributes.',
    suggestedFix: 'Use semantic HTML elements when possible. Add proper ARIA attributes when creating custom controls.',
    codeExample: `<!-- Good Example -->
<button aria-expanded="false" aria-controls="menu">
  Toggle Menu
</button>

<div id="menu" role="menu" hidden>
  <button role="menuitem">Option 1</button>
  <button role="menuitem">Option 2</button>
</div>`
  },
  'label': {
    description: 'Form elements must have visible labels that are properly associated with their controls.',
    successCriteria: 'Each form control must have a visible label that is programmatically associated with the control using either the label element with a for attribute or by wrapping the control with the label element.',
    suggestedFix: 'Add proper labels to all form controls using either the label element with matching for/id attributes or by wrapping the control with the label element.',
    codeExample: `<!-- Good Examples -->
<label for="username">Username</label>
<input type="text" id="username" name="username">

<label>
  Password
  <input type="password" name="password">
</label>

<!-- Bad Examples -->
<input type="text" placeholder="Enter username">
<div>Password</div>
<input type="password">`
  },

  'form-label': {
    description: 'Form controls must have labels that are properly associated and visible to all users.',
    successCriteria: 'Each form control must have a visible label that clearly describes its purpose and is programmatically associated with the control.',
    suggestedFix: 'Add visible labels to form controls and ensure they are properly associated using for/id attributes or by wrapping the control with the label element.',
    codeExample: `<!-- Good Example -->
<div class="form-group">
  <label for="email">Email Address</label>
  <input
    type="email"
    id="email"
    name="email"
    required
    aria-required="true"
  >
</div>

<!-- Bad Example -->
<div class="form-group">
  <input
    type="email"
    name="email"
    placeholder="Enter email"
  >
</div>`
  },

  'form-field-multiple-labels': {
    description: 'Form fields should not have multiple label associations as this can cause confusion for screen reader users.',
    successCriteria: 'Each form control should have exactly one label element associated with it.',
    suggestedFix: 'Remove duplicate labels and ensure each form control has exactly one associated label.',
    codeExample: `<!-- Good Example -->
<label for="phone">Phone Number</label>
<input type="tel" id="phone" name="phone">

<!-- Bad Example -->
<label for="phone">Phone</label>
<label for="phone">Contact Number</label>
<input type="tel" id="phone" name="phone">`
  },

  'label-title-only': {
    description: 'Form controls should not rely solely on title attributes for labels.',
    successCriteria: 'Form controls must have visible labels in addition to any title attributes.',
    suggestedFix: 'Replace title-only labels with visible label elements.',
    codeExample: `<!-- Good Example -->
<label for="search">Search</label>
<input type="search" id="search" name="search">

<!-- Bad Example -->
<input type="search" title="Search" name="search">`
  },

  'color-contrast': {
    description: 'Text content must have sufficient contrast with its background to ensure readability for all users.',
    successCriteria: 'Text must have a contrast ratio of at least 4.5:1 for normal text and 3:1 for large text (18pt or 14pt bold).',
    suggestedFix: 'Adjust the text or background colors to meet the minimum contrast requirements. Use a color contrast checker to verify the ratios.',
    codeExample: `/* Good Example - Sufficient contrast */
.text-content {
  color: #333333; /* Dark gray text */
  background-color: #FFFFFF; /* White background */
  /* Contrast ratio: 12.63:1 */
}

/* Bad Example - Insufficient contrast */
.text-content {
  color: #999999; /* Light gray text */
  background-color: #FFFFFF; /* White background */
  /* Contrast ratio: 2.85:1 */
}`
  },

  'link-name': {
    description: 'Links must have discernible text that clearly indicates their purpose.',
    successCriteria: 'The purpose of each link can be determined from the link text alone or from the link text together with its programmatically determined context.',
    suggestedFix: 'Use descriptive link text that clearly indicates where the link will take the user. Avoid generic phrases like "click here" or "learn more".',
    codeExample: `<!-- Good Examples -->
<a href="privacy.pdf">Download Privacy Policy (PDF)</a>
<a href="contact.html">Contact our support team</a>

<!-- Bad Examples -->
<a href="privacy.pdf">click here</a>
<a href="contact.html">learn more</a>`
  },

  'image-alt': {
    description: 'Images must have alternative text that serves the equivalent purpose.',
    successCriteria: 'All images that convey meaning must have descriptive alternative text. Decorative images should have empty alt attributes.',
    suggestedFix: 'Add descriptive alt text to images that convey information. Use empty alt="" for decorative images.',
    codeExample: `<!-- Good Examples -->
<img src="logo.png" alt="Company Name Logo">
<img src="chart.png" alt="Sales growth chart showing 25% increase in Q4">
<img src="decoration.png" alt="" role="presentation">

<!-- Bad Examples -->
<img src="logo.png">
<img src="chart.png" alt="chart">
<img src="photo.jpg" alt="image">`
  },

  'button-name': {
    description: 'Buttons must have discernible text that describes their purpose.',
    successCriteria: 'Every button must have a clear, descriptive accessible name through visible text content, aria-label, or aria-labelledby.',
    suggestedFix: 'Add descriptive text content to buttons or use aria-label when the button only contains an icon.',
    codeExample: `<!-- Good Examples -->
<button type="submit">Save Changes</button>

<button aria-label="Close dialog">
  <svg><!-- icon --></svg>
</button>

<!-- Bad Examples -->
<button></button>
<button><svg></svg></button>
<button>Click Here</button>`
  },

  'html-has-lang': {
    description: 'The HTML element must have a valid lang attribute to identify the language of the page.',
    successCriteria: 'Specify the primary language of the page using a valid language code.',
    suggestedFix: 'Add a lang attribute with the appropriate language code to the HTML element.',
    codeExample: `<!-- Good Example -->
<!DOCTYPE html>
<html lang="en">
  <head>...</head>
  <body>...</body>
</html>

<!-- Bad Example -->
<!DOCTYPE html>
<html>
  <head>...</head>
  <body>...</body>
</html>`
  }
};

export function getWCAGInfo(ruleId: string | undefined): WCAGInfo | undefined {
  if (!ruleId) return undefined;

  // First try direct lookup in database
  if (wcagDatabase[ruleId]) {
    return wcagDatabase[ruleId];
  }

  // If it's a WCAG criteria (e.g., "1.4.3" or "WCAG1.4.3")
  const wcagId = ruleId.replace(/^WCAG/, '');
  if (wcagDatabase[`WCAG${wcagId}`]) {
    return wcagDatabase[`WCAG${wcagId}`];
  }

  // If it's a rule ID, look up its WCAG criteria
  const wcagCriteria = ruleToWCAGMap[ruleId];
  if (wcagCriteria) {
    // Try each criteria
    for (const criteria of wcagCriteria) {
      const criteriaId = criteria.replace(/^WCAG/, '');
      if (wcagDatabase[`WCAG${criteriaId}`]) {
        return wcagDatabase[`WCAG${criteriaId}`];
      }
    }
  }

  // If it looks like a WCAG number without prefix (e.g., "1.4.3")
  if (/^\d+\.\d+\.\d+$/.test(ruleId)) {
    if (wcagDatabase[`WCAG${ruleId}`]) {
      return wcagDatabase[`WCAG${ruleId}`];
    }
  }
  
  return undefined;
}