import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';
import { useCallback } from 'react';
import { toast } from 'react-hot-toast';

export function useAPIKeys() {
  const { 
    data, 
    isLoading, 
    error,
    refetch
  } = useQuery({
    queryKey: ['api-keys'],
    queryFn: api.listAPIKeys,
    retry: 2,
    staleTime: 1000 * 60 * 5,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000)
  });

  const refresh = useCallback(async () => {
    try {
      await refetch();
      toast.success('API keys refreshed');
    } catch (error) {
      toast.error('Failed to refresh API keys');
    }
  }, [refetch]);

  const getUsageStats = useCallback(async (keyId: string) => {
    try {
      const stats = await api.getAPIUsageStats(keyId);
      return stats;
    } catch (error) {
      toast.error('Failed to load API usage stats');
      return null;
    }
  }, []);

  return {
    apiKeys: data,
    isLoading,
    error,
    getUsageStats,
    refresh
  };
}

export { useAPIKeys as useAPI };