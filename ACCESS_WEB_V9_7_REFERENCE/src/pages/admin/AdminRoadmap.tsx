import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '../../components/ui/Card';
import { HeadingSection } from '../../components/ui/HeadingSection';
import { roadmapFeatures, FeatureStatus, RoadmapFeature, RoadmapFeatureSource, getFeaturesByStatus, getFeaturesByCategory, getNextFeatures } from '../../data/roadmapData';

export function AdminRoadmap() {
  const [statusFilter, setStatusFilter] = useState<FeatureStatus | 'all'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [sourceFilter, setSourceFilter] = useState<RoadmapFeatureSource | 'all'>('all');
  const [features, setFeatures] = useState<RoadmapFeature[]>(roadmapFeatures);
  
  // Listen for changes in roadmapFeatures (from feedback system)
  useEffect(() => {
    // Set initial state
    setFeatures(roadmapFeatures);
    
    // Event listener to update items when roadmap features change
    const handleRoadmapUpdated = (event: CustomEvent) => {
      console.log('Roadmap features updated event received:', event.detail);
      setFeatures([...event.detail]);
    };
    
    // Register event listener
    window.addEventListener('roadmapFeaturesUpdated', handleRoadmapUpdated as EventListener);
    
    // Clean up
    return () => {
      window.removeEventListener('roadmapFeaturesUpdated', handleRoadmapUpdated as EventListener);
    };
  }, []);
  
  // Filter items based on selected filters
  const filteredItems = features
    .filter(item => statusFilter === 'all' || item.status === statusFilter)
    .filter(item => categoryFilter === 'all' || item.category === categoryFilter)
    .filter(item => sourceFilter === 'all' || item.source === sourceFilter || (sourceFilter === 'feedback' && item.source === 'feedback') || (sourceFilter !== 'feedback' && !item.source))
    .sort((a, b) => a.priority - b.priority);

  // Get category counts
  const categories = ['core', 'ui', 'reporting', 'integration', 'analytics'];
  const categoryCounts = categories.reduce((acc, category) => {
    acc[category] = features.filter(item => item.category === category).length;
    return acc;
  }, {} as Record<string, number>);

  // Get status counts
  const statuses: FeatureStatus[] = ['planned', 'in-progress', 'completed', 'deferred'];
  const statusCounts = statuses.reduce((acc, status) => {
    acc[status] = features.filter(item => item.status === status).length;
    return acc;
  }, {} as Record<string, number>);

  // Get the next features to implement
  // Instead of using the utility function, we'll calculate it directly from our state
  const nextFeatures = features
    .filter(item => item.status === 'planned')
    .sort((a, b) => a.priority - b.priority)
    .slice(0, 3);

  const getCategoryLabel = (category: string): string => {
    const labels: Record<string, string> = {
      'core': 'Core',
      'ui': 'UI/UX',
      'reporting': 'Reporting',
      'integration': 'Integration',
      'analytics': 'Analytics'
    };
    return labels[category] || category.charAt(0).toUpperCase() + category.slice(1);
  };

  const getPriorityLabel = (priority: number): string => {
    if (priority === 1) return 'Critical';
    if (priority === 2) return 'High';
    if (priority === 3) return 'Medium';
    if (priority === 4) return 'Low';
    return 'Very Low';
  };

  const getPriorityColor = (priority: number): string => {
    if (priority === 1) return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
    if (priority === 2) return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
    if (priority === 3) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
    if (priority === 4) return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
    return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
  };

  const getStatusColor = (status: FeatureStatus): string => {
    if (status === 'completed') return 'bg-green-500';
    if (status === 'in-progress') return 'bg-yellow-500';
    if (status === 'planned') return 'bg-blue-500';
    return 'bg-gray-500';
  };

  const getStatusBadgeClass = (status: FeatureStatus): string => {
    if (status === 'completed') return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
    if (status === 'in-progress') return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
    if (status === 'planned') return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
    return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
  };

  const formatStatus = (status: FeatureStatus): string => {
    if (status === 'in-progress') return 'In Progress';
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  // Function to get source label
  const getSourceLabel = (source?: RoadmapFeatureSource): string => {
    if (!source) return 'Manual';
    const labels: Record<RoadmapFeatureSource, string> = {
      'feedback': 'User Feedback',
      'manual': 'Manual Entry',
      'system': 'System Generated'
    };
    return labels[source];
  };

  // Function to get source color
  const getSourceColor = (source?: RoadmapFeatureSource): string => {
    if (!source) return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    const colors: Record<RoadmapFeatureSource, string> = {
      'feedback': 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200',
      'manual': 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
      'system': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
    };
    return colors[source];
  };

  return (
    <div className="container mx-auto py-6 px-4">
      <HeadingSection 
        title="Roadmap Items" 
        description="Track the development progress of features and improvements for AccessWeb." 
        className="mb-8"
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 border-blue-200 dark:border-blue-800">
          <CardContent className="p-4">
            <h3 className="font-semibold text-blue-800 dark:text-blue-300">Total Features</h3>
            <p className="text-3xl font-bold text-blue-900 dark:text-blue-200">{features.length}</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30 border-green-200 dark:border-green-800">
          <CardContent className="p-4">
            <h3 className="font-semibold text-green-800 dark:text-green-300">Completed</h3>
            <p className="text-3xl font-bold text-green-900 dark:text-green-200">{statusCounts['completed'] || 0}</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/30 dark:to-yellow-800/30 border-yellow-200 dark:border-yellow-800">
          <CardContent className="p-4">
            <h3 className="font-semibold text-yellow-800 dark:text-yellow-300">In Progress</h3>
            <p className="text-3xl font-bold text-yellow-900 dark:text-yellow-200">{statusCounts['in-progress'] || 0}</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30 border-purple-200 dark:border-purple-800">
          <CardContent className="p-4">
            <h3 className="font-semibold text-purple-800 dark:text-purple-300">Planned</h3>
            <p className="text-3xl font-bold text-purple-900 dark:text-purple-200">{statusCounts['planned'] || 0}</p>
          </CardContent>
        </Card>
      </div>

      {/* Next Features */}
      {nextFeatures.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Next Up for Implementation</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {nextFeatures.map(feature => (
              <Card key={feature.id} className="border-2 border-primary-200 dark:border-primary-800 bg-primary-50/50 dark:bg-primary-900/20">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold text-primary-900 dark:text-primary-200">{feature.title}</h3>
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${getPriorityColor(feature.priority)}`}>
                      {getPriorityLabel(feature.priority)}
                    </span>
                  </div>
                  <p className="text-primary-800 dark:text-primary-300 text-sm mb-3">{feature.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-medium px-2 py-1 rounded-md bg-primary-100 text-primary-800 dark:bg-primary-800 dark:text-primary-200">
                      {getCategoryLabel(feature.category)}
                    </span>
                    <span className="text-xs text-primary-700 dark:text-primary-400">
                      Ready to implement
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2 mb-4">
          <h3 className="w-full text-lg font-semibold text-gray-900 dark:text-white mb-2">Filter by Status</h3>
          <button 
            className={`px-4 py-2 rounded-md ${statusFilter === 'all' ? 'bg-primary-500 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200'}`}
            onClick={() => setStatusFilter('all')}
          >
            All Items ({features.length})
          </button>
          {statuses.map(status => (
            <button 
              key={status}
              className={`px-4 py-2 rounded-md ${statusFilter === status ? 'bg-primary-500 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200'}`}
              onClick={() => setStatusFilter(status)}
            >
              {formatStatus(status)} ({statusCounts[status] || 0})
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          <h3 className="w-full text-lg font-semibold text-gray-900 dark:text-white mb-2">Filter by Category</h3>
          <button 
            className={`px-4 py-2 rounded-md ${categoryFilter === 'all' ? 'bg-primary-500 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200'}`}
            onClick={() => setCategoryFilter('all')}
          >
            All Categories
          </button>
          {categories.map(category => (
            <button 
              key={category}
              className={`px-4 py-2 rounded-md ${categoryFilter === category ? 'bg-primary-500 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200'}`}
              onClick={() => setCategoryFilter(category)}
            >
              {getCategoryLabel(category)} ({categoryCounts[category] || 0})
            </button>
          ))}
        </div>

        {/* Source Filters */}
        <div className="flex flex-wrap gap-2">
          <h3 className="w-full text-lg font-semibold text-gray-900 dark:text-white mb-2">Filter by Source</h3>
          <button 
            className={`px-4 py-2 rounded-md ${sourceFilter === 'all' ? 'bg-primary-500 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200'}`}
            onClick={() => setSourceFilter('all')}
          >
            All Sources
          </button>
          <button 
            className={`px-4 py-2 rounded-md ${sourceFilter === 'feedback' ? 'bg-pink-500 text-white' : 'bg-pink-100 dark:bg-pink-900 text-pink-800 dark:text-pink-200'}`}
            onClick={() => setSourceFilter('feedback')}
          >
            User Feedback
          </button>
          <button 
            className={`px-4 py-2 rounded-md ${sourceFilter === 'manual' ? 'bg-primary-500 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200'}`}
            onClick={() => setSourceFilter('manual')}
          >
            Manual Entries
          </button>
          <button 
            className={`px-4 py-2 rounded-md ${sourceFilter === 'system' ? 'bg-primary-500 text-white' : 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200'}`}
            onClick={() => setSourceFilter('system')}
          >
            System Generated
          </button>
        </div>
      </div>

      {/* Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => {
          // Add special styling for feedback items
          const isFeedback = item.source === 'feedback';
          const cardBorderClass = isFeedback 
            ? 'border-pink-300 dark:border-pink-800 shadow-sm shadow-pink-100 dark:shadow-pink-900/20' 
            : 'border-gray-200 dark:border-gray-700';
            
          return (
            <Card key={item.id} className={`overflow-hidden border ${cardBorderClass}`}>
              <div className={`h-2 ${getStatusColor(item.status)}`} />
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
                <div className="flex flex-wrap gap-2 mb-2">
                  <span className={`text-xs font-medium px-2 py-1 rounded-md ${getStatusBadgeClass(item.status)}`}>
                    {formatStatus(item.status)}
                  </span>
                  <span className={`text-xs font-medium px-2 py-1 rounded-md ${getSourceColor(item.source)}`}>
                    {getSourceLabel(item.source)}
                  </span>
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {item.status === 'completed' && item.completedDate 
                    ? `Completed: ${item.completedDate}` 
                    : item.estimatedCompletionDate 
                    ? `Target: ${item.estimatedCompletionDate}` 
                    : `Category: ${getCategoryLabel(item.category)}`}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <p className="text-lg text-gray-500 dark:text-gray-400">No features found matching the selected filters.</p>
        </div>
      )}
    </div>
  );
}