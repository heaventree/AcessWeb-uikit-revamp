import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  wcagResourceArticles,
  perceivableArticles,
  operableArticles,
  understandableArticles,
  robustArticles
} from '../data/articles/wcag-resources';
import { ArticleCard } from '../components/blog/ArticleCard';
import { BackToTop } from '../components/BackToTop';
import { SearchInput } from '../components/blog/SearchInput';
import type { Article } from '../types/blog';

type CategoryTab = 'all' | 'perceivable' | 'operable' | 'understandable' | 'robust';

export function WcagResourcesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<CategoryTab>('all');
  
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };
  
  const filterArticles = (articles: Article[]) => {
    if (!searchQuery) return articles;
    
    const query = searchQuery.toLowerCase();
    return articles.filter(article => 
      article.title.toLowerCase().includes(query) || 
      article.description.toLowerCase().includes(query) ||
      article.tags.some(tag => tag.toLowerCase().includes(query))
    );
  };
  
  const getArticlesForTab = (): Article[] => {
    switch (activeTab) {
      case 'perceivable': return perceivableArticles;
      case 'operable': return operableArticles;
      case 'understandable': return understandableArticles;
      case 'robust': return robustArticles;
      case 'all':
      default:
        return wcagResourceArticles;
    }
  };
  
  const filteredArticles = filterArticles(getArticlesForTab());
  
  return (
    <div className="container mx-auto px-4 py-8">
      {/* SEO would be handled by a Helmet component in a complete implementation */}
      
      <section className="mb-12">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold mb-4">WCAG Resources Library</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto dark:text-gray-300">
            Comprehensive educational resources for understanding WCAG guidelines and implementing accessible web practices.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
          <SearchInput onSearch={handleSearch} />
          
          <Link 
            to="/blog" 
            className="mt-4 sm:mt-0 text-blue-600 dark:text-blue-400 hover:underline flex items-center"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Blog
          </Link>
        </div>
        
        {/* Category Tabs */}
        <div className="border-b border-gray-200 dark:border-gray-700 mb-8">
          <nav className="-mb-px flex space-x-6 overflow-x-auto pb-1">
            <button
              onClick={() => setActiveTab('all')}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'all'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              All Resources ({wcagResourceArticles.length})
            </button>
            <button
              onClick={() => setActiveTab('perceivable')}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'perceivable'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              Perceivable ({perceivableArticles.length})
            </button>
            <button
              onClick={() => setActiveTab('operable')}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'operable'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              Operable ({operableArticles.length})
            </button>
            <button
              onClick={() => setActiveTab('understandable')}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'understandable'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              Understandable ({understandableArticles.length})
            </button>
            <button
              onClick={() => setActiveTab('robust')}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'robust'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              Robust ({robustArticles.length})
            </button>
          </nav>
        </div>
      </section>
      
      {/* Articles Grid */}
      <section className="mb-12">
        {filteredArticles.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-2xl font-medium text-gray-900 dark:text-white mb-2">No resources found</h3>
            <p className="text-gray-500 dark:text-gray-400">Try adjusting your search or filter criteria.</p>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {filteredArticles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        )}
      </section>
      
      {/* About WCAG Section */}
      <section className="mb-12 bg-gray-100 dark:bg-gray-800 p-6 rounded-lg">
        <h2 className="text-2xl font-bold mb-4">About WCAG</h2>
        <p className="mb-4">
          The Web Content Accessibility Guidelines (WCAG) are developed through the W3C process in cooperation 
          with individuals and organizations around the world, with a goal of providing a single shared standard 
          for web content accessibility that meets the needs of individuals, organizations, and governments internationally.
        </p>
        <p className="mb-4">
          WCAG is organized around four core principles, often referred to as POUR:
        </p>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          <li><strong>Perceivable</strong>: Information and user interface components must be presentable to users in ways they can perceive.</li>
          <li><strong>Operable</strong>: User interface components and navigation must be operable.</li>
          <li><strong>Understandable</strong>: Information and the operation of the user interface must be understandable.</li>
          <li><strong>Robust</strong>: Content must be robust enough that it can be interpreted reliably by a wide variety of user agents, including assistive technologies.</li>
        </ul>
        <a 
          href="https://www.w3.org/WAI/standards-guidelines/wcag/" 
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 dark:text-blue-400 hover:underline"
        >
          Learn more about WCAG at W3C
        </a>
      </section>
      
      <BackToTop />
    </div>
  );
}