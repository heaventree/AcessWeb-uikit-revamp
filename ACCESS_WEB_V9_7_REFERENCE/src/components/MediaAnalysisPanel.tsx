import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Video, Headphones, ExternalLink, Info, CheckCircle, AlertTriangle } from 'lucide-react';
import type { AccessibilityIssue } from '../types';
import { AIRecommendations } from './AIRecommendations';

interface MediaAnalysisPanelProps {
  issues: AccessibilityIssue[];
}

export function MediaAnalysisPanel({ issues }: MediaAnalysisPanelProps) {
  const [expandedIssue, setExpandedIssue] = useState<string | null>(null);

  const toggleIssue = (id: string) => {
    setExpandedIssue(expandedIssue === id ? null : id);
  };

  // Group issues by media type for better organization
  const videoIssues = issues.filter(issue => issue.mediaType === 'video');
  const audioIssues = issues.filter(issue => issue.mediaType === 'audio');
  const embeddedIssues = issues.filter(issue => issue.mediaType === 'embedded');
  
  const hasIssues = issues.length > 0;
  
  const getStatusBadge = (impact: string) => {
    switch (impact) {
      case 'critical':
        return (
          <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-red-100 text-red-800">
            Critical
          </span>
        );
      case 'serious':
        return (
          <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-amber-100 text-amber-800">
            Needs Attention
          </span>
        );
      case 'moderate':
        return (
          <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
            Review
          </span>
        );
      case 'minor':
        return (
          <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
            Consider
          </span>
        );
      default:
        return null;
    }
  };
  
  const renderMediaIssues = (mediaIssues: AccessibilityIssue[], title: string, icon: React.ReactNode) => {
    if (mediaIssues.length === 0) return null;
    
    return (
      <div className="mb-6">
        <h3 className="flex items-center text-lg font-medium text-gray-900 mb-3">
          {icon}
          <span className="ml-2">{title}</span>
          <span className="ml-2 text-sm text-gray-500">({mediaIssues.length})</span>
        </h3>
        
        <div className="space-y-4">
          {mediaIssues.map(issue => (
            <div 
              key={issue.id}
              className={`border rounded-lg overflow-hidden ${
                issue.impact === 'critical' ? 'border-red-200 bg-red-50' :
                issue.impact === 'serious' ? 'border-amber-200 bg-amber-50' :
                issue.impact === 'moderate' ? 'border-blue-200 bg-blue-50' :
                'border-gray-200 bg-gray-50'
              }`}
            >
              <button
                onClick={() => toggleIssue(issue.id)}
                className="w-full flex justify-between items-center p-4 text-left"
              >
                <div className="flex items-start">
                  {issue.impact === 'critical' || issue.impact === 'serious' ? (
                    <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 mr-3 flex-shrink-0" />
                  ) : (
                    <Info className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
                  )}
                  <div>
                    <div className="flex items-center">
                      <h4 className="font-medium text-gray-900">{issue.description}</h4>
                      <div className="ml-3">
                        {getStatusBadge(issue.impact)}
                      </div>
                    </div>
                    {issue.wcagCriteria?.length > 0 && (
                      <p className="mt-1 text-sm text-gray-600">
                        WCAG: {issue.wcagCriteria.join(', ')}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex-shrink-0 ml-4">
                  <svg
                    className={`w-5 h-5 transition-transform duration-200 ${
                      expandedIssue === issue.id ? 'transform rotate-180' : ''
                    }`}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </button>
              
              {expandedIssue === issue.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="px-4 pb-4"
                >
                  <div className="pt-2 border-t border-gray-200 mt-2">
                    <div className="mt-3 space-y-3">
                      {issue.nodes && issue.nodes.length > 0 && (
                        <div>
                          <h5 className="text-sm font-medium text-gray-700 mb-1">Element</h5>
                          <pre className="bg-gray-800 text-gray-100 p-3 rounded-md text-xs overflow-x-auto">
                            {issue.nodes[0]}
                          </pre>
                        </div>
                      )}
                      
                      {issue.helpUrl && (
                        <div className="flex items-center text-blue-600 hover:text-blue-800">
                          <ExternalLink className="w-4 h-4 mr-2" />
                          <a
                            href={issue.helpUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm hover:underline"
                          >
                            Learn more about this issue
                          </a>
                        </div>
                      )}
                      
                      <AIRecommendations issue={issue} />
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <div className="mr-3 w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
            <Video className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Media Accessibility Analysis</h2>
            <p className="text-sm text-gray-600 mt-1">
              Evaluates audio and video elements for WCAG compliance
            </p>
          </div>
        </div>
        
        {!hasIssues && (
          <div className="flex items-center text-green-600">
            <CheckCircle className="w-5 h-5 mr-2" />
            <span className="font-medium">All tests passed</span>
          </div>
        )}
      </div>
      
      {hasIssues ? (
        <div>
          {renderMediaIssues(videoIssues, 'Video Issues', <Video className="w-5 h-5 text-blue-600" />)}
          {renderMediaIssues(audioIssues, 'Audio Issues', <Headphones className="w-5 h-5 text-blue-600" />)}
          {renderMediaIssues(embeddedIssues, 'Embedded Media Issues', <ExternalLink className="w-5 h-5 text-blue-600" />)}
        </div>
      ) : (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex">
            <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 mr-3" />
            <div>
              <h3 className="font-medium text-green-800">No media accessibility issues detected</h3>
              <p className="mt-1 text-sm text-green-700">
                All audio and video elements on this page appear to be accessible.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}