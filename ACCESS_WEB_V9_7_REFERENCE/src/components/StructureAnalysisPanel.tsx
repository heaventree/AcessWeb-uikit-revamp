import { useState } from 'react';
import {
  ChevronDown,
  ChevronUp,
  Code,
  Layout,
  Link2,
  Heading1,
  MousePointer2,
  Zap
} from 'lucide-react';
import type { AccessibilityIssue } from '../types';
import { AIRecommendations } from './AIRecommendations';
import { fixEngine } from '../lib/accessibility-fixes';

interface StructureAnalysisPanelProps {
  issues: AccessibilityIssue[];
}

function getImpactColor(impact: string): string {
  switch (impact) {
    case 'critical':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
    case 'serious':
      return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
    case 'moderate':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
    case 'minor':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
  }
}

function getSubtleBackgroundColor(issue: AccessibilityIssue): string {
  if (issue.structureType === 'heading' || issue.id.includes('heading') || issue.id === 'multiple-h1') {
    return 'bg-amber-50 dark:bg-amber-900/10';
  }
  
  if (issue.structureType === 'semantic' || issue.structureType === 'landmark') {
    return 'bg-indigo-50 dark:bg-indigo-900/10';
  }
  
  if (issue.structureType === 'url' || issue.id === 'url-design') {
    return 'bg-blue-50 dark:bg-blue-900/10';
  }
  
  if (issue.structureType === 'navigation') {
    return 'bg-purple-50 dark:bg-purple-900/10';
  }
  
  return 'bg-gray-50 dark:bg-gray-800';
}

function getStatusLabel(issue: AccessibilityIssue): string {
  switch (issue.impact) {
    case 'critical':
      return 'Critical';
    case 'serious':
      return 'Needs Attention';
    case 'moderate':
      return 'Review';
    case 'minor':
      return 'Consider';
    default:
      return 'Check';
  }
}

function getStatusLabelStyle(issue: AccessibilityIssue): string {
  switch (issue.impact) {
    case 'critical':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
    case 'serious':
      return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
    case 'moderate':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
    case 'minor':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
  }
}

export function StructureAnalysisPanel({ issues }: StructureAnalysisPanelProps) {
  const [expandedIssues, setExpandedIssues] = useState<Set<string>>(new Set());

  // Filter for structure-specific issues
  const structureIssues = issues.filter(issue => 
    issue.structureType || 
    issue.id.includes('heading') || 
    issue.id.includes('landmark') || 
    issue.id.includes('semantic') ||
    issue.id.includes('url') ||
    issue.id === 'page-has-heading-one' ||
    issue.id === 'multiple-h1'
  );

  const headingIssues = structureIssues.filter(issue => 
    issue.structureType === 'heading' || 
    issue.id.includes('heading') || 
    issue.id === 'page-has-heading-one' ||
    issue.id === 'multiple-h1'
  );

  const semanticIssues = structureIssues.filter(issue => 
    issue.structureType === 'semantic' || 
    issue.structureType === 'landmark' || 
    issue.id.includes('landmark') || 
    issue.id.includes('semantic')
  );

  const urlIssues = structureIssues.filter(issue => 
    issue.structureType === 'url' || 
    issue.id === 'url-design'
  );

  const navigationIssues = structureIssues.filter(issue => 
    issue.structureType === 'navigation'
  );

  const toggleIssue = (id: string) => {
    setExpandedIssues(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  if (structureIssues.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6 dark:bg-gray-800">
        <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          HTML Structure & URL Analysis
        </h2>
        <div className="flex flex-col items-center justify-center text-center p-8">
          <Layout className="h-12 w-12 text-gray-400 mb-3" />
          <p className="text-gray-600 dark:text-gray-300 mb-1">
            No structure or URL issues were detected.
          </p>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            The page has proper HTML structure and semantic elements.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow dark:bg-gray-800">
      <div className="p-6">
        <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          HTML Structure & URL Analysis
        </h2>

        <div className="mb-4 text-sm">
          <p className="text-gray-600 dark:text-gray-300 mb-2">
            This analysis examines the structure of the HTML document and URL design for accessibility and usability.
          </p>
          <div className="grid grid-cols-2 gap-4 mt-3 mb-6 md:grid-cols-4">
            <StructureCounter 
              count={headingIssues.length} 
              label="Heading Issues" 
              icon={<Heading1 className="h-5 w-5 mr-2 text-amber-600" />} 
            />
            <StructureCounter 
              count={semanticIssues.length} 
              label="Semantic Issues" 
              icon={<Code className="h-5 w-5 mr-2 text-indigo-600" />} 
            />
            <StructureCounter 
              count={urlIssues.length} 
              label="URL Issues" 
              icon={<Link2 className="h-5 w-5 mr-2 text-blue-600" />} 
            />
            <StructureCounter 
              count={navigationIssues.length} 
              label="Navigation Issues" 
              icon={<MousePointer2 className="h-5 w-5 mr-2 text-purple-600" />} 
            />
          </div>
        </div>

        <div className="space-y-4">
          {structureIssues.map(issue => (
            <div key={issue.id + structureIssues.indexOf(issue)} className="border rounded-lg overflow-hidden dark:border-gray-700">
              <div 
                className={`p-4 flex justify-between items-center cursor-pointer ${getSubtleBackgroundColor(issue)}`}
                onClick={() => toggleIssue(issue.id + structureIssues.indexOf(issue))}
              >
                <div className="flex items-center">
                  {getIconForIssue(issue)}
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-gray-900 dark:text-white">
                        {getIssueTitle(issue)}
                      </h3>
                      <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusLabelStyle(issue)}`}>
                        {getStatusLabel(issue)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {issue.description}
                    </p>
                  </div>
                </div>
                <div className="text-gray-400 ml-4">
                  {expandedIssues.has(issue.id + structureIssues.indexOf(issue)) ? (
                    <ChevronUp className="h-5 w-5" />
                  ) : (
                    <ChevronDown className="h-5 w-5" />
                  )}
                </div>
              </div>
              
              {expandedIssues.has(issue.id + structureIssues.indexOf(issue)) && (
                <div className="p-4 bg-white dark:bg-gray-900 border-t dark:border-gray-700">
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Issue Details
                    </h4>
                    <div className="bg-gray-50 dark:bg-gray-800 rounded p-3 text-sm font-mono whitespace-pre-wrap overflow-x-auto">
                      {issue.nodes.map((node, index) => (
                        <div key={index} className="mb-2">
                          {node}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Impact
                      </h4>
                      <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getImpactColor(issue.impact)}`}>
                        {issue.impact.charAt(0).toUpperCase() + issue.impact.slice(1)}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        WCAG Criteria
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {issue.wcagCriteria.map(criteria => (
                          <span 
                            key={criteria} 
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                          >
                            {criteria}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  {issue.fixSuggestion && (
                    <div className="mt-4">
                      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        How to Fix
                      </h4>
                      <div className="bg-green-50 dark:bg-green-900/20 rounded p-3 text-sm text-green-800 dark:text-green-200">
                        {issue.fixSuggestion}
                      </div>
                    </div>
                  )}
                  
                  {issue.structureDetails?.suggestedStructure && (
                    <div className="mt-4">
                      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Suggested Structure
                      </h4>
                      <div className="bg-gray-50 dark:bg-gray-800 rounded p-3 text-sm font-mono whitespace-pre-wrap overflow-x-auto">
                        {issue.structureDetails.suggestedStructure}
                      </div>
                    </div>
                  )}
                  
                  {/* Auto-fix button for Pro users */}
                  {issue.fixSuggestion && (
                    <div className="mt-6 flex items-center space-x-4">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          // Apply auto-fix using the fix engine
                          try {
                            const sanitizeSelector = (selector: string) => {
                              return selector
                                .replace(/[^\w\s\-_.#[\]='"]/g, '')  // Remove potentially unsafe characters
                                .trim() || 'body';  // Default to body if empty after sanitizing
                            };
                            
                            fixEngine.applyFix({
                              id: 'current-page',
                              url: window.location.href,
                              name: 'Current Page',
                              platform: 'generic',
                              metadata: {}
                            }, {
                              id: issue.id,
                              targetSelector: sanitizeSelector(issue.nodes[0] || 'body'),
                              cssProperties: [
                                { name: 'outline', value: '2px solid #4a90e2' },
                                { name: 'position', value: 'relative' }
                              ],
                              wcagCriteria: issue.wcagCriteria || ['1.3.1'],
                              description: `Structure fix for ${issue.id}: ${issue.description}`,
                              createdAt: new Date().toISOString(),
                              metadata: {
                                fixType: 'structure',
                                elementType: issue.structureType || 'generic',
                                suggestion: issue.structureDetails?.suggestedStructure || issue.fixSuggestion
                              }
                            });
                            
                            // Show success message or visual indication
                            alert('Fix applied! Refresh to see changes.');
                          } catch (error) {
                            console.error('Error applying fix:', error);
                            alert('Could not apply fix. See console for details.');
                          }
                        }}
                        className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors"
                      >
                        <Zap className="w-4 h-4 mr-2" />
                        Auto-Fix Issue
                        <span className="ml-2 px-1.5 py-0.5 text-xs font-semibold bg-yellow-400 text-green-800 rounded">PRO</span>
                      </button>
                    </div>
                  )}
                  
                  {/* AI Recommendations */}
                  <AIRecommendations issue={issue} />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

interface StructureCounterProps {
  count: number;
  label: string;
  icon: React.ReactNode;
}

function StructureCounter({ count, label, icon }: StructureCounterProps) {
  return (
    <div className="flex flex-col items-center bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
      <div className="flex items-center mb-1">
        {icon}
        <span className="text-xl font-semibold">{count}</span>
      </div>
      <span className="text-xs text-gray-500 dark:text-gray-400 text-center">{label}</span>
    </div>
  );
}

function getIconForIssue(issue: AccessibilityIssue) {
  if (issue.structureType === 'heading' || issue.id.includes('heading') || issue.id === 'multiple-h1') {
    return <Heading1 className="h-5 w-5 mr-3 text-amber-600" />;
  }
  
  if (issue.structureType === 'semantic' || issue.structureType === 'landmark') {
    return <Code className="h-5 w-5 mr-3 text-indigo-600" />;
  }
  
  if (issue.structureType === 'url' || issue.id === 'url-design') {
    return <Link2 className="h-5 w-5 mr-3 text-blue-600" />;
  }
  
  if (issue.structureType === 'navigation') {
    return <MousePointer2 className="h-5 w-5 mr-3 text-purple-600" />;
  }
  
  return <Layout className="h-5 w-5 mr-3 text-gray-500" />;
}

function getIssueTitle(issue: AccessibilityIssue): string {
  if (issue.id === 'multiple-h1') {
    return 'Multiple H1 Headings Detected';
  }
  
  if (issue.id === 'heading-order') {
    return 'Improper Heading Hierarchy';
  }
  
  if (issue.id === 'skipped-heading-level') {
    return 'Skipped Heading Level';
  }
  
  if (issue.id === 'missing-main-landmark') {
    return 'Missing Main Landmark';
  }
  
  if (issue.id === 'unsemantic-navigation') {
    return 'Non-Semantic Navigation';
  }
  
  if (issue.id === 'unsemantic-list') {
    return 'Non-Semantic List Structure';
  }
  
  if (issue.id === 'url-design') {
    return 'URL Design Issue';
  }
  
  return issue.id.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}