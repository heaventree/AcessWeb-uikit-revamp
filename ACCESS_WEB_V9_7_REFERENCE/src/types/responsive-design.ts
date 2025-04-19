/**
 * Type definitions for responsive design testing
 */

export interface Device {
  id: string;
  name: string;
  type: 'phone' | 'tablet' | 'desktop' | 'laptop';
  screenSizes: ScreenSize[];
}

export interface ScreenSize {
  width: number;
  height: number;
  name: string;
}

export interface TouchTargetIssue {
  element: string;
  width: number;
  height: number;
  recommendedSize: number;
  wcagCriteria: string[];
}

export interface ResponsiveDesignIssue {
  type: 'viewport' | 'touch-target' | 'text-size' | 'overflow' | 'media-query';
  title: string;
  description: string;
  impact: 'critical' | 'serious' | 'moderate' | 'minor';
  element?: string;
  currentValue?: string;
  recommendedValue?: string;
  wcagCriteria: string[];
  suggestedFix?: string;
}

// Common device sizes for testing
export const DEFAULT_DEVICES: Device[] = [
  {
    id: 'mobile-small',
    name: 'Small Mobile (iPhone SE)',
    type: 'phone',
    screenSizes: [
      { width: 375, height: 667, name: 'portrait' },
      { width: 667, height: 375, name: 'landscape' }
    ]
  },
  {
    id: 'mobile-medium',
    name: 'Medium Mobile (iPhone 12/13)',
    type: 'phone',
    screenSizes: [
      { width: 390, height: 844, name: 'portrait' },
      { width: 844, height: 390, name: 'landscape' }
    ]
  },
  {
    id: 'tablet',
    name: 'Tablet (iPad)',
    type: 'tablet',
    screenSizes: [
      { width: 768, height: 1024, name: 'portrait' },
      { width: 1024, height: 768, name: 'landscape' }
    ]
  },
  {
    id: 'laptop',
    name: 'Laptop',
    type: 'laptop',
    screenSizes: [
      { width: 1366, height: 768, name: 'standard' }
    ]
  },
  {
    id: 'desktop',
    name: 'Desktop',
    type: 'desktop',
    screenSizes: [
      { width: 1920, height: 1080, name: 'standard' }
    ]
  }
];