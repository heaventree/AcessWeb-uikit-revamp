import React from 'react';
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
import { CreditCard, Users, Activity, TrendingUp } from 'lucide-react';
import { useSubscription } from '../../hooks/useSubscription';

interface SubscriptionAnalyticsProps {
  subscriptionId: string;
}

export function SubscriptionAnalytics({ subscriptionId }: SubscriptionAnalyticsProps) {
  const { status, loading, error } = useSubscription(subscriptionId);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !status) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
        {error || 'Failed to load subscription analytics'}
      </div>
    );
  }

  // Process usage data for charts
  const usageData = Object.entries(status.usage).map(([feature, data]) => ({
    feature,
    ...data
  }));

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
              <p className="text-sm font-medium text-gray-600">Active Features</p>
              <p className="text-2xl font-semibold text-gray-900">
                {Object.values(status.features).filter(f => f.is_enabled).length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <Users className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-2xl font-semibold text-gray-900">
                {status.features.users?.current_value || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg">
              <CreditCard className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Monthly Revenue</p>
              <p className="text-2xl font-semibold text-gray-900">
                ${status.features.revenue?.current_value || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Growth Rate</p>
              <p className="text-2xl font-semibold text-gray-900">+12%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Usage Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Usage Trend */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-6">Daily Usage Trend</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={usageData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="feature" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="daily" stroke="#3b82f6" name="Daily Usage" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Monthly Usage */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-6">Monthly Usage</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={usageData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="feature" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="monthly" fill="#6366f1" name="Monthly Usage" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Feature Usage Details */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Feature Usage Details</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {Object.entries(status.features).map(([feature, data]) => {
            const usage = status.usage[feature];
            const percentage = data.max_value 
              ? (data.current_value / data.max_value) * 100 
              : 0;

            return (
              <div key={feature} className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-medium text-gray-900">
                    {feature.split('_').map(word => 
                      word.charAt(0).toUpperCase() + word.slice(1)
                    ).join(' ')}
                  </h4>
                  <span className="text-sm text-gray-500">
                    {data.current_value} / {data.max_value || '∞'}
                  </span>
                </div>
                <div className="relative pt-1">
                  <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-100">
                    <div
                      style={{ width: `${Math.min(percentage, 100)}%` }}
                      className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center transition-all duration-500 ${
                        percentage >= 90
                          ? 'bg-red-500'
                          : percentage >= 75
                          ? 'bg-yellow-500'
                          : 'bg-blue-500'
                      }`}
                    />
                  </div>
                </div>
                {usage && (
                  <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                    <span>Daily: {usage.daily}</span>
                    <span>Monthly: {usage.monthly}</span>
                    <span>Total: {usage.total}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}