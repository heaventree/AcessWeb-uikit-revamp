import { useState, useEffect } from 'react';
import { mockDataService } from '../services/mockData';
import type { HelpCategory } from '../types/help';
import { toast } from 'react-hot-toast';

export function useHelpCategories() {
  const [categories, setCategories] = useState<HelpCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const categories = await mockDataService.getCategories();
        setCategories(categories);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to load categories';
        setError(message);
        toast.error(message);
      } finally {
        setLoading(false);
      }
    }

    fetchCategories();
  }, []);

  return {
    categories,
    loading,
    error
  };
}