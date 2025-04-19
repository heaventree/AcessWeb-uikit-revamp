import type { Article } from '../../../types/blog';

export const wcagResource23: Article = {
  "id": "wcag-resource-23",
  "slug": "wcag-resource-accessible-charts-and-graphs",
  "title": "Accessible Charts and Graphs",
  "description": "Challenge: Visual charts and graphs present data in a way that is inherently inaccessible to users who are blind or have significant low vision. Co...",
  "content": "# Accessible Charts and Graphs\n\n**Challenge**: Visual charts and graphs present data in a way that is inherently inaccessible to users who are blind or have significant low vision. Color contrast issues can also affect users with low vision or color blindness.\n\n**Making Data Visualizations Accessible**:\n*   **Provide Text Alternatives**:\n    *   **Summary**: Include a concise text summary of the key insights or trends presented in the chart (Guideline 1.1.1 - Level A (minimum accessibility requirements)).\n    *   **Data Table**: Present the raw data in an accessible HTML table near the chart. This allows screen reader users to access the exact figures.\n*   **Use SVG or Canvas with Accessibility Features**:\n    *   **SVG (Scalable Vector Graphics)**: Preferred method. Add `<title>` and `<desc>` elements within the `<svg>` for accessible names and descriptions. Use ARIA roles (`role=\"img\"`, `aria-labelledby`, `aria-describedby`) to link text elements to the graphic. Ensure interactive elements (tooltips) are keyboard accessible.\n    *   **Canvas**: More complex. Requires using fallback content within the `<canvas>` tags and potentially using ARIA or an Accessibility Object Model (AOM) to expose information.\n*   **Color and Contrast**:\n    *   Use color palettes that are distinguishable by people with color blindness (avoid red/green combinations alone).\n    *   Ensure sufficient contrast between graphical elements (lines, bars) and the background, and within text elements (labels, legends) (Guideline 1.4.11 - Level AA for non-text contrast).\n    *   Use patterns, textures, or different shapes in addition to color to differentiate data series (Guideline 1.4.1 - Level A).\n*   **Interactivity**: Ensure any interactive features (tooltips on hover, zooming) are also available via keyboard and announced by screen readers.\n\n**Example (SVG Structure)**:\n```html\n<figure>\n  <figcaption>Figure 1: Monthly Website Visits</figcaption>\n  <svg role=\"img\" aria-labelledby=\"chart-title chart-desc\">\n    <title id=\"chart-title\">Bar chart showing monthly website visits</title>\n    <desc id=\"chart-desc\">Visits increased steadily from 1000 in January to 2500 in June.</desc>\n    <!-- SVG chart elements go here -->\n  </svg>\n  <!-- Optional: Link to data table -->\n  <p><a href=\"#data-table-1\">View data for Figure 1</a></p>\n</figure>\n```",
  "category": "wcag-resources",
  "tags": [
    "WCAG",
    "Accessibility",
    "Web Standards",
    "Color Contrast",
    "Keyboard Accessibility",
    "ARIA",
    "Screen Readers",
    "Alt Text"
  ],
  "author": {
    "name": "Accessibility Team",
    "avatar": "https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    "role": "WCAG Specialists"
  },
  "publishedAt": "2023-03-19T11:33:52.150Z",
  "updatedAt": "2025-01-25T11:23:17.083Z",
  "readingTime": "3 min read",
  "vectorImage": "https://images.unsplash.com/photo-1470790376778-a9fbc86d70e2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
  "isResource": true,
  "wcagReference": "https://www.w3.org/WAI/WCAG21/Understanding/",
  "tableOfContents": [
    {
      "id": "challenge",
      "title": "Challenge",
      "level": 2
    },
    {
      "id": "making-data-visualizations-accessible",
      "title": "Making Data Visualizations Accessible",
      "level": 2
    },
    {
      "id": "provide-text-alternatives",
      "title": "Provide Text Alternatives",
      "level": 2
    },
    {
      "id": "summary",
      "title": "Summary",
      "level": 2
    },
    {
      "id": "data-table",
      "title": "Data Table",
      "level": 2
    },
    {
      "id": "use-svg-or-canvas-with-accessibility-features",
      "title": "Use SVG or Canvas with Accessibility Features",
      "level": 2
    },
    {
      "id": "svg-scalable-vector-graphics",
      "title": "SVG (Scalable Vector Graphics)",
      "level": 2
    },
    {
      "id": "canvas",
      "title": "Canvas",
      "level": 2
    },
    {
      "id": "color-and-contrast",
      "title": "Color and Contrast",
      "level": 2
    },
    {
      "id": "interactivity",
      "title": "Interactivity",
      "level": 2
    },
    {
      "id": "example-svg-structure",
      "title": "Example (SVG Structure)",
      "level": 2
    }
  ]

};
