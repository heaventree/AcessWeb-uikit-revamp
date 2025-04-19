export interface HelpArticle {
  id: string;
  slug: string;
  title: string;
  content: string;
  category: string;
  authorId: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
  views: number;
  helpfulVotes: number;
  unhelpfulVotes: number;
}

export interface HelpCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  articles: {
    id: string;
    title: string;
    slug: string;
  }[];
}