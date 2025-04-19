/**
 * Script to enhance the content quality of all WCAG resource articles
 * 
 * This script processes all article files to:
 * 1. Improve code examples with more detailed comments and better practices
 * 2. Enhance explanations of WCAG principles and requirements
 * 3. Add practical implementation tips and real-world examples
 * 4. Fix any inconsistent formatting (bullet points, headings, spacing)
 * 5. Improve readability with clearer language and better structure
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
for (const file of files) {
  const filePath = path.join(articlesDir, file);
  const content = fs.readFileSync(filePath, 'utf8');
  
  // Extract the article number from the filename
  const articleNumber = parseInt(file.match(/wcag-resource-(\d+)\.ts/)[1]);
  
  // Find the content property and extract its value
  const contentMatch = content.match(/"content":\s*"([\s\S]*?)",\s*"category"/);
  
  if (contentMatch && contentMatch[1]) {
    const originalContent = contentMatch[1];
    let newContent = originalContent;
    
    // 1. Fix formatting issues
    // Fix bullet points
    newContent = newContent.replace(/\\n\\n\*\s+/g, '\\n* ');
    // Fix numbered lists
    newContent = newContent.replace(/\\n\\n(\d+\.\s+)/g, '\\n$1');
    // Fix inconsistent headings (ensure there's a line break before headings)
    newContent = newContent.replace(/([^\n])\\n(#{1,6})/g, '$1\\n\\n$2');
    
    // 2. Improve code examples with better comments if code blocks exist
    if (newContent.includes('```html')) {
      // Add ARIA attributes to HTML examples that are missing them
      newContent = newContent.replace(
        /<button([^>]*)>([^<]*)<\/button>/g, 
        (match, attributes, content) => {
          if (!attributes.includes('aria-')) {
            return `<button${attributes} aria-label="${content.trim()}">${content}</button>`;
          }
          return match;
        }
      );
      
      // Add better comments to code examples
      newContent = newContent.replace(
        /```html\\n([\s\S]*?)```/g,
        (match, codeBlock) => {
          // Don't modify if it already has detailed comments
          if (codeBlock.includes('<!-- Good example:') || codeBlock.includes('<!-- GOOD:')) {
            return match;
          }
          
          // Add better comments based on code content
          let improvedCode = codeBlock;
          
          if (codeBlock.includes('<button')) {
            improvedCode = improvedCode.replace(
              /(<button[^>]*>)/g, 
              '<!-- Interactive element with proper semantics -->\\n$1'
            );
          }
          
          if (codeBlock.includes('<div') && !codeBlock.includes('<!-- Container')) {
            improvedCode = improvedCode.replace(
              /(<div[^>]*>)/g, 
              '<!-- Container element - ensure it has appropriate ARIA roles if needed -->\\n$1'
            );
          }
          
          if (codeBlock.includes('<img') && !codeBlock.includes('alt=')) {
            improvedCode = improvedCode.replace(
              /(<img[^>]*>)/g, 
              '<!-- WARNING: Image missing alt attribute -->\\n$1'
            );
          }
          
          return '```html\\n' + improvedCode + '```';
        }
      );
    }
    
    // 3. Add cross-references to related WCAG criteria if missing
    const wcagReferences = {
      'alt text': 'WCAG 1.1.1 Non-text Content',
      'color contrast': 'WCAG 1.4.3 Contrast (Minimum)',
      'keyboard': 'WCAG 2.1.1 Keyboard',
      'focus': 'WCAG 2.4.7 Focus Visible',
      'language': 'WCAG 3.1.1 Language of Page',
      'headings': 'WCAG 2.4.6 Headings and Labels',
      'forms': 'WCAG 3.3.2 Labels or Instructions'
    };
    
    for (const [keyword, reference] of Object.entries(wcagReferences)) {
      if (
        newContent.toLowerCase().includes(keyword) && 
        !newContent.includes(reference)
      ) {
        // Add reference at the end of relevant paragraph
        const regex = new RegExp(`([^\\n]*${keyword}[^\\n]*\\.\\\\n)`, 'i');
        const match = newContent.match(regex);
        
        if (match) {
          newContent = newContent.replace(
            match[0],
            `${match[0]}\\n> **Related WCAG Criterion**: ${reference}\\n`
          );
        }
      }
    }
    
    // 4. Identify and improve sections with minimal content
    const sections = newContent.split(/#{1,6} /);
    for (let i = 1; i < sections.length; i++) {
      const section = sections[i];
      const endOfHeading = section.indexOf('\\n');
      const heading = section.substring(0, endOfHeading);
      const content = section.substring(endOfHeading + 2);
      
      // If section has very little content, enhance it
      if (content.split('\\n').length < 3 && content.length < 150) {
        let additionalContent = '';
        
        // Add specific content based on heading
        if (heading.toLowerCase().includes('introduction') || heading.toLowerCase().includes('overview')) {
          additionalContent = '\\nWeb accessibility is not just a checklist but an ongoing commitment to inclusive design. The following guidelines will help ensure your digital content is usable by everyone, including people with disabilities.\\n';
        } else if (heading.toLowerCase().includes('conclusion')) {
          additionalContent = '\\nImplementing these accessibility best practices benefits all users, not just those with disabilities. The improved usability, SEO benefits, and broader reach make accessibility a worthwhile investment for any web project.\\n';
        } else if (heading.toLowerCase().includes('implement')) {
          additionalContent = '\\nConsistent implementation across your website or application is key. Consider building an accessibility component library that enforces best practices automatically.\\n';
        }
        
        if (additionalContent) {
          const newSection = section.substring(0, endOfHeading + 2) + content + additionalContent + section.substring(endOfHeading + 2 + content.length);
          sections[i] = newSection;
        }
      }
    }
    newContent = sections.join('# ');
    
    // 5. Add implementation tips section if not already present and not already added by previous script
    if (!newContent.includes('Implementation Tips') && !newContent.endsWith('\\n')) {
      newContent += '\\n\\n## Implementation Tips\\n\\n';
      
      // Default implementation tips if no specific ones are defined
      newContent += '- Document accessibility requirements in your project specifications\\n';
      newContent += '- Incorporate accessibility testing into your QA process\\n';
      newContent += '- Train your team on accessibility principles and techniques\\n';
      newContent += '- Use automated tools to catch common accessibility issues\\n';
      newContent += '- Test with keyboard-only navigation to ensure full access';
    }
    
    // If changes were made, update the file
    if (originalContent !== newContent) {
      const updatedContent = content.replace(
        contentMatch[0],
        `"content": "${newContent}",\n  "category"`
      );
      
      try {
        fs.writeFileSync(filePath, updatedContent, 'utf8');
        improvedCount++;
        console.log(`Enhanced content in: ${file}`);
      } catch (error) {
        console.error(`Error updating ${file}:`, error);
      }
    }
  } else {
    console.log(`Could not find content in: ${file}`);
  }
}

console.log(`Completed processing. Enhanced ${improvedCount} files.`);