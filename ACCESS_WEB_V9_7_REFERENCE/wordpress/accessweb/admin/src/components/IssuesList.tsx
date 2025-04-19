import React, { useState } from 'react';
import { ChevronDown, ChevronUp, AlertTriangle, CheckCircle } from 'lucide-react';

interface Issue {
  id: string;
  type: 'error' | 'warning' | 'notice';
  message: string;
  code: string;
  selector?: string;
  impact: 'critical' | 'serious' | 'moderate' | 'minor';
  wcagCriteria: string[];
  autoFixable: boolean;
  fixSuggestion?: string;
}

interface IssuesListProps {
  issues: Issue[];
}

export function IssuesList({ issues }: IssuesListProps) {
  const [expandedIssue, setExpandedIssue] = useState<string | null>(null);

  const getImpactColor = (impact: Issue['impact']) => {
    switch (impact) {
      case 'critical':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'serious':
        return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'moderate':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'minor':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const handleApplyFix = async (issueId: string) => {
    try {
      const response = await fetch(
        `${accesswebAdmin.ajaxUrl}?action=accessweb_apply_fix&nonce=${accesswebAdmin.nonce}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ issueId })
        }
      );
      
      if (!response.ok) {
        throw new Error('Failed to apply fix');
      }

      const data = await response.json();
      if (data.success) {
        // Refresh the page to show updated content
        window.location.reload();
      } else {
        throw new Error(data.message || 'Failed to apply fix');
      }
    } catch (err) {
      console.error('Error applying fix:', err);
    }
  };

  return (
    <div className="space-y-4">
      {issues.map((issue) => (
        <div
          key={issue.id}
          className={`border rounded-lg overflow-hidden ${getImpactColor(issue.impact)}`}
        >
          <div
            className="p-4 cursor-pointer"
            onClick={() => setExpandedIssue(expandedIssue === issue.id ? null : issue.id)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                {issue.type === 'error' ? (
                  <AlertTriangle className="w-5 h-5 mr-2" />
                ) : (
                  <CheckCircle className="w-5 h-5 mr-2" />
                )}
                <h3 className="font-medium">{issue.message}</h3>
              </div>
              {expandedIssue === issue.id ? (
                <ChevronUp className="w-5 h-5" />
              ) : (
                <ChevronDown className="w-5 h-5" />
              )}
            </div>
          </div>

          {expandedIssue === issue.id && (
            <div className="px-4 pb-4">
              <div className="mt-4 space-y-4">
                {issue.selector && (
                  <div>
                    <h4 className="text-sm font-medium mb-1">Affected Element</h4>
                    <code className="block p-2 bg-white/50 rounded text-sm font-mono">
                      {issue.selector}
                    </code>
                  </div>
                )}

                <div>
                  <h4 className="text-sm font-medium mb-1">WCAG Criteria</h4>
                  <div className="flex flex-wrap gap-2">
                    {issue.wcagCriteria.map((criteria) => (
                      <span
                        key={criteria}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-white/50"
                      >
                        {criteria}
                      </span>
                    ))}
                  </div>
                </div>

                {issue.fixSuggestion && (
                  <div>
                    <h4 className="text-sm font-medium mb-1">Suggested Fix</h4>
                    <p className="text-sm">{issue.fixSuggestion}</p>
                  </div>
                )}

                {issue.autoFixable && (
                  <div className="mt-4">
                    <button
                      onClick={() => handleApplyFix(issue.id)}
                      className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Apply Fix
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}