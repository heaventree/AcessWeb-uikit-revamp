import React, { useState, useEffect } from 'react';
import { APIUsageStats as APIUsageStatsType } from '../../types/integrations';
import { storageService } from '../../lib/storage';

// Create mock data for demonstration (to be replaced with real API calls)
const generateMockUsageData = (period: 'day' | 'week' | 'month' | 'year'): APIUsageStatsType => {
  const now = new Date();
  const dataPoints: { timestamp: string; requests: number; errors?: number; avgResponseTime?: number }[] = [];
  
  let totalRequests = 0;
  const errorRate = Math.random() * 0.05; // 0-5% error rate
  const avgResponseTime = 100 + Math.random() * 200; // 100-300ms
  
  // Generate data points based on period
  let intervals = 24; // Default for day
  if (period === 'week') intervals = 7;
  if (period === 'month') intervals = 30;
  if (period === 'year') intervals = 12;
  
  for (let i = 0; i < intervals; i++) {
    const date = new Date();
    if (period === 'day') {
      date.setHours(now.getHours() - (intervals - i - 1));
    } else if (period === 'week') {
      date.setDate(now.getDate() - (intervals - i - 1));
    } else if (period === 'month') {
      date.setDate(now.getDate() - (intervals - i - 1));
    } else {
      date.setMonth(now.getMonth() - (intervals - i - 1));
    }
    
    const requests = Math.floor(50 + Math.random() * 150);
    totalRequests += requests;
    
    dataPoints.push({
      timestamp: date.toISOString(),
      requests,
      errors: Math.floor(requests * errorRate),
      avgResponseTime: avgResponseTime + (Math.random() * 50 - 25),
    });
  }
  
  return {
    period,
    totalRequests,
    uniqueEndpoints: Math.floor(5 + Math.random() * 10),
    avgResponseTime,
    errorRate,
    rateLimit: 1000,
    requestsRemaining: 1000 - totalRequests,
    resetTime: new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString(),
    dataPoints,
  };
};

export function APIUsageStats() {
  const [usageData, setUsageData] = useState<APIUsageStatsType | null>(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<'day' | 'week' | 'month' | 'year'>('day');

  useEffect(() => {
    fetchUsageData(period);
  }, [period]);

  const fetchUsageData = async (selectedPeriod: 'day' | 'week' | 'month' | 'year') => {
    setLoading(true);
    try {
      // Check if we have stored data
      const storedData = await storageService.getItem<APIUsageStatsType>(`api_usage_${selectedPeriod}`);
      
      if (storedData) {
        setUsageData(storedData);
      } else {
        // For demo purposes, generate mock data if no data is stored
        const mockData = generateMockUsageData(selectedPeriod);
        await storageService.setItem(`api_usage_${selectedPeriod}`, mockData);
        setUsageData(mockData);
      }
    } catch (error) {
      console.error('Failed to fetch API usage stats:', error);
    } finally {
      setLoading(false);
    }
  };

  // Format date for display
  const formatDate = (dateString: string, periodType: 'day' | 'week' | 'month' | 'year') => {
    const date = new Date(dateString);
    
    if (periodType === 'day') {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (periodType === 'week' || periodType === 'month') {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    } else {
      return date.toLocaleDateString([], { month: 'short', year: 'numeric' });
    }
  };

  // Get max value for chart scaling
  const getMaxValue = (data: APIUsageStatsType) => {
    return Math.max(...data.dataPoints.map(dp => dp.requests)) * 1.2;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">API Usage Statistics</h2>
        <div className="flex rounded-md shadow-sm">
          {(['day', 'week', 'month', 'year'] as const).map((p) => (
            <button
              key={p}
              className={`
                px-4 py-2 text-sm font-medium first:rounded-l-md last:rounded-r-md
                ${period === p 
                  ? 'bg-blue-600 text-white border-blue-600' 
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}
                border
              `}
              onClick={() => setPeriod(p)}
            >
              {p.charAt(0).toUpperCase() + p.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="text-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading API usage statistics...</p>
        </div>
      ) : usageData ? (
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
              <p className="text-sm font-medium text-gray-500">Total Requests</p>
              <p className="text-2xl font-bold text-gray-900">{usageData.totalRequests.toLocaleString()}</p>
              <div className="mt-2 flex items-end text-xs font-medium">
                <div className={`inline-flex items-center text-green-500`}>
                  <span>Rate Limit: {usageData.rateLimit.toLocaleString()}</span>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
              <p className="text-sm font-medium text-gray-500">Avg Response Time</p>
              <p className="text-2xl font-bold text-gray-900">{usageData.avgResponseTime.toFixed(1)} ms</p>
              <div className="mt-2 flex items-end text-xs font-medium">
                <div className={`inline-flex items-center ${usageData.avgResponseTime < 200 ? 'text-green-500' : 'text-yellow-500'}`}>
                  <span>{usageData.avgResponseTime < 200 ? 'Good' : 'Average'}</span>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
              <p className="text-sm font-medium text-gray-500">Error Rate</p>
              <p className="text-2xl font-bold text-gray-900">{(usageData.errorRate * 100).toFixed(2)}%</p>
              <div className="mt-2 flex items-end text-xs font-medium">
                <div className={`inline-flex items-center ${usageData.errorRate < 0.02 ? 'text-green-500' : 'text-red-500'}`}>
                  <span>{usageData.errorRate < 0.02 ? 'Low' : 'High'}</span>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
              <p className="text-sm font-medium text-gray-500">Unique Endpoints</p>
              <p className="text-2xl font-bold text-gray-900">{usageData.uniqueEndpoints}</p>
              <div className="mt-2 flex items-end text-xs font-medium text-gray-500">
                <span>Used this {period}</span>
              </div>
            </div>
          </div>

          {/* Usage Chart */}
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Request Volume</h3>
            
            <div className="h-64 relative">
              {/* X and Y axis */}
              <div className="absolute bottom-0 left-0 h-full w-full border-l border-b border-gray-200">
                {/* Y-axis labels */}
                <div className="absolute -left-10 top-0 flex flex-col justify-between h-full">
                  {[0, 0.25, 0.5, 0.75, 1].map((fraction) => (
                    <div key={fraction} className="text-xs text-gray-500">
                      {Math.round(getMaxValue(usageData) * (1 - fraction))}
                    </div>
                  ))}
                </div>
                
                {/* Horizontal grid lines */}
                {[0.25, 0.5, 0.75].map((fraction) => (
                  <div 
                    key={fraction}
                    className="absolute w-full border-t border-gray-100"
                    style={{ bottom: `${fraction * 100}%` }}
                  ></div>
                ))}
                
                {/* Data visualization - bars */}
                <div className="absolute inset-0 flex items-end">
                  {usageData.dataPoints.map((point, index) => {
                    const barHeight = (point.requests / getMaxValue(usageData)) * 100;
                    return (
                      <div 
                        key={index}
                        className="flex flex-col items-center justify-end h-full flex-1"
                      >
                        <div className="group relative">
                          <div 
                            className="bg-blue-500 hover:bg-blue-600 rounded-t w-8 mx-auto"
                            style={{ height: `${barHeight}%` }}
                          ></div>
                          {/* Tooltip on hover */}
                          <div className="absolute opacity-0 group-hover:opacity-100 bottom-full left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs rounded py-1 px-2 mb-2 whitespace-nowrap">
                            <p>{formatDate(point.timestamp, period)}</p>
                            <p>Requests: {point.requests}</p>
                            {point.errors !== undefined && <p>Errors: {point.errors}</p>}
                          </div>
                        </div>
                        
                        {/* X-axis labels - show fewer labels for readability */}
                        {(period === 'day' && index % 3 === 0) || 
                         (period === 'week' && index % 1 === 0) ||
                         (period === 'month' && index % 3 === 0) || 
                         (period === 'year' && index % 1 === 0) ? (
                          <span className="text-xs text-gray-500 mt-2">
                            {formatDate(point.timestamp, period)}
                          </span>
                        ) : null}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Rate Limit Info */}
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Rate Limit Status</h3>
            
            <div className="flex flex-col md:flex-row md:items-center justify-between">
              <div className="flex flex-col">
                <p className="text-sm text-gray-500">
                  {usageData.requestsRemaining} of {usageData.rateLimit} requests remaining
                </p>
                <p className="text-sm text-gray-500">
                  Resets in {new Date(usageData.resetTime).toLocaleString()}
                </p>
              </div>
              
              <div className="mt-4 md:mt-0">
                <div className="relative h-4 w-56 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="absolute h-full bg-blue-500"
                    style={{ width: `${(1 - usageData.requestsRemaining / usageData.rateLimit) * 100}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-1 text-center">
                  {Math.round((1 - usageData.requestsRemaining / usageData.rateLimit) * 100)}% used
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center p-12 border rounded-lg bg-gray-50">
          <p className="text-gray-600">No API usage data available.</p>
          <p className="text-gray-500 text-sm mt-2">
            Start using the API to see statistics here.
          </p>
        </div>
      )}
    </div>
  );
}

export default APIUsageStats;