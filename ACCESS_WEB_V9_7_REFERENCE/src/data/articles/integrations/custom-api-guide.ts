import type { Article } from '../../../types/blog';

export const customApiGuide: Article = {
  id: 'custom-api-guide',
  slug: 'custom-api-integration-guide',
  title: 'Custom API Integration Guide: Complete Implementation Tutorial',
  description: 'Comprehensive guide to implementing accessibility testing in your applications using our REST API.',
  content: `
# Custom API Integration Guide: Complete Implementation Tutorial

[Rest of content remains unchanged...]
`,
  category: 'best-practices',
  tags: ['API', 'Integration', 'Implementation', 'Guide', 'REST'],
  author: {
    name: 'Dr. Sarah Williams',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    role: 'Accessibility Expert'
  },
  publishedAt: '2024-03-19T23:00:00Z',
  readingTime: '15 min read',
  vectorImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
  tableOfContents: [
    { id: 'quick-start', title: 'Quick Start', level: 2 },
    { id: 'api-setup', title: 'API Setup', level: 2 },
    { id: 'core-features', title: 'Core Features', level: 2 },
    { id: 'advanced-features', title: 'Advanced Features', level: 2 },
    { id: 'webhook-integration', title: 'Webhook Integration', level: 2 },
    { id: 'error-handling', title: 'Error Handling', level: 2 },
    { id: 'best-practices', title: 'Best Practices', level: 2 },
    { id: 'support-resources', title: 'Support Resources', level: 2 }
  ]
};