/**
 * Script to add implementation tips to WCAG resource articles
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
    
    // Small improvement: Fix bullet point formatting
    newContent = newContent.replace(/\\n\\n\\*\s+/g, '\\n* ');
    newContent = newContent.replace(/\\n\\n(\d+\.\s+)/g, '\\n$1');
    
    // Only improve specific articles as a test
    if (articleNumber <= 10) {
      // Add implementation tips section if not already present
      if (!newContent.includes('Implementation Tips') && !newContent.endsWith('\\n')) {
        newContent += '\\n\\n## Implementation Tips\\n\\n';
        
        // Add different tips based on the article number
        switch (articleNumber) {
          case 1: // Introduction to Web Accessibility
            newContent += '- Start with automated testing tools like Lighthouse, WAVE, or axe\\n';
            newContent += '- Combine automated testing with manual checks for comprehensive coverage\\n';
            newContent += '- Focus on high-impact, low-effort improvements first\\n';
            newContent += '- Incorporate accessibility from the beginning of new projects\\n';
            newContent += '- Build accessibility requirements into your design system';
            break;
            
          case 2: // WCAG Principles and Guidelines
            newContent += '- Map your current development practices to WCAG principles\\n';
            newContent += '- Create accessibility checklists for each POUR principle\\n';
            newContent += '- Train team members on identifying accessibility issues by principle\\n';
            newContent += '- Use automated testing tools that categorize issues by WCAG principle\\n';
            newContent += '- Develop component libraries that adhere to WCAG principles by default';
            break;
            
          case 3: // Semantic HTML
            newContent += '- Audit your HTML with validation tools to identify non-semantic markup\\n';
            newContent += '- Replace generic divs and spans with appropriate semantic elements\\n';
            newContent += '- Ensure heading levels (h1-h6) follow a logical hierarchy\\n';
            newContent += '- Use landmark elements (header, nav, main, footer) to structure your page\\n';
            newContent += '- Test with screen readers to verify semantic structure is conveyed properly';
            break;
            
          case 4: // Alternative Text
            newContent += '- Create an alt text style guide for your content team\\n';
            newContent += '- Use contextual alt text that conveys the purpose of the image\\n';
            newContent += '- Keep alt text concise (generally under 125 characters)\\n';
            newContent += '- Use empty alt attributes (alt="") for decorative images\\n';
            newContent += '- Regularly audit images to ensure all have appropriate alt text';
            break;
            
          case 5: // Color Contrast
            newContent += '- Use contrast checking tools during design and development\\n';
            newContent += '- Create a color palette with AA/AAA compliant color combinations\\n';
            newContent += '- Test your UI under different lighting conditions\\n';
            newContent += '- Verify contrast with color vision deficiency simulators\\n';
            newContent += '- Add visual indicators beyond color (icons, patterns, text) for important elements';
            break;
            
          default:
            newContent += '- Document your accessibility approach for future reference\\n';
            newContent += '- Test with real users who rely on assistive technologies\\n';
            newContent += '- Create component-specific accessibility guidelines\\n';
            newContent += '- Monitor accessibility compliance with regular audits\\n';
            newContent += '- Share accessibility knowledge across teams';
        }
      }
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
        console.log(`Added tips to: ${file}`);
      } catch (error) {
        console.error(`Error updating ${file}:`, error);
      }
    }
  } else {
    console.log(`Could not find content in: ${file}`);
  }
}

console.log(`Completed processing. Improved ${improvedCount} files.`);