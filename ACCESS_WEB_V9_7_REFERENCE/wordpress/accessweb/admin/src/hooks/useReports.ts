import { useState, useEffect } from 'react';

interface Report {
  id: string;
  url: string;
  scanDate: string;
  status: 'completed' | 'in_progress' | 'failed';
  issues: {
    critical: number;
    serious: number;
    moderate: number;
    minor: number;
  };
}

export function useReports() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReports = async () => {
    try {
      const response = await fetch(
        `${accesswebAdmin.ajaxUrl}?action=accessweb_get_reports&nonce=${accesswebAdmin.nonce}`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch reports');
      }

      const data = await response.json();
      if (data.success) {
        setReports(data.data);
      } else {
        throw new Error(data.message || 'Failed to fetch reports');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const refreshReports = () => {
    setLoading(true);
    fetchReports();
  };

  return { reports, loading, error, refreshReports };
}