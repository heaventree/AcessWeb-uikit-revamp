import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { ChatStatistics } from '../../types/chat';
import { Card, CardContent } from '../ui/Card';

// Mock data for demonstration (in a real app, this would come from your API)
const mockData: ChatStatistics = {
  totalSessions: 487,
  totalMessages: 2893,
  averageSessionLength: 6.2,
  averageResponseTime: 0.8,
  userSatisfactionScore: 4.3,
  commonTopics: [
    { topic: 'WCAG Compliance', count: 98 },
    { topic: 'Color Contrast', count: 76 },
    { topic: 'Screen Readers', count: 53 },
    { topic: 'Keyboard Navigation', count: 47 },
    { topic: 'Form Accessibility', count: 42 },
    { topic: 'ARIA Attributes', count: 39 },
    { topic: 'Semantic HTML', count: 27 },
  ],
  dailyActivity: [
    { date: '2025-03-28', sessions: 21 },
    { date: '2025-03-29', sessions: 18 },
    { date: '2025-03-30', sessions: 24 },
    { date: '2025-03-31', sessions: 29 },
    { date: '2025-04-01', sessions: 34 },
    { date: '2025-04-02', sessions: 32 },
    { date: '2025-04-03', sessions: 28 },
    { date: '2025-04-04', sessions: 27 },
  ],
};

// List of top queries with answers for review (in a real app, this would come from your API)
const mockTopQueries = [
  { 
    query: "What is WCAG compliance?", 
    count: 34,
    answer: "WCAG (Web Content Accessibility Guidelines) are developed through the W3C process in cooperation with individuals and organizations around the world, with a goal of providing a single shared standard for web content accessibility.",
    accuracy: 4.8
  },
  { 
    query: "How do I check color contrast?", 
    count: 29,
    answer: "You can check color contrast using our contrast checker tool. WCAG 2.1 requires a contrast ratio of at least 4.5:1 for normal text and 3:1 for large text. The tool will show you if your colors pass these requirements.",
    accuracy: 4.9
  },
  { 
    query: "What are aria labels?", 
    count: 27,
    answer: "ARIA labels (aria-label attribute) provide an accessible name for elements when the visual text can't be used or doesn't exist. They're read by screen readers to help users understand the purpose of elements, especially for interactive controls.",
    accuracy: 4.7
  },
  { 
    query: "How do I make forms accessible?", 
    count: 26,
    answer: "To make forms accessible: 1) Use proper labels for all form fields, 2) Provide clear error messages, 3) Use fieldset and legend for grouping, 4) Ensure keyboard navigation works, 5) Don't rely solely on color for error states, 6) Add aria-required to required fields.",
    accuracy: 4.5
  },
  { 
    query: "What is a screen reader?", 
    count: 22,
    answer: "A screen reader is assistive technology that converts digital text into synthesized speech. It allows visually impaired users to hear the content displayed on their screen or read it via refreshable Braille display.",
    accuracy: 4.9
  },
];

// WCAG categories for filtering (in a real app, this might be dynamic)
const wcagCategories = [
  'All',
  'Perceivable',
  'Operable',
  'Understandable',
  'Robust'
];

// Colors for charts
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

export function ChatAnalytics() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [dateRange, setDateRange] = useState('7days');
  
  // In a real component, these would fetch from an API
  const stats = mockData;
  
  // Filter queries by search term
  const [searchTerm, setSearchTerm] = useState('');
  const filteredQueries = mockTopQueries.filter(query => 
    query.query.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent>
            <div className="flex flex-col">
              <h3 className="text-sm font-medium text-gray-500">Total Sessions</h3>
              <p className="text-3xl font-bold text-blue-600">{stats.totalSessions}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent>
            <div className="flex flex-col">
              <h3 className="text-sm font-medium text-gray-500">Total Messages</h3>
              <p className="text-3xl font-bold text-blue-600">{stats.totalMessages}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent>
            <div className="flex flex-col">
              <h3 className="text-sm font-medium text-gray-500">Avg. Response Time</h3>
              <p className="text-3xl font-bold text-blue-600">{stats.averageResponseTime}s</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent>
            <div className="flex flex-col">
              <h3 className="text-sm font-medium text-gray-500">User Satisfaction</h3>
              <p className="text-3xl font-bold text-blue-600">{stats.userSatisfactionScore}/5</p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Activity Chart */}
      <Card>
        <CardContent>
          <h3 className="text-lg font-medium mb-4">Chat Activity</h3>
          <div className="flex justify-end mb-4">
            <select 
              className="bg-white border border-gray-300 rounded-md px-3 py-1 text-sm"
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
            >
              <option value="7days">Last 7 days</option>
              <option value="30days">Last 30 days</option>
              <option value="90days">Last 90 days</option>
            </select>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={stats.dailyActivity}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(date) => new Date(date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                />
                <YAxis />
                <Tooltip 
                  formatter={(value) => [`${value} sessions`, 'Activity']}
                  labelFormatter={(date) => new Date(date).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
                />
                <Line 
                  type="monotone" 
                  dataKey="sessions" 
                  stroke="#0088FE" 
                  activeDot={{ r: 8 }} 
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      
      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Topics */}
        <Card>
          <CardContent>
            <h3 className="text-lg font-medium mb-4">Top Discussion Topics</h3>
            <div className="flex justify-end mb-4">
              <select 
                className="bg-white border border-gray-300 rounded-md px-3 py-1 text-sm"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {wcagCategories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={stats.commonTopics}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 80, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis 
                    type="category" 
                    dataKey="topic" 
                    width={80}
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip />
                  <Bar 
                    dataKey="count" 
                    fill="#0088FE" 
                    radius={[0, 4, 4, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        {/* User Satisfaction */}
        <Card>
          <CardContent>
            <h3 className="text-lg font-medium mb-4">Response Accuracy</h3>
            <div className="h-80 flex justify-center items-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Excellent (5★)', value: 45 },
                      { name: 'Good (4★)', value: 35 },
                      { name: 'Average (3★)', value: 15 },
                      { name: 'Fair (2★)', value: 4 },
                      { name: 'Poor (1★)', value: 1 },
                    ]}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    innerRadius={60}
                    dataKey="value"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {[
                      { name: 'Excellent (5★)', value: 45 },
                      { name: 'Good (4★)', value: 35 },
                      { name: 'Average (3★)', value: 15 },
                      { name: 'Fair (2★)', value: 4 },
                      { name: 'Poor (1★)', value: 1 },
                    ].map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value} responses`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Top Queries Table */}
      <Card>
        <CardContent>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
            <h3 className="text-lg font-medium">Top Queries</h3>
            <div className="mt-2 sm:mt-0">
              <input
                type="text"
                placeholder="Search queries..."
                className="w-full sm:w-auto border border-gray-300 rounded-md px-3 py-1 text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Query</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Count</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Accuracy</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Answer</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredQueries.map((item, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-normal text-sm text-gray-900">{item.query}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.count}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center">
                        <span className={`mr-2 font-medium ${
                          item.accuracy >= 4.5 ? 'text-green-600' : 
                          item.accuracy >= 3.5 ? 'text-blue-600' : 
                          item.accuracy >= 2.5 ? 'text-yellow-600' : 'text-red-600'
                        }`}>{item.accuracy.toFixed(1)}</span>
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map(star => (
                            <svg 
                              key={star} 
                              className={`w-4 h-4 ${star <= Math.round(item.accuracy) ? 'text-yellow-400' : 'text-gray-300'}`}
                              fill="currentColor" 
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-normal text-sm text-gray-500 max-w-md">
                      {item.answer}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}