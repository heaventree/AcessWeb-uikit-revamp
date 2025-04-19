import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import localforage from 'localforage';

interface Settings {
  wordpress?: any;
  shopify?: any;
  [key: string]: any;
}

export function useSettings() {
  const queryClient = useQueryClient();

  const { data: settings = {} } = useQuery<Settings>({
    queryKey: ['settings'],
    queryFn: async () => {
      // Use localforage instead of localStorage for better reliability
      const stored = await localforage.getItem('settings');
      return stored || {};
    },
    staleTime: 0, // Always fetch fresh data
    cacheTime: 0 // Disable caching
  });

  const { mutate: updateSettings } = useMutation({
    mutationFn: async ({ key, value }: { key: string; value: any }) => {
      const current = await localforage.getItem('settings');
      const currentSettings = current || {};
      const updated = { ...currentSettings, [key]: value };
      await localforage.setItem('settings', updated);
      return updated;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['settings'], data);
      // Force immediate refetch
      queryClient.invalidateQueries({ queryKey: ['settings'] });
    }
  });

  return {
    settings,
    updateSettings: (key: string, value: any) => updateSettings({ key, value })
  };
}