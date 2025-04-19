// Script to convert article text files into individual article TypeScript files
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Paths
const ARTICLES_FILE = path.join(__dirname, '../../attached_assets/remaining-25-wcag-resources.txt');
const OUTPUT_DIR = path.join(__dirname, '../src/data/articles/wcag-resources');

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Read the articles file
const content = fs.readFileSync(ARTICLES_FILE, 'utf8');

// Split the content by article markers
const articleSections = content.split(/---\s*?\n/g).slice(1); // Skip the intro text

// Process each article
articleSections.forEach((section) => {
  // Extract article title and number
  const titleMatch = section.match(/### (\d+)\. (.+?)[\r\n]/);
  if (!titleMatch) return;
  
  const articleNumber = titleMatch[1];
  const articleTitle = titleMatch[2];
  
  // Create slug from title
  const slug = articleTitle
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
  
  // Format the article content for markdown, keeping code blocks intact
  let content = section
    .replace(/### \d+\. .+?[\r\n]/, '') // Remove the title line
    .trim();
  
  // Generate tableOfContents from content headings
  const headings = [];
  const headingRegex = /\*\*([^*]+)\*\*/g;
  let match;
  
  while ((match = headingRegex.exec(content)) !== null) {
    const title = match[1];
    const id = title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
    
    headings.push({ id, title, level: 2 });
  }
  
  // Create the article data
  const articleData = {
    id: `wcag-resource-${articleNumber}`,
    slug: `wcag-resource-${slug}`,
    title: articleTitle,
    description: extractDescription(content),
    content: `# ${articleTitle}\n\n${content}`,
    category: 'wcag-resources',
    tags: generateTags(articleTitle, content),
    author: {
      name: 'Accessibility Team',
      avatar: 'https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      role: 'WCAG Specialists'
    },
    publishedAt: new Date().toISOString(),
    readingTime: `${Math.max(3, Math.round(content.length / 1000))} min read`,
    vectorImage: getImageForArticle(articleNumber, articleTitle),
    isResource: true,
    wcagReference: getWCAGReference(articleTitle),
    tableOfContents: headings
  };
  
  // Create the file content
  const fileContent = `import type { Article } from '../../../types/blog';

export const wcagResource${articleNumber}: Article = ${JSON.stringify(articleData, null, 2)};
`;
  
  // Write the file
  const filename = `wcag-resource-${articleNumber}.ts`;
  fs.writeFileSync(path.join(OUTPUT_DIR, filename), fileContent);
  
  console.log(`Created article file: ${filename}`);
});

// Helper functions
function extractDescription(content) {
  // Extract first paragraph or first 150 characters
  const firstPara = content.split('\n\n')[0].replace(/\*\*/g, '');
  return firstPara.length > 150 ? firstPara.substring(0, 147) + '...' : firstPara;
}

function generateTags(title, content) {
  const baseTags = ['WCAG', 'Accessibility', 'Web Standards'];
  
  // Add specific tags based on content
  if (title.includes('Color') || content.includes('color') || content.includes('contrast')) {
    baseTags.push('Color Contrast');
  }
  
  if (content.includes('keyboard') || title.includes('Keyboard')) {
    baseTags.push('Keyboard Accessibility');
  }
  
  if (content.includes('ARIA') || content.includes('screen reader')) {
    baseTags.push('ARIA', 'Screen Readers');
  }
  
  // Add principle-based tags
  if (content.includes('Perceivable') || title.includes('Perceivable')) {
    baseTags.push('Perceivable');
  }
  if (content.includes('Operable') || title.includes('Operable')) {
    baseTags.push('Operable');
  }
  if (content.includes('Understandable') || title.includes('Understandable')) {
    baseTags.push('Understandable');
  }
  if (content.includes('Robust') || title.includes('Robust')) {
    baseTags.push('Robust');
  }
  
  // Additional specialized tags for articles 26-50
  if (title.includes('Cognitive') || content.includes('cognitive')) {
    baseTags.push('Cognitive Accessibility');
  }
  
  if (title.includes('Authentication') || content.includes('authentication')) {
    baseTags.push('Authentication', 'Security');
  }
  
  if (title.includes('PDF') || content.includes('PDF')) {
    baseTags.push('PDF', 'Documents');
  }
  
  if (title.includes('WCAG 2.2') || content.includes('WCAG 2.2')) {
    baseTags.push('WCAG 2.2', 'Standards');
  }
  
  if (title.includes('WCAG 3.0') || content.includes('WCAG 3.0')) {
    baseTags.push('WCAG 3.0', 'Future Standards');
  }
  
  if (title.includes('Touch') || content.includes('touch interface')) {
    baseTags.push('Touch Interfaces', 'Mobile');
  }
  
  return [...new Set(baseTags)]; // Remove duplicates
}

function getImageForArticle(number, title) {
  // The placeholder images - in a real implementation, you would have specific images
  const images = [
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1470790376778-a9fbc86d70e2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1468436139062-f60a71c5c892?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1588196749597-9ff075ee6b5b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1517292987719-0369a794ec0f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1497493292307-31c376b6e479?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1499750310107-5fef28a66643?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1547658719-da2b51169166?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1550645612-83f5d594b671?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
  ];
  
  // Return a different set of images for articles 26-50 to add variety
  return images[number % images.length];
}

function getWCAGReference(title) {
  // Map titles to WCAG reference URLs
  if (title.includes('Perceivable')) {
    return 'https://www.w3.org/WAI/WCAG21/Understanding/perceivable';
  } else if (title.includes('Operable')) {
    return 'https://www.w3.org/WAI/WCAG21/Understanding/operable';
  } else if (title.includes('Understandable')) {
    return 'https://www.w3.org/WAI/WCAG21/Understanding/understandable';
  } else if (title.includes('Robust')) {
    return 'https://www.w3.org/WAI/WCAG21/Understanding/robust';
  } else if (title.includes('Color')) {
    return 'https://www.w3.org/WAI/WCAG21/Understanding/use-of-color';
  } else if (title.includes('Keyboard')) {
    return 'https://www.w3.org/WAI/WCAG21/Understanding/keyboard';
  } else if (title.includes('ARIA')) {
    return 'https://www.w3.org/WAI/WCAG21/Understanding/name-role-value';
  } else if (title.includes('Focus')) {
    return 'https://www.w3.org/WAI/WCAG21/Understanding/focus-visible';
  } else if (title.includes('SVG')) {
    return 'https://www.w3.org/WAI/WCAG21/Understanding/non-text-content';
  } else if (title.includes('Audio and Video')) {
    return 'https://www.w3.org/WAI/WCAG21/Understanding/time-based-media';
  } else if (title.includes('Tables')) {
    return 'https://www.w3.org/WAI/WCAG21/Understanding/info-and-relationships';
  } else if (title.includes('WCAG 2.2')) {
    return 'https://www.w3.org/TR/WCAG22/';
  } else if (title.includes('WCAG 3.0')) {
    return 'https://www.w3.org/TR/wcag-3.0/';
  } else {
    return 'https://www.w3.org/WAI/WCAG21/Understanding/';
  }
}

console.log('All remaining article files have been generated!');