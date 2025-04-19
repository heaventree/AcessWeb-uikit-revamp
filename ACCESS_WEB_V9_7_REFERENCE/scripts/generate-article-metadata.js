/**
 * Script to generate and add SEO metadata to WCAG resource articles
 * 
 * This script processes all article files to:
 * 1. Generate SEO-friendly metadata
 * 2. Add meta title, description, and keywords
 * 3. Add schema.org structured data for articles
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const articlesDir = path.join(__dirname, '../src/data/articles/wcag-resources');

// Read all files in the articles directory
const files = fs.readdirSync(articlesDir).filter(file => 
  file.startsWith('wcag-resource-') && file.endsWith('.ts')
);

console.log(`Found ${files.length} article files to add metadata.`);

let improvedCount = 0;

// Process each file
files.forEach(file => {
  const filePath = path.join(articlesDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Extract title, description and tags
  const titleMatch = content.match(/"title":\s*"([^"]+)"/);
  const descriptionMatch = content.match(/"description":\s*"([^"]+)"/);
  const tagsMatch = content.match(/"tags":\s*\[([\s\S]*?)\]/);
  
  if (titleMatch && descriptionMatch && tagsMatch) {
    const title = titleMatch[1];
    const description = descriptionMatch[1];
    
    // Parse tags
    const tags = tagsMatch[1]
      .replace(/"/g, '')
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0);
    
    // Check if metadata already exists
    const hasMetadata = content.includes('"metadata":');
    
    if (!hasMetadata) {
      // Generate metadata object
      const metadata = {
        // 1. SEO title (optimize for search engines)
        metaTitle: `${title} | WCAG Accessibility Guide`,
        
        // 2. Meta description (use the article description, truncated if needed)
        metaDescription: description.length > 160 
          ? description.substring(0, 157) + '...' 
          : description,
        
        // 3. Keywords from tags
        metaKeywords: tags.join(', '),
        
        // 4. Schema.org structured data for article
        structuredData: {
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: title,
          description: description,
          // Use generic values for other fields
          image: 'IMAGE_URL_PLACEHOLDER',
          author: {
            '@type': 'Organization',
            name: 'Accessibility Team'
          },
          publisher: {
            '@type': 'Organization',
            name: 'WCAG 9.4 Audit',
            logo: {
              '@type': 'ImageObject',
              url: 'LOGO_URL_PLACEHOLDER'
            }
          },
          datePublished: 'PUBLISHED_DATE_PLACEHOLDER',
          dateModified: 'MODIFIED_DATE_PLACEHOLDER'
        }
      };
      
      // Convert metadata to string format compatible with the file structure
      const metadataString = JSON.stringify(metadata, null, 2)
        .replace(/"([^"]+)":/g, '    $1:') // Format property names
        .replace(/"PUBLISHED_DATE_PLACEHOLDER"/g, 'publishedAt')
        .replace(/"MODIFIED_DATE_PLACEHOLDER"/g, 'updatedAt')
        .replace(/"IMAGE_URL_PLACEHOLDER"/g, 'vectorImage')
        .replace(/"LOGO_URL_PLACEHOLDER"/g, '`${window.location.origin}/logo.svg`');
      
      // Find position to insert metadata (before the closing bracket of the article object)
      const lastBracketPos = content.lastIndexOf('}');
      
      if (lastBracketPos !== -1) {
        // Insert metadata at the appropriate position
        const updatedContent = 
          content.substring(0, lastBracketPos) + 
          ',\n  "metadata": ' + metadataString + '\n' + 
          content.substring(lastBracketPos);
        
        fs.writeFileSync(filePath, updatedContent, 'utf8');
        improvedCount++;
        console.log(`Added metadata to: ${file}`);
      }
    }
  }
});

console.log(`Completed metadata processing. Added metadata to ${improvedCount} files.`);