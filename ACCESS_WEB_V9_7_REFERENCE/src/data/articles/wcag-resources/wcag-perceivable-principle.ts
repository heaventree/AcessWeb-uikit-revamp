import type { Article } from '../../../types/blog';

export const wcagPerceivablePrincipleGuide: Article = {
  id: 'wcag-perceivable-principle',
  slug: 'wcag-perceivable-principle-guide',
  title: 'WCAG Perceivable Principle: Making Content Accessible to All Users',
  description: 'A comprehensive guide to the WCAG Perceivable principle, covering text alternatives, time-based media, adaptable content, and distinguishable elements.',
  content: `
# WCAG Perceivable Principle: Making Content Accessible to All Users

The Perceivable principle is the first of the four WCAG principles (Perceivable, Operable, Understandable, Robust) and focuses on ensuring that information and user interface components must be presentable to users in ways they can perceive.

## Understanding the Perceivable Principle

Users must be able to perceive the information being presented. This means that content cannot be invisible to all of their senses. Key aspects of perceivability include:

- Content must be available in text format or have text alternatives
- Media should have alternatives (captions, audio descriptions)
- Content should adapt to different presentation methods
- Users should be able to distinguish foreground from background

## Guideline 1.1: Text Alternatives

Provide text alternatives for any non-text content.

### Success Criterion 1.1.1: Non-text Content (Level A)

All non-text content must have a text alternative that serves the equivalent purpose. This includes:

- Images
- Controls and input
- Time-based media
- Tests and exercises
- Sensory experiences

#### Implementation Examples

For basic images that convey information:

\`\`\`html
<!-- Good Example -->
<img src="chart.png" alt="Bar chart showing sales increasing 25% in Q4 2023">

<!-- Poor Example -->
<img src="chart.png" alt="chart">
\`\`\`

For decorative images:

\`\`\`html
<!-- Correct approach -->
<img src="decorative-line.png" alt="" role="presentation">

<!-- Alternative approach using CSS -->
<div class="decorative-image"></div>
\`\`\`

For complex images (charts, diagrams):

\`\`\`html
<figure>
  <img src="complex-chart.png" 
       alt="Organizational chart"
       aria-describedby="chart-description">
  <figcaption id="chart-description">
    Organizational chart showing CEO at top, with COO, CTO, and CFO reporting directly.
    Each executive has 3-4 direct reports arranged in a hierarchical structure.
  </figcaption>
</figure>
\`\`\`

For functional images like buttons:

\`\`\`html
<!-- Good -->
<button>
  <img src="search-icon.png" alt="Search">
</button>

<!-- Better -->
<button aria-label="Search">
  <img src="search-icon.png" alt="">
</button>
\`\`\`

## Guideline 1.2: Time-based Media

Provide alternatives for time-based media.

### Success Criterion 1.2.1: Audio-only and Video-only (Prerecorded) (Level A)

Prerecorded audio-only and video-only content should have an alternative:

- Audio-only: Provide a transcript
- Video-only (no audio): Provide a text description or audio description

### Success Criterion 1.2.2: Captions (Prerecorded) (Level A)

All prerecorded audio content in synchronized media should have captions.

\`\`\`html
<video controls>
  <source src="product-demo.mp4" type="video/mp4">
  <track src="captions.vtt" kind="subtitles" srclang="en" label="English">
  Your browser does not support the video tag.
</video>
\`\`\`

### Success Criterion 1.2.3: Audio Description or Media Alternative (Level A)

Prerecorded video with synchronized audio should have an audio description or media alternative.

### Success Criterion 1.2.4: Captions (Live) (Level AA)

Live audio content in synchronized media should have captions.

### Success Criterion 1.2.5: Audio Description (Level AA)

Prerecorded video content should have audio descriptions.

\`\`\`html
<video controls>
  <source src="video.mp4" type="video/mp4">
  <track src="captions.vtt" kind="subtitles" srclang="en" label="English">
  <track src="audio-description.vtt" kind="descriptions" srclang="en" label="Audio Description">
</video>
\`\`\`

## Guideline 1.3: Adaptable

Create content that can be presented in different ways without losing information or structure.

### Success Criterion 1.3.1: Info and Relationships (Level A)

Information, structure, and relationships conveyed through presentation can be programmatically determined or are available in text.

#### Implementation Examples

Proper heading structure:

\`\`\`html
<!-- Good structure -->
<h1>Main Page Title</h1>
<section>
  <h2>Section Heading</h2>
  <p>Section content...</p>
  
  <h3>Subsection Heading</h3>
  <p>Subsection content...</p>
</section>

<!-- Poor structure -->
<div class="heading-large">Main Page Title</div>
<div class="heading-medium">Section Heading</div>
\`\`\`

For forms, associate labels with inputs:

\`\`\`html
<!-- Good -->
<label for="name">Full Name:</label>
<input type="text" id="name" name="name">

<!-- Poor -->
Full Name: <input type="text" name="name">
\`\`\`

For tables, use appropriate markup:

\`\`\`html
<table>
  <caption>Monthly Budget</caption>
  <thead>
    <tr>
      <th scope="col">Category</th>
      <th scope="col">Amount</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row">Housing</th>
      <td>$1,200</td>
    </tr>
    <tr>
      <th scope="row">Utilities</th>
      <td>$250</td>
    </tr>
  </tbody>
</table>
\`\`\`

### Success Criterion 1.3.2: Meaningful Sequence (Level A)

When the sequence of content affects its meaning, a correct reading sequence can be programmatically determined.

### Success Criterion 1.3.3: Sensory Characteristics (Level A)

Instructions should not rely solely on sensory characteristics (shape, color, size, visual location, orientation, or sound).

\`\`\`html
<!-- Poor example -->
<p>Click the green button to continue</p>

<!-- Better example -->
<p>Click the "Continue" button <span class="green-button">identified by the green color</span> to proceed</p>

<!-- Best example with icon -->
<button>
  Continue
  <span class="visually-hidden">to the next step</span>
  <svg class="icon"><!-- forward arrow icon --></svg>
</button>
\`\`\`

### Success Criterion 1.3.4: Orientation (Level AA)

Content should not restrict its view and operation to a single display orientation.

### Success Criterion 1.3.5: Identify Input Purpose (Level AA)

The purpose of each input field collecting information about the user can be programmatically determined.

\`\`\`html
<label for="email">Email:</label>
<input type="email" id="email" name="email" autocomplete="email">

<label for="tel">Telephone:</label>
<input type="tel" id="tel" name="tel" autocomplete="tel">
\`\`\`

## Guideline 1.4: Distinguishable

Make it easier for users to see and hear content including separating foreground from background.

### Success Criterion 1.4.1: Use of Color (Level A)

Color should not be used as the only visual means of conveying information.

\`\`\`html
<!-- Poor example -->
<p>Required fields are shown in red</p>

<!-- Better example -->
<p>Required fields are marked with an asterisk (*) and shown in red</p>

<label for="name">Name: *</label>
<input id="name" type="text" required aria-required="true">
\`\`\`

### Success Criterion 1.4.2: Audio Control (Level A)

If audio plays automatically for more than 3 seconds, provide a mechanism to pause, stop, or control volume.

\`\`\`html
<audio controls autoplay>
  <source src="background-music.mp3" type="audio/mpeg">
  Your browser does not support the audio element.
</audio>
\`\`\`

### Success Criterion 1.4.3: Contrast (Minimum) (Level AA)

Text and images of text should have a contrast ratio of at least 4.5:1, with exceptions for large text, incidental text, and logotypes.

\`\`\`css
/* Good contrast example */
.content {
  color: #333; /* Dark gray, sufficient contrast on white */
  background-color: #fff;
}

/* Poor contrast example */
.low-contrast {
  color: #aaa; /* Light gray, inadequate contrast on white */
  background-color: #fff;
}
\`\`\`

### Success Criterion 1.4.4: Resize Text (Level AA)

Text can be resized up to 200 percent without loss of content or functionality.

\`\`\`css
/* Good example using relative units */
body {
  font-size: 1rem;
}
h1 {
  font-size: 2em;
}

/* Poor example using fixed units */
body {
  font-size: 16px;
}
.container {
  width: 800px; /* Fixed width will cause issues when text is enlarged */
}
\`\`\`

### Success Criterion 1.4.5: Images of Text (Level AA)

Use actual text rather than images of text.

### Success Criterion 1.4.10: Reflow (Level AA)

Content should be viewable without scrolling in two dimensions at 400% zoom.

\`\`\`css
/* Good example */
.responsive-layout {
  max-width: 100%;
  display: flex;
  flex-wrap: wrap;
}

/* Ensure no horizontal scrolling at different viewports */
@media (max-width: 768px) {
  .responsive-layout {
    flex-direction: column;
  }
}
\`\`\`

### Success Criterion 1.4.11: Non-Text Contrast (Level AA)

User interface components and graphical objects should have a contrast ratio of at least 3:1 against adjacent colors.

### Success Criterion 1.4.12: Text Spacing (Level AA)

No loss of content or functionality occurs when users adapt text spacing properties.

\`\`\`css
/* Support user-adjusted text spacing */
.content {
  line-height: 1.5;
  letter-spacing: 0.12em;
  word-spacing: 0.16em;
}

/* Allow for text spacing adjustments without overflow issues */
p {
  max-width: 80ch;
  overflow-wrap: break-word;
}
\`\`\`

### Success Criterion 1.4.13: Content on Hover or Focus (Level AA)

Additional content that appears on hover or focus should be dismissable, hoverable, and persistent.

\`\`\`html
<div class="tooltip-container">
  <button 
    aria-describedby="tooltip-1" 
    onmouseenter="showTooltip('tooltip-1')" 
    onfocus="showTooltip('tooltip-1')"
  >
    Help
  </button>
  <div 
    id="tooltip-1" 
    role="tooltip" 
    class="tooltip" 
    hidden
  >
    <button 
      class="close-button" 
      onclick="hideTooltip('tooltip-1')" 
      aria-label="Close tooltip"
    >
      ×
    </button>
    Help information that can be dismissed, hovered over,
    and remains visible until dismissed.
  </div>
</div>
\`\`\`

## Testing for Perceivability

### Visual Testing

- Disable images and verify that alt text provides equivalent information
- Check color contrast using tools like WebAIM's Contrast Checker
- Resize text to 200% and ensure no content is lost
- View the page in grayscale to check for color dependency

### Screen Reader Testing

- Test with screen readers like NVDA, JAWS, or VoiceOver
- Verify that all non-text content has appropriate alternatives
- Check that reading order of content is logical and meaningful

### Technical Tools

- WAVE (Web Accessibility Evaluation Tool)
- axe DevTools
- Lighthouse Accessibility Audit
- Color Contrast Analyzers

## Common Perceivability Issues and Fixes

### Issue 1: Missing Alternative Text

❌ Problem:
\`\`\`html
<img src="chart.png">
\`\`\`

✅ Solution:
\`\`\`html
<img src="chart.png" alt="Bar chart showing quarterly sales from Q1-Q4 2023, with Q4 showing 25% growth">
\`\`\`

### Issue 2: Poor Color Contrast

❌ Problem:
\`\`\`css
.button {
  color: #8a8a8a; /* Light gray text */
  background-color: #f5f5f5; /* Light gray background */
}
\`\`\`

✅ Solution:
\`\`\`css
.button {
  color: #4a4a4a; /* Darker gray text for better contrast */
  background-color: #f5f5f5;
}
\`\`\`

### Issue 3: Content Lost When Zoomed

❌ Problem:
\`\`\`html
<div style="width: 500px; overflow: hidden;">
  <p>Content that will be cut off when zoomed</p>
</div>
\`\`\`

✅ Solution:
\`\`\`html
<div style="max-width: 100%; overflow-wrap: break-word;">
  <p>Content that will reflow when zoomed</p>
</div>
\`\`\`

### Issue 4: Relying Solely on Color

❌ Problem:
\`\`\`html
<p style="color: red;">This field has an error</p>
\`\`\`

✅ Solution:
\`\`\`html
<p>
  <span aria-hidden="true">⚠️</span>
  <span style="color: red;">This field has an error</span>
</p>
\`\`\`

## Conclusion

Implementing the Perceivable principle ensures that all users, regardless of their sensory abilities, can access your content. By providing alternatives to non-text content, proper contrast, and adaptable layouts, you make your web content perceivable to a wider audience.

Remember that perceivability is just the first step in accessibility—users must also be able to operate your interface, understand your content, and access it with a variety of technologies. Together, the four WCAG principles create a comprehensive approach to web accessibility.

## Additional Resources

- [WCAG 2.1 Perceivable Guidelines](https://www.w3.org/WAI/WCAG21/Understanding/perceivable)
- [WebAIM: Alternative Text](https://webaim.org/techniques/alttext/)
- [Contrast Checker Tool](https://contrastchecker.com/)
- [WCAG 2.1 Understanding Success Criterion 1.4.3: Contrast (Minimum)](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html)
`,
  category: 'wcag-resources',
  tags: ['WCAG', 'Accessibility', 'Perceivable', 'Text Alternatives', 'Contrast', 'Media'],
  author: {
    name: 'Dr. Sarah Chen',
    avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    role: 'Accessibility Researcher'
  },
  publishedAt: '2023-12-15T09:00:00Z',
  readingTime: '12 min read',
  vectorImage: 'https://images.unsplash.com/photo-1577563908411-5077b6dc7624?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
  isResource: true,
  wcagReference: 'https://www.w3.org/WAI/WCAG21/Understanding/perceivable',
  tableOfContents: [
    { id: 'understanding-the-perceivable-principle', title: 'Understanding the Perceivable Principle', level: 2 },
    { id: 'guideline-1-1-text-alternatives', title: 'Guideline 1.1: Text Alternatives', level: 2 },
    { id: 'success-criterion-1-1-1-non-text-content-level-a', title: 'Success Criterion 1.1.1: Non-text Content', level: 3 },
    { id: 'guideline-1-2-time-based-media', title: 'Guideline 1.2: Time-based Media', level: 2 },
    { id: 'guideline-1-3-adaptable', title: 'Guideline 1.3: Adaptable', level: 2 },
    { id: 'guideline-1-4-distinguishable', title: 'Guideline 1.4: Distinguishable', level: 2 },
    { id: 'testing-for-perceivability', title: 'Testing for Perceivability', level: 2 },
    { id: 'common-perceivability-issues-and-fixes', title: 'Common Perceivability Issues and Fixes', level: 2 },
    { id: 'conclusion', title: 'Conclusion', level: 2 },
    { id: 'additional-resources', title: 'Additional Resources', level: 2 }
  ]
};