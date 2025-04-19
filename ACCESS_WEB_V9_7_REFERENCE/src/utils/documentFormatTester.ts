import type { AccessibilityIssue } from '../types';

interface DocumentInfo {
  url: string;
  filename: string;
  fileFormat: 'word' | 'excel' | 'powerpoint' | 'other';
  fileExtension: string;
  metadata?: {
    title?: string;
    author?: string;
    created?: string;
    modified?: string;
  };
  structure?: {
    hasHeadings: boolean;
    hasAltText: boolean;
    hasTableHeaders: boolean;
    hasAccessibleNames: boolean;
    hasReadingOrder: boolean;
  };
  pageCount?: number;
  estimatedSize?: number;
}

// Document extensions mapping
const documentExtensions: Record<string, 'word' | 'excel' | 'powerpoint' | 'other'> = {
  // Word documents
  'docx': 'word',
  'doc': 'word',
  'odt': 'word',
  'rtf': 'word',
  
  // Excel documents
  'xlsx': 'excel',
  'xls': 'excel',
  'ods': 'excel',
  'csv': 'excel',
  
  // PowerPoint documents
  'pptx': 'powerpoint',
  'ppt': 'powerpoint',
  'odp': 'powerpoint',
  
  // Other document formats
  'txt': 'other',
};

/**
 * Extracts document information from a document URL
 * @param url URL to the document
 * @returns Document information or null if not a supported document format
 */
async function extractDocumentInfo(url: string): Promise<DocumentInfo | null> {
  try {
    // Extract file extension from URL
    const urlLower = url.toLowerCase();
    const extension = urlLower.split('.').pop() || '';
    
    if (!extension || !documentExtensions[extension]) {
      return null; // Not a supported document format
    }
    
    // Parse the filename from the URL
    const urlParts = url.split('/');
    const filename = urlParts[urlParts.length - 1];
    
    // Get the file format based on extension
    const fileFormat = documentExtensions[extension];
    
    // In a real implementation, we would fetch and analyze the document
    // For now, we'll use a mock implementation
    return {
      url,
      filename,
      fileFormat,
      fileExtension: extension,
      pageCount: 5, // Mock value
      estimatedSize: 500, // Mock value in KB
      structure: {
        hasHeadings: false,      // Would be determined by document analysis
        hasAltText: false,       // Would be determined by document analysis
        hasTableHeaders: false,  // Would be determined by document analysis
        hasAccessibleNames: false, // Would be determined by document analysis
        hasReadingOrder: false   // Would be determined by document analysis
      }
    };
  } catch (error) {
    console.error('Error extracting document info:', error);
    return null;
  }
}

/**
 * Tests a document file for accessibility issues
 * @param url URL to the document file
 * @returns Array of accessibility issues found in the document
 */
export async function testDocumentAccessibility(url: string): Promise<AccessibilityIssue[]> {
  const issues: AccessibilityIssue[] = [];
  
  // Extract document information
  const docInfo = await extractDocumentInfo(url);
  if (!docInfo) {
    return issues; // Not a supported document or couldn't extract info
  }
  
  // Common checks for all document types
  if (!docInfo.structure?.hasHeadings) {
    issues.push({
      id: 'document-headings',
      impact: 'serious',
      description: `${docInfo.fileFormat.toUpperCase()} document does not use proper heading styles. This makes navigation difficult for screen reader users.`,
      nodes: [`Document: ${docInfo.filename}`],
      wcagCriteria: ['1.3.1', '2.4.6'],
      documentType: docInfo.fileFormat,
      documentDetails: {
        filename: docInfo.filename,
        hasStructure: false
      }
    });
  }
  
  if (!docInfo.structure?.hasAltText) {
    issues.push({
      id: 'document-alt-text',
      impact: 'serious',
      description: `${docInfo.fileFormat.toUpperCase()} document may contain images without alternative text descriptions.`,
      nodes: [`Document: ${docInfo.filename}`],
      wcagCriteria: ['1.1.1'],
      documentType: docInfo.fileFormat,
      documentDetails: {
        filename: docInfo.filename,
        hasAltText: false
      }
    });
  }
  
  // Format-specific checks
  switch (docInfo.fileFormat) {
    case 'word':
      if (!docInfo.structure?.hasReadingOrder) {
        issues.push({
          id: 'word-reading-order',
          impact: 'moderate',
          description: 'Word document may have complex layouts without proper reading order. This affects screen reader navigation.',
          nodes: [`Document: ${docInfo.filename}`],
          wcagCriteria: ['1.3.2'],
          documentType: 'word',
          documentDetails: {
            filename: docInfo.filename,
            readingOrder: false
          }
        });
      }
      break;
      
    case 'excel':
      if (!docInfo.structure?.hasTableHeaders) {
        issues.push({
          id: 'excel-table-headers',
          impact: 'serious',
          description: 'Excel spreadsheet does not have properly defined table headers. This makes navigation difficult for screen reader users.',
          nodes: [`Document: ${docInfo.filename}`],
          wcagCriteria: ['1.3.1'],
          documentType: 'excel',
          documentDetails: {
            filename: docInfo.filename,
            hasStructure: false
          }
        });
      }
      break;
      
    case 'powerpoint':
      if (!docInfo.structure?.hasReadingOrder) {
        issues.push({
          id: 'powerpoint-reading-order',
          impact: 'moderate',
          description: 'PowerPoint presentation may have slide elements without a proper reading order.',
          nodes: [`Document: ${docInfo.filename}`],
          wcagCriteria: ['1.3.2'],
          documentType: 'powerpoint',
          documentDetails: {
            filename: docInfo.filename,
            readingOrder: false
          }
        });
      }
      break;
  }
  
  // Add a general document accessibility issue
  issues.push({
    id: `${docInfo.fileFormat}-accessibility`,
    impact: 'moderate',
    description: `${docInfo.fileFormat.toUpperCase()} document (${docInfo.filename}) may have accessibility issues. Consider providing an accessible HTML alternative.`,
    nodes: [`Document: ${docInfo.filename}`],
    wcagCriteria: ['1.1.1', '1.3.1', '1.3.2', '2.4.5'],
    documentType: docInfo.fileFormat,
    documentDetails: {
      filename: docInfo.filename,
      pageCount: docInfo.estimatedSize // Using pageCount to store the file size since it's available in our interface
    },
    fixSuggestion: `Ensure your ${docInfo.fileFormat.toUpperCase()} document follows accessibility best practices. Consider providing an accessible HTML version as an alternative.`
  });
  
  return issues;
}

/**
 * Provides accessibility recommendations based on a document issue
 */
export function getDocumentAccessibilityRecommendations(issue: AccessibilityIssue): { 
  explanation: string;
  suggestedFix: string;
  codeExample?: string;
  additionalResources: string[];
} {
  // Default recommendation
  let recommendation = {
    explanation: 'Document accessibility is crucial for ensuring users with disabilities can access your content.',
    suggestedFix: 'Review your document with the built-in accessibility checker.',
    additionalResources: [
      'https://www.w3.org/WAI/WCAG21/Techniques/',
      'https://www.w3.org/WAI/fundamentals/accessibility-principles/'
    ]
  };
  
  // Check the issue ID to determine specific recommendations
  switch (issue.id) {
    case 'document-headings':
      return {
        explanation: 'Using proper heading styles creates a document structure that helps screen reader users navigate the content efficiently.',
        suggestedFix: 'Apply heading styles (Heading 1, Heading 2, etc.) to all section titles in a hierarchical manner.',
        codeExample: `In Microsoft Word:
1. Select your heading text
2. On the Home tab, in the Styles group, choose the appropriate heading level
3. Ensure a logical hierarchy (Heading 1 followed by Heading 2, etc.)`,
        additionalResources: [
          'https://support.microsoft.com/en-us/office/make-your-word-documents-accessible-to-people-with-disabilities-d9bf3683-87ac-47ea-b91a-78dcacb3c66d',
          'https://www.w3.org/WAI/WCAG21/Techniques/general/G130'
        ]
      };
      
    case 'document-alt-text':
      return {
        explanation: 'Alternative text for images provides a textual description for users who cannot see the image.',
        suggestedFix: 'Add meaningful alternative text to all non-decorative images in your document.',
        codeExample: `In Microsoft Office:
1. Right-click on an image
2. Select "Edit Alt Text"
3. Provide a clear, concise description
4. For decorative images, check "Mark as decorative"`,
        additionalResources: [
          'https://support.microsoft.com/en-us/office/add-alternative-text-to-a-shape-picture-chart-smartart-graphic-or-other-object-44989b2a-903c-4d9a-b742-6a75b451c669',
          'https://www.w3.org/WAI/tutorials/images/decision-tree/'
        ]
      };
      
    case 'word-reading-order':
      return {
        explanation: 'Complex layouts with multiple columns, text boxes, or floating elements may not be read in the correct order by screen readers.',
        suggestedFix: 'Simplify your layout when possible. For complex layouts, check the reading order using the Accessibility Checker.',
        codeExample: `In Microsoft Word:
1. Go to Review > Check Accessibility
2. Fix any "Reading order" issues
3. Consider using simpler layouts with standard paragraph formatting`,
        additionalResources: [
          'https://support.microsoft.com/en-us/office/improve-accessibility-with-the-accessibility-checker-a16f6de0-2f39-4a2b-8bd8-5ad801426c7f',
          'https://www.w3.org/WAI/WCAG21/Techniques/general/G57'
        ]
      };
      
    case 'excel-table-headers':
      return {
        explanation: 'Table headers help screen reader users understand the purpose of columns and rows in a spreadsheet.',
        suggestedFix: 'Define proper headers for your Excel tables and ensure they are designated as header rows.',
        codeExample: `In Microsoft Excel:
1. Select your data range
2. Go to Insert > Table
3. Ensure "My table has headers" is checked
4. Or use Format as Table and specify headers
5. For existing tables, go to Table Design > Header Row`,
        additionalResources: [
          'https://support.microsoft.com/en-us/office/make-your-excel-documents-accessible-to-people-with-disabilities-6cc05fc5-1314-48b5-8eb3-683e49b3e593',
          'https://www.w3.org/WAI/WCAG21/Techniques/html/H51'
        ]
      };
      
    case 'powerpoint-reading-order':
      return {
        explanation: 'Screen readers navigate through PowerPoint slides in a specific order that may not match your visual layout.',
        suggestedFix: 'Check and adjust the reading order of elements on each slide to ensure logical progression.',
        codeExample: `In Microsoft PowerPoint:
1. Go to Review > Check Accessibility
2. Look for "Reading Order" issues
3. Select an issue and click "Fix"
4. Alternatively, go to Home > Arrange > Selection Pane
5. Reorder objects from bottom (first read) to top (last read)`,
        additionalResources: [
          'https://support.microsoft.com/en-us/office/make-your-powerpoint-presentations-accessible-to-people-with-disabilities-6f7772b2-2f33-4bd2-8ca7-dae3b2b3ef25',
          'https://www.w3.org/WAI/WCAG21/Techniques/general/G150'
        ]
      };
  }
  
  // Format-specific general recommendations
  if (issue.documentType) {
    switch (issue.documentType) {
      case 'word':
        return {
          explanation: 'Microsoft Word documents need specific accessibility features to be usable by people with disabilities.',
          suggestedFix: 'Run the built-in Accessibility Checker and address all issues. Consider also providing an accessible HTML version.',
          codeExample: `In Microsoft Word:
1. Go to Review > Check Accessibility
2. Address all issues in the Accessibility pane
3. Save an accessible copy: File > Save As > More options > Save as type: Web Page, Filtered (*.htm, *.html)`,
          additionalResources: [
            'https://support.microsoft.com/en-us/office/create-accessible-pdfs-064625e0-56ea-4e16-ad71-3aa33bb4b7ed',
            'https://www.w3.org/WAI/WCAG21/Techniques/#document'
          ]
        };
        
      case 'excel':
        return {
          explanation: 'Excel spreadsheets present unique accessibility challenges due to their tabular nature and complex calculations.',
          suggestedFix: 'Define table structures properly, provide alternative text for charts, and include descriptive sheet names.',
          codeExample: `In Microsoft Excel:
1. Define table headers: Select data > Insert > Table > "My table has headers"
2. Name sheets descriptively: Double-click sheet tab
3. Add alt text to charts: Right-click chart > Edit Alt Text
4. Run the Accessibility Checker: Review > Check Accessibility`,
          additionalResources: [
            'https://support.microsoft.com/en-us/office/make-your-excel-documents-accessible-to-people-with-disabilities-6cc05fc5-1314-48b5-8eb3-683e49b3e593',
            'https://www.w3.org/WAI/WCAG21/Techniques/#document'
          ]
        };
        
      case 'powerpoint':
        return {
          explanation: 'PowerPoint presentations must be structured to allow screen reader users to access all content and follow the logical flow.',
          suggestedFix: 'Use slide layouts, set reading order, add alt text to images, and include slide titles.',
          codeExample: `In Microsoft PowerPoint:
1. Use built-in slide layouts: Home > Layout
2. Add slide titles: Click "Click to add title"
3. Add alt text to images: Right-click image > Edit Alt Text
4. Check reading order: Home > Arrange > Selection Pane
5. Run the Accessibility Checker: Review > Check Accessibility`,
          additionalResources: [
            'https://support.microsoft.com/en-us/office/make-your-powerpoint-presentations-accessible-to-people-with-disabilities-6f7772b2-2f33-4bd2-8ca7-dae3b2b3ef25',
            'https://www.w3.org/WAI/WCAG21/Techniques/#document'
          ]
        };
    }
  }
  
  return recommendation;
}

/**
 * Checks document links in an HTML container for accessibility issues
 * @param container HTML element containing the document
 * @returns List of document accessibility issues
 */
export function checkDocumentLinks(container: HTMLElement): AccessibilityIssue[] {
  const issues: AccessibilityIssue[] = [];
  
  // Define document extensions to look for
  const documentExtensions = [
    // Word documents
    '.docx', '.doc', '.odt', '.rtf',
    // Excel documents
    '.xlsx', '.xls', '.ods', '.csv',
    // PowerPoint documents
    '.pptx', '.ppt', '.odp',
    // Others
    '.txt'
  ];
  
  // Find all document links
  const documentLinks: HTMLAnchorElement[] = [];
  
  documentExtensions.forEach(ext => {
    const links = Array.from(container.querySelectorAll(`a[href$="${ext}"]`)) as HTMLAnchorElement[];
    documentLinks.push(...links);
  });
  
  if (documentLinks.length === 0) {
    return issues;
  }
  
  // Group links by document type
  const wordLinks = documentLinks.filter(link => 
    ['.docx', '.doc', '.odt', '.rtf'].some(ext => link.href.toLowerCase().endsWith(ext))
  );
  
  const excelLinks = documentLinks.filter(link => 
    ['.xlsx', '.xls', '.ods', '.csv'].some(ext => link.href.toLowerCase().endsWith(ext))
  );
  
  const powerPointLinks = documentLinks.filter(link => 
    ['.pptx', '.ppt', '.odp'].some(ext => link.href.toLowerCase().endsWith(ext))
  );
  
  const otherDocLinks = documentLinks.filter(link => 
    ![...wordLinks, ...excelLinks, ...powerPointLinks].includes(link)
  );
  
  // Add warning for each document type if links are found
  if (wordLinks.length > 0) {
    issues.push({
      id: 'word-links-found',
      impact: 'moderate',
      description: `Found ${wordLinks.length} Microsoft Word document link(s) on the page. Word documents should be accessible and/or alternative formats should be provided.`,
      nodes: wordLinks.map(link => link.outerHTML),
      wcagCriteria: ['1.1.1', '1.3.1'],
      documentType: 'word',
      fixSuggestion: 'Ensure Word documents are created with accessibility features enabled and consider providing HTML alternatives.'
    });
  }
  
  if (excelLinks.length > 0) {
    issues.push({
      id: 'excel-links-found',
      impact: 'moderate',
      description: `Found ${excelLinks.length} Excel spreadsheet link(s) on the page. Spreadsheets should be accessible with proper headers and structure.`,
      nodes: excelLinks.map(link => link.outerHTML),
      wcagCriteria: ['1.1.1', '1.3.1'],
      documentType: 'excel',
      fixSuggestion: 'Ensure Excel documents use proper table structures with headers and provide accessible alternatives when possible.'
    });
  }
  
  if (powerPointLinks.length > 0) {
    issues.push({
      id: 'powerpoint-links-found',
      impact: 'moderate',
      description: `Found ${powerPointLinks.length} PowerPoint presentation link(s) on the page. Presentations should be accessible with proper reading order and alt text.`,
      nodes: powerPointLinks.map(link => link.outerHTML),
      wcagCriteria: ['1.1.1', '1.3.1', '1.3.2'],
      documentType: 'powerpoint',
      fixSuggestion: 'Ensure PowerPoint presentations use built-in layouts, proper reading order, and alt text for images.'
    });
  }
  
  if (otherDocLinks.length > 0) {
    issues.push({
      id: 'document-links-found',
      impact: 'moderate',
      description: `Found ${otherDocLinks.length} other document link(s) on the page. Ensure these documents are accessible.`,
      nodes: otherDocLinks.map(link => link.outerHTML),
      wcagCriteria: ['1.1.1', '1.3.1'],
      documentType: 'other',
      fixSuggestion: 'Consider providing HTML alternatives for document formats that may present accessibility challenges.'
    });
  }
  
  return issues;
}