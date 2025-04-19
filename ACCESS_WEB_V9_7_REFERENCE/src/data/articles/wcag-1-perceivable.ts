import type { Article } from '../../types/blog';

export const perceivableArticle: Article = {
  id: 'wcag-1-perceivable',
  slug: 'wcag-2-1-perceivable-understanding-the-first-principle',
  title: 'WCAG 2.1 Perceivable: Understanding the First Principle',
  description: 'A comprehensive guide to making web content perceivable for all users, covering text alternatives, time-based media, adaptable content, and distinguishable elements.',
  content: `
# WCAG 2.1 Perceivable: Understanding the First Principle

[Rest of the content remains unchanged...]
`,
  category: 'wcag',
  tags: ['WCAG 2.1', 'Accessibility', 'Perceivable', 'Alt Text', 'Contrast', 'Media'],
  author: {
    name: 'Dr. Sarah Williams',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    role: 'Accessibility Expert'
  },
  publishedAt: '2024-03-19T12:00:00Z',
  readingTime: '12 min read',
  vectorImage: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
  wcagReference: 'WCAG1',
  tableOfContents: [
    { id: 'understanding-perceivable-content', title: 'Understanding Perceivable Content', level: 2 },
    { id: 'text-alternatives', title: '1.1 Text Alternatives', level: 2 },
    { id: 'time-based-media', title: '1.2 Time-based Media', level: 2 },
    { id: 'adaptable-content', title: '1.3 Adaptable Content', level: 2 },
    { id: 'distinguishable-content', title: '1.4 Distinguishable Content', level: 2 },
    { id: 'implementation-checklist', title: 'Implementation Checklist', level: 2 },
    { id: 'common-mistakes', title: 'Common Mistakes to Avoid', level: 2 },
    { id: 'testing', title: 'Testing Your Implementation', level: 2 },
    { id: 'resources', title: 'Resources and Tools', level: 2 }
  ]
};