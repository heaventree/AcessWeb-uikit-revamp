/**
 * Script to remove broken metadata from all WCAG resource articles
 * This script will restore the articles to their working state by removing the metadata that's causing errors
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

console.log(`Found ${files.length} article files to fix.`);

let fixedCount = 0;

// Process each file
files.forEach(file => {
  const filePath = path.join(articlesDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Check if this file has the problematic metadata
  if (content.includes('"metadata":')) {
    console.log(`Fixing ${file} by removing metadata...`);
    
    // Remove the entire metadata section
    // Find position where metadata starts
    const metadataStart = content.indexOf(',\n  "metadata":');
    if (metadataStart !== -1) {
      // Find the end bracket of the article object
      const objectEnd = content.lastIndexOf('}');
      if (objectEnd !== -1 && objectEnd > metadataStart) {
        // Remove the metadata section
        const fixedContent = 
          content.substring(0, metadataStart) + 
          '\n' + 
          content.substring(objectEnd);
        
        fs.writeFileSync(filePath, fixedContent, 'utf8');
        fixedCount++;
      }
    }
  }
});

console.log(`Fixed ${fixedCount} files by removing problematic metadata.`);