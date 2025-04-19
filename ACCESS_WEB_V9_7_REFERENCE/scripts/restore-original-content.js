/**
 * Script to completely restore all WCAG resource articles to their original state
 * This will remove any implementation tips or content enhancements we've added
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

console.log(`Found ${files.length} article files to restore.`);

let restoredCount = 0;

// Process each file
for (const file of files) {
  const filePath = path.join(articlesDir, file);
  const content = fs.readFileSync(filePath, 'utf8');
  
  // Extract the content section
  const contentMatch = content.match(/"content":\s*"([\s\S]*?)",\s*"category"/);
  
  if (contentMatch && contentMatch[1]) {
    const originalContent = contentMatch[1];
    let newContent = originalContent;
    
    // Remove any implementation tips sections
    if (newContent.includes('## Implementation Tips')) {
      const implementationTipsIndex = newContent.indexOf('\\n\\n## Implementation Tips');
      if (implementationTipsIndex > 0) {
        newContent = newContent.substring(0, implementationTipsIndex);
      }
    }
    
    // Remove any WCAG criterion references we added
    newContent = newContent.replace(/\\n> \*\*Related WCAG Criterion\*\*: WCAG [0-9.()]+ [^\\n]+\\n/g, '');
    
    // Remove any additional content we added to sections
    newContent = newContent.replace(/\\nWeb accessibility is not just a checklist but an ongoing commitment[^\\n]+\\n/g, '');
    newContent = newContent.replace(/\\nImplementing these accessibility best practices benefits[^\\n]+\\n/g, '');
    newContent = newContent.replace(/\\nConsistent implementation across your website[^\\n]+\\n/g, '');
    
    // If changes were made, update the file
    if (originalContent !== newContent) {
      const updatedContent = content.replace(
        contentMatch[0],
        `"content": "${newContent}",\n  "category"`
      );
      
      try {
        fs.writeFileSync(filePath, updatedContent, 'utf8');
        restoredCount++;
        console.log(`Restored original content in: ${file}`);
      } catch (error) {
        console.error(`Error updating ${file}:`, error);
      }
    }
  } else {
    console.log(`Could not find content in: ${file}`);
  }
}

console.log(`Completed restoration. Restored ${restoredCount} files to original state.`);