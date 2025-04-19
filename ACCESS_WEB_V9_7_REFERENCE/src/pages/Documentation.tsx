import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Book, FileText, Code, Globe, X, HelpCircle } from 'lucide-react';
import { Navigation } from '../components/Navigation';
import { Footer } from '../components/Footer';
import { BackToTop } from '../components/BackToTop';
import { EmptyState } from '../components/EmptyState';

// Documentation guides
const documentationGuides = [
  {
    id: 'html-structure',
    category: 'Core Testing Features',
    title: 'HTML Structure Analysis',
    description: 'Learn how to identify and fix heading hierarchy, semantic HTML, and document structure issues',
    slug: 'html-structure-analysis-guide',
    icon: 'FileText'
  },
  {
    id: 'responsive-design',
    category: 'Core Testing Features',
    title: 'Responsive Design Analysis',
    description: 'Test for mobile accessibility and device compatibility issues',
    slug: 'responsive-design-analysis-guide',
    icon: 'Smartphone'
  },
  {
    id: 'url-design',
    category: 'Core Testing Features',
    title: 'URL Design Analysis',
    description: 'Evaluate URL structure and readability for better accessibility',
    slug: 'url-design-analysis-guide',
    icon: 'Link'
  },
  {
    id: 'media-accessibility',
    category: 'Core Testing Features',
    title: 'Media Accessibility Testing',
    description: 'Analyze video, audio, and embedded media for accessibility compliance',
    slug: 'media-accessibility-testing-guide',
    icon: 'Video'
  },
  {
    id: 'export-reports',
    category: 'Advanced Features',
    title: 'Export Accessibility Reports',
    description: 'Generate comprehensive PDF reports of accessibility testing results',
    slug: 'export-accessibility-reports-guide',
    icon: 'FileOutput'
  },
  {
    id: 'section-identifier',
    category: 'Advanced Features',
    title: 'Section Identifier System',
    description: 'Use visual indicators to pinpoint accessibility issues on your page',
    slug: 'section-identifier-system-guide',
    icon: 'Map'
  },
  {
    id: 'ai-recommendations',
    category: 'Advanced Features',
    title: 'AI Recommendations',
    description: 'Get intelligent suggestions for fixing accessibility issues',
    slug: 'ai-recommendations-guide',
    icon: 'Sparkles'
  }
];

// Documentation guides are grouped dynamically based on search query below

export function Documentation() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredGuides = searchQuery 
    ? documentationGuides.filter(guide => 
        guide.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        guide.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        guide.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : documentationGuides;

  // Group filtered guides by category
  const filteredAndGrouped = filteredGuides.reduce((acc, guide) => {
    if (!acc[guide.category]) {
      acc[guide.category] = [];
    }
    acc[guide.category].push(guide);
    return acc;
  }, {} as Record<string, typeof documentationGuides>);

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'FileText': return <FileText className="w-6 h-6 text-blue-600" />;
      case 'Smartphone': return <HelpCircle className="w-6 h-6 text-blue-600" />;
      case 'Link': return <Globe className="w-6 h-6 text-blue-600" />;
      case 'Video': return <FileText className="w-6 h-6 text-blue-600" />;
      case 'FileOutput': return <FileText className="w-6 h-6 text-blue-600" />;
      case 'Map': return <Globe className="w-6 h-6 text-blue-600" />;
      case 'Sparkles': return <Code className="w-6 h-6 text-blue-600" />;
      default: return <Book className="w-6 h-6 text-blue-600" />;
    }
  };

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gray-50 pt-[130px] pb-[130px]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-gray-900 mb-6 font-display">
              Documentation
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Comprehensive guides for all features of the WCAG Accessibility Platform
            </p>
          </div>

          {/* Search */}
          <div className="max-w-2xl mx-auto mb-12">
            <div className="relative">
              <input
                type="text"
                placeholder="Search documentation..."
                aria-label="Search documentation"
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

          {/* Documentation Guides */}
          {filteredGuides.length === 0 ? (
            <div className="max-w-3xl mx-auto">
              <EmptyState
                title="No Documentation Found"
                description="Try adjusting your search terms"
                icon={<Search className="h-6 w-6 text-gray-600" />}
                action={{
                  label: "Clear Search",
                  onClick: () => setSearchQuery('')
                }}
              />
            </div>
          ) : (
            Object.entries(filteredAndGrouped).map(([category, guides]) => (
              <div key={category} className="mb-16">
                <h2 className="text-2xl font-bold text-gray-900 mb-8 font-display">
                  {category}
                </h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {guides.map((guide) => (
                    <Link
                      key={guide.id}
                      to={`/docs/${guide.slug}`}
                      className="bg-white rounded-xl shadow-sm p-8 hover:shadow-md transition-all hover:-translate-y-1 border border-gray-100 flex flex-col h-full"
                    >
                      <div className="flex items-center mb-4">
                        <div className="p-3 bg-blue-50 rounded-xl">
                          {getIconComponent(guide.icon)}
                        </div>
                        <h3 className="ml-3 text-xl font-semibold text-gray-900 font-display">
                          {guide.title}
                        </h3>
                      </div>
                      <p className="text-gray-600 mb-6 text-base flex-grow">
                        {guide.description}
                      </p>
                      <div className="flex justify-end mt-auto">
                        <span className="text-blue-600 font-medium flex items-center">
                          Read documentation
                          <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ))
          )}

          {/* Resource Links */}
          <div className="mt-16 text-center space-x-4">
            <Link
              to="/"
              className="inline-flex items-center px-8 py-4 border border-gray-200 text-lg font-medium rounded-xl text-gray-700 bg-white hover:bg-gray-50 transition-colors shadow-sm hover:shadow-md"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Home
            </Link>
            <Link
              to="/wcag-resources"
              className="inline-flex items-center px-8 py-4 border border-gray-200 text-lg font-medium rounded-xl text-gray-700 bg-white hover:bg-gray-50 transition-colors shadow-sm hover:shadow-md"
            >
              <Book className="w-5 h-5 mr-2" />
              WCAG Resources
            </Link>
          </div>
        </div>
      </div>
      <Footer />
      <BackToTop />
    </>
  );
}