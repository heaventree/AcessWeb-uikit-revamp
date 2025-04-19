import { useState } from 'react';
import {
  ChevronDown,
  ChevronUp,
  Smartphone,
  Code,
  Layout,
  Type,
  Image,
  Move,
  RotateCcw,
  Zap
} from 'lucide-react';
import type { AccessibilityIssue } from '../types';
import { AIRecommendations } from './AIRecommendations';
import { fixEngine } from '../lib/accessibility-fixes';

interface ResponsiveAnalysisPanelProps {
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
  // Viewport and meta issues
  if (issue.id.includes('viewport') || issue.structureDetails?.elementType === 'meta') {
    return 'bg-purple-50 dark:bg-purple-900/10';
  }
  
  // Touch target issues
  if (issue.id.includes('touch-target') || 
      issue.wcagCriteria.includes('2.5.5') || 
      issue.wcagCriteria.includes('2.5.8') ||
      issue.structureDetails?.elementType === 'touch-target') {
    return 'bg-orange-50 dark:bg-orange-900/10';
  }
  
  // Text and font size issues
  if (issue.id.includes('font-size') || 
      issue.id.includes('text') || 
      issue.wcagCriteria.includes('1.4.4') ||
      issue.structureDetails?.elementType === 'font-size' ||
      issue.wcagCriteria.includes('1.4.12')) {
    return 'bg-blue-50 dark:bg-blue-900/10';
  }
  
  // Layout, orientation, and reflow issues
  if (issue.id.includes('reflow') || 
      issue.id.includes('orientation') || 
      issue.wcagCriteria.includes('1.4.10') ||
      issue.wcagCriteria.includes('1.3.4')) {
    return 'bg-green-50 dark:bg-green-900/10';
  }
  
  // Image issues
  if (issue.id.includes('image') || issue.structureDetails?.elementType === 'image') {
    return 'bg-amber-50 dark:bg-amber-900/10';
  }
  
  // CSS and media query issues
  if (issue.id.includes('media-queries') || issue.structureDetails?.elementType === 'css') {
    return 'bg-red-50 dark:bg-red-900/10';
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

export function ResponsiveAnalysisPanel({ issues }: ResponsiveAnalysisPanelProps) {
  const [expandedIssues, setExpandedIssues] = useState<Set<string>>(new Set());

  // Filter for responsive-specific issues
  const responsiveIssues = issues.filter(issue =>
    issue.structureType === 'responsive' ||
    issue.id.includes('viewport') ||
    issue.id.includes('touch-target') ||
    issue.id.includes('reflow') ||
    issue.id.includes('font-size') ||
    issue.id.includes('responsive') ||
    issue.id.includes('orientation') ||
    issue.wcagCriteria.some(criteria => 
      criteria === '1.4.10' || 
      criteria === '1.4.4' || 
      criteria === '2.5.5' || 
      criteria === '2.5.8' || 
      criteria === '1.3.4' || 
      criteria === '1.4.12'
    )
  );

  // Categorize issues for better organization
  const viewportIssues = responsiveIssues.filter(issue =>
    issue.id.includes('viewport') ||
    issue.structureDetails?.elementType === 'meta'
  );

  const touchTargetIssues = responsiveIssues.filter(issue =>
    issue.id.includes('touch-target') ||
    issue.wcagCriteria.includes('2.5.5') ||
    issue.wcagCriteria.includes('2.5.8') ||
    issue.structureDetails?.elementType === 'touch-target'
  );

  const textSizeIssues = responsiveIssues.filter(issue =>
    issue.id.includes('font-size') ||
    issue.id.includes('text') ||
    issue.wcagCriteria.includes('1.4.4') ||
    issue.wcagCriteria.includes('1.4.12') ||
    issue.structureDetails?.elementType === 'font-size'
  );

  const layoutIssues = responsiveIssues.filter(issue =>
    issue.id.includes('reflow') ||
    issue.id.includes('orientation') ||
    issue.wcagCriteria.includes('1.4.10') ||
    issue.wcagCriteria.includes('1.3.4')
  );

  const imageIssues = responsiveIssues.filter(issue =>
    issue.id.includes('image') ||
    issue.structureDetails?.elementType === 'image'
  );

  const cssIssues = responsiveIssues.filter(issue =>
    issue.id.includes('media-queries') ||
    issue.structureDetails?.elementType === 'css'
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

  if (responsiveIssues.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6 dark:bg-gray-800">
        <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          Mobile & Responsive Design Analysis
        </h2>
        <div className="flex flex-col items-center justify-center text-center p-8">
          <Smartphone className="h-12 w-12 text-gray-400 mb-3" />
          <p className="text-gray-600 dark:text-gray-300 mb-1">
            No responsive design issues were detected.
          </p>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            The page appears to be well-designed for various screen sizes and devices.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow dark:bg-gray-800">
      <div className="p-6">
        <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          Mobile & Responsive Design Analysis
        </h2>

        <div className="mb-4 text-sm">
          <p className="text-gray-600 dark:text-gray-300 mb-2">
            This analysis examines how well the page adapts to different screen sizes and devices, particularly focusing on WCAG requirements for mobile accessibility.
          </p>
          <div className="grid grid-cols-2 gap-4 mt-3 mb-6 md:grid-cols-3 lg:grid-cols-6">
            <ResponsiveCounter
              count={viewportIssues.length}
              label="Viewport Issues"
              icon={<Layout className="h-5 w-5 mr-2 text-purple-600" />}
            />
            <ResponsiveCounter
              count={touchTargetIssues.length}
              label="Touch Target Issues"
              icon={<Move className="h-5 w-5 mr-2 text-orange-600" />}
            />
            <ResponsiveCounter
              count={textSizeIssues.length}
              label="Text Size Issues"
              icon={<Type className="h-5 w-5 mr-2 text-blue-600" />}
            />
            <ResponsiveCounter
              count={layoutIssues.length}
              label="Layout Issues"
              icon={<RotateCcw className="h-5 w-5 mr-2 text-green-600" />}
            />
            <ResponsiveCounter
              count={imageIssues.length}
              label="Image Issues"
              icon={<Image className="h-5 w-5 mr-2 text-amber-600" />}
            />
            <ResponsiveCounter
              count={cssIssues.length}
              label="CSS Issues"
              icon={<Code className="h-5 w-5 mr-2 text-red-600" />}
            />
          </div>
        </div>

        <div className="space-y-4">
          {responsiveIssues.map(issue => (
            <div key={issue.id + responsiveIssues.indexOf(issue)} className="border rounded-lg overflow-hidden dark:border-gray-700">
              <div
                className={`p-4 flex justify-between items-center cursor-pointer ${getSubtleBackgroundColor(issue)}`}
                onClick={() => toggleIssue(issue.id + responsiveIssues.indexOf(issue))}
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
                  {expandedIssues.has(issue.id + responsiveIssues.indexOf(issue)) ? (
                    <ChevronUp className="h-5 w-5" />
                  ) : (
                    <ChevronDown className="h-5 w-5" />
                  )}
                </div>
              </div>

              {expandedIssues.has(issue.id + responsiveIssues.indexOf(issue)) && (
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
                        Suggested Implementation
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
                                { name: 'outline', value: '2px solid #38b2ac' },
                                { name: 'position', value: 'relative' }
                              ],
                              wcagCriteria: issue.wcagCriteria || ['1.4.10'],
                              description: `Responsive fix for ${issue.id}: ${issue.description}`,
                              createdAt: new Date().toISOString(),
                              metadata: {
                                fixType: 'responsive',
                                deviceType: issue.id.includes('mobile') ? 'mobile' : 'all',
                                property: issue.id.includes('touch-target') ? 'touchTarget' : 
                                          issue.id.includes('font-size') ? 'fontSize' : 
                                          issue.id.includes('viewport') ? 'viewport' : 'general',
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

interface ResponsiveCounterProps {
  count: number;
  label: string;
  icon: React.ReactNode;
}

function ResponsiveCounter({ count, label, icon }: ResponsiveCounterProps) {
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
  // Viewport and meta issues
  if (issue.id.includes('viewport') || issue.structureDetails?.elementType === 'meta') {
    return <Layout className="h-5 w-5 mr-3 text-purple-600" />;
  }
  
  // Touch target issues
  if (issue.id.includes('touch-target') || 
      issue.wcagCriteria.includes('2.5.5') || 
      issue.wcagCriteria.includes('2.5.8') ||
      issue.structureDetails?.elementType === 'touch-target') {
    return <Move className="h-5 w-5 mr-3 text-orange-600" />;
  }
  
  // Text and font size issues
  if (issue.id.includes('font-size') || 
      issue.id.includes('text') || 
      issue.wcagCriteria.includes('1.4.4') ||
      issue.structureDetails?.elementType === 'font-size' ||
      issue.wcagCriteria.includes('1.4.12')) {
    return <Type className="h-5 w-5 mr-3 text-blue-600" />;
  }
  
  // Layout, orientation, and reflow issues
  if (issue.id.includes('reflow') || 
      issue.id.includes('orientation') || 
      issue.wcagCriteria.includes('1.4.10') ||
      issue.wcagCriteria.includes('1.3.4')) {
    return <RotateCcw className="h-5 w-5 mr-3 text-green-600" />;
  }
  
  // Image issues
  if (issue.id.includes('image') || issue.structureDetails?.elementType === 'image') {
    return <Image className="h-5 w-5 mr-3 text-amber-600" />;
  }
  
  // CSS and media query issues
  if (issue.id.includes('media-queries') || issue.structureDetails?.elementType === 'css') {
    return <Code className="h-5 w-5 mr-3 text-red-600" />;
  }
  
  // Default icon for other responsive issues
  return <Smartphone className="h-5 w-5 mr-3 text-gray-500" />;
}

function getIssueTitle(issue: AccessibilityIssue): string {
  if (issue.id === 'missing-viewport-meta') {
    return 'Missing Viewport Meta Tag';
  }
  
  if (issue.id === 'improper-viewport-configuration') {
    return 'Improper Viewport Configuration';
  }
  
  if (issue.id === 'disabled-zoom') {
    return 'Zoom Disabled (Critical)';
  }
  
  if (issue.id === 'critical-touch-target-size') {
    return 'Touch Targets Too Small (AA)';
  }
  
  if (issue.id === 'moderate-touch-target-size') {
    return 'Touch Targets Below Recommended Size (AAA)';
  }
  
  if (issue.id === 'large-non-responsive-images' || issue.id === 'non-responsive-images') {
    return 'Non-Responsive Images';
  }
  
  if (issue.id === 'small-base-font-size') {
    return 'Base Font Size Too Small';
  }
  
  if (issue.id === 'too-small-text') {
    return 'Text Size Too Small';
  }
  
  if (issue.id === 'no-media-queries' || issue.id === 'no-mobile-media-queries') {
    return 'Missing Media Queries';
  }
  
  if (issue.id === 'orientation-restriction') {
    return 'Orientation Restriction';
  }
  
  if (issue.id === 'text-spacing-issues') {
    return 'Text Spacing Issues';
  }
  
  if (issue.id === 'reflow-issues') {
    return 'Content Reflow Issues';
  }
  
  // Format any other IDs into a proper title
  return issue.id.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}