import { useState } from 'react';
import { generateArticle, generateArticleSeries, type ArticleRequest } from '../services/chatgptService';
import type { Article } from '../types/blog';
import { toast } from 'react-hot-toast';

export function useArticleGeneration() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateSingleArticle = async (request: ArticleRequest): Promise<Partial<Article> | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const article = await generateArticle(request);
      toast.success('Article generated successfully');
      return article;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to generate article';
      setError(message);
      toast.error(message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const generateSeries = async (topic: string, count: number = 3): Promise<Partial<Article>[] | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const articles = await generateArticleSeries(topic, count);
      toast.success(`Generated ${articles.length} articles successfully`);
      return articles;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to generate article series';
      setError(message);
      toast.error(message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    generateSingleArticle,
    generateSeries,
    loading,
    error
  };
}