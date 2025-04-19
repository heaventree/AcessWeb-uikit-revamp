import { useState } from 'react';
import { 
  ChevronDown, 
  ChevronUp, 
  PenTool as Tool, 
  Maximize2, 
  Minimize2, 
  Info, 
  FileText, 
  CheckCircle, 
  Video, 
  Headphones, 
  MonitorSmartphone,
  Zap
} from 'lucide-react';
import toast from 'react-hot-toast';
import type { AccessibilityIssue, WCAGInfo } from '../types';
import { Modal } from './Modal';
import { getWCAGInfo } from '../utils/wcagHelper';
import { AIRecommendations } from './AIRecommendations'; 
import { EmptyState } from './EmptyState';
import { fixEngine } from '../lib/accessibility-fixes';

type ModalView = 'info' | 'fix' | null;

interface IssuesListProps {
  issues: AccessibilityIssue[];
  type?: 'issues' | 'passes' | 'warnings';
}

export function IssuesList({ issues, type = 'issues' }: IssuesListProps) {
  const [expandedIssue, setExpandedIssue] = useState<string | null>(null);
  const [selectedIssue, setSelectedIssue] = useState<AccessibilityIssue | null>(null);
  const [modalView, setModalView] = useState<ModalView>(null);
  
  // For live region announcements
  const [ariaLiveText, setAriaLiveText] = useState<string>('');
  
  // Update live region when expanding/collapsing
  const updateLiveRegion = (action: string, issueName: string) => {
    setAriaLiveText(`${issueName} ${action}`);
    // Clear after announcement
    setTimeout(() => setAriaLiveText(''), 2000);
  };

  const getImpactColor = (impact: AccessibilityIssue['impact']) => {
    if (type === 'passes') return 'bg-emerald-50 border-emerald-200';
    if (type === 'warnings') return 'bg-amber-50 border-amber-200';
    
    switch (impact) {
      case 'critical': return expandedIssue ? 'bg-red-50/80 border-red-400' : 'bg-red-50/80 border-red-300';
      case 'serious': return expandedIssue ? 'bg-orange-50/80 border-orange-400' : 'bg-orange-50/80 border-orange-300';
      case 'moderate': return expandedIssue ? 'bg-yellow-50/80 border-yellow-400' : 'bg-yellow-50/80 border-yellow-300';
      case 'minor': return expandedIssue ? 'bg-blue-50/80 border-blue-400' : 'bg-blue-50/80 border-blue-300';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  const getImpactTagColor = (impact: AccessibilityIssue['impact']) => {
    switch (impact) {
      case 'critical': return 'bg-red-600 text-white';
      case 'serious': return 'bg-orange-500 text-white';
      case 'moderate': return 'bg-yellow-500 text-white';
      case 'minor': return 'bg-blue-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const toggleIssue = (id: string, description: string) => {
    const isExpanding = expandedIssue !== id;
    setExpandedIssue(isExpanding ? id : null);
    updateLiveRegion(isExpanding ? 'expanded' : 'collapsed', description);
  };

  const toggleAllIssues = (shouldExpand: boolean) => {
    setExpandedIssue(shouldExpand ? issues[0]?.id || null : null);
    updateLiveRegion(shouldExpand ? 'all sections expanded' : 'all sections collapsed', '');
  };

  const openIssueDetails = (issue: AccessibilityIssue) => {
    setSelectedIssue(issue);
    setModalView('info');
  };

  const openIssueFix = (issue: AccessibilityIssue) => {
    setSelectedIssue(issue);
    setModalView('fix');
  };

  const closeModal = () => {
    setModalView(null);
    setSelectedIssue(null);
  };

  const getIssueWCAGInfo = (issue: AccessibilityIssue): WCAGInfo | undefined => {
    // Try rule ID first
    if (issue.id) {
      try {
        // First try the rule ID
        if (issue.id) {
          const ruleInfo = getWCAGInfo(issue.id);
          if (ruleInfo) return ruleInfo;
        }

        // Then try each WCAG criteria
        if (issue.wcagCriteria?.length > 0) {
          for (const criteria of issue.wcagCriteria) {
            const criteriaInfo = getWCAGInfo(criteria);
            if (criteriaInfo) return criteriaInfo;
          }
        }
      } catch (error) {
        console.error('Error getting WCAG info:', error);
      }
    }
    
    return undefined;
  };

  if (!issues || issues.length === 0) {
    return (
      <EmptyState
        title={`No ${type} Found`}
        description={type === 'issues' ? 'Great job! No accessibility issues were found.' : `No ${type} to display.`}
        icon={type === 'issues' ? <CheckCircle className="h-6 w-6 text-green-600" /> : undefined}
      />
    );
  }

  return (
    <>
      {/* Hidden live region for screen reader announcements */}
      <div className="sr-only" aria-live="polite">
        {ariaLiveText}
      </div>
      
      <div className="mb-4 flex justify-end gap-2">
        <button
          onClick={() => toggleAllIssues(true)}
          className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          aria-label="Expand all sections"
        >
          <Maximize2 className="w-4 h-4 mr-2" aria-hidden="true" />
          Open All
        </button>
        <button
          onClick={() => toggleAllIssues(false)}
          className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          aria-label="Collapse all sections"
        >
          <Minimize2 className="w-4 h-4 mr-2" aria-hidden="true" />
          Close All
        </button>
      </div>

      <div className="space-y-3">
        {issues.map((issue) => {
          const isExpanded = expandedIssue === issue.id;
          
          return (
            <div
              key={issue.id}
              className={`p-4 rounded-lg border-2 transition-all duration-300 ${
                isExpanded ? `${getImpactColor(issue.impact)} bg-white shadow-md` : getImpactColor(issue.impact)
              }`}
            >
              <div className="flex justify-between items-start">
                <button 
                  className="flex-1 text-left flex items-center transition-colors duration-300"
                  onClick={() => toggleIssue(issue.id, issue.description)}
                  aria-expanded={isExpanded}
                  aria-controls={`issue-content-${issue.id}`}
                >
                  <div className="flex items-center">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {issue.description}
                    </h3>
                    <div className="transform transition-transform duration-300">
                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5 ml-2 text-gray-500" aria-hidden="true" />
                      ) : (
                        <ChevronDown className="w-5 h-5 ml-2 text-gray-500" aria-hidden="true" />
                      )}
                    </div>
                  </div>
                </button>
                {type !== 'passes' && (
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getImpactTagColor(issue.impact)} ml-4 transition-colors duration-300`}
                  >
                    {issue.impact}
                  </span>
                )}
              </div>
              
              <div
                id={`issue-content-${issue.id}`}
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  isExpanded ? 'max-h-[2000px] opacity-100 mt-4' : 'max-h-0 opacity-0'
                }`}
              > 
                  <div className="mb-4">
                    <h4 className="font-medium text-gray-700">Affected Elements:</h4>
                    <ul className="mt-2 space-y-1">
                      {issue.nodes.map((node, index) => (
                        <li key={index} className="text-sm text-gray-600 font-mono bg-white p-3 rounded-lg shadow-sm border border-gray-200">
                          {node}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {issue.wcagCriteria && issue.wcagCriteria.length > 0 && (
                    <div className="mt-4">
                      <h4 className="font-medium text-gray-700">WCAG Criteria:</h4>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {issue.wcagCriteria.map((criteria, index) => (
                          <span
                            key={index}
                            className="px-3 py-1.5 bg-white rounded-full text-sm font-medium text-gray-700 border border-gray-200 shadow-sm"
                          >
                            {criteria}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* PDF-specific information */}
                  {issue.documentType === 'pdf' && issue.documentDetails && (
                    <div className="mt-4 bg-purple-50 p-4 rounded-lg">
                      <div className="flex items-center">
                        <FileText className="w-5 h-5 text-purple-600 mr-2" />
                        <h4 className="font-medium text-purple-800">PDF Document Details</h4>
                      </div>
                      
                      <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {issue.documentDetails.filename && (
                          <div className="bg-white p-3 rounded-md">
                            <p className="text-sm font-medium text-gray-700">Filename</p>
                            <p className="text-sm text-gray-600">{issue.documentDetails.filename}</p>
                          </div>
                        )}
                        
                        {issue.documentDetails.pageCount !== undefined && (
                          <div className="bg-white p-3 rounded-md">
                            <p className="text-sm font-medium text-gray-700">Pages</p>
                            <p className="text-sm text-gray-600">{issue.documentDetails.pageCount}</p>
                          </div>
                        )}
                        
                        <div className="bg-white p-3 rounded-md">
                          <p className="text-sm font-medium text-gray-700">Document Tags</p>
                          <p className="text-sm text-gray-600">
                            {issue.documentDetails.hasTags ? '✅ Present' : '❌ Missing'}
                          </p>
                        </div>
                        
                        <div className="bg-white p-3 rounded-md">
                          <p className="text-sm font-medium text-gray-700">Document Language</p>
                          <p className="text-sm text-gray-600">
                            {issue.documentDetails.hasLanguage ? '✅ Defined' : '❌ Not defined'}
                          </p>
                        </div>
                        
                        <div className="bg-white p-3 rounded-md">
                          <p className="text-sm font-medium text-gray-700">Structure</p>
                          <p className="text-sm text-gray-600">
                            {issue.documentDetails.hasStructure ? '✅ Proper' : '❌ Missing/Incorrect'}
                          </p>
                        </div>
                        
                        <div className="bg-white p-3 rounded-md">
                          <p className="text-sm font-medium text-gray-700">Reading Order</p>
                          <p className="text-sm text-gray-600">
                            {issue.documentDetails.readingOrder ? '✅ Logical' : '❌ Problematic'}
                          </p>
                        </div>
                        
                        <div className="bg-white p-3 rounded-md">
                          <p className="text-sm font-medium text-gray-700">Alternative Text</p>
                          <p className="text-sm text-gray-600">
                            {issue.documentDetails.hasAltText ? '✅ Present' : '❌ Missing'}
                          </p>
                        </div>
                        
                        {issue.documentDetails.formAccessibility !== undefined && (
                          <div className="bg-white p-3 rounded-md">
                            <p className="text-sm font-medium text-gray-700">Form Accessibility</p>
                            <p className="text-sm text-gray-600">
                              {issue.documentDetails.formAccessibility ? '✅ Accessible' : '❌ Not accessible'}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {/* Media-specific information */}
                  {issue.mediaType && issue.mediaDetails && (
                    <div className="mt-4 bg-indigo-50 p-4 rounded-lg">
                      <div className="flex items-center">
                        {issue.mediaType === 'audio' ? (
                          <Headphones className="w-5 h-5 text-indigo-600 mr-2" />
                        ) : issue.mediaType === 'video' ? (
                          <Video className="w-5 h-5 text-indigo-600 mr-2" />
                        ) : (
                          <MonitorSmartphone className="w-5 h-5 text-indigo-600 mr-2" />
                        )}
                        <h4 className="font-medium text-indigo-800">
                          {issue.mediaType === 'audio' ? 'Audio' : 
                           issue.mediaType === 'video' ? 'Video' : 
                           'Embedded Media'} Details
                        </h4>
                      </div>
                      
                      <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {issue.mediaDetails.source && (
                          <div className="bg-white p-3 rounded-md">
                            <p className="text-sm font-medium text-gray-700">Source</p>
                            <p className="text-sm text-gray-600 truncate">{issue.mediaDetails.source}</p>
                          </div>
                        )}
                        
                        {issue.mediaDetails.playerType && (
                          <div className="bg-white p-3 rounded-md">
                            <p className="text-sm font-medium text-gray-700">Player Type</p>
                            <p className="text-sm text-gray-600">{issue.mediaDetails.playerType}</p>
                          </div>
                        )}
                        
                        {issue.mediaDetails.duration !== undefined && (
                          <div className="bg-white p-3 rounded-md">
                            <p className="text-sm font-medium text-gray-700">Duration</p>
                            <p className="text-sm text-gray-600">{issue.mediaDetails.duration}s</p>
                          </div>
                        )}
                        
                        {issue.mediaDetails.format && (
                          <div className="bg-white p-3 rounded-md">
                            <p className="text-sm font-medium text-gray-700">Format</p>
                            <p className="text-sm text-gray-600">{issue.mediaDetails.format}</p>
                          </div>
                        )}
                        
                        {issue.mediaDetails.hasCaptions !== undefined && (
                          <div className="bg-white p-3 rounded-md">
                            <p className="text-sm font-medium text-gray-700">Captions</p>
                            <p className="text-sm text-gray-600">
                              {issue.mediaDetails.hasCaptions ? '✅ Present' : '❌ Missing'}
                            </p>
                          </div>
                        )}
                        
                        {issue.mediaDetails.hasTranscript !== undefined && (
                          <div className="bg-white p-3 rounded-md">
                            <p className="text-sm font-medium text-gray-700">Transcript</p>
                            <p className="text-sm text-gray-600">
                              {issue.mediaDetails.hasTranscript ? '✅ Present' : '❌ Missing'}
                            </p>
                          </div>
                        )}
                        
                        {issue.mediaDetails.hasAudioDescription !== undefined && (
                          <div className="bg-white p-3 rounded-md">
                            <p className="text-sm font-medium text-gray-700">Audio Description</p>
                            <p className="text-sm text-gray-600">
                              {issue.mediaDetails.hasAudioDescription ? '✅ Present' : '❌ Missing'}
                            </p>
                          </div>
                        )}
                        
                        {issue.mediaDetails.hasAccessibleControls !== undefined && (
                          <div className="bg-white p-3 rounded-md">
                            <p className="text-sm font-medium text-gray-700">Accessible Controls</p>
                            <p className="text-sm text-gray-600">
                              {issue.mediaDetails.hasAccessibleControls ? '✅ Present' : '❌ Missing'}
                            </p>
                          </div>
                        )}
                        
                        {issue.mediaDetails.keyboardAccessible !== undefined && (
                          <div className="bg-white p-3 rounded-md">
                            <p className="text-sm font-medium text-gray-700">Keyboard Accessible</p>
                            <p className="text-sm text-gray-600">
                              {issue.mediaDetails.keyboardAccessible ? '✅ Yes' : '❌ No'}
                            </p>
                          </div>
                        )}
                        
                        {issue.mediaDetails.autoplay !== undefined && (
                          <div className="bg-white p-3 rounded-md">
                            <p className="text-sm font-medium text-gray-700">Autoplay</p>
                            <p className="text-sm text-gray-600">
                              {issue.mediaDetails.autoplay ? '⚠️ Enabled' : '✅ Disabled'}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {type !== 'passes' && (
                    <>
                      <div className="mt-4 flex gap-2 flex-wrap">
                        <button
                          onClick={() => openIssueFix(issue)}
                          className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-700 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors border border-blue-200 shadow-sm"
                          aria-label={`View fix for ${issue.description}`}
                        >
                          <Tool className="w-4 h-4 mr-2" aria-hidden="true" />
                          View Fix
                        </button>
                        <button
                          onClick={() => openIssueDetails(issue)}
                          className="inline-flex items-center px-4 py-2 text-sm font-medium text-purple-700 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors border border-purple-200 shadow-sm"
                          aria-label={`Learn more about ${issue.description}`}
                        >
                          <Info className="w-4 h-4 mr-2" aria-hidden="true" />
                          Learn More
                        </button>
                        <button
                          onClick={() => {
                            // Get the currently selected site from the app context
                            // This would typically come from a context or state
                            const selectedSite = {
                              id: 'current-site',
                              url: window.location.origin,
                              platform: 'wordpress' as const,
                              name: 'Current Site',
                              metadata: {}
                            };
                            
                            try {
                              // Sanitize the target selector to make it safe
                              const sanitizeSelector = (selector: string) => {
                                return selector
                                  .replace(/[^\w\s\-_.#[\]='"]/g, '')  // Remove potentially unsafe characters
                                  .trim() || 'body';  // Default to body if empty after sanitizing
                              };
                              
                              fixEngine.applyFix(selectedSite, {
                                id: issue.id,
                                targetSelector: sanitizeSelector(issue.nodes[0] || 'body'),
                                cssProperties: [
                                  { name: 'outline', value: '2px solid red' },
                                  { name: 'position', value: 'relative' }
                                ],
                                wcagCriteria: issue.wcagCriteria && issue.wcagCriteria.length > 0 
                                  ? issue.wcagCriteria 
                                  : ['1.4.3'], // Default to contrast ratio if none specified
                                description: `Fix for: ${issue.description}`,
                                createdAt: new Date().toISOString(),
                                metadata: {
                                  issueId: issue.id,
                                  impact: issue.impact || 'moderate',
                                  nodes: issue.nodes
                                }
                              }).then(result => {
                                if (result.success) {
                                  toast.success(`Successfully applied fix for "${issue.description}"`);
                                } else {
                                  toast.error(`Failed to apply fix: ${result.error}`);
                                }
                              });
                            } catch (error) {
                              console.error('Error applying fix:', error);
                              toast.error('An error occurred while applying the fix');
                            }
                          }}
                          className="inline-flex items-center px-4 py-2 text-sm font-medium text-green-700 bg-green-50 rounded-lg hover:bg-green-100 transition-colors border border-green-200 shadow-sm"
                          aria-label={`Apply fix for ${issue.description}`}
                        >
                          <Zap className="w-4 h-4 mr-2" aria-hidden="true" />
                          Apply Fix
                          <span className="ml-2 px-1.5 py-0.5 text-xs font-semibold bg-yellow-400 text-green-800 rounded">PRO</span>
                        </button>
                      </div>
                      
                      <AIRecommendations issue={issue} />
                    </>
                  )}
              </div>
            </div>
          );
        })}
      </div>

      <Modal
        isOpen={modalView !== null}
        onClose={closeModal}
        title={modalView === 'fix' ? 'How to Fix This Issue' : 'Issue Information'}
      >
        {selectedIssue && (
          <div className="space-y-6">
            {modalView === 'info' ? (
              <>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Issue Description</h4>
                  <p className="text-gray-600">{selectedIssue.description}</p>
                </div>

                {selectedIssue.wcagCriteria && selectedIssue.wcagCriteria.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">WCAG Criteria</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedIssue.wcagCriteria.map((criteria, index) => (
                        <span
                          key={index}
                          className="px-2.5 py-1 bg-purple-50 text-purple-700 rounded-full text-sm font-medium"
                        >
                          {criteria}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Affected Elements</h4>
                  <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                    {selectedIssue.nodes.map((node, index) => (
                      <pre key={index} className="text-sm text-gray-600 font-mono overflow-x-auto">
                        {node}
                      </pre>
                    ))}
                  </div>
                </div>
                
                {/* PDF document details in modal */}
                {selectedIssue.documentType === 'pdf' && selectedIssue.documentDetails && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">PDF Document Details</h4>
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <div className="flex items-center mb-3">
                        <FileText className="w-5 h-5 text-purple-600 mr-2" />
                        {selectedIssue.documentDetails.filename && (
                          <span className="text-sm font-medium text-purple-800">
                            {selectedIssue.documentDetails.filename}
                            {selectedIssue.documentDetails.pageCount && 
                              ` (${selectedIssue.documentDetails.pageCount} pages)`
                            }
                          </span>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="bg-white p-3 rounded-md">
                          <p className="text-sm font-medium text-gray-700">Document Tags</p>
                          <p className="text-sm text-gray-600">
                            {selectedIssue.documentDetails.hasTags ? '✅ Present' : '❌ Missing'}
                          </p>
                        </div>
                        
                        <div className="bg-white p-3 rounded-md">
                          <p className="text-sm font-medium text-gray-700">Document Language</p>
                          <p className="text-sm text-gray-600">
                            {selectedIssue.documentDetails.hasLanguage ? '✅ Defined' : '❌ Not defined'}
                          </p>
                        </div>
                        
                        <div className="bg-white p-3 rounded-md">
                          <p className="text-sm font-medium text-gray-700">Structure</p>
                          <p className="text-sm text-gray-600">
                            {selectedIssue.documentDetails.hasStructure ? '✅ Proper' : '❌ Missing/Incorrect'}
                          </p>
                        </div>
                        
                        <div className="bg-white p-3 rounded-md">
                          <p className="text-sm font-medium text-gray-700">Reading Order</p>
                          <p className="text-sm text-gray-600">
                            {selectedIssue.documentDetails.readingOrder ? '✅ Logical' : '❌ Problematic'}
                          </p>
                        </div>
                        
                        <div className="bg-white p-3 rounded-md">
                          <p className="text-sm font-medium text-gray-700">Alternative Text</p>
                          <p className="text-sm text-gray-600">
                            {selectedIssue.documentDetails.hasAltText ? '✅ Present' : '❌ Missing'}
                          </p>
                        </div>
                        
                        {selectedIssue.documentDetails.formAccessibility !== undefined && (
                          <div className="bg-white p-3 rounded-md">
                            <p className="text-sm font-medium text-gray-700">Form Accessibility</p>
                            <p className="text-sm text-gray-600">
                              {selectedIssue.documentDetails.formAccessibility ? '✅ Accessible' : '❌ Not accessible'}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Media details in modal */}
                {selectedIssue.mediaType && selectedIssue.mediaDetails && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">
                      {selectedIssue.mediaType === 'audio' ? 'Audio' : 
                      selectedIssue.mediaType === 'video' ? 'Video' : 
                      'Embedded Media'} Details
                    </h4>
                    <div className="bg-indigo-50 p-4 rounded-lg">
                      <div className="flex items-center mb-3">
                        {selectedIssue.mediaType === 'audio' ? (
                          <Headphones className="w-5 h-5 text-indigo-600 mr-2" />
                        ) : selectedIssue.mediaType === 'video' ? (
                          <Video className="w-5 h-5 text-indigo-600 mr-2" />
                        ) : (
                          <MonitorSmartphone className="w-5 h-5 text-indigo-600 mr-2" />
                        )}
                        {selectedIssue.mediaDetails.playerType && (
                          <span className="text-sm font-medium text-indigo-800">
                            {selectedIssue.mediaDetails.playerType}
                            {selectedIssue.mediaType === 'video' ? ' Video Player' : 
                             selectedIssue.mediaType === 'audio' ? ' Audio Player' : 
                             ' Player'}
                          </span>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {selectedIssue.mediaDetails.source && (
                          <div className="bg-white p-3 rounded-md">
                            <p className="text-sm font-medium text-gray-700">Source</p>
                            <p className="text-sm text-gray-600 truncate">{selectedIssue.mediaDetails.source}</p>
                          </div>
                        )}
                        
                        {selectedIssue.mediaDetails.hasCaptions !== undefined && (
                          <div className="bg-white p-3 rounded-md">
                            <p className="text-sm font-medium text-gray-700">Captions</p>
                            <p className="text-sm text-gray-600">
                              {selectedIssue.mediaDetails.hasCaptions ? '✅ Present' : '❌ Missing'}
                            </p>
                          </div>
                        )}
                        
                        {selectedIssue.mediaDetails.hasTranscript !== undefined && (
                          <div className="bg-white p-3 rounded-md">
                            <p className="text-sm font-medium text-gray-700">Transcript</p>
                            <p className="text-sm text-gray-600">
                              {selectedIssue.mediaDetails.hasTranscript ? '✅ Present' : '❌ Missing'}
                            </p>
                          </div>
                        )}
                        
                        {selectedIssue.mediaDetails.hasAudioDescription !== undefined && (
                          <div className="bg-white p-3 rounded-md">
                            <p className="text-sm font-medium text-gray-700">Audio Description</p>
                            <p className="text-sm text-gray-600">
                              {selectedIssue.mediaDetails.hasAudioDescription ? '✅ Present' : '❌ Missing'}
                            </p>
                          </div>
                        )}
                        
                        {selectedIssue.mediaDetails.hasAccessibleControls !== undefined && (
                          <div className="bg-white p-3 rounded-md">
                            <p className="text-sm font-medium text-gray-700">Accessible Controls</p>
                            <p className="text-sm text-gray-600">
                              {selectedIssue.mediaDetails.hasAccessibleControls ? '✅ Present' : '❌ Missing'}
                            </p>
                          </div>
                        )}
                        
                        {selectedIssue.mediaDetails.keyboardAccessible !== undefined && (
                          <div className="bg-white p-3 rounded-md">
                            <p className="text-sm font-medium text-gray-700">Keyboard Accessible</p>
                            <p className="text-sm text-gray-600">
                              {selectedIssue.mediaDetails.keyboardAccessible ? '✅ Yes' : '❌ No'}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <>
                {(() => {
                  const wcagInfo = getIssueWCAGInfo(selectedIssue);
                  return (
                    <div>
                      <>
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Success Criteria</h4>
                          <p className="text-gray-600 mb-6">
                            {wcagInfo?.successCriteria || 'Please refer to the WCAG documentation for this criterion.'}
                          </p>
                        </div>
                        
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Suggested Fix</h4>
                          <div className="bg-gray-50 p-4 rounded-lg">
                            {selectedIssue.documentType === 'pdf' ? (
                              <div>
                                <h5 className="font-medium text-purple-800 mb-2">PDF Accessibility Improvement</h5>
                                <ul className="list-disc list-inside space-y-2 text-gray-600">
                                  {!selectedIssue.documentDetails?.hasStructure && (
                                    <li>
                                      <strong>Add document structure:</strong> Use Adobe Acrobat Pro or similar professional 
                                      tools to add proper document structure. Add tags to define headings, paragraphs, lists, 
                                      tables, and other content elements.
                                    </li>
                                  )}
                                  {!selectedIssue.documentDetails?.hasLanguage && (
                                    <li>
                                      <strong>Define document language:</strong> Set the document language in the document 
                                      properties to ensure proper pronunciation by screen readers.
                                    </li>
                                  )}
                                  {!selectedIssue.documentDetails?.hasAltText && (
                                    <li>
                                      <strong>Add alternative text:</strong> Provide descriptive alternative text for all 
                                      images, figures, and graphics in the document.
                                    </li>
                                  )}
                                  {!selectedIssue.documentDetails?.readingOrder && (
                                    <li>
                                      <strong>Fix reading order:</strong> Ensure the reading order matches the visual 
                                      order of content using the Order panel in Acrobat Pro.
                                    </li>
                                  )}
                                  {!selectedIssue.documentDetails?.hasTags && (
                                    <li>
                                      <strong>Add document tags:</strong> Make sure all content is properly tagged 
                                      to ensure screen readers can interpret the document structure.
                                    </li>
                                  )}
                                  {selectedIssue.documentDetails?.formAccessibility === false && (
                                    <li>
                                      <strong>Make forms accessible:</strong> Ensure all form fields have proper labels 
                                      and instructions that screen readers can interpret.
                                    </li>
                                  )}
                                </ul>
                                <p className="mt-4 text-purple-700">
                                  For comprehensive PDF remediation, we recommend using Adobe Acrobat Pro DC, CommonLook, 
                                  or other specialized PDF accessibility tools.
                                </p>
                              </div>
                            ) : selectedIssue.mediaType ? (
                              <div>
                                <h5 className="font-medium text-indigo-800 mb-2">
                                  {selectedIssue.mediaType === 'audio' ? 'Audio' : 
                                   selectedIssue.mediaType === 'video' ? 'Video' : 
                                   'Embedded Media'} Accessibility Improvement
                                </h5>
                                <ul className="list-disc list-inside space-y-2 text-gray-600">
                                  {selectedIssue.mediaType === 'video' && selectedIssue.mediaDetails?.hasCaptions === false && (
                                    <li>
                                      <strong>Add captions:</strong> Provide synchronized captions for all video content. 
                                      Captions should include dialogue and important sound effects.
                                    </li>
                                  )}
                                  {(selectedIssue.mediaType === 'audio' || selectedIssue.mediaType === 'video') && 
                                   selectedIssue.mediaDetails?.hasTranscript === false && (
                                    <li>
                                      <strong>Provide a transcript:</strong> Include a text transcript that contains all 
                                      spoken information and relevant non-speech sounds from the {selectedIssue.mediaType}.
                                    </li>
                                  )}
                                  {selectedIssue.mediaType === 'video' && selectedIssue.mediaDetails?.hasAudioDescription === false && (
                                    <li>
                                      <strong>Add audio descriptions:</strong> Include audio descriptions for important 
                                      visual content that is not conveyed through the main audio track.
                                    </li>
                                  )}
                                  {selectedIssue.mediaDetails?.hasAccessibleControls === false && (
                                    <li>
                                      <strong>Ensure accessible controls:</strong> Media player controls must be accessible 
                                      with keyboard navigation and properly labeled for screen readers.
                                    </li>
                                  )}
                                  {selectedIssue.mediaDetails?.keyboardAccessible === false && (
                                    <li>
                                      <strong>Make it keyboard accessible:</strong> Ensure all player functionality is 
                                      operable through a keyboard, including play, pause, volume, and seeking controls.
                                    </li>
                                  )}
                                  {selectedIssue.mediaDetails?.autoplay === true && (
                                    <li>
                                      <strong>Disable autoplay:</strong> Avoid automatically playing media content, or provide 
                                      a way to pause, stop, or mute it within 3 seconds of starting.
                                    </li>
                                  )}
                                </ul>
                                <p className="mt-4 text-indigo-700">
                                  For {selectedIssue.mediaType === 'video' ? 'video' : 'audio'} content, use players that 
                                  support accessibility features like {selectedIssue.mediaType === 'video' ? 'captions, audio descriptions,' : ''} 
                                  keyboard controls, and screen reader compatibility.
                                </p>
                              </div>
                            ) : (
                              <p className="text-gray-600 whitespace-pre-line">
                                {wcagInfo?.suggestedFix || selectedIssue.fixSuggestion || 
                                  'Please refer to the WCAG documentation for fixing this issue.'}
                              </p>
                            )}
                          </div>
                        </div>
                        
                        {wcagInfo?.codeExample && !selectedIssue.documentType && (
                          <div className="mt-4">
                            <h4 className="font-medium text-gray-900 mb-2">Code Example</h4>
                            <pre className="bg-gray-800 text-white p-4 rounded-lg text-sm font-mono overflow-x-auto">
                              {wcagInfo.codeExample}
                            </pre>
                          </div>
                        )}
                        
                        {selectedIssue.documentType === 'pdf' && (
                          <div className="mt-4">
                            <h4 className="font-medium text-gray-900 mb-2">Resources</h4>
                            <ul className="list-disc list-inside space-y-1 text-gray-600">
                              <li>
                                <a 
                                  href="https://www.adobe.com/accessibility/pdf/pdf-accessibility-overview.html" 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="text-blue-600 hover:underline"
                                >
                                  Adobe PDF Accessibility Overview
                                </a>
                              </li>
                              <li>
                                <a 
                                  href="https://www.w3.org/TR/WCAG-TECHS/pdf.html" 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="text-blue-600 hover:underline"
                                >
                                  W3C PDF Techniques for WCAG 2.0
                                </a>
                              </li>
                              <li>
                                <a 
                                  href="https://www.section508.gov/create/pdfs/" 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="text-blue-600 hover:underline"
                                >
                                  Section508.gov PDF Accessibility Guidance
                                </a>
                              </li>
                            </ul>
                          </div>
                        )}
                        
                        {selectedIssue.mediaType && (
                          <div className="mt-4">
                            <h4 className="font-medium text-gray-900 mb-2">Resources</h4>
                            <ul className="list-disc list-inside space-y-1 text-gray-600">
                              {selectedIssue.mediaType === 'video' && (
                                <>
                                  <li>
                                    <a 
                                      href="https://www.w3.org/WAI/media/av/" 
                                      target="_blank" 
                                      rel="noopener noreferrer"
                                      className="text-blue-600 hover:underline"
                                    >
                                      W3C Web Accessibility Initiative - Media Accessibility
                                    </a>
                                  </li>
                                  <li>
                                    <a 
                                      href="https://www.w3.org/WAI/WCAG21/Understanding/captions-prerecorded.html" 
                                      target="_blank" 
                                      rel="noopener noreferrer"
                                      className="text-blue-600 hover:underline"
                                    >
                                      Understanding WCAG 1.2.2: Captions (Prerecorded)
                                    </a>
                                  </li>
                                  <li>
                                    <a 
                                      href="https://www.w3.org/WAI/WCAG21/Understanding/audio-description-or-media-alternative-prerecorded.html" 
                                      target="_blank" 
                                      rel="noopener noreferrer"
                                      className="text-blue-600 hover:underline"
                                    >
                                      Understanding WCAG 1.2.3: Audio Description
                                    </a>
                                  </li>
                                </>
                              )}
                              
                              {selectedIssue.mediaType === 'audio' && (
                                <>
                                  <li>
                                    <a 
                                      href="https://www.w3.org/WAI/WCAG21/Understanding/audio-only-and-video-only-prerecorded.html" 
                                      target="_blank" 
                                      rel="noopener noreferrer"
                                      className="text-blue-600 hover:underline"
                                    >
                                      Understanding WCAG 1.2.1: Audio-only and Video-only (Prerecorded)
                                    </a>
                                  </li>
                                  <li>
                                    <a 
                                      href="https://www.w3.org/TR/WCAG20-TECHS/G158.html" 
                                      target="_blank" 
                                      rel="noopener noreferrer"
                                      className="text-blue-600 hover:underline"
                                    >
                                      G158: Providing an alternative for time-based media for audio-only content
                                    </a>
                                  </li>
                                </>
                              )}
                              
                              {selectedIssue.mediaType === 'embedded' && (
                                <>
                                  <li>
                                    <a 
                                      href="https://www.w3.org/WAI/media/av/planning/" 
                                      target="_blank" 
                                      rel="noopener noreferrer"
                                      className="text-blue-600 hover:underline"
                                    >
                                      Planning Media Accessibility
                                    </a>
                                  </li>
                                  <li>
                                    <a 
                                      href="https://www.w3.org/WAI/WCAG21/Understanding/name-role-value.html" 
                                      target="_blank" 
                                      rel="noopener noreferrer"
                                      className="text-blue-600 hover:underline"
                                    >
                                      Understanding WCAG 4.1.2: Name, Role, Value
                                    </a>
                                  </li>
                                </>
                              )}
                              
                              <li>
                                <a 
                                  href="https://www.w3.org/WAI/WCAG21/Understanding/audio-control.html" 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="text-blue-600 hover:underline"
                                >
                                  Understanding WCAG 1.4.2: Audio Control
                                </a>
                              </li>
                              <li>
                                <a 
                                  href="https://www.w3.org/WAI/WCAG21/Understanding/keyboard.html" 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="text-blue-600 hover:underline"
                                >
                                  Understanding WCAG 2.1.1: Keyboard
                                </a>
                              </li>
                            </ul>
                          </div>
                        )}
                      </>
                    </div>
                  );
                })()}
              </>
            )}
          </div>
        )}
      </Modal>
    </>
  );
}