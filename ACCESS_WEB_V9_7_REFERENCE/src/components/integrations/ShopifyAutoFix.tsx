import React, { useState } from 'react';
import { Zap, AlertTriangle, CheckCircle, RefreshCw, FileCode, Eye } from 'lucide-react';
import { toast } from 'react-hot-toast';
import type { ShopifySettings, Issue } from '../../types/integrations';
import { shopifyAPI } from '../../lib/integrations/shopify';

interface ShopifyAutoFixProps {
  settings: ShopifySettings;
  issues: Issue[];
  onFixApplied: () => void;
}

export function ShopifyAutoFix({ settings, issues, onFixApplied }: ShopifyAutoFixProps) {
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [applying, setApplying] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  const autoFixableIssues = issues.filter(issue => issue.autoFixable);
  const manualIssues = issues.filter(issue => !issue.autoFixable);

  const handleApplyFix = async (issue: Issue) => {
    setApplying(true);
    try {
      const response = await shopifyAPI.applyAutoFixes(settings, issue.id);
      if (response.success) {
        toast.success('Fix applied successfully');
        onFixApplied();
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to apply fix');
    } finally {
      setApplying(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Auto-fixable Issues */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Zap className="w-5 h-5 text-yellow-500" />
              <h3 className="ml-2 text-lg font-medium text-gray-900">
                Auto-fixable Issues ({autoFixableIssues.length})
              </h3>
            </div>
            {autoFixableIssues.length > 0 && (
              <button
                onClick={() => handleApplyFix({ id: 'all' } as Issue)}
                disabled={applying}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-yellow-500 hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 disabled:opacity-50"
              >
                {applying ? (
                  <>
                    <RefreshCw className="animate-spin -ml-1 mr-2 h-5 w-5" />
                    Applying Fixes...
                  </>
                ) : (
                  <>
                    <Zap className="-ml-1 mr-2 h-5 w-5" />
                    Fix All Issues
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        <div className="divide-y divide-gray-200">
          {autoFixableIssues.map((issue) => (
            <div key={issue.id} className="p-4 hover:bg-gray-50">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">{issue.message}</h4>
                  <p className="mt-1 text-sm text-gray-500">{issue.code}</p>
                </div>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => setSelectedIssue(selectedIssue?.id === issue.id ? null : issue)}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <Eye className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleApplyFix(issue)}
                    disabled={applying}
                    className="inline-flex items-center px-3 py-1.5 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                  >
                    <Zap className="-ml-1 mr-1 h-4 w-4" />
                    Fix Issue
                  </button>
                </div>
              </div>

              {selectedIssue?.id === issue.id && (
                <div className="mt-4 space-y-4">
                  {issue.selector && (
                    <div>
                      <h5 className="text-sm font-medium text-gray-700">Affected Element</h5>
                      <pre className="mt-1 p-2 bg-gray-50 rounded-md text-sm font-mono overflow-x-auto">
                        {issue.selector}
                      </pre>
                    </div>
                  )}
                  {issue.fixSuggestion && (
                    <div>
                      <h5 className="text-sm font-medium text-gray-700">Fix Preview</h5>
                      <pre className="mt-1 p-2 bg-gray-50 rounded-md text-sm font-mono overflow-x-auto">
                        {issue.fixSuggestion}
                      </pre>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}

          {autoFixableIssues.length === 0 && (
            <div className="p-8 text-center">
              <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No Auto-fixable Issues</h3>
              <p className="mt-1 text-sm text-gray-500">
                All auto-fixable issues have been resolved
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Manual Fix Issues */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center">
            <FileCode className="w-5 h-5 text-gray-400" />
            <h3 className="ml-2 text-lg font-medium text-gray-900">
              Manual Fixes Required ({manualIssues.length})
            </h3>
          </div>
        </div>

        <div className="divide-y divide-gray-200">
          {manualIssues.map((issue) => (
            <div key={issue.id} className="p-4 hover:bg-gray-50">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">{issue.message}</h4>
                  <p className="mt-1 text-sm text-gray-500">{issue.code}</p>
                </div>
                <button
                  onClick={() => setSelectedIssue(selectedIssue?.id === issue.id ? null : issue)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <Eye className="w-5 h-5" />
                </button>
              </div>

              {selectedIssue?.id === issue.id && (
                <div className="mt-4 space-y-4">
                  {issue.selector && (
                    <div>
                      <h5 className="text-sm font-medium text-gray-700">Affected Element</h5>
                      <pre className="mt-1 p-2 bg-gray-50 rounded-md text-sm font-mono overflow-x-auto">
                        {issue.selector}
                      </pre>
                    </div>
                  )}
                  {issue.fixSuggestion && (
                    <div>
                      <h5 className="text-sm font-medium text-gray-700">Suggested Fix</h5>
                      <pre className="mt-1 p-2 bg-gray-50 rounded-md text-sm font-mono overflow-x-auto">
                        {issue.fixSuggestion}
                      </pre>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}

          {manualIssues.length === 0 && (
            <div className="p-8 text-center">
              <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No Manual Fixes Required</h3>
              <p className="mt-1 text-sm text-gray-500">
                All issues can be fixed automatically
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}