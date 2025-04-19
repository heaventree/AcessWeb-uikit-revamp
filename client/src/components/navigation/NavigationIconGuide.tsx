/**
 * Navigation Icon Guide
 * 
 * This component demonstrates the recommended icons for navigation items
 * across the AccessWebPro application. It serves as a reference for
 * maintaining consistent visual language throughout the UI.
 */

import React from 'react';
import {
  // Top-level navigation
  Home,
  BarChart3,
  Wrench, // Replacing Tool which isn't in the library
  Puzzle,
  FileText,
  CreditCard,
  HelpCircle,
  
  // Tools section
  CheckSquare,
  Palette,
  Image,
  BookOpen,
  
  // Integrations section
  ShoppingBag,
  Globe,
  Code,
  Building,
  
  // Resources section
  FileText as Documentation,
  BookOpen as Blog,
  Compass,
  LifeBuoy,
  
  // User dashboard
  LayoutDashboard,
  User,
  Shield,
  Settings,
  Globe as Websites,
  History,
  CreditCard as Subscription,
  Receipt,
  CreditCard as Payment,
  FileText as Reports,
  FileBarChart,
  Download,
  Users,
  UserCog,
  UserPlus,
  Key,
  Link,
  Webhook,
  
  // Admin section
  LayoutDashboard as AdminDashboard,
  Users as UserManagement,
  FileText as ContentManagement,
  CreditCard as SubscriptionManagement,
  CheckCircle,
  BarChart3 as Analytics,
  Settings as SystemSettings,
} from 'lucide-react';

export const NavigationIcons = {
  // Main Navigation
  main: {
    home: Home,
    tools: Wrench,
    integrations: Puzzle,
    resources: FileText,
    pricing: CreditCard,
    help: HelpCircle,
    dashboard: BarChart3,
  },
  
  // Tools Section
  tools: {
    checker: CheckSquare,
    colors: Palette,
    images: Image,
    standards: BookOpen,
  },
  
  // Integrations Section
  integrations: {
    shopify: ShoppingBag,
    wordpress: Globe,
    api: Code,
    enterprise: Building,
  },
  
  // Resources Section
  resources: {
    documentation: Documentation,
    blog: Blog,
    guides: Compass,
    help: LifeBuoy,
  },
  
  // User Dashboard 
  userDashboard: {
    overview: LayoutDashboard,
    profile: User,
    security: Shield,
    preferences: Settings,
    websites: Globe,
    scanHistory: History,
    subscription: Subscription,
    billing: Receipt,
    paymentMethods: CreditCard,
    reports: Reports,
    reportDetails: FileBarChart,
    export: Download,
    teamMembers: Users,
    roles: UserCog,
    invitations: UserPlus,
    apiTokens: Key,
    connectedServices: Link,
    webhooks: Webhook,
  },
  
  // Admin Dashboard
  adminDashboard: {
    overview: AdminDashboard,
    userManagement: UserManagement,
    contentManagement: ContentManagement,
    subscriptionManagement: SubscriptionManagement,
    verificationQueue: CheckCircle,
    analytics: Analytics,
    systemSettings: SystemSettings,
  },
};

/**
 * Icon Preview Component
 * Used for demonstration purposes
 */
export function IconPreview() {
  return (
    <div className="p-6 space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-4">Main Navigation Icons</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {Object.entries(NavigationIcons.main).map(([key, Icon]) => (
            <div key={key} className="flex flex-col items-center p-4 border rounded-md">
              <Icon className="h-6 w-6 mb-2" />
              <span className="text-sm text-center">{key}</span>
            </div>
          ))}
        </div>
      </div>
      
      <div>
        <h2 className="text-2xl font-bold mb-4">Tools Section Icons</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {Object.entries(NavigationIcons.tools).map(([key, Icon]) => (
            <div key={key} className="flex flex-col items-center p-4 border rounded-md">
              <Icon className="h-6 w-6 mb-2" />
              <span className="text-sm text-center">{key}</span>
            </div>
          ))}
        </div>
      </div>
      
      <div>
        <h2 className="text-2xl font-bold mb-4">Integrations Section Icons</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {Object.entries(NavigationIcons.integrations).map(([key, Icon]) => (
            <div key={key} className="flex flex-col items-center p-4 border rounded-md">
              <Icon className="h-6 w-6 mb-2" />
              <span className="text-sm text-center">{key}</span>
            </div>
          ))}
        </div>
      </div>
      
      <div>
        <h2 className="text-2xl font-bold mb-4">Resources Section Icons</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {Object.entries(NavigationIcons.resources).map(([key, Icon]) => (
            <div key={key} className="flex flex-col items-center p-4 border rounded-md">
              <Icon className="h-6 w-6 mb-2" />
              <span className="text-sm text-center">{key}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default NavigationIcons;