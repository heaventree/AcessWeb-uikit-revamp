import React from 'react';
import { AlertTriangle, CheckCircle, Code, FileText, Download } from 'lucide-react';
import type { ScanResult } from '../../types/integrations';
import { IssuesList } from '../IssuesList';
import { Link } from 'react-router-dom';

interface ShopifyScanResultsProps {
  result: ScanResult;
  onApplyFix: (issueId: string) => Promise<void>;
  onExport: () => void;
}

export function ShopifyScanResults({ result, onApplyFix, onExport }: ShopifyScanResultsProps) {
  const criticalIssues = result.issues.filter(i => i.impact === 'critical');
  const seriousIssues = result.issues.filter(i => i.impact === 'serious');
  const moderateIssues = result.issues.filter(i => i.impact === 'moderate');
  const minorIssues = result.issues.filter(i => i.impact === 'minor');

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-3 bg-red-100 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500">Critical</p>
              <p className="text-2xl font-bold text-gray-900">{criticalIssues.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-3 bg-orange-100 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500">Serious</p>
              <p className="text-2xl font-bold text-gray-900">{seriousIssues.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500">Moderate</p>
              <p className="text-2xl font-bold text-gray-900">{moderateIssues.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500">Minor</p>
              <p className="text-2xl font-bold text-gray-900">{minorIssues.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">
            Scan completed {new Date(result.timestamp).toLocaleString()}
          </span>
          {result.score >= 90 && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              <CheckCircle className="w-4 h-4 mr-1" />
              WCAG Compliant
            </span>
          )}
        </div>
        <div className="flex space-x-4">
          <button
            onClick={onExport}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </button>
        </div>
      </div>

      {/* Issues List */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">Issues Found</h3>
            <div className="flex items-center space-x-2">
              <Code className="w-5 h-5 text-gray-400" />
              <span className="text-sm text-gray-500">Auto-fix available</span>
            </div>
          </div>
        </div>
        <div className="p-4">
          <IssuesList issues={result.issues} onApplyFix={onApplyFix} />
        </div>
      </div>

      {/* Documentation */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center mb-4">
          <FileText className="w-6 h-6 text-blue-600" />
          <h3 className="ml-2 text-lg font-medium text-gray-900">
            Documentation & Resources
          </h3>
        </div>
        <div className="prose prose-sm max-w-none">
          <p>
            Review our documentation to learn more about fixing common accessibility issues
            in your Shopify theme:
          </p>
          <ul>
            <li>
              <Link to="/wcag-resources" className="text-blue-600 hover:text-blue-700">
                Understanding WCAG Requirements
              </Link>
            </li>
            <li>
              <Link to="/docs/shopify" className="text-blue-600 hover:text-blue-700">
                Shopify Theme Accessibility Guide
              </Link>
            </li>
            <li>
              <Link to="/docs/shopify#theme-analysis" className="text-blue-600 hover:text-blue-700">
                Common Accessibility Issues & Solutions
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}