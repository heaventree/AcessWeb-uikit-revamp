import React from 'react';
import { LucideIcon } from 'lucide-react';
import { 
  NavigationIcons
} from './NavigationIconGuide';

interface DropdownItemProps {
  icon: LucideIcon;
  label: string;
  description: string;
}

export const DropdownItem: React.FC<DropdownItemProps> = ({ icon: Icon, label, description }) => {
  return (
    <div className="flex flex-col hover:bg-primary/5 cursor-pointer p-3 rounded-md transition-colors">
      <div className="flex items-center">
        <Icon className="h-5 w-5 text-primary mr-2" />
        <span className="font-medium text-base">{label}</span>
      </div>
      <div className="text-base text-muted-foreground">
        {description}
      </div>
    </div>
  );
};

export const ToolsDropdown: React.FC = () => {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-border w-64 p-2 space-y-1">
      <h3 className="font-medium text-base px-3 py-2 border-b border-border mb-1">Tools</h3>
      
      <DropdownItem 
        icon={NavigationIcons.tools.wcagChecker} 
        label="WCAG Checker" 
        description="Test your website against WCAG standards" 
      />
      
      <DropdownItem 
        icon={NavigationIcons.tools.colorPalette} 
        label="Color Palette" 
        description="Create accessible color combinations" 
      />
      
      <DropdownItem 
        icon={NavigationIcons.tools.colorSimulator} 
        label="Color Accessibility Simulator" 
        description="Test colors for accessibility" 
      />
      
      <DropdownItem 
        icon={NavigationIcons.tools.wcagStandards} 
        label="WCAG Standards" 
        description="Browse WCAG 2.1 standards" 
      />
      
      <DropdownItem 
        icon={NavigationIcons.tools.imageAltScanner} 
        label="Image Alt Scanner" 
        description="Find and fix image accessibility issues" 
      />
    </div>
  );
};

export default ToolsDropdown;