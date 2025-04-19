import { useState, useEffect } from 'react';

interface DashboardStats {
  totalScans: number;
  issuesFixed: number;
  criticalIssues: number;
  complianceScore: number;
  lastScanDate?: string;
  scanHistory: {
    date: string;
    issues: number;
  }[];
}

export function useDashboardStats() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await fetch(
          `${accesswebAdmin.ajaxUrl}?action=accessweb_get_stats&nonce=${accesswebAdmin.nonce}`
        );
        
        if (!response.ok) {
          throw new Error('Failed to fetch stats');
        }

        const data = await response.json();
        if (data.success) {
          setStats(data.data);
        } else {
          throw new Error(data.message || 'Failed to fetch stats');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  return { stats, loading, error };
}