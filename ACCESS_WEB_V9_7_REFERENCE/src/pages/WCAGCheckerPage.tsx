import { useState } from 'react';
import { motion } from 'framer-motion';
import { URLInput } from '../components/URLInput';
import { ResultsSummary } from '../components/ResultsSummary';
import { IssuesList } from '../components/IssuesList';
import { RegionSelector } from '../components/RegionSelector';
import { EmbedBadge } from '../components/EmbedBadge';
import { StructureAnalysisPanel } from '../components/StructureAnalysisPanel';
import { ResponsiveAnalysisPanel } from '../components/ResponsiveAnalysisPanel';
import { MediaAnalysisPanel } from '../components/MediaAnalysisPanel';
import { testAccessibility } from '../utils/accessibilityTester';
import { analyzeResponsiveDesign } from '../utils/responsiveDesignAnalyzer';
import type { TestResult } from '../types';
import { exportToPDF } from '../utils/pdfExport';
import { 
  Download, 
  AlertTriangle, 
  CheckCircle, 
  FileSearch,
  FileText,
  Zap,
  Globe,
  Palette,
  HelpCircle,
  Video,
  Headphones,
  Layout,
  Smartphone
} from 'lucide-react';

type TabType = 'issues' | 'warnings' | 'passes' | 'contrast' | 'structure' | 'responsive' | 'media';

// Pro pill styling
const proPillStyle = "ml-1 text-xs px-2 py-0.5 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold inline-flex items-center scale-[0.85] origin-left";

export function WCAGCheckerPage() {
  const [selectedRegion, setSelectedRegion] = useState('eu');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<TestResult | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('issues');
  const [enableDocumentTesting, setEnableDocumentTesting] = useState(false);
  const [enablePDFAccessibility, setEnablePDFAccessibility] = useState(false);
  const [enableOfficeDocuments, setEnableOfficeDocuments] = useState(false);
  const [enableMediaTesting, setEnableMediaTesting] = useState(false);

  const handleSubmit = async (url: string) => {
    setIsLoading(true);
    setError(null);
    try {
      // Configure testing options
      const options = {
        ...(enableDocumentTesting ? {
          documentTesting: {
            enabled: true,
            pdfAccessibility: enablePDFAccessibility,
            officeDocuments: enableOfficeDocuments
          }
        } : {}),
        ...(enableMediaTesting ? {
          mediaTesting: {
            enabled: true
          }
        } : {})
      };

      const testResults = await testAccessibility(url, selectedRegion, options);
      setResults(testResults);
      
      // Check for document-specific issues
      const hasPDFIssues = testResults.issues.some(issue => 
        issue.documentType === 'pdf'
      );
      
      const hasOfficeDocIssues = testResults.issues.some(issue => 
        issue.documentType === 'word' || issue.documentType === 'excel' || issue.documentType === 'powerpoint'
      );
      
      // Check for media-specific issues
      const hasMediaIssues = testResults.issues.some(issue => 
        issue.mediaType === 'audio' || issue.mediaType === 'video' || issue.mediaType === 'embedded'
      );
      
      // Check if there are color contrast issues
      const hasContrastIssues = testResults.issues.some(issue => 
        issue.id === 'color-contrast' || issue.wcagCriteria.includes('1.4.3')
      );
      
      // Check for HTML structure and URL design issues
      const hasStructureIssues = testResults.issues.some(issue => 
        issue.structureType || 
        issue.id.includes('heading') || 
        issue.id.includes('landmark') || 
        issue.id.includes('semantic') ||
        issue.id.includes('url') ||
        issue.id === 'page-has-heading-one' ||
        issue.id === 'multiple-h1'
      );
      
      if (hasPDFIssues) {
        // PDF issues are prioritized in the display
        setActiveTab('issues');
      } else if (hasOfficeDocIssues) {
        // Office document issues are prioritized next
        setActiveTab('issues');  
      } else if (hasMediaIssues) {
        // Media issues have their own dedicated tab
        setActiveTab('media');
      } else if (hasStructureIssues) {
        // Structure issues get their own dedicated tab
        setActiveTab('structure');
      } else if (hasContrastIssues) {
        setActiveTab('contrast');
      } else if (testResults.issues.length > 0) {
        setActiveTab('issues');
      } else if (testResults.warnings.length > 0) {
        setActiveTab('warnings');
      } else {
        setActiveTab('passes');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while testing the URL');
    } finally {
      setIsLoading(false);
    }
  };

  const handleExport = () => {
    if (results) {
      exportToPDF(results);
    }
  };

  const getContrastIssues = () => {
    if (!results) return [];
    return results.issues.filter(issue => 
      issue.id === 'color-contrast' || issue.wcagCriteria.includes('1.4.3')
    );
  };

  const getNonContrastIssues = () => {
    if (!results) return [];
    return results.issues.filter(issue => 
      issue.id !== 'color-contrast' && !issue.wcagCriteria.includes('1.4.3')
    );
  };

  const getTabStyle = (tab: TabType) => {
    const baseStyle = "px-6 py-3 text-sm font-medium rounded-lg transition-colors border";
    if (activeTab === tab) {
      switch (tab) {
        case 'contrast':
          return `${baseStyle} border-purple-500 text-purple-700 bg-purple-50`;
        case 'issues':
          return `${baseStyle} border-red-500 text-red-700 bg-red-50`;
        case 'warnings':
          return `${baseStyle} border-amber-500 text-amber-700 bg-amber-50`;
        case 'passes':
          return `${baseStyle} border-emerald-500 text-emerald-700 bg-emerald-50`;
        case 'structure':
          return `${baseStyle} border-blue-500 text-blue-700 bg-blue-50`;
        case 'responsive':
          return `${baseStyle} border-teal-500 text-teal-700 bg-teal-50`;
        case 'media':
          return `${baseStyle} border-purple-500 text-purple-700 bg-purple-50`;
      }
    }
    return `${baseStyle} border-gray-300 text-gray-600 hover:bg-gray-50`;
  };

  const contrastIssues = getContrastIssues();
  const nonContrastIssues = getNonContrastIssues();
  
  const getStructureIssues = () => {
    if (!results) return [];
    return results.issues.filter(issue => 
      issue.structureType || 
      issue.id.includes('heading') || 
      issue.id.includes('landmark') || 
      issue.id.includes('semantic') ||
      issue.id.includes('url') ||
      issue.id === 'page-has-heading-one' ||
      issue.id === 'multiple-h1'
    );
  };
  
  const structureIssues = getStructureIssues();
  
  const getResponsiveIssues = () => {
    if (!results) return [];
    return results.issues.filter(issue => 
      issue.structureType === 'responsive' || 
      issue.id.includes('responsive') ||
      issue.id.includes('viewport') ||
      issue.id.includes('mobile') ||
      issue.wcagCriteria.includes('1.4.10') || // Reflow
      issue.wcagCriteria.includes('1.3.4') || // Orientation
      issue.wcagCriteria.includes('1.4.12') || // Text Spacing
      issue.wcagCriteria.includes('2.5.5') || // Target Size (WCAG 2.1 AAA)
      issue.wcagCriteria.includes('2.5.8')    // Target Size (Enhanced) (WCAG 2.2 AA)
    );
  };
  
  const getMediaIssues = () => {
    if (!results) return [];
    return results.issues.filter(issue => 
      issue.mediaType === 'audio' || 
      issue.mediaType === 'video' || 
      issue.mediaType === 'embedded' ||
      issue.wcagCriteria.includes('1.2.1') || // Audio-only and Video-only (Prerecorded)
      issue.wcagCriteria.includes('1.2.2') || // Captions (Prerecorded)
      issue.wcagCriteria.includes('1.2.3') || // Audio Description or Media Alternative (Prerecorded)
      issue.wcagCriteria.includes('1.2.4') || // Captions (Live)
      issue.wcagCriteria.includes('1.2.5') || // Audio Description (Prerecorded)
      issue.wcagCriteria.includes('1.2.6') || // Sign Language (Prerecorded)
      issue.wcagCriteria.includes('1.2.7') || // Extended Audio Description (Prerecorded)
      issue.wcagCriteria.includes('1.2.8') || // Media Alternative (Prerecorded)
      issue.wcagCriteria.includes('1.2.9') || // Audio-only (Live)
      issue.wcagCriteria.includes('1.4.2')    // Audio Control
    );
  };
  
  const responsiveIssues = getResponsiveIssues();
  const mediaIssues = getMediaIssues();

  return (
    <div className="page-container">
      <div className="content-container">
        {/* URL Input Section */}
        <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-8"
          >
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              WCAG Accessibility Checker
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Test your website against WCAG 2.1 and 2.2 standards
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <RegionSelector
              selectedRegion={selectedRegion}
              onRegionChange={setSelectedRegion}
            />
            
            {/* Testing options */}
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              {/* Pro features row */}
              <div className="flex flex-row justify-center items-center gap-6 flex-wrap">
                {/* Document Testing */}
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="documentTesting"
                    checked={enableDocumentTesting}
                    onChange={(e) => setEnableDocumentTesting(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="documentTesting" className="ml-2 text-sm font-medium text-gray-700">
                    Document Testing
                  </label>
                  <span className={proPillStyle}>PRO</span>
                  <div className="ml-1 group relative">
                    <HelpCircle className="w-4 h-4 text-gray-400 cursor-help" />
                    <div className="absolute hidden group-hover:block z-10 whitespace-nowrap p-3 bg-white rounded-lg shadow-lg border border-gray-200 text-xs text-gray-600 bottom-full mb-2 left-1/2 transform -translate-x-1/2">
                      <p className="font-semibold mb-1">Document Testing:</p>
                      <ul className="list-disc list-inside">
                        <li>Advanced testing for document formats beyond HTML</li>
                      </ul>
                    </div>
                  </div>
                </div>
                
                {/* PDF Accessibility */}
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="pdfAccessibility"
                    checked={enablePDFAccessibility}
                    onChange={(e) => setEnablePDFAccessibility(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="pdfAccessibility" className="ml-2 text-sm font-medium text-gray-700">
                    PDF Accessibility
                  </label>
                  <span className={proPillStyle}>PRO</span>
                  <div className="ml-1 group relative">
                    <HelpCircle className="w-4 h-4 text-gray-400 cursor-help" />
                    <div className="absolute hidden group-hover:block z-10 whitespace-nowrap p-3 bg-white rounded-lg shadow-lg border border-gray-200 text-xs text-gray-600 bottom-full mb-2 left-1/2 transform -translate-x-1/2">
                      <p className="font-semibold mb-1">PDF Accessibility:</p>
                      <ul className="list-disc list-inside">
                        <li>Analyzes PDF documents for accessibility issues</li>
                        <li>Checks tags, reading order, and alt text</li>
                      </ul>
                    </div>
                  </div>
                </div>
                
                {/* Office Documents */}
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="officeDocuments"
                    checked={enableOfficeDocuments}
                    onChange={(e) => setEnableOfficeDocuments(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="officeDocuments" className="ml-2 text-sm font-medium text-gray-700">
                    Test Office Documents
                  </label>
                  <span className={proPillStyle}>PRO</span>
                  <div className="ml-1 group relative">
                    <HelpCircle className="w-4 h-4 text-gray-400 cursor-help" />
                    <div className="absolute hidden group-hover:block z-10 whitespace-nowrap p-3 bg-white rounded-lg shadow-lg border border-gray-200 text-xs text-gray-600 bottom-full mb-2 left-1/2 transform -translate-x-1/2">
                      <p className="font-semibold mb-1">Office Document Testing:</p>
                      <ul className="list-disc list-inside">
                        <li>Analyzes Word, Excel, and PowerPoint documents</li>
                        <li>Checks for headings, alt text, and table headers</li>
                      </ul>
                    </div>
                  </div>
                </div>
                
                {/* Media Testing */}
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="mediaTesting"
                    checked={enableMediaTesting}
                    onChange={(e) => setEnableMediaTesting(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="mediaTesting" className="ml-2 text-sm font-medium text-gray-700">
                    Test Media
                  </label>
                  <span className={proPillStyle}>PRO</span>
                  <div className="ml-1 group relative">
                    <HelpCircle className="w-4 h-4 text-gray-400 cursor-help" />
                    <div className="absolute hidden group-hover:block z-10 whitespace-nowrap p-3 bg-white rounded-lg shadow-lg border border-gray-200 text-xs text-gray-600 bottom-full mb-2 left-1/2 transform -translate-x-1/2">
                      <p className="font-semibold mb-1">Media Testing:</p>
                      <ul className="list-disc list-inside">
                        <li>Checks audio, video, and embedded media elements</li>
                        <li>Verifies presence of captions and transcripts</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-6">
              <URLInput onSubmit={handleSubmit} isLoading={isLoading} />
            </div>
          </motion.div>
        </div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-start bg-red-50 border border-red-200 rounded-lg p-4">
              <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 mr-3" />
              <div>
                <h3 className="text-sm font-medium text-red-800">Error Testing URL</h3>
                <p className="mt-1 text-sm text-red-700 whitespace-pre-line">{error}</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Results */}
        {results && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Test Results</h2>
                  <p className="text-sm text-gray-600 mt-1">
                    <a href={results.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                      {results.url}
                    </a>
                  </p>
                </div>
                <button
                  onClick={handleExport}
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 shadow-md rounded-lg transition-all hover:shadow-lg"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export Report
                  <span className={proPillStyle + " ml-2"}>PRO</span>
                </button>
              </div>

              <ResultsSummary results={results} />

              {results.issues.length === 0 && results.warnings.length === 0 ? (
                <div className="text-center py-8 bg-green-50 rounded-xl mt-6">
                  <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                  <h3 className="text-xl font-medium text-gray-900 mb-6">
                    Congratulations! No accessibility issues found
                  </h3>
                  <EmbedBadge url={results.url} timestamp={results.timestamp} />
                </div>
              ) : (
                <div className="mt-6 space-y-4">
                  <div className="flex flex-wrap gap-3">
                    {contrastIssues.length > 0 && (
                      <button
                        onClick={() => setActiveTab('contrast')}
                        className={getTabStyle('contrast')}
                      >
                        <Palette className="w-4 h-4 inline-block mr-2" />
                        Color Contrast ({contrastIssues.length})
                      </button>
                    )}
                    {nonContrastIssues.length > 0 && (
                      <button
                        onClick={() => setActiveTab('issues')}
                        className={getTabStyle('issues')}
                      >
                        Issues ({nonContrastIssues.length})
                      </button>
                    )}
                    {structureIssues.length > 0 && (
                      <button
                        onClick={() => setActiveTab('structure')}
                        className={getTabStyle('structure')}
                      >
                        <Layout className="w-4 h-4 inline-block mr-2" />
                        Structure ({structureIssues.length})
                      </button>
                    )}
                    {responsiveIssues.length > 0 && (
                      <button
                        onClick={() => setActiveTab('responsive')}
                        className={getTabStyle('responsive')}
                      >
                        <Smartphone className="w-4 h-4 inline-block mr-2" />
                        Responsive ({responsiveIssues.length})
                      </button>
                    )}
                    {mediaIssues.length > 0 && (
                      <button
                        onClick={() => setActiveTab('media')}
                        className={getTabStyle('media')}
                      >
                        <Video className="w-4 h-4 inline-block mr-2" />
                        Media ({mediaIssues.length})
                      </button>
                    )}
                    {results.warnings.length > 0 && (
                      <button
                        onClick={() => setActiveTab('warnings')}
                        className={getTabStyle('warnings')}
                      >
                        Warnings ({results.warnings.length})
                      </button>
                    )}
                    {results.passes.length > 0 && (
                      <button
                        onClick={() => setActiveTab('passes')}
                        className={getTabStyle('passes')}
                      >
                        Passed ({results.passes.length})
                      </button>
                    )}
                  </div>

                  <div>
                    {activeTab === 'contrast' && contrastIssues.length > 0 && (
                      <div className="space-y-4">
                        <div className="bg-purple-50 p-4 rounded-lg">
                          <h3 className="text-lg font-semibold text-purple-900 mb-2">
                            Color Contrast Issues
                          </h3>
                          <p className="text-purple-700">
                            WCAG 2.1 and 2.2 require a contrast ratio of at least:
                          </p>
                          <ul className="mt-2 space-y-1 text-purple-700">
                            <li>• 4.5:1 for normal text</li>
                            <li>• 3:1 for large text (18pt or 14pt bold)</li>
                            <li>• 3:1 for graphical objects and user interface components</li>
                            <li>• 3:1 for focus indicators (WCAG 2.2)</li>
                          </ul>
                        </div>
                        <IssuesList issues={contrastIssues} type="issues" />
                      </div>
                    )}
                    {activeTab === 'issues' && nonContrastIssues.length > 0 && (
                      <IssuesList issues={nonContrastIssues} type="issues" />
                    )}
                    {activeTab === 'warnings' && results.warnings.length > 0 && (
                      <IssuesList issues={results.warnings} type="warnings" />
                    )}
                    {activeTab === 'passes' && results.passes.length > 0 && (
                      <IssuesList issues={results.passes} type="passes" />
                    )}
                    {activeTab === 'structure' && structureIssues.length > 0 && (
                      <div className="space-y-4">
                        <div className="bg-blue-50 p-4 rounded-lg">
                          <h3 className="text-lg font-semibold text-blue-900 mb-2">
                            HTML Structure & URL Analysis
                          </h3>
                          <p className="text-blue-700">
                            Analyzing the structural organization of HTML and URLs for usability and accessibility:
                          </p>
                          <ul className="mt-2 space-y-1 text-blue-700">
                            <li>• Proper heading hierarchy (H1, H2, H3, etc.)</li>
                            <li>• Semantic HTML elements usage</li>
                            <li>• Landmark regions and ARIA roles</li>
                            <li>• URL design and readability</li>
                          </ul>
                        </div>
                        <StructureAnalysisPanel issues={structureIssues} />
                      </div>
                    )}
                    {activeTab === 'responsive' && responsiveIssues.length > 0 && (
                      <div className="space-y-4">
                        <div className="bg-teal-50 p-4 rounded-lg">
                          <h3 className="text-lg font-semibold text-teal-900 mb-2">
                            Mobile & Responsive Design Analysis
                          </h3>
                          <p className="text-teal-700">
                            Evaluating mobile accessibility according to WCAG 2.1 and 2.2 standards:
                          </p>
                          <ul className="mt-2 space-y-1 text-teal-700">
                            <li>• Viewport configuration</li>
                            <li>• Touch target sizes (WCAG 2.5.5 AAA & 2.5.8 AA)</li>
                            <li>• Content reflow at 320px (WCAG 1.4.10)</li>
                            <li>• Orientation support (WCAG 1.3.4)</li>
                            <li>• Text spacing adaptability (WCAG 1.4.12)</li>
                          </ul>
                        </div>
                        <ResponsiveAnalysisPanel issues={responsiveIssues} />
                      </div>
                    )}
                    {activeTab === 'media' && mediaIssues.length > 0 && (
                      <div className="space-y-4">
                        <div className="bg-purple-50 p-4 rounded-lg">
                          <h3 className="text-lg font-semibold text-purple-900 mb-2">
                            Media Accessibility Analysis
                          </h3>
                          <p className="text-purple-700">
                            Evaluating audio and video accessibility according to WCAG standards:
                          </p>
                          <ul className="mt-2 space-y-1 text-purple-700">
                            <li>• Captions for video content (WCAG 1.2.2)</li>
                            <li>• Audio descriptions for visual content (WCAG 1.2.3, 1.2.5)</li>
                            <li>• Transcripts for audio-only content (WCAG 1.2.1)</li>
                            <li>• Accessible media controls (WCAG 2.1.1)</li>
                            <li>• Avoiding autoplay with sound (WCAG 1.4.2)</li>
                          </ul>
                        </div>
                        <MediaAnalysisPanel issues={mediaIssues} />
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Features Section - Only show when no results */}
        {!results && (
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <FileSearch className="w-8 h-8 text-blue-600 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Deep Analysis
              </h3>
              <p className="text-gray-600">
                Thorough scanning of HTML, ARIA, and dynamic content
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <Zap className="w-8 h-8 text-blue-600 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                AI-Powered Fixes
              </h3>
              <p className="text-gray-600">
                Get instant suggestions with code examples
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <Globe className="w-8 h-8 text-blue-600 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Global Standards
              </h3>
              <p className="text-gray-600">
                Support for WCAG 2.1 & 2.2, ADA, and Section 508
              </p>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm p-6">
              <Download className="w-8 h-8 text-blue-600 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                PDF Accessibility
              </h3>
              <p className="text-gray-600">
                Test PDFs for tags, reading order, and document structure
              </p>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm p-6">
              <FileText className="w-8 h-8 text-blue-600 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Office Document Testing
              </h3>
              <p className="text-gray-600">
                Check Word, Excel, and PowerPoint files for accessibility
              </p>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm p-6">
              <Video className="w-8 h-8 text-blue-600 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Video Accessibility
              </h3>
              <p className="text-gray-600">
                Check for captions, audio descriptions, and accessible controls
              </p>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm p-6">
              <Headphones className="w-8 h-8 text-blue-600 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Audio Accessibility
              </h3>
              <p className="text-gray-600">
                Verify transcripts and keyboard-accessible audio controls
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <Layout className="w-8 h-8 text-blue-600 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Structure Analysis
              </h3>
              <p className="text-gray-600">
                Evaluate heading hierarchy, semantic elements, and URL design
              </p>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm p-6">
              <Smartphone className="w-8 h-8 text-blue-600 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Responsive Design
              </h3>
              <p className="text-gray-600">
                Check mobile accessibility including touch targets and viewport settings
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}