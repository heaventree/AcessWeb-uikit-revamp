/**
 * Script to improve all WCAG resource articles with enhanced formatting
 * 
 * This script processes all article files to:
 * 1. Fix bullet point formatting (remove extra line breaks between list items)
 * 2. Standardize heading structures
 * 3. Improve code examples with better syntax highlighting
 * 4. Add more semantic HTML elements
 * 5. Enhance accessibility descriptions
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

let improvedCount = 0;

// Process each file
files.forEach(file => {
  const filePath = path.join(articlesDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Find the content property in the article objects
  const contentMatch = content.match(/"content":\s*"([^"]+)"/);
  
  if (contentMatch && contentMatch[1]) {
    let articleContent = contentMatch[1];
    let originalContent = articleContent;
    
    // 1. Fix bullet point formatting by replacing patterns where there are extra line breaks
    articleContent = articleContent.replace(/\n\n\*\s+/g, '\n* ');
    articleContent = articleContent.replace(/\n\n(\d+\.\s+)/g, '\n$1');
    articleContent = articleContent.replace(/\n\n-\s+/g, '\n- ');
    
    // 2. Standardize code block formatting
    // Ensure code blocks have language specifiers
    articleContent = articleContent.replace(/```\n/g, "```plaintext\n");
    
    // Improve HTML code blocks
    articleContent = articleContent.replace(/```html\n([^`]+)```/g, (match, code) => {
      // Add comments for accessibility where appropriate
      if (code.includes('<img') && !code.includes('<!-- Image accessibility -->')) {
        code = code.replace(/<img([^>]+)>/g, (imgMatch, imgAttrs) => {
          // If example already includes alt attribute, leave it as is
          if (imgAttrs.includes('alt=')) {
            return `<!-- Image accessibility - properly using alt attribute -->\n${imgMatch}`;
          } else {
            return `<!-- Image accessibility - missing alt attribute -->\n${imgMatch}`;
          }
        });
      }
      
      // Add comments for semantic HTML
      if (code.includes('<div class="heading">') && !code.includes('<!-- Non-semantic -->')) {
        code = code.replace(/<div class="heading">/g, '<!-- Non-semantic heading example -->\n<div class="heading">');
      }
      
      if (code.includes('<h') && !code.includes('<!-- Semantic -->')) {
        code = code.replace(/<h([1-6])/g, '<!-- Semantic heading example -->\n<h$1');
      }
      
      return "```html\n" + code + "```";
    });
    
    // Improve CSS code blocks with better comments
    articleContent = articleContent.replace(/```css\n([^`]+)```/g, (match, code) => {
      // Add accessibility comments for contrast
      if (code.includes('color:') && code.includes('background-color:') && !code.includes('/* Contrast ratio')) {
        code = code.replace(/background-color:\s*#([0-9a-f]{3,6});.*\n.*color:\s*#([0-9a-f]{3,6});/gi, 
          (colorMatch, bgColor, textColor) => {
            return `${colorMatch} /* Contrast considerations for accessibility */`;
          }
        );
      }
      
      return "```css\n" + code + "```";
    });
    
    // 3. Improve ARIA references and descriptions
    if (articleContent.includes('aria-')) {
      articleContent = articleContent.replace(/aria-([a-z]+)/g, (match, ariaAttr) => {
        // Don't add extra information if it's already in a code block
        if (articleContent.includes("```") && 
            articleContent.indexOf(match) > articleContent.lastIndexOf("```")) {
          return match;
        }
        
        let explanation = '';
        switch(ariaAttr) {
          case 'label':
            explanation = ' (provides an accessible name)';
            break;
          case 'labelledby':
            explanation = ' (references another element as the label)';
            break;
          case 'describedby':
            explanation = ' (references another element as the description)';
            break;
          case 'expanded':
            explanation = ' (indicates if a control is expanded)';
            break;
          case 'hidden':
            explanation = ' (hides content from assistive technology)';
            break;
          case 'controls':
            explanation = ' (indicates which element is controlled by this one)';
            break;
          case 'live':
            explanation = ' (indicates dynamic content updates)';
            break;
          case 'role':
            explanation = ' (defines the element\'s purpose)';
            break;
        }
        
        if (explanation && !articleContent.includes(`${match}${explanation}`)) {
          return `${match}${explanation}`;
        }
        return match;
      });
    }
    
    // 4. Enhance keyboard accessibility descriptions
    if (articleContent.includes('keyboard') || articleContent.includes('Keyboard')) {
      // Add more detailed information about keyboard navigation if not already present
      if (!articleContent.includes("Tab key navigates") && 
          !articleContent.includes("tab order") &&
          articleContent.includes("keyboard navigation")) {
        
        articleContent = articleContent.replace(
          /keyboard navigation/i, 
          "keyboard navigation (where Tab key navigates between elements, Enter/Space activates them)"
        );
      }
    }
    
    // 5. Add better explanations for WCAG Guidelines references
    const wcagPatterns = [
      { pattern: /WCAG 2.1/g, explanation: ' (current technical standard)' },
      { pattern: /WCAG 2.2/g, explanation: ' (newest standard, October 2023)' },
      { pattern: /Level A/g, explanation: ' (minimum accessibility requirements)' },
      { pattern: /Level AA/g, explanation: ' (addresses major accessibility barriers)' },
      { pattern: /Level AAA/g, explanation: ' (highest level of accessibility support)' }
    ];
    
    wcagPatterns.forEach(({ pattern, explanation }) => {
      // Only add explanation if it's not already present
      const patternText = pattern.toString().replace(/\/g$/, '').replace(/^\//, '');
      const searchText = patternText + explanation;
      
      if (articleContent.match(pattern) && !articleContent.includes(searchText)) {
        // Simple replace that avoids template literals with backticks
        articleContent = articleContent.replace(pattern, match => match + explanation);
      }
    });
    
    // If changes were made, update the file
    if (originalContent !== articleContent) {
      const updatedContent = content.replace(contentMatch[0], `"content": "${articleContent}"`);
      fs.writeFileSync(filePath, updatedContent, 'utf8');
      improvedCount++;
      console.log(`Improved article content in: ${file}`);
    }
  }
});

console.log(`Completed processing. Improved ${improvedCount} files.`);