import { useState, useEffect } from 'react';

interface Stats {
  totalUsers: number;
  activeUsers: number;
  totalRevenue: number;
  averageRevenue: number;
  totalScans: number;
  issuesFixed: number;
  successRate: number;
  monthlyGrowth: number;
}

export function useStats(type: 'dashboard' | 'clients' | 'payments' | 'reports') {
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    activeUsers: 0,
    totalRevenue: 0,
    averageRevenue: 0,
    totalScans: 0,
    issuesFixed: 0,
    successRate: 0,
    monthlyGrowth: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        // Simulated API call with different stats based on type
        const response = await new Promise<Stats>((resolve) => {
          setTimeout(() => {
            switch (type) {
              case 'dashboard':
                resolve({
                  totalUsers: 1234,
                  activeUsers: 987,
                  totalRevenue: 85000,
                  averageRevenue: 299,
                  totalScans: 5678,
                  issuesFixed: 4321,
                  successRate: 98.5,
                  monthlyGrowth: 12
                });
                break;
              case 'clients':
                resolve({
                  totalUsers: 1234,
                  activeUsers: 987,
                  totalRevenue: 85000,
                  averageRevenue: 299,
                  totalScans: 3456,
                  issuesFixed: 2345,
                  successRate: 96.7,
                  monthlyGrowth: 8
                });
                break;
              case 'payments':
                resolve({
                  totalUsers: 1234,
                  activeUsers: 987,
                  totalRevenue: 85000,
                  averageRevenue: 299,
                  totalScans: 2345,
                  issuesFixed: 1234,
                  successRate: 98.5,
                  monthlyGrowth: 15
                });
                break;
              case 'reports':
                resolve({
                  totalUsers: 1234,
                  activeUsers: 987,
                  totalRevenue: 85000,
                  averageRevenue: 299,
                  totalScans: 4567,
                  issuesFixed: 3456,
                  successRate: 97.8,
                  monthlyGrowth: 10
                });
                break;
            }
          }, 1000);
        });
        setStats(response);
      } catch (err) {
        setError('Failed to fetch statistics');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
    
    // Set up periodic refresh
    const interval = setInterval(fetchStats, 30000); // Refresh every 30 seconds
    
    return () => clearInterval(interval);
  }, [type]);

  return { stats, loading, error };
}