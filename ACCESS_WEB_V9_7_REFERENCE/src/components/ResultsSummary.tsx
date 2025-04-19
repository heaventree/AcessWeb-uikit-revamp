
import { AlertTriangle, AlertOctagon, AlertCircle, Info, CheckCircle, AlertCircle as Warning, FileText, Headphones, Video, MonitorSmartphone } from 'lucide-react';
import type { TestResult } from '../types';

interface ResultsSummaryProps {
  results: TestResult;
}

export function ResultsSummary({ results }: ResultsSummaryProps) {
  const { summary } = results;
  const hasPDFIssues = summary.pdfIssues && summary.pdfIssues > 0;
  const hasDocumentIssues = summary.documentIssues && summary.documentIssues > 0;
  const hasMediaIssues = summary.mediaIssues && summary.mediaIssues > 0;
  const hasAudioIssues = summary.audioIssues && summary.audioIssues > 0;
  const hasVideoIssues = summary.videoIssues && summary.videoIssues > 0;
  
  // Calculate total issues for screen reader announcement
  const totalIssues = (summary.critical || 0) + (summary.serious || 0) + 
                     (summary.moderate || 0) + (summary.minor || 0);

  return (
    <section 
      aria-labelledby="results-summary-heading"
      className="mb-6"
    >
      <h2 id="results-summary-heading" className="sr-only">
        Accessibility Test Results Summary - {totalIssues} total issues found
      </h2>
      
      {/* This visually hidden paragraph provides a complete summary for screen readers */}
      <div className="sr-only" aria-live="polite">
        Results summary: 
        {(summary.critical || 0) > 0 && ` ${summary.critical} critical issues,`}
        {(summary.serious || 0) > 0 && ` ${summary.serious} serious issues,`}
        {(summary.moderate || 0) > 0 && ` ${summary.moderate} moderate issues,`}
        {(summary.minor || 0) > 0 && ` ${summary.minor} minor issues,`}
        {(summary.warnings || 0) > 0 && ` ${summary.warnings} warnings,`}
        {(summary.passes || 0) > 0 && ` ${summary.passes} passed checks.`}
        {(summary.pdfIssues || 0) > 0 && ` ${summary.pdfIssues} PDF document issues.`}
        {(summary.documentIssues || 0) > 0 && ` ${summary.documentIssues} document issues.`}
        {(summary.mediaIssues || 0) > 0 && ` ${summary.mediaIssues} media issues.`}
        {(summary.audioIssues || 0) > 0 && ` ${summary.audioIssues} audio issues.`}
        {(summary.videoIssues || 0) > 0 && ` ${summary.videoIssues} video issues.`}
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div 
          className="bg-red-50 p-3 rounded-lg"
          role="region"
          aria-labelledby="critical-issues-heading"
        >
          <div className="flex items-center">
            <AlertOctagon className="w-5 h-5 text-red-600 mr-2" aria-hidden="true" />
            <h3 id="critical-issues-heading" className="text-red-800 text-sm font-semibold">Critical</h3>
          </div>
          <p className="text-xl font-bold text-red-600 mt-1" aria-label={`${summary.critical} critical issues`}>{summary.critical}</p>
        </div>
        
        <div 
          className="bg-orange-50 p-3 rounded-lg"
          role="region"
          aria-labelledby="serious-issues-heading"
        >
          <div className="flex items-center">
            <AlertTriangle className="w-5 h-5 text-orange-600 mr-2" aria-hidden="true" />
            <h3 id="serious-issues-heading" className="text-orange-800 text-sm font-semibold">Serious</h3>
          </div>
          <p className="text-xl font-bold text-orange-600 mt-1" aria-label={`${summary.serious} serious issues`}>{summary.serious}</p>
        </div>
        
        <div 
          className="bg-yellow-50 p-3 rounded-lg"
          role="region"
          aria-labelledby="moderate-issues-heading"
        >
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 text-yellow-600 mr-2" aria-hidden="true" />
            <h3 id="moderate-issues-heading" className="text-yellow-800 text-sm font-semibold">Moderate</h3>
          </div>
          <p className="text-xl font-bold text-yellow-600 mt-1" aria-label={`${summary.moderate} moderate issues`}>{summary.moderate}</p>
        </div>
        
        <div 
          className="bg-blue-50 p-3 rounded-lg"
          role="region"
          aria-labelledby="minor-issues-heading"
        >
          <div className="flex items-center">
            <Info className="w-5 h-5 text-blue-600 mr-2" aria-hidden="true" />
            <h3 id="minor-issues-heading" className="text-blue-800 text-sm font-semibold">Minor</h3>
          </div>
          <p className="text-xl font-bold text-blue-600 mt-1" aria-label={`${summary.minor} minor issues`}>{summary.minor}</p>
        </div>

        <div 
          className="bg-emerald-50 p-3 rounded-lg"
          role="region"
          aria-labelledby="passed-checks-heading"
        >
          <div className="flex items-center">
            <CheckCircle className="w-5 h-5 text-emerald-600 mr-2" aria-hidden="true" />
            <h3 id="passed-checks-heading" className="text-emerald-800 text-sm font-semibold">Passed</h3>
          </div>
          <p className="text-xl font-bold text-emerald-600 mt-1" aria-label={`${summary.passes} passed checks`}>{summary.passes}</p>
        </div>

        <div 
          className="bg-amber-50 p-3 rounded-lg"
          role="region"
          aria-labelledby="warnings-heading"
        >
          <div className="flex items-center">
            <Warning className="w-5 h-5 text-amber-600 mr-2" aria-hidden="true" />
            <h3 id="warnings-heading" className="text-amber-800 text-sm font-semibold">Warnings</h3>
          </div>
          <p className="text-xl font-bold text-amber-600 mt-1" aria-label={`${summary.warnings} warnings`}>{summary.warnings}</p>
        </div>
        
        {hasPDFIssues && (
          <div 
            className="bg-purple-50 p-3 rounded-lg sm:col-span-3 lg:col-span-2"
            role="region"
            aria-labelledby="pdf-issues-heading"
          >
            <div className="flex items-center">
              <FileText className="w-5 h-5 text-purple-600 mr-2" aria-hidden="true" />
              <h3 id="pdf-issues-heading" className="text-purple-800 text-sm font-semibold">PDF Issues</h3>
            </div>
            <p className="text-xl font-bold text-purple-600 mt-1" aria-label={`${summary.pdfIssues} PDF issues`}>{summary.pdfIssues}</p>
            <p className="text-xs text-purple-600 mt-1">
              Issues with document structure, tags, or reading order
            </p>
          </div>
        )}
        
        {hasDocumentIssues && !hasPDFIssues && (
          <div 
            className="bg-purple-50 p-3 rounded-lg sm:col-span-3 lg:col-span-2"
            role="region"
            aria-labelledby="document-issues-heading"
          >
            <div className="flex items-center">
              <FileText className="w-5 h-5 text-purple-600 mr-2" aria-hidden="true" />
              <h3 id="document-issues-heading" className="text-purple-800 text-sm font-semibold">Document Issues</h3>
            </div>
            <p className="text-xl font-bold text-purple-600 mt-1" aria-label={`${summary.documentIssues} document issues`}>{summary.documentIssues}</p>
            <p className="text-xs text-purple-600 mt-1">
              Issues with documents across all formats
            </p>
          </div>
        )}
        
        {hasMediaIssues && (
          <div 
            className="bg-indigo-50 p-3 rounded-lg sm:col-span-3 lg:col-span-2"
            role="region"
            aria-labelledby="media-issues-heading"
          >
            <div className="flex items-center">
              <MonitorSmartphone className="w-5 h-5 text-indigo-600 mr-2" aria-hidden="true" />
              <h3 id="media-issues-heading" className="text-indigo-800 text-sm font-semibold">Media Issues</h3>
            </div>
            <p className="text-xl font-bold text-indigo-600 mt-1" aria-label={`${summary.mediaIssues} media issues`}>{summary.mediaIssues}</p>
            <p className="text-xs text-indigo-600 mt-1">
              Issues with audio, video, and embedded media
            </p>
            <div className="mt-2 grid grid-cols-2 gap-2">
              {hasAudioIssues && (
                <div 
                  className="bg-indigo-100 p-2 rounded-md"
                  role="region" 
                  aria-labelledby="audio-issues-heading"
                >
                  <div className="flex items-center">
                    <Headphones className="w-4 h-4 text-indigo-700 mr-1" aria-hidden="true" />
                    <span id="audio-issues-heading" className="text-xs font-medium text-indigo-700">
                      Audio: <span aria-label={`${summary.audioIssues} audio issues`}>{summary.audioIssues}</span>
                    </span>
                  </div>
                </div>
              )}
              {hasVideoIssues && (
                <div 
                  className="bg-indigo-100 p-2 rounded-md"
                  role="region" 
                  aria-labelledby="video-issues-heading"
                >
                  <div className="flex items-center">
                    <Video className="w-4 h-4 text-indigo-700 mr-1" aria-hidden="true" />
                    <span id="video-issues-heading" className="text-xs font-medium text-indigo-700">
                      Video: <span aria-label={`${summary.videoIssues} video issues`}>{summary.videoIssues}</span>
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}