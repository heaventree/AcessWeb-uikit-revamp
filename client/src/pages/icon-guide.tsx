import React from 'react';
import { IconPreview } from '../components/navigation/NavigationIconGuide';
import NavigationIcons from '../components/navigation/NavigationIconGuide';
import { MenuStyleShowcase } from '../components/navigation/MenuItemExample';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const IconGuidePage = () => {
  // Example menu sections based on our navigation structure
  const toolsMenuItems = [
    { 
      icon: NavigationIcons.tools.wcagChecker, 
      label: 'WCAG Checker',
      description: 'Test your website against WCAG standards'
    },
    { 
      icon: NavigationIcons.tools.colorPalette, 
      label: 'Color Palette',
      description: 'Create accessible color combinations'
    },
    { 
      icon: NavigationIcons.tools.colorSimulator, 
      label: 'Color Accessibility Simulator',
      description: 'Test colors for accessibility and simulate color blindness'
    },
    { 
      icon: NavigationIcons.tools.wcagStandards, 
      label: 'WCAG Standards',
      description: 'Browse WCAG 2.1 standards and requirements'
    },
    { 
      icon: NavigationIcons.tools.imageAltScanner, 
      label: 'Image Alt Scanner',
      description: 'Find and fix image accessibility issues'
    }
  ];

  const integrationsMenuItems = [
    { 
      icon: NavigationIcons.integrations.shopify, 
      label: 'Shopify',
      description: 'Shopify theme accessibility'
    },
    { 
      icon: NavigationIcons.integrations.wordpress, 
      label: 'WordPress',
      description: 'WordPress site accessibility'
    },
    { 
      icon: NavigationIcons.integrations.api, 
      label: 'Custom API',
      description: 'API integration & webhooks'
    },
    { 
      icon: NavigationIcons.integrations.compliance, 
      label: 'Compliance',
      description: 'Compliance monitoring & reporting'
    },
    { 
      icon: NavigationIcons.integrations.enterprise, 
      label: 'Enterprise',
      description: 'Enterprise-grade solutions'
    }
  ];

  const resourcesMenuItems = [
    { 
      icon: NavigationIcons.resources.documentation, 
      label: 'Documentation',
      description: 'Technical guides and API docs'
    },
    { 
      icon: NavigationIcons.resources.helpCenter, 
      label: 'Help Center',
      description: 'FAQs and troubleshooting'
    },
    { 
      icon: NavigationIcons.resources.nonDestructiveFixes, 
      label: 'Non-Destructive Fixes',
      description: 'CSS-based accessibility fixes'
    },
    { 
      icon: NavigationIcons.resources.blog, 
      label: 'Blog',
      description: 'Articles and updates'
    }
  ];

  const menuSections = [
    { title: 'Tools', items: toolsMenuItems },
    { title: 'Integrations', items: integrationsMenuItems },
    { title: 'Resources', items: resourcesMenuItems }
  ];

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-4xl font-bold mb-6">AccessWebPro Icon Guide</h1>
      {/* Using base-16px text size for main content */}
      <p className="text-base mb-8">
        This guide demonstrates the recommended icons for navigation items across the AccessWebPro application.
        Using consistent icons helps maintain a unified visual language throughout the UI.
      </p>
      
      <Tabs defaultValue="examples">
        <TabsList className="mb-4">
          <TabsTrigger value="examples" className="text-base">Menu Examples</TabsTrigger>
          <TabsTrigger value="icons" className="text-base">Icon List</TabsTrigger>
        </TabsList>
        
        <TabsContent value="examples" className="space-y-6">
          <div className="bg-card p-6 rounded-lg border">
            <h2 className="text-2xl font-bold mb-4">Menu Item Examples</h2>
            <p className="text-base mb-6">These examples show how the icons appear in actual menu items with labels and descriptions.</p>
            <MenuStyleShowcase sections={menuSections} />
          </div>
        </TabsContent>
        
        <TabsContent value="icons">
          <div className="bg-card p-6 rounded-lg border">
            <h2 className="text-2xl font-bold mb-4">Icon Library</h2>
            <p className="text-base mb-6">Complete reference of all icons used in navigation throughout the application.</p>
            <IconPreview />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default IconGuidePage;