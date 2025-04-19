import type { TestResult, LegislationMapping } from '../types';

// Mapping of WCAG criteria to various legislation requirements
const legislationMappings: Record<string, LegislationMapping> = {
  'color-contrast': {
    criteria: ['1.4.3'],
    standards: {
      ada: ['36 CFR 1194.31(b)'],
      section508: ['502.3.1'],
      aoda: ['WCAG 2.0 Level AA'],
      en301549: ['9.1.4.3'],
      eea: ['EN 301 549 V3.2.1']
    }
  },
  'image-alt': {
    criteria: ['1.1.1'],
    standards: {
      ada: ['36 CFR 1194.22(a)'],
      section508: ['502.2'],
      aoda: ['WCAG 2.0 Level A'],
      en301549: ['9.1.1.1'],
      eea: ['EN 301 549 V3.2.1']
    }
  },
  'html-has-lang': {
    criteria: ['3.1.1'],
    standards: {
      ada: ['36 CFR 1194.22(m)'],
      section508: ['504.2'],
      aoda: ['WCAG 2.0 Level A'],
      en301549: ['9.3.1.1'],
      eea: ['EN 301 549 V3.2.1']
    }
  },
  // Japanese JIS Mappings
  'JIS-1.1': {
    criteria: ['1.1.1'],
    standards: {
      jis: ['JIS X 8341-3:2016 1.1.1'],
      wcag: ['WCAG 2.1 1.1.1']
    }
  },

  // Australian DTA Mappings  
  'AUS-1.1': {
    criteria: ['1.1.1', '1.2.1', '1.3.1'],
    standards: {
      dta: ['DTA AA 1.1'],
      wcag: ['WCAG 2.1 Level AA']
    }
  },

  // UK GDS Mappings
  'UK-1.1': {
    criteria: ['1.1.1', '1.2.1', '1.3.1'],
    standards: {
      gds: ['GDS Accessibility 1.1'],
      wcag: ['WCAG 2.1 Level AA'] 
    }
  },

  // EU EN 301 549 Mappings
  'EU-1.1': {
    criteria: ['1.1.1', '1.2.1', '1.3.1'],
    standards: {
      en301549: ['EN 301 549 V3.2.1'],
      wcag: ['WCAG 2.1 Level AA']
    }
  },

  // US Section 508 Mappings
  'US-508-1.1': {
    criteria: ['1.1.1', '1.2.1', '1.3.1'],
    standards: {
      section508: ['36 CFR Part 1194'],
      wcag: ['WCAG 2.1 Level AA']
    }
  },

  // Canadian AODA Mappings
  'CA-1.1': {
    criteria: ['1.1.1', '1.2.1', '1.3.1'],
    standards: {
      aoda: ['AODA IASR'],
      wcag: ['WCAG 2.1 Level AA']
    }
  }
};

// Check if all required criteria for a legislation are met
function checkLegislationCompliance(results: TestResult): Record<string, boolean> {
  const violations = new Set(results.issues.map(issue => issue.wcagCriteria).flat());
  
  // Helper function to check if all required criteria for a standard are met
  const meetsStandard = (standard: string): boolean => {
    const requiredCriteria = new Set();
    
    // Collect all required criteria for this standard
    Object.values(legislationMappings).forEach(mapping => {
      if (mapping.standards[standard]) {
        mapping.criteria.forEach(criterion => requiredCriteria.add(criterion));
      }
    });
    
    // Check if any required criteria are violated
    return ![...requiredCriteria].some(criterion => violations.has(criterion));
  };
  
  return {
    ada: meetsStandard('ada'),
    section508: meetsStandard('section508'),
    aoda: meetsStandard('aoda'),
    en301549: meetsStandard('en301549'),
    eea: meetsStandard('eea'),
    jis: meetsStandard('jis'),
    dta: meetsStandard('dta'),
    gds: meetsStandard('gds')
  };
}

// Add legislation references to issues
export function addLegislationRefs(results: TestResult): TestResult {
  const updatedResults = { ...results };
  
  updatedResults.issues = results.issues.map(issue => {
    const refs = new Set<string>();
    
    issue.wcagCriteria.forEach(criterion => {
      const mapping = legislationMappings[criterion];
      if (mapping) {
        Object.entries(mapping.standards).forEach(([standard, requirements]) => {
          requirements.forEach(req => refs.add(`${standard.toUpperCase()}: ${req}`));
        });
      }
    });
    
    return {
      ...issue,
      legislationRefs: Array.from(refs)
    };
  });
  
  updatedResults.legislationCompliance = checkLegislationCompliance(results);
  
  return updatedResults;
}