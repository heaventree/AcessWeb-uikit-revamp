/**
 * Script to enhance a single WCAG resource article for testing
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const articlesDir = path.join(__dirname, '../src/data/articles/wcag-resources');
const targetFile = 'wcag-resource-2.ts'; // We'll enhance this specific article

// Main processing function
async function enhanceArticle() {
  console.log(`Enhancing article: ${targetFile}`);
  
  const filePath = path.join(articlesDir, targetFile);
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Save a backup just in case
  fs.writeFileSync(`${filePath}.bak`, content, 'utf8');
  console.log('Backup created.');
  
  // Find the actual content - it's between the "content": " and the next property
  const contentStart = content.indexOf('"content": "');
  if (contentStart === -1) {
    console.log('Could not find content property.');
    return;
  }
  
  // Extract just the content portion for manipulation
  const contentStartQuote = contentStart + 12; // Length of '"content": "'
  
  // Find the end of the content - looking for the closing quote followed by a comma or newline
  let contentEndQuote = -1;
  let nestedQuotes = 0;
  let inEscape = false;
  
  for (let i = contentStartQuote; i < content.length; i++) {
    const char = content[i];
    
    if (inEscape) {
      inEscape = false;
      continue;
    }
    
    if (char === '\\') {
      inEscape = true;
      continue;
    }
    
    if (char === '"') {
      if (content.substring(i-1, i+2) === '\\"' || content.substring(i-2, i+1) === '\\"') {
        // This is an escaped quote, not the end
        continue;
      }
      
      // Check if this is the end of the content string
      if (i + 1 < content.length && (content[i+1] === ',' || content[i+1] === '\n')) {
        contentEndQuote = i;
        break;
      }
    }
  }
  
  if (contentEndQuote === -1) {
    console.log('Could not find end of content.');
    return;
  }
  
  // Extract the content string
  let articleContent = content.substring(contentStartQuote, contentEndQuote);
  const originalContent = articleContent;
  
  console.log('Found article content. Processing improvements...');
  
  // Make improvements to the content
  // 1. Improve code examples by adding better comments
  articleContent = articleContent.replace(/```html\\n([^`]+)```/g, (match, code) => {
    let enhancedCode = code;
    
    // Add comments for image accessibility
    if (enhancedCode.includes('<img') && !enhancedCode.includes('<!-- Accessibility:')) {
      enhancedCode = enhancedCode.replace(/<img([^>]+)>/g, (imgMatch, imgAttrs) => {
        if (imgAttrs.includes('alt=')) {
          return `<!-- Accessibility: Images must have descriptive alt text -->\\n${imgMatch}`;
        } else {
          return `<!-- Accessibility: Missing alt attribute -->\\n${imgMatch}`;
        }
      });
    }
    
    // Add comments for ARIA attributes
    if (enhancedCode.includes('aria-') && !enhancedCode.includes('<!-- ARIA:')) {
      enhancedCode = enhancedCode.replace(/aria-([a-z]+)/g, (match) => {
        return `<!-- ARIA: Important for assistive technology -->\\n${match}`;
      });
    }
    
    return "```html\\n" + enhancedCode + "```";
  });
  
  // 2. Add implementation tips for important accessibility topics
  if (articleContent.includes('keyboard accessibility') || articleContent.includes('Keyboard Accessibility')) {
    const tipToAdd = "\\n\\n### Practical Tips for Keyboard Accessibility\\n\\n- Test by navigating your site using only the keyboard\\n- Ensure all interactive elements can be reached with Tab key\\n- Make sure focus indicators are clearly visible\\n- Check that Enter/Space activates focused controls\\n- Verify that keyboard traps are avoided";
    
    // Find a good place to add this (before conclusion section)
    const sections = articleContent.split("\\n## ");
    const conclusionIndex = sections.findIndex(section => 
      section.toLowerCase().startsWith("conclusion") || 
      section.toLowerCase().includes("summary")
    );
    
    if (conclusionIndex !== -1 && conclusionIndex > 0) {
      // Add before the conclusion section
      if (!sections[conclusionIndex - 1].includes("Practical Tips")) {
        sections[conclusionIndex - 1] += tipToAdd;
        articleContent = sections[0] + "\\n## " + sections.slice(1).join("\\n## ");
        console.log('Added keyboard accessibility tips.');
      }
    }
  }
  
  // 3. Fix bullet point formatting
  articleContent = articleContent.replace(/\\n\\n\\*\\s+/g, '\\n* ');
  articleContent = articleContent.replace(/\\n\\n(\\d+\\.\\s+)/g, '\\n$1');
  
  // Check if we made improvements
  if (originalContent === articleContent) {
    console.log('No improvements made to content.');
    return;
  }
  
  console.log('Improvements made. Updating file...');
  
  // Replace the content in the original file
  const updatedFileContent = 
    content.substring(0, contentStartQuote) + 
    articleContent + 
    content.substring(contentEndQuote);
  
  fs.writeFileSync(filePath, updatedFileContent, 'utf8');
  console.log('File updated successfully.');
}

// Run the enhancement
enhanceArticle().catch(err => {
  console.error('Error enhancing article:', err);
});