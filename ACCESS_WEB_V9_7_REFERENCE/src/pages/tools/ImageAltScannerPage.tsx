import { useState } from 'react';
import ImageAltScanner from '../../components/tools/ImageAltScanner';
import { ImageAltScannerInfo } from '../../components/tools/ImageAltScannerInfo';
import { ExternalLink, HelpCircle, Info, Link as LinkIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { ScanResult, ImageIssue, ScanOptions } from '../../services/imageAltScanService';

export function ImageAltScannerPage() {
  const [urlToScan, setUrlToScan] = useState('');
  const [integrationType, setIntegrationType] = useState<'browser' | 'wordpress' | 'shopify'>('browser');
  const [scanHistory, setScanHistory] = useState<ScanResult[]>([]);

  // Default scan options
  const defaultOptions: Partial<ScanOptions> = {
    includeDuplicateCheck: true,
    includeRedundantCheck: true,
    includeSuspiciousCheck: true,
    redundantPatterns: ['image', 'picture', 'photo', 'icon', 'graphic', 'logo'],
    suspiciousPatterns: ['img', 'DSC', 'IMG', 'untitled', 'image']
  };
  
  const handleScanComplete = (result: ScanResult) => {
    setScanHistory(prev => [result, ...prev].slice(0, 10)); // Keep only the last 10 scans
  };
  
  const handleIssuesFixed = (fixedIssues: ImageIssue[]) => {
    // You could send this data to analytics or update scan history with fixes
    console.log('Fixed issues:', fixedIssues);
  };
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-[130px] pb-[80px]">
      <div className="content-container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">
              Image Alt Text Scanner
            </h1>
            <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
              Find and fix image accessibility issues to ensure WCAG 1.1.1 compliance
            </p>
          </div>
          
          <div className="mt-4 md:mt-0 flex space-x-3">
            <Link 
              to="/help/alt-text-guide" 
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <HelpCircle className="-ml-1 mr-2 h-5 w-5" />
              Alt Text Guide
            </Link>
            <a 
              href="https://www.w3.org/WAI/WCAG21/Understanding/non-text-content.html" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <ExternalLink className="-ml-1 mr-2 h-5 w-5" />
              WCAG 1.1.1 Spec
            </a>
          </div>
        </div>
        
        {/* Scan Settings */}
        <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-6 mb-8 border border-gray-200 dark:border-gray-700">
          <div className="md:flex md:items-center md:justify-between">
            <div className="flex-1 min-w-0">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Scan Settings
              </h2>
            </div>
          </div>
          
          <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            <div className="sm:col-span-4">
              <label htmlFor="url" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                URL to scan
              </label>
              <div className="mt-1 flex rounded-md shadow-sm">
                <input
                  type="text"
                  name="url"
                  id="url"
                  className="flex-1 min-w-0 block w-full rounded-md sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-blue-500 focus:border-blue-500"
                  placeholder="https://example.com"
                  value={urlToScan}
                  onChange={(e) => setUrlToScan(e.target.value)}
                />
              </div>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Leave empty to scan the current page
              </p>
            </div>
            
            <div className="sm:col-span-2">
              <label htmlFor="integration-type" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Integration Type
              </label>
              <select
                id="integration-type"
                name="integration-type"
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white py-2 pl-3 pr-10 text-base focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                value={integrationType}
                onChange={(e) => setIntegrationType(e.target.value as 'browser' | 'wordpress' | 'shopify')}
              >
                <option value="browser">Browser (Current Page)</option>
                <option value="wordpress">WordPress Integration</option>
                <option value="shopify">Shopify Integration</option>
              </select>
            </div>
          </div>
          
          {(integrationType === 'wordpress' || integrationType === 'shopify') && (
            <div className="mt-4 rounded-md bg-yellow-50 dark:bg-yellow-900/20 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <Info className="h-5 w-5 text-yellow-400" aria-hidden="true" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-400">
                    {integrationType === 'wordpress' ? 'WordPress Integration' : 'Shopify Integration'}
                  </h3>
                  <div className="mt-2 text-sm text-yellow-700 dark:text-yellow-300">
                    <p>
                      {integrationType === 'wordpress'
                        ? 'To use WordPress integration, you need to install our plugin first. Go to your WordPress admin dashboard and install "WCAG Image Scanner" plugin.'
                        : 'To use Shopify integration, you need to install our app first. Go to your Shopify admin dashboard and search for "WCAG Image Scanner" in the app store.'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Info Section */}
        <ImageAltScannerInfo />
        
        {/* Scanner Component */}
        <ImageAltScanner 
          url={urlToScan || undefined} 
          initialOptions={defaultOptions}
          integrationType={integrationType}
          onScanComplete={handleScanComplete}
          onIssuesFixed={handleIssuesFixed}
        />
        
        {/* Resource Links */}
        <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-6 mb-8 border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Additional Resources
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <a 
              href="https://www.w3.org/WAI/tutorials/images/decision-tree/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-start p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition duration-150"
            >
              <div className="flex-shrink-0">
                <LinkIcon className="h-6 w-6 text-primary-500" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Alt Text Decision Tree
                </h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-300">
                  W3C's guide for determining appropriate alt text based on image context
                </p>
              </div>
            </a>
            
            <a 
              href="https://webaim.org/techniques/alttext/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-start p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition duration-150"
            >
              <div className="flex-shrink-0">
                <LinkIcon className="h-6 w-6 text-primary-500" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  WebAIM Alt Text Guide
                </h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-300">
                  Comprehensive guide to alternative text for images
                </p>
              </div>
            </a>
            
            <Link 
              to="/help/alt-text-guide"
              className="flex items-start p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition duration-150"
            >
              <div className="flex-shrink-0">
                <HelpCircle className="h-6 w-6 text-primary-500" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Complete Alt Text Guide
                </h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-300">
                  Our detailed guide with examples and best practices
                </p>
              </div>
            </Link>
            
            <a 
              href="https://www.deque.com/blog/great-alt-text-introduction/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-start p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition duration-150"
            >
              <div className="flex-shrink-0">
                <LinkIcon className="h-6 w-6 text-primary-500" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Deque's Introduction to Alt Text
                </h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-300">
                  Practical guidance on writing effective alternative text
                </p>
              </div>
            </a>
          </div>
        </div>
        
        {/* Scan History */}
        {scanHistory.length > 0 && (
          <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Scan History
            </h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead>
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      URL
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Date
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Total Images
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Issues
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {scanHistory.map((scan) => (
                    <tr key={scan.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        {scan.url}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {new Date(scan.timestamp).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {scan.totalImages}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {scan.issues.length}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ImageAltScannerPage;