import React from 'react';
import { AccessibilityTipTooltip } from '../accessibility/AccessibilityTipTooltip';

export const AccessibilityTipsDemo: React.FC = () => {
  return (
    <div className="p-8 space-y-8">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Accessibility Tips Demo
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Image Demo */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Images</h2>
          <AccessibilityTipTooltip 
            tipId="image-alt-text" 
            position="top"
          >
            <img 
              src="https://picsum.photos/300/200" 
              alt="A beautiful landscape with mountains and a lake" 
              className="w-full h-auto rounded-md"
            />
          </AccessibilityTipTooltip>
          <p className="mt-3 text-sm text-gray-600 dark:text-gray-300">
            This image has proper alt text that describes the content.
          </p>
        </div>

        {/* Form Field Demo */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Form Fields</h2>
          <div className="space-y-3">
            <AccessibilityTipTooltip 
              tipId="form-labels" 
              position="right"
            >
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Username
                </label>
                <input 
                  type="text" 
                  id="username"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-describedby="username-help"
                />
                <p id="username-help" className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Enter your username (minimum 4 characters)
                </p>
              </div>
            </AccessibilityTipTooltip>
          </div>
        </div>

        {/* Structure Demo */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Headings</h2>
          <AccessibilityTipTooltip 
            tipId="heading-structure"
            position="left"
          >
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200">Main Heading</h3>
              <h4 className="text-base font-semibold text-gray-700 dark:text-gray-300">Subheading One</h4>
              <p className="text-gray-600 dark:text-gray-400">Some paragraph text under the first subheading.</p>
              <h4 className="text-base font-semibold text-gray-700 dark:text-gray-300">Subheading Two</h4>
              <p className="text-gray-600 dark:text-gray-400">Additional paragraph text under the second subheading.</p>
            </div>
          </AccessibilityTipTooltip>
        </div>

        {/* Color Contrast Demo */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Color Contrast</h2>
          <div className="space-y-3">
            <AccessibilityTipTooltip 
              tipId="color-contrast"
              position="top"
            >
              <div className="p-4 bg-blue-600 rounded-md">
                <p className="text-white font-medium">Good contrast: White text on blue background</p>
              </div>
            </AccessibilityTipTooltip>

            <AccessibilityTipTooltip 
              tipId="color-contrast-poor"
              position="bottom"
            >
              <div className="p-4 bg-yellow-200 rounded-md">
                <p className="text-yellow-500 font-medium">Poor contrast: Yellow text on light yellow background</p>
              </div>
            </AccessibilityTipTooltip>
          </div>
        </div>

        {/* Button Demo */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Interactive Elements</h2>
          <div className="space-y-3">
            <AccessibilityTipTooltip 
              tipId="interactive-elements"
              position="right"
            >
              <button
                className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Accessible Button
              </button>
            </AccessibilityTipTooltip>

            <AccessibilityTipTooltip 
              tipId="keyboard-navigation"
              position="left"
            >
              <div tabIndex={0} role="button" aria-label="Custom interactive element" className="w-full p-3 bg-gray-100 dark:bg-gray-700 rounded-md cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
                Custom Interactive Element (with proper role)
              </div>
            </AccessibilityTipTooltip>
          </div>
        </div>
        
        {/* Tables Demo */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Tables</h2>
          <AccessibilityTipTooltip 
            tipId="data-tables"
            position="bottom"
          >
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <caption className="text-left text-sm text-gray-500 dark:text-gray-400 mb-2">
                User information table with proper caption
              </caption>
              <thead className="bg-gray-50 dark:bg-gray-900">
                <tr>
                  <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Name
                  </th>
                  <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Role
                  </th>
                  <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                <tr>
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    Jane Cooper
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    Developer
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                      Active
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </AccessibilityTipTooltip>
        </div>
      </div>
      
      <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900 rounded-lg">
        <h2 className="text-lg font-medium text-blue-800 dark:text-blue-200 mb-2">
          How to Use This Demo
        </h2>
        <ul className="list-disc pl-5 text-blue-700 dark:text-blue-300 space-y-1">
          <li>
            Toggle "Accessibility Tips" in the toolbar to show or hide the blue tip indicators
          </li>
          <li>
            Hover over elements with blue indicators to see accessibility recommendations
          </li>
          <li>
            Click the "Learn more" link in tooltips to access detailed guidance
          </li>
          <li>
            Try turning on other accessibility features like "High Contrast" to see their effect
          </li>
        </ul>
      </div>
    </div>
  );
};

export default AccessibilityTipsDemo;