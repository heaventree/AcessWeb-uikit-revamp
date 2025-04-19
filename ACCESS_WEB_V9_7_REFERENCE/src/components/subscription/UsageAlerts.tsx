import React, { useState, useEffect } from 'react';
import { Bell, AlertTriangle, CheckCircle, X } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface UsageAlert {
  id: string;
  feature_key: string;
  message: string;
  type: 'warning' | 'critical';
  acknowledged: boolean;
  created_at: string;
}

// Mock data for development
const mockAlerts: UsageAlert[] = [
  {
    id: '1',
    feature_key: 'Scan Limit',
    message: 'You have used 85% of your monthly scans (85/100)',
    type: 'warning',
    acknowledged: false,
    created_at: new Date(Date.now() - 86400000).toISOString() // 1 day ago
  },
  {
    id: '2',
    feature_key: 'API Calls',
    message: 'You have exceeded your API call limit (1050/1000)',
    type: 'critical',
    acknowledged: false,
    created_at: new Date(Date.now() - 43200000).toISOString() // 12 hours ago
  },
  {
    id: '3',
    feature_key: 'Storage',
    message: 'You have used 60% of your storage limit (600MB/1GB)',
    type: 'warning',
    acknowledged: true,
    created_at: new Date(Date.now() - 172800000).toISOString() // 2 days ago
  }
];

export function UsageAlerts() {
  const [alerts, setAlerts] = useState<UsageAlert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => {
      setAlerts(mockAlerts);
      setLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);

  const acknowledgeAlert = (alertId: string) => {
    setAlerts(prev => 
      prev.map(alert => 
        alert.id === alertId ? { ...alert, acknowledged: true } : alert
      )
    );
    toast.success('Alert acknowledged');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Bell className="w-6 h-6 text-blue-600" />
            <h2 className="ml-3 text-lg font-medium text-gray-900">
              Usage Alerts
            </h2>
          </div>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
            {alerts.filter(a => !a.acknowledged).length} unacknowledged
          </span>
        </div>
      </div>

      <div className="divide-y divide-gray-200">
        {alerts.length === 0 ? (
          <div className="p-6 text-center">
            <CheckCircle className="mx-auto h-12 w-12 text-green-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No alerts</h3>
            <p className="mt-1 text-sm text-gray-500">
              You're within your usage limits
            </p>
          </div>
        ) : (
          alerts.map(alert => (
            <div key={alert.id} className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  {alert.type === 'critical' ? (
                    <AlertTriangle className="w-5 h-5 text-red-500" />
                  ) : (
                    <Bell className="w-5 h-5 text-yellow-500" />
                  )}
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">
                      {alert.feature_key}
                    </p>
                    <p className="text-sm text-gray-500">
                      {alert.message}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(alert.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>
                {!alert.acknowledged && (
                  <button
                    onClick={() => acknowledgeAlert(alert.id)}
                    className="ml-4 text-gray-400 hover:text-gray-500"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}