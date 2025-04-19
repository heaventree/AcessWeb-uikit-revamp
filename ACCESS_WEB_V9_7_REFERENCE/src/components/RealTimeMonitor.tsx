import React, { useState, useEffect } from 'react';
import { storageService } from '../lib/storage';
import { Activity, AlertTriangle, CheckCircle, Bell, Settings } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface RealtimeMonitor {
  id: string;
  url: string;
  interval: number;
  enabled: boolean;
  last_check: string | null;
  notification_threshold: number;
  failure_count: number;
}

interface RealtimeAlert {
  id: string;
  monitor_id: string;
  type: 'error' | 'warning' | 'info';
  message: string;
  data: any;
  created_at: string;
  acknowledged_at: string | null;
}

export function RealTimeMonitor() {
  const [monitors, setMonitors] = useState<RealtimeMonitor[]>([]);
  const [alerts, setAlerts] = useState<RealtimeAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMonitor, setSelectedMonitor] = useState<string | null>(null);

  useEffect(() => {
    loadData();
    setupRealtimeSubscription();
  }, []);

  const loadData = async () => {
    try {
      // Load monitors
      const monitorsData = await storageService.getItem<RealtimeMonitor[]>('realtime_monitors') || [];
      setMonitors(monitorsData);

      // Load recent alerts
      const alertsData = await storageService.getItem<RealtimeAlert[]>('realtime_alerts') || [];
      setAlerts(alertsData);
    } catch (error) {
      toast.error('Failed to load monitoring data');
    } finally {
      setLoading(false);
    }
  };

  const setupRealtimeSubscription = () => {
    // Set up polling for updates
    const pollInterval = setInterval(loadData, 5000);
    return () => clearInterval(pollInterval);
  };

  const toggleMonitor = async (monitorId: string, enabled: boolean) => {
    try {
      const updatedMonitors = monitors.map(m => 
        m.id === monitorId ? { ...m, enabled } : m
      );
      await storageService.setItem('realtime_monitors', updatedMonitors);
      setMonitors(updatedMonitors);

      toast.success(`Monitor ${enabled ? 'enabled' : 'disabled'}`);
    } catch (error) {
      toast.error('Failed to update monitor status');
    }
  };

  const acknowledgeAlert = async (alertId: string) => {
    try {
      const updatedAlerts = alerts.map(a => 
        a.id === alertId ? { ...a, acknowledged_at: new Date().toISOString() } : a
      );
      await storageService.setItem('realtime_alerts', updatedAlerts);
      setAlerts(updatedAlerts);
    } catch (error) {
      toast.error('Failed to acknowledge alert');
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'error':
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      default:
        return <CheckCircle className="w-5 h-5 text-green-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Monitors List */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">Active Monitors</h3>
            <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">
              <Activity className="w-4 h-4 mr-2" />
              Add Monitor
            </button>
          </div>
        </div>

        <div className="divide-y divide-gray-200">
          {monitors.map(monitor => (
            <div key={monitor.id} className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">{monitor.url}</h4>
                  <p className="mt-1 text-sm text-gray-500">
                    Checks every {monitor.interval} seconds
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    monitor.failure_count > 0
                      ? 'bg-red-100 text-red-800'
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {monitor.failure_count > 0 ? `${monitor.failure_count} failures` : 'Healthy'}
                  </span>
                  <button
                    onClick={() => toggleMonitor(monitor.id, !monitor.enabled)}
                    className={`relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                      monitor.enabled ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                  >
                    <span className="sr-only">
                      {monitor.enabled ? 'Disable monitor' : 'Enable monitor'}
                    </span>
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200 ${
                        monitor.enabled ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Alerts */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">Recent Alerts</h3>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
              <Bell className="w-4 h-4 mr-1" />
              {alerts.filter(a => !a.acknowledged_at).length} unacknowledged
            </span>
          </div>
        </div>

        <div className="divide-y divide-gray-200">
          {alerts.map(alert => (
            <div key={alert.id} className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  {getAlertIcon(alert.type)}
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">{alert.message}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(alert.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>
                {!alert.acknowledged_at && (
                  <button
                    onClick={() => acknowledgeAlert(alert.id)}
                    className="text-sm text-blue-600 hover:text-blue-700"
                  >
                    Acknowledge
                  </button>
                )}
              </div>
              {alert.data && Object.keys(alert.data).length > 0 && (
                <div className="mt-2">
                  <pre className="text-xs bg-gray-50 p-2 rounded-md overflow-x-auto">
                    {JSON.stringify(alert.data, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}