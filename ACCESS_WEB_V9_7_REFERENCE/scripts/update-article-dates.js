/**
 * Script to update WCAG resource articles with random dates
 * This script generates random publish and update dates for all WCAG resource articles
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current file directory with ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Directory containing all WCAG resource articles
const resourcesDir = path.join(__dirname, '../src/data/articles/wcag-resources');

// Generate a random date between two dates
function randomDate(start, end) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

// Format date as ISO string
function formatDate(date) {
  return date.toISOString();
}

// Generate dates for the past 2 years, with updates more recent
function generateDates() {
  // Start date: between Jan 2023 and Dec 2024
  const startDate = randomDate(
    new Date('2023-01-01'),
    new Date('2024-12-01')
  );
  
  // Update date: between the publish date and today
  const today = new Date();
  const updateDate = randomDate(
    new Date(startDate.getTime() + 30 * 24 * 60 * 60 * 1000), // At least 30 days after publish
    today
  );
  
  return {
    publishedAt: formatDate(startDate),
    updatedAt: formatDate(updateDate)
  };
}

// Process all WCAG resource article files
function updateArticleDates() {
  const files = fs.readdirSync(resourcesDir)
    .filter(file => file.endsWith('.ts') && file.includes('wcag-resource-'));
  
  let updatedCount = 0;
  
  files.forEach(file => {
    const filePath = path.join(resourcesDir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Skip if the file already has an updatedAt field
    if (content.includes('updatedAt:')) {
      console.log(`Skipping ${file} - already has updated date`);
      return;
    }
    
    const { publishedAt, updatedAt } = generateDates();
    
    // Replace the publishedAt line with updated dates
    const publishDateRegex = /"publishedAt": "([^"]+)"/;
    
    if (publishDateRegex.test(content)) {
      content = content.replace(
        publishDateRegex, 
        `"publishedAt": "${publishedAt}",\n  "updatedAt": "${updatedAt}"`
      );
      
      fs.writeFileSync(filePath, content, 'utf8');
      updatedCount++;
      console.log(`Updated dates in ${file}`);
    } else {
      console.log(`Failed to update ${file} - pattern not found`);
    }
  });
  
  console.log(`\nUpdated ${updatedCount} out of ${files.length} WCAG resource articles`);
}

// Run the update function
updateArticleDates();