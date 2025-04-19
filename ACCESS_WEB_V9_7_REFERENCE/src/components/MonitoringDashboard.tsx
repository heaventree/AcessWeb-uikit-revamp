import React, { useState, useEffect } from 'react';
import { storageService } from '../lib/storage';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';
import {
  AlertOctagon,
  Clock,
  Activity,
  Settings,
  Bell,
  RefreshCw,
  CheckCircle,
  XCircle,
  AlertTriangle
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import type { MonitoringAlert } from '../types';

interface MonitoringConfig {
  id: string;
  site_id: string;
  frequency: 'realtime' | 'hourly' | 'daily' | 'weekly';
  enabled: boolean;
  last_check: string | null;
  notification_email: string | null;
  notification_webhook: string | null;
  excluded_paths: string[];
}

export function MonitoringDashboard() {
  const [configs, setConfigs] = useState<MonitoringConfig[]>([]);
  const [alerts, setAlerts] = useState<MonitoringAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedConfig, setSelectedConfig] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // Load monitoring configs
      const configsData = await storageService.getItem<MonitoringConfig[]>('monitoring_configs') || [];
      setConfigs(configsData);

      // Load monitoring alerts
      const alertsData = await storageService.getItem<MonitoringAlert[]>('monitoring_alerts') || [];
      setAlerts(alertsData);
    } catch (error) {
      toast.error('Failed to load monitoring data');
    } finally {
      setLoading(false);
    }
  };

  const toggleMonitoring = async (configId: string, enabled: boolean) => {
    try {
      const updatedConfigs = configs.map(config => 
        config.id === configId ? { ...config, enabled } : config
      );
      await storageService.setItem('monitoring_configs', updatedConfigs);
      setConfigs(updatedConfigs);
      
      toast.success(`Monitoring ${enabled ? 'enabled' : 'disabled'}`);
    } catch (error) {
      toast.error('Failed to update monitoring status');
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'info':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      default:
        return null;
    }
  };

  // Process data for charts
  const alertsTrend = alerts.reduce((acc, alert) => {
    const date = new Date(alert.created_at).toLocaleDateString();
    if (!acc[date]) {
      acc[date] = { date, errors: 0, warnings: 0, info: 0 };
    }
    acc[date][alert.type]++;
    return acc;
  }, {} as Record<string, { date: string; errors: number; warnings: number; info: number; }>);

  const chartData = Object.values(alertsTrend);

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Activity className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Monitors</p>
              <p className="text-2xl font-semibold text-gray-900">
                {configs.filter(c => c.enabled).length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Success Rate</p>
              <p className="text-2xl font-semibold text-gray-900">
                {alerts.length ? 
                  `${((alerts.filter(a => a.type === 'info').length / alerts.length) * 100).toFixed(1)}%` 
                  : '0%'}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-3 bg-red-100 rounded-lg">
              <AlertOctagon className="w-6 h-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Issues Found</p>
              <p className="text-2xl font-semibold text-gray-900">
                {alerts.filter(a => a.type === 'error').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Clock className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Avg Response Time</p>
              <p className="text-2xl font-semibold text-gray-900">
                {alerts.length ? 
                  `${(alerts.reduce((sum, alert) => sum + (alert.data.duration || 0), 0) / alerts.length / 1000).toFixed(1)}s` 
                  : '0s'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-6">Alerts Trend</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="errors" stroke="#ef4444" name="Errors" />
                <Line type="monotone" dataKey="warnings" stroke="#f59e0b" name="Warnings" />
                <Line type="monotone" dataKey="info" stroke="#10b981" name="Info" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-6">Alert Distribution</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="errors" fill="#ef4444" name="Errors" />
                <Bar dataKey="warnings" fill="#f59e0b" name="Warnings" />
                <Bar dataKey="info" fill="#10b981" name="Info" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Monitoring Configs */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">Monitoring Configurations</h3>
            <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">
              <Settings className="w-4 h-4 mr-2" />
              Add Monitor
            </button>
          </div>
        </div>

        <div className="divide-y divide-gray-200">
          {configs.map(config => (
            <div key={config.id} className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Site ID: {config.site_id}</h4>
                  <p className="mt-1 text-sm text-gray-500">
                    Frequency: {config.frequency}
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => toggleMonitoring(config.id, !config.enabled)}
                    className={`relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                      config.enabled ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                  >
                    <span className="sr-only">
                      {config.enabled ? 'Disable monitoring' : 'Enable monitoring'}
                    </span>
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200 ${
                        config.enabled ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                  <button className="text-gray-400 hover:text-gray-500">
                    <Settings className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Logs */}
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
          {alerts.slice(0, 10).map(alert => (
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