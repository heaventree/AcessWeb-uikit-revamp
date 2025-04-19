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
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { AlertTriangle, CheckCircle, AlertOctagon, Info } from 'lucide-react';
import type { ScanResult } from '../../types/integrations';

interface ShopifyVisualizationProps {
  results: ScanResult[];
}

export function ShopifyVisualization({ results }: ShopifyVisualizationProps) {
  // Process data for charts
  const issuesByType = results.reduce((acc, scan) => {
    scan.issues.forEach(issue => {
      if (!acc[issue.type]) {
        acc[issue.type] = 0;
      }
      acc[issue.type]++;
    });
    return acc;
  }, {} as Record<string, number>);

  const issuesByImpact = results.reduce((acc, scan) => {
    scan.issues.forEach(issue => {
      if (!acc[issue.impact]) {
        acc[issue.impact] = 0;
      }
      acc[issue.impact]++;
    });
    return acc;
  }, {} as Record<string, number>);

  const trendsData = results.map(scan => ({
    date: new Date(scan.timestamp).toLocaleDateString(),
    issues: scan.issues.length,
    autoFixable: scan.issues.filter(i => i.autoFixable).length
  }));

  const pieData = Object.entries(issuesByImpact).map(([name, value]) => ({
    name,
    value
  }));

  const COLORS = {
    critical: '#ef4444',
    serious: '#f97316',
    moderate: '#eab308',
    minor: '#3b82f6'
  };

  return (
    <div className="space-y-8">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-3 bg-red-100 rounded-lg">
              <AlertOctagon className="w-6 h-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Critical Issues</p>
              <p className="text-2xl font-semibold text-gray-900">
                {issuesByImpact.critical || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-3 bg-orange-100 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Serious Issues</p>
              <p className="text-2xl font-semibold text-gray-900">
                {issuesByImpact.serious || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <Info className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Moderate Issues</p>
              <p className="text-2xl font-semibold text-gray-900">
                {issuesByImpact.moderate || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Minor Issues</p>
              <p className="text-2xl font-semibold text-gray-900">
                {issuesByImpact.minor || 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Trends Chart */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-6">Issue Trends</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trendsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="issues" name="Total Issues" fill="#3b82f6" />
                <Bar dataKey="autoFixable" name="Auto-fixable" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Impact Distribution */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-6">Impact Distribution</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={COLORS[entry.name as keyof typeof COLORS]} 
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Issue Type Breakdown */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-6">Issue Type Breakdown</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={Object.entries(issuesByType).map(([type, count]) => ({
                type,
                count
              }))}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="type" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" name="Issues" fill="#6366f1" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}