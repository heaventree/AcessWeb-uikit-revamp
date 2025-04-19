/**
 * Script to fix article metadata formatting to work with TypeScript
 * 
 * This script processes all article files with metadata to:
 * 1. Fix the JSON structure to be TypeScript compatible
 * 2. Replace @ symbols with underscore prefixes in property names
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

console.log(`Found ${files.length} article files to check for metadata issues.`);

let fixedCount = 0;

// Process each file
files.forEach(file => {
  const filePath = path.join(articlesDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Check if this file has the metadata with @ symbols issue
  if (content.includes('"metadata":') && (content.includes('@context') || content.includes('@type'))) {
    console.log(`Fixing metadata in: ${file}`);
    
    // Fix the metadata format to use underscores instead of @ symbols
    content = content.replace(/@context/g, '_context');
    content = content.replace(/@type/g, '_type');
    
    // Write the fixed content back to the file
    fs.writeFileSync(filePath, content, 'utf8');
    fixedCount++;
  }
});

console.log(`Completed fixes. Fixed metadata in ${fixedCount} files.`);