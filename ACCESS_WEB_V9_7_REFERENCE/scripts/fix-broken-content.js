/**
 * Script to fix broken content in all WCAG resource articles
 * This script will restore the articles to their working state by fixing common content issues
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
for (const file of files) {
  const filePath = path.join(articlesDir, file);
  const content = fs.readFileSync(filePath, 'utf8');
  let updatedContent = content;
  
  // Check if the file has valid syntax
  try {
    // Check for incomplete string escaping
    if (updatedContent.includes('if(event.key===\'Enter\')')) {
      updatedContent = updatedContent.replace(/if\(event\.key===\\'Enter\\'\)/g, "if(event.key==='Enter')");
    }
    
    // Check for implementation tips that might have been added incorrectly
    if (updatedContent.includes('## Implementation Tips') && !updatedContent.includes('tableOfContents')) {
      // Extract the content section
      const contentMatch = updatedContent.match(/"content":\s*"([\s\S]*?)",\s*"category"/);
      if (contentMatch) {
        const originalContent = contentMatch[1];
        
        // Remove the implementation tips section that was added
        let newContent = originalContent;
        const implementationTipsStart = newContent.indexOf('\\n\\n## Implementation Tips');
        if (implementationTipsStart > 0) {
          newContent = newContent.substring(0, implementationTipsStart);
        }
        
        // Update the content
        updatedContent = updatedContent.replace(contentMatch[0], `"content": "${newContent}",\n  "category"`);
      }
    }
    
    // Check for unescaped quotes that might break the JSON
    if (updatedContent.includes('"content": "')) {
      const contentMatch = updatedContent.match(/"content":\s*"([\s\S]*?)",\s*"category"/);
      if (contentMatch) {
        const originalContent = contentMatch[1];
        
        // Ensure all quotes within content are properly escaped
        let fixedContent = originalContent.replace(/(?<!\\)"/g, '\\"');
        
        // Update the content if changes were made
        if (fixedContent !== originalContent) {
          updatedContent = updatedContent.replace(contentMatch[0], `"content": "${fixedContent}",\n  "category"`);
        }
      }
    }
    
    // Write the fixed content back to the file if changes were made
    if (updatedContent !== content) {
      fs.writeFileSync(filePath, updatedContent, 'utf8');
      fixedCount++;
      console.log(`Fixed content in: ${file}`);
    }
  } catch (error) {
    console.error(`Error processing ${file}:`, error);
  }
}

console.log(`Completed processing. Fixed ${fixedCount} files.`);