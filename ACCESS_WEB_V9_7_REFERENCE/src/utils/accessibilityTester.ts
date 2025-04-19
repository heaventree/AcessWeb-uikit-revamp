import axe, { Result, RunOptions } from 'axe-core';
import { parse } from 'node-html-parser';
import type { TestResult, AccessibilityIssue } from '../types';
import { addLegislationRefs } from './legislationMapper';
import { getWCAGInfo } from './wcagHelper';
import { testPDFAccessibility } from './pdfAccessibilityTester';
import { analyzeMediaAccessibility } from './mediaAccessibilityTester';
import { testDocumentAccessibility, checkDocumentLinks } from './documentFormatTester';
import { analyzeHtmlStructure, analyzeURL } from './htmlStructureAnalyzer';
import { analyzeResponsiveDesign } from './responsiveDesignAnalyzer';
import Color from 'color';

// Configure axe-core rules based on selected region
function getAxeConfig(_region: string): RunOptions {
  const baseConfig: RunOptions = {
    rules: {
      // Core WCAG 2.1 Rules
      'color-contrast': { enabled: true },
      'image-alt': { enabled: true },
      'link-name': { enabled: true },
      'list': { enabled: true },
      'listitem': { enabled: true },
      'heading-order': { enabled: true },
      'label': { enabled: true },
      // Language Rules
      'frame-title': { enabled: true },
      'html-lang-valid': { enabled: true },
      'html-has-lang': { enabled: true },
      'valid-lang': { enabled: true },
      'region': { enabled: true },
      'page-has-heading-one': { enabled: true },
      'landmark-one-main': { enabled: true },
      'landmark-banner-is-top-level': { enabled: true },
      'landmark-complementary-is-top-level': { enabled: true },
      'landmark-no-duplicate-banner': { enabled: true },
      'button-name': { enabled: true },
      'aria-roles': { enabled: true },
      'aria-valid-attr': { enabled: true },
      'aria-valid-attr-value': { enabled: true },
      'aria-hidden-body': { enabled: true },
      'document-title': { enabled: true }
    },
    resultTypes: ['violations', 'passes', 'incomplete'],
    reporter: 'v2',
    iframes: true,
    elementRef: true,
    runOnly: {
      type: 'tag',
      values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22a', 'wcag22aa', 'best-practice']
    }
  };

  return baseConfig;
}

// Color contrast utilities
function getLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map(value => {
    value /= 255;
    return value <= 0.03928
      ? value / 12.92
      : Math.pow((value + 0.055) / 1.055, 2.4);
  });
  return rs * 0.2126 + gs * 0.7152 + bs * 0.0722;
}

function getContrastRatio(color1: string, color2: string): number {
  // Convert hex/rgb colors to RGB values
  const getRGB = (color: string) => {
    const hex = color.startsWith('#') ? color : '#000000';
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return { r, g, b };
  };

  const c1 = getRGB(color1);
  const c2 = getRGB(color2);

  const l1 = getLuminance(c1.r, c1.g, c1.b);
  const l2 = getLuminance(c2.r, c2.g, c2.b);

  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);

  return (lighter + 0.05) / (darker + 0.05);
}

// Get effective background color considering opacity and parent elements
function getEffectiveBackground(element: HTMLElement): string {
  let background = getComputedStyle(element).backgroundColor;
  let currentElement: HTMLElement | null = element;
  let opacity = 1;

  while ((background === 'transparent' || background === 'rgba(0, 0, 0, 0)') && currentElement.parentElement) {
    currentElement = currentElement.parentElement;
    const style = getComputedStyle(currentElement);
    background = style.backgroundColor;
    opacity *= parseFloat(style.opacity) || 1;
  }

  // If no background color is found, default to white
  if (background === 'transparent' || background === 'rgba(0, 0, 0, 0)') {
    return '#FFFFFF';
  }

  // Apply opacity to background color
  if (opacity < 1) {
    const color = Color(background);
    return color.alpha(opacity).toString();
  }

  return background;
}

function mapAxeImpactLevel(impact: string | undefined): 'critical' | 'serious' | 'moderate' | 'minor' {
  switch (impact) {
    case 'critical':
      return 'critical';
    case 'serious':
      return 'serious';
    case 'moderate':
      return 'moderate';
    default:
      return 'minor';
  }
}

function convertAxeResultToIssue(result: Result): AccessibilityIssue {
  const nodes = result.nodes.map(node => {
    let html = node.html;
    
    // Add color information for contrast issues
    if (result.id === 'color-contrast' && node.target && node.target[0]) {
      const target = node.target[0];
      const failureSummary = node.failureSummary || '';
      const contrastInfo = failureSummary.match(/contrast ratio is (\d+(\.\d+)?):1/);
      const ratio = contrastInfo ? contrastInfo[1] : 'unknown';
      
      html = `${html}\nContrast Ratio: ${ratio}:1\nElement: ${target}`;
    }
    
    return html;
  });

  // Get WCAG criteria from the result
  const wcagCriteria = result.tags
    .filter(tag => /wcag\d{3}/.test(tag))
    .map(tag => tag.toUpperCase());

  // Get WCAG info for the issue
  const wcagInfo = getWCAGInfo(result.id);

  // Map the impact level, with a type-safe approach
  const impact = result.impact ? mapAxeImpactLevel(result.impact) : 'minor';

  return {
    id: result.id,
    impact,
    description: result.help,
    helpUrl: result.helpUrl,
    nodes,
    wcagCriteria,
    autoFixable: result.id === 'color-contrast' || result.id === 'image-alt' || result.id === 'button-name',
    fixSuggestion: wcagInfo?.suggestedFix || result.help,
    codeExample: wcagInfo?.codeExample
    // Removed the legislationRefs property that doesn't exist in WCAGInfo
  };
}

async function fetchWithTimeout(url: string, timeout = 15000): Promise<Response> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, { 
      signal: controller.signal,
      headers: {
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'User-Agent': 'Mozilla/5.0 AccessibilityChecker/1.0'
      }
    });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    throw error;
  }
}

async function fetchWithRetry(url: string, maxRetries = 3): Promise<Response> {
  const corsProxies = [
    'https://corsproxy.io/?',
    'https://api.allorigins.win/raw?url=',
    'https://api.codetabs.com/v1/proxy?quest=',
    'https://thingproxy.freeboard.io/fetch/',
  ];

  // Try direct fetch first
  try {
    console.log('Attempting direct fetch for:', url);
    const response = await fetchWithTimeout(url);
    if (response.ok) {
      console.log('Direct fetch successful');
      return response;
    }
    console.warn('Direct fetch returned non-OK status:', response.status);
  } catch (error) {
    console.warn('Direct fetch failed, will try proxies:', error instanceof Error ? error.message : String(error));
  }

  // Try each proxy with retries
  let lastError: any = null;
  for (const proxy of corsProxies) {
    for (let retry = 0; retry < maxRetries; retry++) {
      try {
        const encodedUrl = encodeURIComponent(url);
        const proxyUrl = `${proxy}${encodedUrl}`;
        console.log(`Trying proxy (attempt ${retry + 1}):`, proxy);
        
        const response = await fetchWithTimeout(proxyUrl);
        if (response.ok) {
          console.log('Proxy fetch successful with:', proxy);
          return response;
        }
        console.warn(`Proxy ${proxy} returned non-OK status:`, response.status);
      } catch (error) {
        lastError = error;
        console.warn(`Proxy ${proxy} attempt ${retry + 1} failed:`, error instanceof Error ? error.message : String(error));
        if (retry < maxRetries - 1) {
          // Exponential backoff
          const backoffTime = Math.pow(2, retry) * 1000;
          console.log(`Backing off for ${backoffTime}ms before next attempt`);
          await new Promise(resolve => setTimeout(resolve, backoffTime));
        }
      }
    }
  }

  console.error('All fetch attempts failed. Last error:', lastError);
  
  throw new Error(
    'Failed to access the website. This could be due to:\n' +
    '• The website blocking automated access\n' +
    '• Invalid URL format\n' +
    '• Website is currently offline\n' +
    '• CORS restrictions\n\n' +
    'Please verify the URL and try again. If the problem persists, you may need to test the site locally.'
  );
}

// Check color contrast for all text elements (Kept for future use but commented out)
/*
async function checkColorContrast(container: HTMLElement): Promise<AccessibilityIssue[]> {
  const issues: AccessibilityIssue[] = [];
  const textElements = container.querySelectorAll('h1, h2, h3, h4, h5, h6, p, a, span, li, td, th, label, button');

  textElements.forEach(element => {
    const style = getComputedStyle(element as HTMLElement);
    const color = style.color;
    const backgroundColor = getEffectiveBackground(element as HTMLElement);

    // Check if text is "large" according to WCAG
    const fontSize = parseFloat(style.fontSize);
    const fontWeight = parseInt(style.fontWeight);
    const isLargeText = fontSize >= 18.66 || (fontSize >= 14 && fontWeight >= 700);

    const ratio = getContrastRatio(color, backgroundColor);
    const requiredRatio = isLargeText ? 3 : 4.5;

    if (ratio < requiredRatio) {
      issues.push({
        id: 'color-contrast',
        impact: 'serious',
        description: `Insufficient color contrast ratio. Element "${(element as HTMLElement).innerText}" has a contrast ratio of ${ratio}:1 (required: ${requiredRatio}:1)`,
        nodes: [(element as HTMLElement).outerHTML],
        wcagCriteria: ['1.4.3']
      });
    }
  });

  return issues;
}
*/

export async function testAccessibility(
  url: string, 
  region: string = 'global', 
  options?: { 
    documentTesting?: { 
      enabled: boolean; 
      pdfAccessibility?: boolean;
      officeDocuments?: boolean;
    },
    mediaTesting?: {
      enabled: boolean;
      audioTesting?: boolean;
      videoTesting?: boolean;
    } 
  }
): Promise<TestResult> {
  // Validate URL format
  try {
    new URL(url);
  } catch {
    throw new Error('Please enter a valid URL (e.g., https://example.com)');
  }

  // Check if it's a document file that needs direct testing
  const urlLower = url.toLowerCase();
  const isPDF = urlLower.endsWith('.pdf');
  
  // Document extensions to check
  const documentExtensions = [
    'docx', 'doc', 'odt', 'rtf', // Word
    'xlsx', 'xls', 'ods', 'csv', // Excel
    'pptx', 'ppt', 'odp'         // PowerPoint
  ];
  
  const isOfficeDocument = documentExtensions.some(ext => urlLower.endsWith(`.${ext}`));
  
  // If it's a document and document testing is enabled
  if (options?.documentTesting?.enabled) {
    // Test PDF if it's a PDF file and PDF testing is enabled
    if (isPDF && options.documentTesting.pdfAccessibility) {
      try {
        const pdfIssues = await testPDFAccessibility(url);
        
        const summary = {
          critical: pdfIssues.filter(i => i.impact === 'critical').length,
          serious: pdfIssues.filter(i => i.impact === 'serious').length,
          moderate: pdfIssues.filter(i => i.impact === 'moderate').length,
          minor: pdfIssues.filter(i => i.impact === 'minor').length,
          passes: 0,
          warnings: 0,
          documentIssues: pdfIssues.length,
          pdfIssues: pdfIssues.length
        };

        const testResults: TestResult = {
          url,
          timestamp: new Date().toISOString(),
          issues: pdfIssues,
          passes: [],
          warnings: [],
          summary
        };

        return addLegislationRefs(testResults);
      } catch (error) {
        console.error('PDF testing error:', error);
        throw new Error('Failed to analyze PDF document. Please ensure it is a valid PDF file.');
      }
    }
    
    // Test Office documents if it's an office document and office document testing is enabled
    if (isOfficeDocument && options.documentTesting.officeDocuments) {
      try {
        console.log('Testing Office document accessibility...');
        const docIssues = await testDocumentAccessibility(url);
        
        const summary = {
          critical: docIssues.filter(i => i.impact === 'critical').length,
          serious: docIssues.filter(i => i.impact === 'serious').length,
          moderate: docIssues.filter(i => i.impact === 'moderate').length,
          minor: docIssues.filter(i => i.impact === 'minor').length,
          passes: 0,
          warnings: 0,
          documentIssues: docIssues.length
        };

        const testResults: TestResult = {
          url,
          timestamp: new Date().toISOString(),
          issues: docIssues,
          passes: [],
          warnings: [],
          summary
        };

        return addLegislationRefs(testResults);
      } catch (error) {
        console.error('Document testing error:', error);
        throw new Error('Failed to analyze document. Please ensure it is a valid Office document file.');
      }
    }
  }

  // If not a PDF or PDF testing is disabled, proceed with HTML testing
  const container = document.createElement('div');
  container.style.position = 'absolute';
  container.style.left = '-9999px';
  container.style.width = '1024px';
  container.style.height = '768px';
  container.style.overflow = 'hidden';
  document.body.appendChild(container);

  try {
    // Fetch and parse HTML
    const response = await fetchWithRetry(url);
    const html = await response.text();
    
    if (!html.trim()) {
      throw new Error('The website returned an empty response');
    }

    // Parse and inject HTML
    const root = parse(html);
    container.innerHTML = root.toString();

    // Run accessibility tests with axe-core
    const axeConfig = getAxeConfig(region);
    const axeResults = await axe.run(container, axeConfig);
    console.log('Axe Results:', axeResults);

    // Process axe results
    const issues = axeResults.violations.map(convertAxeResultToIssue);
    const passes = axeResults.passes.map(convertAxeResultToIssue);
    const warnings = axeResults.incomplete.map(convertAxeResultToIssue);
    
    // Run enhanced HTML structure analysis
    console.log('Running enhanced HTML structure analysis...');
    try {
      const structureIssues = analyzeHtmlStructure(html, url);
      if (structureIssues.length > 0) {
        console.log(`Found ${structureIssues.length} HTML structure issues`);
        issues.push(...structureIssues);
      }
    } catch (structureError) {
      console.error('Error during HTML structure analysis:', structureError);
      warnings.push({
        id: 'structure-analysis-error',
        impact: 'moderate',
        description: 'An error occurred during enhanced structure analysis.',
        nodes: ['<div>Structure analysis could not be completed</div>'],
        wcagCriteria: ['1.3.1'],
        autoFixable: false,
        fixSuggestion: 'Please review the HTML structure manually for proper semantic elements and heading hierarchy.'
      });
    }
    
    // Run responsive design analysis
    console.log('Running responsive design analysis...');
    try {
      // Convert DOM Element to string to pass to analyzeResponsiveDesign
      const htmlContent = container.innerHTML;
      const responsiveIssues = analyzeResponsiveDesign(htmlContent, {});
      if (responsiveIssues.length > 0) {
        console.log(`Found ${responsiveIssues.length} responsive design issues`);
        issues.push(...responsiveIssues);
      }
    } catch (responsiveError) {
      console.error('Error during responsive design analysis:', responsiveError);
      warnings.push({
        id: 'responsive-analysis-error',
        impact: 'moderate',
        description: 'An error occurred during responsive design analysis.',
        nodes: ['<div>Responsive design analysis could not be completed</div>'],
        wcagCriteria: ['1.4.10', '2.5.5', '1.3.4'],
        autoFixable: false,
        fixSuggestion: 'Please review your site on mobile devices and ensure proper responsive implementation.'
      });
    }

    // Check for PDF links in the page
    if (options?.documentTesting?.enabled && options.documentTesting.pdfAccessibility) {
      const pdfLinks = Array.from(container.querySelectorAll('a[href$=".pdf"]'));
      
      if (pdfLinks.length > 0) {
        // Add a warning about PDF links
        issues.push({
          id: 'pdf-links-found',
          impact: 'moderate',
          description: `Found ${pdfLinks.length} PDF link(s) on the page. Each PDF should be tested for accessibility compliance.`,
          nodes: pdfLinks.map(link => (link as HTMLElement).outerHTML),
          wcagCriteria: ['1.1.1', '2.4.5'],
          autoFixable: false,
          fixSuggestion: 'Ensure all linked PDFs are accessible and include appropriate alternative formats or descriptions.'
        });
      }
    }

    // Check for Office document links on the page
    if (options?.documentTesting?.enabled && options.documentTesting.officeDocuments) {
      try {
        console.log('Checking for document links...');
        const documentIssues = checkDocumentLinks(container);
        
        // Add document issues to main issues array
        issues.push(...documentIssues);
        
        console.log(`Found ${documentIssues.length} document accessibility issues`);
      } catch (documentError) {
        console.error('Error during document link checking:', documentError);
        issues.push({
          id: 'document-testing-error',
          impact: 'moderate',
          description: 'An error occurred during document link testing. Some document accessibility issues may not be reported.',
          nodes: ['<e>Document link testing failed</e>'],
          wcagCriteria: ['1.1.1', '1.3.1'],
          fixSuggestion: 'Please check all document links manually to ensure they point to accessible documents or provide appropriate alternatives.'
        });
      }
    }

    // Run media accessibility tests if enabled
    let mediaIssues: AccessibilityIssue[] = [];
    if (options?.mediaTesting?.enabled) {
      try {
        console.log('Running media accessibility tests...');
        // Use the container's innerHTML as the HTML to analyze
        mediaIssues = await analyzeMediaAccessibility(container.innerHTML, url);
        
        // Add media issues to main issues array
        issues.push(...mediaIssues);
        
        console.log(`Found ${mediaIssues.length} media accessibility issues`);
      } catch (mediaError) {
        console.error('Error during media accessibility testing:', mediaError);
        issues.push({
          id: 'media-testing-error',
          impact: 'moderate',
          description: 'An error occurred during media accessibility testing. Some media accessibility issues may not be reported.',
          nodes: ['<error>Media testing failed</error>'],
          wcagCriteria: ['1.2.1', '1.2.2', '1.2.3', '1.2.5'],
          fixSuggestion: 'Please check all media elements manually to ensure they have proper captions, transcripts, and audio descriptions.'
        });
      }
    }

    // Commented out the unused contrastIssues variable but keeping for future use
    /* 
    const contrastIssues = axeResults.violations
      .filter(v => v.id === 'color-contrast')
      .map(v => v.nodes)
      .flat()
      .map(node => ({
        id: 'color-contrast',
        impact: 'serious' as const,
        description: `Insufficient color contrast ratio. Element "${node.html}" has a contrast ratio less than 4.5:1 for normal text or 3:1 for large text.`,
        nodes: [node.html],
        wcagCriteria: ['1.4.3']
      }));
    */

    // Count media-specific issues
    const audioIssues = mediaIssues.filter(i => i.mediaType === 'audio').length;
    const videoIssues = mediaIssues.filter(i => i.mediaType === 'video').length;
    const embeddedMediaIssues = mediaIssues.filter(i => i.mediaType === 'embedded').length;
    const totalMediaIssues = audioIssues + videoIssues + embeddedMediaIssues;
    
    // Count structure-specific issues
    const headingIssues = issues.filter(i => 
      i.structureType === 'heading' || 
      i.id === 'heading-order' || 
      i.id === 'multiple-h1' || 
      i.id === 'skipped-heading-level'
    ).length;
    
    const semanticIssues = issues.filter(i => 
      i.structureType === 'semantic' || 
      i.structureType === 'landmark' || 
      i.id === 'missing-main-landmark' || 
      i.id === 'unsemantic-navigation' || 
      i.id === 'unsemantic-list'
    ).length;
    
    const urlIssues = issues.filter(i => 
      i.structureType === 'url' || 
      i.id === 'url-design'
    ).length;
    
    // Count responsive-specific issues
    const responsiveIssues = issues.filter(i => 
      i.structureType === 'responsive' || 
      i.id.includes('responsive') || 
      i.id.includes('viewport') || 
      i.id.includes('mobile') || 
      i.wcagCriteria.includes('1.4.10') || // Reflow
      i.wcagCriteria.includes('1.3.4') || // Orientation
      i.wcagCriteria.includes('1.4.12') || // Text Spacing
      i.wcagCriteria.includes('2.5.5') || // Target Size
      i.wcagCriteria.includes('2.5.8')    // Target Size Enhanced
    ).length;
    
    const totalStructureIssues = headingIssues + semanticIssues + urlIssues;

    // Compile summary
    const summary = {
      critical: issues.filter(i => i.impact === 'critical').length,
      serious: issues.filter(i => i.impact === 'serious').length,
      moderate: issues.filter(i => i.impact === 'moderate').length,
      minor: issues.filter(i => i.impact === 'minor').length,
      passes: passes.length,
      warnings: warnings.length,
      mediaIssues: totalMediaIssues > 0 ? totalMediaIssues : undefined,
      audioIssues: audioIssues > 0 ? audioIssues : undefined,
      videoIssues: videoIssues > 0 ? videoIssues : undefined,
      structureIssues: totalStructureIssues > 0 ? totalStructureIssues : undefined,
      headingIssues: headingIssues > 0 ? headingIssues : undefined,
      semanticIssues: semanticIssues > 0 ? semanticIssues : undefined,
      urlIssues: urlIssues > 0 ? urlIssues : undefined,
      responsiveIssues: responsiveIssues > 0 ? responsiveIssues : undefined
    };

    const testResults: TestResult = {
      url,
      timestamp: new Date().toISOString(),
      issues,
      passes,
      warnings,
      summary
    };

    return addLegislationRefs(testResults);

  } catch (error) {
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new Error('The request timed out. Please try again.');
      }
      throw error;
    }
    throw new Error('An unexpected error occurred while testing the website.');
  } finally {
    // Clean up
    if (container.parentNode) {
      document.body.removeChild(container);
    }
  }
}