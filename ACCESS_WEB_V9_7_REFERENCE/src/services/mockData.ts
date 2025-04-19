// Mock data service to use when database is unavailable
import type { HelpArticle, HelpCategory } from '../types/help';
import { articles } from '../data/articles';

const mockCategories: HelpCategory[] = [
  {
    id: '1',
    name: 'WCAG Standards',
    description: 'Understanding WCAG 2.1 and 2.2 principles and requirements',
    icon: 'Book',
    articles: [
      { id: '1', title: 'WCAG 2.1 Guide', slug: 'complete-guide-wcag-2-1-accessibility-standards' },
      { id: '2', title: 'Perceivable Principle', slug: 'wcag-2-1-perceivable-understanding-the-first-principle' },
      { id: '3', title: 'Operable Principle', slug: 'wcag-2-1-operable-understanding-the-second-principle' },
      { id: '4', title: 'Understandable Principle', slug: 'wcag-2-1-understandable-understanding-the-third-principle' },
      { id: '5', title: 'Robust Principle', slug: 'wcag-2-1-robust-understanding-the-fourth-principle' },
      { id: '6', title: 'WCAG 2.2 New Success Criteria', slug: 'wcag-2-2-new-success-criteria-explained' }
    ]
  },
  {
    id: '2', 
    name: 'Best Practices',
    description: 'Implementation guides and technical best practices',
    icon: 'FileText',
    articles: [
      { id: '7', title: 'Implementation Guide', slug: 'web-accessibility-implementation-best-practices' },
      { id: '8', title: 'WCAG Best Practices', slug: 'wcag-2-1-best-practices-and-patterns' },
      { id: '9', title: 'ADA Best Practices', slug: 'ada-compliance-best-practices-implementation' },
      { id: '10', title: 'EAA Best Practices', slug: 'european-accessibility-act-best-practices-implementation' },
      { id: '11', title: 'Section 508 Best Practices', slug: 'section-508-compliance-best-practices-implementation' }
    ]
  },
  {
    id: '3',
    name: 'Accessibility Standards',
    description: 'Comprehensive guides to accessibility regulations',
    icon: 'Shield',
    articles: [
      { id: '12', title: 'ADA Compliance Guide', slug: 'ada-compliance-digital-accessibility-requirements' },
      { id: '13', title: 'EAA Guide', slug: 'european-accessibility-act-complete-guide' },
      { id: '14', title: 'Section 508 Guide', slug: 'section-508-compliance-complete-guide' }
    ]
  },
  {
    id: '4',
    name: 'Tool Guides',
    description: 'How to use the accessibility testing tools',
    icon: 'Settings',
    articles: [
      { id: '15', title: 'WCAG Checker Guide', slug: 'wcag-checker-complete-guide' },
      { id: '16', title: 'HTML Structure Analysis', slug: 'html-structure-analysis-guide' },
      { id: '17', title: 'URL Design Analysis', slug: 'url-design-analysis-guide' },
      { id: '18', title: 'Responsive Design Tests', slug: 'responsive-design-analysis-guide' },
      { id: '19', title: 'Media Accessibility Testing', slug: 'media-accessibility-testing-guide' },
      { id: '20', title: 'Export Reports as PDF', slug: 'export-accessibility-reports-guide' },
      { id: '21', title: 'Color Palette Generator', slug: 'color-palette-generator-guide' }
    ]
  },
  {
    id: '5',
    name: 'Advanced Features',
    description: 'Guides for advanced accessibility features',
    icon: 'Code',
    articles: [
      { id: '22', title: 'AI Recommendations', slug: 'ai-recommendations-guide' },
      { id: '23', title: 'Section Identifier System', slug: 'section-identifier-system-guide' },
      { id: '24', title: 'Feedback System', slug: 'accessibility-feedback-system-guide' },
      { id: '25', title: 'Pro Features Overview', slug: 'pro-features-overview-guide' }
    ]
  },
  {
    id: '6',
    name: 'Content Creation',
    description: 'Creating accessible content for the web',
    icon: 'FileText',
    articles: [
      { id: '26', title: 'Alt Text Guide', slug: 'alt-text-best-practices-guide' },
      { id: '27', title: 'Captions and Transcripts', slug: 'captions-transcripts-accessibility-guide' },
      { id: '28', title: 'Accessible PDFs', slug: 'accessible-pdf-document-guide' },
      { id: '29', title: 'Accessible Videos', slug: 'accessible-video-content-guide' }
    ]
  }
];

// Convert blog articles to help articles
const mockArticles: HelpArticle[] = articles.map((article, index) => ({
  id: (index + 1).toString(),
  slug: article.slug,
  title: article.title,
  content: article.content,
  category: article.category === 'wcag' ? 'WCAG Standards' :
           article.category === 'best-practices' ? 'Best Practices' :
           'Accessibility Standards',
  authorId: '1',
  published: true,
  createdAt: article.publishedAt,
  updatedAt: article.publishedAt,
  views: Math.floor(Math.random() * 500),
  helpfulVotes: Math.floor(Math.random() * 50),
  unhelpfulVotes: Math.floor(Math.random() * 10)
}));

export const mockDataService = {
  getCategories: async () => mockCategories,
  getArticles: async () => mockArticles,
  getArticleBySlug: async (slug: string) => 
    mockArticles.find(article => article.slug === slug) || null,
  voteHelpful: async (slug: string, helpful: boolean) => {
    const article = mockArticles.find(a => a.slug === slug);
    if (article) {
      if (helpful) {
        article.helpfulVotes++;
      } else {
        article.unhelpfulVotes++;
      }
    }
    return true;
  }
};