import type { WCAGInfo } from '../types';

const wcagDatabase: Record<string, WCAGInfo> = {
  'color-contrast': {
    description: 'Text content must have sufficient contrast with its background to ensure readability for all users.',
    successCriteria: 'Text must have a contrast ratio of at least 4.5:1 for normal text and 3:1 for large text.',
    suggestedFix: 'Adjust text or background colors to meet minimum contrast requirements. Use a color contrast checker to verify ratios.',
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
  'image-alt': {
    description: 'All non-text content (images, icons, etc.) must have text alternatives that serve the equivalent purpose.',
    successCriteria: 'Every image that conveys meaning must have descriptive alternative text. Decorative images should have empty alt attributes.',
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
  'html-has-lang': {
    description: 'The HTML element must have a valid lang attribute to identify the language of the page.',
    successCriteria: 'The default human language of each web page must be programmatically determined.',
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
  'heading-order': {
    description: 'Headings must follow a logical hierarchical order to maintain proper document structure.',
    successCriteria: 'Heading levels should increase by only one level at a time and should not skip levels.',
    suggestedFix: 'Structure headings in a logical order, starting with h1 and nesting subsequent levels appropriately.',
    codeExample: `<!-- Good Example -->
<h1>Main Title</h1>
<section>
  <h2>Section Title</h2>
  <h3>Subsection Title</h3>
</section>

<!-- Bad Example -->
<h1>Main Title</h1>
<h3>Skipped h2 Level</h3>`
  },
  'label': {
    description: 'Form controls must have associated label elements that describe their purpose.',
    successCriteria: 'Each form control must have a visible label that is programmatically associated with the control.',
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
  }
};

export function getWCAGInfo(ruleId: string | undefined): WCAGInfo | undefined {
  if (!ruleId) return undefined;
  return wcagDatabase[ruleId];
}