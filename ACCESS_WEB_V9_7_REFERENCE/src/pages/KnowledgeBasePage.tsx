import { useState } from 'react';
import { externalResources, knowledgeBaseCategories, keyFindings } from '../data/knowledge-base';

export function KnowledgeBasePage() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Filter resources based on active category and search query
  const getFilteredResources = () => {
    let resources: any[] = [];
    
    // Get all resources if no category is selected
    if (!activeCategory) {
      Object.values(externalResources).forEach(categoryResources => {
        resources = [...resources, ...categoryResources];
      });
    } else {
      // Get resources for the selected category
      const categoryKey = activeCategory.replace(/-/g, '') as keyof typeof externalResources;
      resources = externalResources[categoryKey] || [];
    }
    
    // Filter by search query if provided
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      resources = resources.filter(
        resource => 
          resource.title.toLowerCase().includes(query) ||
          resource.description.toLowerCase().includes(query)
      );
    }
    
    return resources;
  };

  // Get filtered findings based on active category and search query
  const getFilteredFindings = () => {
    let findings = [...keyFindings];
    
    // Filter by category if selected
    if (activeCategory) {
      findings = findings.filter(finding => finding.category === activeCategory);
    }
    
    // Filter by search query if provided
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      findings = findings.filter(
        finding => 
          finding.title.toLowerCase().includes(query) ||
          finding.description.toLowerCase().includes(query)
      );
    }
    
    return findings;
  };

  const filteredResources = getFilteredResources();
  const filteredFindings = getFilteredFindings();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Accessibility Knowledge Base</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Explore our collection of accessibility resources, guidelines, and best practices
          </p>
        </div>
        
        {/* Search Input */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search knowledge base..."
            className="w-full p-3 pl-10 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <svg
            className="absolute left-3 top-3.5 h-5 w-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            ></path>
          </svg>
        </div>
        
        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2">
          <button
            className={`px-4 py-2 rounded-lg ${
              !activeCategory
                ? 'bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-300'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
            }`}
            onClick={() => setActiveCategory(null)}
          >
            All Categories
          </button>
          
          {knowledgeBaseCategories.map((category) => (
            <button
              key={category.id}
              className={`px-4 py-2 rounded-lg ${
                activeCategory === category.id
                  ? 'bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-300'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
              }`}
              onClick={() => setActiveCategory(category.id)}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* Key Findings Section */}
        {filteredFindings.length > 0 && (
          <div className="mt-8">
            <h2 className="text-2xl font-semibold mb-4">Key Accessibility Insights</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredFindings.map((finding) => (
                <div
                  key={finding.id}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg p-5 bg-white dark:bg-gray-800 shadow-sm"
                >
                  <h3 className="text-xl font-medium mb-2">{finding.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    {finding.description}
                  </p>
                  <div className="mt-auto">
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                      Related Resources:
                    </h4>
                    <div className="flex flex-col gap-1">
                      {finding.relatedLinks.map((link, index) => (
                        <a
                          key={index}
                          href={link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary-600 dark:text-primary-400 hover:underline text-sm flex items-center"
                        >
                          {link.replace(/^https?:\/\//, '').split('/')[0]}
                          <svg
                            className="w-3 h-3 ml-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                            ></path>
                          </svg>
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Resources List */}
        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">Accessibility Resources</h2>
          
          {filteredResources.length === 0 ? (
            <div className="text-center py-10 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <p className="text-gray-500 dark:text-gray-400">
                No resources found matching your criteria
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredResources.map((resource, index) => (
                <div
                  key={index}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg p-5 bg-white dark:bg-gray-800"
                >
                  <h3 className="text-xl font-medium mb-1">{resource.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-3">
                    {resource.description}
                  </p>
                  <a
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-600 dark:text-primary-400 hover:underline flex items-center"
                  >
                    Visit Resource
                    <svg
                      className="w-4 h-4 ml-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      ></path>
                    </svg>
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}