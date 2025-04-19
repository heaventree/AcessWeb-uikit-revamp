import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Book, FileText, Code, Settings, Globe, Shield, X, AlertTriangle, HelpCircle } from 'lucide-react';
import { Navigation } from '../components/Navigation';
import { Footer } from '../components/Footer';
import { BackToTop } from '../components/BackToTop';
import { useHelpCategories } from '../hooks/useHelpCategories';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { EmptyState } from '../components/EmptyState';

export function HelpCenter() {
  const [searchQuery, setSearchQuery] = useState('');
  const { categories, loading, error } = useHelpCategories();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-[130px] pb-[130px] flex items-center justify-center">
        <LoadingSpinner size="large" className="text-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 pt-[130px] pb-[130px]">
        <div className="max-w-3xl mx-auto px-4">
          <EmptyState
            title="Error Loading Help Center"
            description={error}
            icon={<AlertTriangle className="h-6 w-6 text-red-600" />} 
            action={{
              label: "Try Again",
              onClick: () => window.location.reload()
            }}
          />
        </div>
      </div>
    );
  }

  const filteredCategories = categories.filter(category => 
    category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    category.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    category.articles.some(article => 
      article.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gray-50 pt-[130px] pb-[130px]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-gray-900 mb-6 font-display">
              Help Center
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Find answers to common questions and learn how to make your website accessible
            </p>
            <div className="mt-8 flex flex-wrap gap-4 justify-center">
              <Link
                to="/docs"
                className="inline-flex items-center px-6 py-3 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg"
              >
                <Book className="w-5 h-5 mr-2" />
                Feature Documentation
              </Link>
              <Link
                to="/wcag-resources"
                className="inline-flex items-center px-6 py-3 rounded-lg bg-green-600 text-white font-medium hover:bg-green-700 transition-colors shadow-md hover:shadow-lg"
              >
                <FileText className="w-5 h-5 mr-2" />
                WCAG Resources
              </Link>
            </div>
          </div>

          {/* Search */}
          <div className="max-w-2xl mx-auto mb-12">
            <div className="relative">
              <input
                type="text"
                placeholder="Search help articles..."
                aria-label="Search help articles"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-12 py-4 border border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg transition-shadow hover:shadow-md"
              />
              <Search className="absolute left-4 top-4 text-gray-400 w-6 h-6" />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label="Clear search"
                >
                  <X className="w-6 h-6" />
                </button>
              )}
            </div>
          </div>

          {/* Categories */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 min-h-[400px]">
            {filteredCategories.length === 0 ? (
              <div className="col-span-full">
                <EmptyState
                  title="No Results Found"
                  description="Try adjusting your search terms or browse all categories"
                  icon={<Search className="h-6 w-6 text-gray-600" />}
                />
              </div>
            ) : (
              filteredCategories.map((category) => (
                <div
                  key={category.id}
                  className="bg-white rounded-xl shadow-sm p-8 hover:shadow-md transition-all hover:-translate-y-1 border border-gray-100"
                >
                  <div className="flex items-center mb-4">
                    <div className="p-3 bg-blue-50 rounded-xl">
                      {React.createElement(
                        category.icon === 'Book' ? Book :
                        category.icon === 'FileText' ? FileText :
                        category.icon === 'Code' ? Code :
                        category.icon === 'Settings' ? Settings :
                        category.icon === 'Globe' ? Globe :
                        category.icon === 'HelpCircle' ? HelpCircle :
                        Shield,
                        { className: "w-7 h-7 text-blue-600" }
                      )}
                    </div>
                    <h2 className="ml-3 text-xl font-semibold text-gray-900 font-display truncate">
                      {category.name}
                    </h2>
                  </div>
                  
                  <p className="text-gray-600 mb-6 text-base">
                    {category.description}
                  </p>

                  <ul className="space-y-4">
                    {category.articles.map((article) => (
                      <li key={article.id}>
                        <Link
                          to={`/help/${article.slug}`}
                          className="group flex items-center text-gray-700 hover:text-blue-600 transition-colors"
                        >
                          <FileText className="w-4 h-4 mr-2 text-gray-400 group-hover:text-blue-500" />
                          {article.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))
            )}
          </div>

          {/* Contact Support */}
          <div className="mt-16 bg-blue-600 rounded-xl shadow-sm p-8 text-center">
            <h2 className="text-2xl font-bold text-white mb-4">
              Can't find what you're looking for?
            </h2>
            <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
              Our support team is here to help. Get in touch with us and we'll help you resolve any issues.
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center px-8 py-4 border border-transparent text-lg font-medium rounded-xl text-blue-700 bg-white hover:bg-blue-50 transition-colors shadow-lg hover:shadow-xl"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </div>
      <Footer />
      <BackToTop />
    </>
  );
}