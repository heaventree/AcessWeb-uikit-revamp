/**
 * HTML Structure Analyzer
 * 
 * This utility provides enhanced analysis of HTML structure, focusing on 
 * aspects like heading hierarchy, semantic HTML usage, and URL design.
 * It complements the standard accessibility checks from axe-core with
 * more detailed structural analysis that impacts both accessibility and SEO.
 */

import type { AccessibilityIssue } from '../types';

interface StructureAnalysisOptions {
  checkMultipleH1: boolean;
  checkHeadingHierarchy: boolean;
  checkSkippedHeadings: boolean;
  checkSemantic: boolean;
  checkMissingLandmarks: boolean;
}

interface HeadingInfo {
  level: number;
  text: string;
  element: HTMLElement;
}

interface URLAnalysisResult {
  readability: 'good' | 'moderate' | 'poor';
  length: 'good' | 'moderate' | 'poor';
  usesKeywords: boolean;
  usesHyphens: boolean;
  usesUnderscores: boolean;
  containsParameters: boolean;
  issues: string[];
}

const defaultOptions: StructureAnalysisOptions = {
  checkMultipleH1: true,
  checkHeadingHierarchy: true,
  checkSkippedHeadings: true,
  checkSemantic: true,
  checkMissingLandmarks: true
};

/**
 * Analyzes HTML structure for accessibility and usability issues
 */
export function analyzeHtmlStructure(
  html: string,
  url: string,
  options: Partial<StructureAnalysisOptions> = {}
): AccessibilityIssue[] {
  const issues: AccessibilityIssue[] = [];

  // Apply default options
  const opts = { ...defaultOptions, ...options };

  try {
    // Parse HTML string to a DOM 
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const root = doc.body;

    // Extract all headings
    const headings = extractHeadings(root);

    // Check for multiple H1 tags
    if (opts.checkMultipleH1) {
      issues.push(...checkMultipleH1Tags(headings));
    }

    // Check for proper heading hierarchy
    if (opts.checkHeadingHierarchy) {
      issues.push(...checkHeadingHierarchy(headings));
    }

    // Check for skipped heading levels
    if (opts.checkSkippedHeadings) {
      issues.push(...checkSkippedHeadingLevels(headings));
    }

    // Check for semantic HTML elements
    if (opts.checkSemantic) {
      issues.push(...checkSemanticHTML(root));
    }

    // Check for missing landmark regions
    if (opts.checkMissingLandmarks) {
      issues.push(...checkLandmarks(root));
    }

    // Analyze the URL design
    const urlAnalysis = analyzeURL(url);
    if (urlAnalysis.issues.length > 0) {
      issues.push({
        id: 'url-design',
        impact: 'moderate',
        description: 'URL design can be improved for better usability and SEO',
        nodes: [`<a href="${url}">${url}</a>`],
        wcagCriteria: ['2.4.4', '2.4.9'],
        structureType: 'url',
        structureDetails: {
          urlIssues: urlAnalysis.issues,
          readabilityScore: urlAnalysis.readability,
          suggestedStructure: generateURLSuggestion(url, urlAnalysis)
        }
      });
    }

    return issues;
  } catch (error) {
    console.error('Error analyzing HTML structure:', error);
    return [{
      id: 'structure-analysis-error',
      impact: 'moderate',
      description: 'An error occurred while analyzing the HTML structure.',
      nodes: ['<div>Error analyzing HTML structure</div>'],
      wcagCriteria: ['1.3.1'],
      autoFixable: false
    }];
  }
}

/**
 * Extracts all headings from the HTML document
 */
function extractHeadings(root: HTMLElement): HeadingInfo[] {
  const headings: HeadingInfo[] = [];
  const headingElements = root.querySelectorAll('h1, h2, h3, h4, h5, h6');

  headingElements.forEach(heading => {
    const level = parseInt(heading.tagName.substring(1), 10);
    headings.push({
      level,
      text: heading.textContent?.trim() || '',
      element: heading as HTMLElement
    });
  });

  return headings;
}

/**
 * Checks for multiple H1 tags in the document
 */
function checkMultipleH1Tags(headings: HeadingInfo[]): AccessibilityIssue[] {
  const h1Headings = headings.filter(h => h.level === 1);
  
  if (h1Headings.length > 1) {
    const nodes = h1Headings.map(h => h.element.outerHTML);
    return [{
      id: 'multiple-h1',
      impact: 'serious',
      description: `Found ${h1Headings.length} H1 headings. For optimal accessibility and SEO, a page should generally have only one H1 heading that describes the main content.`,
      nodes,
      wcagCriteria: ['1.3.1', '2.4.6'],
      autoFixable: false,
      fixSuggestion: 'Keep the most important H1 and change the others to H2 or other appropriate levels.',
      structureType: 'heading',
      structureDetails: {
        multipleH1s: true,
        suggestedStructure: `<!-- Keep only one primary H1 heading -->
<h1>Main Page Title</h1>
<!-- Change secondary headings to H2 -->
<h2>Secondary Section</h2>
<h2>Another Section</h2>`
      }
    }];
  }
  
  return [];
}

/**
 * Checks for proper heading hierarchy (H1 before H2, H2 before H3, etc.)
 */
function checkHeadingHierarchy(headings: HeadingInfo[]): AccessibilityIssue[] {
  if (headings.length === 0) return [];

  const issues: AccessibilityIssue[] = [];
  let foundH1 = false;

  // Check if the page has at least one H1
  const hasH1 = headings.some(h => h.level === 1);
  if (!hasH1) {
    issues.push({
      id: 'page-has-heading-one',
      impact: 'moderate',
      description: 'The page does not have a top-level H1 heading, which should be the main title of the page.',
      nodes: ['<body>...</body>'],
      wcagCriteria: ['1.3.1', '2.4.6'],
      autoFixable: false,
      fixSuggestion: 'Add an H1 heading that describes the main content of the page.',
      structureType: 'heading',
      structureDetails: {
        suggestedStructure: `<h1>Main Page Title</h1>
<h2>Section Title</h2>
<!-- Other content -->`,
        multipleH1s: false
      }
    });
  }

  // Check heading hierarchy
  for (let i = 0; i < headings.length; i++) {
    const heading = headings[i];
    
    if (heading.level === 1) {
      foundH1 = true;
    } else if (heading.level > 1 && !foundH1) {
      // Found an Hx (x > 1) before any H1
      issues.push({
        id: 'heading-order',
        impact: 'moderate',
        description: `Found an H${heading.level} heading before any H1 heading. The page should start with an H1 heading.`,
        nodes: [heading.element.outerHTML],
        wcagCriteria: ['1.3.1', '2.4.6'],
        autoFixable: false,
        fixSuggestion: 'Reorganize headings to start with an H1 as the main title.',
        structureType: 'heading',
        structureDetails: {
          expectedLevel: 1,
          actualLevel: heading.level,
          suggestedStructure: `<h1>Main Page Title</h1>
<h2>${heading.text}</h2>
<!-- Rest of content -->`
        }
      });
      break; // Only report the first instance
    }
  }

  return issues;
}

/**
 * Checks for skipped heading levels (e.g., H1 followed by H3)
 */
function checkSkippedHeadingLevels(headings: HeadingInfo[]): AccessibilityIssue[] {
  const issues: AccessibilityIssue[] = [];
  
  for (let i = 0; i < headings.length - 1; i++) {
    const current = headings[i];
    const next = headings[i + 1];
    
    if (next.level > current.level + 1) {
      issues.push({
        id: 'skipped-heading-level',
        impact: 'moderate',
        description: `Skipped heading level: H${current.level} followed by H${next.level}, skipping ${
          Array.from({ length: next.level - current.level - 1 }, 
            (_, idx) => `H${current.level + idx + 1}`).join(', ')
        }.`,
        nodes: [current.element.outerHTML, next.element.outerHTML],
        wcagCriteria: ['1.3.1', '2.4.10'],
        autoFixable: false,
        fixSuggestion: `Change the H${next.level} to H${current.level + 1} or add the missing heading levels.`,
        structureType: 'heading',
        structureDetails: {
          expectedLevel: current.level + 1,
          actualLevel: next.level,
          suggestedStructure: `${current.element.outerHTML}
<!-- Add missing level or change the next heading -->
<h${current.level + 1}>${next.text}</h${current.level + 1}>
<!-- Rest of content -->`
        }
      });
    }
  }
  
  return issues;
}

/**
 * Checks for semantic HTML elements
 */
function checkSemanticHTML(root: HTMLElement): AccessibilityIssue[] {
  const issues: AccessibilityIssue[] = [];

  // Check for non-semantic navigation elements
  const potentialNavigations = Array.from(root.querySelectorAll('div, ul')).filter(el => {
    const children = el.querySelectorAll('a');
    return children.length >= 3 && 
           !el.closest('nav') && 
           !el.closest('[role="navigation"]');
  });

  if (potentialNavigations.length > 0) {
    issues.push({
      id: 'unsemantic-navigation',
      impact: 'moderate',
      description: 'Found potential navigation elements not using the semantic <nav> element.',
      nodes: potentialNavigations.slice(0, 3).map(el => el.outerHTML),
      wcagCriteria: ['1.3.1', '4.1.2'],
      autoFixable: true,
      fixSuggestion: 'Use <nav> elements for navigation regions.',
      structureType: 'semantic',
      structureDetails: {
        unSemanticElement: potentialNavigations[0].tagName.toLowerCase(),
        suggestedStructure: `<nav aria-label="Main navigation">
  ${potentialNavigations[0].innerHTML}
</nav>`
      }
    });
  }

  // Check for non-semantic lists
  const bulletDivs = Array.from(root.querySelectorAll('div')).filter(div => {
    const childDivs = div.querySelectorAll('div');
    return (
      childDivs.length >= 3 && 
      Array.from(childDivs).every(child => {
        const childText = child.textContent || '';
        return childText.startsWith('•') || 
              childText.startsWith('-') || 
              childText.startsWith('*');
      })
    );
  });

  if (bulletDivs.length > 0) {
    issues.push({
      id: 'unsemantic-list',
      impact: 'moderate',
      description: 'Found bullet-point items not using semantic <ul>/<li> structure.',
      nodes: bulletDivs.slice(0, 2).map(el => el.outerHTML),
      wcagCriteria: ['1.3.1'],
      autoFixable: true,
      fixSuggestion: 'Use <ul> and <li> elements for list content.',
      structureType: 'semantic',
      structureDetails: {
        unSemanticElement: 'div',
        suggestedStructure: `<ul>
  <li>${bulletDivs[0].textContent?.replace(/^[•\\-\\*]\\s*/, '') || 'List item 1'}</li>
  <li>List item 2</li>
  <li>List item 3</li>
</ul>`
      }
    });
  }

  return issues;
}

/**
 * Checks for missing landmark roles
 */
function checkLandmarks(root: HTMLElement): AccessibilityIssue[] {
  const issues: AccessibilityIssue[] = [];
  
  // Check for main landmark
  const hasMain = root.querySelector('main, [role="main"]');
  if (!hasMain) {
    issues.push({
      id: 'missing-main-landmark',
      impact: 'moderate',
      description: 'No <main> element or element with role="main" found. The main content should be contained in a <main> element.',
      nodes: ['<body>...</body>'],
      wcagCriteria: ['1.3.1', '2.4.1'],
      autoFixable: false,
      fixSuggestion: 'Wrap the main content in a <main> element.',
      structureType: 'landmark',
      structureDetails: {
        missingLandmark: true,
        suggestedStructure: `<body>
  <header>...</header>
  <main>
    <!-- Main content here -->
  </main>
  <footer>...</footer>
</body>`
      }
    });
  }
  
  return issues;
}

/**
 * Analyzes URL design for readability and usability
 */
export function analyzeURL(url: string): URLAnalysisResult {
  const issues: string[] = [];
  let readability: 'good' | 'moderate' | 'poor' = 'good';
  let length: 'good' | 'moderate' | 'poor' = 'good';
  
  try {
    const parsedURL = new URL(url);
    const path = parsedURL.pathname;
    
    // Check for URL parameters (query string)
    const containsParameters = parsedURL.search.length > 0;
    
    // Check URL length
    if (url.length > 100) {
      length = 'poor';
      issues.push('URL is excessively long (over 100 characters)');
    } else if (url.length > 75) {
      length = 'moderate';
      issues.push('URL is quite long (over 75 characters)');
    }
    
    // Check path segment length and number
    const segments = path.split('/').filter(s => s.length > 0);
    if (segments.length > 5) {
      issues.push('URL has too many path segments (more than 5)');
      readability = 'poor';
    }
    
    // Check for very long segments
    const longSegments = segments.filter(s => s.length > 20);
    if (longSegments.length > 0) {
      issues.push('URL contains overly long path segments (over 20 characters)');
      readability = readability === 'good' ? 'moderate' : 'poor';
    }
    
    // Check for underscores vs hyphens
    const usesUnderscores = segments.some(s => s.includes('_'));
    const usesHyphens = segments.some(s => s.includes('-'));
    
    if (usesUnderscores) {
      issues.push('URL uses underscores instead of hyphens for word separation');
      readability = readability === 'good' ? 'moderate' : readability;
    }
    
    // Check for mixed case (inconsistent)
    const hasMixedCase = segments.some(s => {
      const hasUpper = /[A-Z]/.test(s);
      const hasLower = /[a-z]/.test(s);
      return hasUpper && hasLower;
    });
    
    if (hasMixedCase) {
      issues.push('URL uses mixed case, which can cause confusion');
      readability = readability === 'good' ? 'moderate' : readability;
    }
    
    // Check for keyword usage (simplistic check for common words)
    const commonWords = ['about', 'contact', 'services', 'products', 'blog', 'news'];
    const usesKeywords = segments.some(s => 
      commonWords.some(word => s.toLowerCase().includes(word))
    );
    
    // Overall URL assessment
    if (issues.length === 0) {
      issues.push('URL design is good for accessibility and SEO');
    }
    
    return {
      readability,
      length,
      usesKeywords,
      usesHyphens,
      usesUnderscores,
      containsParameters,
      issues
    };
  } catch (error) {
    console.error('Error analyzing URL:', error);
    return {
      readability: 'poor',
      length: 'moderate',
      usesKeywords: false,
      usesHyphens: false,
      usesUnderscores: false,
      containsParameters: false,
      issues: ['Invalid URL format']
    };
  }
}

/**
 * Generates a suggested improved URL based on analysis
 */
function generateURLSuggestion(url: string, analysis: URLAnalysisResult): string {
  try {
    const parsedURL = new URL(url);
    let path = parsedURL.pathname;
    let suggestion = '';
    
    // Replace underscores with hyphens
    if (analysis.usesUnderscores) {
      path = path.replace(/_/g, '-');
    }
    
    // Convert to lowercase
    path = path.toLowerCase();
    
    // Simplify long paths if needed
    const segments = path.split('/').filter(s => s.length > 0);
    const simplifiedSegments = segments.map(s => {
      if (s.length > 20) {
        // Truncate very long segments
        return s.substring(0, 20) + '...';
      }
      return s;
    });
    
    // Rebuild the URL
    const newPath = '/' + simplifiedSegments.join('/');
    suggestion = `${parsedURL.protocol}//${parsedURL.host}${newPath}`;
    
    // Explain changes
    if (suggestion !== url) {
      suggestion += '\n\nImprovements:\n';
      
      if (analysis.usesUnderscores) {
        suggestion += '- Replaced underscores with hyphens for better SEO\n';
      }
      
      if (path !== parsedURL.pathname) {
        suggestion += '- Simplified URL structure\n';
      }
    } else {
      suggestion = 'Original URL is well-structured.';
    }
    
    return suggestion;
  } catch (error) {
    console.error('Error generating URL suggestion:', error);
    return 'Could not generate URL suggestion due to an error.';
  }
}