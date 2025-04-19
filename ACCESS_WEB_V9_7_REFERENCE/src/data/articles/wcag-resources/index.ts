import { wcagResource1 } from './wcag-resource-1';
import { wcagResource2 } from './wcag-resource-2';
import { wcagResource3 } from './wcag-resource-3';
import { wcagResource4 } from './wcag-resource-4';
import { wcagResource5 } from './wcag-resource-5';
import { wcagResource6 } from './wcag-resource-6';
import { wcagResource7 } from './wcag-resource-7';
import { wcagResource8 } from './wcag-resource-8';
import { wcagResource9 } from './wcag-resource-9';
import { wcagResource10 } from './wcag-resource-10';
import { wcagResource11 } from './wcag-resource-11';
import { wcagResource12 } from './wcag-resource-12';
import { wcagResource13 } from './wcag-resource-13';
import { wcagResource14 } from './wcag-resource-14';
import { wcagResource15 } from './wcag-resource-15';
import { wcagResource16 } from './wcag-resource-16';
import { wcagResource17 } from './wcag-resource-17';
import { wcagResource18 } from './wcag-resource-18';
import { wcagResource19 } from './wcag-resource-19';
import { wcagResource20 } from './wcag-resource-20';
import { wcagResource21 } from './wcag-resource-21';
import { wcagResource22 } from './wcag-resource-22';
import { wcagResource23 } from './wcag-resource-23';
import { wcagResource24 } from './wcag-resource-24';
import { wcagResource25 } from './wcag-resource-25';
import { wcagResource26 } from './wcag-resource-26';
import { wcagResource27 } from './wcag-resource-27';
import { wcagResource28 } from './wcag-resource-28';
import { wcagResource29 } from './wcag-resource-29';
import { wcagResource30 } from './wcag-resource-30';
import { wcagResource31 } from './wcag-resource-31';
import { wcagResource32 } from './wcag-resource-32';
import { wcagResource33 } from './wcag-resource-33';
import { wcagResource34 } from './wcag-resource-34';
import { wcagResource35 } from './wcag-resource-35';
import { wcagResource36 } from './wcag-resource-36';
import { wcagResource37 } from './wcag-resource-37';
import { wcagResource38 } from './wcag-resource-38';
import { wcagResource39 } from './wcag-resource-39';
import { wcagResource40 } from './wcag-resource-40';
import { wcagResource41 } from './wcag-resource-41';
import { wcagResource42 } from './wcag-resource-42';
import { wcagResource43 } from './wcag-resource-43';
import { wcagResource44 } from './wcag-resource-44';
import { wcagResource45 } from './wcag-resource-45';
import { wcagResource46 } from './wcag-resource-46';
import { wcagResource47 } from './wcag-resource-47';
import { wcagResource48 } from './wcag-resource-48';
import { wcagResource49 } from './wcag-resource-49';
import { wcagResource50 } from './wcag-resource-50';
import type { Article } from '../../../types/blog';

// Export all WCAG resource articles as an array
export const wcagResourceArticles: Article[] = [
  wcagResource1,
  wcagResource2,
  wcagResource3,
  wcagResource4,
  wcagResource5,
  wcagResource6,
  wcagResource7,
  wcagResource8,
  wcagResource9,
  wcagResource10,
  wcagResource11,
  wcagResource12,
  wcagResource13,
  wcagResource14,
  wcagResource15,
  wcagResource16,
  wcagResource17,
  wcagResource18,
  wcagResource19,
  wcagResource20,
  wcagResource21,
  wcagResource22,
  wcagResource23,
  wcagResource24,
  wcagResource25,
  wcagResource26,
  wcagResource27,
  wcagResource28,
  wcagResource29,
  wcagResource30,
  wcagResource31,
  wcagResource32,
  wcagResource33,
  wcagResource34,
  wcagResource35,
  wcagResource36,
  wcagResource37,
  wcagResource38,
  wcagResource39,
  wcagResource40,
  wcagResource41,
  wcagResource42,
  wcagResource43,
  wcagResource44,
  wcagResource45,
  wcagResource46,
  wcagResource47,
  wcagResource48,
  wcagResource49,
  wcagResource50
];

// Group articles by WCAG principles for organization
export const perceivableArticles = wcagResourceArticles.filter(article => 
  article.tags.includes('Perceivable') || 
  article.title.includes('Perceivable') || 
  article.content.includes('Perceivable principle')
);

export const operableArticles = wcagResourceArticles.filter(article => 
  article.tags.includes('Operable') || 
  article.title.includes('Operable') || 
  article.content.includes('Operable principle')
);

export const understandableArticles = wcagResourceArticles.filter(article => 
  article.tags.includes('Understandable') || 
  article.title.includes('Understandable') || 
  article.content.includes('Understandable principle')
);

export const robustArticles = wcagResourceArticles.filter(article => 
  article.tags.includes('Robust') || 
  article.title.includes('Robust') || 
  article.content.includes('Robust principle')
);

// Export featured WCAG resource articles from various categories
export const featuredWcagResourceArticles: Article[] = [
  wcagResource1,  // Introduction to Web Accessibility
  wcagResource2,  // WCAG Principles and Guidelines
  wcagResource7,  // Keyboard Accessibility
  wcagResource12, // Designing for Color Blindness
  wcagResource28, // ARIA Landmarks and Document Structure
  wcagResource42  // WCAG 2.2 Updates: What's New
];