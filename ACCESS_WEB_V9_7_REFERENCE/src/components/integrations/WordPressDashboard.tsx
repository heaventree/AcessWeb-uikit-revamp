import React, { useState, useEffect } from 'react';
import { 
  BarChart,
  CheckCircle,
  AlertTriangle,
  Clock,
  RefreshCw,
  Globe,
  Settings
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { wordPressAPI } from '../../lib/integrations/wordpress';
import type { WordPressSettings, ScanResult } from '../../types/integrations';

interface WordPressDashboardProps {
  settings: WordPressSettings;
}

export function WordPressDashboard({ settings }: WordPressDashboardProps) {
  const [loading, setLoading] = useState(true);
  const [scanning, setScanning] = useState(false);
  const [lastScan, setLastScan] = useState<ScanResult | null>(null);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    loadLastScan();
  }, []);

  const loadLastScan = async () => {
    try {
      // TODO: Implement last scan fetching
      setLoading(false);
    } catch (error) {
      toast.error('Failed to load scan results');
      setLoading(false);
    }
  };

  const startScan = async () => {
    setScanning(true);
    try {
      const result = await wordPressAPI.startScan(settings.apiKey, window.location.origin);
      if (result.success) {
        toast.success('Scan started successfully');
        // Poll for results
        pollScanResults(result.data.scanId);
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to start scan');
      setScanning(false);
    }
  };

  const pollScanResults = async (scanId: string) => {
    try {
      const results = await wordPressAPI.getScanResults(scanId);
      if (results) {
        setLastScan(results);
        setScanning(false);
        toast.success('Scan completed');
      } else {
        // Continue polling
        setTimeout(() => pollScanResults(scanId), 2000);
      }
    } catch (error) {
      toast.error('Failed to get scan results');
      setScanning(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="content-container">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            WordPress Integration
          </h1>
          <p className="text-lg text-gray-600">
            Monitor and improve your WordPress site's accessibility
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Globe className="w-6 h-6 text-blue-600" />
              <div className="ml-3">
                <h2 className="text-lg font-medium text-gray-900">
                  Site Status
                </h2>
                <p className="text-sm text-gray-500">
                  Plugin Version: 1.0.0
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowSettings(true)}
              className="p-2 text-gray-400 hover:text-gray-500"
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <BarChart className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Issues</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {lastScan?.issues.length || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Auto-Fixed</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {/* TODO: Add auto-fix count */}
                  0
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-3 bg-red-100 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Critical Issues</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {lastScan?.issues.filter(i => i.impact === 'critical').length || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Clock className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Last Scan</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {lastScan ? new Date(lastScan.timestamp).toLocaleDateString() : 'Never'}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-medium text-gray-900">Latest Scan Results</h3>
            <button
              onClick={startScan}
              disabled={scanning}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {scanning ? (
                <>
                  <RefreshCw className="animate-spin -ml-1 mr-2 h-5 w-5" />
                  Scanning...
                </>
              ) : (
                'Start New Scan'
              )}
            </button>
          </div>

          {lastScan ? (
            <div>
              {/* TODO: Add scan results display */}
              <p>Scan results will be displayed here</p>
            </div>
          ) : (
            <div className="text-center py-12">
              <Globe className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No scans yet</h3>
              <p className="mt-1 text-sm text-gray-500">
                Start your first scan to get accessibility insights
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}