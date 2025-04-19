/**
 * Master script to run all article improvement scripts
 * 
 * This script runs all article improvement scripts in sequence:
 * 1. Fix bullet points
 * 2. Improve article content
 * 3. Standardize and enhance descriptions
 * 4. Standardize tags
 * 5. Generate metadata
 */

import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import { fileURLToPath } from 'url';

const execPromise = promisify(exec);

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define all scripts to run in order
const scripts = [
  'fix-bullet-points.js',
  'improve-all-articles.js',
  'improve-article-descriptions.js',
  'standardize-article-tags.js',
  'generate-article-metadata.js'
];

async function runScripts() {
  console.log('Starting article improvement process...');
  
  for (const script of scripts) {
    const scriptPath = path.join(__dirname, script);
    console.log(`\nRunning ${script}...`);
    
    try {
      const { stdout, stderr } = await execPromise(`node ${scriptPath}`);
      if (stdout) console.log(stdout);
      if (stderr) console.error(stderr);
    } catch (error) {
      console.error(`Error running ${script}:`, error.message);
      
      // Continue with next script even if one fails
      console.log('Continuing with next script...');
    }
  }
  
  console.log('\nAll article improvement scripts completed!');
  console.log('WCAG resource articles have been enhanced with:');
  console.log('- Fixed bullet point formatting');
  console.log('- Improved content with better explanations');
  console.log('- Enhanced descriptions for readability and SEO');
  console.log('- Standardized tags for better organization');
  console.log('- Added SEO metadata for improved search visibility');
}

runScripts();