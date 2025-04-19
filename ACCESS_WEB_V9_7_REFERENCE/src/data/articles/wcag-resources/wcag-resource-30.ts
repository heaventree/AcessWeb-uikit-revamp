import type { Article } from '../../../types/blog';

export const wcagResource30: Article = {
  "id": "wcag-resource-30",
  "slug": "wcag-resource-creating-accessible-svgs-",
  "title": "Creating Accessible SVGs  ",
  "description": "Benefits of SVG:  \n- Scales without quality loss\n- Looks sharp on all screens\n- Small file size\n- Animatable\n- Programmable.",
  "content": "# Creating Accessible SVGs  \n\n**Benefits of SVG**:  \n- Scales without quality loss\n- Looks sharp on all screens\n- Small file size\n- Animatable\n- Programmable\n\n**Making SVGs Accessible**:  \n- Add appropriate title and desc elements\n- Use aria-labelledby (references another element as the label) to connect title to svg\n- Ensure interactive SVGs are keyboard accessible\n- Consider using role=\"img\" or role=\"graphics-document\"\n- Test with screen readers",
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
  "publishedAt": "2023-08-04T22:22:42.769Z",
  "updatedAt": "2024-03-11T17:26:28.316Z",
  "readingTime": "3 min read",
  "vectorImage": "https://images.unsplash.com/photo-1497493292307-31c376b6e479?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
  "isResource": true,
  "wcagReference": "https://www.w3.org/WAI/WCAG21/Understanding/non-text-content",
  "tableOfContents": [
    {
      "id": "benefits-of-svg",
      "title": "Benefits of SVG",
      "level": 2
    },
    {
      "id": "making-svgs-accessible",
      "title": "Making SVGs Accessible",
      "level": 2
    }
  ]

};
