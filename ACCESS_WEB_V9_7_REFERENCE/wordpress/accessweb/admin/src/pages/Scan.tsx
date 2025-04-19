import React, { useState } from 'react';
import { Scan as ScanIcon, AlertTriangle, CheckCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { IssuesList } from '../components/IssuesList';

interface ScanResult {
  id: string;
  url: string;
  status: 'completed' | 'in_progress' | 'failed';
  issues: {
    critical: number;
    serious: number;
    moderate: number;
    minor: number;
  };
  details: any[];
}

export function Scan() {
  const [scanning, setScanning] = useState(false);
  const [results, setResults] = useState<ScanResult | null>(null);

  const startScan = async () => {
    setScanning(true);
    try {
      const response = await fetch(
        `${accesswebAdmin.ajaxUrl}?action=accessweb_start_scan&nonce=${accesswebAdmin.nonce}`
      );
      
      if (!response.ok) {
        throw new Error('Failed to start scan');
      }

      const data = await response.json();
      if (data.success) {
        pollResults(data.data.scan_id);
      } else {
        throw new Error(data.message || 'Failed to start scan');
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'An error occurred');
      setScanning(false);
    }
  };

  const pollResults = async (scanId: string) => {
    try {
      const response = await fetch(
        `${accesswebAdmin.ajaxUrl}?action=accessweb_get_results&scan_id=${scanId}&nonce=${accesswebAdmin.nonce}`
      );
      
      if (!response.ok) {
        throw new Error('Failed to get scan results');
      }

      const data = await response.json();
      if (data.success) {
        if (data.data.status === 'completed' || data.data.status === 'failed') {
          setResults(data.data);
          setScanning(false);
        } else {
          // Continue polling
          setTimeout(() => pollResults(scanId), 2000);
        }
      } else {
        throw new Error(data.message || 'Failed to get scan results');
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'An error occurred');
      setScanning(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Accessibility Scan
        </h1>
        <p className="text-gray-600 mb-6">
          Run a comprehensive WCAG accessibility scan of your website
        </p>
        <button
          onClick={startScan}
          disabled={scanning}
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
        >
          {scanning ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-3"></div>
              Scanning...
            </>
          ) : (
            <>
              <ScanIcon className="w-5 h-5 mr-2" />
              Start Scan
            </>
          )}
        </button>
      </div>

      {results && (
        <div className="space-y-6">
          <div className={`p-4 rounded-lg ${
            results.status === 'completed'
              ? 'bg-green-50 border border-green-200'
              : 'bg-red-50 border border-red-200'
          }`}>
            <div className="flex items-center">
              {results.status === 'completed' ? (
                <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-red-500 mr-2" />
              )}
              <h2 className="text-lg font-medium">
                {results.status === 'completed' ? 'Scan Complete' : 'Scan Failed'}
              </h2>
            </div>
          </div>

          {results.status === 'completed' && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <p className="text-sm text-gray-500">Critical Issues</p>
                  <p className="text-2xl font-bold text-red-600">
                    {results.issues.critical}
                  </p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <p className="text-sm text-gray-500">Serious Issues</p>
                  <p className="text-2xl font-bold text-orange-600">
                    {results.issues.serious}
                  </p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <p className="text-sm text-gray-500">Moderate Issues</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {results.issues.moderate}
                  </p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <p className="text-sm text-gray-500">Minor Issues</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {results.issues.minor}
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm">
                <div className="p-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium">Detailed Results</h3>
                </div>
                <div className="p-4">
                  <IssuesList issues={results.details} />
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}