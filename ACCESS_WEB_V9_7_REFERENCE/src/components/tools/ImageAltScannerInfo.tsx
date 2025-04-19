import { AlertTriangle, CheckCircle, Info, LayoutGrid, MousePointer } from 'lucide-react';

export const ImageAltScannerInfo = () => {
  return (
    <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-6 mb-8 border border-gray-200 dark:border-gray-700">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
        Why Alt Text Matters
      </h2>
      
      <div className="prose dark:prose-invert max-w-none">
        <p>
          Alternative text (alt text) provides a textual alternative to non-text content on web pages. 
          WCAG 1.1.1 (Non-text Content) requires that all images have appropriate text alternatives 
          that serve the equivalent purpose.
        </p>
      </div>
      
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
          <h3 className="font-medium text-lg text-blue-800 dark:text-blue-300 mb-2 flex items-center">
            <Info className="h-5 w-5 mr-2" />
            WCAG 1.1.1 Compliance
          </h3>
          <p className="text-blue-700 dark:text-blue-400 text-sm">
            Images must have text alternatives that serve the equivalent purpose as the image itself.
            This ensures content is accessible to people with various disabilities, particularly those 
            using screen readers or in situations where images cannot be seen.
          </p>
        </div>
        
        <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
          <h3 className="font-medium text-lg text-green-800 dark:text-green-300 mb-2 flex items-center">
            <CheckCircle className="h-5 w-5 mr-2" />
            Benefits of Good Alt Text
          </h3>
          <ul className="text-green-700 dark:text-green-400 text-sm space-y-1 list-disc list-inside">
            <li>Makes content accessible to screen reader users</li>
            <li>Improves SEO rankings and discoverability</li>
            <li>Provides context when images fail to load</li>
            <li>Helps users with low bandwidth or text-only browsers</li>
            <li>Ensures compliance with accessibility laws</li>
          </ul>
        </div>
      </div>
      
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mt-8 mb-3">
        How the Alt Text Scanner Works
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="flex flex-col items-center text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div className="p-3 bg-primary-100 dark:bg-primary-900/30 rounded-full mb-3">
            <LayoutGrid className="h-6 w-6 text-primary-600 dark:text-primary-400" />
          </div>
          <h4 className="font-medium text-gray-900 dark:text-white mb-1">1. Scan</h4>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            The scanner analyzes images on your page to check for alt text implementation
          </p>
        </div>
        
        <div className="flex flex-col items-center text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div className="p-3 bg-primary-100 dark:bg-primary-900/30 rounded-full mb-3">
            <AlertTriangle className="h-6 w-6 text-primary-600 dark:text-primary-400" />
          </div>
          <h4 className="font-medium text-gray-900 dark:text-white mb-1">2. Identify Issues</h4>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Detects missing alt text, duplicate alt text, and suspicious placeholders
          </p>
        </div>
        
        <div className="flex flex-col items-center text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div className="p-3 bg-primary-100 dark:bg-primary-900/30 rounded-full mb-3">
            <MousePointer className="h-6 w-6 text-primary-600 dark:text-primary-400" />
          </div>
          <h4 className="font-medium text-gray-900 dark:text-white mb-1">3. Fix Problems</h4>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Fix accessibility issues directly with our smart suggestions and one-click repairs
          </p>
        </div>
      </div>
      
      <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg mb-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <Info className="h-5 w-5 text-yellow-400" aria-hidden="true" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-400">
              About Platform Integrations
            </h3>
            <div className="mt-2 text-sm text-yellow-700 dark:text-yellow-300">
              <p>
                The WordPress and Shopify integrations provide deeper scanning capabilities and allow 
                you to fix issues directly in your content management system. Select the appropriate 
                integration type above if you're scanning a WordPress or Shopify site.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};