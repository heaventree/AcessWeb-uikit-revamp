import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

export function useDocumentation(slug: string, pathPrefix: string = '') {
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDocumentation() {
      try {
        setLoading(true);
        
        // Map slug to documentation file
        let documentationPath = '';
        
        switch (slug) {
          case 'media-accessibility-testing-guide':
            documentationPath = '/src/data/documentation/mediaAccessibility.md';
            break;
          case 'html-structure-analysis-guide':
            documentationPath = '/src/data/documentation/htmlStructureAnalysis.md';
            break;
          case 'responsive-design-analysis-guide':
            documentationPath = '/src/data/documentation/responsiveDesignAnalysis.md';
            break;
          case 'export-accessibility-reports-guide':
            documentationPath = '/src/data/documentation/exportReports.md';
            break;
          case 'section-identifier-system-guide':
            documentationPath = '/src/data/documentation/sectionIdentifier.md';
            break;
          case 'url-design-analysis-guide':
            documentationPath = '/src/data/documentation/urlDesignAnalysis.md';
            break;
          case 'ai-recommendations-guide':
            documentationPath = '/src/data/documentation/aiRecommendations.md';
            break;
          default:
            throw new Error('Documentation not found');
        }
        
        // Fetch the documentation file
        const response = await fetch(documentationPath);
        
        if (!response.ok) {
          throw new Error(`Failed to load documentation: ${response.statusText}`);
        }
        
        const text = await response.text();
        setContent(text);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to load documentation';
        setError(message);
        toast.error(message);
      } finally {
        setLoading(false);
      }
    }

    if (slug) {
      fetchDocumentation();
    }
  }, [slug, pathPrefix]);

  return {
    content,
    loading,
    error
  };
}