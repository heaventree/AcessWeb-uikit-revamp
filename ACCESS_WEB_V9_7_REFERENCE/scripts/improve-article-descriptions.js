/**
 * Script to improve WCAG resource article descriptions
 * 
 * This script processes all article files to enhance and standardize the descriptions:
 * 1. Ensures descriptions are complete sentences
 * 2. Adds key WCAG references where relevant
 * 3. Optimizes for search and readability
 * 4. Creates consistent length (ideally 150-160 characters)
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

console.log(`Found ${files.length} article files to process descriptions.`);

let improvedCount = 0;

// Process each file
files.forEach(file => {
  const filePath = path.join(articlesDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Extract the current description
  const descriptionMatch = content.match(/"description":\s*"([^"]+)"/);
  
  if (descriptionMatch && descriptionMatch[1]) {
    let description = descriptionMatch[1];
    let originalDescription = description;
    
    // Get the title to help generate a better description if needed
    const titleMatch = content.match(/"title":\s*"([^"]+)"/);
    const title = titleMatch ? titleMatch[1] : '';
    
    // Extract first paragraph of content for fallback description
    const contentMatch = content.match(/"content":\s*"([^"]+)"/);
    let firstParagraph = '';
    if (contentMatch && contentMatch[1]) {
      // Get the first paragraph after the title
      const contentLines = contentMatch[1].split('\\n');
      for (let i = 0; i < contentLines.length; i++) {
        // Skip heading lines and empty lines
        if (!contentLines[i].startsWith('#') && contentLines[i].trim() !== '') {
          firstParagraph = contentLines[i].trim();
          break;
        }
      }
    }
    
    // 1. Fix descriptions that are just bullet points or incomplete phrases
    if (description.startsWith('*') || description.startsWith('-') || 
        description.startsWith('•') || description.startsWith('Common') ||
        description.startsWith('Key') || description.startsWith('Overview')) {
      
      // Create a proper sentence from bullet points or incomplete phrases
      if (title) {
        description = `This article covers ${title.toLowerCase().includes('wcag') ? '' : 'the WCAG requirements for '}${title}, including ${description.replace(/^\*\s|-\s|•\s|Common\s|Key\s|Overview\s/i, '').toLowerCase()}.`;
      }
    }
    
    // 2. Add WCAG reference if missing
    if (!description.includes('WCAG') && title && title.includes('WCAG')) {
      const hasVersion = /WCAG\s+\d\.\d/.test(description);
      if (!hasVersion) {
        if (title.includes('2.2')) {
          description = description.replace(/\.$/, '') + ', as defined in WCAG 2.2.';
        } else if (title.includes('2.1')) {
          description = description.replace(/\.$/, '') + ', as defined in WCAG 2.1.';
        } else {
          description = description.replace(/\.$/, '') + ', as part of the WCAG standards.';
        }
      }
    }
    
    // 3. Ensure description is properly capitalized and punctuated
    if (description && description.length > 0) {
      // Ensure first character is uppercase
      description = description.charAt(0).toUpperCase() + description.slice(1);
      
      // Ensure it ends with a period
      if (!description.endsWith('.')) {
        description += '.';
      }
    }
    
    // 4. If description is too short (less than 100 chars), expand it
    if (description.length < 100 && firstParagraph) {
      // Use the first paragraph content to create a better description
      const cleanParagraph = firstParagraph
        .replace(/\*\*/g, '') // Remove markdown bold
        .replace(/\n/g, ' ')  // Remove newlines
        .trim();
        
      if (cleanParagraph.length > 0) {
        if (description.length === 0) {
          description = cleanParagraph;
        } else {
          description = description.replace(/\.$/, '') + '. ' + cleanParagraph;
        }
        
        // Truncate if too long (aim for ~160 chars max)
        if (description.length > 180) {
          description = description.substring(0, 157) + '...';
        }
      }
    }
    
    // If changes were made, update the file
    if (originalDescription !== description) {
      const updatedContent = content.replace(descriptionMatch[0], `"description": "${description}"`);
      fs.writeFileSync(filePath, updatedContent, 'utf8');
      improvedCount++;
      console.log(`Improved description in: ${file}`);
    }
  }
});

console.log(`Completed description processing. Improved ${improvedCount} descriptions.`);