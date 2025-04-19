import React from 'react';
import { LucideIcon } from 'lucide-react';

// Interface for menu item data
interface MenuItem {
  icon: LucideIcon;
  label: string;
  description?: string;
}

// Interface for section data
interface MenuSection {
  title: string;
  items: MenuItem[];
}

// Component to render a single menu item
export const MenuItemDisplay: React.FC<MenuItem> = ({ icon: Icon, label, description }) => {
  return (
    <div className="p-3 rounded-md hover:bg-accent/50 transition-colors">
      <div className="flex items-center mb-1">
        {/* Icon aligned with title */}
        <Icon className="h-5 w-5 mr-2 text-primary" />
        {/* Main title - ensuring 16px minimum font size */}
        <div className="font-medium text-base">{label}</div>
      </div>
      {/* Description aligned with left edge of the icon */}
      {description && (
        <div className="pl-7 text-base text-muted-foreground">
          {description}
        </div>
      )}
    </div>
  );
};

// Component to render a section of menu items
export const MenuSectionDisplay: React.FC<MenuSection> = ({ title, items }) => {
  return (
    <div className="space-y-2">
      {/* Section title with WCAG compliant font size */}
      <h3 className="text-xl font-semibold mb-3">{title}</h3>
      <div className="space-y-1 border rounded-lg p-2">
        {items.map((item, index) => (
          <MenuItemDisplay key={index} {...item} />
        ))}
      </div>
    </div>
  );
};

// Export a component to demonstrate all menu styles
export const MenuStyleShowcase: React.FC<{ sections: MenuSection[] }> = ({ sections }) => {
  return (
    <div className="space-y-8 p-4">
      {sections.map((section, index) => (
        <MenuSectionDisplay key={index} {...section} />
      ))}
    </div>
  );
};

export default MenuStyleShowcase;