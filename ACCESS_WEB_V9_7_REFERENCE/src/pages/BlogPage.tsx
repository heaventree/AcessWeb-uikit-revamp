import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, BookOpen, X, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { ArticleCategory } from '../types/blog';
import { ArticleCard } from '../components/blog/ArticleCard';
import { articles, featuredArticles } from '../data/articles';

const categories: ArticleCategory[] = [
  {
    id: 'wcag',
    name: 'WCAG Standards',
    description: 'Comprehensive guides to WCAG 2.1 success criteria',
    slug: 'wcag',
    count: articles.filter(a => a.category === 'wcag').length
  },
  {
    id: 'accessibility',
    name: 'Accessibility',
    description: 'General accessibility tips and best practices',
    slug: 'accessibility',
    count: articles.filter(a => a.category === 'accessibility').length
  },
  {
    id: 'best-practices',
    name: 'Best Practices',
    description: 'Implementation guides and technical tutorials',
    slug: 'best-practices',
    count: articles.filter(a => a.category === 'best-practices').length
  },
  {
    id: 'wcag-resources',
    name: 'WCAG Resources',
    description: 'Educational resources covering all WCAG principles and guidelines',
    slug: 'wcag-resources',
    count: articles.filter(a => a.category === 'wcag-resources').length
  }
];

export function BlogPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Filter articles based on search query and selected category
  const filteredArticles = articles.filter(article => {
    const matchesSearch = searchQuery.toLowerCase() === '' || 
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = !selectedCategory || article.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const handleCategoryClick = (category: ArticleCategory) => {
    setSelectedCategory(prevCategory => 
      prevCategory === category.id ? null : category.id
    );
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-[130px] pb-[130px]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold text-gray-900 mb-4"
          >
            Accessibility Knowledge Base
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-600"
          >
            Expert guides and tutorials on web accessibility standards
          </motion.p>
        </div>

        {/* WCAG Resources Banner */}
        <div className="mb-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl shadow-lg">
          <div className="px-6 py-8 flex flex-col md:flex-row items-center justify-between">
            <div className="mb-4 md:mb-0 md:max-w-2xl">
              <h2 className="text-xl md:text-2xl font-bold text-white mb-2">
                Explore Our Complete WCAG Resources Library
              </h2>
              <p className="text-blue-100 mb-0">
                Browse our comprehensive collection of 50 educational resources covering all WCAG principles, guidelines, and success criteria.
              </p>
            </div>
            <Link
              to="/wcag-resources"
              className="inline-flex items-center px-6 py-3 bg-white text-blue-600 hover:text-blue-800 font-medium rounded-lg shadow transition-colors"
            >
              Browse Resources <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </div>
        </div>
        
        {/* Search and Filters */}
        <div className="mb-12">
          <div className="flex gap-4 max-w-2xl mx-auto">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
            {(searchQuery || selectedCategory) && (
              <button
                onClick={clearFilters}
                className="flex items-center px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>

        {/* Categories */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {categories.map((category) => (
            <motion.button
              key={category.id}
              onClick={() => handleCategoryClick(category)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className={`bg-white rounded-xl shadow-sm p-6 text-left hover:shadow-md transition-all h-full flex flex-col ${
                selectedCategory === category.id ? 'ring-2 ring-blue-500' : ''
              }`}
            >
              <div className="flex-grow">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  {category.name}
                </h2>
                <p className="text-gray-600">{category.description}</p>
              </div>
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                <span className="text-sm text-gray-500">
                  {category.count} articles
                </span>
                <span className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                  {selectedCategory === category.id ? 'Clear Filter' : 'View Articles'}
                </span>
              </div>
            </motion.button>
          ))}
        </div>

        {/* Featured Articles */}
        {!selectedCategory && !searchQuery && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Featured Articles
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {featuredArticles.map((article, index) => (
                <ArticleCard
                  key={article.id}
                  article={article}
                  featured={index === 0}
                />
              ))}
            </div>
          </div>
        )}

        {/* Articles List */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            {selectedCategory 
              ? `${categories.find(c => c.id === selectedCategory)?.name} Articles`
              : searchQuery 
                ? 'Search Results' 
                : 'Latest Articles'
            }
          </h2>
          {filteredArticles.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredArticles.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-lg">
              <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No articles found
              </h3>
              <p className="text-gray-600">
                Try adjusting your search or filter criteria
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}