import React, { useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { marked } from 'marked';
import { ArticleLayout } from '../components/blog/ArticleLayout';
import { articles } from '../data/articles';

export function ArticlePage() {
  const { slug } = useParams<{ slug: string }>();
  
  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Find the article by slug
  const article = articles.find(a => a.slug === slug);

  // If article not found, redirect to blog page
  if (!article) {
    return <Navigate to="/blog" replace />;
  }

  // Configure marked options
  marked.use({
    headerIds: true,
    gfm: true,
    breaks: true,
    mangle: false
  });

  // Process the markdown content to ensure proper heading IDs
  const renderer = new marked.Renderer();
  
  // Override heading renderer to ensure proper IDs and skip the first h1
  let isFirstH1 = true;
  renderer.heading = (text, level) => {
    // Skip the first h1 as it's already shown in the layout
    if (level === 1 && isFirstH1) {
      isFirstH1 = false;
      return '';
    }

    // Create a consistent ID format
    const id = text
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
      .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
      
    return `<h${level} id="${id}">${text}</h${level}>`;
  };

  marked.setOptions({ renderer });

  return (
    <ArticleLayout article={article}>
      <div 
        className="prose prose-lg max-w-none dark:prose-invert"
        dangerouslySetInnerHTML={{ 
          __html: marked(article.content)
        }}
      />
    </ArticleLayout>
  );
}