import type { Article } from '../../../types/blog';

export const wcagResource19: Article = {
  "id": "wcag-resource-19",
  "slug": "wcag-resource-accessible-e-commerce-design",
  "title": "Accessible E-Commerce Design",
  "description": "Goal: Ensure users with disabilities can browse products, understand details, add items to cart, and complete the checkout process without barriers.",
  "content": "# Accessible E-Commerce Design\n\n**Goal**: Ensure users with disabilities can browse products, understand details, add items to cart, and complete the checkout process without barriers.\n\n**Key Areas**:\n*   **Product Listings & Search**:\n    *   Clear headings for categories and results.\n    *   Descriptive link text for products (not just \"Click Here\").\n    *   Accessible filtering and sorting options (keyboard operable, clear labels).\n*   **Product Pages**:\n    *   Informative image alt text describing the product visually.\n    *   Clear price presentation.\n    *   Accessible color/size/option selectors (use standard controls or ARIA widgets correctly).\n    *   Well-structured product descriptions (headings, lists).\n    *   Accessible \"Add to Cart\" buttons with clear labels.\n*   **Shopping Cart**:\n    *   Clear summary of items, prices, quantities.\n    *   Accessible controls to update quantity or remove items.\n    *   Clearly announced updates (e.g., \"Item removed from cart\") using `aria-live`.\n*   **Checkout Process**:\n    *   Break down into logical steps (Shipping, Billing, Payment, Review).\n    *   Fully accessible forms (labels, instructions, error handling - see Article 14).\n    *   Indicate current step clearly (e.g., using `aria-current=\"step\"`).\n    *   Ensure payment options are accessible (keyboard navigation, clear labels).\n    *   Provide an accessible order review step before final submission.\n*   **General**: Ensure good color contrast, keyboard navigation throughout, and compatibility with screen readers.\n\n**Business Case**: An accessible e-commerce site expands your potential customer base and reduces legal risk.",
  "category": "wcag-resources",
  "tags": [
    "WCAG",
    "Accessibility",
    "Web Standards",
    "Color Contrast",
    "Keyboard Accessibility",
    "ARIA",
    "Screen Readers"
  ],
  "author": {
    "name": "Accessibility Team",
    "avatar": "https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    "role": "WCAG Specialists"
  },
  "publishedAt": "2024-01-30T01:02:56.328Z",
  "updatedAt": "2024-07-20T16:34:11.286Z",
  "readingTime": "3 min read",
  "vectorImage": "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
  "isResource": true,
  "wcagReference": "https://www.w3.org/WAI/WCAG21/Understanding/",
  "tableOfContents": [
    {
      "id": "goal",
      "title": "Goal",
      "level": 2
    },
    {
      "id": "key-areas",
      "title": "Key Areas",
      "level": 2
    },
    {
      "id": "product-listings-search",
      "title": "Product Listings & Search",
      "level": 2
    },
    {
      "id": "product-pages",
      "title": "Product Pages",
      "level": 2
    },
    {
      "id": "shopping-cart",
      "title": "Shopping Cart",
      "level": 2
    },
    {
      "id": "checkout-process",
      "title": "Checkout Process",
      "level": 2
    },
    {
      "id": "general",
      "title": "General",
      "level": 2
    },
    {
      "id": "business-case",
      "title": "Business Case",
      "level": 2
    }
  ]

};
