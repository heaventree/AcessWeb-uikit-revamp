import React from 'react';
import AccessibilityTipsPanel from '../../components/accessibility/AccessibilityTipsPanel';
import { PageHeader } from '../../components/ui/PageHeader';

const AccessibilityTipsPage: React.FC = () => {
  return (
    <div className="container mx-auto py-8 px-4">
      <PageHeader
        title="Accessibility Quick Tips"
        description="Browse our comprehensive library of accessibility tips categorized by element type and WCAG requirements."
      />
      
      <div className="mt-8">
        <AccessibilityTipsPanel />
      </div>
      
      <div className="mt-12 bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg">
        <h2 className="text-xl font-semibold text-blue-700 dark:text-blue-300 mb-3">
          How to Use Accessibility Tips
        </h2>
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          Our Accessibility Quick Tips feature provides context-sensitive guidance as you navigate through
          your website or application. Here's how to make the most of it:
        </p>
        
        <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
          <li>
            <strong>Look for the tip indicator</strong> - Blue question mark icons indicate elements with
            accessibility tips.
          </li>
          <li>
            <strong>Hover over elements</strong> - Move your cursor over elements with tip indicators to
            view accessibility guidelines.
          </li>
          <li>
            <strong>Check WCAG references</strong> - Each tip includes the relevant WCAG success criterion
            for deeper understanding.
          </li>
          <li>
            <strong>Follow "Learn more" links</strong> - For detailed guidance, click the learn more links
            to access comprehensive documentation.
          </li>
          <li>
            <strong>Enable/disable tips</strong> - Toggle tips on or off using the switch in the Accessibility Toolbar.
          </li>
        </ul>
      </div>
    </div>
  );
};

export default AccessibilityTipsPage;