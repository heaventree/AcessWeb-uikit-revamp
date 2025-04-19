import { useState, useEffect } from 'react';
import { mockDataService } from '../services/mockData';
import type { HelpArticle } from '../types/help';
import { toast } from 'react-hot-toast';

export function useHelpArticle(slug: string) {
  const [article, setArticle] = useState<HelpArticle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchArticle() {
      try {
        const article = await mockDataService.getArticleBySlug(slug);
        setArticle(article);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to load article';
        setError(message);
        toast.error(message);
      } finally {
        setLoading(false);
      }
    }

    if (slug) {
      fetchArticle();
    }
  }, [slug]);

  const voteHelpful = async (helpful: boolean) => {
    if (!article) return;

    try {
      await mockDataService.voteHelpful(slug, helpful);
      
      setArticle(prev => prev ? {
        ...prev,
        helpfulVotes: helpful ? prev.helpfulVotes + 1 : prev.helpfulVotes,
        unhelpfulVotes: !helpful ? prev.unhelpfulVotes + 1 : prev.unhelpfulVotes
      } : null);

      toast.success('Thank you for your feedback!');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to submit vote';
      toast.error(message);
    }
  };

  return {
    article,
    loading,
    error,
    voteHelpful
  };
}