
import { Link } from 'react-router-dom';
import { Clock, Calendar, BookOpen, FileText, RefreshCw } from 'lucide-react';
import type { Article } from '../../types/blog';

interface ArticleCardProps {
  article: Article;
  featured?: boolean;
}

export function ArticleCard({ article, featured = false }: ArticleCardProps) {
  return (
    <div 
      className={`bg-white rounded-xl shadow-sm overflow-hidden transition-transform duration-300 hover:-translate-y-1 ${
        featured ? 'lg:col-span-2 md:flex' : ''
      }`}
    >
      <div className={`relative ${featured ? 'md:w-2/5' : ''}`}>
        <img
          src={article.vectorImage}
          alt=""
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          <span className={`px-3 py-1 text-sm font-medium ${
            article.category === 'wcag-resources' 
              ? 'bg-green-600' 
              : 'bg-blue-600'
          } text-white rounded-full flex items-center`}>
            {article.category === 'wcag-resources' ? (
              <>
                <BookOpen className="w-3 h-3 mr-1" />
                WCAG Resource
              </>
            ) : (
              article.category
            )}
          </span>
          {article.isResource && (
            <span className="px-3 py-1 text-sm font-medium bg-amber-600 text-white rounded-full flex items-center">
              <FileText className="w-3 h-3 mr-1" />
              Reference
            </span>
          )}
        </div>
      </div>
      
      <div className={`p-6 ${featured ? 'md:w-3/5' : ''}`}>
        <div className="flex items-center mb-4">
          <img
            src={article.author.avatar}
            alt={article.author.name}
            className="w-10 h-10 rounded-full"
          />
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-900">{article.author.name}</p>
            <p className="text-sm text-gray-500">{article.author.role}</p>
          </div>
        </div>

        <h3 className="text-xl font-bold text-gray-900 mb-2">
          <Link to={`/blog/${article.slug}`} className="hover:text-blue-600">
            {article.title}
          </Link>
        </h3>

        <p className="text-gray-600 mb-4 line-clamp-2">
          {article.description}
        </p>

        <div className="flex flex-wrap items-center text-sm text-gray-500 gap-x-4 gap-y-2">
          <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-1" />
            <span title={`Published on ${new Date(article.publishedAt).toLocaleDateString('en-GB')}`}>
              {new Date(article.publishedAt).toLocaleDateString('en-GB')}
            </span>
          </div>
          {article.updatedAt && (
            <div className="flex items-center">
              <RefreshCw className="w-4 h-4 mr-1" />
              <span title={`Updated on ${new Date(article.updatedAt).toLocaleDateString('en-GB')}`}>
                Updated {new Date(article.updatedAt).toLocaleDateString('en-GB')}
              </span>
            </div>
          )}
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-1" />
            {article.readingTime}
          </div>
        </div>
      </div>
    </div>
  );
}