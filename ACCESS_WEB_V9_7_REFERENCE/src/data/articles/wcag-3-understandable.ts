import type { Article } from '../../types/blog';

export const understandableArticle: Article = {
  id: 'wcag-3-understandable',
  slug: 'wcag-2-1-understandable-understanding-the-third-principle',
  title: 'WCAG 2.1 Understandable: Understanding the Third Principle',
  description: 'A comprehensive guide to making web content and operation understandable for all users, covering readability, predictability, and input assistance.',
  content: `
# WCAG 2.1 Understandable: Understanding the Third Principle

Information and the operation of user interface must be understandable. Users must be able to comprehend both the information presented and how to use the interface.

## Understanding Understandable Content

The Understandable principle ensures that users can comprehend the information on your website as well as understand how to interact with it. This principle focuses on making content readable and predictable while helping users avoid and correct mistakes.

### Why Understandability Matters

Consider these facts:

* 15-20% of people worldwide have some form of language or learning difference
* Many users are accessing content in their non-native language
* Cognitive load affects all users, especially under stress or fatigue
* Clear instructions and error prevention benefit everyone

## 3.1 Readable

### Making Content Readable

Content must be readable and understandable to users:

\`\`\`html
<!-- Good Example - Language Declaration -->
<html lang="en">
  <head>
    <title>Clear and Readable Content</title>
  </head>
  <body>
    <main>
      <p>Clear, simple content in English.</p>
      <p lang="es">Contenido en español.</p>
    </main>
  </body>
</html>
\`\`\`

### Writing Clear Content

* Use plain language
* Define unusual words
* Explain abbreviations
* Provide supplementary content

\`\`\`html
<!-- Good Example - Abbreviation -->
<p>
  The <abbr title="World Health Organization">WHO</abbr> 
  provides global health guidance.
</p>

<!-- Good Example - Definition -->
<p>
  <dfn>Accessibility</dfn> is the practice of making 
  websites usable by as many people as possible.
</p>
\`\`\`

## 3.2 Predictable

### Creating Predictable Interfaces

Operation and navigation must be predictable:

* Consistent navigation
* Consistent identification
* No unexpected changes
* Clear user control

\`\`\`html
<!-- Good Example - Consistent Navigation -->
<nav aria-label="Main">
  <ul>
    <li><a href="/">Home</a></li>
    <li><a href="/products">Products</a></li>
    <li><a href="/contact">Contact</a></li>
  </ul>
</nav>

<!-- Good Example - Change on Input -->
<form>
  <label>
    Select Language:
    <select onchange="this.form.submit()">
      <option value="en">English</option>
      <option value="es">Español</option>
    </select>
  </label>
  <p class="hint">
    Changing language will submit the form
  </p>
</form>
\`\`\`

## 3.3 Input Assistance

### Helping Users Avoid Mistakes

Help users avoid and correct mistakes:

* Error identification
* Labels and instructions
* Error prevention
* Help and documentation

\`\`\`html
<!-- Good Example - Form with Error Prevention -->
<form onsubmit="return validateForm()">
  <div class="form-group">
    <label for="email">Email Address:</label>
    <input
      type="email"
      id="email"
      name="email"
      required
      aria-describedby="email-hint"
    >
    <p id="email-hint" class="hint">
      Format: name@example.com
    </p>
  </div>

  <div class="form-group">
    <label for="password">Password:</label>
    <input
      type="password"
      id="password"
      name="password"
      required
      pattern="^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{8,}$"
      aria-describedby="password-requirements"
    >
    <ul id="password-requirements" class="requirements">
      <li>At least 8 characters</li>
      <li>Contains letters and numbers</li>
    </ul>
  </div>

  <div class="form-group">
    <button type="submit">Submit</button>
    <button type="button" onclick="previewData()">
      Preview
    </button>
  </div>
</form>
\`\`\`

\`\`\`css
/* Styling for Form Elements */
.form-group {
  margin-bottom: 1.5rem;
}

.hint {
  font-size: 0.875rem;
  color: #666;
  margin-top: 0.25rem;
}

.requirements {
  font-size: 0.875rem;
  color: #666;
  margin-top: 0.5rem;
  padding-left: 1.5rem;
}

.error {
  color: #dc2626;
  border-color: #dc2626;
}

.error-message {
  color: #dc2626;
  font-size: 0.875rem;
  margin-top: 0.25rem;
}
\`\`\`

## Implementation Checklist

* Declare language of content
* Provide clear navigation
* Use consistent identification
* Help users avoid mistakes
* Provide clear instructions
* Implement error prevention
* Offer context-sensitive help
* Support error recovery

## Common Mistakes to Avoid

* Missing language declarations
* Inconsistent navigation
* Unexpected changes
* Poor error messages
* Lack of instructions
* Complex language
* Undefined abbreviations
* Missing form labels

## Testing Your Implementation

1. Language declaration check
2. Readability assessment
3. Navigation consistency review
4. Form validation testing
5. Error message verification
6. Help content review
7. Abbreviation check
8. Context changes validation

## Resources and Tools

* [Plain Language Guidelines](https://www.plainlanguage.gov/guidelines/)
* [WCAG Understanding SC 3.1.1](https://www.w3.org/WAI/WCAG21/Understanding/language-of-page)
* [Form Design Guidelines](https://www.w3.org/WAI/tutorials/forms/)
* [Error Prevention Techniques](https://www.w3.org/WAI/WCAG21/Techniques/general/G164)

## Conclusion

The Understandable principle ensures that users can comprehend both your content and how to interact with your website. By implementing these guidelines, you create experiences that are clear, predictable, and helpful.

Remember: If users cannot understand your content or interface, they cannot use your website effectively. Making your content understandable is essential for creating inclusive web experiences.
`,
  category: 'wcag',
  tags: ['WCAG 2.1', 'Accessibility', 'Understandable', 'Readability', 'Forms', 'Error Prevention'],
  author: {
    name: 'Dr. Sarah Williams',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    role: 'Accessibility Expert'
  },
  publishedAt: '2024-03-19T14:00:00Z',
  readingTime: '14 min read',
  vectorImage: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
  wcagReference: 'WCAG3',
  tableOfContents: [
    { id: 'understanding-understandable-content', title: 'Understanding Understandable Content', level: 2 },
    { id: 'readable', title: '3.1 Readable', level: 2 },
    { id: 'predictable', title: '3.2 Predictable', level: 2 },
    { id: 'input-assistance', title: '3.3 Input Assistance', level: 2 },
    { id: 'implementation-checklist', title: 'Implementation Checklist', level: 2 },
    { id: 'common-mistakes', title: 'Common Mistakes to Avoid', level: 2 },
    { id: 'testing', title: 'Testing Your Implementation', level: 2 },
    { id: 'resources', title: 'Resources and Tools', level: 2 }
  ]
};