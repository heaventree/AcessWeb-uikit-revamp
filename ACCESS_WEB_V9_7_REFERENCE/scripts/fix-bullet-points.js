/**
 * Script to fix bullet point formatting in all WCAG resource articles
 * 
 * This script processes all article files to ensure consistent bullet point formatting
 * by removing extra line breaks between bullet points.
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

console.log(`Found ${files.length} article files to process.`);

let fixedCount = 0;

// Process each file
files.forEach(file => {
  const filePath = path.join(articlesDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Find the content property in the article objects
  const contentMatch = content.match(/"content":\s*"([^"]+)"/);
  
  if (contentMatch && contentMatch[1]) {
    let articleContent = contentMatch[1];
    
    // Fix bullet point formatting by replacing patterns where there are extra line breaks
    // between bullet points
    
    // Pattern 1: Fix bullet points with asterisks that have blank lines between them
    let fixedContent = articleContent.replace(/\n\n\*\s+/g, '\n* ');
    
    // Pattern 2: Fix numbered lists with blank lines between them
    fixedContent = fixedContent.replace(/\n\n(\d+\.\s+)/g, '\n$1');
    
    // Pattern 3: Fix bullet points with dashes that have blank lines between them
    fixedContent = fixedContent.replace(/\n\n-\s+/g, '\n- ');
    
    // If changes were made, update the file
    if (fixedContent !== articleContent) {
      const updatedContent = content.replace(contentMatch[0], `"content": "${fixedContent}"`);
      fs.writeFileSync(filePath, updatedContent, 'utf8');
      fixedCount++;
      console.log(`Fixed bullet points in: ${file}`);
    }
  }
});

console.log(`Completed processing. Fixed ${fixedCount} files.`);