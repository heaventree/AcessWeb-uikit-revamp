/**
 * Script to improve content of WCAG resource articles
 * 
 * This script focuses on enhancing article content by:
 * 1. Adding more detailed explanations for accessibility concepts
 * 2. Expanding on implementation practices
 * 3. Fixing bullet point and text formatting
 * 4. Enhancing readability and clarity
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
  
  // Find the content property and extract its value
  const contentMatch = content.match(/"content":\s*"([\s\S]*?)",\s*"category"/);
  
  if (contentMatch && contentMatch[1]) {
    const originalContent = contentMatch[1];
    let newContent = originalContent;
    
    // 1. Fix formatting issues
    newContent = newContent.replace(/\\n\\n\\*\s+/g, '\\n* ');
    newContent = newContent.replace(/\\n\\n(\d+\.\s+)/g, '\\n$1');
    
    // 2. Add more detailed explanations for WCAG principles
    if (newContent.includes('Perceivable') && !newContent.includes('Perceivable principle')) {
      newContent = newContent.replace(
        /\*\*Perceivable\*\*:(.*?)\\n/,
        match => {
          return match + '\\n\\n### The Perceivable Principle\\nThe Perceivable principle ensures that users can identify content and interface elements through their senses. This is particularly important for users with visual, auditory, or cognitive disabilities. Key areas include:\\n* Providing text alternatives for non-text content\\n* Offering captions and alternatives for time-based media\\n* Creating content that can be presented in different ways\\n* Making it easier for users to see and hear content\\n';
        }
      );
    }
    
    if (newContent.includes('Operable') && !newContent.includes('Operable principle')) {
      newContent = newContent.replace(
        /\*\*Operable\*\*:(.*?)\\n/,
        match => {
          return match + '\\n\\n### The Operable Principle\\nThe Operable principle ensures that users can navigate and interact with all interface components. This addresses the needs of users with mobility impairments, those using keyboard navigation, and those who need additional time to process information. Key areas include:\\n* Making all functionality available from a keyboard\\n* Giving users enough time to read and use content\\n* Avoiding content that could cause seizures or physical reactions\\n* Helping users navigate and find content\\n* Making it easier to use inputs beyond keyboard\\n';
        }
      );
    }
    
    if (newContent.includes('Understandable') && !newContent.includes('Understandable principle')) {
      newContent = newContent.replace(
        /\*\*Understandable\*\*:(.*?)\\n/,
        match => {
          return match + '\\n\\n### The Understandable Principle\\nThe Understandable principle ensures that information and interface operation are clear to all users. This is essential for users with cognitive disabilities, language barriers, or learning disabilities. Key areas include:\\n* Making text readable and understandable\\n* Making content appear and operate in predictable ways\\n* Helping users avoid and correct mistakes\\n* Supporting consistent navigation and identification\\n';
        }
      );
    }
    
    if (newContent.includes('Robust') && !newContent.includes('Robust principle')) {
      newContent = newContent.replace(
        /\*\*Robust\*\*:(.*?)\\n/,
        match => {
          return match + '\\n\\n### The Robust Principle\\nThe Robust principle ensures content can be reliably interpreted by a wide variety of user agents, including assistive technologies. This future-proofs your content as technologies evolve. Key areas include:\\n* Maximizing compatibility with current and future tools\\n* Ensuring proper markup that can be accurately parsed\\n* Providing names, roles, and values for non-standard interface components\\n';
        }
      );
    }
    
    // 3. Add implementation tips if relevant
    if (newContent.includes('Guidelines') && !newContent.includes('Implementing WCAG')) {
      newContent = newContent.replace(
        /\*\*Guidelines\*\*:(.*?)$/,
        match => {
          return match + '\\n\\n## Implementing WCAG Successfully\\n\\nImplementing WCAG guidelines effectively requires a systematic approach:\\n\\n### 1. Assessment and Planning\\n- Conduct a thorough accessibility audit of existing content\\n- Prioritize issues based on impact and remediation effort\\n- Create a roadmap for addressing accessibility gaps\\n- Integrate accessibility into design and development workflows\\n\\n### 2. Training and Awareness\\n- Educate team members about accessibility principles\\n- Provide role-specific training for designers, developers, and content creators\\n- Build awareness of diverse user needs and assistive technologies\\n\\n### 3. Technical Implementation\\n- Use semantic HTML elements appropriately\\n- Ensure keyboard accessibility for all interactive elements\\n- Provide sufficient color contrast and text alternatives\\n- Test with assistive technologies regularly\\n\\n### 4. Ongoing Maintenance\\n- Incorporate accessibility testing into QA processes\\n- Monitor for accessibility regressions\\n- Stay current with evolving standards and best practices\\n- Collect feedback from users with disabilities\\n';
        }
      );
    }
    
    // 4. Add concrete examples if missing
    if (
      (newContent.includes('keyboard') || newContent.includes('Keyboard')) && 
      !newContent.includes('keyboard code example') &&
      !newContent.includes('```html')
    ) {
      newContent += '\\n\\n## Code Examples\\n\\n### Keyboard Accessibility Example\\n```html\\n<!-- Good example: Native button is keyboard accessible by default -->\\n<button type="button" onclick="toggleMenu()">Menu</button>\\n\\n<!-- Bad example: Div with click handler is not keyboard accessible -->\\n<div onclick="toggleMenu()">Menu</div>\\n\\n<!-- Fixed example: Added keyboard support with tabindex and keydown -->\\n<div tabindex="0" onclick="toggleMenu()" onkeydown="if(event.key===\'Enter\')toggleMenu()">\\n  Menu\\n</div>\\n```\\n';
    }
    
    // 5. Add WCAG versions context if missing
    if (newContent.includes('WCAG') && !newContent.includes('WCAG 2.1')) {
      newContent += '\\n\\n## WCAG Versions\\n\\n- **WCAG 2.0** (2008): The foundation version that established the core principles\\n- **WCAG 2.1** (2018): Added new success criteria focusing on mobile accessibility, low vision, and cognitive disabilities\\n- **WCAG 2.2** (2023): Introduces additional criteria for keyboard accessibility, dragging movements, target size, and consistent help\\n- **WCAG 3.0** (In development): Future major revision with new approaches to accessibility measurement\\n';
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
        console.log(`Improved content in: ${file}`);
      } catch (error) {
        console.error(`Error updating ${file}:`, error);
      }
    }
  } else {
    console.log(`Could not find content in: ${file}`);
  }
}

console.log(`Completed processing. Improved ${improvedCount} files.`);