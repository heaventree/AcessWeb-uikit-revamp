/**
 * WCAG Compliance Platform Roadmap
 * 
 * This file maintains the complete feature roadmap for the WCAG compliance platform,
 * organized by priority and implementation status.
 */

export type FeatureStatus = 'planned' | 'in-progress' | 'completed' | 'deferred';

export type RoadmapFeatureSource = 'feedback' | 'manual' | 'system';

export interface RoadmapFeature {
  id: string;
  title: string;
  description: string;
  status: FeatureStatus;
  priority: number; // 1 (highest) to 5 (lowest)
  category: 'core' | 'ui' | 'reporting' | 'integration' | 'analytics';
  source?: RoadmapFeatureSource;
  dependencies?: string[]; // IDs of features this depends on
  estimatedCompletionDate?: string;
  completedDate?: string;
}

// Function to add a new roadmap feature
export function addRoadmapFeature(feature: RoadmapFeature) {
  roadmapFeatures.push(feature);
  
  // Dispatch event
  const event = new CustomEvent('roadmapFeaturesUpdated', { detail: roadmapFeatures });
  window.dispatchEvent(event);
  
  return feature.id;
}

// Function to add user feedback as a roadmap feature
export function addFeedbackAsRoadmapFeature(
  title: string,
  description: string,
  category: RoadmapFeature['category'] = 'ui',
  priority: number = 3
) {
  const newFeature: RoadmapFeature = {
    id: `feature-feedback-${Date.now()}`,
    title,
    description,
    status: 'planned',
    priority,
    category,
    source: 'feedback'
  };
  
  addRoadmapFeature(newFeature);
  return newFeature.id;
}

export const roadmapFeatures: RoadmapFeature[] = [
  // Core functionality - Already implemented
  {
    id: 'url-scanner',
    title: 'URL Scanner',
    description: 'Scan a URL for WCAG compliance issues and display results',
    status: 'completed',
    priority: 1,
    category: 'core',
    completedDate: '2025-03-24'
  },
  {
    id: 'accessible-ui',
    title: 'Accessible UI Components',
    description: 'Build accessible UI components using shadcn and tailwind',
    status: 'completed',
    priority: 1,
    category: 'ui',
    completedDate: '2025-03-24'
  },
  
  // Next priority features - User Authentication System
  {
    id: 'user-authentication',
    title: 'User Authentication System',
    description: 'Complete user authentication system with signup, login, and account management',
    status: 'planned',
    priority: 1,
    category: 'core',
    dependencies: []
  },
  {
    id: 'email-verification',
    title: 'Email Verification System',
    description: 'Email verification flow for new user signups with secure token handling',
    status: 'planned',
    priority: 1,
    category: 'core',
    dependencies: ['user-authentication']
  },
  {
    id: 'password-recovery',
    title: 'Password Recovery System',
    description: 'Secure password reset and recovery workflow with email verification',
    status: 'planned',
    priority: 1,
    category: 'core',
    dependencies: ['user-authentication', 'email-verification']
  },
  {
    id: 'oauth-integration',
    title: 'OAuth Integration',
    description: 'Support for third-party authentication via OAuth (Google, GitHub, etc.)',
    status: 'planned',
    priority: 2,
    category: 'integration',
    dependencies: ['user-authentication']
  },
  {
    id: 'external-api-security',
    title: 'External Integration Security',
    description: 'Secure API communication for WordPress, Shopify, and custom site integrations',
    status: 'planned',
    priority: 2,
    category: 'integration',
    dependencies: ['user-authentication', 'api-integrations']
  },
  {
    id: 'stripe-payments',
    title: 'Stripe Payment Processing',
    description: 'Integration with Stripe for secure payment processing and subscription management',
    status: 'planned',
    priority: 1,
    category: 'core',
    dependencies: ['user-authentication']
  },
  {
    id: 'subscription-management',
    title: 'Subscription Management System',
    description: 'User interface for managing subscription plans, billing, and payment methods',
    status: 'planned',
    priority: 2,
    category: 'ui',
    dependencies: ['stripe-payments', 'user-dashboard']
  },
  
  // Other priority features
  {
    id: 'compliance-badges',
    title: 'WCAG Compliance Badges',
    description: 'Generate embeddable compliance badges for sites that pass all critical tests',
    status: 'in-progress',
    priority: 2,
    category: 'reporting',
    dependencies: ['url-scanner']
  },
  {
    id: 'user-dashboard',
    title: 'User Dashboard',
    description: 'Dashboard displaying scan history, issues, and analytics for users',
    status: 'planned',
    priority: 2,
    category: 'ui',
    dependencies: ['url-scanner']
  },
  {
    id: 'admin-dashboard',
    title: 'Admin Dashboard',
    description: 'Administrative dashboard for managing users, subscriptions, and system settings',
    status: 'planned',
    priority: 2,
    category: 'ui',
    dependencies: ['user-dashboard']
  },
  {
    id: 'ai-fixes',
    title: 'AI-Generated CSS Fixes',
    description: 'Use AI to generate CSS fixes for detected accessibility issues',
    status: 'planned',
    priority: 2,
    category: 'core',
    dependencies: ['url-scanner']
  },
  {
    id: 'api-integrations',
    title: 'API Integrations',
    description: 'Implement API connections to push changes directly to client sites',
    status: 'planned',
    priority: 2,
    category: 'integration',
    dependencies: ['ai-fixes']
  },
  {
    id: 'multi-region',
    title: 'Multi-Region Compliance',
    description: 'Support for multiple geographic accessibility standards (EU, UK, USA, Canada, Japan, Australia)',
    status: 'planned',
    priority: 2,
    category: 'core',
    dependencies: ['url-scanner']
  },
  
  // Features from the task list
  {
    id: 'micro-animations',
    title: 'Micro-animations for Highlighting Improvements',
    description: 'Add subtle animations to highlight accessibility improvements and fixes',
    status: 'planned',
    priority: 3,
    category: 'ui',
    dependencies: ['ai-fixes']
  },
  {
    id: 'color-blindness-sim',
    title: 'Real-time Color Blindness Simulation Preview',
    description: 'Provide real-time previews of how sites appear to users with different types of color blindness',
    status: 'planned',
    priority: 3,
    category: 'ui',
    dependencies: ['url-scanner']
  },
  {
    id: 'emoji-rating',
    title: 'Emoji-based Accessibility Difficulty Rating System',
    description: 'Implement an intuitive emoji-based rating system for accessibility difficulty',
    status: 'planned',
    priority: 3,
    category: 'ui',
    dependencies: ['url-scanner']
  },
  {
    id: 'pdf-generator',
    title: 'One-click Accessibility Report PDF Generator',
    description: 'Generate comprehensive PDF reports of accessibility scans with a single click',
    status: 'planned',
    priority: 3,
    category: 'reporting',
    dependencies: ['url-scanner']
  },
  {
    id: 'learning-playground',
    title: 'Interactive Accessibility Learning Playground',
    description: 'Create an interactive learning environment with gamified challenges for accessibility education',
    status: 'planned',
    priority: 4,
    category: 'ui',
    dependencies: ['url-scanner']
  },
  {
    id: 'bulk-scanning',
    title: 'Bulk Site Scanning for Enterprise Clients',
    description: 'Enable enterprise clients to scan multiple sites or pages in a single operation',
    status: 'planned',
    priority: 3,
    category: 'core',
    dependencies: ['url-scanner']
  },
  {
    id: 'advanced-visualization',
    title: 'Advanced Visualization of Accessibility Issues',
    description: 'Develop sophisticated visualizations to better understand and communicate accessibility issues',
    status: 'planned',
    priority: 4,
    category: 'ui',
    dependencies: ['url-scanner']
  },
  {
    id: 'wordpress-api-integration',
    title: 'WordPress REST API Integration',
    description: 'Implement real REST API communication with WordPress sites for scanning and reporting',
    status: 'completed',
    priority: 2,
    category: 'integration',
    completedDate: '2024-04-12'
  },
  {
    id: 'wordpress-api-caching',
    title: 'WordPress API Response Caching',
    description: 'Implement intelligent tiered caching for WordPress API to optimize performance',
    status: 'completed',
    priority: 2,
    category: 'integration',
    dependencies: ['wordpress-api-integration'],
    completedDate: '2024-04-12'
  },
  {
    id: 'wordpress-plugin-detection',
    title: 'WordPress Plugin Detection',
    description: 'Add functionality to detect and verify AccessWeb plugin on WordPress sites',
    status: 'completed',
    priority: 2,
    category: 'integration',
    dependencies: ['wordpress-api-integration'],
    completedDate: '2024-04-12'
  },
  {
    id: 'cms-plugins',
    title: 'WordPress and Shopify Plugins',
    description: 'Create plugins for popular CMS platforms to integrate accessibility scanning and fixes',
    status: 'in-progress',
    priority: 3,
    category: 'integration',
    dependencies: ['ai-fixes', 'api-integrations']
  },
  {
    id: 'white-label',
    title: 'White-label Reporting Options',
    description: 'Allow agencies and enterprises to white-label accessibility reports',
    status: 'planned',
    priority: 4,
    category: 'reporting',
    dependencies: ['wcag-compliance-export']
  },
  {
    id: 'team-collab',
    title: 'Team Collaboration Features',
    description: 'Enable teams to collaborate on fixing accessibility issues with comments and assignments',
    status: 'planned',
    priority: 4,
    category: 'ui',
    dependencies: ['user-dashboard']
  },
  {
    id: 'scheduled-scanning',
    title: 'Scheduled Automated Scanning',
    description: 'Set up regular automated scans to monitor accessibility compliance over time',
    status: 'planned',
    priority: 3,
    category: 'core',
    dependencies: ['url-scanner']
  },
  {
    id: 'badge-customization',
    title: 'Advanced Customization of WCAG Badges',
    description: 'Allow users to customize the appearance and content of compliance badges',
    status: 'planned',
    priority: 4,
    category: 'ui',
    dependencies: ['compliance-badges']
  },
  {
    id: 'user-analytics',
    title: 'Enhanced User Analytics Dashboard',
    description: 'Provide detailed analytics on accessibility improvements and user behavior',
    status: 'planned',
    priority: 4,
    category: 'analytics',
    dependencies: ['user-dashboard']
  },
  {
    id: 'postgres-integration',
    title: 'PostgreSQL Database Integration',
    description: 'Enhance database integration for better performance and data management',
    status: 'planned',
    priority: 3,
    category: 'core',
    dependencies: []
  },
  
  // Add section identifier features we've implemented
  {
    id: 'section-identifiers',
    title: 'Section Identifiers System',
    description: 'Implement visual identifiers for page sections to help with accessibility testing and debugging',
    status: 'completed',
    priority: 2,
    category: 'ui',
    completedDate: '2025-04-01'
  },
  {
    id: 'section-id-persistence',
    title: 'Section Identifiers Persistence',
    description: 'Ensure section identifiers maintain consistent IDs across page navigation',
    status: 'completed',
    priority: 2,
    category: 'ui',
    dependencies: ['section-identifiers'],
    completedDate: '2025-04-01'
  },
  {
    id: 'wcag-color-palette',
    title: 'WCAG 2.2 Color Palette Generator',
    description: 'Updated color palette generator supporting WCAG 2.2 standards with enhanced visual hierarchy',
    status: 'completed',
    priority: 2,
    category: 'ui',
    completedDate: '2025-04-01'
  },
  {
    id: 'media-accessibility',
    title: 'Media Accessibility Testing',
    description: 'Implement comprehensive testing for audio, video, and embedded media accessibility compliance',
    status: 'completed',
    priority: 2,
    category: 'core',
    completedDate: '2025-04-11'
  },
  {
    id: 'wcag-compliance-export',
    title: 'WCAG Compliance Export',
    description: 'Generate comprehensive export of accessibility scans as a PRO feature',
    status: 'completed',
    priority: 3,
    category: 'reporting',
    completedDate: '2025-04-11'
  }
];

/**
 * Get features by status
 */
export function getFeaturesByStatus(status: FeatureStatus): RoadmapFeature[] {
  return roadmapFeatures.filter(feature => feature.status === status)
    .sort((a, b) => a.priority - b.priority);
}

/**
 * Get features by category
 */
export function getFeaturesByCategory(category: RoadmapFeature['category']): RoadmapFeature[] {
  return roadmapFeatures.filter(feature => feature.category === category)
    .sort((a, b) => a.priority - b.priority);
}

/**
 * Get next features to implement based on priority, dependencies, and status
 */
export function getNextFeatures(count: number = 3): RoadmapFeature[] {
  // Get all planned features
  const plannedFeatures = roadmapFeatures.filter(f => f.status === 'planned');
  
  // Check which ones have all dependencies satisfied
  const completedFeatureIds = roadmapFeatures
    .filter(f => f.status === 'completed')
    .map(f => f.id);
  
  const implementableFeatures = plannedFeatures.filter(feature => {
    if (!feature.dependencies || feature.dependencies.length === 0) return true;
    return feature.dependencies.every(depId => completedFeatureIds.includes(depId));
  });
  
  // Sort by priority and return the requested number
  return implementableFeatures
    .sort((a, b) => a.priority - b.priority)
    .slice(0, count);
}