import React from 'react';
import { Download, Filter } from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const mockData = [
  { date: '2024-01', critical: 12, serious: 24, moderate: 36, minor: 48 },
  { date: '2024-02', critical: 10, serious: 20, moderate: 30, minor: 40 },
  { date: '2024-03', critical: 8, serious: 16, moderate: 24, minor: 32 },
  { date: '2024-04', critical: 6, serious: 12, moderate: 18, minor: 24 },
  { date: '2024-05', critical: 4, serious: 8, moderate: 12, minor: 16 },
  { date: '2024-06', critical: 2, serious: 4, moderate: 6, minor: 8 },
];

export function AdminReports() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Accessibility Reports</h2>
        <div className="flex items-center space-x-4">
          <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
            <Filter className="h-5 w-5 mr-2" />
            Filter
          </button>
          <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">
            <Download className="h-5 w-5 mr-2" />
            Export Report
          </button>
        </div>
      </div>

      {/* Trend Chart */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Issue Trends</h3>
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={mockData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="critical" stroke="#EF4444" name="Critical" />
              <Line type="monotone" dataKey="serious" stroke="#F97316" name="Serious" />
              <Line type="monotone" dataKey="moderate" stroke="#EAB308" name="Moderate" />
              <Line type="monotone" dataKey="minor" stroke="#3B82F6" name="Minor" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h4 className="text-sm font-medium text-gray-500">Total Scans</h4>
          <p className="mt-2 text-3xl font-bold text-gray-900">1,234</p>
          <p className="mt-2 text-sm text-green-600">↑ 12% from last month</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h4 className="text-sm font-medium text-gray-500">Active Issues</h4>
          <p className="mt-2 text-3xl font-bold text-gray-900">89</p>
          <p className="mt-2 text-sm text-red-600">↑ 3% from last month</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h4 className="text-sm font-medium text-gray-500">Fixed Issues</h4>
          <p className="mt-2 text-3xl font-bold text-gray-900">567</p>
          <p className="mt-2 text-sm text-green-600">↑ 8% from last month</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h4 className="text-sm font-medium text-gray-500">Average Fix Time</h4>
          <p className="mt-2 text-3xl font-bold text-gray-900">2.4d</p>
          <p className="mt-2 text-sm text-green-600">↓ 15% from last month</p>
        </div>
      </div>

      {/* Recent Reports */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Recent Reports</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {[1, 2, 3, 4, 5].map((item) => (
            <div key={item} className="px-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    example.com
                  </p>
                  <p className="text-sm text-gray-500">
                    Scanned on June 1, 2024
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    3 Critical Issues
                  </span>
                  <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                    View Report
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}