import React, { useState } from 'react';
import { useAccessibilityTips } from '../../contexts/AccessibilityTipsContext';
import { Link } from 'react-router-dom';
import { Search, X, ChevronRight } from 'lucide-react';

const AccessibilityTipsPanel: React.FC = () => {
  const { filteredTips, searchTips, isEnabled, toggleEnabled } = useAccessibilityTips();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  // Get unique element types for categorization
  const categories = Array.from(
    new Set(filteredTips.map((tip) => tip.element))
  );

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    searchTips(query);

    // Reset active category when searching
    if (query) {
      setActiveCategory(null);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    searchTips('');
  };

  const toggleCategory = (category: string) => {
    setActiveCategory(activeCategory === category ? null : category);
  };

  const getCategoryTips = (category: string) => {
    return filteredTips.filter((tip) => tip.element === category);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 max-w-md mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Accessibility Quick Tips</h2>
        <div className="flex items-center">
          <span className="text-sm mr-2 text-gray-600 dark:text-gray-300">
            {isEnabled ? 'Enabled' : 'Disabled'}
          </span>
          <button
            onClick={toggleEnabled}
            className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
              isEnabled ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-600'
            }`}
            aria-pressed={isEnabled}
          >
            <span
              className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${
                isEnabled ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>

      <div className="relative mb-4">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search size={16} className="text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search accessibility tips..."
          value={searchQuery}
          onChange={handleSearch}
          className="pl-10 pr-10 py-2 w-full rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {searchQuery && (
          <button
            onClick={clearSearch}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
            aria-label="Clear search"
          >
            <X size={16} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200" />
          </button>
        )}
      </div>

      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {searchQuery ? (
          // Show search results when searching
          filteredTips.length > 0 ? (
            filteredTips.map((tip) => (
              <div key={tip.id} className="py-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-medium text-gray-800 dark:text-white flex items-center">
                      {tip.title}
                      {tip.wcagReference && (
                        <span className="ml-2 text-xs px-1.5 py-0.5 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded">
                          {tip.wcagReference}
                        </span>
                      )}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{tip.tip}</p>
                  </div>
                </div>
                {tip.learnMoreLink && (
                  <Link
                    to={tip.learnMoreLink}
                    className="text-xs text-blue-600 dark:text-blue-400 hover:underline mt-2 inline-block"
                  >
                    Learn more
                  </Link>
                )}
              </div>
            ))
          ) : (
            <p className="py-4 text-center text-gray-500 dark:text-gray-400">
              No tips found for "{searchQuery}"
            </p>
          )
        ) : (
          // Show categories when not searching
          categories.map((category) => (
            <div key={category} className="py-2">
              <button
                onClick={() => toggleCategory(category)}
                className="w-full flex items-center justify-between py-2 text-left focus:outline-none"
              >
                <h3 className="font-medium text-gray-800 dark:text-white capitalize">
                  {category} Tips
                </h3>
                <ChevronRight
                  size={16}
                  className={`transition-transform duration-200 ${
                    activeCategory === category ? 'transform rotate-90' : ''
                  }`}
                />
              </button>

              {activeCategory === category && (
                <div className="mt-2 space-y-3 pl-4 border-l-2 border-blue-200 dark:border-blue-800">
                  {getCategoryTips(category).map((tip) => (
                    <div key={tip.id} className="text-sm">
                      <h4 className="font-medium text-gray-700 dark:text-gray-200">{tip.title}</h4>
                      <p className="text-gray-600 dark:text-gray-300 mt-1">{tip.tip}</p>
                      {tip.learnMoreLink && (
                        <Link
                          to={tip.learnMoreLink}
                          className="text-xs text-blue-600 dark:text-blue-400 hover:underline mt-1 inline-block"
                        >
                          Learn more
                        </Link>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AccessibilityTipsPanel;