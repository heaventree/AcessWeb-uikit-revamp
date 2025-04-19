interface Article {
  id: string;
  slug: string;
  title: string;
  description: string;
  content: string;
  category: 'wcag' | 'accessibility' | 'best-practices' | 'wcag-resources';
  tags: string[];
  author: {
    name: string;
    avatar: string;
    role: string;
  };
  publishedAt: string;
  updatedAt?: string; // Date when the article was last updated
  readingTime: string;
  vectorImage: string;
  relatedArticles?: string[];
  wcagReference?: string;
  isResource?: boolean; // Flag to identify educational WCAG resource articles
  tableOfContents: {
    id: string;
    title: string;
    level: number;
  }[];
}

interface ArticleCategory {
  id: string;
  name: string;
  description: string;
  slug: string;
  count: number;
}

export type { Article, ArticleCategory };