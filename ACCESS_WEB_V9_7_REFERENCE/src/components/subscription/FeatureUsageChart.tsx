import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

interface FeatureUsageChartProps {
  current: number;
  max: number | null;
  usage: {
    daily: number;
    monthly: number;
    total: number;
  };
}

export function FeatureUsageChart({ current, max, usage }: FeatureUsageChartProps) {
  const percentage = max ? (current / max) * 100 : 0;
  const getBarColor = () => {
    if (percentage >= 90) return '#ef4444';
    if (percentage >= 75) return '#f59e0b';
    return '#3b82f6';
  };

  const data = [
    { name: 'Daily', value: usage.daily },
    { name: 'Monthly', value: usage.monthly },
    { name: 'Total', value: usage.total }
  ];

  return (
    <div className="space-y-4">
      {/* Usage Bar */}
      <div className="relative pt-1">
        <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-100">
          <div
            style={{ width: `${percentage}%` }}
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

      {/* Usage Chart */}
      <div className="h-40">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill={getBarColor()} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}