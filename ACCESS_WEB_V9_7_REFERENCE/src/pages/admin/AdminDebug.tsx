import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '../../components/ui/Card';
import { HeadingSection } from '../../components/ui/HeadingSection';
import { debugItems, DebugItem, DebugItemCategory, DebugItemPriority, DebugItemStatus, DebugItemSource } from '../../data/debugData';

export function AdminDebug() {
  const [statusFilter, setStatusFilter] = useState<DebugItemStatus | 'all'>('all');
  const [categoryFilter, setCategoryFilter] = useState<DebugItemCategory | 'all'>('all');
  const [priorityFilter, setPriorityFilter] = useState<DebugItemPriority | 'all'>('all');
  const [sourceFilter, setSourceFilter] = useState<DebugItemSource | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [items, setItems] = useState<DebugItem[]>(debugItems);
  
  // Listen for changes in debugItems (from feedback system)
  useEffect(() => {
    // Set initial state
    setItems(debugItems);
    
    // Event listener to update items when debug items change
    const handleDebugItemsUpdated = (event: CustomEvent) => {
      console.log('Debug items updated event received:', event.detail);
      setItems([...event.detail]);
    };
    
    // Register event listener
    window.addEventListener('debugItemsUpdated', handleDebugItemsUpdated as EventListener);
    
    // Clean up
    return () => {
      window.removeEventListener('debugItemsUpdated', handleDebugItemsUpdated as EventListener);
    };
  }, []);

  // Filter items based on selected filters and search query
  const filteredItems = items
    .filter(item => statusFilter === 'all' || item.status === statusFilter)
    .filter(item => categoryFilter === 'all' || item.category === categoryFilter)
    .filter(item => priorityFilter === 'all' || item.priority === priorityFilter)
    .filter(item => sourceFilter === 'all' || item.source === sourceFilter || (sourceFilter === 'feedback' && item.source === 'feedback') || (sourceFilter !== 'feedback' && !item.source))
    .filter(item => {
      if (!searchQuery) return true;
      const query = searchQuery.toLowerCase();
      return (
        item.title.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        (item.todoItems?.some(todo => todo.toLowerCase().includes(query))) ||
        (item.notes?.toLowerCase().includes(query))
      );
    })
    .sort((a, b) => {
      // Sort by priority first
      const priorityOrder = { 'critical': 0, 'high': 1, 'medium': 2, 'low': 3, 'very-low': 4 };
      return (priorityOrder[a.priority] ?? 999) - (priorityOrder[b.priority] ?? 999);
    });

  // Get category counts
  const categories: DebugItemCategory[] = ['ui', 'core', 'api', 'integration', 'performance', 'security', 'monitoring', 'accessibility', 'data', 'subscription', 'alerts', 'policies'];
  const categoryCounts = categories.reduce((acc, category) => {
    acc[category] = items.filter(item => item.category === category).length;
    return acc;
  }, {} as Record<string, number>);

  // Get status counts
  const statuses: DebugItemStatus[] = ['identified', 'investigating', 'in-progress', 'testing', 'resolved', 'deferred'];
  const statusCounts = statuses.reduce((acc, status) => {
    acc[status] = items.filter(item => item.status === status).length;
    return acc;
  }, {} as Record<string, number>);

  // Get priority counts
  const priorities: DebugItemPriority[] = ['critical', 'high', 'medium', 'low', 'very-low'];
  const priorityCounts = priorities.reduce((acc, priority) => {
    acc[priority] = items.filter(item => item.priority === priority).length;
    return acc;
  }, {} as Record<string, number>);

  // Helper functions for formatting
  const getCategoryLabel = (category: DebugItemCategory): string => {
    const labels: Record<DebugItemCategory, string> = {
      'ui': 'UI/UX',
      'core': 'Core',
      'api': 'API',
      'integration': 'Integration',
      'performance': 'Performance',
      'security': 'Security',
      'monitoring': 'Monitoring',
      'accessibility': 'Accessibility',
      'data': 'Data',
      'subscription': 'Subscription',
      'alerts': 'Alerts',
      'policies': 'Policies'
    };
    return labels[category] || category.charAt(0).toUpperCase() + category.slice(1);
  };

  const getStatusLabel = (status: DebugItemStatus): string => {
    const labels: Record<DebugItemStatus, string> = {
      'identified': 'Identified',
      'investigating': 'Investigating',
      'in-progress': 'In Progress',
      'testing': 'Testing',
      'resolved': 'Resolved',
      'deferred': 'Deferred'
    };
    return labels[status];
  };

  const getPriorityLabel = (priority: DebugItemPriority): string => {
    const labels: Record<DebugItemPriority, string> = {
      'critical': 'Critical',
      'high': 'High',
      'medium': 'Medium',
      'low': 'Low',
      'very-low': 'Very Low'
    };
    return labels[priority];
  };

  const getCategoryColor = (category: DebugItemCategory): string => {
    const colors: Record<DebugItemCategory, string> = {
      'ui': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200',
      'core': 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
      'api': 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200',
      'integration': 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200',
      'performance': 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200',
      'security': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      'monitoring': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      'accessibility': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      'data': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      'subscription': 'bg-violet-100 text-violet-800 dark:bg-violet-900 dark:text-violet-200',
      'alerts': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
      'policies': 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200'
    };
    return colors[category];
  };

  const getStatusColor = (status: DebugItemStatus): string => {
    const colors: Record<DebugItemStatus, string> = {
      'identified': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      'investigating': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      'in-progress': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      'testing': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
      'resolved': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      'deferred': 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
    };
    return colors[status];
  };

  const getPriorityColor = (priority: DebugItemPriority): string => {
    const colors: Record<DebugItemPriority, string> = {
      'critical': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      'high': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
      'medium': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      'low': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      'very-low': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
    };
    return colors[priority];
  };

  const getStatusIndicatorColor = (status: DebugItemStatus): string => {
    const colors: Record<DebugItemStatus, string> = {
      'identified': 'bg-blue-500',
      'investigating': 'bg-purple-500',
      'in-progress': 'bg-yellow-500',
      'testing': 'bg-orange-500',
      'resolved': 'bg-green-500',
      'deferred': 'bg-gray-500'
    };
    return colors[status];
  };

  // Function to get source label
  const getSourceLabel = (source?: DebugItemSource): string => {
    if (!source) return 'Manual';
    const labels: Record<DebugItemSource, string> = {
      'feedback': 'User Feedback',
      'manual': 'Manual Entry',
      'system': 'System Generated'
    };
    return labels[source];
  };

  // Function to get source color
  const getSourceColor = (source?: DebugItemSource): string => {
    if (!source) return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    const colors: Record<DebugItemSource, string> = {
      'feedback': 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200',
      'manual': 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
      'system': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
    };
    return colors[source];
  };

  const renderDebugCard = (item: DebugItem) => {
    // Add special styling for feedback items
    const isFeedback = item.source === 'feedback';
    const cardBorderClass = isFeedback 
      ? 'border-pink-300 dark:border-pink-800 shadow-sm shadow-pink-100 dark:shadow-pink-900/20' 
      : 'border-gray-200 dark:border-gray-700';

    return (
      <Card key={item.id} className={`overflow-hidden border ${cardBorderClass}`}>
        <div className={`h-2 ${getStatusIndicatorColor(item.status)}`} />
        <CardContent className="p-5">
          <div className="flex justify-between items-start mb-3">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {isFeedback && <span className="inline-block w-2 h-2 rounded-full bg-pink-500 mr-2"></span>}
              {item.title}
            </h3>
            <span className={`text-xs font-semibold px-2 py-1 rounded-full ${getPriorityColor(item.priority)}`}>
              {getPriorityLabel(item.priority)}
            </span>
          </div>
          
          <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">{item.description}</p>
          
          <div className="flex flex-wrap gap-2 mb-4">
            <span className={`text-xs font-medium px-2 py-1 rounded-md ${getCategoryColor(item.category)}`}>
              {getCategoryLabel(item.category)}
            </span>
            <span className={`text-xs font-medium px-2 py-1 rounded-md ${getStatusColor(item.status)}`}>
              {getStatusLabel(item.status)}
            </span>
            <span className="text-xs font-medium px-2 py-1 rounded-md bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
              {item.dateIdentified}
            </span>
            {/* Add source badge */}
            <span className={`text-xs font-medium px-2 py-1 rounded-md ${getSourceColor(item.source)}`}>
              {getSourceLabel(item.source)}
            </span>
          </div>
          
          {item.assignedTo && (
            <div className="flex items-center mb-4">
              <div className="w-6 h-6 rounded-full bg-primary-100 dark:bg-primary-800 flex items-center justify-center text-xs text-primary-800 dark:text-primary-200 mr-2">
                {item.assignedTo.split(' ').map(n => n[0]).join('')}
              </div>
              <span className="text-sm text-gray-600 dark:text-gray-300">{item.assignedTo}</span>
            </div>
          )}
          
          {item.todoItems && item.todoItems.length > 0 && (
            <div className="mb-4">
              <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">To Do:</h4>
              <ul className="list-disc pl-5 text-sm text-gray-600 dark:text-gray-300 space-y-1">
                {item.todoItems.slice(0, 3).map((todo, index) => (
                  <li key={index}>{todo}</li>
                ))}
                {item.todoItems.length > 3 && (
                  <li className="text-primary-600 dark:text-primary-400">+{item.todoItems.length - 3} more items</li>
                )}
              </ul>
            </div>
          )}
          
          {item.notes && (
            <div className="text-sm italic text-gray-500 dark:text-gray-400 border-t border-gray-100 dark:border-gray-800 pt-2 mt-2">
              {item.notes}
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="container mx-auto py-6 px-4">
      <HeadingSection 
        title="Debug List" 
        description="Track and manage current development issues, bugs, and improvements in progress." 
        className="mb-8"
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 border-blue-200 dark:border-blue-800">
          <CardContent className="p-4">
            <h3 className="font-semibold text-blue-800 dark:text-blue-300">Total Issues</h3>
            <p className="text-3xl font-bold text-blue-900 dark:text-blue-200">{items.length}</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/30 dark:to-orange-800/30 border-orange-200 dark:border-orange-800">
          <CardContent className="p-4">
            <h3 className="font-semibold text-orange-800 dark:text-orange-300">High Priority</h3>
            <p className="text-3xl font-bold text-orange-900 dark:text-orange-200">
              {items.filter(item => item.priority === 'critical' || item.priority === 'high').length}
            </p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/30 dark:to-yellow-800/30 border-yellow-200 dark:border-yellow-800">
          <CardContent className="p-4">
            <h3 className="font-semibold text-yellow-800 dark:text-yellow-300">In Progress</h3>
            <p className="text-3xl font-bold text-yellow-900 dark:text-yellow-200">{statusCounts['in-progress'] || 0}</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30 border-green-200 dark:border-green-800">
          <CardContent className="p-4">
            <h3 className="font-semibold text-green-800 dark:text-green-300">Resolved</h3>
            <p className="text-3xl font-bold text-green-900 dark:text-green-200">{statusCounts['resolved'] || 0}</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="w-full md:w-1/2">
            <input
              type="text"
              placeholder="Search debug items..."
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:text-white"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="w-full md:w-1/2 flex gap-2 overflow-x-auto pb-2">
            <select
              className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:text-white"
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value as DebugItemPriority | 'all')}
            >
              <option value="all">All Priorities</option>
              {priorities.map(priority => (
                <option key={priority} value={priority}>
                  {getPriorityLabel(priority)} ({priorityCounts[priority] || 0})
                </option>
              ))}
            </select>
            <select
              className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:text-white"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as DebugItemStatus | 'all')}
            >
              <option value="all">All Statuses</option>
              {statuses.map(status => (
                <option key={status} value={status}>
                  {getStatusLabel(status)} ({statusCounts[status] || 0})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2 mb-4">
          <button 
            className={`px-3 py-1 rounded-md text-sm ${categoryFilter === 'all' ? 'bg-primary-500 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200'}`}
            onClick={() => setCategoryFilter('all')}
          >
            All Categories
          </button>
          {categories.map(category => (
            <button 
              key={category}
              className={`px-3 py-1 rounded-md text-sm ${categoryFilter === category ? 'bg-primary-500 text-white' : `bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200`}`}
              onClick={() => setCategoryFilter(category)}
            >
              {getCategoryLabel(category)} ({categoryCounts[category] || 0})
            </button>
          ))}
        </div>
        
        {/* Source Filters */}
        <div className="flex flex-wrap gap-2">
          <h3 className="w-full text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Filter by Source:</h3>
          <button 
            className={`px-3 py-1 rounded-md text-sm ${sourceFilter === 'all' ? 'bg-primary-500 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200'}`}
            onClick={() => setSourceFilter('all')}
          >
            All Sources
          </button>
          <button 
            className={`px-3 py-1 rounded-md text-sm ${sourceFilter === 'feedback' ? 'bg-pink-500 text-white' : 'bg-pink-100 dark:bg-pink-900 text-pink-800 dark:text-pink-200'}`}
            onClick={() => setSourceFilter('feedback')}
          >
            User Feedback
          </button>
          <button 
            className={`px-3 py-1 rounded-md text-sm ${sourceFilter === 'manual' ? 'bg-primary-500 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200'}`}
            onClick={() => setSourceFilter('manual')}
          >
            Manual Entries
          </button>
          <button 
            className={`px-3 py-1 rounded-md text-sm ${sourceFilter === 'system' ? 'bg-primary-500 text-white' : 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200'}`}
            onClick={() => setSourceFilter('system')}
          >
            System Generated
          </button>
        </div>
      </div>

      {/* Debug Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map(item => renderDebugCard(item))}
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <p className="text-lg text-gray-500 dark:text-gray-400">No debug items found matching the selected filters.</p>
        </div>
      )}
    </div>
  );
}