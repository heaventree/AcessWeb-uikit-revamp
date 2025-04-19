/**
 * Navigation Icon Guide
 * 
 * This component demonstrates the recommended icons for navigation items
 * across the AccessWebPro application. It serves as a reference for
 * maintaining consistent visual language throughout the UI.
 */

import React from 'react';
import {
  // All icons used in the app
  Home,
  BarChart3,
  Wrench,
  Puzzle,
  FileText,
  CreditCard,
  HelpCircle,
  Palette,
  Eye,
  Image,
  ShoppingCart,
  Globe,
  Activity,
  Shield,
  Building,
  Zap,
  LayoutDashboard,
  User,
  Settings,
  History,
  Receipt,
  Download,
  Users,
  UserCog,
  UserPlus,
  Key,
  Link,
  Webhook,
  CheckCircle,
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
  
  // Tools Section - matching the screenshot
  tools: {
    wcagChecker: HelpCircle,
    colorPalette: Palette,
    colorSimulator: Eye,
    wcagStandards: FileText,
    imageAltScanner: Image,
  },
  
  // Integrations Section - matching the screenshot
  integrations: {
    shopify: ShoppingCart,
    wordpress: Globe,
    api: Activity,
    compliance: Shield,
    enterprise: Building,
  },
  
  // Resources Section - matching the screenshot
  resources: {
    documentation: FileText,
    helpCenter: HelpCircle,
    nonDestructiveFixes: Zap,
    blog: FileText,
  },
  
  // User Dashboard 
  userDashboard: {
    overview: LayoutDashboard,
    profile: User,
    security: Shield,
    preferences: Settings,
    websites: Globe,
    scanHistory: History,
    subscription: CreditCard,
    billing: Receipt,
    paymentMethods: CreditCard,
    reports: FileText,
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
    overview: LayoutDashboard,
    userManagement: Users,
    contentManagement: FileText,
    subscriptionManagement: CreditCard,
    verificationQueue: CheckCircle,
    analytics: BarChart3,
    systemSettings: Settings,
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
              {/* Using WCAG-compliant font size (16px) */}
              <span className="text-base text-center">{key}</span>
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
              <span className="text-base text-center">{key}</span>
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
              <span className="text-base text-center">{key}</span>
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
              <span className="text-base text-center">{key}</span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">User Dashboard Icons</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {Object.entries(NavigationIcons.userDashboard).map(([key, Icon]) => (
            <div key={key} className="flex flex-col items-center p-4 border rounded-md">
              <Icon className="h-6 w-6 mb-2" />
              <span className="text-base text-center">{key}</span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">Admin Dashboard Icons</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {Object.entries(NavigationIcons.adminDashboard).map(([key, Icon]) => (
            <div key={key} className="flex flex-col items-center p-4 border rounded-md">
              <Icon className="h-6 w-6 mb-2" />
              <span className="text-base text-center">{key}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default NavigationIcons;