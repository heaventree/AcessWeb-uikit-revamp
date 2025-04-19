/**
 * Debug List Data
 * 
 * This file contains data for the debug list view in the admin dashboard.
 * Each entry represents a current development issue, bug, or feature being
 * debugged along with its current status and priority.
 */

export type DebugItemCategory = 
  | 'ui' 
  | 'core' 
  | 'api' 
  | 'integration' 
  | 'performance' 
  | 'security' 
  | 'monitoring'
  | 'accessibility'
  | 'data'
  | 'subscription'
  | 'alerts'
  | 'policies';

export type DebugItemStatus = 
  | 'identified' 
  | 'investigating' 
  | 'in-progress' 
  | 'testing' 
  | 'resolved' 
  | 'deferred';

export type DebugItemPriority = 
  | 'critical'  // Must fix immediately, blocking deployment
  | 'high'      // Important to fix soon, causes significant user impact
  | 'medium'    // Should fix in current sprint
  | 'low'       // Fix when possible, minor impact
  | 'very-low'; // Nice to have, minimal impact

export type DebugItemSource = 'feedback' | 'manual' | 'system';

export interface DebugItem {
  id: string;
  title: string;
  description: string;
  category: DebugItemCategory;
  status: DebugItemStatus;
  priority: DebugItemPriority;
  dateIdentified: string;
  source?: DebugItemSource;
  assignedTo?: string;
  relatedIssues?: string[];
  todoItems?: string[];
  notes?: string;
}

// This function will be used by the feedback system to add new items
export function addDebugItem(item: DebugItem) {
  debugItems.push(item);
  
  // Dispatch an event to notify other components
  const event = new CustomEvent('debugItemsUpdated', { detail: debugItems });
  window.dispatchEvent(event);
  
  return item.id;
}

// Function to add user feedback as a debug item
export function addFeedbackAsDebugItem(
  title: string, 
  description: string, 
  category: DebugItemCategory = 'ui',
  priority: DebugItemPriority = 'medium'
) {
  const newItem: DebugItem = {
    id: `debug-feedback-${Date.now()}`,
    title,
    description,
    category,
    status: 'identified',
    priority,
    dateIdentified: new Date().toISOString().split('T')[0],
    source: 'feedback',
    todoItems: ['Review feedback', 'Determine appropriate action', 'Implement solution'],
    notes: 'Added via user feedback system'
  };
  
  addDebugItem(newItem);
  return newItem.id;
}

export const debugItems: DebugItem[] = [
  {
    id: 'debug-item-documentation-organization',
    title: 'Documentation organization improvements needed',
    description: 'Current documentation structure has overlapping sections (/docs, /help/documentation). Need to consolidate all documentation into a clear, logical structure.',
    category: 'ui',
    status: 'identified',
    priority: 'medium',
    dateIdentified: new Date().toISOString().split('T')[0],
    source: 'manual',
    todoItems: [
      'Fix routes with overlapping documentation content',
      'Create consistent navigation between documentation sections',
      'Ensure proper organization between app docs and WCAG resources',
      'Improve URL structure for better SEO and sharing'
    ],
    notes: 'Initial reorganization done but needs more work to fully resolve the confusion between different documentation sections'
  },
  {
    id: 'debug-item-cms-expansion',
    title: 'CMS functionality expansion',
    description: 'Current CMS functionality is limited. Need to expand it to support management of all content including articles, blogs, technical documentation, and UI card content.',
    category: 'core',
    status: 'identified',
    priority: 'high',
    dateIdentified: new Date().toISOString().split('T')[0],
    source: 'manual',
    todoItems: [
      'Design expanded CMS data structure',
      'Create UI for managing different content types',
      'Implement content versioning and publishing workflow',
      'Add rich text editor with media support',
      'Build tagging and categorization system'
    ],
    notes: 'This is a major feature that will greatly improve content management capabilities'
  },
  {
    id: 'debug-item-overlap-ui',
    title: 'Floating tools overlap issue',
    description: 'The floating tools (feedback button, demo mode toggle, etc.) are overlapping each other on the screen, making it difficult to use them.',
    category: 'ui',
    status: 'identified',
    priority: 'medium',
    dateIdentified: new Date().toISOString().split('T')[0],
    source: 'manual',
    todoItems: [
      'Fix positioning of floating tools to prevent overlap',
      'Implement better coordination between floating tools',
      'Improve responsiveness of floating tools on different screen sizes'
    ],
    notes: 'This issue impacts the usability of the feedback and demo mode features. Need to redesign the positioning of these components to ensure they don\'t overlap.'
  },
  // Dark Mode Implementation Issues
  {
    id: 'debug-001',
    title: 'Dark Mode Implementation',
    description: 'Current implementation causing several UI inconsistencies and contrast issues in specific components',
    category: 'ui',
    status: 'in-progress',
    priority: 'high',
    dateIdentified: '2023-03-10',
    assignedTo: 'Sarah Chen',
    todoItems: [
      'Fix contrast issues in form elements',
      'Update component library with proper dark variants',
      'Address text readability in tooltips and popovers',
      'Fix color inconsistencies in charts and graphs',
      'Ensure proper transitions between modes',
      'Add dark mode toggle persistence'
    ],
    notes: 'Initial implementation is causing accessibility issues especially with contrast ratios. Need to ensure all components adhere to WCAG AA standards in both modes.'
  },
  
  // Admin Dashboard Stats
  {
    id: 'debug-002',
    title: 'Admin Dashboard Stats',
    description: 'Information widgets not updating correctly with real-time data',
    category: 'data',
    status: 'investigating',
    priority: 'medium',
    dateIdentified: '2023-03-15',
    assignedTo: 'Alex Rodriguez',
    todoItems: [
      'Implement proper data fetching',
      'Add real-time updates',
      'Create data refresh mechanism',
      'Add loading states',
      'Implement error handling',
      'Add data caching'
    ],
    notes: 'The dashboard currently displays static data and lacks proper refresh mechanisms. Need to implement a proper data fetching strategy with caching and error handling.'
  },
  
  // Alert System Implementation
  {
    id: 'debug-003',
    title: 'Alert System Implementation',
    description: 'Need to implement comprehensive alert system for the platform',
    category: 'alerts',
    status: 'identified',
    priority: 'high',
    dateIdentified: '2023-03-18',
    todoItems: [
      'Create alerts table',
      'Implement alert generation',
      'Add notification system',
      'Create alert management UI',
      'Set up email notifications',
      'Add webhook support',
      'Implement alert rules',
      'Create alert dashboard',
      'Add alert history',
      'Test alert delivery',
      'Document alert system'
    ]
  },
  
  // Subscription System
  {
    id: 'debug-004',
    title: 'Subscription System Implementation',
    description: 'Need to create and implement a proper subscription and billing system',
    category: 'subscription',
    status: 'in-progress',
    priority: 'critical',
    dateIdentified: '2023-03-05',
    assignedTo: 'Maya Johnson',
    todoItems: [
      'Create subscription tables and RPC functions',
      'Implement proper error handling',
      'Add subscription status checks',
      'Set up usage tracking',
      'Implement alerts system',
      'Add subscription analytics',
      'Create subscription dashboard',
      'Set up billing integration',
      'Add usage monitoring',
      'Implement notification system',
      'Create subscription reports',
      'Add subscription management UI',
      'Test subscription flows',
      'Document subscription system'
    ]
  },
  
  // Policy Management System
  {
    id: 'debug-005',
    title: 'Policy Management System',
    description: 'Current implementation causing policy conflicts and migration issues',
    category: 'policies',
    status: 'investigating',
    priority: 'high',
    dateIdentified: '2023-03-22',
    assignedTo: 'Daniel Park',
    todoItems: [
      'Drop existing policies before creating new ones',
      'Use unique policy names to avoid conflicts',
      'Add policy existence checks in migrations',
      'Implement proper policy versioning',
      'Add policy cleanup scripts',
      'Suppress policy conflict error reporting',
      'Add policy conflict detection',
      'Implement policy reconciliation',
      'Add policy migration rollback',
      'Create policy management dashboard'
    ]
  },
  
  // Monitoring System
  {
    id: 'debug-006',
    title: 'Monitoring System Implementation',
    description: 'Need to implement comprehensive monitoring system with proper notifications',
    category: 'monitoring',
    status: 'identified',
    priority: 'medium',
    dateIdentified: '2023-03-25',
    todoItems: [
      'Add daily scan option for premium subscribers',
      'Implement rate limiting for API endpoints',
      'Add webhook notifications for scan results',
      'Implement email notifications',
      'Add custom scan schedules',
      'Add scan history and trends',
      'Implement real-time monitoring dashboard'
    ]
  },
  
  // Performance Optimization
  {
    id: 'debug-007',
    title: 'Performance Optimization',
    description: 'Application experiences slow load times and performance issues with large datasets',
    category: 'performance',
    status: 'investigating',
    priority: 'high',
    dateIdentified: '2023-03-28',
    assignedTo: 'Jason Lee',
    todoItems: [
      'Implement proper code splitting',
      'Optimize bundle size',
      'Add virtualization for large lists',
      'Implement memoization for expensive calculations',
      'Add proper loading states',
      'Implement lazy loading for images and components',
      'Add proper caching strategy',
      'Optimize API response size'
    ]
  },
  
  // Section Identifiers Improvements
  {
    id: 'debug-008',
    title: 'Section Identifiers Improvements',
    description: 'Section identifiers need better persistence and visual clarity across the application',
    category: 'accessibility',
    status: 'in-progress',
    priority: 'medium',
    dateIdentified: '2023-03-20',
    assignedTo: 'Emma Wilson',
    todoItems: [
      'Improve visual styling for better contrast',
      'Enhance persistence mechanism between page navigations',
      'Implement consistent ID generation algorithm',
      'Add proper tooltip information',
      'Improve markup detection for sections',
      'Add toggle functionality in admin UI',
      'Document usage for development purposes'
    ],
    notes: 'Current implementation has issues with consistency between page navigations. Need to implement a more robust persistence mechanism.'
  },
  
  // API Integration Issues
  {
    id: 'debug-009',
    title: 'API Integration Issues',
    description: 'Multiple issues with API integrations, particularly with WordPress and Shopify',
    category: 'api',
    status: 'investigating',
    priority: 'high',
    dateIdentified: '2023-03-12',
    assignedTo: 'Carlos Rodriguez',
    todoItems: [
      'Fix authentication issues with WordPress API',
      'Implement proper error handling for API failures',
      'Add retry mechanism for failed API calls',
      'Improve documentation for API integrations',
      'Add proper logging for API calls',
      'Implement rate limiting protection'
    ]
  },
  
  // Accessibility Compliance Issues
  {
    id: 'debug-010',
    title: 'Accessibility Compliance Issues',
    description: 'Several components not meeting WCAG 2.2 standards, particularly with keyboard navigation',
    category: 'accessibility',
    status: 'in-progress',
    priority: 'critical',
    dateIdentified: '2023-03-08',
    assignedTo: 'Aisha Khan',
    todoItems: [
      'Fix keyboard navigation in dropdown menus',
      'Add proper focus management',
      'Improve ARIA attributes across components',
      'Fix color contrast issues in form elements',
      'Add proper screen reader announcements for dynamic content',
      'Implement skip links for navigation',
      'Fix heading hierarchy issues'
    ],
    notes: 'As an accessibility platform, we need to ensure our own application is fully compliant with WCAG 2.2 standards. Current audit revealed several issues that need immediate attention.'
  }
];

/**
 * Get debug items by status
 */
export function getDebugItemsByStatus(status: DebugItemStatus): DebugItem[] {
  return debugItems.filter(item => item.status === status);
}

/**
 * Get debug items by category
 */
export function getDebugItemsByCategory(category: DebugItemCategory): DebugItem[] {
  return debugItems.filter(item => item.category === category);
}

/**
 * Get debug items by priority
 */
export function getDebugItemsByPriority(priority: DebugItemPriority): DebugItem[] {
  return debugItems.filter(item => item.priority === priority);
}

/**
 * Get high priority debug items
 */
export function getHighPriorityDebugItems(): DebugItem[] {
  return debugItems.filter(item => item.priority === 'critical' || item.priority === 'high');
}