import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Scan,
  AlertTriangle,
  Info,
  CheckCircle,
  XCircle,
  Image as ImageIcon,
  BarChart,
  Settings,
  Filter,
  Copy,
  RefreshCw
} from 'lucide-react';
import type { ScanResult, ImageIssue, ScanOptions } from '../../services/imageAltScanService';

const mockIssues: ImageIssue[] = [
  {
    id: uuidv4(),
    url: 'https://example.com/images/product1.jpg',
    element: '<img src="/images/product1.jpg">',
    selector: 'main > div:nth-child(2) > img',
    issueType: 'missing',
    impact: 'critical',
    description: 'Image is missing an alt attribute',
    wcagCriteria: 'WCAG 1.1.1 (A)',
    suggestedFix: 'Add an alt attribute that describes the image content',
    suggestedAlt: 'Blue denim jacket with metal buttons',
    fixed: false
  },
  {
    id: uuidv4(),
    url: 'https://example.com/images/banner.jpg',
    element: '<img src="/images/banner.jpg" alt="">',
    selector: 'header > div.banner > img',
    issueType: 'empty',
    impact: 'serious',
    description: 'Image has an empty alt attribute',
    wcagCriteria: 'WCAG 1.1.1 (A)',
    suggestedFix: 'Add descriptive alt text or confirm image is decorative',
    suggestedAlt: 'Spring sale promotional banner',
    fixed: false
  },
  {
    id: uuidv4(),
    url: 'https://example.com/images/icon-settings.svg',
    element: '<img src="/images/icon-settings.svg" alt="settings icon settings">',
    selector: 'nav > ul > li:nth-child(3) > img',
    issueType: 'redundant',
    impact: 'moderate',
    description: 'Alt text contains redundant words ("icon", "settings" repeated)',
    wcagCriteria: 'WCAG 1.1.1 (A)',
    suggestedFix: 'Remove redundant words from alt text',
    suggestedAlt: 'Settings',
    fixed: false
  }
];

type ImageAltScannerProps = {
  /** URL to scan, defaults to current page if not provided */
  url?: string;
  /** Initial options for scanning */
  initialOptions?: Partial<ScanOptions>;
  /** Callback when scan is complete */
  onScanComplete?: (result: ScanResult) => void;
  /** Callback when issues are fixed */
  onIssuesFixed?: (fixedIssues: ImageIssue[]) => void;
  /** Integration type - changes scanning approach */
  integrationType?: 'browser' | 'wordpress' | 'shopify';
  /** Integration settings (API keys, etc.) */
  integrationSettings?: Record<string, string>;
}

export const ImageAltScanner = ({
  url,
  initialOptions,
  onScanComplete,
  onIssuesFixed,
  integrationType = 'browser',
  integrationSettings = {}
}: ImageAltScannerProps) => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [activeTab, setActiveTab] = useState<'issues' | 'fixed' | 'settings'>('issues');
  const [fixedIssues, setFixedIssues] = useState<ImageIssue[]>([]);
  const [scanOptions, setScanOptions] = useState<ScanOptions>({
    includeDuplicateCheck: true,
    includeRedundantCheck: true,
    includeSuspiciousCheck: true,
    redundantPatterns: ['image', 'picture', 'photo', 'icon', 'graphic', 'logo'],
    suspiciousPatterns: ['img', 'DSC', 'IMG', 'untitled', 'image']
  });
  const [filterOptions, setFilterOptions] = useState({
    issueTypes: ['missing', 'empty', 'redundant', 'suspicious', 'duplicate'],
    impacts: ['critical', 'serious', 'moderate', 'minor']
  });
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);

  // Initialize with props
  useEffect(() => {
    if (initialOptions) {
      setScanOptions(prev => ({ ...prev, ...initialOptions }));
    }
  }, [initialOptions]);

  const startScan = async () => {
    setIsScanning(true);
    // In a real implementation, this would call an API or run a DOM scan
    // For demo purposes, we'll use mock data after a delay
    setTimeout(() => {
      const mockResult: ScanResult = {
        id: uuidv4(),
        url: url || window.location.href,
        timestamp: Date.now(),
        totalImages: 17,
        issuesFound: mockIssues.length,
        issues: mockIssues
      };
      
      setScanResult(mockResult);
      setIsScanning(false);
      
      if (onScanComplete) {
        onScanComplete(mockResult);
      }
    }, 2500);
  };

  const handleFixIssue = (issueId: string, fixedAlt: string) => {
    // In a real implementation, this would apply the fix to the DOM or API
    if (scanResult) {
      // Find and update the issue
      const updatedIssues = scanResult.issues.map(issue => 
        issue.id === issueId ? { ...issue, fixed: true, suggestedAlt: fixedAlt } : issue
      );
      
      // Find the fixed issue
      const fixedIssue = scanResult.issues.find(issue => issue.id === issueId);
      
      if (fixedIssue) {
        // Add to fixed issues with the new alt text
        setFixedIssues(prev => [...prev, { 
          ...fixedIssue, 
          fixed: true,
          suggestedAlt: fixedAlt // Use the provided fixed alt text
        }]);
        
        // Update the scan result
        setScanResult({
          ...scanResult,
          issues: updatedIssues.filter(issue => !issue.fixed),
          issuesFound: updatedIssues.filter(issue => !issue.fixed).length
        });
        
        if (onIssuesFixed) {
          onIssuesFixed([{ ...fixedIssue, fixed: true, suggestedAlt: fixedAlt }]);
        }
      }
    }
  };

  const handleBatchFix = () => {
    if (scanResult) {
      // In a real implementation, this would apply multiple fixes at once
      const allFixedIssues = [...scanResult.issues.map(issue => ({ ...issue, fixed: true }))];
      setFixedIssues(prev => [...prev, ...allFixedIssues]);
      
      setScanResult({
        ...scanResult,
        issues: [],
        issuesFound: 0
      });
      
      if (onIssuesFixed) {
        onIssuesFixed(allFixedIssues);
      }
    }
  };

  const handleOptionChange = (key: keyof ScanOptions, value: any) => {
    setScanOptions(prev => ({ ...prev, [key]: value }));
  };

  const filteredIssues = scanResult?.issues.filter(issue => 
    filterOptions.issueTypes.includes(issue.issueType) && 
    filterOptions.impacts.includes(issue.impact)
  ) || [];

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'critical': return 'text-red-600 dark:text-red-400';
      case 'serious': return 'text-orange-600 dark:text-orange-400';
      case 'moderate': return 'text-yellow-600 dark:text-yellow-400';
      case 'minor': return 'text-blue-600 dark:text-blue-400';
      default: return 'text-gray-600 dark:text-gray-400';
    }
  };

  const getIssueTypeIcon = (type: string) => {
    switch (type) {
      case 'missing': return <XCircle className="w-5 h-5 text-red-500" />;
      case 'empty': return <AlertTriangle className="w-5 h-5 text-orange-500" />;
      case 'redundant': return <Info className="w-5 h-5 text-blue-500" />;
      case 'suspicious': return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'duplicate': return <Copy className="w-5 h-5 text-purple-500" />;
      default: return <Info className="w-5 h-5 text-gray-500" />;
    }
  };

  // Animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
  };

  return (
    <div className="space-y-8 pb-6">
      <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          Scan for Image Accessibility Issues
        </h2>
        
        <div className="mb-6">
          <p className="text-gray-600 dark:text-gray-400">
            This tool scans for WCAG 1.1.1 compliance issues with images, detecting missing or improper alt text.
          </p>
        </div>
        
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 md:space-x-4">
          <div className="flex-1">
            <button
              onClick={startScan}
              disabled={isScanning}
              className="w-full md:w-auto flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isScanning ? (
                <>
                  <RefreshCw className="animate-spin -ml-1 mr-3 h-5 w-5" />
                  Scanning...
                </>
              ) : (
                <>
                  <Scan className="-ml-1 mr-3 h-5 w-5" />
                  Start Scan
                </>
              )}
            </button>
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
              className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            >
              <Settings className="h-4 w-4 mr-2" />
              <span>{showAdvancedOptions ? 'Hide' : 'Show'} Advanced Options</span>
            </button>
          </div>
        </div>
        
        <AnimatePresence>
          {showAdvancedOptions && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700 overflow-hidden"
            >
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Advanced Scan Options
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Issue Detection</h4>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={scanOptions.includeDuplicateCheck}
                        onChange={(e) => handleOptionChange('includeDuplicateCheck', e.target.checked)}
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Check for duplicate images with same alt text</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={scanOptions.includeRedundantCheck}
                        onChange={(e) => handleOptionChange('includeRedundantCheck', e.target.checked)}
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Check for redundant terms in alt text</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={scanOptions.includeSuspiciousCheck}
                        onChange={(e) => handleOptionChange('includeSuspiciousCheck', e.target.checked)}
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Check for suspicious alt text patterns</span>
                    </label>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Pattern Settings</h4>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="redundant-patterns" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Redundant Terms
                      </label>
                      <input
                        id="redundant-patterns"
                        type="text"
                        value={scanOptions.redundantPatterns.join(', ')}
                        onChange={(e) => handleOptionChange('redundantPatterns', e.target.value.split(',').map(s => s.trim()))}
                        className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                      />
                    </div>
                    <div>
                      <label htmlFor="suspicious-patterns" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Suspicious Patterns
                      </label>
                      <input
                        id="suspicious-patterns"
                        type="text"
                        value={scanOptions.suspiciousPatterns.join(', ')}
                        onChange={(e) => handleOptionChange('suspiciousPatterns', e.target.value.split(',').map(s => s.trim()))}
                        className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* Results Section */}
      {scanResult && (
        <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="flex -mb-px overflow-x-auto" aria-label="Tabs">
              <button
                onClick={() => setActiveTab('issues')}
                className={`flex-1 md:flex-none whitespace-nowrap px-6 py-4 border-b-2 font-medium text-sm ${
                  activeTab === 'issues'
                    ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                <AlertTriangle className="w-4 h-4 mr-2 inline" />
                Issues ({scanResult.issues.length})
              </button>
              <button
                onClick={() => setActiveTab('fixed')}
                className={`flex-1 md:flex-none whitespace-nowrap px-6 py-4 border-b-2 font-medium text-sm ${
                  activeTab === 'fixed'
                    ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                <CheckCircle className="w-4 h-4 mr-2 inline" />
                Fixed ({fixedIssues.length})
              </button>
              <button
                onClick={() => setActiveTab('settings')}
                className={`flex-1 md:flex-none whitespace-nowrap px-6 py-4 border-b-2 font-medium text-sm ${
                  activeTab === 'settings'
                    ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                <Settings className="w-4 h-4 mr-2 inline" />
                Settings
              </button>
            </nav>
          </div>
          
          <div className="p-6">
            {/* Summary Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <ImageIcon className="h-6 w-6 text-primary-500" />
                  </div>
                  <div className="ml-3">
                    <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Images</div>
                    <div className="text-lg font-semibold text-gray-900 dark:text-white">{scanResult.totalImages}</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <AlertTriangle className="h-6 w-6 text-orange-500" />
                  </div>
                  <div className="ml-3">
                    <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Issues Found</div>
                    <div className="text-lg font-semibold text-gray-900 dark:text-white">{scanResult.issues.length}</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <CheckCircle className="h-6 w-6 text-green-500" />
                  </div>
                  <div className="ml-3">
                    <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Issues Fixed</div>
                    <div className="text-lg font-semibold text-gray-900 dark:text-white">{fixedIssues.length}</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <BarChart className="h-6 w-6 text-blue-500" />
                  </div>
                  <div className="ml-3">
                    <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Compliance</div>
                    <div className="text-lg font-semibold text-gray-900 dark:text-white">
                      {scanResult.totalImages > 0
                        ? Math.round(((scanResult.totalImages - scanResult.issues.length) / scanResult.totalImages) * 100)
                        : 0}%
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {activeTab === 'issues' && (
              <div>
                {scanResult.issues.length > 0 ? (
                  <>
                    {/* Filter Controls */}
                    <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div className="flex items-center">
                        <Filter className="h-5 w-5 text-gray-400 mr-2" />
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Filter Issues:</span>
                      </div>
                      
                      <div className="flex flex-wrap gap-2">
                        <select
                          className="rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white py-1 pl-3 pr-10 text-base focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                          value={filterOptions.issueTypes.length === 5 ? 'all' : filterOptions.issueTypes.join(',')}
                          onChange={(e) => {
                            const value = e.target.value;
                            setFilterOptions(prev => ({
                              ...prev,
                              issueTypes: value === 'all' 
                                ? ['missing', 'empty', 'redundant', 'suspicious', 'duplicate']
                                : value.split(',')
                            }));
                          }}
                        >
                          <option value="all">All Issue Types</option>
                          <option value="missing">Missing Alt</option>
                          <option value="empty">Empty Alt</option>
                          <option value="redundant">Redundant Alt</option>
                          <option value="suspicious">Suspicious Alt</option>
                          <option value="duplicate">Duplicate Alt</option>
                        </select>
                        
                        <select
                          className="rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white py-1 pl-3 pr-10 text-base focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                          value={filterOptions.impacts.length === 4 ? 'all' : filterOptions.impacts.join(',')}
                          onChange={(e) => {
                            const value = e.target.value;
                            setFilterOptions(prev => ({
                              ...prev,
                              impacts: value === 'all' 
                                ? ['critical', 'serious', 'moderate', 'minor']
                                : value.split(',')
                            }));
                          }}
                        >
                          <option value="all">All Impact Levels</option>
                          <option value="critical">Critical</option>
                          <option value="serious">Serious</option>
                          <option value="moderate">Moderate</option>
                          <option value="minor">Minor</option>
                        </select>
                      </div>
                      
                      <button
                        onClick={handleBatchFix}
                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                      >
                        <CheckCircle className="-ml-1 mr-2 h-4 w-4" />
                        Fix All Issues
                      </button>
                    </div>
                    
                    {/* Issue Cards */}
                    <div className="space-y-4">
                      {filteredIssues.map((issue, index) => (
                        <motion.div
                          key={issue.id}
                          variants={cardVariants}
                          initial="hidden"
                          animate="visible"
                          transition={{ delay: index * 0.1 }}
                          className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm p-4"
                        >
                          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-start">
                                <div className="flex-shrink-0 pt-0.5">
                                  {getIssueTypeIcon(issue.issueType)}
                                </div>
                                <div className="ml-3 flex-1">
                                  <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                                    {issue.description}
                                  </h3>
                                  <div className="mt-1 flex items-center text-xs">
                                    <span className={`inline-flex items-center ${getImpactColor(issue.impact)}`}>
                                      {issue.impact.charAt(0).toUpperCase() + issue.impact.slice(1)} Impact
                                    </span>
                                    <span className="mx-2 text-gray-500">•</span>
                                    <span className="text-gray-500 dark:text-gray-400">{issue.wcagCriteria}</span>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div>
                                    <h4 className="text-xs font-medium text-gray-500 uppercase mb-1">Element</h4>
                                    <div className="bg-gray-50 dark:bg-gray-900 rounded p-2 text-xs font-mono overflow-x-auto">
                                      {issue.element}
                                    </div>
                                  </div>
                                  <div>
                                    <h4 className="text-xs font-medium text-gray-500 uppercase mb-1">Image URL</h4>
                                    <div className="bg-gray-50 dark:bg-gray-900 rounded p-2 text-xs font-mono truncate">
                                      {issue.url}
                                    </div>
                                  </div>
                                </div>
                                
                                <div className="mt-3">
                                  <h4 className="text-xs font-medium text-gray-500 uppercase mb-1">Suggested Fix</h4>
                                  <p className="text-sm text-gray-700 dark:text-gray-300">{issue.suggestedFix}</p>
                                  
                                  {issue.suggestedAlt && (
                                    <div className="mt-2">
                                      <label htmlFor={`alt-text-${issue.id}`} className="block text-xs font-medium text-gray-500 mb-1">
                                        Suggested Alt Text
                                      </label>
                                      <div className="mt-1 flex rounded-md shadow-sm">
                                        <input
                                          type="text"
                                          name={`alt-text-${issue.id}`}
                                          id={`alt-text-${issue.id}`}
                                          defaultValue={issue.suggestedAlt}
                                          className="flex-1 min-w-0 block w-full px-3 py-2 rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                                        />
                                        <button
                                          type="button"
                                          onClick={() => handleFixIssue(issue.id, issue.suggestedAlt || '')}
                                          className="inline-flex items-center px-4 py-2 border border-transparent rounded-r-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                                        >
                                          <CheckCircle className="-ml-1 mr-2 h-4 w-4" />
                                          Apply Fix
                                        </button>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="text-center py-12">
                    <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
                    <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">No issues found!</h3>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      All images appear to have proper alt text attributes.
                    </p>
                  </div>
                )}
              </div>
            )}
            
            {activeTab === 'fixed' && (
              <div>
                {fixedIssues.length > 0 ? (
                  <div className="space-y-4">
                    {fixedIssues.map((issue) => (
                      <div
                        key={issue.id}
                        className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm p-4"
                      >
                        <div className="flex items-start">
                          <div className="flex-shrink-0 pt-0.5">
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          </div>
                          <div className="ml-3 flex-1">
                            <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                              {issue.description} (Fixed)
                            </h3>
                            <div className="mt-1 flex items-center text-xs">
                              <span className={`inline-flex items-center ${getImpactColor(issue.impact)}`}>
                                {issue.impact.charAt(0).toUpperCase() + issue.impact.slice(1)} Impact
                              </span>
                              <span className="mx-2 text-gray-500">•</span>
                              <span className="text-gray-500 dark:text-gray-400">{issue.wcagCriteria}</span>
                            </div>
                            
                            <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <h4 className="text-xs font-medium text-gray-500 uppercase mb-1">Original Element</h4>
                                <div className="bg-gray-50 dark:bg-gray-900 rounded p-2 text-xs font-mono overflow-x-auto">
                                  {issue.element}
                                </div>
                              </div>
                              <div>
                                <h4 className="text-xs font-medium text-gray-500 uppercase mb-1">Fixed Element</h4>
                                <div className="bg-gray-50 dark:bg-gray-900 rounded p-2 text-xs font-mono overflow-x-auto">
                                  {issue.element.includes('alt=') 
                                    ? issue.element.replace(/alt="[^"]*"/, `alt="${issue.suggestedAlt}"`)
                                    : issue.element.replace(/<img/, `<img alt="${issue.suggestedAlt}"`)
                                  }
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Info className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">No fixed issues yet</h3>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      After you fix issues, they will appear here for reference.
                    </p>
                  </div>
                )}
              </div>
            )}
            
            {activeTab === 'settings' && (
              <div>
                <div className="max-w-3xl mx-auto">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                    Scan Configuration
                  </h3>
                  
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Integration Settings</h4>
                      <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label htmlFor="integration-type" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                              Integration Type
                            </label>
                            <select
                              id="integration-type"
                              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                              value={integrationType}
                              disabled
                            >
                              <option value="browser">Browser (Current Page)</option>
                              <option value="wordpress">WordPress Integration</option>
                              <option value="shopify">Shopify Integration</option>
                            </select>
                          </div>
                          
                          {integrationType !== 'browser' && (
                            <div>
                              <label htmlFor="api-key" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                API Key
                              </label>
                              <input
                                type="password"
                                id="api-key"
                                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                                value={integrationSettings['apiKey'] || ''}
                                placeholder="Enter API key"
                                disabled
                              />
                            </div>
                          )}
                        </div>
                        
                        {(integrationType === 'wordpress' || integrationType === 'shopify') && (
                          <div className="mt-4 rounded-md bg-yellow-50 dark:bg-yellow-900/20 p-4">
                            <div className="flex">
                              <div className="flex-shrink-0">
                                <Info className="h-5 w-5 text-yellow-400" aria-hidden="true" />
                              </div>
                              <div className="ml-3">
                                <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-400">
                                  Integration Setup Required
                                </h3>
                                <div className="mt-2 text-sm text-yellow-700 dark:text-yellow-300">
                                  <p>
                                    {integrationType === 'wordpress'
                                      ? 'Please install the WordPress plugin and configure the API key to enable scanning of your WordPress site.'
                                      : 'Please install the Shopify app and configure the API key to enable scanning of your Shopify store.'}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Scan Settings</h4>
                      <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                        <div className="grid grid-cols-1 gap-4">
                          <div>
                            <label htmlFor="scan-depth" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                              Scan Depth
                            </label>
                            <select
                              id="scan-depth"
                              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                              defaultValue="current"
                            >
                              <option value="current">Current Page Only</option>
                              <option value="section">Current Section</option>
                              <option value="full">Full Site</option>
                            </select>
                            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                              Determines how many pages will be scanned
                            </p>
                          </div>
                          
                          <div>
                            <label htmlFor="compliance-level" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                              Compliance Level
                            </label>
                            <select
                              id="compliance-level"
                              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                              defaultValue="strict"
                            >
                              <option value="minimum">Minimum (A)</option>
                              <option value="recommended">Recommended (AA)</option>
                              <option value="strict">Strict (AAA)</option>
                            </select>
                            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                              Sets the WCAG compliance level for the scan
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Reporting Options</h4>
                      <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                        <div className="space-y-2">
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              defaultChecked={true}
                              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                            />
                            <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Generate PDF report</span>
                          </label>
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              defaultChecked={true}
                              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                            />
                            <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Include screenshots in report</span>
                          </label>
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              defaultChecked={false}
                              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                            />
                            <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Email report when completed</span>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageAltScanner;