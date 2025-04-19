import React, { useState } from 'react';
import { useArticleGeneration } from '../../hooks/useArticleGeneration';
import { Loader, Plus, BookOpen, RefreshCw } from 'lucide-react';
import type { Article } from '../../types/blog';
import { toast } from 'react-hot-toast';

export function ChatGPTArticleGenerator() {
  const { generateSingleArticle, generateSeries, loading } = useArticleGeneration();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<'wcag' | 'accessibility' | 'best-practices'>('wcag');
  const [tags, setTags] = useState('');
  const [generatedArticle, setGeneratedArticle] = useState<Partial<Article> | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const articleRequest = {
      title,
      description,
      category,
      tags: tags.split(',').map(tag => tag.trim())
    };

    const article = await generateSingleArticle(articleRequest);
    if (article) {
      setGeneratedArticle(article);
    }
  };

  const handleGenerateSeries = async () => {
    const topic = prompt('Enter the topic for the article series:');
    if (!topic) return;

    const count = parseInt(prompt('How many articles in the series? (default: 3)', '3') || '3');
    const articles = await generateSeries(topic, count);
    
    if (articles) {
      toast.success(`Generated ${articles.length} articles in the series`);
      // TODO: Handle the series of articles
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">ChatGPT Article Generator</h2>
        <button
          onClick={handleGenerateSeries}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700"
          disabled={loading}
        >
          <Plus className="w-5 h-5 mr-2" />
          Generate Series
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Article Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
            required
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
            required
          />
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700">
            Category
          </label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value as typeof category)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
          >
            <option value="wcag">WCAG</option>
            <option value="accessibility">Accessibility</option>
            <option value="best-practices">Best Practices</option>
          </select>
        </div>

        <div>
          <label htmlFor="tags" className="block text-sm font-medium text-gray-700">
            Tags (comma-separated)
          </label>
          <input
            type="text"
            id="tags"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
            placeholder="WCAG 2.1, Accessibility, Implementation"
            required
          />
        </div>

        <div className="flex justify-end space-x-3">
          {generatedArticle && (
            <button
              type="button"
              onClick={() => setGeneratedArticle(null)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <RefreshCw className="w-5 h-5 mr-2" />
              Clear Result
            </button>
          )}
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader className="w-5 h-5 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <BookOpen className="w-5 h-5 mr-2" />
                Generate Article
              </>
            )}
          </button>
        </div>
      </form>

      {generatedArticle && (
        <div className="mt-8 border-t pt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Generated Article</h3>
          <div className="prose prose-sm max-h-96 overflow-y-auto">
            <h4 className="text-xl font-bold">{generatedArticle.title}</h4>
            <p className="text-gray-600">{generatedArticle.description}</p>
            <div className="mt-4">
              <h5 className="font-medium">Content Preview:</h5>
              <pre className="mt-2 p-4 bg-gray-50 rounded-lg overflow-x-auto">
                {generatedArticle.content?.slice(0, 500)}...
              </pre>
            </div>
            <div className="mt-4">
              <h5 className="font-medium">Table of Contents:</h5>
              <ul>
                {generatedArticle.tableOfContents?.map((item) => (
                  <li key={item.id} style={{ marginLeft: `${(item.level - 2) * 1}rem` }}>
                    {item.title}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}