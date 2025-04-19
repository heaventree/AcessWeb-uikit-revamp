import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Clock, Calendar, Share2, ChevronLeft, RefreshCw } from 'lucide-react';
import { URLInput } from '../URLInput';
import type { Article } from '../../types/blog';

interface ArticleLayoutProps {
  article: Article;
  children: React.ReactNode;
}

export function ArticleLayout({ article, children }: ArticleLayoutProps) {
  const [activeSection, setActiveSection] = useState<string>('');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { 
        rootMargin: '-20% 0px -80% 0px',
        threshold: 0.5 
      }
    );

    setTimeout(() => {
      document.querySelectorAll('h2[id], h3[id]').forEach((heading) => {
        observer.observe(heading);
      });
    }, 100);

    return () => observer.disconnect();
  }, []);

  const handleTOCClick = (id: string) => {
    const formattedId = id
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');

    const element = document.getElementById(formattedId);
    if (element) {
      const offset = 150;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-[130px] pb-[130px]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-8">
            <Link
              to="/blog"
              className="inline-flex items-center text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white mb-8"
            >
              <ChevronLeft className="w-5 h-5 mr-2" />
              Back to Articles
            </Link>

            <article className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8">
              <header className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white leading-[1.4]">
                  {article.title}
                </h1>
                
                <div className="flex flex-wrap items-center gap-4 text-gray-600 dark:text-gray-400 mt-4">
                  <div className="flex items-center" title={`Published on ${new Date(article.publishedAt).toLocaleDateString('en-GB')}`}>
                    <Calendar className="w-4 h-4 mr-2" />
                    {new Date(article.publishedAt).toLocaleDateString('en-GB')}
                  </div>
                  {article.updatedAt && (
                    <div className="flex items-center" title={`Last updated on ${new Date(article.updatedAt).toLocaleDateString('en-GB')}`}>
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Updated {new Date(article.updatedAt).toLocaleDateString('en-GB')}
                    </div>
                  )}
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-2" />
                    {article.readingTime}
                  </div>
                  <button
                    className="flex items-center hover:text-gray-900 dark:hover:text-white"
                    onClick={() => {/* Implement share functionality */}}
                  >
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                  </button>
                </div>
              </header>

              <div className="prose prose-lg dark:prose-invert max-w-none">
                {children}
              </div>
            </article>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4">
            <div className="sticky top-[150px]">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mb-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Table of Contents
                </h2>
                <nav className="toc-nav">
                  <ul className="space-y-3">
                    {article.tableOfContents.map((item) => {
                      const formattedId = item.title
                        .toLowerCase()
                        .replace(/[^a-z0-9\s]/g, '')
                        .replace(/\s+/g, '-')
                        .replace(/-+/g, '-')
                        .replace(/^-|-$/g, '');

                      return (
                        <li
                          key={formattedId}
                          style={{ marginLeft: `${(item.level - 2) * 1}rem` }}
                        >
                          <button
                            onClick={() => handleTOCClick(item.title)}
                            className={`block w-full text-left py-1 text-sm transition-colors ${
                              activeSection === formattedId
                                ? 'text-blue-600 dark:text-blue-400 font-medium'
                                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                            }`}
                          >
                            {item.title}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </nav>
              </div>

              {article.relatedArticles && (
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Related Articles
                  </h2>
                  <ul className="space-y-4">
                    {article.relatedArticles.map((relatedArticle) => (
                      <li key={relatedArticle}>
                        <Link
                          to={`/blog/${relatedArticle}`}
                          className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                        >
                          {relatedArticle}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}