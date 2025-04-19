/**
 * Script to standardize and enhance WCAG resource article tags
 * 
 * This script processes all article files to:
 * 1. Ensure consistent tag formatting (capitalization, plurals)
 * 2. Add standard tags based on content analysis
 * 3. Remove duplicate tags
 * 4. Ensure relevant WCAG principles are always tagged
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const articlesDir = path.join(__dirname, '../src/data/articles/wcag-resources');

// Define standard tags and their preferred format
const standardTags = {
  // Core tags that should be consistent
  'wcag': 'WCAG',
  'accessibility': 'Accessibility',
  'a11y': 'A11y',
  'web standards': 'Web Standards',
  'website compliance': 'Website Compliance',
  'digital inclusion': 'Digital Inclusion',
  
  // WCAG principles
  'perceivable': 'Perceivable',
  'operable': 'Operable',
  'understandable': 'Understandable',
  'robust': 'Robust',
  
  // Common accessibility topics
  'screen readers': 'Screen Readers',
  'keyboard navigation': 'Keyboard Navigation',
  'color contrast': 'Color Contrast',
  'alt text': 'Alt Text',
  'form controls': 'Form Controls',
  'aria': 'ARIA',
  'semantic html': 'Semantic HTML',
  'mobile accessibility': 'Mobile Accessibility',
  'responsive design': 'Responsive Design',
  
  // Legal & compliance
  'ada': 'ADA',
  'section 508': 'Section 508',
  'eaa': 'EAA',
  'uk accessibility regulations': 'UK Accessibility Regulations',
  
  // Versions
  'wcag 2.0': 'WCAG 2.0',
  'wcag 2.1': 'WCAG 2.1',
  'wcag 2.2': 'WCAG 2.2',
  'wcag 3.0': 'WCAG 3.0'
};

// Read all files in the articles directory
const files = fs.readdirSync(articlesDir).filter(file => 
  file.startsWith('wcag-resource-') && file.endsWith('.ts')
);

console.log(`Found ${files.length} article files to process tags.`);

let improvedCount = 0;

// Process each file
files.forEach(file => {
  const filePath = path.join(articlesDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Extract title, content, and tags
  const titleMatch = content.match(/"title":\s*"([^"]+)"/);
  const contentMatch = content.match(/"content":\s*"([^"]+)"/);
  const tagsMatch = content.match(/"tags":\s*\[([\s\S]*?)\]/);
  
  if (titleMatch && contentMatch && tagsMatch) {
    const title = titleMatch[1];
    const articleContent = contentMatch[1];
    
    // Parse existing tags
    let tags = tagsMatch[1]
      .replace(/"/g, '')
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0);
    
    const originalTags = [...tags];
    
    // 1. Normalize existing tags (use standard capitalization)
    tags = tags.map(tag => {
      const lowercaseTag = tag.toLowerCase();
      for (const [standard, preferred] of Object.entries(standardTags)) {
        if (lowercaseTag === standard.toLowerCase()) {
          return preferred;
        }
      }
      return tag;
    });
    
    // 2. Add missing core tags
    // Always include WCAG and Accessibility
    if (!tags.includes('WCAG')) tags.push('WCAG');
    if (!tags.includes('Accessibility')) tags.push('Accessibility');
    
    // 3. Add WCAG principle tags based on content
    const principles = ['Perceivable', 'Operable', 'Understandable', 'Robust'];
    principles.forEach(principle => {
      const isPrincipleInContent = new RegExp(
        `${principle}|${principle.toLowerCase()}|${principle.toUpperCase()}`
      ).test(articleContent);
      
      if (isPrincipleInContent && !tags.some(tag => tag.toLowerCase() === principle.toLowerCase())) {
        tags.push(principle);
      }
    });
    
    // 4. Add version tags if mentioned in content
    const versions = ['WCAG 2.0', 'WCAG 2.1', 'WCAG 2.2', 'WCAG 3.0'];
    versions.forEach(version => {
      if (
        (articleContent.includes(version) || title.includes(version)) &&
        !tags.some(tag => tag.toLowerCase() === version.toLowerCase())
      ) {
        tags.push(version);
      }
    });
    
    // 5. Add topic-specific tags based on content analysis
    const topicPatterns = [
      { pattern: /color contrast|contrast ratio|background.*color|foreground.*color/i, tag: 'Color Contrast' },
      { pattern: /screen reader|screenreader|jaws|nvda|voiceover/i, tag: 'Screen Readers' },
      { pattern: /keyboard.*navigat|tab.*order|focus.*indicator/i, tag: 'Keyboard Navigation' },
      { pattern: /alt.*text|image.*description|text.*alternative/i, tag: 'Alt Text' },
      { pattern: /aria-|role="|accessible name|accessible description/i, tag: 'ARIA' },
      { pattern: /semantic|h1|h2|h3|header|nav|main|footer|aside|section/i, tag: 'Semantic HTML' },
      { pattern: /mobile|smartphone|tablet|responsive/i, tag: 'Mobile Accessibility' },
      { pattern: /form|input|label|select|checkbox|radio|button/i, tag: 'Form Controls' }
    ];
    
    topicPatterns.forEach(({ pattern, tag }) => {
      if (pattern.test(articleContent) && !tags.includes(tag)) {
        tags.push(tag);
      }
    });
    
    // 6. Remove duplicates
    tags = [...new Set(tags)];
    
    // 7. Limit to maximum 10 tags
    if (tags.length > 10) {
      // Keep core tags and prioritize principle tags
      const coreTags = ['WCAG', 'Accessibility'];
      const principleTags = principles.filter(p => tags.includes(p));
      const otherTags = tags.filter(tag => 
        !coreTags.includes(tag) && !principleTags.includes(tag)
      );
      
      // Sort other tags by relevance (you could enhance this logic)
      const sortedOtherTags = otherTags.sort();
      
      // Combine tags with priority order and limit to 10
      tags = [...coreTags, ...principleTags, ...sortedOtherTags].slice(0, 10);
    }
    
    // If tags were changed, update the file
    if (JSON.stringify(originalTags) !== JSON.stringify(tags)) {
      // Format tags array as it appears in the file
      const formattedTags = tags.map(tag => `    "${tag}"`).join(',\n');
      const newTagsSection = `"tags": [\n${formattedTags}\n  ]`;
      
      // Replace tags section in content
      const updatedContent = content.replace(
        /"tags":\s*\[([\s\S]*?)\]/,
        newTagsSection
      );
      
      fs.writeFileSync(filePath, updatedContent, 'utf8');
      improvedCount++;
      console.log(`Standardized tags in: ${file}`);
    }
  }
});

console.log(`Completed tags processing. Improved ${improvedCount} files.`);